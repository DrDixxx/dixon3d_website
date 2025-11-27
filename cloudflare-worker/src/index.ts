import { makeRef, normalizeName, json } from "./lib/utils";
import { verifyTurnstile } from "./lib/turnstile";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_FILES = 10;
const ALLOWED_EXTENSIONS = [
  ".stl",
  ".step",
  ".iges",
  ".igs",
  ".obj",
  ".3mf",
  ".pdf",
  ".zip",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
];

interface Env {
  R2_BUCKET: R2Bucket;
  DB: D1Database;
  TURNSTILE_SECRET: string;
  PUBLIC_BASE_URL?: string;
}

interface TicketRow {
  id: string;
  ref: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  qty: number | null;
  description: string | null;
  files_json: string | null;
  created_at: string | null;
  ip: string | null;
  ua: string | null;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/health") {
      console.log("route=health");
      return json({ ok: true, now: new Date().toISOString() });
    }

    if (pathname === "/intake" && request.method === "POST") {
      return handleIntake(request, env, ctx);
    }

    if (pathname.startsWith("/ticket/") && request.method === "GET") {
      const ref = pathname.split("/")[2];
      return handleTicket(ref, env);
    }

    if (pathname.startsWith("/download/") && request.method === "GET") {
      const parts = pathname.split("/");
      const ref = parts[2];
      const filename = decodeURIComponent(parts.slice(3).join("/"));
      return handleDownload(ref, filename, env);
    }

    return json({ ok: false, error: "not-found" }, 404);
  },
};

async function handleIntake(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const started = Date.now();
  console.log("route=intake start");
  const ref = makeRef();
  try {
    const form = await request.formData();
    const turnstileToken = form.get("cf-turnstile-response") as string | null;
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
    const ua = request.headers.get("user-agent");

    const turnstileResult = await verifyTurnstile(env, turnstileToken, ip);
    if (!turnstileResult.ok) {
      console.log("route=intake turnstile_failed", turnstileResult.errors);
      return withTrace(json({ ok: false, error: "turnstile_failed", details: turnstileResult.errors }, 400), ref);
    }

    const name = normalizeName(form.get("name") as string | null);
    const email = normalizeName(form.get("email") as string | null);
    const phone = normalizeName(form.get("phone") as string | null);
    const qtyRaw = form.get("qty") as string | null;
    const qty = qtyRaw ? Number(qtyRaw) : null;
    const description = normalizeName(form.get("description") as string | null);

    const files = form.getAll("files").filter((f) => f instanceof File) as File[];
    const id = crypto.randomUUID();
    console.log("route=intake ref", ref, "files", files.length);

    const validationError = validateFiles(files);
    if (validationError) {
      return withTrace(json({ ok: false, error: "validation", message: validationError }, 400), ref);
    }

    const storedFiles = await Promise.all(
      files.map(async (file) => {
        const filename = normalizeName(file.name) || "upload";
        const objectKey = `${ref}/${filename}`;
        const arrayBuffer = await file.arrayBuffer();
        await env.R2_BUCKET.put(objectKey, arrayBuffer, {
          httpMetadata: {
            contentType: file.type,
          },
        });
        console.log("route=intake uploaded", objectKey, "size", file.size);
        return { name: filename, size: file.size, type: file.type };
      })
    );

    const created_at = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO tickets (id, ref, name, email, phone, qty, description, files_json, created_at, ip, ua) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(id, ref, name || null, email || null, phone || null, qty, description || null, JSON.stringify(storedFiles), created_at, ip, ua)
      .run();

    const res = withTrace(json({ ok: true, ref }), ref);
    console.log("route=intake done", ref, "ms", Date.now() - started);
    return res;
  } catch (err) {
    console.error("route=intake error", err);
    return withTrace(json({ ok: false, error: "server_error" }, 500), ref);
  }
}

async function handleTicket(ref: string, env: Env): Promise<Response> {
  if (!ref) {
    return json({ ok: false, error: "missing-ref" }, 400);
  }
  console.log("route=ticket ref", ref);
  const row = await env.DB.prepare("SELECT * FROM tickets WHERE ref = ?").bind(ref).first<TicketRow>();
  if (!row) {
    return json({ ok: false, error: "not-found" }, 404);
  }
  const { ip, ua, ...rest } = row;
  return json({ ok: true, ticket: { ...rest, files: safeParseFiles(row.files_json) } });
}

async function handleDownload(ref: string, filename: string, env: Env): Promise<Response> {
  if (!ref || !filename) {
    return json({ ok: false, error: "missing-params" }, 400);
  }
  const key = `${ref}/${filename}`;
  console.log("route=download key", key);
  const head = await env.R2_BUCKET.head(key);
  if (!head) {
    return json({ ok: false, error: "not-found" }, 404);
  }

  if (typeof env.R2_BUCKET.createPresignedUrl === "function") {
    const url = await env.R2_BUCKET.createPresignedUrl({
      method: "GET",
      key,
      expiration: 60 * 10,
    });
    return new Response(null, {
      status: 307,
      headers: {
        location: url.toString(),
      },
    });
  }

  const obj = await env.R2_BUCKET.get(key);
  if (!obj) {
    return json({ ok: false, error: "not-found" }, 404);
  }
  return new Response(obj.body, {
    headers: {
      "content-type": obj.httpMetadata?.contentType || "application/octet-stream",
    },
  });
}

function safeParseFiles(value: string | null): unknown {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch (err) {
    console.error("parse files_json error", err);
    return [];
  }
}

function validateFiles(files: File[]): string | null {
  if (files.length > MAX_FILES) {
    return `Too many files (max ${MAX_FILES}).`;
  }
  for (const file of files) {
    const lower = file.name.toLowerCase();
    const ext = ALLOWED_EXTENSIONS.find((allow) => lower.endsWith(allow));
    if (!ext) {
      return `Unsupported file type: ${file.name}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${file.name} > 100MB`;
    }
  }
  return null;
}

function withTrace(res: Response, ref: string): Response {
  res.headers.set("X-Trace-Ref", ref);
  return res;
}

const LIVE_API = "https://api-m.paypal.com";
const SANDBOX_API = "https://api-m.sandbox.paypal.com";

const trim = (value) => (typeof value === "string" ? value.trim() : "");
const stripTrailingSlashes = (value) => value.replace(/\/+$/, "");

const resolveBase = () => {
  const explicit = stripTrailingSlashes(trim(process.env.PAYPAL_API_BASE || ""));
  if (explicit) return explicit;
  const env = trim(process.env.PAYPAL_ENV || "").toLowerCase();
  return env === "live" ? LIVE_API : SANDBOX_API;
};

const base = resolveBase();

const resolveMode = () => {
  const envMode = trim(process.env.PAYPAL_ENV || "").toLowerCase();
  if (base.includes("sandbox.paypal.com")) return "sandbox";
  if (base.includes("paypal.com")) return "live";
  return envMode === "live" ? "live" : "sandbox";
};

const mode = resolveMode();

const toValue = (value) => {
  const trimmed = trim(value);
  return trimmed ? trimmed : undefined;
};

const clientId = toValue(process.env.PAYPAL_ID);
const secret = toValue(process.env.PAYPAL_SECRET);

const diag = () => ({
  mode,
  base,
  clientIdSuffix: clientId ? clientId.slice(-6) : null,
});

const safeParse = (text) => {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch (_) {
    return text;
  }
};

const formatErrorMessage = (value) => {
  const described = describePayPalError(value);
  const parts = [];
  if (described.name) parts.push(described.name);
  if (described.message) parts.push(described.message);
  if (described.debug_id) parts.push(`debug_id=${described.debug_id}`);
  if (!parts.length && typeof value === "string") parts.push(value);
  return parts.join(" | ") || "Unknown PayPal error";
};

async function getAccessToken() {
  if (!clientId || !secret) {
    const missing = [];
    if (!clientId) missing.push("PAYPAL_ID");
    if (!secret) missing.push("PAYPAL_SECRET");
    const error = new Error(`Missing PayPal credentials: ${missing.join(" & ") || "unknown"}`);
    error.diag = diag();
    throw error;
  }

  const credentials = Buffer.from(`${clientId}:${secret}`, "utf8").toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "Accept-Language": "en_US",
    },
    body: "grant_type=client_credentials",
  });

  const text = await res.text();
  const payload = safeParse(text);

  if (!res.ok) {
    const error = new Error(`PayPal auth failed: ${formatErrorMessage(payload || res.statusText)}`);
    error.diag = diag();
    throw error;
  }

  if (!payload || typeof payload !== "object" || !payload.access_token) {
    const error = new Error("Missing access token in PayPal response");
    error.diag = diag();
    throw error;
  }

  return payload.access_token;
}

const round2 = (n) => Math.round(Number(n) * 100) / 100;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

function describePayPalError(input) {
  if (input instanceof Error) {
    return { message: input.message };
  }

  if (input == null) {
    return { message: "Unknown PayPal error" };
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return { message: "PayPal error with empty response" };
    const parsed = safeParse(trimmed);
    if (parsed && typeof parsed === "object") {
      return describePayPalError(parsed);
    }
    return { message: trimmed };
  }

  if (typeof input !== "object") {
    return { message: String(input) };
  }

  const firstDetail = Array.isArray(input.details)
    ? input.details.find((detail) => detail && typeof detail === "object")
    : undefined;

  const result = {
    name: input.name || null,
    message: input.message || input.error_description || null,
    debug_id: input.debug_id || null,
  };

  if (firstDetail) {
    result.issue = {
      issue: firstDetail.issue || null,
      message: firstDetail.description || firstDetail.message || null,
      field: firstDetail.field || null,
    };
  }

  if (!result.message) {
    try {
      result.message = JSON.stringify(input);
    } catch (_) {
      result.message = String(input);
    }
  }

  return result;
}

module.exports = {
  base,
  mode,
  clientId,
  secret,
  getAccessToken,
  round2,
  json,
  describePayPalError,
};

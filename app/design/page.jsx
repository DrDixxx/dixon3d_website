"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import INV from "../../lib/inventory.json";
const { MATERIALS, COLORS } = INV;

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

const EXAMPLES = [
  {
    title: "To Replace",
    landscape: true,
    images: [
      {
        src: "/assets/img/HuskeyWallMount-1.jpeg",
        alt: "Broken wall mount piece",
        caption: "Broken Wall Mount - To Replace",
      },
      {
        src: "/assets/img/HuskeyWallMount-2.jpeg",
        alt: "Attachment area for verification",
        caption: "Attachment Side For Feature Check",
      },
    ],
  },
  {
    title: "Mockup",
    images: [
      {
        src: "/assets/img/HuskeyWallMount_Drawing.png",
        alt: "Drawing of replacement wall mount",
        caption: "Drawing of Replacement for Dimensional Assurance",
      },
    ],
  },
  {
    title: "Final",
    images: [
      {
        src: "/assets/img/HuskyWallMount-Render.png",
        alt: "Render of finished wall mount",
        caption: "AI Enhanced Final Product - Material: ABS",
      },
    ],
  },
];

export default function DesignPage() {
  const router = useRouter();
  const turnstileContainer = useRef(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ref, setRef] = useState(null);

  const intakeEndpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_INTAKE_ENDPOINT || "https://api.sandbox.dixon3d.com/intake";
  }, []);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!turnstileSiteKey) return;
    if (typeof window === "undefined") return;
    const onLoad = () => {
      setTurnstileReady(true);
    };
    if (document.querySelector("script[data-turnstile]") || window.turnstile) {
      setTurnstileReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = "true";
    script.onload = onLoad;
    document.body.appendChild(script);
  }, [turnstileSiteKey]);

  useEffect(() => {
    if (!turnstileReady || !turnstileSiteKey || !turnstileContainer.current || !window.turnstile) return;
    const widgetId = window.turnstile.render(turnstileContainer.current, {
      sitekey: turnstileSiteKey,
      callback: (token) => setTurnstileToken(token),
      "error-callback": () => setTurnstileToken(null),
      "expired-callback": () => setTurnstileToken(null),
    });
    return () => {
      try {
        window.turnstile.remove(widgetId);
      } catch (err) {
        console.warn("turnstile cleanup", err);
      }
    };
  }, [turnstileReady, turnstileSiteKey]);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setFileError(null);

    if (!intakeEndpoint) {
      setError("Intake endpoint missing. Set NEXT_PUBLIC_INTAKE_ENDPOINT.");
      return;
    }
    if (!turnstileSiteKey) {
      setError("Turnstile site key missing. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData(form);
      const files = formData.getAll("files").filter((f) => f instanceof File);
      if (files.length > MAX_FILES) {
        setFileError(`Too many files (max ${MAX_FILES}).`);
        setSubmitting(false);
        return;
      }
      for (const file of files) {
        const lower = file.name.toLowerCase();
        const allowed = ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
        if (!allowed) {
          setFileError(`Unsupported file type: ${file.name}`);
          setSubmitting(false);
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          setFileError(`File too large: ${file.name} > 100MB`);
          setSubmitting(false);
          return;
        }
      }
      if (turnstileToken) {
        formData.set("cf-turnstile-response", turnstileToken);
      }
      const res = await fetch(intakeEndpoint, {
        method: "POST",
        body: formData,
      });
      const json = await res.json().catch(() => ({}));
      console.log("design intake →", res.status, json);
      if (res.ok && json?.ok && json.ref) {
        sessionStorage.setItem("lastDesignRef", json.ref);
        setRef(json.ref);
        setShowModal(true);
        form.reset();
        console.info("Design intake ref:", json.ref);
        return;
      }
      const code = json?.error || `HTTP_${res.status}`;
      const msg = json?.message || json?.details?.join?.(", ") || "Unknown error";
      const trace = json?.ref || json?.traceId || "n/a";
      setError(`Design request failed: ${code}. Ref ${trace}. ${msg}`);
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10 space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Design</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Consult & Design</h3><p className="mt-2 text-sm">We refine CAD, check tolerances, and plan for manufacturability.</p></article>
          <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Rapid Prototyping</h3><p className="mt-2 text-sm">Iterative prints in functional materials for quick testing.</p></article>
          <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Thermoforming & Casting</h3><p className="mt-2 text-sm">Patterns and tooling appropriate for forming/casting workflows.</p></article>
          <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">DFAM for 3-Axis CNC</h3><p className="mt-2 text-sm">Geometries that translate cleanly to machining.</p></article>
        </div>
      </section>

      <section className="rounded-3xl panel p-4 text-center">
        <div className="grid sm:grid-cols-3 gap-3 justify-items-center">
          {EXAMPLES.map(group => (
          <fieldset key={group.title} className="w-full rounded-2xl border border-white/20 p-2">
            <legend className="mx-auto px-2 text-xs text-slate-300">{group.title}</legend>
            <div className="grid gap-3">
              {group.images.map(img => (
                <div key={img.src} className="text-center space-y-1">
                    <figure
                      className={`relative overflow-hidden rounded-2xl bubble ${
                        group.landscape
                          ? group.images.length > 1
                            ? 'aspect-[2/1]'
                            : 'aspect-[16/9]'
                          : 'aspect-square'
                      }`}
                    >
                      <Image src={img.src} alt={img.alt} fill className="object-cover" />
                    </figure>
                    <div className="text-xs text-slate-300">{img.caption}</div>
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold">Design & Quote</h3>
        <p className="text-slate-200 mt-2">Tell us what you need. Attach CAD/mesh files if you have them.</p>

        <form
          id="quote-form"
          className="mt-6 space-y-6"
          onSubmit={onSubmit}
          encType="multipart/form-data"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Name</div>
              <input name="name" required className="w-full rounded-xl input-soft px-3 py-2 text-sm"/>
            </label>
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Email</div>
              <input name="email" type="email" required className="w-full rounded-xl input-soft px-3 py-2 text-sm"/>
            </label>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Material</div>
              <select name="material" className="w-full rounded-xl input-soft px-3 py-2 text-sm">
                {MATERIALS.map(m => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Color</div>
              <select name="color" className="w-full rounded-xl input-soft px-3 py-2 text-sm">
                {COLORS.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Quantity</div>
              <input
                name="qty"
                type="number"
                min="1"
                defaultValue="1"
                className="w-full rounded-xl input-soft px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Finish</div>
              <select name="finish" className="w-full rounded-xl input-soft px-3 py-2 text-sm">
                <option>As-printed</option><option>Sanded</option><option>Vapor smooth (ABS)</option><option>Primed & painted</option>
              </select>
            </label>
          </div>

          <label className="block">
            <div className="text-sm text-slate-300 mb-1">Notes / tolerances / use case</div>
            <textarea name="notes" rows="5" className="w-full rounded-xl input-soft px-3 py-2 text-sm"></textarea>
          </label>

          <div>
            <div className="text-sm font-medium text-slate-200">Files</div>
            <div className="mt-2 rounded-2xl border-2 border-dashed border-white/30 p-6 text-center text-slate-200">
              Drag & drop files here or
              <label className="ml-2 underline cursor-pointer">
                browse
                <input
                  id="file-input"
                  name="files"
                  type="file"
                  multiple
                  className="hidden"
                  accept=".stl,.step,.iges,.igs,.obj,.3mf,.pdf,.zip,.jpg,.jpeg,.png,.webp,.svg"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div ref={turnstileContainer} className="inline-block" />
            {!turnstileSiteKey && (
              <div className="text-sm text-red-200">
                Turnstile site key missing. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY.
              </div>
            )}
            {fileError && <div className="text-sm text-red-200">{fileError}</div>}
            {error && <div className="text-sm text-red-200">{error}</div>}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bubble px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </section>

      {showModal && ref && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-xl space-y-4">
            <h4 className="text-lg font-semibold">Request received</h4>
            <p className="text-sm text-slate-200">We emailed confirmation with your reference.</p>
            <div className="flex items-center justify-between rounded-xl bg-slate-800 px-3 py-2 font-mono text-sm">
              <span>{ref}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(ref)}
                className="rounded-lg bg-slate-700 px-3 py-1 text-xs font-semibold"
              >
                Copy
              </button>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-xl bubble px-4 py-2 text-sm font-semibold"
                onClick={() => {
                  setShowModal(false);
                  router.push(`/ticket/${ref}`);
                }}
              >
                View status
              </button>
              <button
                type="button"
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
            <div className="text-xs text-slate-400">Endpoint: {intakeEndpoint}</div>
          </div>
        </div>
      )}

      {/* Reviews – 4 bubbles, staggered */}
      <section className="rounded-3xl panel p-4">
        <h3 className="text-xl font-semibold mb-3">What clients say</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <article className="bubble rounded-2xl p-4">
            <div className="text-yellow-300">★★★★★</div>
            <p className="text-sm mt-1">“Fit great and slid like new!”</p>
            <div className="text-xs text-slate-300 mt-2">— Amy D.</div>
          </article>
          <article className="bubble rounded-2xl p-4 md:translate-y+1">
            <div className="text-yellow-300">★★★★★</div>
            <p className="text-sm mt-1">“Fun ideas and gave some quick turnaround.”</p>
            <div className="text-xs text-slate-300 mt-2">— Nate M.</div>
          </article>
          <article className="bubble rounded-2xl p-4 md:-translate-y-2">
            <div className="text-yellow-300">★★★★★</div>
            <p className="text-sm mt-1">“Perfect addition to the desk.”</p>
            <div className="text-xs text-slate-300 mt-2">— Mark M.</div>
          </article>
          <article className="bubble rounded-2xl p-4 md:translate-y+3">
            <div className="text-yellow-300">★★★★★</div>
            <p className="text-sm mt-1">“Clear communication on limitations and material choice.”</p>
            <div className="text-xs text-slate-300 mt-2">— Chelsey S.</div>
          </article>
        </div>
      </section>
    </div>
  );
}

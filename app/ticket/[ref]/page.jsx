"use client";

import { useEffect, useMemo, useState } from "react";

export default function TicketStatusPage({ params }) {
  const ref = decodeURIComponent(params.ref || "");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copyState, setCopyState] = useState(null);

  const intakeEndpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_INTAKE_ENDPOINT || "https://api.sandbox.dixon3d.com/intake";
  }, []);
  const baseUrl = useMemo(() => intakeEndpoint.replace(/\/intake$/, ""), [intakeEndpoint]);

  useEffect(() => {
    async function load() {
      if (!baseUrl) {
        setError("Intake endpoint missing. Set NEXT_PUBLIC_INTAKE_ENDPOINT.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${baseUrl}/ticket/${ref}`);
        const json = await res.json().catch(() => ({}));
        if (res.ok && json?.ok) {
          setTicket(json.ticket);
        } else {
          setError(json?.error || `Request failed (${res.status})`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [baseUrl, ref]);

  async function copyLink(filename) {
    setCopyState("loading" + filename);
    try {
      const res = await fetch(`${baseUrl}/download/${ref}/${encodeURIComponent(filename)}`, {
        redirect: "manual",
      });
      const location = res.headers.get("location") || (res.status === 200 ? res.url : null);
      if (!location && res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        await navigator.clipboard.writeText(blobUrl);
        setCopyState("copied" + filename);
        return;
      }
      if (location) {
        await navigator.clipboard.writeText(location);
        setCopyState("copied" + filename);
        return;
      }
      setCopyState("error" + filename);
    } catch (err) {
      console.error(err);
      setCopyState("error" + filename);
    }
  }

  if (!ref) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Ticket</h1>
        <p className="mt-2 text-red-200">Missing ticket reference.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-2xl font-semibold">Ticket {ref}</h1>
      {!intakeEndpoint && (
        <div className="rounded-xl bg-red-900/40 px-4 py-3 text-sm text-red-100">
          NEXT_PUBLIC_INTAKE_ENDPOINT not set.
        </div>
      )}
      {loading && <div className="text-slate-200">Loading...</div>}
      {error && <div className="text-red-200">{error}</div>}
      {ticket && (
        <div className="space-y-4 rounded-2xl border border-white/10 p-4 bg-slate-900/60">
          <div>
            <div className="text-sm text-slate-400">Name</div>
            <div className="text-slate-100">{ticket.name || "—"}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Email</div>
            <div className="text-slate-100">{ticket.email || "—"}</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-slate-400">Quantity</div>
              <div className="text-slate-100">{ticket.qty || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Created</div>
              <div className="text-slate-100">{ticket.created_at || "—"}</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Description</div>
            <p className="text-slate-100 whitespace-pre-wrap text-sm">{ticket.description || "—"}</p>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">Files</div>
            {ticket.files?.length ? (
              <div className="space-y-2">
                {ticket.files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between rounded-xl bg-slate-800/70 px-3 py-2 text-sm text-slate-100"
                  >
                    <div>
                      <div>{file.name}</div>
                      <div className="text-xs text-slate-400">{file.size} bytes</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyLink(file.name)}
                      className="rounded-lg bg-slate-700 px-3 py-1 text-xs font-semibold"
                    >
                      {copyState === "copied" + file.name
                        ? "Copied"
                        : copyState === "loading" + file.name
                        ? "Loading"
                        : "Get link"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-sm">No files attached.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

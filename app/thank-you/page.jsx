"use client";
import { useEffect, useState } from "react";

export default function ThankYou() {
  const [status, setStatus] = useState("Processing payment…");
  const [json, setJson] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) { setStatus("Missing token."); return; }
    (async () => {
      const res = await fetch("/api/paypal/capture?token=" + token);
      const data = await res.json();
      setJson(data);
      const ok =
        data?.status === "COMPLETED" ||
        data?.purchase_units?.[0]?.payments?.captures?.[0]?.status === "COMPLETED";
      setStatus(ok ? "Payment complete ✅" : "Payment error ❌");
      if (ok) localStorage.setItem("dixon3d_cart", "[]");
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10 space-y-6">
      <h1 className="text-3xl font-bold">{status}</h1>
      {json && (
        <pre className="text-xs bg-black/40 p-3 rounded-lg border border-white/20 overflow-auto">
{JSON.stringify(json, null, 2)}
        </pre>
      )}
      <a href="/shop" className="underline">Back to shop</a>
    </div>
  );
}

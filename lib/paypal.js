const LIVE_API = "https://api-m.paypal.com";
const SANDBOX_API = "https://api-m.sandbox.paypal.com";

const normalize = (value) => (typeof value === "string" ? value.trim() : undefined);

const resolvedBase = (() => {
  const explicit = normalize(process.env.PAYPAL_API_BASE);
  if (explicit) return explicit.replace(/\/+$/, "");
  const env = normalize(process.env.PAYPAL_ENV)?.toLowerCase();
  return env === "live" ? LIVE_API : SANDBOX_API;
})();

const clientId = normalize(process.env.PAYPAL_ID);
const secret = normalize(process.env.PAYPAL_SECRET);

async function getAccessToken() {
  if (!clientId || !secret) {
    throw new Error("Missing PayPal env vars (PAYPAL_ID / PAYPAL_SECRET)");
  }

  const credentials = Buffer.from(`${clientId}:${secret}`, "utf8").toString("base64");
  const res = await fetch(`${resolvedBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: "grant_type=client_credentials",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PayPal auth failed (${res.status}): ${text || res.statusText}`);
  }

  return JSON.parse(text).access_token;
}

const round2 = (n) => Math.round(Number(n) * 100) / 100;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

module.exports = {
  base: resolvedBase,
  clientId,
  secret,
  getAccessToken,
  round2,
  json,
};

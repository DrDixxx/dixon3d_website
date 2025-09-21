const LIVE_API = "https://api-m.paypal.com";
const SANDBOX_API = "https://api-m.sandbox.paypal.com";

const base = (() => {
  const explicitBase = process.env.PAYPAL_API_BASE?.trim();
  if (explicitBase) return explicitBase;
  const env = process.env.PAYPAL_ENV?.toLowerCase();
  return env === "live" ? LIVE_API : SANDBOX_API;
})();

const clientId = process.env.PAYPAL_ID;
const secret = process.env.PAYPAL_SECRET;

async function getAccessToken() {
  if (!clientId || !secret) {
    throw new Error("Missing PayPal env vars (PAYPAL_ID / PAYPAL_SECRET)");
  }

  const credentials = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
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

module.exports = { base, clientId, secret, getAccessToken, round2, json };

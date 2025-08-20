const base = "https://api-m.sandbox.paypal.com";
const id = process.env.NEXT_PUBLIC_PAYPAL_ID;
const secret = process.env.PAYPAL_SECRET;

async function getAccessToken() {
  if (!id || !secret) throw new Error("Missing PayPal env vars (NEXT_PUBLIC_PAYPAL_ID / PAYPAL_SECRET)");
  const creds = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`PayPal auth failed (${res.status}): ${text || res.statusText}`);
  return JSON.parse(text).access_token;
}

const round2 = (n) => Math.round(n * 100) / 100;
const json = (statusCode, body) => ({ statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

module.exports = { base, id, secret, getAccessToken, round2, json };

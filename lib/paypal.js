const LIVE_API = "https://api-m.paypal.com";
const SANDBOX_API = "https://api-m.sandbox.paypal.com";

const normalize = (value) => (typeof value === "string" ? value.trim() : undefined);

const stripTrailingSlashes = (value) => value.replace(/\/+$/, "");

const resolveBase = () => {
  const explicit = normalize(process.env.PAYPAL_API_BASE);
  if (explicit) return stripTrailingSlashes(explicit);
  const env = normalize(process.env.PAYPAL_ENV)?.toLowerCase();
  return env === "live" ? LIVE_API : SANDBOX_API;
};

const base = resolveBase();
const mode = base.includes("sandbox.paypal.com") ? "sandbox" : "live";

const pickEnv = (...keys) => {
  for (const key of keys) {
    if (!key) continue;
    const value = normalize(process.env[key]);
    if (value) return value;
  }
  return undefined;
};

const clientId = pickEnv(
  "PAYPAL_ID",
  "PAYPAL_CLIENT_ID",
  mode === "sandbox" ? "PAYPAL_SANDBOX_ID" : "PAYPAL_LIVE_ID"
);

const secret = pickEnv(
  "PAYPAL_SECRET",
  "PAYPAL_CLIENT_SECRET",
  mode === "sandbox" ? "PAYPAL_SANDBOX_SECRET" : "PAYPAL_LIVE_SECRET"
);

async function getAccessToken() {
  if (!clientId || !secret) {
    throw new Error("Missing PayPal env vars (PAYPAL_ID / PAYPAL_SECRET)");
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
  if (!res.ok) {
    throw new Error(`PayPal auth failed (${res.status} ${mode}): ${text || res.statusText}`);
  }

  return JSON.parse(text).access_token;
}

const round2 = (n) => Math.round(Number(n) * 100) / 100;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const describePayPalError = (err) => {
  if (!err) return "Unknown PayPal error";
  if (typeof err === "string") return err;
  if (typeof err === "number") return String(err);
  if (err.message && !Array.isArray(err.details)) return err.message;
  if (err.error_description) return err.error_description;
  if (err.name && err.message) return `${err.name}: ${err.message}`;
  if (Array.isArray(err.details) && err.details.length) {
    const detail = err.details[0];
    if (detail) {
      const parts = [detail.issue, detail.description || detail.message]
        .filter(Boolean)
        .join(": ");
      if (parts) return parts;
    }
  }
  try {
    return JSON.stringify(err);
  } catch (_) {
    return String(err);
  }
};

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

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

const clientId = normalize(process.env.PAYPAL_ID);
const secret = normalize(process.env.PAYPAL_SECRET);
const clientIdSuffix = clientId ? clientId.slice(-6) : undefined;

async function getAccessToken() {
  if (!clientId || !secret) {
    const missing = [];
    if (!clientId) missing.push("PAYPAL_ID");
    if (!secret) missing.push("PAYPAL_SECRET");
    throw new Error(
      `Missing PayPal credentials (${missing.join(" & ") || "unknown"}; mode=${mode}; clientIdSuffix=${clientIdSuffix || "none"})`
    );
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
    let payload;
    try {
      payload = text ? JSON.parse(text) : undefined;
    } catch (_) {}
    const message = describePayPalError(payload || text || res.statusText);
    throw new Error(
      `PayPal auth failed (${mode}; clientIdSuffix=${clientIdSuffix || "none"}): ${message}`
    );
  }

  try {
    const parsed = text ? JSON.parse(text) : {};
    if (!parsed.access_token) {
      throw new Error("Missing access token in PayPal response");
    }
    return parsed.access_token;
  } catch (_) {
    throw new Error(
      `Unable to parse PayPal auth response (${mode}; clientIdSuffix=${clientIdSuffix || "none"})`
    );
  }
}

const round2 = (n) => Math.round(Number(n) * 100) / 100;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const describePayPalError = (payloadOrText) => {
  if (payloadOrText == null) return "Unknown PayPal error";
  if (payloadOrText instanceof Error) return payloadOrText.message;

  let payload = payloadOrText;
  if (typeof payloadOrText === "string") {
    const trimmed = payloadOrText.trim();
    if (!trimmed) return "PayPal error with empty response";
    try {
      payload = JSON.parse(trimmed);
    } catch (_) {
      return trimmed;
    }
  }

  if (typeof payload === "number") return String(payload);
  if (typeof payload !== "object") return String(payload);

  const parts = [];
  if (payload.name) parts.push(payload.name);
  if (payload.message) parts.push(payload.message);
  if (payload.error_description) parts.push(payload.error_description);
  if (payload.debug_id) parts.push(`debug_id=${payload.debug_id}`);

  const details = Array.isArray(payload.details) ? payload.details : undefined;
  if (details && details.length) {
    const [firstDetail] = details;
    if (firstDetail && typeof firstDetail === "object") {
      const detailParts = [];
      if (firstDetail.issue) detailParts.push(firstDetail.issue);
      const detailMessage = firstDetail.description || firstDetail.message;
      if (detailMessage) detailParts.push(detailMessage);
      if (firstDetail.field) detailParts.push(`field=${firstDetail.field}`);
      if (firstDetail.value) detailParts.push(`value=${firstDetail.value}`);
      if (detailParts.length) parts.push(detailParts.join(": "));
    }
  }

  if (parts.length) return parts.join(" | ");

  try {
    return JSON.stringify(payload);
  } catch (_) {
    return String(payload);
  }
};

module.exports = {
  base,
  mode,
  clientId,
  clientIdSuffix,
  secret,
  getAccessToken,
  round2,
  json,
  describePayPalError,
};

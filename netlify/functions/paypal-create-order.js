// Allow switching between sandbox and live environments via PAYPAL_ENV
const mode = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
const BASE_URL =
  mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  // Pick credentials based on mode
  const id =
    mode === "live"
      ? process.env.PAYPAL_CLIENT_ID
      : process.env.PAYPAL_SANDBOX_CLIENT_ID;
  const secret =
    mode === "live"
      ? process.env.PAYPAL_CLIENT_SECRET || process.env.PAYPAL_SECRET
      : process.env.PAYPAL_SANDBOX_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("Missing PayPal credentials");
  }
  const creds = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`PayPal auth failed: ${msg}`);
  }
  const json = await res.json();
  return json.access_token;
}

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const amount = String(body.amount || "10.00");
    const currency = String(body.currency || "USD");

    const token = await getAccessToken();
    const site =
      process.env.URL || process.env.DEPLOY_URL || "http://localhost:3000";

    const payload = {
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: currency, value: amount } }],
      application_context: {
        return_url: `${site}/thank-you`,
        cancel_url: `${site}/shop`,
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW"
      }
    };

    const res = await fetch(`${BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const order = await res.json();
    const approve = (order.links || []).find((l) => l.rel === "approve")?.href;

    return {
      statusCode: res.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, approve })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: String(e) })
    };
  }
};

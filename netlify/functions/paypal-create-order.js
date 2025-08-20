const base = "https://api-m.sandbox.paypal.com"; // sandbox for testing
const id = process.env.NEXT_PUBLIC_PAYPAL_ID;     // client id is public by design
const secret = process.env.PAYPAL_SECRET;         // keep this private

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

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ envPresent: !!id && !!secret, mode: "sandbox" })
    };
  }
  try {
    const body = JSON.parse(event.body || "{}");
    const { amount = "10.00", currency = "USD" } = body;
    const token = await getAccessToken();
    const site = process.env.URL || process.env.DEPLOY_URL || "http://localhost:3000";

    const payload = {
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: currency, value: String(amount) } }],
      application_context: {
        return_url: `${site}/thank-you`,
        cancel_url: `${site}/shop`,
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW"
      }
    };

    const res = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const order = await res.json();
    const approve = (order.links || []).find(l => l.rel === "approve")?.href;

    return {
      statusCode: res.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(approve ? { id: order.id, approve } : { error: order })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: String(e) })
    };
  }
};


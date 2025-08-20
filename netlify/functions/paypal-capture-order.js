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

exports.handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const orderId = qs.token || qs.order_id;
    if (!orderId) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing order id" })
      };
    }

    const token = await getAccessToken();
    const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const capture = await res.json();
    return {
      statusCode: res.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(capture)
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: String(e) })
    };
  }
};


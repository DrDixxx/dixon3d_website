const BASE_URL = "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const id =
    process.env.PAYPAL_SANDBOX_CLIENT_ID || process.env.PAYPAL_CLIENT_ID;
  const secret =
    process.env.PAYPAL_SANDBOX_CLIENT_SECRET ||
    process.env.PAYPAL_CLIENT_SECRET ||
    process.env.PAYPAL_SECRET;
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
  if (!res.ok) throw new Error("PayPal auth failed");
  const json = await res.json();
  return json.access_token;
}

exports.handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const orderId = qs.token || qs.order_id;
    if (!orderId) {
      return { statusCode: 400, body: "Missing order id" };
    }

    const token = await getAccessToken();
    const res = await fetch(
      `${BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
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

const { base, getAccessToken, json } = require("../../lib/paypal");

exports.handler = async (event) => {
  try {
    const orderId =
      event.queryStringParameters?.order_id || event.queryStringParameters?.token;
    if (!orderId) return json(400, { error: "Missing order id" });

    const token = await getAccessToken();
    const res = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const body = await res.json();
    return json(res.status || 500, body);
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : String(e) });
  }
};

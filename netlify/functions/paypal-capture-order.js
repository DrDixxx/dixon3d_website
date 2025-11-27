const { base, getAccessToken, json } = require("../../lib/paypal");

exports.handler = async (event) => {
  try {
    const orderId =
      event.queryStringParameters?.token || event.queryStringParameters?.order_id;
    if (!orderId) return json(400, { error: "Missing order id" });

    const token = await getAccessToken();

    // 1) Fetch order (for visibility + sanity)
    let res = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const order = await res.json();
    if (!res.ok) {
      return json(res.status || 500, {
        error: order?.name || order?.message || "PayPal order lookup failed",
        debug_id: order?.debug_id,
        details: order,
      });
    }

    // 2) Capture order
    res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": orderId, // idempotency; ok to keep
      },
      body: "{}",
    });
    const capture = await res.json();
    if (!res.ok) {
      return json(res.status || 500, {
        error: capture?.name || capture?.message || "PayPal capture failed",
        debug_id: capture?.debug_id,
        details: capture,
      });
    }

    return json(200, capture);
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : String(e) });
  }
};

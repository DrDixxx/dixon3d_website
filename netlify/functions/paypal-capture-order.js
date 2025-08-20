const { base, getAccessToken, round2, json } = require("./paypal-utils");

exports.handler = async (event) => {
  try {
    const orderId = event.queryStringParameters?.token || event.queryStringParameters?.order_id;
    if (!orderId) return json(400, { error: "Missing order id" });

    const token = await getAccessToken();

    let res = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    let order = await res.json();
    if (!res.ok) return json(res.status, order);

    const pu = order.purchase_units?.[0] || {};
    const item_total = parseFloat(pu.amount?.breakdown?.item_total?.value || pu.amount?.value || "0");
    let tax_total = 0;
    const addr = pu.shipping?.address;
    if (addr) {
      const state = addr.admin_area_1;
      const country = addr.country_code;
      const rate = country === "US" && state === "CO" ? 0.029 : 0;
      tax_total = round2(item_total * rate);
      const path = pu.reference_id
        ? `/purchase_units/@reference_id=='${pu.reference_id}'/amount`
        : "/purchase_units/0/amount";
      const value = (item_total + tax_total).toFixed(2);
      const patchBody = [
        {
          op: "replace",
          path,
          value: {
            currency_code: "USD",
            value,
            breakdown: {
              item_total: { currency_code: "USD", value: item_total.toFixed(2) },
              tax_total: { currency_code: "USD", value: tax_total.toFixed(2) }
            }
          }
        }
      ];
      res = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(patchBody)
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`PayPal patch failed (${res.status}): ${txt}`);
      }
    }

    res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: "{}"
    });
    const capture = await res.json();
    return json(res.ok ? 200 : 500, capture);
  } catch (e) {
    return json(500, { error: String(e) });
  }
};

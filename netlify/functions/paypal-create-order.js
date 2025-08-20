const { base, getAccessToken, json, round2 } = require("./paypal-utils");
const { MATERIALS, COLORS } = require("../../lib/inventory.json");

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    return json(200, { envPresent: true, mode: "sandbox" });
  }
  try {
    const body = JSON.parse(event.body || "{}");
    const { currency = "USD", items = [] } = body;
    const token = await getAccessToken();
    const site = process.env.URL || process.env.DEPLOY_URL || "http://localhost:3000";

    const lineItems = items.map(i => {
      const material = MATERIALS.includes(i.material) ? i.material : MATERIALS[0];
      const color = COLORS.includes(i.color) ? i.color : COLORS[0];
      const finish = i.finish || "As-printed";
      const scale = i.scale ?? 100;
      const price = Number(i.price || 0);
      const qty = Number(i.qty || 1);
      const desc = `Color: ${color} • Material: ${material} • Fin: ${finish} • Scale: ${scale}%`.slice(0,127);
      const name = `${i.name} (${material}, ${color})`.slice(0,127);
      return {
        name,
        quantity: String(qty),
        unit_amount: { currency_code: currency, value: price.toFixed(2) },
        description: desc,
        category: "PHYSICAL_GOODS"
      };
    });

    const item_total = round2(lineItems.reduce((s, i) => s + Number(i.quantity) * Number(i.unit_amount.value), 0));

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: "default",
          items: lineItems,
          amount: {
            currency_code: currency,
            value: item_total.toFixed(2),
            breakdown: { item_total: { currency_code: currency, value: item_total.toFixed(2) } }
          }
        }
      ],
      application_context: {
        return_url: `${site}/thank-you`,
        cancel_url: `${site}/shop`,
        shipping_preference: "GET_FROM_FILE",
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
    const invoiceId = order.purchase_units?.[0]?.invoice_id;

    return json(res.ok ? 200 : 500, approve ? { id: order.id, approve, invoiceId } : { error: order });
  } catch (e) {
    return json(500, { error: String(e) });
  }
};

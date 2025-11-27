const { base, mode, clientId, getAccessToken, json, round2, describePayPalError } = require("../../lib/paypal");
const { MATERIALS, COLORS } = require("../../lib/inventory.json");

const readPayPalResponse = async (response) => {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch (_) {
    return text;
  }
};

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    return json(200, { envPresent: true, mode });
  }

  const clientIdSuffix = clientId ? clientId.slice(-6) : null;
  const defaultDiag = { mode, base, clientIdSuffix };

  // Create a unique invoice id up-front
  const invoiceId = `INV-${Date.now()}`;

  try {
    const body = JSON.parse(event.body || "{}");
    const { currency = "USD", items = [] } = body;

    const token = await getAccessToken();
    const site =
      process.env.URL ||
      process.env.DEPLOY_URL ||
      "http://localhost:3000";

    const lineItems = items.map((i) => {
      const material = MATERIALS.includes(i.material) ? i.material : MATERIALS[0];
      const color = COLORS.includes(i.color) ? i.color : COLORS[0];
      const finish = i.finish || "As-printed";
      const scale = i.scale ?? 100;
      const price = Number(i.price || 0);
      const qty = Number(i.qty || 1);

      const desc = `Color: ${color} | Material: ${material} | Fin: ${finish} | Scale: ${scale}%`.slice(0, 127);
      const name = `${i.name} (${material}, ${color})`.slice(0, 127);

      return {
        name,
        quantity: String(qty),
        unit_amount: { currency_code: currency, value: price.toFixed(2) },
        description: desc,
        category: "PHYSICAL_GOODS",
      };
    });

    const item_total = round2(
      lineItems.reduce(
        (sum, li) => sum + Number(li.quantity) * Number(li.unit_amount.value),
        0
      )
    );

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: "default",
          invoice_id: invoiceId,
          items: lineItems,
          amount: {
            currency_code: currency,
            value: item_total.toFixed(2),
            breakdown: {
              item_total: { currency_code: currency, value: item_total.toFixed(2) },
            },
          },
        },
      ],
      application_context: {
        return_url: `${site}/thank-you`,
        cancel_url: `${site}/shop`,
        shipping_preference: "GET_FROM_FILE",
        user_action: "PAY_NOW",
      },
    };

    const res = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const order = await readPayPalResponse(res);
    if (!res.ok) {
      return json(res.status || 500, {
        error: describePayPalError(order),
        diag: defaultDiag,
      });
    }

    if (!order || typeof order !== "object") {
      return json(500, {
        error: "Unexpected PayPal response",
        diag: defaultDiag,
      });
    }

    const approve = (order.links || []).find((l) => l.rel === "approve")?.href;
    if (!approve) {
      return json(500, {
        error: "PayPal order missing approval link",
        diag: defaultDiag,
      });
    }

    // Prefer PayPal's echoed invoice_id; fall back to ours
    const returnedInvoiceId =
      order.purchase_units?.[0]?.invoice_id || invoiceId;

    return json(200, {
      id: order.id,
      approve,
      invoiceId: returnedInvoiceId,
    });
  } catch (e) {
    const diag = e && typeof e === "object" && e.diag ? e.diag : defaultDiag;
    return json(500, {
      error: e instanceof Error ? e.message : String(e),
      diag,
    });
  }
};
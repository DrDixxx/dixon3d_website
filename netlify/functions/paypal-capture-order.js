const { base, mode, clientId, getAccessToken, round2, json, describePayPalError } = require("../../lib/paypal");

const safeParse = (text) => {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch (_) {
    return text;
  }
};

const readPayPalResponse = async (response) => {
  const text = await response.text();
  return safeParse(text);
};

exports.handler = async (event) => {
  const clientIdSuffix = clientId ? clientId.slice(-6) : null;
  const defaultDiag = { mode, base, clientIdSuffix };

  try {
    const orderId = event.queryStringParameters?.token || event.queryStringParameters?.order_id;
    if (!orderId) {
      return json(400, { error: "Missing order id", diag: defaultDiag });
    }

    const token = await getAccessToken();

    let res = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const orderPayload = await readPayPalResponse(res);
    if (!res.ok) {
      return json(res.status || 500, {
        error: describePayPalError(orderPayload),
        diag: defaultDiag,
      });
    }

    if (!orderPayload || typeof orderPayload !== "object") {
      return json(500, { error: "Unexpected PayPal response", diag: defaultDiag });
    }

    const order = orderPayload;
    const pu = order.purchase_units?.[0] || {};
    const item_total = parseFloat(
      pu.amount?.breakdown?.item_total?.value || pu.amount?.value || "0"
    );
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
              tax_total: { currency_code: "USD", value: tax_total.toFixed(2) },
            },
          },
        },
      ];
      res = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchBody),
      });
      if (!res.ok) {
        const payload = safeParse(await res.text());
        const described = describePayPalError(payload || res.statusText);
        const parts = [];
        if (described.name) parts.push(described.name);
        if (described.message) parts.push(described.message);
        if (described.debug_id) parts.push(`debug_id=${described.debug_id}`);
        if (described.issue?.issue) parts.push(`issue=${described.issue.issue}`);
        const summary =
          parts.join(" | ") ||
          (typeof payload === "string" ? payload : "Unknown PayPal error");
        const err = new Error(
          `PayPal patch failed (${res.status || "unknown"}): ${summary}`
        );
        err.diag = defaultDiag;
        if (payload && typeof payload === "object") {
          err.payload = payload;
        }
        throw err;
      }
    }

    res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    const capture = await readPayPalResponse(res);
    if (!res.ok) {
      return json(res.status || 500, {
        error: describePayPalError(capture),
        diag: defaultDiag,
      });
    }

    if (!capture || typeof capture !== "object") {
      return json(500, { error: "Unexpected PayPal response", diag: defaultDiag });
    }

    return json(200, capture);
  } catch (e) {
    const diag = e && typeof e === "object" && e.diag ? e.diag : defaultDiag;
    return json(500, { error: e instanceof Error ? e.message : String(e), diag });
  }
};
import { NextResponse } from "next/server";

const base = (env) =>
  env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const env = process.env.PAYPAL_ENV;
  const id =
    env === "live"
      ? process.env.PAYPAL_CLIENT_ID
      : process.env.PAYPAL_SANDBOX_CLIENT_ID;
  const secret =
    env === "live"
      ? process.env.PAYPAL_SECRET
      : process.env.PAYPAL_SANDBOX_CLIENT_SECRET;
  const creds = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(`${base(process.env.PAYPAL_ENV)}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("PayPal auth failed");
  const json = await res.json();
  return json.access_token;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("token") || searchParams.get("order_id");
    if (!orderId) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const token = await getAccessToken();
    const res = await fetch(
      `${base(process.env.PAYPAL_ENV)}/v2/checkout/orders/${orderId}/capture`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    const capture = await res.json();

    return NextResponse.json(capture, { status: res.ok ? 200 : 500 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

// Determine whether we're in live or sandbox mode
const mode = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
const BASE_URL =
  mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const id =
    mode === "live"
      ? process.env.PAYPAL_CLIENT_ID
      : process.env.PAYPAL_SANDBOX_CLIENT_ID;
  const secret =
    mode === "live"
      ? process.env.PAYPAL_SECRET
      : process.env.PAYPAL_SANDBOX_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("Missing PayPal credentials");
  }
  const creds = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
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
      `${BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    const capture = await res.json();

    return NextResponse.json(capture, { status: res.ok ? 200 : 500 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

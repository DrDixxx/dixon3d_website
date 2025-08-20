export const runtime = "nodejs";
import { NextResponse } from "next/server";

const BASE_URL = "https://api-m.sandbox.paypal.com";
const CLIENT_ID = process.env.PAYPAL_ID;
const CLIENT_SECRET = process.env.PAYPAL_SECRET;

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error("Missing PayPal env vars (PAYPAL_ID / PAYPAL_SECRET)");
  const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`PayPal auth failed (${res.status}): ${text}`);
  return JSON.parse(text).access_token;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("token") || searchParams.get("order_id");
    if (!orderId) return NextResponse.json({ error: "Missing order id" }, { status: 400 });

    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const capture = await res.json();
    return NextResponse.json(capture, { status: res.ok ? 200 : 500 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}


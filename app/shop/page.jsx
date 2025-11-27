"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import INV from "../../lib/inventory.json";
const { MATERIALS, COLORS } = INV;
const CART_KEY = "dixon3d_cart";
const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(2);

const PRODUCTS = [
  {
    id: "card",
    name: "Custom Business Cards (10x)",
    price: 5.0,
    material: "PLA",
    color: "Black",
    description: "Durable printed cards tailored to your brand.",
    images: ["/assets/img/BusinessCard_Printed.png"],
    customize: true,
    noMC: true,
  },
  {
    id: "chessboard",
    name: "Magnetic Puzzle Chessboard w/ Pieces",
    price: 40.0,
    material: "PLA",
    description: "Modular magnetic chessboard with puzzle-fit pieces.",
    images: [
      "/assets/img/Chessboard_Full.png",
      "/assets/img/Chessboard_Pieces.png",
    ],
  },
  {
    id: "insole",
    name: "Custom TPU Insole",
    price: 20.0,
    material: "TPU 95A",
    description: "Tailored insoles for comfort.",
  },
  {
    id: "planter",
    name: "Plant Pot - 1.5 gal",
    price: 12.5,
    material: "PLA",
    description: "Faceted planter for small succulents.",
    images: ["/assets/img/HalfGal_PlantHolder.png"],
  },
  {
    id: "pegboard",
    name: "Customizable Pegboard",
    price: 50.0,
    material: "ABS",
    color: "Black",
    description:
      "Pegboard kit with panel, holder, tool hooks and hardware.",
    images: [
      "/assets/img/PegBoard_Full.PNG",
      "/assets/img/PegBoard_Panel.png",
      "/assets/img/PegBoard_Holder.PNG",
      "/assets/img/PegBoard_Bolts.PNG",
      "/assets/img/PegBoard_ToolHolder.PNG",
    ],
  },
  {
    id: "enclosure",
    name: "Custom Sized Framing/Enclosure",
    price: null,
    material: "PLA",
    color: "Black",
    description: "Submit your dimensions for a tailored frame or enclosure.",
    images: [
      "/assets/img/Enclosure_Render.png",
      "/assets/img/Enclosure_Drawing.png",
    ],
    customize: true,
    noMC: true,
  },
];

export default function ShopPage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_ID; // set via env, sandbox for testing

  const formatPayPalError = (payload, fallback) => {
    const value = payload?.error ?? payload;
    if (!value) return fallback;
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (typeof value.error === "string") return value.error;
      if (value.error_description) return value.error_description;
      if (value.message) return value.message;
      if (Array.isArray(value.details) && value.details.length) {
        const combined = value.details
          .map((detail) => detail?.description || detail?.message || detail?.issue)
          .filter(Boolean)
          .join("; ");
        if (combined) return combined;
      }
    }
    try {
      return JSON.stringify(value);
    } catch (_) {
      return fallback;
    }
  };

  useEffect(() => { try { setCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);

  const shown = PRODUCTS.filter(p =>
    (p.name + " " + p.material).toLowerCase().includes(search.toLowerCase())
  );
  const subtotal = cart.reduce((s, p) => s + p.price * p.qty, 0);

  // Load PayPal script and render buttons with the appropriate client ID
  useEffect(() => {
    if (!paypalClientId) return;
    const scriptId = "paypal-js";
    const existing = document.getElementById(scriptId);
    const renderButtons = () => {
      if (!window.paypal) return;
      const container = document.getElementById("paypal-buttons");
      if (container) container.innerHTML = "";
      window.paypal
        .Buttons({
          style: { layout: "horizontal", height: 40, tagline: false },
          fundingSource: window.paypal.FUNDING.PAYPAL,
          createOrder: async () => {
            const res = await fetch("/api/paypal/create", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                currency: "USD",
                items: cart.map(i => ({
                  id: i.id,
                  name: i.name,
                  qty: i.qty,
                  price: i.price,
                  material: i.material,
                  color: i.color,
                  finish: i.finish ?? "As-printed",
                  scale: i.scale ?? 100
                }))
              })
            });
            const data = await res.json();
            if (!res.ok || !data.id) {
              const message = formatPayPalError(data, "Payment setup error");
              alert(message);
              throw new Error(message || "PayPal order creation failed");
            }
            return data.id;
          },
          onApprove: async (data) => {
            const res = await fetch(`/api/paypal/capture?token=${data.orderID}`);
            const capture = await res.json();
            const ok =
              capture?.status === "COMPLETED" ||
              capture?.purchase_units?.[0]?.payments?.captures?.[0]?.status === "COMPLETED";
            if (ok) {
              localStorage.setItem(CART_KEY, "[]");
              window.location.href = "/thank-you";
            } else {
              const message = formatPayPalError(capture, "Payment error");
              alert(message);
              throw new Error(message || "PayPal capture failed");
            }
          }
        })
        .render("#paypal-buttons");
    };
    if (existing) {
      renderButtons();
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&disable-funding=paylater`;
    script.onload = renderButtons;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [paypalClientId, subtotal, cart]);

  function ProductCard({ p }) {
    const [img, setImg] = useState(0);
    const imgs = p.images || [];
    return (
      <article className="rounded-2xl border border-white/20 bg-white/5 overflow-hidden text-slate-100">
        <div className="aspect-[4/3] relative">
          {imgs.length > 0 ? (
            <>
              <Image
                src={imgs[img]}
                alt={p.name}
                fill
                className="object-cover"
              />
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setImg((img - 1 + imgs.length) % imgs.length)
                    }
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white text-xs rounded-full w-6 h-6"
                    aria-label="Previous image"
                  >
                    â€¹
                  </button>
                  <button
                    onClick={() => setImg((img + 1) % imgs.length)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white text-xs rounded-full w-6 h-6"
                    aria-label="Next image"
                  >
                    â€º
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800/10 to-slate-700/10" />
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white">{p.name}</h3>
            <span className="text-sm text-slate-300">
              {p.price == null ? "Variable" : money(p.price)}
            </span>
          </div>
          {p.description && (
            <p className="text-xs text-slate-400 mt-1">{p.description}</p>
          )}
          <div className="mt-3 space-y-2">
            {p.customize ? (
              <>
                {!p.noMC && (
                  <div className="flex gap-2">
                    <select
                      disabled
                      defaultValue={p.material}
                      className="rounded-lg bubble-input px-2 py-1 text-xs opacity-50"
                    >
                      <option>{p.material}</option>
                    </select>
                    <select
                      disabled
                      defaultValue={p.color}
                      className="rounded-lg bubble-input px-2 py-1 text-xs opacity-50"
                    >
                      <option>{p.color}</option>
                    </select>
                  </div>
                )}
                <Link
                  href="/design#quote-form"
                  className="block text-center rounded-lg bubble px-3 py-1.5 text-xs font-semibold hover:brightness-110"
                >
                  Customize
                </Link>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <select
                    id={`mat-${p.id}`}
                    defaultValue={p.material}
                    className="rounded-lg bubble-input px-2 py-1 text-xs"
                  >
                    {MATERIALS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    id={`color-${p.id}`}
                    defaultValue={p.color || COLORS[0]}
                    className="rounded-lg bubble-input px-2 py-1 text-xs"
                  >
                    {COLORS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    id={`qty-${p.id}`}
                    className="w-16 rounded-lg bubble-input px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() =>
                      add(
                        p.id,
                        parseInt(
                          document.getElementById(`qty-${p.id}`).value || "1",
                          10
                        )
                      )
                    }
                    className="rounded-lg bubble px-3 py-1.5 text-xs font-semibold hover:brightness-110"
                  >
                    Add
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  function add(id, qty) {
    const p = PRODUCTS.find(x => x.id === id);
    const material = document.getElementById(`mat-${id}`)?.value || MATERIALS[0];
    const color = document.getElementById(`color-${id}`)?.value || COLORS[0];
    const key = `${id}|100|${material}|${color}|As-printed`;
    setCart((old) => {
      const i = old.findIndex(x => x.key === key);
      if (i >= 0) { const copy = [...old]; copy[i] = { ...copy[i], qty: copy[i].qty + qty }; return copy; }
      return [...old, { key, id, name: p.name, price: p.price, qty, scale: 100, material, color, finish: "As-printed" }];
    });
  }
  function updateQty(key, qty) { setCart(old => old.map(i => i.key === key ? { ...i, qty: Math.max(1, qty) } : i)); }
  function removeItem(key) { setCart(old => old.filter(i => i.key !== key)); }
  async function checkout() {
    try {
      const res = await fetch("/api/paypal/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          currency: "USD",
          items: cart.map(i => ({
            id: i.id,
            name: i.name,
            qty: i.qty,
            price: i.price,
            material: i.material,
            color: i.color,
            finish: i.finish ?? "As-printed",
            scale: i.scale ?? 100
          }))
        })
      });
      const data = await res.json();
      if (res.ok && data.approve) {
        const approveUrl = data.approve + (data.approve.includes("?") ? "&" : "?") + "disable-funding=paylater";
        window.location.href = approveUrl;
      } else {
        alert(formatPayPalError(data, "Payment error"));
      }
    } catch (e) {
      alert(String(e));
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10">
      <div className="md:flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Shop Items</h2>
          <p className="text-slate-200">Field-tested parts & accessories. Printed to order.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Searchâ€¦" className="w-56 rounded-xl input-soft px-3 py-2 text-sm"/>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      <section className="mt-10 rounded-2xl panel text-slate-100 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <div className="text-lg font-semibold">{money(subtotal)}</div>
        </div>
        <div className="divide-y divide-black/10 mt-3">
          {cart.length === 0 && <div className="text-slate-500 text-sm p-3">Your cart is empty.</div>}
          {cart.map(it => (
            <div key={it.key} className="py-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-100 ring-1 ring-black/10" />
              <div className="grow">
                <div className="font-medium">{it.name}</div>
                <div className="text-xs text-slate-500">{money(it.price)} â€¢ {it.color} â€¢ {it.material} â€¢ {it.scale}% â€¢ {it.finish}</div>
                <div className="mt-2 flex items-center gap-2">
                  <input type="number" min="1" value={it.qty}
                         onChange={(e)=>updateQty(it.key, parseInt(e.target.value||"1",10))}
                         className="w-16 rounded-lg bubble-input px-2 py-1 text-sm"/>
                  <button onClick={()=>removeItem(it.key)} className="text-xs text-slate-600 hover:text-black">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div id="paypal-buttons" className="mt-4" />
        <button onClick={checkout}
                className="mt-4 w-40 mx-auto block rounded-xl bubble px-4 py-2 text-sm font-semibold text-center hover:brightness-110">
          Checkout
        </button>
      </section>
    </div>
  );
}




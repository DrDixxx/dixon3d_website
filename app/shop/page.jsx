"use client";

import { useEffect, useMemo, useState } from "react";
const CART_KEY = "dixon3d_cart";
const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(2);

const PRODUCTS = [
  { id:"stand",  name:"Minimal Phone Stand",       price:12.00, material:"PETG",     category:"Desk"      },
  { id:"clip",   name:"Cable Clip Set (x6)",       price:8.50,  material:"PLA",      category:"Desk"      },
  { id:"insole", name:"Custom TPU Insole",         price:30.00, material:"TPU 95A",  category:"Wearables" },
  { id:"planter",name:"Geometric Planter (120mm)", price:18.00, material:"PLA",      category:"Home"      },
  { id:"mount",  name:"GoPro-style Mount",         price:14.00, material:"ABS",      category:"Outdoors"  },
  { id:"hook",   name:"Utility Wall Hook (pair)",  price:9.00,  material:"CF-Nylon", category:"Garage"    }
];

export default function ShopPage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const paypalEnv = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
  const paypalClientId =
    paypalEnv === "live"
      ? process.env.PAYPAL_CLIENT_ID
      : process.env.PAYPAL_SANDBOX_CLIENT_ID;

  useEffect(() => { try { setCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);

  const cats = useMemo(() => ["All", ...new Set(PRODUCTS.map(p => p.category))], []);
  const shown = PRODUCTS.filter(p =>
    (filter === "All" || p.category === filter) &&
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
          createOrder: async () => {
            const res = await fetch("/api/paypal/create", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ amount: subtotal.toFixed(2), currency: "USD" })
            });
            const data = await res.json();
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
              alert(capture?.error || "Payment error");
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
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}`;
    script.onload = renderButtons;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [paypalClientId, subtotal]);

  function add(id, qty) {
    const p = PRODUCTS.find(x => x.id === id);
    const key = id + "|100|" + p.material + "|As-printed";
    setCart((old) => {
      const i = old.findIndex(x => x.key === key);
      if (i >= 0) { const copy = [...old]; copy[i] = { ...copy[i], qty: copy[i].qty + qty }; return copy; }
      return [...old, { key, id, name: p.name, price: p.price, qty, scale: 100, material: p.material, finish: "As-printed" }];
    });
  }
  function updateQty(key, qty) { setCart(old => old.map(i => i.key === key ? { ...i, qty: Math.max(1, qty) } : i)); }
  function removeItem(key) { setCart(old => old.filter(i => i.key !== key)); }
  async function checkout() {
    try {
      const res = await fetch("/api/paypal/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: subtotal.toFixed(2), currency: "USD" })
      });
      const data = await res.json();
      if (data.approve) {
        window.location.href = data.approve;
      } else {
        alert(data.error || "Payment error");
      }
    } catch (e) {
      alert(String(e));
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10">
      <div className="md:flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Shop Prints</h2>
          <p className="text-slate-200">Field-tested parts & accessories. Printed to order.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Search…" className="w-56 rounded-xl input-soft px-3 py-2 text-sm"/>
          <select value={filter} onChange={e=>setFilter(e.target.value)}
                  className="rounded-xl input-soft px-3 py-2 text-sm">
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map(p => (
          <article key={p.id} className="rounded-2xl border border-white/20 bg-white/5 overflow-hidden text-slate-100">
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-800/10 to-slate-700/10 relative" />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-white">{p.name}</h3>
                <span className="text-sm text-slate-300">{money(p.price)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{p.material} • {p.category}</p>
              <div className="mt-3 flex items-center gap-2">
                <input type="number" min="1" defaultValue="1" id={`qty-${p.id}`}
                       className="w-16 rounded-lg bubble px-2 py-1 text-sm"/>
                <button onClick={() => add(p.id, parseInt(document.getElementById(`qty-${p.id}`).value || "1", 10))}
                        className="rounded-lg bubble px-3 py-1.5 text-xs font-semibold hover:brightness-110">
                  Add
                </button>
              </div>
            </div>
          </article>
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
                <div className="text-xs text-slate-500">{money(it.price)} • {it.material} • {it.scale}% • {it.finish}</div>
                <div className="mt-2 flex items-center gap-2">
                  <input type="number" min="1" value={it.qty}
                         onChange={(e)=>updateQty(it.key, parseInt(e.target.value||"1",10))}
                         className="w-16 rounded-lg bubble px-2 py-1 text-sm"/>
                  <button onClick={()=>removeItem(it.key)} className="text-xs text-slate-600 hover:text-black">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div id="paypal-buttons" className="mt-4" />
        <button onClick={checkout}
                className="mt-4 rounded-xl bubble px-4 py-2 text-sm font-semibold hover:brightness-110">
          Purchase
        </button>
      </section>
    </div>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const imgs = [
  { src: "/assets/img/DisplayCasting_Home.png", alt: "Casting pattern" },
  { src: "/assets/img/DisplayConnector_Home.png", alt: "Connector bracket" },
  { src: "/assets/img/DisplayParts_Home.png", alt: "Assorted parts" },
  { src: "/assets/img/DisplayThermoForm_Home.png", alt: "Thermoform pattern" }
];

export default function HomePage() {
  const [lb, setLb] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10 space-y-16">
      <section className="rounded-3xl border border-white/20 p-8 sm:p-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Precision additive manufacturing for real-world parts.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-200">
          Design, prototype, and produce—with a growing catalog of popular items.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/design" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-slate-800">Start a project</Link>
          <Link href="/shop" className="rounded-xl border border-white/25 text-white px-4 py-2 text-sm hover:bg-white/10">Shop prints</Link>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {imgs.map((im) => (
            <button key={im.src} className="relative overflow-hidden rounded-2xl group"
              onClick={() => setLb(im.src)}>
              <Image src={im.src} alt={im.alt} width={800} height={600} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/20 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <figure className="p-4 md:p-6 bg-white">
            <Image src="/assets/img/WindowSlide_Drawing.png" alt="Technical drawing – window attachment" width={1200} height={800} className="rounded-xl ring-1 ring-black/10" />
          </figure>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="text-sm text-slate-300">CAD spotlight</div>
            <h3 className="mt-2 text-2xl font-semibold text-white">Window attachment drawing</h3>
            <p className="mt-3 text-slate-200">Manufacturing drawing with multiple views and a clean title block.</p>
          </div>
        </div>
      </section>

      {lb && (
        <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4" onClick={() => setLb(null)}>
          <Image src={lb} alt="" width={1600} height={1200} className="max-w-full max-h-full rounded-xl ring-1 ring-white/30" />
        </div>
      )}
    </div>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const imgs = [
  { src: "/assets/DisplayCasting_Home.png", alt: "Casting pattern" },
  { src: "/assets/DisplayConnector_Home.png", alt: "Connector bracket" },
  { src: "/assets/DisplayParts_Home.png", alt: "Assorted parts" },
  { src: "/assets/DisplayThermoForm_Home.png", alt: "Thermoform pattern" }
];

export default function HomePage() {
  const [lb, setLb] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10 space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl panel-inverse p-8 sm:p-12">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Precision additive manufacturing for real-world parts.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-200">
            Design, prototype, and produce—with a growing catalog of popular items.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/design" className="rounded-xl bubble px-4 py-2 text-sm font-semibold">Start a project</Link>
            <Link href="/shop" className="rounded-xl bubble px-4 py-2 text-sm">Shop prints</Link>
          </div>
        </div>

        {/* decorative “screen” */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 sm:-right-20 sm:-bottom-16 rotate-12 opacity-70">
          <svg width="380" height="300" viewBox="0 0 380 300" className="drop-shadow-2xl">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="#0f172a" stopOpacity=".4"/>
                <stop offset="100%" stopColor="#64748b" stopOpacity=".2"/>
              </linearGradient>
            </defs>
            <rect x="20" y="30" width="340" height="240" rx="18" fill="url(#g)" />
            <rect x="40" y="50" width="300" height="170" rx="10" fill="#0a0a0a" opacity=".06" />
            <rect x="60" y="230" width="260" height="20" rx="6" fill="#0a0a0a" opacity=".08" />
            <rect x="200" y="70" width="60" height="12" rx="6" fill="#0a0a0a" opacity=".15" />
            <rect x="200" y="82" width="80" height="10" rx="5" fill="#0a0a0a" opacity=".1" />
          </svg>
        </div>
      </section>

      {/* FEATURED GALLERY */}
      <section className="rounded-3xl panel p-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {imgs.map((im) => (
            <button
              key={im.src}
              className="relative overflow-hidden rounded-2xl group aspect-[16/9]"
              onClick={() => setLb(im.src)}
              aria-label={`Open ${im.alt}`}
            >
              <Image
                src={im.src}
                alt={im.alt}
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
            </button>
          ))}
        </div>
      </section>

      {/* WHAT WE DO — Row 1 */}
      <section className="space-y-4">
        <h2 className="rounded-full bubble px-3 py-1 text-sm font-semibold w-fit">
          What we do
        </h2>
        <div className="rounded-3xl panel p-3">
          <div className="grid md:grid-cols-3 gap-3">
            <article className="card rounded-2xl p-5">
              <h3 className="text-lg font-semibold">Consult & Design</h3>
              <p className="mt-2 text-sm">
                Bring the idea; we refine CAD, check tolerances, and plan for real-world use and manufacturability.
              </p>
            </article>
            <article className="card rounded-2xl p-5">
              <h3 className="text-lg font-semibold">Rapid Prototyping</h3>
              <p className="mt-2 text-sm">
                Iterative prints in functional materials so you can test fit, ergonomics, and performance quickly.
              </p>
            </article>
            <article className="card rounded-2xl p-5">
              <h3 className="text-lg font-semibold">Thermoforming & Casting</h3>
              <p className="mt-2 text-sm">
                Patterns and tooling appropriate for forming and casting workflows—ideal for small runs and trials.
              </p>
            </article>
          </div>
        </div>

        {/* WHAT WE DO — Row 2 (includes Standard Tolerances) */}
        <div className="rounded-3xl panel p-3">
          <div className="grid md:grid-cols-3 gap-3">
            <article className="card rounded-2xl p-5">
              <h3 className="text-lg font-semibold">DFAM for 3-Axis CNC</h3>
              <p className="mt-2 text-sm">
                We simplify geometries, fixturing, and stock usage so parts translate cleanly to 3-axis machining.
              </p>
            </article>
            <article className="card rounded-2xl p-5">
              <h3 className="text-lg font-semibold">Standard Tolerances</h3>
              <p className="mt-2 text-sm">± 0.01–0.001 depending on technology.</p>
            </article>
            <article className="card rounded-2xl p-5">
              <h3 className="text-lg font-semibold">Popular Items</h3>
              <p className="mt-2 text-sm">
                A growing catalog of useful parts—customizable materials and sizes in the{" "}
                <Link href="/shop" className="underline">Shop</Link>.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CAD SPOTLIGHT */}
      <section className="rounded-3xl panel overflow-hidden">
        <div className="grid md:grid-cols-2">
          <figure className="p-4 md:p-6 bg-white">
            <Image
              src="/assets/WindowSlide_Drawing.png"
              alt="Technical drawing – window attachment"
              width={1200}
              height={800}
              className="rounded-xl ring-1 ring-black/10"
            />
          </figure>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="text-sm text-slate-300">CAD spotlight</div>
            <h3 className="mt-2 text-2xl font-semibold text-white">Window attachment drawing</h3>
            <p className="mt-3 text-slate-200">
              Manufacturing drawing with multiple views and a clean title block.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="rounded-3xl panel-inverse p-6 md:p-10">
        <div className="md:flex items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold text-white">Have files ready?</h3>
            <p className="text-slate-200">
              Drag-and-drop your CAD or scan files. We support most common formats.
            </p>
          </div>
          <Link
            href="/design"
            className="mt-4 md:mt-0 rounded-xl bubble px-4 py-2 text-sm font-semibold hover:brightness-110"
          >
            Request a quote
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lb && (
        <div
          className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4"
          onClick={() => setLb(null)}
        >
          <Image
            src={lb}
            alt=""
            width={1600}
            height={1200}
            className="max-w-full max-h-full rounded-xl ring-1 ring-white/30"
          />
        </div>
      )}
    </div>
  );
}

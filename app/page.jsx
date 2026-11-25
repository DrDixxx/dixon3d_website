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
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl panel-inverse p-8 sm:p-12">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Engineering design and prototyping for real-world problems.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-200">
            Dixon3D helps businesses and product developers turn technical requirements into practical CAD, functional prototypes, and manufacturing decisions.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/design" className="rounded-xl bubble px-4 py-2 text-sm font-semibold">Discuss a project</Link>
            <Link href="/portfolio" className="rounded-xl bubble px-4 py-2 text-sm">Our capabilities</Link>
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

      {/* ENGINEERING VALUE */}
      <section className="flex flex-wrap items-center justify-between gap-5 rounded-3xl panel p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">Engineering & development</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">From a technical challenge to a workable next step</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Mechanical design, functional prototyping, additive manufacturing and practical systems problem-solving.
            Start with a rough idea, a failed part, or a production requirement; scope a solution around the actual use case.
          </p>
        </div>
        <Link href="/portfolio" className="rounded-xl bubble px-5 py-3 text-sm font-semibold">
          Explore capabilities
        </Link>
      </section>

      {/* SERVICE AREAS */}
      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="card rounded-2xl p-6">
            <h3 className="text-xl font-semibold">Mechanical Design & CAD</h3>
            <p className="mt-3 text-sm leading-6">Part geometry, assemblies, drawings and design revisions that clarify the next manufacturing decision.</p>
          </article>
          <article className="card rounded-2xl p-6">
            <h3 className="text-xl font-semibold">Prototypes & Custom Parts</h3>
            <p className="mt-3 text-sm leading-6">Iterative builds to explore fit, function and materials before a larger commitment.</p>
          </article>
          <article className="card rounded-2xl p-6">
            <h3 className="text-xl font-semibold">Manufacturing & Systems Support</h3>
            <p className="mt-3 text-sm leading-6">Design-for-manufacturing, fixtures, process challenges and practical technical workflows.</p>
          </article>
        </div>
      </section>

      {/* CAD SPOTLIGHT */}
      <section className="rounded-3xl panel overflow-hidden">
        <div className="grid md:grid-cols-2">
          <figure className="p-4 md:p-6 bg-white">
            <Image
              src="/assets/img/WindowSlide_Drawing.png"
              alt="Technical drawing – window attachment"
              width={1200}
              height={800}
              className="rounded-xl ring-1 ring-black/10"
            />
          </figure>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="text-sm text-slate-300">CAD, drawings & technical decisions</div>
            <h3 className="mt-2 text-2xl font-semibold text-white">Engineering work that moves decisions forward</h3>
            <p className="mt-3 text-slate-200">
              Clear models and documentation help teams review geometry, discuss tradeoffs and decide what needs to be prototyped, tested or produced next. 
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="rounded-3xl panel-inverse p-6 md:p-10">
        <div className="md:flex items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold text-white">Have a technical problem to solve?</h3>
            <p className="text-slate-200">
              Tell us the application, constraints and intended outcome. We can arrange file transfer after scoping your request.
            </p>
          </div>
          <Link
            href="/design"
            className="mt-4 md:mt-0 rounded-xl bubble px-4 py-2 text-sm font-semibold hover:brightness-110"
          >
            Discuss your project
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

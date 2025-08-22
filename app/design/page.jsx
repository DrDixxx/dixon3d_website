"use client";

import Image from "next/image";
import { useState } from "react";
import INV from "../../lib/inventory.json";
const { MATERIALS, COLORS } = INV;

export default function DesignPage() {
  const [img, setImg] = useState(0);
  const imgs = [
    { src: "/assets/img/WindowSlide_Drawing.png", alt: "Technical drawing" },
    { src: "/assets/img/CastingPumpPattern.png", alt: "Casting pump pattern" },
    { src: "/assets/img/PegBoard_Full.PNG", alt: "Pegboard system" },
    { src: "/assets/img/BusinessCard_Printed.png", alt: "Printed business card" },
  ];

  async function onSubmit(e){
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res  = await fetch('/api/design-request', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body: JSON.stringify(data)
      });
      const text = await res.text();
      let json; try { json = JSON.parse(text); } catch {}
      console.log('design-request →', res.status, json || text);

      if (res.ok && json?.ok) {
        alert(`Design request sent! Ref #${json.traceId || 'n/a'}`);
        form.reset();
        return;
      }
      const code = json?.code || `HTTP_${res.status}`;
      const msg  = json?.message || text || 'Unknown error';
      const ref  = json?.traceId || 'n/a';
      alert(`Design request failed: ${code}\nRef #${ref}\n${msg}`);
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
  }
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10 space-y-10">
      <h2 className="text-2xl font-bold">Design Work</h2>

      <section className="grid md:grid-cols-2 gap-4">
        <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Consult & Design</h3><p className="mt-2 text-sm">We refine CAD, check tolerances, and plan for manufacturability.</p></article>
        <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Rapid Prototyping</h3><p className="mt-2 text-sm">Iterative prints in functional materials for quick testing.</p></article>
        <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Thermoforming & Casting</h3><p className="mt-2 text-sm">Patterns and tooling appropriate for forming/casting workflows.</p></article>
        <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">DFAM for 3-Axis CNC</h3><p className="mt-2 text-sm">Geometries that translate cleanly to machining.</p></article>
      </section>

      {/* Reviews – 4 bubbles, staggered */}
      <section className="rounded-3xl panel p-4">
        <h3 className="text-xl font-semibold mb-3">What clients say</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <article className="bubble rounded-2xl p-4">
            <div className="text-yellow-300">★★★★★</div>
            <p className="text-sm mt-1">“Fit great and slid like new!”</p>
            <div className="text-xs text-slate-300 mt-2">— Amy D.</div>
          </article>
          <article className="bubble rounded-2xl p-4 md:translate-y+1">
            <div className="text-yellow-300">★★★★★</div>
            <p className="text-sm mt-1">“Fun ideas and gave some quick turnaround.”</p>
            <div className="text-xs text-slate-300 mt-2">— Nate M.</div>
          </article>
          <article className="bubble rounded-2xl p-4 md:-translate-y-2">
            <div className="text-yellow-300">★★★★★</div>
            <p className="text-sm mt-1">“Perfect addition to the desk.”</p>
            <div className="text-xs text-slate-300 mt-2">— Mark M.</div>
          </article>
          <article className="bubble rounded-2xl p-4 md:translate-y+3">
            <div className="text-yellow-300">★★★★★</div>
            <p className="text-sm mt-1">“Clear communication on limitations and material choice.”</p>
            <div className="text-xs text-slate-300 mt-2">— Chelsey S.</div>
          </article>
        </div>
      </section>

      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden">
          <Image
            src={imgs[img].src}
            alt={imgs[img].alt}
            fill
            className="object-contain"
          />
          <button
            onClick={() => setImg((img - 1 + imgs.length) % imgs.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white text-sm rounded-full w-8 h-8"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={() => setImg((img + 1) % imgs.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white text-sm rounded-full w-8 h-8"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold">Design & Quote</h3>
        <p className="text-slate-200 mt-2">Tell us what you need. Attach CAD/mesh files if you have them.</p>

        <form id="quote-form" className="mt-6 space-y-6" onSubmit={onSubmit}>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Name</div>
              <input name="name" required className="w-full rounded-xl input-soft px-3 py-2 text-sm"/>
            </label>
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Email</div>
              <input name="email" type="email" required className="w-full rounded-xl input-soft px-3 py-2 text-sm"/>
            </label>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Material</div>
              <select name="material" className="w-full rounded-xl input-soft px-3 py-2 text-sm">
                {MATERIALS.map(m => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Color</div>
              <select name="color" className="w-full rounded-xl input-soft px-3 py-2 text-sm">
                {COLORS.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Quantity</div>
              <input name="quantity" type="number" min="1" defaultValue="1"
                     className="w-full rounded-xl input-soft px-3 py-2 text-sm"/>
            </label>
            <label className="block">
              <div className="text-sm text-slate-300 mb-1">Finish</div>
              <select name="finish" className="w-full rounded-xl input-soft px-3 py-2 text-sm">
                <option>As-printed</option><option>Sanded</option><option>Vapor smooth (ABS)</option><option>Primed & painted</option>
              </select>
            </label>
          </div>

          <label className="block">
            <div className="text-sm text-slate-300 mb-1">Notes / tolerances / use case</div>
            <textarea name="notes" rows="5" className="w-full rounded-xl input-soft px-3 py-2 text-sm"></textarea>
          </label>

          <div>
            <div className="text-sm font-medium text-slate-200">Files</div>
            <div className="mt-2 rounded-2xl border-2 border-dashed border-white/30 p-6 text-center text-slate-200">
              Drag & drop files here or <label className="ml-2 underline cursor-pointer">browse
                <input id="file-input" type="file" multiple className="hidden"
                       accept=".stl,.step,.stp,.iges,.igs,.3mf,.obj,.ply,.fbx,.dxf,.sldprt,.sldasm,.las,.laz,.e57"/>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="rounded-xl bubble px-5 py-2.5 text-sm font-semibold">Submit</button>
          </div>
        </form>
      </section>
    </div>
  );
}

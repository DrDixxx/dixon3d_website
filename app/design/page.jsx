"use client";

import Image from "next/image";
import INV from "../../lib/inventory.json";
const { MATERIALS, COLORS } = INV;

const EXAMPLES = [
  {
    title: "To Replace",
    landscape: true,
    images: [
      {
        src: "/assets/img/HuskeyWallMount-1.jpeg",
        alt: "Broken wall mount piece",
        caption: "Broken Wall Mount - To Replace",
      },
      {
        src: "/assets/img/HuskeyWallMount-2.jpeg",
        alt: "Attachment area for verification",
        caption: "Attachment Side For Feature Check",
      },
    ],
  },
  {
    title: "Mockup",
    images: [
      {
        src: "/assets/img/HuskeyWallMount_Drawing.png",
        alt: "Drawing of replacement wall mount",
        caption: "Drawing of Replacement for Dimensional Assurance",
      },
    ],
  },
  {
    title: "Final",
    images: [
      {
        src: "/assets/img/HuskyWallMount-Render.png",
        alt: "Render of finished wall mount",
        caption: "AI Enhanced Final Product - Material: ABS",
      },
    ],
  },
];

export default function DesignPage() {
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10 space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Discuss an engineering project</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Consult & Design</h3><p className="mt-2 text-sm">Review CAD, define important dimensions, and evaluate manufacturability based on requirements.</p></article>
          <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Rapid Prototyping</h3><p className="mt-2 text-sm">Iterative parts for reviewing fit and exploring design choices.</p></article>
          <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Thermoforming & Casting</h3><p className="mt-2 text-sm">Explore patterns, fixtures and tooling requirements for a proposed process.</p></article>
          <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">DFAM for 3-Axis CNC</h3><p className="mt-2 text-sm">Review geometry, material and manufacturing-process tradeoffs.</p></article>
        </div>
      </section>

      <section className="rounded-3xl panel p-4 text-center">
        <div className="grid sm:grid-cols-3 gap-3 justify-items-center">
          {EXAMPLES.map(group => (
          <fieldset key={group.title} className="w-full rounded-2xl border border-white/20 p-2">
            <legend className="mx-auto px-2 text-xs text-slate-300">{group.title}</legend>
            <div className="grid gap-3">
              {group.images.map(img => (
                <div key={img.src} className="text-center space-y-1">
                    <figure
                      className={`relative overflow-hidden rounded-2xl bubble ${
                        group.landscape
                          ? group.images.length > 1
                            ? 'aspect-[2/1]'
                            : 'aspect-[16/9]'
                          : 'aspect-square'
                      }`}
                    >
                      <Image src={img.src} alt={img.alt} fill className="object-cover" />
                    </figure>
                    <div className="text-xs text-slate-300">{img.caption}</div>
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold">Design & Quote</h3>
        <p className="text-slate-200 mt-2">Describe the part, problem or application. If CAD files or photos are needed, we can arrange a suitable transfer method after reviewing your request.</p>

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

          <p className="text-sm text-slate-300">This form collects project details only. It does not upload files.</p>

          <div className="flex gap-3">
            <button type="submit" className="rounded-xl bubble px-5 py-2.5 text-sm font-semibold">Submit</button>
          </div>
        </form>
      </section>


    </div>
  );
}

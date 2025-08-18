"use client";

export default function DesignPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10 space-y-10">
      <h2 className="text-2xl font-bold">Design Work</h2>

      <section className="grid md:grid-cols-2 gap-4">
        <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Consult & Design</h3><p className="mt-2 text-sm">We refine CAD, check tolerances, and plan for manufacturability.</p></article>
        <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Rapid Prototyping</h3><p className="mt-2 text-sm">Iterative prints in functional materials for quick testing.</p></article>
        <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">Thermoforming & Casting</h3><p className="mt-2 text-sm">Patterns and tooling for forming/casting workflows.</p></article>
        <article className="card rounded-2xl p-5"><h3 className="text-lg font-semibold">DFAM for 3-Axis CNC</h3><p className="mt-2 text-sm">Geometries that translate cleanly to machining.</p></article>
      </section>

      <section>
        <h3 className="text-xl font-semibold">Design & Quote</h3>
        <p className="text-slate-200 mt-2">Tell us what you need. Attach CAD/mesh files if you have them.</p>

        <form id="quote-form" className="mt-6 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.currentTarget).entries());
          const files = (e.currentTarget.querySelector("#file-input")?.files || []);
          const payload = {
            ...data,
            quantity: Number(data.quantity || 1),
            files: Array.from(files).map(f => f.name),
            time: new Date().toISOString()
          };
          const prev = JSON.parse(localStorage.getItem("dixon3d_requests") || "[]");
          localStorage.setItem("dixon3d_requests", JSON.stringify([payload, ...prev]));
          e.currentTarget.reset();
          document.getElementById("thanks").classList.remove("hidden-soft");
        }}>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm text-slate-500 mb-1">Name</div>
              <input name="name" required className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none ring-1 ring-black/10"/>
            </label>
            <label className="block">
              <div className="text-sm text-slate-500 mb-1">Email</div>
              <input name="email" type="email" required className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none ring-1 ring-black/10"/>
            </label>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block">
              <div className="text-sm text-slate-500 mb-1">Material</div>
              <select name="material" className="w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-black/10">
                <option>PLA</option><option>PETG</option><option>ABS</option><option>ASA</option><option>Nylon</option><option>CF-Nylon</option><option>TPU 95A</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm text-slate-500 mb-1">Quantity</div>
              <input name="quantity" type="number" min="1" defaultValue="1" className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none ring-1 ring-black/10"/>
            </label>
            <label className="block">
              <div className="text-sm text-slate-500 mb-1">Finish</div>
              <select name="finish" className="w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-black/10">
                <option>As-printed</option><option>Sanded</option><option>Vapor smooth (ABS)</option><option>Primed & painted</option>
              </select>
            </label>
          </div>

          <label className="block">
            <div className="text-sm text-slate-500 mb-1">Notes / tolerances / use case</div>
            <textarea name="notes" rows="5" className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none ring-1 ring-black/10"></textarea>
          </label>

          <div>
            <div className="text-sm font-medium">Files</div>
            <div className="mt-2 rounded-2xl border-2 border-dashed border-white/30 p-6 text-center text-slate-200">
              Drag & drop files here or <label className="ml-2 underline cursor-pointer">browse
                <input id="file-input" type="file" multiple className="hidden" accept=".stl,.step,.stp,.iges,.igs,.3mf,.obj,.ply,.fbx,.dxf,.sldprt,.sldasm,.las,.laz,.e57"/>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold">Submit</button>
          </div>
        </form>

        <div id="thanks" className="hidden-soft max-w-2xl mx-auto text-center space-y-4 mt-6">
          <h2 className="text-2xl font-bold">Thanks! 🎉</h2>
          <p className="text-slate-200">Saved in your browser. Hook up email/API later.</p>
        </div>
      </section>
    </div>
  );
}

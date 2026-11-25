import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Engineering Capabilities | Dixon3D",
  description:
    "Practical mechanical design, custom parts, prototyping, additive manufacturing, and technical problem-solving for businesses and product developers."
};

const services = [
  {
    title: "Mechanical design & CAD",
    description:
      "Refine a concept, recreate a replacement component, or develop a functional assembly with manufacturability in mind.",
    deliverables: "Depending on scope: 3D models, technical drawings, design revisions and assembly documentation."
  },
  {
    title: "Functional prototypes & custom parts",
    description:
      "Explore fit, geometry, materials and iterative builds before committing to a larger production decision.",
    deliverables: "Depending on scope: prototype parts, build iterations, material/process options and practical test recommendations."
  },
  {
    title: "Manufacturing & process support",
    description:
      "Evaluate process constraints, part orientation, build strategies, fixtures and production problems that affect real outcomes.",
    deliverables: "Depending on scope: design-for-manufacturing review, process recommendations, technical procedures and prototype plans."
  },
  {
    title: "Automation & technical workflows",
    description:
      "Explore practical ways to connect engineering operations, equipment information and lightweight software workflows.",
    deliverables: "Depending on scope: requirements mapping, integration feasibility, workflow prototypes and verification criteria."
  }
];

const situations = [
  {
    title: "An existing part needs replacing",
    detail:
      "Start with its function, available measurements, mating features and operating conditions. Then define what must be modeled, produced and checked."
  },
  {
    title: "A product idea needs a first build",
    detail:
      "Translate rough concepts into a reviewable CAD direction, identify manufacturing constraints and plan useful prototype iterations."
  },
  {
    title: "A process or fixture needs improvement",
    detail:
      "Define the recurring problem, constraints and acceptance criteria, then evaluate a mechanical or workflow-oriented solution."
  }
];

const steps = [
  ["01", "Define the requirement", "Describe the application, quantities, constraints and what a successful result must do."],
  ["02", "Agree on scope", "Review feasibility, available inputs, deliverables, timeline assumptions and how success will be checked."],
  ["03", "Design and iterate", "Develop the agreed model, prototype, process plan or technical workflow; review meaningful tradeoffs."],
  ["04", "Deliver with context", "Provide the agreed outputs and communicate remaining limitations, next steps and verification needs."]
];

export default function EngineeringCapabilitiesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <header className="rounded-3xl panel-inverse px-6 py-10 sm:px-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
          Dixon3D / Engineering & development
        </p>
        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-5xl">
          Practical engineering for parts, products and production challenges.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200">
          From an unfinished concept or difficult replacement part to a clearer design, working
          prototype or actionable technical plan. Dixon3D brings mechanical design,
          additive-manufacturing experience and systems thinking to business and product-development needs.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/design" className="rounded-xl bubble px-5 py-3 text-sm font-semibold">
            Discuss a project
          </Link>
          <a href="#services" className="rounded-xl border border-white/25 px-5 py-3 text-sm text-slate-100 hover:bg-white/10">
            Explore capabilities
          </a>
        </div>
      </header>

      <section id="services" className="scroll-mt-28 space-y-5">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">Capabilities</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Help where design meets the real world</h2>
          <p className="mt-3 text-slate-200">
            Work can begin with a problem statement, an existing model or a physical part. The
            exact technical deliverables are defined for each engagement rather than promised as a one-size-fits-all package.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="card rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-200">{service.description}</p>
              <p className="mt-5 border-t border-white/15 pt-4 text-sm leading-6 text-slate-300">
                <span className="font-semibold text-white">Possible outputs: </span>
                {service.deliverables.replace("Depending on scope: ", "")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">Problems worth solving</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Bring the challenge, not a finished specification</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {situations.map((situation) => (
            <article key={situation.title} className="rounded-2xl panel p-6">
              <h3 className="text-lg font-semibold text-white">{situation.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-200">{situation.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl panel">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3 bg-slate-950/35 p-4 sm:p-6">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-900">
                <Image src="/assets/img/Enclosure_Render.png" alt="CAD visualization illustrating mechanical design communication" fill sizes="(max-width: 1024px) 45vw, 22vw" className="object-contain p-2" />
              </div>
              <figcaption className="mt-2 text-xs text-slate-300">CAD visualization</figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white">
                <Image src="/assets/img/Enclosure_Drawing.png" alt="Technical drawing illustrating the documentation side of mechanical design" fill sizes="(max-width: 1024px) 45vw, 22vw" className="object-contain p-2" />
              </div>
              <figcaption className="mt-2 text-xs text-slate-300">Technical drawing</figcaption>
            </figure>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">Clear technical communication</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Work you can evaluate and build from</h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              A useful engineering handoff makes geometry, requirements and open questions visible.
              CAD visuals and drawings can support design decisions, prototype planning and collaboration.
              The example images illustrate document types, not a certified performance result or a finalized client case study.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl panel p-7 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">Technical foundation</p>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Experience informed by real production environments
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-200">
          Dixon3D draws on professional experience in industrial additive-manufacturing applications,
          equipment troubleshooting, CAD-based design improvements, and connecting shop-floor needs
          with technical software workflows. This background informs how projects are scoped,
          documented, tested and communicated; individual project results are established through
          their own requirements and verification.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white/5 p-4">
            <h3 className="font-semibold text-white">CAD & manufacturing</h3>
            <p className="mt-2 text-sm text-slate-300">Geometry, assemblies, additive processes, production constraints.</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <h3 className="font-semibold text-white">Industrial problem-solving</h3>
            <p className="mt-2 text-sm text-slate-300">Equipment diagnostics, process issues, and practical iteration.</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <h3 className="font-semibold text-white">Systems integration</h3>
            <p className="mt-2 text-sm text-slate-300">Equipment-data workflows, technical requirements, and validation.</p>
          </div>
        </div>
      </section>

      <section id="approach" className="space-y-5">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">How projects move forward</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Defined scope. Visible decisions. Practical handoff.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, description]) => (
            <article key={number} className="rounded-2xl panel p-5">
              <p className="text-sm font-semibold text-sky-200">{number}</p>
              <h3 className="mt-2 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl panel-inverse p-7 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">Start a conversation</p>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Have a part, concept or technical problem?</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
          Share what the project needs to accomplish, what you have available and which constraints matter.
          Dixon3D can review the request and determine whether the next step is design, prototyping or another technical approach.
          Feasibility, pricing, schedules and performance requirements are confirmed before work begins.
        </p>
        <Link href="/design" className="mt-6 inline-block rounded-xl bubble px-5 py-3 text-sm font-semibold">
          Request a project review
        </Link>
      </section>
    </div>
  );
}

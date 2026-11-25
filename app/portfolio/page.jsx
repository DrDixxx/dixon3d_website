import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Engineering Design Portfolio | Dixon3D",
  description: "Representative CAD, mechanical design, and additive-manufacturing project examples with drawings, renders, and fabricated parts."
};

const projects = [
  {
    title: "Mechanical enclosure",
    category: "CAD design · Technical documentation",
    image: "/assets/img/Enclosure_Render.png",
    imageAlt: "CAD render of the mechanical enclosure",
    summary: "Enclosure geometry documented through a technical drawing and a complementary CAD render. The pair communicates the concept from design intent to a reviewable representation.",
    evidence: [
      { label: "Technical drawing", href: "/assets/img/Enclosure_Drawing.png" },
      { label: "CAD render", href: "/assets/img/Enclosure_Render.png" }
    ]
  },
  {
    title: "Functional wall mount",
    category: "Mechanical fixture · Prototyping",
    image: "/assets/img/HuskyWallMount-Render.png",
    imageAlt: "CAD render of the functional wall mount",
    summary: "A mechanical mount presented with a drawing, design render, and photograph of the printed part. The artifacts show design and fabrication stages without implying tested load ratings.",
    evidence: [
      { label: "Technical drawing", href: "/assets/img/HuskeyWallMount_Drawing.png" },
      { label: "CAD render", href: "/assets/img/HuskyWallMount-Render.png" },
      { label: "Printed part", href: "/assets/img/HuskeyWallMount-1.jpeg" }
    ]
  },
  {
    title: "Modular pegboard system",
    category: "Product development · Assemblies",
    image: "/assets/img/PegBoard_Full.PNG",
    imageAlt: "Full CAD assembly render of a pegboard system",
    summary: "A modular storage concept with assembly, panel, and tool-holder representations. These images communicate how individual functional components relate to a larger system.",
    evidence: [
      { label: "Assembly", href: "/assets/img/PegBoard_Full.PNG" },
      { label: "Panel", href: "/assets/img/PegBoard_Panel.png" },
      { label: "Tool holder", href: "/assets/img/PegBoard_ToolHolder.PNG" }
    ]
  },
  {
    title: "Window attachment",
    category: "Mechanical design · Drawings",
    image: "/assets/img/WindowSlide_Drawing.png",
    imageAlt: "Technical drawing of a window attachment",
    summary: "A mechanical attachment represented with an engineering drawing. It demonstrates geometric communication and design documentation; fabrication and dimensional inspection have not been claimed.",
    evidence: [
      { label: "Technical drawing", href: "/assets/img/WindowSlide_Drawing.png" }
    ]
  }
];

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sky-200">Dixon3D · Engineering portfolio</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl">From CAD concepts to functional prototypes</h1>
        <p className="mt-4 text-base leading-7 text-slate-200">
          A selection of documented design examples spanning mechanical geometry, assemblies,
          fabrication planning, and additive manufacturing. Each entry links to actual project
          artifacts rather than unsupported performance or certification claims.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map(project => (
          <article key={project.title} className="overflow-hidden rounded-3xl panel">
            <div className="relative aspect-[16/10] bg-slate-900">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-3"
              />
            </div>
            <div className="space-y-3 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">{project.category}</p>
              <h2 className="text-xl font-semibold text-white">{project.title}</h2>
              <p className="text-sm leading-6 text-slate-200">{project.summary}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.evidence.map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bubble px-3 py-2 text-sm font-medium"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <section className="rounded-3xl panel p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-white">Design, prototype, iterate</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">
          Project planning starts with use case, geometry, material, process, and acceptance criteria.
          Published drawings are illustrative; measured tolerances, load ratings, and production
          qualifications require project-specific verification.
        </p>
        <Link href="/design" className="mt-5 inline-block rounded-xl bubble px-4 py-2 text-sm font-semibold">
          Explore design inquiries
        </Link>
      </section>
    </div>
  );
}

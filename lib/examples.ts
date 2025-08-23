export type Example = {
  process: string;
  title?: string;
  alt?: string;
  src: string;
};

export const EXAMPLES: Example[] = [
  { process: "design", src: "/assets/img/WindowSlide_Drawing.png", title: "Technical drawing", alt: "Technical drawing" },
  { process: "design", src: "/assets/img/CastingPumpPattern.png", title: "Casting pump pattern", alt: "Casting pump pattern" },
  { process: "design", src: "/assets/img/PegBoard_Full.PNG", title: "Pegboard system", alt: "Pegboard system" },
  { process: "design", src: "/assets/img/BusinessCard_Printed.png", title: "Printed business card", alt: "Printed business card" },
  { process: "design", src: "/assets/img/Enclosure_Drawing.png", title: "Enclosure drawing", alt: "Enclosure drawing" },
];

import fs from "fs/promises";
import path from "path";

export type InfoCategory =
  | "guides"
  | "processes-materials"
  | "design-slicing"
  | "post-quality"
  | "production-ops"
  | "case-studies";

export interface InfoPost {
  slug: string;
  title: string;
  category: InfoCategory;
  tags: string[];
  date: string;
  summary: string;
  hero?: string;
  externalUrl: string | null;
  video: string | null;
  minutes: number;
}

export const INFO_CATEGORIES: { key: InfoCategory; label: string }[] = [
  { key: "guides", label: "Guides" },
  { key: "processes-materials", label: "Processes & Materials" },
  { key: "design-slicing", label: "Design & Slicing" },
  { key: "post-quality", label: "Post Quality" },
  { key: "production-ops", label: "Production & Ops" },
  { key: "case-studies", label: "Case Studies" },
];

export async function getLocalPosts(): Promise<InfoPost[]> {
  const dir = path.join(process.cwd(), "content/info");
  const files = await fs.readdir(dir);
  const posts: InfoPost[] = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    posts.push({ ...data, slug: file.replace(/\.json$/, "") });
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export type NewsItem = {
  title: string;
  url: string;
  source: string;
  date: string;
  summary?: string;
  author?: string;
  image?: string;
};

export async function getExternalNews(): Promise<NewsItem[]> {
  return [];
}

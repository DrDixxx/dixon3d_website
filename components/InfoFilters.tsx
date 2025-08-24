"use client";

import { useMemo, useState } from "react";
import InfoCard, { fromLocal, fromNews } from "./InfoCard";
import type { InfoCategory, InfoPost, NewsItem } from "../lib/info";

const CATEGORIES: { key: InfoCategory; label: string }[] = [
  { key: "guides", label: "Guides" },
  { key: "processes-materials", label: "Processes & Materials" },
  { key: "design-slicing", label: "Design & Slicing" },
  { key: "post-quality", label: "Post Quality" },
  { key: "production-ops", label: "Production & Ops" },
  { key: "case-studies", label: "Case Studies" },
];

interface Props {
  localPosts: InfoPost[];
  newsItems: NewsItem[];
}

export default function InfoFilters({ localPosts, newsItems }: Props) {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return localPosts.filter((p) => {
      const inCategory = category === "all" || p.category === category;
      const text = `${p.title} ${p.summary} ${p.tags.join(" ")}`.toLowerCase();
      const matches = text.includes(q);
      return inCategory && matches;
    });
  }, [localPosts, category, query]);

  return (
    <div className="space-y-14">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={`px-3 py-1.5 rounded-full text-sm bubble ${
              category === "all" ? "bubble-active" : ""
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-3 py-1.5 rounded-full text-sm bubble ${
                category === c.key ? "bubble-active" : ""
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bubble-input rounded-full px-3 py-1.5 text-sm"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((post) => (
          <InfoCard key={post.slug} {...fromLocal(post)} />
        ))}
      </div>

      {newsItems.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Latest from the community</h2>
          <div className="space-y-4">
            {newsItems.map((item) => (
              <InfoCard key={item.url} {...fromNews(item)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

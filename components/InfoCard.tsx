"use client";

import Image from "next/image";
import Link from "next/link";
import type { InfoPost, NewsItem } from "../lib/info";

export interface InfoCardProps {
  title: string;
  summary?: string;
  date: string;
  source: string;
  href: string;
  hero?: string;
  external?: boolean;
}

export default function InfoCard(props: InfoCardProps) {
  const { title, summary, date, source, href, hero, external } = props;
  const content = (
    <div className="card rounded-lg overflow-hidden flex flex-col h-full transition hover:bg-white/10">
      {hero && (
        <div className="relative h-40 w-full">
          <Image src={hero} alt={title} fill className="object-cover" />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {summary && <p className="text-sm mb-4 flex-1">{summary}</p>}
        <div className="mt-auto text-xs text-slate-300">
          {new Date(date).toLocaleDateString()} • {source}
        </div>
      </div>
    </div>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href}>{content}</Link>
  );
}

export function fromLocal(post: InfoPost): InfoCardProps {
  return {
    title: post.title,
    summary: post.summary,
    date: post.date,
    source: post.externalUrl ? "External" : "Dixon3D",
    href: post.externalUrl ? post.externalUrl : `/info/${post.slug}`,
    hero: post.hero || undefined,
    external: !!post.externalUrl,
  };
}

export function fromNews(item: NewsItem): InfoCardProps {
  return {
    title: item.title,
    summary: item.summary,
    date: item.date,
    source: item.source,
    href: item.url,
    external: true,
  };
}

"use client";

import Image from "next/image";
import Link from "next/link";
import type { InfoPost, NewsItem } from "../lib/info";

export interface InfoCardProps {
  title: string;
  date: string;
  author: string;
  href: string;
  thumbnail?: string;
  external?: boolean;
}

export default function InfoCard({
  title,
  date,
  author,
  href,
  thumbnail,
  external,
}: InfoCardProps) {
  const content = (
    <div className="card rounded-lg overflow-hidden flex items-center justify-between p-4 transition hover:bg-white/10">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xs text-slate-300 mt-1">
          {new Date(date).toLocaleDateString()} • {author}
        </p>
      </div>
      {thumbnail && (
        <div className="relative w-24 h-16 ml-4 flex-shrink-0">
          <Image src={thumbnail} alt={title} fill className="object-cover rounded" />
        </div>
      )}
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
    date: post.date,
    author: "Dixon3D",
    href: post.externalUrl ? post.externalUrl : `/info/${post.slug}`,
    thumbnail: post.hero || undefined,
    external: !!post.externalUrl,
  };
}

export function fromNews(item: NewsItem): InfoCardProps {
  return {
    title: item.title,
    date: item.date,
    author: item.author ? `${item.author}, ${item.source}` : item.source,
    href: item.url,
    thumbnail: item.image || undefined,
    external: true,
  };
}


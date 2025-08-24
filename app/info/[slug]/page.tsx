import path from "path";
import fs from "fs/promises";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { InfoPost } from "../../../lib/info";

interface Params { params: { slug: string } }

export default async function InfoPostPage({ params }: Params) {
  const { slug } = params;
  const file = path.join(process.cwd(), "content/info", `${slug}.json`);
  let data: InfoPost;
  try {
    const raw = await fs.readFile(file, "utf-8");
    data = { ...JSON.parse(raw), slug };
  } catch (e) {
    notFound();
  }
  const post = data!;
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-sm text-slate-300 mt-1">
            {new Date(post.date).toLocaleDateString()} • Dixon3D
          </p>
        </div>
        {post.hero && (
          <div className="relative w-full md:w-2/3 h-56 md:h-72 flex-shrink-0">
            <Image
              src={post.hero}
              alt={post.title}
              fill
              className="object-cover rounded"
            />
          </div>
        )}
      </div>
      <p>{post.summary}</p>
      {post.video && (
        <video src={post.video} controls className="w-full rounded" />
      )}
      {post.externalUrl && (
        <a
          href={post.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bubble px-4 py-2 rounded mt-4"
        >
          Read at source
        </a>
      )}
    </div>
  );
}

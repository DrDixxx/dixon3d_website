"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const p = usePathname();
  const tab = (href, label) => (
    <Link
      href={href}
      className={
        "px-4 py-2 rounded-full text-sm hover:bg-black/5 " +
        (p === href ? "bg-black/5" : "")
      }
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            alt="Dixon 3D logo"
            src="/assets/img/D3D_Logo.png"
            width={48}
            height={48}
            className="h-12 w-12 rounded-md ring-1 ring-black/10 bg-[#e7ebf3] p-1.5 object-contain"
          />
          <div className="text-base font-semibold text-slate-900">Dixon 3D</div>
        </Link>
        <nav className="hidden md:flex flex-1 items-center justify-center gap-1">
          {tab("/", "Home")}
          {tab("/design", "Design Work")}
          {tab("/shop", "Shop Prints")}
        </nav>
        <Link
          href="/design"
          className="ml-auto rounded-xl border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5 text-slate-900"
        >
          Get a Quote
        </Link>
      </div>
    </header>
  );
}

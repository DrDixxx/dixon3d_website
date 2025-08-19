"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Nav() {
  const p = usePathname();
  const [open, setOpen] = useState(false);
  const tab = (href, label) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={
        "px-4 py-2 rounded-full text-sm bubble transition " +
        (p === href ? "bubble-active" : "")
      }
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-header/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4 text-slate-100">
        <Link href="/" className="flex items-center gap-3">
          <Image
            alt="Dixon 3D logo"
            src="/assets/img/D3D_Logo.png"
            width={60}
            height={60}
            className="h-[60px] w-[60px] object-contain"
          />
          <div className="text-base font-semibold">Dixon 3D</div>
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-2">
          {tab("/", "Home")}
          {tab("/design", "Design Work")}
          {tab("/shop", "Shop Prints")}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative md:hidden">
            <button
              type="button"
              className="rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              onClick={() => setOpen(!open)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.75h16.5M3.75 12h16.5M3.75 18.25h16.5"
                />
              </svg>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-header/95 backdrop-blur shadow-lg ring-1 ring-black/5 p-2 flex flex-col gap-1">
                {tab("/", "Home")}
                {tab("/design", "Design Work")}
                {tab("/shop", "Shop Prints")}
              </div>
            )}
          </div>

          <Link
            href="/design"
            className="rounded-xl bubble px-3 py-1.5 text-sm hover:brightness-110"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}

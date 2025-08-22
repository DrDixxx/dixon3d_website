"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

export type Slide = { src: string; alt?: string; caption?: string };
export type Props = {
  images: Slide[];
  angularSpeed?: number; // radians/sec, default 0.6
  radiusFrac?: number; // fraction of shorter side, default 0.38
  itemSizeFrac?: number; // fraction of shorter side, default 0.24
  minOpacity?: number; // 0..1 back face floor, default 0.22
  depthScale?: boolean; // default true
  className?: string;
};

export default function ExamplesOrbit({
  images,
  angularSpeed = 0.6,
  radiusFrac = 0.38,
  itemSizeFrac = 0.24,
  minOpacity = 0.22,
  depthScale = true,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const frameRef = useRef<number>();
  const lastRef = useRef<number>();
  const thetaRef = useRef(0);
  const pausedRef = useRef(false);
  const [dims, setDims] = useState({ radius: 0, item: 0 });
  const [active, setActive] = useState(0);
  const offsetsRef = useRef<number[]>([]);
  const [reduce, setReduce] = useState(false);
  const [roSupported, setRoSupported] = useState(true);

  // setup offsets whenever images change
  useEffect(() => {
    offsetsRef.current = images.map((_, i) => (i * 2 * Math.PI) / images.length);
  }, [images]);

  // prefers-reduced-motion
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduce(m.matches);
    handler();
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);

  // resize observer to compute radius and item size; falls back when unsupported
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(entries => {
        const rect = entries[0].contentRect;
        const s = Math.min(rect.width, rect.height);
        setDims({ radius: s * radiusFrac, item: s * itemSizeFrac });
      });
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      setRoSupported(false);
      const rect = el.getBoundingClientRect();
      const s = Math.min(rect.width, rect.height) || 300;
      setDims({ radius: s * radiusFrac, item: s * itemSizeFrac });
    }
  }, [radiusFrac, itemSizeFrac]);

  const updateStyles = useCallback(() => {
    const { radius, item } = dims;
    let maxDepth = -1;
    let idx = 0;
    itemsRef.current.forEach((el, i) => {
      if (!el) return;
      const angle = thetaRef.current + offsetsRef.current[i];
      const x = radius * Math.sin(angle);
      const y = -radius * 0.55 * Math.cos(angle);
      const depth = (Math.cos(angle) + 1) / 2; // 0 back .. 1 front
      const scale = depthScale ? 0.7 + 0.3 * depth : 1;
      const opacity = minOpacity + (1 - minOpacity) * depth;
      const z = 10 + depth * 10;
      el.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
      el.style.opacity = opacity.toString();
      el.style.zIndex = z.toFixed(0);
      el.style.width = item + "px";
      el.style.height = item + "px";
      if (depth > maxDepth) {
        maxDepth = depth;
        idx = i;
      }
    });
    setActive(a => (a !== idx ? idx : a));
  }, [dims, minOpacity, depthScale]);

  useEffect(() => {
    updateStyles();
  }, [updateStyles]);

  // animation loop
  useEffect(() => {
    if (reduce) {
      updateStyles();
      return;
    }
    const step = (time: number) => {
      if (!pausedRef.current) {
        if (lastRef.current !== undefined) {
          const dt = (time - lastRef.current) / 1000;
          thetaRef.current += angularSpeed * dt;
          updateStyles();
        }
      }
      lastRef.current = time;
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => frameRef.current && cancelAnimationFrame(frameRef.current);
  }, [angularSpeed, reduce, updateStyles]);

  const goto = (i: number) => {
    thetaRef.current = -offsetsRef.current[i];
    updateStyles();
  };

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
    lastRef.current = undefined;
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Example work carousel"
      className={`relative mx-auto aspect-square w-full max-w-xl select-none ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      {!roSupported && (
        <div className="pointer-events-none absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded bg-red-600/80 px-2 py-1 text-xs text-white">
          ResizeObserver not supported
        </div>
      )}
      {/* ring */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full border border-sky-400/30"
          style={{
            width: "100%",
            height: "100%",
            transform: "scaleY(0.55)",
            boxShadow: "0 0 40px rgba(56,189,248,0.25)",
          }}
        />
      </div>
      {/* slides */}
      {images.map((img, i) => (
        <div
          key={i}
          ref={el => (itemsRef.current[i] = el!)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl"
        >
          <Image
            src={img.src}
            alt={img.alt || img.caption || ""}
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>
      ))}
      {/* dots */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => goto(i)}
            className={`h-2 w-2 rounded-full ${i === active ? "bg-sky-400" : "bg-sky-300/50"}`}
            aria-label={
              img.caption
                ? `Show ${img.caption}`
                : img.alt
                ? `Show ${img.alt}`
                : `Show slide ${i + 1}`
            }
          />
        ))}
      </div>
    </div>
  );
}

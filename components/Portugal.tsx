"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Aspect = "tall" | "wide" | "square";

/*
  ATELIER — PORTUGAL section
  Editorial gallery representing the client's visit to
  Portuguese fabric manufacturers. Images can be replaced
  by adding real photos to /public/portugal/ and updating
  the src values below.

  Current state: styled placeholder grid — replace with
  actual factory/fabric photos when available.
*/

const IMAGES: { id: number; label: string; caption: string; aspect: Aspect; src: string | null }[] = [
  { id: 1, label: "Porto, Portugal",    caption: "The atelier",             aspect: "tall",   src: null },
  { id: 2, label: "Textile selection",  caption: "Raw materials",           aspect: "wide",   src: null },
  { id: 3, label: "Craftsmanship",      caption: "Hand finishing",          aspect: "square", src: null },
  { id: 4, label: "Quality control",    caption: "Every seam inspected",    aspect: "square", src: null },
  { id: 5, label: "The fabric",         caption: "120 thread count cotton", aspect: "wide",   src: null },
];

function ImageSlot({
  label,
  caption,
  aspect,
  src,
  index,
}: {
  label: string;
  caption: string;
  aspect: Aspect;
  src: string | null;
  index: number;
}) {
  const heightClass =
    aspect === "tall" ? "row-span-2" : "row-span-1";

  return (
    <div
      className={`relative overflow-hidden group bg-[#0a0a0a] border border-white/[0.06] ${heightClass}`}
      data-gallery-item
    >
      {src ? (
        /* Real photo when provided */
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-700"
        />
      ) : (
        /* Elegant placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {/* Subtle noise texture via CSS */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "150px 150px",
            }}
          />
          {/* Placeholder index mark */}
          <span className="text-white/10 text-[10px] tracking-[0.5em] uppercase">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="w-8 h-px bg-white/10" />
        </div>
      )}

      {/* Overlay label */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
        <p className="text-[9px] tracking-[0.38em] uppercase text-white/40 mb-0.5">
          {caption}
        </p>
        <p className="text-[11px] tracking-[0.2em] uppercase text-white/70">
          {label}
        </p>
      </div>
    </div>
  );
}

export function Portugal() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* Header reveal */
      gsap.fromTo("[data-pt-header]",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      /* Grid items stagger */
      gsap.fromTo("[data-gallery-item]",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: "[data-gallery-item]", start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 px-8 md:px-14 bg-black border-t border-white/[0.06]"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div data-pt-header className="text-[10px] tracking-[0.45em] uppercase text-white/25 mb-6">
          ATELIER — PORTUGAL
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2
            data-pt-header
            className="text-[clamp(2.5rem,6vw,5rem)] text-white font-black leading-none tracking-tight"
            style={{ fontFamily: "var(--font-display-google), sans-serif" }}
          >
            BORN FROM<br />CRAFT
          </h2>

          <div data-pt-header className="max-w-sm">
            <p
              className="text-white/45 text-[clamp(0.85rem,1.3vw,1rem)] leading-relaxed"
              style={{ fontFamily: "var(--font-serif-google), serif", fontStyle: "italic" }}
            >
              Every Entourage garment begins with the fabric.
              We visited the artisan mills of Portugal — a region
              with centuries of textile mastery — to source
              materials that match the quality the brand demands.
            </p>
            <div className="mt-5 text-[9px] tracking-[0.4em] uppercase text-white/20">
              Drop 01 · Made in Portugal
            </div>
          </div>
        </div>
      </div>

      {/* ── Editorial grid ─────────────────────────────────
          Layout:
          [  TALL (2 rows)  ] [ WIDE          ]
          [                 ] [ SQ ] [ SQ     ]
          [       WIDE (full width)            ]
      ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 auto-rows-[240px]">
        {/* Tall — left column */}
        <div className="col-span-1 row-span-2">
          <ImageSlot {...IMAGES[0]} index={0} />
        </div>

        {/* Wide — top right (spans 2 cols) */}
        <div className="col-span-2 row-span-1">
          <ImageSlot {...IMAGES[1]} index={1} />
        </div>

        {/* Two squares — bottom right */}
        <div className="col-span-1 row-span-1">
          <ImageSlot {...IMAGES[2]} index={2} />
        </div>
        <div className="col-span-1 row-span-1">
          <ImageSlot {...IMAGES[3]} index={3} />
        </div>

        {/* Full-width bottom */}
        <div className="col-span-3 row-span-1">
          <ImageSlot {...IMAGES[4]} index={4} />
        </div>
      </div>

      {/* Footer note */}
      <div className="max-w-7xl mx-auto mt-8 flex items-center gap-4">
        <div className="w-8 h-px bg-white/15" />
        <p className="text-[9px] tracking-[0.35em] uppercase text-white/20">
          Photography from the sourcing visit, Porto — 2026
        </p>
      </div>
    </section>
  );
}

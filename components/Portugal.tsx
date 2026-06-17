"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoE } from "./LogoE";

/* ── Instagram Story card ───────────────────────────────────── */
function IGStoryCard() {
  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        /* Phone aspect ratio — IG story is 9:16 */
        width: "min(340px, 90vw)",
        aspectRatio: "9 / 16",
        borderRadius: "18px",
        /* IG story dark background */
        background: "#0a0a0a",
        /* Subtle phone-style shadow */
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.8)",
      }}
    >
      {/* ── Story progress bar (single story = one full bar) ── */}
      <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
        <div className="flex-1 h-[2.5px] rounded-full overflow-hidden bg-white/25">
          <div
            className="h-full bg-white rounded-full"
            style={{ width: "72%" }} // paused mid-story
          />
        </div>
      </div>

      {/* ── Header row ── */}
      <div className="absolute top-7 left-3 right-3 z-20 flex items-center gap-2.5">
        {/* Profile picture */}
        <div
          className="flex-shrink-0 rounded-full flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
            padding: "2px",
          }}
        >
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <LogoE size={28} />
          </div>
        </div>

        {/* Name + time + location */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold text-[13px] leading-tight">
              entourageclo__
            </span>
            <span className="text-white/55 text-[12px]">· 1h</span>
          </div>
          {/* Music indicator */}
          <div className="flex items-center gap-1 mt-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white" opacity="0.7">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <span className="text-white/60 text-[10px] truncate">
              Rønhöff, Qualista · Magical Place
            </span>
            <span className="text-white/40 text-[10px]">›</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="opacity-70">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
          <button className="opacity-70">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Factory image ── */}
      <div className="absolute inset-0">
        <img
          src="/braga-factory.png"
          alt="Braga textile factory — Entourage sourcing visit"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        {/* Slight dark gradient at top/bottom for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.3) 100%)",
          }}
        />
      </div>

      {/* ── Location tag inside photo ── */}
      <div className="absolute z-20" style={{ bottom: "22%", right: "5%" }}>
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "white" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Braga, Portugal
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 pt-2">
        {/* Send message pill */}
        <div
          className="flex items-center px-4 py-2.5 rounded-full mb-2"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)" }}
        >
          <span className="text-white/45 text-[13px] flex-1">Send message...</span>
          <div className="flex items-center gap-4 ml-2">
            {/* Heart */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" opacity="0.7">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {/* Share */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" opacity="0.7">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Portugal section ────────────────────────────────── */
export function Portugal() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-pt-reveal]",
        { y: 45, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
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
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div data-pt-reveal className="text-[10px] tracking-[0.45em] uppercase text-white/25 mb-8">
          ATELIER — BRAGA, PORTUGAL
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-20">
          {/* Left: copy */}
          <div className="flex-1 max-w-lg">
            <h2
              data-pt-reveal
              className="text-[clamp(2.8rem,6vw,5.5rem)] text-white font-black leading-none tracking-tight mb-8"
              style={{ fontFamily: "var(--font-display-google), sans-serif" }}
            >
              BORN<br />FROM<br />CRAFT
            </h2>

            <p
              data-pt-reveal
              className="text-white/50 text-[clamp(0.9rem,1.4vw,1.05rem)] leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-serif-google), serif", fontStyle: "italic" }}
            >
              Every Entourage piece begins before the cut.
              We sourced the fabric ourselves — from Braga,
              a city built on centuries of textile mastery,
              where industrial knitting machines run 24 hours
              and quality is non-negotiable.
            </p>

            <p
              data-pt-reveal
              className="text-white/35 text-[clamp(0.82rem,1.2vw,0.95rem)] leading-relaxed mb-10"
              style={{ fontFamily: "var(--font-body-google), sans-serif" }}
            >
              Drop 01 is made in this facility. 100 pieces.
              Atelier grade. No compromises.
            </p>

            <div data-pt-reveal className="flex items-center gap-4">
              <div className="w-8 h-px bg-white/15" />
              <span className="text-[9px] tracking-[0.4em] uppercase text-white/20">
                Made in Portugal · Drop 01
              </span>
            </div>
          </div>

          {/* Right: IG story card */}
          <div data-pt-reveal className="flex-shrink-0 flex flex-col items-center gap-4">
            <IGStoryCard />

            {/* Caption below card */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/entourageclo__/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.35em] uppercase text-white/30 hover:text-white transition-colors duration-300"
              >
                @entourageclo__
              </a>
              <span className="text-white/15 text-[10px]">·</span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/18">
                Braga, Portugal · 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

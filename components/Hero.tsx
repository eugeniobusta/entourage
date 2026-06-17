"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ParticleCanvas } from "./ParticleCanvas";

export function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      headingRef.current,
      { y: 140, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.3, ease: "power4.out" }
    )
      .fromTo(
        taglineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.7"
      )
      .fromTo(
        metaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* 3D particle field */}
      <ParticleCanvas />

      {/* Radial vignette — pulls focus to center */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Top meta bar */}
      <div className="absolute top-8 left-8 right-8 flex justify-between text-[10px] tracking-[0.38em] uppercase text-white/30 z-10 pointer-events-none">
        <span>ENTOURAGE</span>
        <span>EST. 2026</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 select-none">
        <div className="overflow-hidden">
          <h1
            ref={headingRef}
            className="text-[clamp(4.5rem,16vw,15rem)] leading-none tracking-[-0.02em] text-white font-black"
            style={{ fontFamily: "var(--font-display-google), sans-serif" }}
          >
            ENTOURAGE
          </h1>
        </div>

        <p
          ref={taglineRef}
          className="mt-7 text-[clamp(0.65rem,1.3vw,0.9rem)] tracking-[0.42em] uppercase text-white/45 font-light"
          style={{ fontFamily: "var(--font-body-google), sans-serif" }}
        >
          A Collective Built Around The Individual
        </p>

        <div
          ref={metaRef}
          className="mt-10 flex items-center justify-center gap-5 text-[10px] tracking-[0.3em] uppercase text-white/25"
        >
          <span>Drop 01</span>
          <span className="w-6 h-px bg-white/20" />
          <span>Late 2026</span>
          <span className="w-6 h-px bg-white/20" />
          <span>N° — / 100</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10 pointer-events-none"
      >
        <div className="relative w-px h-14 bg-white/10 overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-white/50"
            style={{
              height: "40%",
              animation: "scroll-line 1.8s ease-in-out infinite",
            }}
          />
        </div>
        <span className="text-[9px] tracking-[0.4em] uppercase text-white/25">
          Scroll
        </span>
      </div>

      <style>{`
        @keyframes scroll-line {
          0%   { transform: translateY(-100%); opacity: 0; }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

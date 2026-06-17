"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const WireframeSphere = dynamic(
  () => import("./WireframeSphere").then((m) => ({ default: m.WireframeSphere })),
  { ssr: false }
);

const WORDS = ["Art.", "Culture.", "Design."];

export function Values() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* Label fade in */
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );

      /* Words cascade */
      gsap.fromTo(
        ".value-word",
        { y: 110, opacity: 0, rotateX: 12 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.18,
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );

      /* Sub text */
      gsap.fromTo(
        subRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          delay: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="values"
      className="min-h-screen flex flex-col items-center justify-center py-36 px-8 bg-black text-center relative overflow-hidden"
    >
      {/* Subtle sphere */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden lg:block opacity-30 pointer-events-none">
        <WireframeSphere size={320} />
      </div>

      <div
        ref={labelRef}
        className="text-[10px] tracking-[0.45em] uppercase text-white/25 mb-16"
      >
        BUILT ON —
      </div>

      <div className="perspective-[1200px]">
        {WORDS.map((word) => (
          <div key={word} className="overflow-hidden">
            <div
              className="value-word text-[clamp(3.8rem,11vw,10.5rem)] text-white leading-[1.02] will-change-transform"
              style={{
                fontFamily: "var(--font-serif-google), serif",
                fontStyle: "italic",
              }}
            >
              {word}
            </div>
          </div>
        ))}
      </div>

      <div ref={subRef} className="mt-16 space-y-2">
        <p
          className="text-white/35 text-[clamp(0.85rem,1.5vw,1.1rem)] tracking-wide"
          style={{ fontFamily: "var(--font-body-google), sans-serif" }}
        >
          A collective for anyone who shares the values.
        </p>
        <p className="text-[10px] tracking-[0.4em] uppercase text-white/18">
          SHARED VALUES
        </p>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const WireframeSphere = dynamic(
  () => import("./WireframeSphere").then((m) => ({ default: m.WireframeSphere })),
  { ssr: false }
);

export function ThePromise() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* Slow infinite rotation */
    gsap.to(logoRef.current, {
      rotation: 360,
      duration: 22,
      ease: "none",
      repeat: -1,
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-promise-reveal]",
        { y: 55, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center py-36 px-8 bg-black text-center relative overflow-hidden"
    >
      {/* Giant background E */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ opacity: 0.018 }}
      >
        <span
          className="text-white leading-none"
          style={{
            fontSize: "55vw",
            fontFamily: "var(--font-serif-google), serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          E
        </span>
      </div>

      {/* Wireframe sphere — left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-20 hidden lg:block">
        <WireframeSphere size={280} />
      </div>

      {/* Rotating logo mark */}
      <div data-promise-reveal ref={logoRef} className="mb-10">
        <div className="w-14 h-14 border border-white/25 rounded-full flex items-center justify-center">
          <span
            className="text-white text-xl font-bold italic leading-none"
            style={{ fontFamily: "var(--font-serif-google), serif" }}
          >
            E
          </span>
        </div>
      </div>

      {/* Label */}
      <div
        data-promise-reveal
        className="text-[10px] tracking-[0.45em] uppercase text-white/25 mb-10"
      >
        THE PROMISE
      </div>

      {/* Quote */}
      <blockquote
        data-promise-reveal
        className="text-[clamp(1.3rem,2.9vw,2.4rem)] text-white leading-relaxed max-w-3xl"
        style={{ fontFamily: "var(--font-serif-google), serif" }}
      >
        &ldquo;When you wear Entourage, you step into your role as the person
        leading the vision.&rdquo;
      </blockquote>

      {/* Number */}
      <div
        data-promise-reveal
        className="mt-14 text-[10px] tracking-[0.4em] uppercase text-white/20"
      >
        N° — / 100
      </div>
    </section>
  );
}

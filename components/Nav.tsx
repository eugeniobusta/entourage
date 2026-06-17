"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      start: "top -60",
      onEnter: () => {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(24px)",
          borderBottomColor: "rgba(255,255,255,0.06)",
          duration: 0.5,
          ease: "power2.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(0,0,0,0)",
          backdropFilter: "blur(0px)",
          borderBottomColor: "rgba(255,255,255,0)",
          duration: 0.5,
          ease: "power2.out",
        });
      },
    });
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] px-7 py-5 flex items-center justify-between border-b border-transparent"
      style={{ transition: "none" }}
    >
      {/* Left: handle */}
      <div
        className="text-[10px] tracking-[0.35em] uppercase text-white/35 hover:text-white/70 transition-colors duration-300"
        style={{ cursor: "none" }}
      >
        @entourageclo__
      </div>

      {/* Center: links */}
      <div className="hidden md:flex items-center gap-10 text-[10px] tracking-[0.35em] uppercase text-white/40">
        <button
          onClick={() => scrollTo("brand")}
          className="hover:text-white transition-colors duration-300"
        >
          The Brand
        </button>
        <button
          onClick={() => scrollTo("values")}
          className="hover:text-white transition-colors duration-300"
        >
          Values
        </button>
        <button
          onClick={() => scrollTo("waitlist")}
          className="hover:text-white transition-colors duration-300 border border-white/20 px-4 py-1.5 hover:border-white/60"
        >
          Drop 01
        </button>
      </div>

      {/* Right: logo mark */}
      <div
        className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center hover:border-white/60 transition-colors duration-300"
        style={{ cursor: "none" }}
      >
        <span
          className="text-white text-base font-bold leading-none italic"
          style={{ fontFamily: "var(--font-serif-google), serif" }}
        >
          E
        </span>
      </div>
    </nav>
  );
}

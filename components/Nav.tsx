"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoE } from "./LogoE";

export function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      start: "top -60",
      onEnter: () => {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(0,0,0,0.80)",
          backdropFilter: "blur(24px)",
          borderBottomColor: "rgba(255,255,255,0.06)",
          duration: 0.5,
        });
      },
      onLeaveBack: () => {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(0,0,0,0)",
          backdropFilter: "blur(0px)",
          borderBottomColor: "rgba(255,255,255,0)",
          duration: 0.5,
        });
      },
    });
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] px-7 py-4 flex items-center justify-between border-b border-transparent"
    >
      {/* Left: handle */}
      <div className="text-[10px] tracking-[0.35em] uppercase text-white/30 hover:text-white/60 transition-colors duration-300">
        @entourageclo__
      </div>

      {/* Center: nav links */}
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
          className="hover:text-white transition-colors duration-300 border border-white/20 px-4 py-1.5 hover:border-white/50"
        >
          Drop 01
        </button>
      </div>

      {/* Right: brand logo */}
      <LogoE size={32} />
    </nav>
  );
}

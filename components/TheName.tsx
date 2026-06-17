"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function TheName() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reveals = sectionRef.current?.querySelectorAll("[data-reveal]") ?? [];

    reveals.forEach((el, i) => {
      const inner = el.querySelector("[data-inner]") ?? el;

      gsap.fromTo(
        inner,
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="brand"
      className="min-h-screen flex flex-col justify-center py-36 px-8 md:px-16 lg:px-28 bg-black"
    >
      <div className="max-w-5xl">
        {/* Label */}
        <div data-reveal className="mb-20">
          <span className="text-[10px] tracking-[0.45em] uppercase text-white/25">
            THE NAME
          </span>
        </div>

        {/* EN·tour·age */}
        <div data-reveal className="clip-text-wrap mb-4">
          <h2
            data-inner
            className="text-[clamp(3rem,8.5vw,7.5rem)] text-white leading-none"
            style={{ fontFamily: "var(--font-serif-google), serif" }}
          >
            EN
            <span className="text-white/20 mx-1">·</span>
            tour
            <span className="text-white/20 mx-1">·</span>
            age
          </h2>
        </div>

        {/* IPA */}
        <div data-reveal className="mb-14">
          <p
            className="text-[clamp(0.85rem,1.4vw,1rem)] text-white/30 italic"
            style={{ fontFamily: "var(--font-serif-google), serif" }}
          >
            /ɒnˈtʊərɑːʒ/ &nbsp;&nbsp; NOUN
          </p>
        </div>

        {/* Definition */}
        <div data-reveal className="mb-14 max-w-2xl">
          <p
            className="text-[clamp(1.15rem,2.3vw,1.9rem)] text-white/70 leading-relaxed italic"
            style={{ fontFamily: "var(--font-serif-google), serif" }}
          >
            A group of people surrounding and supporting an important or
            influential person.
          </p>
        </div>

        {/* Divider */}
        <div data-reveal className="w-14 h-px bg-white/15 mb-14" />

        {/* Closer */}
        <div data-reveal className="clip-text-wrap">
          <p
            data-inner
            className="text-[clamp(1.6rem,3.5vw,2.8rem)] text-white font-bold"
            style={{ fontFamily: "var(--font-serif-google), serif" }}
          >
            — That person is you.
          </p>
        </div>

        {/* Footer meta */}
        <div data-reveal className="mt-28">
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/15">
            N° — / 100
          </span>
        </div>
      </div>
    </section>
  );
}

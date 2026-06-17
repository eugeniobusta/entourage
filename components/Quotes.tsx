"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const QUOTES = [
  {
    label: "THE TRUTH",
    main: "Everyone is pursuing something.",
    italic: "Everyone is building something.",
    num: "N° — / 100",
  },
  {
    label: "THE INDIVIDUAL",
    main: "There is only one of you.",
    italic: "That is the entire point.",
    num: "N° — / 100",
  },
  {
    label: "@ENTOURAGE",
    main: "Every entourage has a visionary at the centre.",
    italic: "You're it.",
    num: "EST. 2026",
  },
];

export function Quotes() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollAmount = totalWidth - viewportWidth;

      gsap.to(track, {
        x: -scrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollAmount}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="h-screen overflow-hidden bg-black">
      <div ref={trackRef} className="flex h-full will-change-transform">
        {QUOTES.map((q, i) => (
          <div
            key={i}
            className="quote-panel flex-shrink-0 w-screen h-full flex flex-col items-center justify-center px-8 md:px-20 relative border-r border-white/[0.06] last:border-r-0"
          >
            {/* Panel number */}
            <div className="absolute top-8 left-8 text-[10px] tracking-[0.4em] uppercase text-white/20">
              0{i + 1} / 0{QUOTES.length}
            </div>

            <div className="text-center max-w-3xl">
              <p
                className="text-[clamp(1.7rem,3.8vw,3.3rem)] text-white leading-tight font-bold mb-8"
                style={{ fontFamily: "var(--font-serif-google), serif" }}
              >
                {q.main}
              </p>
              <div className="w-12 h-px bg-white/20 mx-auto mb-8" />
              <p
                className="text-[clamp(1.3rem,2.8vw,2.4rem)] text-white/45 italic leading-tight"
                style={{ fontFamily: "var(--font-serif-google), serif" }}
              >
                {q.italic}
              </p>
            </div>

            {/* Bottom meta */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px] tracking-[0.35em] uppercase text-white/20">
              <span>{q.label}</span>
              <span>{q.num}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 90;

    const tick = () => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 2.5);
      const next = Math.min(Math.floor(eased * 100), 100);
      setCount(next);

      if (barRef.current) {
        gsap.to(barRef.current, { scaleX: eased, duration: 0 });
      }

      if (frame < totalFrames) {
        setTimeout(tick, 18);
      } else {
        setTimeout(() => {
          gsap.to(loaderRef.current, {
            yPercent: -100,
            duration: 1.4,
            ease: "power4.inOut",
            onComplete,
          });
        }, 350);
      }
    };

    const startTimeout = setTimeout(tick, 120);
    return () => clearTimeout(startTimeout);
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
    >
      {/* Top label */}
      <div className="absolute top-8 left-8 right-8 flex justify-between text-[11px] tracking-[0.35em] uppercase text-white/25">
        <span>ENTOURAGE</span>
        <span>EST. 2026</span>
      </div>

      {/* Main heading */}
      <div className="overflow-hidden mb-10">
        <h1
          className="text-[clamp(3.5rem,11vw,9rem)] font-display font-black leading-none tracking-tight text-white"
          style={{ fontFamily: "var(--font-display-google), sans-serif" }}
        >
          ENTOURAGE
        </h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-5">
        <div className="w-40 h-px bg-white/10 relative overflow-hidden">
          <div
            ref={barRef}
            className="absolute inset-0 bg-white origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <span className="text-[11px] font-mono text-white/40 tabular-nums w-6">
          {count}
        </span>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-8 text-[10px] tracking-[0.4em] uppercase text-white/15">
        Drop 01 · Late 2026
      </div>
    </div>
  );
}

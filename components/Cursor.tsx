"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if ("ontouchstart" in window) {
      setIsTouch(true);
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const onMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    const expandCursor = () => {
      gsap.to(ring, { scale: 2.2, opacity: 0.4, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 0, duration: 0.15 });
    };

    const contractCursor = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 1, duration: 0.15 });
    };

    const hideCursor = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    const showCursor = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", showCursor);

    const refreshInteractables = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", expandCursor);
        el.addEventListener("mouseleave", contractCursor);
      });
    };

    refreshInteractables();
    const observer = new MutationObserver(refreshInteractables);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", showCursor);
      observer.disconnect();
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full z-[10000] pointer-events-none mix-blend-difference"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 border border-white/60 rounded-full z-[10000] pointer-events-none mix-blend-difference"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}

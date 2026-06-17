"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { TheName } from "@/components/TheName";
import { Values } from "@/components/Values";
import { Quotes } from "@/components/Quotes";
import { ThePromise } from "@/components/ThePromise";
import { Drop01 } from "@/components/Drop01";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";

const Loader = dynamic(
  () => import("@/components/Loader").then((m) => ({ default: m.Loader })),
  { ssr: false }
);

export default function HomePage() {
  const [ready, setReady] = useState(false);

  /* Lenis smooth scroll — must run client-side after mount */
  useEffect(() => {
    let lenis: import("lenis").default | null = null;

    (async () => {
      const { default: Lenis } = await import("lenis");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ duration: 1.25 });

      lenis.on("scroll", () => ScrollTrigger.update());

      const tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Custom cursor */}
      <Cursor />

      {/* Loading screen */}
      {!ready && <Loader onComplete={() => setReady(true)} />}

      {/* Page content */}
      <main
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <Nav />
        <Hero />
        <Marquee />
        <TheName />
        <Values />
        <Quotes />
        <ThePromise />
        <Drop01 />
        <Footer />
      </main>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TheName } from "@/components/TheName";
import { Values } from "@/components/Values";
import { Quotes } from "@/components/Quotes";
import { ThePromise } from "@/components/ThePromise";
import { Drop01 } from "@/components/Drop01";
import { Footer } from "@/components/Footer";

const Loader = dynamic(
  () => import("@/components/Loader").then((m) => ({ default: m.Loader })),
  { ssr: false }
);

export default function HomePage() {
  const [ready, setReady] = useState(false);

  /* Lenis smooth scroll — client-side only */
  useEffect(() => {
    let lenisInstance: import("lenis").default | null = null;

    (async () => {
      const { default: Lenis } = await import("lenis");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      lenisInstance = new Lenis({ duration: 1.25 });
      lenisInstance.on("scroll", () => ScrollTrigger.update());

      const tick = (time: number) => lenisInstance!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  return (
    <>
      {/* Film grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Loading screen */}
      {!ready && <Loader onComplete={() => setReady(true)} />}

      {/* Main page */}
      <main
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <Nav />
        <Hero />
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

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Drop01() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-drop-reveal]",
        { y: 65, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.13,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrMsg(data.message ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrMsg("Network error. Please try again.");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="waitlist"
      className="min-h-screen flex flex-col items-center justify-center py-36 px-8 bg-black text-center border-t border-white/[0.07]"
    >
      {/* Eyebrow */}
      <div
        data-drop-reveal
        className="text-[10px] tracking-[0.45em] uppercase text-white/25 mb-8"
      >
        DROP 01
      </div>

      {/* Big date */}
      <div className="overflow-hidden" data-drop-reveal>
        <h2
          className="text-[clamp(4rem,15vw,13rem)] text-white font-black leading-none tracking-tight"
          style={{ fontFamily: "var(--font-display-google), sans-serif" }}
        >
          LATE 2026
        </h2>
      </div>

      {/* Sub */}
      <p
        data-drop-reveal
        className="mt-4 text-[10px] tracking-[0.35em] uppercase text-white/30 mb-2"
      >
        Limited to 100 pieces worldwide
      </p>

      <p
        data-drop-reveal
        className="text-[clamp(1rem,1.8vw,1.35rem)] text-white/55 italic mb-16 leading-relaxed"
        style={{ fontFamily: "var(--font-serif-google), serif" }}
      >
        Every entourage has a visionary at the centre.
        <br />
        <em>You&rsquo;re it.</em>
      </p>

      {/* Form / Success */}
      {status !== "success" ? (
        <form
          data-drop-reveal
          onSubmit={handleSubmit}
          className="w-full max-w-md"
        >
          <div className="flex border border-white/20 focus-within:border-white/45 transition-colors duration-400">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-5 py-4 text-white text-sm tracking-wide placeholder:text-white/20 outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-4 text-[10px] tracking-[0.35em] uppercase text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300 border-l border-white/20 whitespace-nowrap disabled:opacity-40"
            >
              {status === "loading" ? "Joining…" : "Join the Circle"}
            </button>
          </div>

          {status === "error" && (
            <p className="mt-3 text-xs text-red-400/60">{errMsg}</p>
          )}

          <p className="mt-5 text-[9px] tracking-[0.3em] uppercase text-white/18">
            Be first. No spam. Ever.
          </p>
        </form>
      ) : (
        <div data-drop-reveal className="text-center">
          <p
            className="text-[clamp(1.3rem,2.5vw,2rem)] text-white italic mb-3"
            style={{ fontFamily: "var(--font-serif-google), serif" }}
          >
            You&rsquo;re in the circle.
          </p>
          <p className="text-white/35 text-sm tracking-wide">
            We&rsquo;ll reach out when Drop 01 is ready.
          </p>
        </div>
      )}
    </section>
  );
}

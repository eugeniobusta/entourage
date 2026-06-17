"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

const StudioScene = dynamic(
  () => import("./scenes/StudioScene").then((m) => ({ default: m.StudioScene })),
  { ssr: false }
);
const ParticleField = dynamic(
  () => import("./scenes/ParticleField").then((m) => ({ default: m.ParticleField })),
  { ssr: false }
);
const GeometricScene = dynamic(
  () => import("./scenes/GeometricScene").then((m) => ({ default: m.GeometricScene })),
  { ssr: false }
);

type Scene = "studio" | "cosmos" | "geometric";

const SCENES: { id: Scene; label: string; desc: string }[] = [
  { id: "studio",    label: "01", desc: "STUDIO"  },
  { id: "cosmos",    label: "02", desc: "COSMOS"  },
  { id: "geometric", label: "03", desc: "FORM"    },
];

export function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const formRef    = useRef<HTMLDivElement>(null);
  const metaRef    = useRef<HTMLDivElement>(null);

  const [activeScene, setActiveScene] = useState<Scene>("studio");
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errMsg, setErrMsg] = useState("");

  /* Text is dark (black) when on the studio/light background */
  const isLight = activeScene === "studio";
  const textMain  = isLight ? "text-black"          : "text-white";
  const textMuted = isLight ? "text-black/45"        : "text-white/45";
  const textFaint = isLight ? "text-black/30"        : "text-white/30";
  const inputBg   = isLight ? "bg-white/70"          : "bg-transparent";
  const border    = isLight ? "border-black/20 focus-within:border-black/50"
                            : "border-white/20 focus-within:border-white/50";
  const btnHover  = isLight ? "hover:bg-black/[0.06]" : "hover:bg-white/[0.05]";
  const switcherActive   = "opacity-100";
  const switcherInactive = isLight ? "opacity-25 hover:opacity-55" : "opacity-22 hover:opacity-55";
  const barColor  = isLight ? "bg-black/50"          : "bg-white/50";

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(headingRef.current,
      { y: 130, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.3, ease: "power4.out" }
    )
    .fromTo(taglineRef.current,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.75"
    )
    .fromTo(formRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(metaRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      "-=0.4"
    );
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
      if (res.ok) { setStatus("success"); setEmail(""); }
      else { setStatus("error"); setErrMsg(data.message ?? "Something went wrong."); }
    } catch {
      setStatus("error");
      setErrMsg("Network error. Please try again.");
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* 3D Scenes */}
      {activeScene === "studio"    && <StudioScene />}
      {activeScene === "cosmos"    && <ParticleField />}
      {activeScene === "geometric" && <GeometricScene />}

      {/* Dark vignette at edges — makes text readable on all scenes */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(255,255,255,0.12) 100%)"
            : "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 15%, rgba(0,0,0,0.62) 100%)",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 text-center px-6 select-none">
        <div className="overflow-hidden">
          <h1
            ref={headingRef}
            className={`text-[clamp(4.5rem,16vw,15rem)] leading-none tracking-[-0.01em] font-black ${textMain}`}
            style={{ fontFamily: "var(--font-display-google), sans-serif" }}
          >
            ENTOURAGE
          </h1>
        </div>

        <p
          ref={taglineRef}
          className={`mt-5 text-[clamp(0.6rem,1.2vw,0.85rem)] tracking-[0.42em] uppercase font-light ${textMuted}`}
          style={{ fontFamily: "var(--font-body-google), sans-serif" }}
        >
          A Collective Built Around The Individual
        </p>

        {/* ── Waitlist ── */}
        <div ref={formRef} className="mt-10">
          {status !== "success" ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
              <p className={`text-[9px] tracking-[0.45em] uppercase mb-1 ${textFaint}`}>
                Drop 01 Waitlist — Late 2026 · 100 Pieces
              </p>
              <div className={`flex w-full max-w-sm border backdrop-blur-sm ${inputBg} ${border} transition-colors duration-300`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className={`flex-1 bg-transparent px-5 py-3.5 text-sm outline-none min-w-0 ${textMain} placeholder:opacity-30`}
                  style={{ fontFamily: "var(--font-body-google), sans-serif" }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={`px-5 py-3.5 text-[9px] tracking-[0.35em] uppercase ${textMuted} ${btnHover} transition-all duration-300 border-l ${isLight ? "border-black/15" : "border-white/20"} whitespace-nowrap disabled:opacity-40`}
                >
                  {status === "loading" ? "…" : "Notify Me"}
                </button>
              </div>
              {status === "error" && <p className="text-xs text-red-500/80">{errMsg}</p>}
              <p className={`text-[8px] tracking-[0.28em] uppercase ${textFaint} opacity-60`}>
                You&rsquo;ll be the first to know. No spam.
              </p>
            </form>
          ) : (
            <div className="text-center">
              <p
                className={`text-lg italic ${textMain}`}
                style={{ fontFamily: "var(--font-serif-google), serif" }}
              >
                You&rsquo;re in the circle.
              </p>
              <p className={`text-xs tracking-wide mt-1 ${textMuted}`}>
                We&rsquo;ll notify you before Drop 01 goes live.
              </p>
            </div>
          )}
        </div>

        {/* Limited badge */}
        <div ref={metaRef} className={`mt-6 text-[9px] tracking-[0.32em] uppercase ${textFaint} opacity-60`}>
          EST. 2026 &nbsp;·&nbsp; N° — / 100
        </div>
      </div>

      {/* ── Scene switcher ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 z-10">
        {SCENES.map(({ id, label, desc }) => (
          <button
            key={id}
            onClick={() => setActiveScene(id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeScene === id ? switcherActive : switcherInactive
            }`}
          >
            <span className={`text-[9px] font-mono tracking-widest ${activeScene === "studio" ? "text-black" : "text-white"}`}>{label}</span>
            <span className={`text-[7px] tracking-[0.38em] uppercase ${activeScene === "studio" ? "text-black/55" : "text-white/55"}`}>{desc}</span>
            {activeScene === id && <span className={`w-4 h-px mt-0.5 ${barColor}`} />}
          </button>
        ))}
      </div>
    </section>
  );
}

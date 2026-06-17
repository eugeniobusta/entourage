"use client";

const TEXT =
  "A Collective Built Around The Individual · Art Is Everywhere · EST. 2026 · Contemporary Luxury · Atelier Made Garments · Drop 01 · Late 2026 · ";

export function Marquee() {
  return (
    <div className="w-full overflow-hidden border-y border-white/[0.07] py-[13px] bg-black">
      <div className="flex whitespace-nowrap">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="animate-marquee shrink-0 text-[10px] tracking-[0.32em] uppercase text-white/30 pr-0"
          >
            {TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}

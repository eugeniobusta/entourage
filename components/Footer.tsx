export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] px-8 py-16 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
        {/* Brand */}
        <div>
          <div
            className="text-[clamp(2.5rem,6vw,5rem)] text-white font-black leading-none tracking-tight"
            style={{ fontFamily: "var(--font-display-google), sans-serif" }}
          >
            ENTOURAGE
          </div>
          <div className="text-[10px] tracking-[0.38em] uppercase text-white/25 mt-3">
            Contemporary Luxury · Atelier Made Garments
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start md:items-end gap-3 text-[10px] tracking-[0.35em] uppercase">
          <a
            href="https://instagram.com/entourageclo__"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35 hover:text-white transition-colors duration-300"
          >
            @entourageclo__
          </a>
          <span className="text-white/18">EST. 2026</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] tracking-[0.28em] uppercase text-white/12">
        <span>&copy; 2026 Entourage. All rights reserved.</span>
        <span>ART IS EVERYWHERE</span>
      </div>
    </footer>
  );
}

# ENTOURAGE — Project Reference

Contemporary luxury clothing brand website. Client: ENTOURAGE (@entourageclo__).
Built for professional launch, future e-commerce integration.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (no config file — uses `@theme inline` in globals.css) |
| 3D | Three.js (raw, no React Three Fiber — all in `useEffect` client components) |
| Animation | GSAP + ScrollTrigger, Lenis smooth scroll |
| Fonts | Barlow Condensed (display), Playfair Display (serif), Space Grotesk (body) |
| Database | Supabase (waitlist emails) |
| Email | Resend (confirmation emails) |
| Deployment | Vercel → https://entourage-sigma.vercel.app |
| Repo | https://github.com/eugeniobusta/entourage |

---

## Brand Identity

- **Name**: ENTOURAGE — "A collective built around the individual"
- **Tagline**: "A Collective Built Around The Individual"
- **Slogan**: "ART IS EVERYWHERE"
- **Est.**: 2026
- **Drop 01**: Late 2026 — limited to 100 pieces worldwide (N° __ / 100)
- **IG**: @entourageclo__ → https://www.instagram.com/entourageclo__/
- **Color palette**: Pure black #000, pure white #fff, muted #555, accent #888
- **Tone**: editorial luxury, mysterious, individual-focused
- **Key quotes used on site**:
  - "Every entourage has a visionary at the centre. You're it."
  - "There is only one of you. That is the entire point."
  - "When you wear Entourage, you step into your role as the person leading the vision."
  - "Everyone is pursuing something. Everyone is building something."
  - Built on Art. Culture. Design.

---

## File Structure

```
entourage/
├── app/
│   ├── layout.tsx          # Fonts (Barlow Condensed, Playfair, Space Grotesk), metadata
│   ├── page.tsx            # Main page — 'use client', Lenis setup, section assembly
│   ├── globals.css         # Tailwind v4 @theme, grain overlay, marquee keyframes
│   ├── admin/
│   │   └── page.tsx        # Password-protected waitlist dashboard
│   └── api/
│       ├── waitlist/route.ts        # POST — saves email to Supabase, sends Resend email
│       └── admin/waitlist/route.ts  # GET — returns all signups (password protected)
├── components/
│   ├── Hero.tsx            # Hero section — 3D scene switcher, waitlist form, GSAP reveal
│   ├── Nav.tsx             # Fixed nav — @handle links to IG, LogoE mark, scroll-trigger blur
│   ├── Loader.tsx          # Loading screen — counter 0–100, "ENTOURAGE" text, slide-up exit
│   ├── LogoE.tsx           # SVG brand logo — bold italic E + 4-pointed sparkle star
│   ├── TheName.tsx         # EN·tour·age definition section, scroll reveal
│   ├── Values.tsx          # Art. Culture. Design. stagger animation + wireframe sphere
│   ├── Quotes.tsx          # 3-panel GSAP horizontal scroll (pinned)
│   ├── ThePromise.tsx      # "When you wear Entourage…" quote section
│   ├── Drop01.tsx          # Second waitlist section with "LATE 2026" heading
│   ├── Portugal.tsx        # Braga factory visit — IG story card UI + brand copy
│   ├── Footer.tsx          # ENTOURAGE logotype, IG link, copyright
│   ├── WireframeSphere.tsx # Three.js icosahedron decoration (used in Values, ThePromise)
│   └── scenes/
│       ├── StudioScene.tsx   # [DEFAULT] Photo studio + cloth sim over hidden form
│       ├── ClothSim.tsx      # Pure cloth sim version (no studio environment)
│       ├── ParticleField.tsx # GPU starfield — 3500 particles, mouse repulsion shader
│       └── GeometricScene.tsx # Dual wireframe icosahedrons + orbiting particle ring
├── lib/
│   └── supabase.ts         # supabaseAdmin() factory (lazy — avoids build-time error)
├── public/
│   └── braga-factory.png   # Portugal factory image from @entourageclo__ IG story
└── supabase/
    └── setup.sql           # Run this in Supabase SQL Editor to create waitlist table
```

---

## Environment Variables

Copy `.env.local.example` → `.env.local` and fill in:

```bash
# Supabase — supabase.com → Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend — resend.com → API Keys
RESEND_API_KEY=

# Admin dashboard password — any string you choose
ADMIN_PASSWORD=entourage2026
```

**⚠️ REMINDER**: These env vars are NOT yet set in Vercel. Add them at:
vercel.com → eugeniobustas-projects/entourage → Settings → Environment Variables

Then redeploy once (or just push any commit — auto-deploys via GitHub).

---

## Supabase Setup

Run `supabase/setup.sql` in the Supabase SQL Editor. It creates:
```sql
CREATE TABLE waitlist (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text UNIQUE NOT NULL,
  source     text NOT NULL DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);
-- RLS: anon can INSERT, service_role can SELECT
```

---

## Admin Dashboard

URL: `/admin` (e.g. https://entourage-sigma.vercel.app/admin)
- Enter `ADMIN_PASSWORD` env var value to log in
- Shows all waitlist signups with date, count, spots remaining
- Export to CSV button
- Refresh button

The client (who doesn't code) uses this page to see waitlist signups.

---

## 3D Scene Architecture

All Three.js scenes are raw (no React Three Fiber) in `useEffect` client components.
**Never use SSR with these** — they're dynamically imported with `{ ssr: false }` in Hero.tsx.

### StudioScene (default hero background)
- White cyclorama backdrop via ShaderMaterial gradient: dark floor → cyc base → brilliant white → dark ceiling
- 4 hanging studio light fixtures (BoxGeometry housings + SpotLight objects)
- SpotLights cast shadows; cloth shadow falls on ShadowMaterial floor
- Cloth simulation: 30×24 grid, PBD (Position-Based Dynamics), 8 iterations
- 5 invisible collision spheres approximate a torso/mannequin form:
  `chest(0,0.3,-0.45,r=1.0)`, `left-shoulder(-1.0,0.65,-0.22,r=0.4)`, `right-shoulder(1.0,0.65,-0.22,r=0.4)`, `hips(0,-0.75,-0.3,r=0.72)`, `neck(0,0.95,-0.15,r=0.22)`
- 340 warmup steps run before first render → cloth arrives pre-settled

### ParticleField (02 COSMOS)
- 3500 particles in a wide 3D box
- All animation GPU-side via ShaderMaterial — no CPU physics
- Mouse repulsion computed in vertex shader (NDC space)
- `THREE.NormalBlending` — NOT additive (additive caused the white blob bug)

### GeometricScene (03 FORM)
- Two icosahedrons: outer (subdivision 2) + inner (subdivision 1), counter-rotating
- Edges-only wireframe via `THREE.EdgesGeometry` (not `wireframe: true`)
- 120-particle orbiting ring with pulsing shader
- Mouse influences rotation speed

---

## Hero Text Color System

The hero dynamically switches text color based on the active scene:
- **Studio scene** (light background): black text, frosted-glass input, dark borders
- **Cosmos / Form** (dark background): white text, transparent input, white borders

Controlled via `isLight` boolean in `Hero.tsx`.

---

## Fonts Setup (Tailwind v4 pattern)

In `layout.tsx`, next/font sets CSS variables:
```tsx
Barlow_Condensed  → variable: "--font-display-google"
Playfair_Display  → variable: "--font-serif-google"
Space_Grotesk     → variable: "--font-body-google"
```

In `globals.css`, mapped to Tailwind utilities:
```css
@theme inline {
  --font-display: var(--font-display-google);
  --font-serif:   var(--font-serif-google);
  --font-body:    var(--font-body-google);
}
```

Usage in components: always inline style for Three.js-unaffected components:
```tsx
style={{ fontFamily: "var(--font-display-google), sans-serif" }}
```

---

## Smooth Scroll (Lenis + GSAP)

Lenis is initialized in `app/page.tsx` via dynamic async import (avoids SSR):
```tsx
const lenis = new Lenis({ duration: 1.25 })
lenis.on("scroll", () => ScrollTrigger.update())
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

All GSAP ScrollTrigger usage must be inside `useEffect` with `gsap.registerPlugin(ScrollTrigger)`.

---

## Horizontal Scroll (Quotes section)

`components/Quotes.tsx` pins a section and scrolls 3 panels horizontally:
```tsx
gsap.to(track, {
  x: -scrollAmount,
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: () => `+=${scrollAmount}`,
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  }
})
```

---

## Portugal Section

`components/Portugal.tsx` contains an Instagram story UI replica:
- **Real image**: `public/braga-factory.png` — the @entourageclo__ story from Braga factory
- IG gradient profile ring, story progress bar, music indicator, geotag pill, send-message bar
- If client provides more photos, add them to `public/` and create additional `IGStoryCard` instances

---

## Deploy Commands

```bash
# Development
cd entourage
npm run dev

# Type check
npx tsc --noEmit

# Production build
npm run build

# Deploy to Vercel production
vercel --prod
```

Auto-deploys on every `git push` to `main` via GitHub ↔ Vercel integration.

---

## What's Pending (client must do)

1. **Set env vars in Vercel** (see Environment Variables section above)
2. **Create Supabase project** and run `setup.sql`
3. **Create Resend account** and get API key
4. **Add custom domain** in Vercel (when client has one)
5. **Connect Apple Sign-In** (future — not applicable for this web project)
6. **Add more Portugal photos** when available → drop in `public/`, update `Portugal.tsx`
7. **Replace waitlist with shop** when Drop 01 is ready (Shopify integration recommended)

---

## Known Design Decisions

- No custom cursor (removed — client didn't want it)
- No marquee strip (removed)
- No scroll indicator arrow (removed)
- ClothSim uses `NormalBlending` NOT `AdditiveBlending` — additive caused a blinding white blob
- Supabase clients are created lazily (inside functions) to avoid build-time errors
- Resend client created lazily inside the POST handler for same reason
- All Three.js scenes dynamically imported with `{ ssr: false }`
- Fonts used inline via CSS variables, not Tailwind classes, for reliability in Three.js-adjacent components

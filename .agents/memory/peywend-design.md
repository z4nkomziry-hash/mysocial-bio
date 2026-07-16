---
name: Peywend design system
description: Visual design decisions and CSS conventions for the Peywend app
---

## Dark landing page
The landing page (`artifacts/peywend/src/pages/landing.tsx`) wraps everything in `<div className="dark ...">` to force dark mode regardless of system preference. This is intentional — the marketing page is Beacons.ai-style dark.

## Dashboard
Dashboard pages use the normal theme (respects system light/dark). Theme is defined in `index.css` with HSL CSS variables.

## Key CSS utilities added (index.css)
- `.glass` — dark glassmorphism: `rgba(255,255,255,0.04)` + `backdrop-blur-24px`
- `.glass-light` — light glassmorphism: `rgba(255,255,255,0.70)` + `backdrop-blur-24px`
- `.grad-text` — violet→pink→orange gradient text using `background-clip: text`
- `.animate-blob-drift`, `.animate-blob-drift-2`, `.animate-blob-drift-3` — CSS keyframe blob animations
- `.animate-float-y`, `.animate-float-y-slow` — vertical floating
- `.animate-spin-slow` — 12s slow spin
- `.animate-shimmer` — moving shimmer sweep

## Color palette (dark mode)
- Primary: `258 90% 70%` (violet)
- Secondary: `328 80% 62%` (pink/rose)
- Background: `250 40% 7%` (near-black indigo)
- Card: `250 40% 9%`

**Why:** Matches Beacons.ai's deep purple/indigo brand while staying Kurdish-first.

## Framer motion pattern
All animated sections use `motion.div` with `whileInView={{ opacity: 1, y: 0 }}` and `viewport={{ once: true }}` for scroll-triggered entrance. Stagger via custom delay `i * 0.07`.

## Sidebar active state
Uses `motion.div` with `layoutId="sidebar-active"` for a smooth sliding pill animation between nav items. Same pattern for mobile tab bar with `layoutId="mobile-tab-active"`.

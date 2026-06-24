# Roda Keberuntungan Kelas — Project Progress

## Tech Stack
- Next.js 15 (App Router, `"type": "module"`)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion, Lucide React

## Project Structure

```
src/
├── app/
│   ├── globals.css          — Tailwind v4 theme, glass-card, toggle, animations
│   ├── layout.tsx           — Root layout (lang="id")
│   ├── page.tsx             — Main page (client component)
│   └── api/
│       └── challenge/
│           └── route.ts     — POST /api/challenge (AI soal via Gemini)
├── components/
│   └── ui/
│       └── social-button.tsx — Share button (WA, FB, copy link)
└── services/
    └── gemini.ts            — generateChallenge() untuk AI
```

## Completed Features

### Core Wheel
- Canvas-rendered prize wheel with configurable slices
- Retina/HiDPI support via `devicePixelRatio` scaling
- Adaptive font sizing based on number of slices
- Radial gradient center hub with decorative rings
- Drop shadow glow effect on wheel
- Confetti animation on winner

### Setup Materi Section
- Topik input, Jenjang select, Kelas/Smt select
- Grade options cascade based on level (SD/SMP/SMA/Univ)
- AI Challenge toggle with tooltip help
- Labels bound to inputs via `htmlFor`/`id`
- Consistent `px-4 py-3` touch targets

### Daftar Siswa Section
- Comma-separated textarea input
- "UPDATE RODA" button with refresh SVG icon
- Active scale feedback on tap

### Spin & Winner Modal
- SPIN button → PUTAR! with gradient + spinner SVG
- Eased cubic spin animation
- Winner modal with trophy icons + large name display
- Challenge card: loading spinner, question display, reveal answer
- Action buttons: TUTUP, HAPUS & LANJUT

### Social Share (bottom-right)
- Fixed floating button at `bottom-3 right-4`
- Expands upward with spring animation
- WhatsApp share (`wa.me/?text=...`)
- Facebook share (`sharer.php?u=...`)
- Copy link button with success state
- Click outside to close

### Welcome Popup
- Appears once on first visit (localStorage flag)
- Star icon + welcome message
- "Follow @hsmnandar" button (Instagram gradient)
- "Lewati" dismiss button

### Footer
- Watermark `© hasmunandar` (bottom-left)

## Design Decisions

### Color Palette (Tailwind v4 `@theme`)
| Token | Value |
|-------|-------|
| `brand-bg` | `#0f172a` (slate-900) |
| `brand-card` | `rgba(30,41,59,0.7)` |
| `brand-yellow` | `#facc15` |
| `brand-blue` | `#3b82f6` |
| `brand-green` | `#10b981` |
| `brand-red` | `#ef4444` |

### Background
- 3-layer radial gradients (blue top, green bottom-right, yellow bottom-left)
- `::-webkit-scrollbar` custom styling

### Glass Effect
- `.glass-card`: `blur(20px)`, soft border, box-shadow
- `.glass-card-glow`: `blur(24px)`, stronger shadow, inset highlight

### Animations
- `wheel-idle`: subtle ±1.5° wobble at 3.5s (only canvas, not pointer)
- `shimmer`: sweeping gradient on wheel container
- `prefers-reduced-motion`: all animations disabled
- Spring transitions for social menu expand

### CSS Classes Defined
- `.glass-card`, `.glass-card-glow` — card backgrounds
- `.text-glow-yellow` — title glow effect
- `.shimmer` — sweeping gradient overlay
- `.wheel-idle` — idle wobble keyframe
- `.toggle-track`, `.toggle-ball` — AI toggle switch

## Dead Code Removed
- `src/hooks/useImageUpload.ts` — never imported
- `src/lib/utils.ts` — `cn()` never called
- `src/app/api/ocr/route.ts` — broken (base64 not sent to API)
- `extractNamesFromImage()` from `gemini.ts` — same reason
- CSS: `--color-brand-border`, `.text-glow-blue`, `.high-contrast-text`
- Dependencies: `clsx`, `tailwind-merge` (removed, then re-added for social-button)

## Known Issues
- `package.json` has `"type": "module"` causing Next.js build data collection error (`/_not-found`). Compilation itself passes.
- Gemini API endpoint uses third-party proxy (`synoxcloud.xyz`), not direct Google AI.
- Wheel slice text clamped at 12 chars.

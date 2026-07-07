# SpinClass — Project Progress

## Tech Stack
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion, Lucide React
- Hosting: Vercel (Edge + Serverless)

## Live
- **Web:** https://spinclass.vercel.app/
- **Repo:** https://github.com/nandarjr660/wheel

## Project Structure

```
public/
├── favicon.svg                     — Icon roda (SVG)
├── googlee34068ee5ad7b22d.html     — Google Search Console verification
├── llms.txt                        — AI context file
├── robots.txt                      — Static AI bot rules (spinclass.vercel.app)
└── sitemap.xml                     — Static sitemap (spinclass.vercel.app)

src/
├── app/
│   ├── globals.css                 — Design tokens, CSS vars, light mode, animations
│   ├── layout.tsx                  — Root layout + JSON-LD + Google verification
│   ├── opengraph-image.tsx         — Dynamic OG image (Edge runtime)
│   ├── page.tsx                    — Main page (client component)
│   ├── robots.ts                   — Dynamic robots.txt fallback (VERCEL_URL aware)
│   ├── sitemap.ts                  — Dynamic sitemap.xml fallback (VERCEL_URL aware)
│   └── api/
│       └── challenge/
│           └── route.ts            — POST /api/challenge (AI soal via Gemini)
├── components/
│   └── ui/
│       └── social-button.tsx       — Share button (WA, FB, copy link)
└── services/
    └── gemini.ts                   — generateChallenge() untuk AI
```

## Completed Features

### Core Wheel
- Canvas-rendered prize wheel with configurable slices
- Retina/HiDPI support via `devicePixelRatio` scaling
- Adaptive font sizing based on number of slices
- Radial gradient center hub with decorative rings + drop shadow
- Confetti animation on winner
- `prefers-reduced-motion` support

### Setup Materi Section
- Topik input, Jenjang select, Kelas/Smt select (cascade)
- AI Challenge toggle (`role="switch"` + `aria-checked`)
- Labels bound via `htmlFor`/`id`, consistent `px-4 py-3` touch targets

### Daftar Siswa Section
- Comma-separated textarea input + "UPDATE RODA" button
- **Undo toast** — muncul 6 detik setelah hapus siswa, spring slide-in dari kanan

### Spin & Winner Modal
- PUTAR! button with gradient + spinner SVG, eased spin animation
- Winner modal: `role="dialog"` + `aria-modal`, **focus trap**, **Framer Motion** spring scale-in
- Challenge card: loading spinner, question, reveal answer, action buttons

### Social Share
- Floating button (`btn-social-main`) expandable via spring animation
- WhatsApp, Facebook, copy link (with success state + `btn-social-copy`)
- Click outside to close

### Welcome Popup
- Appears once on first visit (localStorage flag)
- Star icon + Instagram gradient button + "Lewati" dismiss
- **Framer Motion** spring scale-in/fade, tidak auto-dismiss (hanya via tombol)

### Dark / Light Mode
- Dark sebagai default, toggle manual (fixed top-right, class `btn-theme`)
- Semantic CSS variables di `:root` + `[data-theme="light"]`
- `@theme` override built-in Tailwind colors (`white`, `black`, `slate-*`, `blue-300`)
- Input/select/textarea, scrollbar, shimmer, toggle switch — semua theme-aware
- Light mode buttons: slate-200 surface, slate-300 border (kontras optimal)

### Aksesibilitas
- Toggle switch: `role="switch"` + `aria-checked`
- Winner modal: `role="dialog"` + `aria-modal` + focus trap (`useFocusTrap`)
- Canvas: `aria-label` untuk screen reader
- All interactive elements have `aria-label` or visible label

### SEO / GEO
- Meta tags, OG, Twitter Cards, JSON-LD (WebApplication, FAQPage, HowTo, Organization, Person)
- **Dynamic OG image** (`opengraph-image.tsx`) — gradient + teks, auto-generated
- **Static robots.txt** — allow all AI bots (GPTBot, ClaudeBot, PerplexityBot, dll)
- **Static sitemap.xml** — 4 entries dengan priority, URL `spinclass.vercel.app`
- **Dynamic fallback** robots/sitemap — pakai `VERCEL_URL` otomatis
- **Google Search Console** — file verification + meta tag terpasang
- **llms.txt** — AI context file untuk machine-readable summaries
- FAQ section + JSON-LD di halaman utama

### GitHub
- Repo inisialisasi, `.next`/`.vscode` di .gitignore
- Branch `main` terhubung ke `origin/main`
- Auto-deploy Vercel dari branch `main`

## Design System

### Color Tokens (Tailwind v4 `@theme`)
| Token | Dark | Light |
|-------|------|-------|
| `brand-bg` | `#0f172a` | `#f1f5f9` |
| `brand-card` | `rgba(30,41,59,0.7)` | `rgba(255,255,255,0.85)` |
| `brand-yellow` | `#facc15` | `#facc15` |
| `brand-blue` | `#3b82f6` | `#3b82f6` |
| `brand-green` | `#10b981` | `#10b981` |
| `brand-red` | `#ef4444` | `#ef4444` |

### CSS Classes Defined
- `.glass-card`, `.glass-card-glow` — card backgrounds with backdrop-blur
- `.text-glow-yellow` — title glow effect
- `.shimmer` — sweeping gradient overlay
- `.wheel-idle` — idle wobble keyframe
- `.toggle-track`, `.toggle-ball` — AI toggle switch
- `.btn-theme` — theme toggle (light mode override)
- `.btn-social-main`, `.btn-social-copy` — share buttons (light mode override)

### Animations (Framer Motion)
- **Welcome popup:** overlay fade 0.2s + spring scale 0.9→1
- **Winner modal:** overlay fade 0.2s + spring scale 0.85→1
- **Undo toast:** spring slide-in (x: 60→0), exit fade
- **Social menu:** spring expand with stagger
- All with `AnimatePresence` for exit animations

## Dead Code Removed
- `src/hooks/useImageUpload.ts` — never imported
- `src/lib/utils.ts` — `cn()` never called
- `src/app/api/ocr/route.ts` — broken
- `extractNamesFromImage()` from `gemini.ts`
- CSS: `--color-brand-border`, `.text-glow-blue`, `.high-contrast-text`
- CSS classes `animate-fade-in`, `animate-scale-in` (no-op, replaced by Framer Motion)
- Dependencies: `clsx`, `tailwind-merge`

## Known Issues
- Wheel slice text clamped at 12 chars
- Gemini API endpoint uses third-party proxy (`synoxcloud.xyz`), not direct Google AI

## Deployment Notes
- Push ke GitHub → Vercel auto-deploy dari branch `main`
- Static `robots.txt` / `sitemap.xml` di `public/` — selalu pakai URL `spinclass.vercel.app`
- Dynamic fallback sudah handle `VERCEL_URL` otomatis (tidak perlu env var)
- OG image di-generate Edge runtime via `next/og`
- Google Search Console: file + meta tag terpasang, tinggal submit sitemap

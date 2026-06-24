# 🎡 Roda Keberuntungan Kelas

Aplikasi web interaktif untuk memutar roda keberuntungan kelas dengan fitur AI-powered challenge menggunakan Google Gemini.

**🔗 Live Demo:** [wheelduc.vercel.app](https://wheelduc.vercel.app/)

## Fitur Utama

- **Roda Berputar Interaktif** — Canvas-rendered dengan kualitas Retina/HiDPI support
- **AI Challenge** — Soal otomatis dari Google Gemini berdasarkan topik dan jenjang
- **Multi Jenjang** — SD, SMP, SMA/SMK, dan Universitas
- **Confetti Animation** — Efek confetti meriah saat pemenang terpilih
- **Dark & Light Mode** — Theme toggle sesuai preferensi
- **Social Sharing** — Share ke WhatsApp dan Facebook
- **Responsive Design** — Tampilan optimal di mobile dan desktop

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React

## Cara Menggunakan

1. Buka aplikasi di browser
2. Masukkan nama-nama siswa dipisahkan dengan koma
3. Pilih jenjang (SD/SMP/SMA/Universitas) dan kelas
4. Input topik materi pelajaran
5. Aktifkan toggle "Tantangan AI" jika ingin soal dari AI
6. Klik tombol **PUTAR!** untuk memutar roda
7. Siswa terpilih akan mendapatkan tantangan AI

## Instalasi Lokal

```bash
# Clone repository
git clone https://github.com/nandarjr660/wheel.git

# Masuk ke direktori
cd wheel

# Install dependencies
npm install

# Buat file .env.local
cp .env.example .env.local

# Jalankan development server
npm run dev
```

Buka http://localhost:3000 di browser.

## Environment Variables

| Variable | Deskripsi | Required |
|----------|-----------|----------|
| `GEMINI_API_KEY` | API key Google Gemini | Ya |
| `NEXT_PUBLIC_APP_URL` | URL deployment app (contoh: `https://wheelduc.vercel.app`) | Opsional |

## Deployment

Project sudah terdeploy di Vercel:

**🔗 https://wheelduc.vercel.app/**

Untuk deployment sendiri:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nandarjr660/wheel)

> Set environment variable `NEXT_PUBLIC_APP_URL=https://wheelduc.vercel.app` di dashboard Vercel agar sitemap, robots.txt, dan metadata berfungsi optimal.

## Struktur Project

```
src/
├── app/
│   ├── globals.css          — Tailwind v4 theme & animations
│   ├── layout.tsx           — Root layout dengan metadata SEO
│   ├── page.tsx             — Main page (client component)
│   ├── robots.ts            — AI bot access rules
│   ├── sitemap.ts           — Search engine sitemap
│   └── api/
│       └── challenge/
│           └── route.ts     — POST /api/challenge (AI soal via Gemini)
├── components/
│   └── ui/
│       └── social-button.tsx — Share button (WA, FB, copy link)
└── services/
    └── gemini.ts            — generateChallenge() untuk AI
```

## SEO/GEO Optimization

Project ini sudah dioptimasi untuk:

- **Traditional SEO** — Meta tags, OG, Twitter Cards, JSON-LD
- **GEO (Generative Engine Optimization)** — FAQ Schema, HowTo Schema, akses AI bots
- **AI Search Engines** — ChatGPT, Perplexity, Google AI Overview, Copilot, Claude

## Lisensi

MIT

## Author

**hasmunandar** — [Instagram](https://instagram.com/hsmnandar)

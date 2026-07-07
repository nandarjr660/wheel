import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/i18n/LanguageProvider';

// 2026 standard viewport — explicit declaration for mobile, tablet, desktop
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover', // Handles iPhone notch / Dynamic Island safe-area
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    { media: '(prefers-color-scheme: light)', color: '#f1f5f9' },
  ],
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://spinclass.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'SpinClass - Smart Classroom AI Edition',
    template: '%s | SpinClass',
  },
  description: 'Aplikasi spinner kelas interaktif dengan AI-powered challenge menggunakan Google Gemini. Gratis untuk guru dan siswa SD, SMP, SMA.',
  keywords: [
    'spinclass',
    'spinner kelas',
    'classroom spinner',
    'random picker siswa',
    'tantangan AI kelas',
    'roda keberuntungan kelas',
    'guru digital',
    'edtech Indonesia',
    'Google Gemini classroom',
    'ice breaking kelas',
  ],
  authors: [{ name: 'hasmunandar' }],
  creator: 'hasmunandar',
  publisher: 'hasmunandar',
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'SpinClass',
    title: 'SpinClass - Smart Classroom AI Edition',
    description: 'Aplikasi spinner kelas interaktif dengan AI-powered challenge menggunakan Google Gemini. Gratis untuk guru dan siswa SD, SMP, SMA.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'SpinClass - Smart Classroom AI Edition',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpinClass - Smart Classroom AI Edition',
    description: 'Aplikasi spinner kelas interaktif dengan AI-powered challenge menggunakan Google Gemini.',
    images: ['/opengraph-image'],
    creator: '@hsmnandar',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'googlee34068ee5ad7b22d',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SpinClass',
  description: 'Aplikasi spinner kelas interaktif dengan AI-powered challenge menggunakan Google Gemini. Gratis untuk guru dan siswa SD, SMP, SMA.',
  url: APP_URL,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web Browser',
  dateModified: new Date().toISOString().split('T')[0],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'IDR',
  },
  author: {
    '@type': 'Person',
    name: 'hasmunandar',
    url: 'https://instagram.com/hsmnandar',
  },
  featureList: [
    'Canvas-rendered spinning wheel dengan Retina/HiDPI support',
    'AI-powered challenge menggunakan Google Gemini',
    'Konfigurasi jenjang SD, SMP, SMA/SMK, Universitas',
    'Confetti animation saat pemenang terpilih',
    'Share ke WhatsApp dan Facebook',
    'Dark mode dan Light mode',
    'Responsive design untuk mobile dan desktop',
  ],
  applicationSuite: 'Smart Classroom AI Edition',
  accessibilityFeature: ['keyboardNavigation', 'screenReaderSupport'],
  accessibilityHazard: 'none',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SpinClass',
  url: APP_URL,
  logo: `${APP_URL}/favicon.svg`,
  sameAs: [
    'https://instagram.com/hsmnandar',
    'https://github.com/nandarjr660/wheel',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Indonesian', 'English'],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'hasmunandar',
  url: 'https://instagram.com/hsmnandar',
  jobTitle: 'Educational Technology Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'SpinClass',
  },
  knowsAbout: ['Google Gemini', 'Next.js', 'React', 'Educational Technology'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  dateModified: new Date().toISOString().split('T')[0],
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Apa itu SpinClass?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SpinClass adalah aplikasi web interaktif yang memungkinkan guru memutar spinner untuk memilih siswa secara acak, dilengkapi dengan tantangan AI menggunakan Google Gemini untuk membuat soal pelajaran yang seru.',
      },
    },
    {
      '@type': 'Question',
      name: 'Bagaimana cara menggunakan SpinClass?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Masukkan nama-nama siswa, pilih jenjang dan kelas, lalu klik tombol PUTAR untuk memutar spinner. Siswa yang terpilih akan mendapatkan tantangan AI berupa soal pelajaran yang relevan dengan topik yang diinput.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apakah SpinClass gratis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ya, aplikasi ini 100% gratis. Anda hanya membutuhkan browser modern untuk mengaksesnya. Fitur AI menggunakan Google Gemini yang tersedia secara gratis.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jenjang apa saja yang didukung?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aplikasi mendukung jenjang SD (Kelas 1-6), SMP (Kelas VII-IX), SMA/SMK (Kelas X-XII), dan Universitas (Semester 1, 3, 5, 7). Setiap jenjang memiliki opsi kelas yang sesuai.',
      },
    },
    {
      '@type': 'Question',
      name: 'Bagaimana fitur AI Challenge bekerja?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ketika fitur AI Challenge aktif, sistem akan mengirimkan topik, jenjang, dan kelas ke Google Gemini AI untuk membuat soal tantangan yang relevan. Siswa yang terpilih harus menjawab soal tersebut.',
      },
    },
  ],
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cara Menggunakan SpinClass',
  description: 'Panduan langkah demi langkah menggunakan aplikasi SpinClass dengan AI challenge.',
  dateModified: new Date().toISOString().split('T')[0],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Input Nama Siswa',
      text: 'Masukkan nama-nama siswa dipisahkan dengan koma pada kolom "Daftar Siswa". Contoh: Andi, Budi, Siti, Dewi.',
    },
    {
      '@type': 'HowToStep',
      name: 'Setup Materi',
      text: 'Masukkan topik materi pelajaran, pilih jenjang (SD/SMP/SMA/Universitas), dan tentukan kelas atau semester.',
    },
    {
      '@type': 'HowToStep',
      name: 'Aktifkan AI Challenge',
      text: 'Aktifkan toggle "Tantangan AI" jika ingin siswa yang terpilih mendapatkan soal dari AI. Nonaktifkan jika hanya ingin menampilkan nama pemenang.',
    },
    {
      '@type': 'HowToStep',
      name: 'Putar Roda',
      text: 'Klik tombol "PUTAR!" untuk memutar roda. Tunggu hingga roda berhenti dan pemenang ditampilkan.',
    },
    {
      '@type': 'HowToStep',
      name: 'Lihat Tantangan AI',
      text: 'Jika AI Challenge aktif, soal tantangan akan ditampilkan. Klik "LIHAT JAWABAN" untuk melihat jawaban yang benar.',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* theme-color is handled by viewport export above */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

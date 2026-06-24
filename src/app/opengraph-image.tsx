import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Roda Keberuntungan Kelas - Smart Classroom AI Edition'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: '72px', lineHeight: 1, marginBottom: '16px' }}>
          🎡
        </div>
        <div
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#facc15',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}
        >
          Roda Keberuntungan Kelas
        </div>
        <div
          style={{
            fontSize: '22px',
            color: '#94a3b8',
            marginBottom: '24px',
          }}
        >
          Aplikasi interaktif untuk guru — pilih siswa secara acak + AI Challenge
        </div>
        <div
          style={{
            display: 'flex',
            gap: '32px',
            fontSize: '18px',
            color: '#60a5fa',
          }}
        >
          <span>✨ Putar Roda</span>
          <span>🤖 AI Challenge</span>
          <span>📱 Share Sosmed</span>
        </div>
      </div>
    ),
    { ...size },
  )
}

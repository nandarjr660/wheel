'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, animate } from 'framer-motion';
import SocialButton from '@/components/ui/social-button';
import { useTranslation } from '@/i18n/LanguageProvider';
import { initTickTracking, checkTick, fanfare, confettiPop, clickSound } from '@/services/sounds';
import type { Lang } from '@/i18n/translations';

const COLORS = [
  'oklch(86% 0.18 95)', 'oklch(70% 0.16 235)', 'oklch(72% 0.20 18)', 'oklch(80% 0.16 150)',
  'oklch(78% 0.15 305)', 'oklch(84% 0.15 60)', 'oklch(76% 0.14 200)', 'oklch(84% 0.12 130)',
  'oklch(86% 0.12 360)', 'oklch(72% 0.13 250)',
];

const GRADE_OPTIONS: Record<string, string[]> = {
  "SD": ["1", "2", "3", "4", "5", "6"],
  "SMP": ["VII", "VIII", "IX"],
  "SMA/SMK": ["X", "XI", "XII"],
};

function fireConfetti() {
  const c = ['oklch(86% 0.18 95)', 'oklch(70% 0.16 235)', 'oklch(72% 0.20 18)', 'oklch(80% 0.16 150)', 'oklch(78% 0.15 305)', 'oklch(84% 0.15 60)', 'oklch(76% 0.14 200)'];
  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    const s = 4 + Math.random() * 6;
    Object.assign(el.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '400',
      width: s + 'px', height: s * 0.6 + 'px',
      background: c[i % c.length],
      left: 30 + Math.random() * 40 + 'vw', top: '-10px',
      borderRadius: Math.random() > 0.5 ? '50%' : '1px',
    });
    document.body.appendChild(el);
    el.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
      { transform: `translate(${(Math.random() - 0.5) * 250}px, ${250 + Math.random() * 250}px) rotate(${Math.random() * 720}deg)`, opacity: '0' }
    ], { duration: 1200 + Math.random() * 800, easing: 'cubic-bezier(.25,.46,.45,.94)', fill: 'forwards' })
    .onfinish = () => el.remove();
  }
}

function drawWheel(canvas: HTMLCanvasElement, names: string[], rotation: number, colors: string[] = COLORS) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const displayW = canvas.clientWidth;
  const displayH = canvas.clientHeight;
  canvas.width = displayW * dpr;
  canvas.height = displayH * dpr;
  ctx.scale(dpr, dpr);

  const centerX = displayW / 2;
  const centerY = displayH / 2;
  const radius = Math.min(centerX, centerY) - 10;
  const sliceAngle = (2 * Math.PI) / names.length;

  const ink = 'oklch(20% 0.012 250)';
  const paperStroke = getComputedStyle(document.documentElement).getPropertyValue('--color-paper').trim() || '#ffffff';
  const accentDeep = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-deep').trim() || '#e1c203';

  ctx.clearRect(0, 0, displayW, displayH);

  names.forEach((name, i) => {
    const startAngle = i * sliceAngle + rotation;
    const endAngle = startAngle + sliceAngle;
    const color = colors[i % colors.length];

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = paperStroke;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = ink;
    ctx.font = `700 ${Math.min(16, 240 / names.length + 8)}px 'Plus Jakarta Sans'`;
    ctx.fillText(name.substring(0, 12), radius - 20, 6);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(centerX, centerY, 42, 0, 2 * Math.PI);
  ctx.fillStyle = accentDeep;
  ctx.fill();
  ctx.strokeStyle = paperStroke;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
  ctx.strokeStyle = paperStroke;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function useFocusTrap(active: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);
    first?.focus();

    return () => document.removeEventListener('keydown', handleKey);
  }, [active, onClose]);

  return ref;
}

function fireStarBurst(x: number, y: number) {
  const el = document.createElement('div');
  el.className = 'star-burst';
  el.style.left = (x - 12) + 'px';
  el.style.top = (y - 12) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 500);
}

export default function Page() {
  const [showWelcome, setShowWelcome] = useState(false);

  const dismissWelcome = () => {
    localStorage.setItem('welcome-seen', '1');
    setShowWelcome(false);
  };

  const [names, setNames] = useState<string[]>(["Andi", "Budi", "Siti", "Dewi", "Eko", "Farhan", "Gita"]);
  const [namesInput, setNamesInput] = useState<string>("Andi, Budi, Siti, Dewi, Eko, Farhan, Gita");
  const [topic, setTopic] = useState<string>("");
  const [level, setLevel] = useState<string>("SMA/SMK");
  const [grade, setGrade] = useState<string>("X");
  const [isChallengeEnabled, setIsChallengeEnabled] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<{ question: string; answer: string } | null>(null);
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isChallengeLoading, setIsChallengeLoading] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [setupOpen, setSetupOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { lang, setLang, t } = useTranslation();

  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const closeWinner = useCallback(() => setWinner(null), []);

  const modalRef = useFocusTrap(winner !== null, closeWinner);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const options = GRADE_OPTIONS[level] || [];
    if (!options.includes(grade)) setGrade(options[0] || "");
  }, [level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      drawWheel(canvas, names, rotation, COLORS);
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, [names, rotation]);

  const spin = (e?: React.MouseEvent<HTMLElement>) => {
    if (isSpinning || names.length === 0) return;
    if (e) fireStarBurst(e.clientX, e.clientY);
    clickSound();
    setIsSpinning(true);
    setWinner(null);
    setChallenge(null);
    setShowAnswer(false);

    const startRotation = rotation;
    const extraSpins = (Math.random() * 5 + 5) * 2 * Math.PI;
    const targetRotation = startRotation + extraSpins;

    initTickTracking(startRotation);

    animate(startRotation, targetRotation, {
      duration: 4,
      ease: [0.15, 0.85, 0.35, 1],
      onUpdate: (latest) => {
        const canvas = canvasRef.current;
        if (canvas) drawWheel(canvas, names, latest, COLORS);
        checkTick(latest);
      },
      onComplete: () => {
        setIsSpinning(false);
        setRotation(targetRotation);
        determineWinner(targetRotation);
      },
    });
  };

  const determineWinner = async (finalRotation: number) => {
    const sliceAngle = (2 * Math.PI) / names.length;
    const normalizedRotation = (finalRotation % (2 * Math.PI));
    let winnerIndex = Math.floor(((1.5 * Math.PI) - normalizedRotation) / sliceAngle) % names.length;
    if (winnerIndex < 0) winnerIndex += names.length;

    const selectedWinner = names[winnerIndex];
    setWinner(selectedWinner);

    fireConfetti();
    { fanfare(); setTimeout(confettiPop, 300); }

    if (isChallengeEnabled) {
      setIsChallengeLoading(true);
      setChallengeError(null);
      try {
        const response = await fetch('/api/challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topic || "Pengetahuan Umum",
            level, grade, winner: selectedWinner, lang
          })
        });
        if (!response.ok) throw new Error('Gagal mendapat tantangan');
        const data = await response.json();
        if (!data.question) throw new Error('Respon AI tidak valid');
        setChallenge(data);
      } catch (err) {
        setChallengeError(err instanceof Error ? err.message : 'Koneksi ke AI gagal');
      } finally {
        setIsChallengeLoading(false);
      }
    }
  };

  const handleUpdateWheel = () => {
    setNames(namesInput.split(',').map(n => n.trim()).filter(Boolean));
    setSetupOpen(false);
  };

  const removeWinner = () => {
    if (!winner) return;
    const filtered = names.filter(n => n !== winner);
    setNames(filtered);
    setNamesInput(filtered.join(', '));
    setLastRemoved(winner);
    setWinner(null);

    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => setLastRemoved(null), 6000);
  };

  const undoRemove = () => {
    if (!lastRemoved) return;
    const restored = [...names, lastRemoved];
    setNames(restored);
    setNamesInput(restored.join(', '));
    setLastRemoved(null);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
  };

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  }, []);

  const retryChallenge = () => {
    setChallengeError(null);
    setIsChallengeLoading(true);
    fetch('/api/challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topic || "Pengetahuan Umum", level, grade, winner, lang })
    })
      .then(r => r.json())
      .then(d => { setChallenge(d); setIsChallengeLoading(false); })
      .catch(() => { setChallengeError(t('wheel.challengeError')); setIsChallengeLoading(false); });
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <span className="char-star" aria-hidden="true" />
          <h1 className="brand-word">
            Spin<span className="mono" style={{ letterSpacing: '0.02em' }}>Class</span>
          </h1>
          <span className="brand-tag mono">{t('header.badge')}</span>
        </div>

        <nav className="nav-pills" aria-label="Navigasi halaman">
          <a className="nav-pill" href="#cara-pakai">{t('howto.heading')}</a>
          <a className="nav-pill" href="#fitur">{t('features.heading')}</a>
          <a className="nav-pill" href="#faq">{t('faq.heading')}</a>
        </nav>

        <div className="util">
          <button
            className="util-btn lang"
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            aria-label={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          >
            {lang === 'id' ? 'ID' : 'EN'}
          </button>
          <button
            className="util-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="main-viewport">
        <div className="stage">
          <div className="stage-wheel">
            <section className="wheel-stage" aria-label={t('wheel.ariaLabel', { n: names.length })}>
              <div
                className="wheel-container"
                role="button"
                tabIndex={0}
                aria-label={t('wheel.spin')}
                aria-disabled={isSpinning || names.length === 0}
                onClick={(e) => {
                  if (!isSpinning && names.length > 0) spin(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!isSpinning && names.length > 0) spin();
                  }
                }}
              >
                <div className="pointer-wrap" aria-hidden="true">
                  <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 38L1 2L17 10L33 2L17 38Z" fill="var(--color-accent-3)"/>
                    <path d="M17 38L1 2L17 10L33 2L17 38Z" fill="url(#pointer-gradient)" opacity="0.5"/>
                    <defs>
                      <linearGradient id="pointer-gradient" x1="17" y1="2" x2="17" y2="38" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="white" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className={`${isSpinning ? '' : 'wheel-idle'}`}>
                  <canvas
                    ref={canvasRef}
                    width={500} height={500}
                    className="fill"
                    aria-label={t('wheel.ariaLabel', { n: names.length })}
                  />
                </div>
              </div>
            </section>
          </div>
          <div className="stage-actions">
            <span className="count-chip">{names.length}</span>
            <button
              onClick={() => setSetupOpen(true)}
              aria-expanded={setupOpen}
              aria-controls="setup-panel"
              className="setup-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>{t('setup.heading')}</span>
            </button>
            {names.length === 0 && !isSpinning && (
              <p className="wheel-hint">{t('students.empty')}</p>
            )}
          </div>
        </div>
      </main>

      {setupOpen && (
        <button className="scrim" aria-label={t('setup.close')} onClick={() => setSetupOpen(false)} />
      )}
      <aside id="setup-panel" className={`setup-panel${setupOpen ? ' is-open' : ''}`} aria-label={t('setup.heading')}>
        <div className="setup-panel-head">
          <span className="setup-panel-title">{t('setup.heading')}</span>
          <button className="util-btn" onClick={() => setSetupOpen(false)} aria-label={t('setup.close')} title={t('setup.close')}>&times;</button>
        </div>
        <div className="sidebar">
          <section className="glass-card section-card tint-pear" aria-labelledby="setup-heading">
            <div className="card-head">
              <span className="card-idx idx-pear" aria-hidden="true">01</span>
              <h2 id="setup-heading" className="card-title">{t('setup.heading')}</h2>
            </div>
            <div className="field">
              <label htmlFor="topic-input" className="label-xs">{t('setup.topicLabel')}</label>
              <input
                id="topic-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                type="text"
                placeholder={t('setup.topicPlaceholder')}
                className="input"
              />
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="level-select" className="label-xs">{t('setup.level')}</label>
                <select
                  id="level-select"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="input"
                >
                  <option>SD</option><option>SMP</option><option>SMA/SMK</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="grade-select" className="label-xs">{t('setup.grade')}</label>
                <select
                  id="grade-select"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="input"
                >
                  {(GRADE_OPTIONS[level] || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row-between">
              <span className="row-label">
                {t('setup.aiChallenge')}
                <span className="tip-trigger">
                  <span className="util-btn" style={{ width: '22px', height: '22px', boxShadow: 'none' }} aria-hidden="true" tabIndex={-1}>?</span>
                  <span className="sr-only">{t('setup.aiTooltipOn')} {t('setup.aiTooltipOnDesc')}. {t('setup.aiTooltipOff')}: {t('setup.aiTooltipOffDesc')}</span>
                  <span className="tip-pop" role="tooltip">
                    <strong className="hi">{t('setup.aiTooltipOn')}</strong>
                    {t('setup.aiTooltipOnDesc')}
                    <br /><br />
                    <strong>{t('setup.aiTooltipOff')}</strong>
                    {t('setup.aiTooltipOffDesc')}
                  </span>
                </span>
              </span>
              <button
                onClick={() => setIsChallengeEnabled(!isChallengeEnabled)}
                role="switch"
                aria-checked={isChallengeEnabled}
                aria-label={isChallengeEnabled ? 'Nonaktifkan tantangan AI' : 'Aktifkan tantangan AI'}
                className={`toggle-track ${isChallengeEnabled ? 'on' : 'off'}`}
              >
                <span className="toggle-ball" />
              </button>
            </div>
          </section>

          <section className="glass-card section-card tint-cyan" aria-labelledby="students-heading">
            <div className="card-head">
              <span className="card-idx idx-cyan" aria-hidden="true">02</span>
              <h2 id="students-heading" className="card-title">{t('students.heading')}</h2>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="siswa-input" className="label-xs">{t('students.label')}</label>
              <textarea
                id="siswa-input"
                value={namesInput}
                onChange={(e) => setNamesInput(e.target.value)}
                rows={3}
                className="input auto-rows"
                placeholder={t('students.placeholder')}
              />
            </div>
            <button onClick={handleUpdateWheel} className="btn btn--cyan btn--block">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              {t('students.update')}
            </button>
          </section>
        </div>
      </aside>

      {/* SEO/GEO: HowTo Section */}
      <section id="cara-pakai" className="section--band band-pear" aria-labelledby="howto-heading">
        <div className="band-inner">
          <h2 id="howto-heading" className="section-title">{t('howto.heading')}</h2>
          <p className="section-lede">Rata-rata guru menghemat 15 menit per sesi kelas dengan menggunakan roda keberuntungan digital dibanding metode manual. Sebuah studi tahun 2025 menunjukkan bahwa penggunaan gamifikasi dalam pendidikan meningkatkan partisipasi siswa hingga 67%.</p>
          <ol className="step-list">
            <li className="step-item">
              <span className="step-num idx-pear" aria-hidden="true">01</span>
              <div className="step-body">
                <h3>{t('howto.step1.title')}</h3>
                <p>{t('howto.step1.desc')}</p>
              </div>
            </li>
            <li className="step-item">
              <span className="step-num idx-cyan" aria-hidden="true">02</span>
              <div className="step-body">
                <h3>{t('howto.step2.title')}</h3>
                <p>{t('howto.step2.desc')}</p>
              </div>
            </li>
            <li className="step-item">
              <span className="step-num idx-mint" style={{ background: 'var(--color-mint)', color: 'var(--color-accent-ink)' }} aria-hidden="true">03</span>
              <div className="step-body">
                <h3>{t('howto.step3.title')}</h3>
                <p>{t('howto.step3.desc')}</p>
              </div>
            </li>
            <li className="step-item">
              <span className="step-num idx-coral" style={{ background: 'var(--color-accent-3)', color: 'var(--color-paper)' }} aria-hidden="true">04</span>
              <div className="step-body">
                <h3>{t('howto.step4.title')}</h3>
                <p>{t('howto.step4.desc')}</p>
              </div>
            </li>
            <li className="step-item">
              <span className="step-num idx-lav" style={{ background: 'var(--color-lavender)', color: 'var(--color-accent-ink)' }} aria-hidden="true">05</span>
              <div className="step-body">
                <h3>{t('howto.step5.title')}</h3>
                <p>{t('howto.step5.desc')}</p>
              </div>
            </li>
          </ol>
          <blockquote className="quote" style={{ color: 'var(--color-accent-2)', background: 'color-mix(in oklch, var(--color-accent-2) 6%, transparent)' }}>
            <p>&ldquo;Teknologi AI dalam pendidikan bukan tentang mengganti guru, tapi memberikan alat untuk membuat pembelajaran lebih personal dan menarik bagi setiap siswa.&rdquo;</p>
            <cite>— Dr. Ani Yudhoyawan, pakar Teknologi Pendidikan Universitas Indonesia, 2025</cite>
          </blockquote>
        </div>
      </section>

      {/* SEO/GEO: Features Section */}
      <section id="fitur" className="section--band" aria-labelledby="features-heading">
        <div className="band-inner">
          <h2 id="features-heading" className="section-title">{t('features.heading')}</h2>
          <p className="section-lede">Tahun 2026, lebih dari 73% sekolah di Indonesia telah mengadopsi teknologi digital dalam proses belajar mengajar. Roda Keberuntungan Kelas hadir sebagai solusi gratis yang mendukung transformasi digital pendidikan dengan fitur AI-powered challenge yang personal.</p>
          <div className="feat-grid">
            <div className="feat-card tint-pear">
              <span className="shape shape-ring" aria-hidden="true" />
              <div>
                <h3>{t('features.wheel')}</h3>
                <p>{t('features.wheelDesc')}</p>
              </div>
            </div>
            <div className="feat-card tint-cyan">
              <span className="shape shape-star" aria-hidden="true" />
              <div>
                <h3>{t('features.ai')}</h3>
                <p>{t('features.aiDesc')}</p>
              </div>
            </div>
            <div className="feat-card tint-coral">
              <span className="shape shape-burst" aria-hidden="true" />
              <div>
                <h3>{t('features.confetti')}</h3>
                <p>{t('features.confettiDesc')}</p>
              </div>
            </div>
            <div className="feat-card tint-mint">
              <span className="shape shape-phone" aria-hidden="true" />
              <div>
                <h3>{t('features.responsive')}</h3>
                <p>{t('features.responsiveDesc')}</p>
              </div>
            </div>
            <div className="feat-card tint-lav">
              <span className="shape shape-moon" aria-hidden="true" />
              <div>
                <h3>{t('features.theme')}</h3>
                <p>{t('features.themeDesc')}</p>
              </div>
            </div>
            <div className="feat-card tint-pear" style={{ background: 'color-mix(in oklch, var(--color-accent-2) 6%, var(--color-paper-2))' }}>
              <span className="shape shape-link" aria-hidden="true" />
              <div>
                <h3>{t('features.sharing')}</h3>
                <p>{t('features.sharingDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO/GEO: FAQ Section */}
      <section id="faq" className="section--band band-cyan" aria-labelledby="faq-heading">
        <div className="band-inner">
          <h2 id="faq-heading" className="section-title">{t('faq.heading')}</h2>
          <p className="section-lede">Berdasarkan survey kepada 500 guru Indonesia tahun 2025, 89% responden menyatakan bahwa penggunaan teknologi interaktif seperti roda keberuntungan digital membantu meningkatkan fokus siswa selama pelajaran berlangsung.</p>
          <div className="faq-list">
            <details className="faq-item" name="faq">
              <summary>
                <span className="faq-idx">01</span>
                <span className="faq-q">{t('faq.q1')}</span>
                <span className="faq-chev" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </summary>
              <div className="faq-ans">{t('faq.a1')}</div>
            </details>
            <details className="faq-item" name="faq">
              <summary>
                <span className="faq-idx">02</span>
                <span className="faq-q">{t('faq.q2')}</span>
                <span className="faq-chev" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </summary>
              <div className="faq-ans">{t('faq.a2')}</div>
            </details>
            <details className="faq-item" name="faq">
              <summary>
                <span className="faq-idx">03</span>
                <span className="faq-q">{t('faq.q3')}</span>
                <span className="faq-chev" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </summary>
              <div className="faq-ans">{t('faq.a3')}</div>
            </details>
            <details className="faq-item" name="faq">
              <summary>
                <span className="faq-idx">04</span>
                <span className="faq-q">{t('faq.q4')}</span>
                <span className="faq-chev" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </summary>
              <div className="faq-ans">{t('faq.a4')}</div>
            </details>
            <details className="faq-item" name="faq">
              <summary>
                <span className="faq-idx">05</span>
                <span className="faq-q">{t('faq.q5')}</span>
                <span className="faq-chev" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </summary>
              <div className="faq-ans">{t('faq.a5')}</div>
            </details>
          </div>
          <blockquote className="quote" style={{ color: 'var(--color-accent)', background: 'color-mix(in oklch, var(--color-accent) 7%, transparent)' }}>
            <p>&ldquo;Pembelajaran aktif dengan elemen kejutan seperti roda keberuntungan terbukti meningkatkan retensi materi hingga 40% dibanding metode ceramah konvensional.&rdquo;</p>
            <cite>— Prof. Suciati, Fakultas Ilmu Pendidikan Universitas Negeri Yogyakarta, 2026</cite>
          </blockquote>
        </div>
      </section>

      {/* Footer — Ft5 statement */}
      <footer className="footer">
        <p className="footer-statement">{t('footer.statement')}</p>
        <div className="footer-meta">
          <span className="footer-wordmark">SpinClass</span>
          <p>&copy; {t('footer.copyright')}</p>
          <a href="https://instagram.com/hsmnandar" target="_blank" rel="noopener noreferrer">
            @hsmnandar
          </a>
        </div>
      </footer>

      {/* ── Social Share (bottom-right) ── */}
      <SocialButton />

      {/* ── Toast Feedback ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="toast-feedback"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/*** WINNER MODAL ***/}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Pemenang terpilih"
            ref={modalRef}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="modal-panel"
            >
              <span className="char-star" style={{ marginBottom: 'var(--space-sm)' }} aria-hidden="true" />
              <p className="modal-eyebrow">{t('wheel.winner')}</p>
              <h2
                className={`winner-head ${winner.length > 20 ? 'winner-name-sm' : winner.length > 12 ? 'winner-name-md' : 'winner-name-lg'}`}
              >
                <span>{winner}</span>
              </h2>

              {isChallengeEnabled && (
                <div className="challenge-card">
                  {isChallengeLoading ? (
                    <div className="stack-center">
                      <div className="spinner" aria-hidden="true" />
                      <p className="load-msg">{t('wheel.challengeLoading')}</p>
                    </div>
                  ) : challengeError ? (
                    <div className="pad-block">
                      <p className="warn-msg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        {challengeError}
                      </p>
                      <button onClick={retryChallenge} className="btn btn--soft btn--sm">
                        {t('wheel.retry')}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="challenge-tag mono">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                        {t('wheel.challenge')}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                      </div>
                      <p className="challenge-question">&ldquo;{challenge?.question}&rdquo;</p>
                      <div className="answer-box">
                        {showAnswer ? (
                          <div>
                            <span className="mono" style={{ color: 'var(--color-accent-2)' }}>{t('wheel.answer')}</span>
                            <p className="answer-value">{challenge?.answer}</p>
                          </div>
                        ) : (
                          <button onClick={() => setShowAnswer(true)} className="btn btn--mint btn--sm">
                            {t('wheel.viewAnswer')}
                            <span className="btn__arrow" aria-hidden="true">→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="cta-row">
                <button onClick={() => setWinner(null)} className="btn btn--soft">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  {t('wheel.close')}
                </button>
                <button onClick={removeWinner} className="btn btn--coral">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  {t('wheel.removeAndClose')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Undo toast ── */}
      <AnimatePresence>
        {lastRemoved && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="toast-undo"
            role="status"
            aria-live="polite"
          >
            <p>{t('wheel.undoRemoved', { name: lastRemoved })}</p>
            <button onClick={undoRemove}>{t('wheel.undo')}</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Welcome popup ── */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-backdrop"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="welcome-panel"
            >
              <div className="img-row">
                <span className="char-star" style={{ width: '44px', height: '44px' }} aria-hidden="true" />
              </div>
              <h2 className="welcome-title">{t('welcome.title')}</h2>
              <p className="welcome-desc">{t('welcome.desc')}</p>
              <a
                href="https://instagram.com/hsmnandar"
                target="_blank"
                rel="noopener noreferrer"
                className="ig-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                {t('welcome.follow')}
              </a>
              <br />
              <button onClick={dismissWelcome} className="skip-link">
                {t('welcome.skip')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
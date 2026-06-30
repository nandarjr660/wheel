'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, animate } from 'framer-motion';
import SocialButton from '@/components/ui/social-button';
import { useTranslation } from '@/i18n/LanguageProvider';
import { initTickTracking, checkTick, fanfare, confettiPop, clickSound } from '@/services/sounds';
import type { Lang } from '@/i18n/translations';

const COLORS = ['#38bdf8', '#4ade80', '#facc15', '#fb923c', '#fb7185', '#a78bfa', '#2dd4bf', '#f472b6', '#818cf8', '#34d399'];

const GRADE_OPTIONS: Record<string, string[]> = {
  "SD": ["1", "2", "3", "4", "5", "6"],
  "SMP": ["VII", "VIII", "IX"],
  "SMA/SMK": ["X", "XI", "XII"],
  "Universitas": ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5"],
};

function fireConfetti() {
  const c = ['#38bdf8', '#4ade80', '#facc15', '#fb923c', '#fb7185', '#c084fc', '#2dd4bf'];
  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    const s = 4 + Math.random() * 6;
    Object.assign(el.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '9999',
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

  ctx.clearRect(0, 0, displayW, displayH);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 40;

  names.forEach((name, i) => {
    const startAngle = i * sliceAngle + rotation;
    const endAngle = startAngle + sliceAngle;
    const color = colors[i % colors.length];

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.min(16, 240 / names.length + 8)}px 'Plus Jakarta Sans'`;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 6;
    ctx.fillText(name.substring(0, 12), radius - 24, 6);
    ctx.restore();
  });

  ctx.restore();

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 20;

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 42);
  gradient.addColorStop(0, '#1e293b');
  gradient.addColorStop(1, '#0f172a');
  ctx.beginPath();
  ctx.arc(centerX, centerY, 42, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 42, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 34, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
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

export default function Page() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('welcome-seen')) setShowWelcome(false);
  }, []);

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
    if (canvas) drawWheel(canvas, names, rotation, COLORS);
  }, [names, rotation]);

  const spin = () => {
    if (isSpinning || names.length === 0) return;
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

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="inline-flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[3px] sm:tracking-[4px] text-slate-500">{t('header.badge')}</p>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <h1 className="app-title text-brand-yellow text-glow-yellow font-sans">
          {t('header.title.line1')}<br className="sm:hidden" />{' '}{t('header.title.line2')}
        </h1>
      </header>

      <div className="app-grid">
        <div className="sidebar">
          <section className="glass-card section-card">
            <h2 className="text-sm sm:text-base font-bold mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3">
              <span className="bg-brand-yellow/20 text-brand-yellow w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
              <span>{t('setup.heading')}</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="topic-input" className="label-xs block mb-1.5 text-slate-300">{t('setup.topicLabel')}</label>
                <input
                  id="topic-input"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  type="text"
                  placeholder={t('setup.topicPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border-2 border-brand-blue/60 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all duration-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="level-select" className="label-xs block mb-1.5 text-slate-300">{t('setup.level')}</label>
                  <select
                    id="level-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/30 border-2 border-brand-blue/60 text-white outline-none cursor-pointer text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all duration-200 [&>option]:bg-brand-bg [&>option]:text-white"
                  >
                    <option>SD</option><option>SMP</option><option>SMA/SMK</option><option>Universitas</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="grade-select" className="label-xs block mb-1.5 text-slate-300">{t('setup.grade')}</label>
                  <select
                    id="grade-select"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/30 border-2 border-brand-blue/60 text-white outline-none cursor-pointer text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all duration-200 [&>option]:bg-brand-bg [&>option]:text-white"
                  >
                    {(GRADE_OPTIONS[level] || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between gap-3">
                {/* Label + tooltip */}
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  {t('setup.aiChallenge')}
                  <span className="group relative inline-flex">
                    <span className="w-4 h-4 rounded-full border border-slate-500 text-slate-400 text-[10px] font-bold flex items-center justify-center cursor-help leading-none">?</span>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 px-3 py-2 bg-slate-800 border border-slate-600 text-xs text-slate-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 text-left font-normal normal-case leading-relaxed">
                      <span className="font-semibold text-brand-green">{t('setup.aiTooltipOn')}</span> {t('setup.aiTooltipOnDesc')}<br />
                      <span className="font-semibold text-slate-400">{t('setup.aiTooltipOff')}</span> {t('setup.aiTooltipOffDesc')}
                      <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-slate-600 border-l-transparent border-r-transparent" />
                    </span>
                  </span>
                </span>

                {/* Clean pill toggle — no text */}
                <motion.button
                  onClick={() => setIsChallengeEnabled(!isChallengeEnabled)}
                  role="switch"
                  aria-checked={isChallengeEnabled}
                  aria-label={isChallengeEnabled ? 'Nonaktifkan tantangan AI' : 'Aktifkan tantangan AI'}
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 10px 5px 6px',
                    borderRadius: '999px',
                    border: '1.5px solid',
                    cursor: 'pointer',
                    flexShrink: 0,
                    outline: 'none',
                    overflow: 'hidden',
                    borderColor: isChallengeEnabled ? 'rgba(16,185,129,0.5)' : 'rgba(148,163,184,0.15)',
                    background: isChallengeEnabled
                      ? 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.08) 100%)'
                      : 'rgba(30,41,59,0.6)',
                    boxShadow: isChallengeEnabled
                      ? '0 0 16px rgba(16,185,129,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}
                >
                  {/* Glowing star icon */}
                  <motion.span
                    animate={{
                      background: isChallengeEnabled
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'rgba(71,85,105,0.6)',
                      boxShadow: isChallengeEnabled
                        ? '0 0 10px rgba(16,185,129,0.8), 0 0 20px rgba(16,185,129,0.3)'
                        : 'none',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '22px', height: '22px', borderRadius: '7px', flexShrink: 0,
                    }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isChallengeEnabled ? (
                        <motion.span key="on"
                          initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.3, rotate: 30 }}
                          transition={{ duration: 0.2, ease: 'backOut' }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"/>
                          </svg>
                        </motion.span>
                      ) : (
                        <motion.span key="off"
                          initial={{ opacity: 0, scale: 0.3 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.3 }}
                          transition={{ duration: 0.18 }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.7)" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.span>

                  {/* Pill switch track */}
                  <motion.span
                    animate={{ background: isChallengeEnabled ? '#10b981' : '#334155' }}
                    transition={{ duration: 0.22 }}
                    style={{
                      position: 'relative', display: 'flex', alignItems: 'center',
                      width: '36px', height: '20px', borderRadius: '999px', flexShrink: 0, padding: '2px',
                    }}
                  >
                    <motion.span
                      animate={{ x: isChallengeEnabled ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', display: 'block',
                      }}
                    />
                  </motion.span>
                </motion.button>
              </div>
            </div>
          </section>

          <section className="glass-card section-card">
            <h2 className="text-sm sm:text-base font-bold mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3">
              <span className="bg-brand-green/20 text-brand-green w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
              <span>{t('students.heading')}</span>
            </h2>
            <div className="mt-0">
              <label htmlFor="siswa-input" className="label-xs block mb-1.5 text-slate-300">{t('students.label')}</label>
              <textarea
                id="siswa-input"
                value={namesInput}
                onChange={(e) => setNamesInput(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border-2 border-brand-green/40 text-brand-green font-medium text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30 transition-all duration-200 resize-none placeholder-slate-500"
                placeholder={t('students.placeholder')}
              />
              <button
                onClick={handleUpdateWheel}
                className="w-full mt-3 bg-brand-green hover:bg-emerald-500 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                {t('students.update')}
              </button>
            </div>
          </section>
        </div>

        <div className="glass-card-glow wheel-area rounded-[24px] sm:rounded-[32px] p-3 sm:p-4 md:p-5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 shimmer pointer-events-none" />
          <div className="wheel-container relative aspect-square">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-black/60 blur-md -mb-3" />
              <div className="relative">
                <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_6px_20px_rgba(0,0,0,0.8)]">
                  <path d="M17 38L1 2L17 10L33 2L17 38Z" fill="#dc2626"/>
                  <path d="M17 38L1 2L17 10L33 2L17 38Z" fill="url(#pointer-gradient)" opacity="0.5"/>
                  <defs>
                    <linearGradient id="pointer-gradient" x1="17" y1="2" x2="17" y2="38" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="white" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className={`${isSpinning ? '' : 'wheel-idle'}`}>
              <canvas
                ref={canvasRef}
                width={500} height={500}
                className="w-full h-full drop-shadow-[0_0_60px_rgba(0,0,0,0.6)]"
                aria-label={t('wheel.ariaLabel', { n: names.length })}
              />
            </div>
          </div>
          <button
            onClick={spin}
            disabled={isSpinning || names.length === 0}
            className={`spin-btn relative bg-linear-to-b from-brand-yellow to-yellow-400 hover:from-yellow-300 hover:to-yellow-500 text-black font-black shadow-[0_8px_32px_rgba(250,204,21,0.35)] transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 uppercase cursor-pointer overflow-hidden ${isSpinning ? 'animate-pulse' : ''}`}
            aria-disabled={isSpinning || names.length === 0}
          >
            <span className="relative z-10 flex items-center gap-3">
              {isSpinning ? (
                <>
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  {t('wheel.spinning')}
                </>
              ) : (
                <>{t('wheel.spin')}</>
              )}
            </span>
          </button>
          {names.length === 0 && !isSpinning && (
            <p className="text-xs text-slate-500 mt-2">{t('students.empty')}</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
            style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Pemenang terpilih"
          >
            <div className="modal-inner my-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="max-w-4xl w-full text-center">
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                    <span className="text-sm font-bold uppercase tracking-[4px] text-slate-400">{t('wheel.winner')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                  </div>
                  <h2
                    className={`font-black text-brand-yellow text-glow-yellow uppercase px-4 font-sans ${
                      winner.length > 20 ? 'winner-name-sm' :
                      winner.length > 12 ? 'winner-name-md' :
                      'winner-name-lg'
                    }`}
                  >
                    <span className="inline-block">{winner}</span>
                  </h2>
                </div>

                {isChallengeEnabled && (
                  <div className="glass-card challenge-card rounded-2xl border border-brand-blue/30 shadow-[0_0_60px_rgba(59,130,246,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-brand-blue to-transparent" />
                    {isChallengeLoading ? (
                      <div className="flex flex-col items-center py-10">
                        <div className="w-14 h-14 rounded-full border-[3px] border-brand-blue/30 border-t-brand-blue animate-spin mb-5" />
                        <p className="text-xl font-bold text-blue-300">{t('wheel.challengeLoading')}</p>
                      </div>
                    ) : challengeError ? (
                      <div className="text-center py-8">
                        <p className="text-lg font-bold text-brand-red mb-5 flex items-center justify-center gap-2.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                          {challengeError}
                        </p>
                        <button
                          onClick={() => { setChallengeError(null); setIsChallengeLoading(true); fetch('/api/challenge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: topic || "Pengetahuan Umum", level, grade, winner, lang }) }).then(r => r.json()).then(d => { setChallenge(d); setIsChallengeLoading(false); }).catch(() => { setChallengeError(t('wheel.challengeError')); setIsChallengeLoading(false); }) }}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all cursor-pointer active:scale-[0.97]"
                        >
                          {t('wheel.retry')}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-center gap-2 text-brand-yellow">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                          <span className="text-base font-bold uppercase tracking-[3px]">{t('wheel.challenge')}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                        </div>
                        <p className="challenge-question text-white/90">
                          &ldquo;{challenge?.question}&rdquo;
                        </p>
                        <div className="pt-5 border-t border-white/5">
                          {showAnswer ? (
                            <div>
                              <span className="text-xs font-bold text-brand-green uppercase tracking-[3px] block mb-2">{t('wheel.answer')}</span>
                              <p className="text-xl md:text-2xl font-bold text-brand-green">{challenge?.answer}</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAnswer(true)}
                              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all cursor-pointer active:scale-[0.97]"
                            >
                              {t('wheel.viewAnswer')}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setWinner(null)}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-base font-bold transition-all duration-200 flex items-center gap-2.5 cursor-pointer active:scale-[0.97]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {t('wheel.close')}
                  </button>
                  <button
                    onClick={removeWinner}
                    className="px-8 py-4 bg-linear-to-b from-brand-red to-red-600 hover:from-red-500 hover:to-red-700 rounded-xl text-base font-bold transition-all duration-200 flex items-center gap-2.5 cursor-pointer shadow-lg shadow-red-900/30 active:scale-[0.97]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    {t('wheel.removeAndClose')}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lastRemoved && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed bottom-20 right-4 z-40 glass-card rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-white/80">{t('wheel.undoRemoved', { name: lastRemoved })}</p>
            <button
              onClick={undoRemove}
              className="text-xs font-bold text-brand-yellow uppercase tracking-wider hover:text-yellow-300 transition-colors cursor-pointer"
            >
              {t('wheel.undo')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="glass-card rounded-3xl p-8 md:p-10 max-w-sm w-full text-center"
            >
            <div className="flex justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="#facc15" className="h-14 w-14 drop-shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('welcome.title')}</h2>
              <p className="text-sm text-slate-400 mb-6">{t('welcome.desc')}</p>
              <a
                href="https://instagram.com/hsmnandar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-linear-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-xl text-white font-bold text-sm transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                {t('welcome.follow')}
            </a>
            <button
              onClick={dismissWelcome}
              className="block mx-auto mt-5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              {t('welcome.skip')}
            </button>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* placeholder – theme toggle is fixed outside this div */}

      {/* SEO/GEO: HowTo Section */}
      <section id="cara-pakai" className="mt-6 glass-card p-6 md:p-8 rounded-[24px]" aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold mb-6 text-brand-blue flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          {t('howto.heading')}
        </h2>
        <ol className="space-y-4">
          <li className="flex gap-4 items-start">
            <span className="shrink-0 w-8 h-8 rounded-full bg-brand-yellow/20 text-brand-yellow flex items-center justify-center font-bold text-sm">1</span>
            <div>
              <h3 className="font-semibold text-white/90 mb-1">{t('howto.step1.title')}</h3>
              <p className="text-sm text-slate-300">{t('howto.step1.desc')}</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="shrink-0 w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center font-bold text-sm">2</span>
            <div>
              <h3 className="font-semibold text-white/90 mb-1">{t('howto.step2.title')}</h3>
              <p className="text-sm text-slate-300">{t('howto.step2.desc')}</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="shrink-0 w-8 h-8 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center font-bold text-sm">3</span>
            <div>
              <h3 className="font-semibold text-white/90 mb-1">{t('howto.step3.title')}</h3>
              <p className="text-sm text-slate-300">{t('howto.step3.desc')}</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="shrink-0 w-8 h-8 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center font-bold text-sm">4</span>
            <div>
              <h3 className="font-semibold text-white/90 mb-1">{t('howto.step4.title')}</h3>
              <p className="text-sm text-slate-300">{t('howto.step4.desc')}</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">5</span>
            <div>
              <h3 className="font-semibold text-white/90 mb-1">{t('howto.step5.title')}</h3>
              <p className="text-sm text-slate-300">{t('howto.step5.desc')}</p>
            </div>
          </li>
        </ol>
      </section>

      {/* SEO/GEO: Features Section */}
      <section id="fitur" className="mt-6 glass-card p-6 md:p-8 rounded-[24px]" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-xl font-bold mb-6 text-brand-green flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {t('features.heading')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <span className="text-brand-yellow text-lg">&#9889;</span>
            <div>
              <h3 className="font-semibold text-white/90 text-sm">{t('features.wheel')}</h3>
              <p className="text-xs text-slate-400">{t('features.wheelDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <span className="text-brand-blue text-lg">&#129302;</span>
            <div>
              <h3 className="font-semibold text-white/90 text-sm">{t('features.ai')}</h3>
              <p className="text-xs text-slate-400">{t('features.aiDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <span className="text-brand-green text-lg">&#127912;</span>
            <div>
              <h3 className="font-semibold text-white/90 text-sm">{t('features.confetti')}</h3>
              <p className="text-xs text-slate-400">{t('features.confettiDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <span className="text-brand-red text-lg">&#128241;</span>
            <div>
              <h3 className="font-semibold text-white/90 text-sm">{t('features.responsive')}</h3>
              <p className="text-xs text-slate-400">{t('features.responsiveDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <span className="text-purple-400 text-lg">&#127769;</span>
            <div>
              <h3 className="font-semibold text-white/90 text-sm">{t('features.theme')}</h3>
              <p className="text-xs text-slate-400">{t('features.themeDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <span className="text-orange-400 text-lg">&#128279;</span>
            <div>
              <h3 className="font-semibold text-white/90 text-sm">{t('features.sharing')}</h3>
              <p className="text-xs text-slate-400">{t('features.sharingDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO/GEO: FAQ Section */}
      <section id="faq" className="mt-6 glass-card p-6 md:p-8 rounded-[24px]" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-xl font-bold mb-6 text-brand-yellow flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          {t('faq.heading')}
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-3 px-4 rounded-xl hover:bg-white/5 transition-colors">
              <span className="font-semibold text-white/90">{t('faq.q1')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-open:rotate-180 transition-transform"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="px-4 pb-3 text-sm text-slate-300 leading-relaxed">{t('faq.a1')}</div>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-3 px-4 rounded-xl hover:bg-white/5 transition-colors">
              <span className="font-semibold text-white/90">{t('faq.q2')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-open:rotate-180 transition-transform"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="px-4 pb-3 text-sm text-slate-300 leading-relaxed">{t('faq.a2')}</div>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-3 px-4 rounded-xl hover:bg-white/5 transition-colors">
              <span className="font-semibold text-white/90">{t('faq.q3')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-open:rotate-180 transition-transform"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="px-4 pb-3 text-sm text-slate-300 leading-relaxed">{t('faq.a3')}</div>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-3 px-4 rounded-xl hover:bg-white/5 transition-colors">
              <span className="font-semibold text-white/90">{t('faq.q4')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-open:rotate-180 transition-transform"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="px-4 pb-3 text-sm text-slate-300 leading-relaxed">{t('faq.a4')}</div>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-3 px-4 rounded-xl hover:bg-white/5 transition-colors">
              <span className="font-semibold text-white/90">{t('faq.q5')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-open:rotate-180 transition-transform"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="px-4 pb-3 text-sm text-slate-300 leading-relaxed">{t('faq.a5')}</div>
          </details>
        </div>
      </section>

      {/* ── Footer bar ── */}
      <footer className="mt-6 pt-3 border-t border-white/5">
        <p className="text-[11px] font-medium text-slate-600 tracking-wider select-none">
          &copy; {t('footer.copyright')}
        </p>
      </footer>

      {/* ── Fixed: Utility Bar (top-right) — Language + Theme ── */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-lg text-xs font-black"
          aria-label={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', color: '#facc15' }}
        >
          {lang === 'id' ? 'ID' : 'EN'}
        </button>
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-lg"
          aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
          title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
          style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>

      {/* ── Fixed: Social Share (bottom-right, always visible) ── */}
      <SocialButton />

      {/* ── Toast Feedback ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="toast-feedback glass-card text-white"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

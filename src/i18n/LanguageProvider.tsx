'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations, { Lang } from './translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'id',
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('id');

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'id' || stored === 'en') {
      setLangState(stored);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'en') setLangState('en');
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      let text = translations[lang]?.[key] || translations.id[key] || key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return text;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

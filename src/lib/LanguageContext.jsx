import { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('it');

  const toggle = useCallback(() => {
    setLang(prev => {
      const next = prev === 'it' ? 'en' : 'it';
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  const t = useCallback((it, en) => lang === 'it' ? it : en, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
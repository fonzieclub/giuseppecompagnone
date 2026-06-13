import { Link, useLocation } from 'react-router-dom';
import { Instagram, Youtube } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';

export default function Footer() {
  const { t, lang, toggle } = useLang();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <footer className="border-t border-white/5 bg-[#050505]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {!isHome && (
            <div>
              <h4 className="text-xs font-display uppercase tracking-[0.2em] text-[#F2F2F2] mb-6">{t("SCARICA L'APP", 'DOWNLOAD THE APP')}</h4>
              <div className="flex flex-col gap-3">
                <a
                  href="https://apps.apple.com/it/app/gc-fitness-coach/id6740405707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-black border border-white/20 rounded-xl px-4 py-2.5 hover:border-white/40 transition-all duration-300 min-w-[160px]"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white flex-shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div>
                    <div className="text-[9px] text-white/60 uppercase tracking-wider leading-none">Download on the</div>
                    <div className="text-sm font-semibold text-white leading-tight">App Store</div>
                  </div>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.revoo.gcfitnesscoach"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-black border border-white/20 rounded-xl px-4 py-2.5 hover:border-white/40 transition-all duration-300 min-w-[160px]"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0"><path fill="#EA4335" d="M13.13 11.5L4.08 2.45C4.03 2.64 4 2.83 4 3.04v17.92c0 .21.03.4.08.59l9.05-9.05z"/><path fill="#FBBC05" d="M17.66 9.67L15.16 8.2l-2.03 2.03 2.03 2.03 2.52-1.48a1.5 1.5 0 0 0 0-2.6v-.51z"/><path fill="#34A853" d="M4.08 21.55l9.05-9.05-2.02-2.02-7.03 7.03v.45c0 .21.03.4.08.59H4.08z"/><path fill="#4285F4" d="M4.08 2.45l9.03 9.03L11.11 9.5 4.08 2.45z"/><path fill="#34A853" d="M13.13 12.5l2.03 2.03 2.5-1.47a1.5 1.5 0 0 0 0-2.6l-2.5-1.46-2.03 2.03 2.03 2.47z"/></svg>
                  <div>
                    <div className="text-[9px] text-white/60 uppercase tracking-wider leading-none">Get it on</div>
                    <div className="text-sm font-semibold text-white leading-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          )}
          <div>
            <h4 className="text-xs font-display uppercase tracking-[0.2em] text-[#F2F2F2] mb-6">{t('NAVIGAZIONE', 'NAVIGATION')}</h4>
            <div className="flex flex-col gap-3">
              {[
                                { path: '/chi-sono', it: 'Chi sono', en: 'About' },
                { path: '/servizi', it: 'Servizi', en: 'Services' },
                { path: '/risultati', it: 'Risultati', en: 'Results' },
                { path: '/recensioni', it: 'Recensioni', en: 'Reviews' },
                { path: '/calcola', it: 'Calcola il tuo punto di partenza', en: 'Calculate Your Starting Point' },
                { path: '/contatti', it: 'Richiedi informazioni', en: 'Contact' },
              ].map(link => (
                <Link key={link.path} to={link.path} className="text-sm text-[#888] hover:text-[#2F78F5] transition-colors">
                  {t(link.it, link.en)}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-display uppercase tracking-[0.2em] text-[#F2F2F2] mb-6">{t('SEGUIMI', 'FOLLOW ME')}</h4>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/giuseppe_cmp/" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#888] hover:text-[#2F78F5] hover:border-[#2F78F5] transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@giuseppe_cmp" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#888] hover:text-[#2F78F5] hover:border-[#2F78F5] transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
              </a>
              <a href="https://www.youtube.com/@giuseppe_cmp" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#888] hover:text-[#2F78F5] hover:border-[#2F78F5] transition-all duration-300">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="flex items-center bg-white/5 rounded-full p-1 border border-white/10"
            >
              <span className={`px-3 py-1 text-[11px] font-display rounded-full transition-all duration-300 ${lang === 'it' ? 'bg-[#2F78F5] text-white' : 'text-[#888]'}`}>IT</span>
              <span className={`px-3 py-1 text-[11px] font-display rounded-full transition-all duration-300 ${lang === 'en' ? 'bg-[#2F78F5] text-white' : 'text-[#888]'}`}>EN</span>
            </button>
          </div>
          <p className="text-xs text-[#666] text-center">
            © {new Date().getFullYear()} Giuseppe Compagnone. {t('Tutti i diritti riservati.', 'All rights reserved.')}
          </p>
          <p className="text-xs text-[#666] text-center">
            {lang === 'it' ? (
              <>Sito realizzato da{' '}
                <a href="https://saywell.it" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#2F78F5] transition-colors">saywell</a>
              </>
            ) : (
              <>Made by{' '}
                <a href="https://saywell.it" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#2F78F5] transition-colors">saywell</a>
              </>
            )}
          </p>
          <p className="text-xs text-[#666] text-center">{t('Personal Trainer Certificato — Campania, Italia', 'Certified Personal Trainer — Campania, Italy')}</p>
        </div>
      </div>
    </footer>
  );
}
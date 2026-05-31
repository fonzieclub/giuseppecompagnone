import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import MagneticButton from './MagneticButton';

const navLinks = [
  { path: '/', it: 'HOME', en: 'HOME' },
  { path: '/chi-sono', it: 'CHI SONO', en: 'ABOUT' },
  { path: '/servizi', it: 'SERVIZI', en: 'SERVICES' },
  { path: '/risultati', it: 'RISULTATI', en: 'RESULTS' },
  { path: '/recensioni', it: 'RECENSIONI', en: 'REVIEWS' },
  { path: '/calcola', it: 'CALCOLA IL TUO PUNTO DI PARTENZA', en: 'CALCULATE YOUR STARTING POINT' },
  { path: '/contatti', it: 'RICHIEDI INFORMAZIONI', en: 'CONTACT' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, toggle, t } = useLang();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link to="/" className="flex-shrink-0 flex items-center gap-4">
          <img
            src="/images/logo.png"
            alt="Giuseppe Compagnone"
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-display font-bold text-sm uppercase tracking-[0.15em]">Giuseppe Compagnone</span>
            <span className="text-[#888] font-display text-[10px] uppercase tracking-[0.2em]">Personal Trainer</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] font-display uppercase tracking-[0.15em] transition-colors duration-300 hover:text-[#2F78F5] ${
                location.pathname === link.path ? 'text-[#2F78F5]' : 'text-[#ccc]'
              }`}
            >
              {t(link.it, link.en)}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">



          {/* Mobile menu button */}
          <button
            className="xl:hidden text-white p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="xl:hidden bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 absolute top-20 left-0 right-0">
          <div className="flex flex-col py-8 px-6 gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`text-sm font-display uppercase tracking-[0.15em] transition-colors duration-300 ${
                  location.pathname === link.path ? 'text-[#2F78F5]' : 'text-[#ccc]'
                }`}
              >
                {t(link.it, link.en)}
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  );
}
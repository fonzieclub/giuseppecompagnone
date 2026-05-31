import { useState, useRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';

const transformations = [
  {
    nameIT: 'Filippo', nameEN: 'Filippo',
    resultIT: '-24kg', resultEN: '-24kg',
    descIT: 'Ricomposizione corporea',
    descEN: 'Body recomposition',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/2fd6a5c53_WhatsAppImage2026-05-02at211952.jpg',
  },
  {
    nameIT: 'Mario', nameEN: 'Mario',
    resultIT: '-42kg', resultEN: '-42kg',
    descIT: 'Ricomposizione corporea',
    descEN: 'Body recomposition',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/43958e31e_WhatsAppImage2026-05-02at211953.jpg',
  },
  {
    nameIT: 'Juliana', nameEN: 'Juliana',
    resultIT: '-5kg', resultEN: '-5kg',
    descIT: 'Ricomposizione + aumento massa muscolare',
    descEN: 'Recomposition + muscle mass increase',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/770af428d_WhatsAppImage2026-05-02at2119531.jpg',
  },
  {
    nameIT: 'Irina', nameEN: 'Irina',
    resultIT: '-5kg', resultEN: '-5kg',
    descIT: 'Ricomposizione corporea',
    descEN: 'Body recomposition',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/fbec02159_WhatsAppImage2026-05-02at2119532.jpg',
  },
  {
    nameIT: 'Stacy', nameEN: 'Stacy',
    resultIT: '-14kg', resultEN: '-14kg',
    descIT: 'Ricomposizione corporea',
    descEN: 'Body recomposition',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/3ce2c93a5_WhatsAppImage2026-05-02at2119533.jpg',
  },
  {
    nameIT: 'Cassia', nameEN: 'Cassia',
    resultIT: '+6kg', resultEN: '+6kg',
    descIT: 'Ricomposizione corporea + aumento massa muscolare',
    descEN: 'Body recomposition + muscle mass increase',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/4a81ee269_WhatsAppImage2026-05-02at2119534.jpg',
  },
  {
    nameIT: 'Armando', nameEN: 'Armando',
    resultIT: '-27kg', resultEN: '-27kg',
    descIT: 'Ricomposizione + aumento massa muscolare',
    descEN: 'Recomposition + muscle mass increase',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/8badb8ed8_WhatsAppImage2026-05-02at2119535.jpg',
  },
  {
    nameIT: 'Victoria', nameEN: 'Victoria',
    resultIT: '-4kg', resultEN: '-4kg',
    descIT: 'Ricomposizione corporea',
    descEN: 'Body recomposition',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/a883dcbe1_WhatsAppImage2026-05-02at2119536.jpg',
  },
  {
    nameIT: 'Alfredo', nameEN: 'Alfredo',
    resultIT: '+8kg', resultEN: '+8kg',
    descIT: 'Ricomposizione corporea + aumento massa muscolare',
    descEN: 'Body recomposition + muscle mass increase',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/b303b349e_WhatsAppImage2026-05-02at2119537.jpg',
  },
  {
    nameIT: 'Claudia', nameEN: 'Claudia',
    resultIT: '+2kg', resultEN: '+2kg',
    descIT: 'Aumento massa muscolare',
    descEN: 'Muscle mass increase',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/fc8738b23_WhatsAppImage2026-05-02at2119538.jpg',
  },
  {
    nameIT: 'Massimo', nameEN: 'Massimo',
    resultIT: '-11kg', resultEN: '-11kg',
    descIT: 'Ricomposizione corporea',
    descEN: 'Body recomposition',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/a9dff88d8_WhatsAppImage2026-05-02at2119539.jpg',
  },
  {
    nameIT: 'Vincenzo', nameEN: 'Vincenzo',
    resultIT: '+7kg', resultEN: '+7kg',
    descIT: 'Aumento massa muscolare',
    descEN: 'Muscle mass increase',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/56da86a81_WhatsAppImage2026-05-02at21195310.jpg',
  },
  {
    nameIT: 'Pietro', nameEN: 'Pietro',
    resultIT: '-6kg', resultEN: '-6kg',
    descIT: 'Ricomposizione corporea',
    descEN: 'Body recomposition',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/70f230281_WhatsAppImage2026-05-02at21195311.jpg',
  },
  {
    nameIT: 'Luciana', nameEN: 'Luciana',
    resultIT: '-5kg', resultEN: '-5kg',
    descIT: 'Ricomposizione corporea',
    descEN: 'Body recomposition',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/aff7e5738_WhatsAppImage2026-05-02at21195312.jpg',
  },
  {
    nameIT: 'Angela', nameEN: 'Angela',
    resultIT: '-7kg', resultEN: '-7kg',
    descIT: 'Ricomposizione corporea',
    descEN: 'Body recomposition',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/8c22bcf85_WhatsAppImage2026-05-02at21195313.jpg',
  },
  {
    nameIT: 'Ferdinando', nameEN: 'Ferdinando',
    resultIT: '-5kg', resultEN: '-5kg',
    descIT: 'Ricomposizione corporea',
    descEN: 'Body recomposition',
    photo: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/7c00e233e_WhatsAppImage2026-05-02at21195314.jpg',
  },
];

function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <img
        src={src}
        alt="Transformation"
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function TransformationCarousel() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const next = useCallback(() => setActive(p => (p + 1) % transformations.length), []);
  const prev = useCallback(() => setActive(p => (p - 1 + transformations.length) % transformations.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const item = transformations[active];

  return (
    <>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      <div
        className="w-full"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mx-auto px-3 md:px-12 transition-all duration-500 ease-in-out" style={{ maxWidth: '900px' }}>

          {/* Single photo */}
          <div
            className="relative w-full cursor-zoom-in rounded-2xl overflow-hidden group"
            style={{ boxShadow: '0 20px 60px rgba(47, 120, 245, 0.2), 0 8px 20px rgba(47, 120, 245, 0.15)' }}
            onClick={() => setLightbox(item.photo)}
          >
            <img
              key={active}
              src={item.photo}
              alt={t(item.nameIT, item.nameEN)}
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Text block */}
          <div className="mt-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h4 className="text-2xl md:text-3xl font-display font-bold uppercase text-[#F2F2F2] mb-1">
              {t(item.nameIT, item.nameEN)}
            </h4>
            <p className="text-[#2F78F5] text-lg md:text-xl font-display font-semibold mb-3">
              {t(item.resultIT, item.resultEN)}
            </p>
            <p className="text-sm text-[#999] leading-relaxed">
              {t(item.descIT, item.descEN)}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="hidden md:flex px-6 py-3 rounded-full border border-[#2F78F5] text-[#2F78F5] text-xs font-display uppercase tracking-widest hover:bg-[#2F78F5] hover:text-white transition-all duration-300 btn-sweep min-h-[44px]"
            >
              PREV
            </button>
            <div className="flex gap-2 items-center">
              {transformations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'bg-[#2F78F5] w-8' : 'bg-white/30 w-2'}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="hidden md:flex px-6 py-3 rounded-full border border-[#2F78F5] text-[#2F78F5] text-xs font-display uppercase tracking-widest hover:bg-[#2F78F5] hover:text-white transition-all duration-300 btn-sweep min-h-[44px]"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
import { useState, useRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import { supabase } from '@/lib/supabase';
import { defaultGallery } from '@/data/defaultGallery';

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
  const [transformations, setTransformations] = useState(defaultGallery);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (!error && data?.length) {
        setTransformations(data);
      }
    };
    load();
  }, []);

  const next = useCallback(() => setActive(p => (p + 1) % transformations.length), [transformations.length]);
  const prev = useCallback(() => setActive(p => (p - 1 + transformations.length) % transformations.length), [transformations.length]);

  useEffect(() => {
    if (paused || transformations.length === 0) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next, transformations.length]);

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

  if (transformations.length === 0) return null;

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

          <div
            className="relative w-full cursor-zoom-in rounded-2xl overflow-hidden group"
            style={{ boxShadow: '0 20px 60px rgba(47, 120, 245, 0.2), 0 8px 20px rgba(47, 120, 245, 0.15)' }}
            onClick={() => setLightbox(item.image_url)}
          >
            <img
              key={active}
              src={item.image_url}
              alt={t(item.name_it, item.name_en)}
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="mt-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h4 className="text-2xl md:text-3xl font-display font-bold uppercase text-[#F2F2F2] mb-1">
              {t(item.name_it, item.name_en)}
            </h4>
            <p className="text-[#2F78F5] text-lg md:text-xl font-display font-semibold mb-3">
              {t(item.result_it, item.result_en)}
            </p>
            <p className="text-sm text-[#999] leading-relaxed">
              {t(item.desc_it, item.desc_en)}
            </p>
          </div>

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

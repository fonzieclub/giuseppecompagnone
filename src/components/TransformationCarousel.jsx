import { useState, useRef, useCallback, useEffect } from 'react';
import { useLang } from '../lib/LanguageContext';
import { supabase } from '@/lib/supabase';
import { defaultGallery } from '@/data/defaultGallery';

const SLIDE_MS = 700;

export default function TransformationCarousel() {
  const { t } = useLang();
  const [transformations, setTransformations] = useState(defaultGallery);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(null);
  const containerRef = useRef(null);

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

  const goTo = useCallback((index) => {
    setActive((index + transformations.length) % transformations.length);
    setDragOffset(0);
  }, [transformations.length]);

  const next = useCallback(() => {
    setActive(p => (p + 1) % transformations.length);
    setDragOffset(0);
  }, [transformations.length]);

  const prev = useCallback(() => {
    setActive(p => (p - 1 + transformations.length) % transformations.length);
    setDragOffset(0);
  }, [transformations.length]);

  useEffect(() => {
    if (paused || transformations.length === 0) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next, transformations.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setPaused(true);
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const width = containerRef.current?.offsetWidth || 1;

    if (Math.abs(diff) > width * 0.15) {
      diff > 0 ? next() : prev();
    } else {
      setDragOffset(0);
    }

    touchStartX.current = null;
    setIsDragging(false);
    setPaused(false);
  };

  if (transformations.length === 0) return null;

  const item = transformations[active];
  const slideKey = (item) => item.id ?? item.image_url;

  return (
    <div
      className="w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mx-auto px-3 md:px-12" style={{ maxWidth: '900px' }}>
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ boxShadow: '0 20px 60px rgba(47, 120, 245, 0.2), 0 8px 20px rgba(47, 120, 245, 0.15)' }}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(calc(-${active * 100}% + ${dragOffset}px))`,
              transition: isDragging ? 'none' : `transform ${SLIDE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {transformations.map((slide) => (
              <div key={slideKey(slide)} className="w-full flex-shrink-0">
                <img
                  src={slide.image_url}
                  alt={t(slide.name_it, slide.name_en)}
                  className="w-full h-auto block pointer-events-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          key={slideKey(item)}
          className="mt-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 text-center transition-opacity duration-500 ease-in-out"
        >
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
            type="button"
            onClick={prev}
            className="hidden md:flex px-6 py-3 rounded-full border border-[#2F78F5] text-[#2F78F5] text-xs font-display uppercase tracking-widest hover:bg-[#2F78F5] hover:text-white transition-all duration-300 btn-sweep min-h-[44px]"
          >
            PREV
          </button>
          <div className="flex gap-2 items-center">
            {transformations.map((slide, i) => (
              <button
                key={slideKey(slide)}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'bg-[#2F78F5] w-8' : 'bg-white/30 w-2'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="hidden md:flex px-6 py-3 rounded-full border border-[#2F78F5] text-[#2F78F5] text-xs font-display uppercase tracking-widest hover:bg-[#2F78F5] hover:text-white transition-all duration-300 btn-sweep min-h-[44px]"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

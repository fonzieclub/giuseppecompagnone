import { useState, useRef, useCallback, useEffect } from 'react';
import { useLang } from '../lib/LanguageContext';
import { supabase } from '@/lib/supabase';
import { defaultGallery } from '@/data/defaultGallery';

const SLIDE_MS = 500;
const AUTO_MS = 5000;

export default function TransformationCarousel() {
  const { t } = useLang();
  const [transformations, setTransformations] = useState(defaultGallery);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const dragOffsetRef = useRef(0);
  const slideRef = useRef(null);
  const containerRef = useRef(null);

  const count = transformations.length;
  const slideKey = (item) => item?.id ?? item?.image_url;

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

  const applyTransform = useCallback((offsetPx, animate) => {
    const el = slideRef.current;
    if (!el) return;
    el.style.transition = animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none';
    el.style.transform = offsetPx === 0 ? 'translate3d(0,0,0)' : `translate3d(${offsetPx}px,0,0)`;
  }, []);

  const goTo = useCallback((index) => {
    dragOffsetRef.current = 0;
    applyTransform(0, true);
    setActive((index + count) % count);
  }, [count, applyTransform]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused || count === 0) return;
    const id = window.setInterval(() => {
      setActive(p => (p + 1) % count);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  useEffect(() => {
    dragOffsetRef.current = 0;
    applyTransform(0, false);
  }, [active, applyTransform]);

  useEffect(() => {
    if (count < 2) return;
    const preload = (index) => {
      const src = transformations[index]?.image_url;
      if (!src) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    };
    preload((active + 1) % count);
    preload((active - 1 + count) % count);
  }, [active, count, transformations]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
    if (slideRef.current) slideRef.current.style.willChange = 'transform';
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const offset = e.touches[0].clientX - touchStartX.current;
    dragOffsetRef.current = offset;
    applyTransform(offset, false);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const width = containerRef.current?.offsetWidth || 1;

    if (slideRef.current) slideRef.current.style.willChange = 'auto';

    if (Math.abs(diff) > width * 0.12) {
      diff > 0 ? next() : prev();
    } else {
      dragOffsetRef.current = 0;
      applyTransform(0, true);
    }

    touchStartX.current = null;
    setPaused(false);
  };

  if (count === 0) return null;

  const item = transformations[active];

  return (
    <div
      className="w-full select-none carousel-root"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto px-3 md:px-12" style={{ maxWidth: '900px' }}>
        <div
          ref={containerRef}
          className="carousel-viewport relative w-full overflow-hidden rounded-2xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div ref={slideRef} className="carousel-slide">
            <img
              key={slideKey(item)}
              src={item.image_url}
              alt={t(item.name_it, item.name_en)}
              className="carousel-slide-img"
              draggable={false}
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className="mt-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 text-center">
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
            className="hidden md:flex px-6 py-3 rounded-full border border-[#2F78F5] text-[#2F78F5] text-xs font-display uppercase tracking-widest hover:bg-[#2F78F5] hover:text-white transition-colors duration-300 min-h-[44px]"
          >
            PREV
          </button>
          <div className="flex gap-2 items-center">
            {transformations.map((slide, i) => (
              <button
                key={slideKey(slide)}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-[width,background-color] duration-300 ${i === active ? 'bg-[#2F78F5] w-8' : 'bg-white/30 w-2'}`}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === active ? 'true' : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="hidden md:flex px-6 py-3 rounded-full border border-[#2F78F5] text-[#2F78F5] text-xs font-display uppercase tracking-widest hover:bg-[#2F78F5] hover:text-white transition-colors duration-300 min-h-[44px]"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

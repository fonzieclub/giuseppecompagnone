import { useState, useRef, useCallback, useEffect } from 'react';
import { useLang } from '../lib/LanguageContext';
import { supabase } from '@/lib/supabase';
import { defaultGallery } from '@/data/defaultGallery';

const SLIDE_MS = 380;
const AUTO_MS = 5000;
const LOCK_THRESHOLD = 10;

export default function TransformationCarousel() {
  const { t } = useLang();
  const [transformations, setTransformations] = useState(defaultGallery);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef(null);
  const slideRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const dragOffsetRef = useRef(0);
  const isHorizontalLock = useRef(false);
  const rafId = useRef(null);
  const activeRef = useRef(0);
  const countRef = useRef(0);

  const count = transformations.length;
  const slideKey = (item) => item?.id ?? item?.image_url;

  activeRef.current = active;
  countRef.current = count;

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
    el.style.transition = animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` : 'none';
    el.style.transform = offsetPx === 0 ? 'translate3d(0,0,0)' : `translate3d(${offsetPx}px,0,0)`;
  }, []);

  const scheduleTransform = useCallback((offsetPx, animate) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      applyTransform(offsetPx, animate);
      rafId.current = null;
    });
  }, [applyTransform]);

  const commitSlide = useCallback((direction) => {
    const width = containerRef.current?.offsetWidth || 1;
    const target = direction === 'next' ? -width : width;

    applyTransform(target, true);

    window.setTimeout(() => {
      const c = countRef.current;
      if (c === 0) return;
      const nextIndex =
        direction === 'next'
          ? (activeRef.current + 1) % c
          : (activeRef.current - 1 + c) % c;
      dragOffsetRef.current = 0;
      setActive(nextIndex);
      applyTransform(0, false);
    }, SLIDE_MS);
  }, [applyTransform]);

  const goTo = useCallback((index) => {
    const c = countRef.current;
    if (c === 0) return;
    const target = ((index % c) + c) % c;
    if (target === activeRef.current) return;

    const direction = target > activeRef.current ? 'next' : 'prev';
    if (target === (activeRef.current + 1) % c) {
      commitSlide('next');
    } else if (target === (activeRef.current - 1 + c) % c) {
      commitSlide('prev');
    } else {
      dragOffsetRef.current = 0;
      setActive(target);
      applyTransform(0, false);
    }
  }, [commitSlide, applyTransform]);

  useEffect(() => {
    if (paused || count === 0) return;
    const id = window.setInterval(() => commitSlide('next'), AUTO_MS);
    return () => clearInterval(id);
  }, [paused, count, commitSlide]);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      dragOffsetRef.current = 0;
      isHorizontalLock.current = false;
      setPaused(true);
      if (slideRef.current) slideRef.current.style.willChange = 'transform';
    };

    const onTouchMove = (e) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      if (e.touches.length !== 1) return;

      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - touchStartX.current;
      const dy = y - touchStartY.current;

      if (!isHorizontalLock.current) {
        if (Math.abs(dx) < LOCK_THRESHOLD && Math.abs(dy) < LOCK_THRESHOLD) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          isHorizontalLock.current = true;
        } else {
          touchStartX.current = null;
          touchStartY.current = null;
          return;
        }
      }

      e.preventDefault();
      dragOffsetRef.current = dx;
      scheduleTransform(dx, false);
    };

    const onTouchEnd = (e) => {
      if (touchStartX.current === null) return;

      const wasLocked = isHorizontalLock.current;
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      const width = el.offsetWidth || 1;

      touchStartX.current = null;
      touchStartY.current = null;
      isHorizontalLock.current = false;

      if (slideRef.current) slideRef.current.style.willChange = 'auto';

      if (!wasLocked) {
        setPaused(false);
        return;
      }

      if (Math.abs(diff) > width * 0.12) {
        commitSlide(diff > 0 ? 'next' : 'prev');
      } else {
        dragOffsetRef.current = 0;
        scheduleTransform(0, true);
      }

      setPaused(false);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [commitSlide, scheduleTransform]);

  if (count === 0) return null;

  const item = transformations[active];

  return (
    <div
      className="w-full select-none carousel-root"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto px-3 md:px-12" style={{ maxWidth: '900px' }}>
        <div ref={containerRef} className="carousel-viewport relative w-full overflow-hidden rounded-2xl">
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
            onClick={() => commitSlide('prev')}
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
            onClick={() => commitSlide('next')}
            className="hidden md:flex px-6 py-3 rounded-full border border-[#2F78F5] text-[#2F78F5] text-xs font-display uppercase tracking-widest hover:bg-[#2F78F5] hover:text-white transition-colors duration-300 min-h-[44px]"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

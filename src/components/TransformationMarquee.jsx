import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { defaultGallery } from '@/data/defaultGallery';

const COPIES = 3;

export default function TransformationMarquee() {
  const [images, setImages] = useState(defaultGallery);
  const contentRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('image_url')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (!error && data?.length) {
        setImages(data);
      }
    };
    load();
  }, []);

  const updateMarqueeSpeed = useCallback(() => {
    const el = contentRef.current;
    if (!el || images.length === 0) return;

    const setWidth = el.scrollWidth / COPIES;
    if (setWidth <= 0) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const pxPerSecond = isMobile ? 100 : 60;
    const duration = Math.max(setWidth / pxPerSecond, isMobile ? 12 : 20);

    el.style.setProperty('--marquee-duration', `${duration}s`);
  }, [images.length]);

  useEffect(() => {
    updateMarqueeSpeed();

    const el = contentRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(updateMarqueeSpeed);
    resizeObserver.observe(el);

    const imgs = el.querySelectorAll('img');
    imgs.forEach(img => {
      if (img.complete) return;
      img.addEventListener('load', updateMarqueeSpeed, { once: true });
    });

    window.addEventListener('resize', updateMarqueeSpeed);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateMarqueeSpeed);
    };
  }, [images, updateMarqueeSpeed]);

  if (images.length === 0) return null;

  const repeated = Array.from({ length: COPIES }, () => images).flat();

  return (
    <div className="gallery-marquee-container">
      <div ref={contentRef} className="gallery-marquee-content">
        {repeated.map((item, i) => (
          <img
            key={`${item.image_url}-${i}`}
            src={item.image_url}
            alt=""
            className="gallery-marquee-img"
            loading={i < 6 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

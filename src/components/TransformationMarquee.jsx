import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { defaultGallery } from '@/data/defaultGallery';

export default function TransformationMarquee() {
  const [images, setImages] = useState(defaultGallery);

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

  if (images.length === 0) return null;

  const repeated = [...images, ...images, ...images];

  return (
    <div className="gallery-marquee-container">
      <div className="gallery-marquee-content">
        {repeated.map((item, i) => (
          <img
            key={i}
            src={item.image_url}
            alt=""
            className="gallery-marquee-img"
            loading="lazy"
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

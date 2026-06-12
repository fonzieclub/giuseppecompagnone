import { useEffect, useRef, useState } from 'react';

export default function AnimatedHeadline({ text, className = '', immediate = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (immediate) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [immediate]);

  const words = text.split(' ');
  let letterIndex = 0;

  return (
    <h2 ref={ref} className={`w-full ${className}`}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.3em] last:mr-0">
          {word.split('').map((char, ci) => {
            const delay = letterIndex++ * 35;
            return (
              <span
                key={ci}
                className="inline-block transition-[transform,opacity] duration-700 ease-out"
                style={{
                  transform: visible ? 'translateY(0)' : 'translateY(0.35em)',
                  opacity: visible ? 1 : 0,
                  transitionDelay: `${delay}ms`,
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

import { useEffect, useRef, useState } from 'react';

export default function AnimatedHeadline({ text, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <h2 ref={ref} className={`flex flex-wrap w-full ${className} justify-center`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.3em]"
        >
          <span
            className="inline-block transition-all duration-700"
            style={{
              transform: visible ? 'translateY(0)' : 'translateY(100%)',
              opacity: visible ? 1 : 0,
              transitionDelay: `${i * 100}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </h2>
  );
}
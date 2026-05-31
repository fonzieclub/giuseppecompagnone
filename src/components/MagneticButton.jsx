import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MagneticButton({ children, href, onClick, variant = 'filled', className = '' }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.15;
    const dy = (e.clientY - cy) * 0.15;
    setOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const base = `inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-semibold font-display uppercase tracking-wider transition-all duration-300 cursor-pointer min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#2F78F5] focus:ring-offset-2 focus:ring-offset-[#050505]`;
  const variants = {
    filled: `bg-[#2F78F5] text-white hover:shadow-[0_0_30px_rgba(47,120,245,0.4)] btn-sweep`,
    outline: `border border-white/30 text-white hover:border-[#2F78F5] btn-sweep`,
  };

  const style = { transform: `translate(${offset.x}px, ${offset.y}px)`, transition: 'transform 0.2s ease-out' };

  const props = {
    ref,
    className: `${base} ${variants[variant]} ${className}`,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };

  if (href) {
    return <Link to={href} {...props}>{children}</Link>;
  }
  return <button onClick={onClick} {...props}>{children}</button>;
}
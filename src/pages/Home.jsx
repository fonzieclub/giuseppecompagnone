import { useRef, useState } from 'react';
import useLenis from '../hooks/useLenis';
import { useLang } from '../lib/LanguageContext';
import AnimatedHeadline from '../components/AnimatedHeadline';
import MagneticButton from '../components/MagneticButton';
import CountUp from '../components/CountUp';
import MarqueeStrip from '../components/MarqueeStrip';
import StatsBanner from '../components/StatsBanner';
import TransformationMarquee from '../components/TransformationMarquee';
import AppShowcase from '../components/AppShowcase';

export default function Home() {
  const { t } = useLang();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  useLenis(({ scroll }) => setScrollY(scroll));

  return (
    <>
      {/* SEO */}
      <h1 className="sr-only">Giuseppe Compagnone — Personal Trainer Certificato, Campania, Italia</h1>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen lg:h-[88vh] overflow-hidden bg-[#050505]">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-giuseppe.png"
            alt="Giuseppe Compagnone — Personal Trainer"
            className="w-full h-full object-cover object-top"
            style={{ transform: `scale(1.05) translateY(${scrollY * 0.05}px)`, transition: 'transform 0.1s linear' }}
          />
          {/* Blue gradient overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 40%, rgba(47,120,245,0.35) 75%, rgba(10,30,80,0.6) 100%)' }} />
          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-16 left-6 lg:left-12 z-20 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#2F78F5]" />
            <span className="text-xs font-display uppercase tracking-[0.2em] text-[#888]">
              CERTIFIED PERSONAL TRAINER
            </span>
          </div>
          <AnimatedHeadline
            immediate
            text={t('LA TUA NUOVA VERSIONE TI ASPETTA', 'YOUR NEW YOU AWAITS')}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-bold uppercase leading-[0.95] mb-6 text-left"
          />
          <p className="text-sm md:text-base text-[#999] leading-relaxed mb-8 max-w-md">
            {t(
              'Il cambiamento arriva quando smetti di improvisare.',
              'Change comes when you stop improvising.'
            )}
          </p>
          <div className="flex flex-wrap gap-4">
            <MagneticButton href="/contatti">
              {t('PRENOTA UNA CONSULENZA GRATUITA', 'BOOK A FREE CONSULTATION')}
            </MagneticButton>
            <MagneticButton href="/servizi" variant="outline">
              {t('SCOPRI I SERVIZI', 'EXPLORE SERVICES')}
            </MagneticButton>
          </div>
        </div>


      </section>

      {/* Marquee */}
      <MarqueeStrip />
      <StatsBanner />

      <section className="bg-[#050505] pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-12 w-full flex justify-center">
          <AnimatedHeadline
            text={t('TRASFORMAZIONI', 'TRANSFORMATIONS')}
            className="text-4xl md:text-6xl font-display font-bold uppercase text-center w-full"
          />
        </div>
        <TransformationMarquee />
      </section>

      <AppShowcase />
    </>
  );
}
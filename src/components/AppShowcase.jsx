import { useLang } from '../lib/LanguageContext';
import AnimatedHeadline from './AnimatedHeadline';
import ScrollReveal from './ScrollReveal';

export default function AppShowcase() {
  const { t } = useLang();

  return (
    <section className="bg-[#050505] py-24 md:py-36">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
        <AnimatedHeadline
          text={t('Il tuo percorso, sempre con te', 'Your journey, always with you')}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-bold uppercase leading-tight mb-6 max-w-3xl mx-auto"
        />
        <p className="text-sm md:text-base text-[#888] leading-relaxed max-w-xl mx-auto mb-14">
          {t(
            'Programmi, progressi e supporto diretto, sempre a portata di mano.',
            'Programmes, progress and direct support, always at hand.'
          )}
        </p>

        <ScrollReveal>
          <div className="relative mx-auto mb-10" style={{ width: '85vw', maxWidth: '1200px' }}>
            <img
              src="/images/app-phone.png"
              alt="GC Fitness Coach App"
              className="w-full h-auto block"

            />

          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <a
              href="https://apps.apple.com/it/app/gc-fitness-coach/id6740405707"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black border border-white/20 rounded-xl px-4 py-2.5 hover:border-white/40 transition-all duration-300 min-w-[160px]"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white flex-shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div>
                <div className="text-[9px] text-white/60 uppercase tracking-wider leading-none">Download on the</div>
                <div className="text-sm font-semibold text-white leading-tight">App Store</div>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.revoo.gcfitnesscoach"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black border border-white/20 rounded-xl px-4 py-2.5 hover:border-white/40 transition-all duration-300 min-w-[160px]"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0"><path fill="#EA4335" d="M13.13 11.5L4.08 2.45C4.03 2.64 4 2.83 4 3.04v17.92c0 .21.03.4.08.59l9.05-9.05z"/><path fill="#FBBC05" d="M17.66 9.67L15.16 8.2l-2.03 2.03 2.03 2.03 2.52-1.48a1.5 1.5 0 0 0 0-2.6v-.51z"/><path fill="#34A853" d="M4.08 21.55l9.05-9.05-2.02-2.02-7.03 7.03v.45c0 .21.03.4.08.59H4.08z"/><path fill="#4285F4" d="M4.08 2.45l9.03 9.03L11.11 9.5 4.08 2.45z"/><path fill="#34A853" d="M13.13 12.5l2.03 2.03 2.5-1.47a1.5 1.5 0 0 0 0-2.6l-2.5-1.46-2.03 2.03 2.03 2.47z"/></svg>
              <div>
                <div className="text-[9px] text-white/60 uppercase tracking-wider leading-none">Get it on</div>
                <div className="text-sm font-semibold text-white leading-tight">Google Play</div>
              </div>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
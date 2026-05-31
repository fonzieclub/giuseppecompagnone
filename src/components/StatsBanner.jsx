import { useLang } from '../lib/LanguageContext';
import CountUp from './CountUp';

export default function StatsBanner() {
  const { t } = useLang();

  return (
    <div className="w-full" style={{ background: 'rgba(47,120,245,0.82)' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-24">
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-display font-black text-white">
            <CountUp end={100} suffix="%" />
          </div>
          <p className="text-xs font-display uppercase tracking-[0.2em] text-white/80 mt-2">
            {t('Soddisfazione Garantita', 'Satisfaction Guaranteed')}
          </p>
        </div>
        <div className="hidden sm:block w-px h-12 bg-white/30" />
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-display font-black text-white">
            <CountUp end={19} suffix="+" />
          </div>
          <p className="text-xs font-display uppercase tracking-[0.2em] text-white/80 mt-2">
            {t('Anni di Esperienza', 'Years of Experience')}
          </p>
        </div>
      </div>
    </div>
  );
}
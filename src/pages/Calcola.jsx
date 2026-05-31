import { useLang } from '../lib/LanguageContext';
import AnimatedHeadline from '../components/AnimatedHeadline';
import BMRCalculator from '../components/BMRCalculator';

export default function Calcola() {
  const { t } = useLang();

  return (
    <section className="min-h-screen bg-[#050505] py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <AnimatedHeadline
            text={t('CALCOLA IL TUO PUNTO DI PARTENZA', 'CALCULATE YOUR STARTING POINT')}
            className="text-3xl md:text-5xl font-display font-bold uppercase max-w-3xl mx-auto"
          />
        </div>
        <BMRCalculator />
      </div>
    </section>
  );
}
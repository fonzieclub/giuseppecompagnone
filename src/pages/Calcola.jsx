import { useLang } from '../lib/LanguageContext';
import AnimatedHeadline from '../components/AnimatedHeadline';
import BMRCalculator from '../components/BMRCalculator';

export default function Calcola() {
  const { t } = useLang();

  return (
    <section className="min-h-screen bg-[#050505] py-16 md:py-32 overflow-x-clip">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedHeadline
            text={t('BMR, TDEE E BMI', 'BMR, TDEE & BMI')}
            className="text-3xl md:text-5xl font-display font-bold uppercase"
          />
          <p className="text-sm text-[#888] mt-6 leading-relaxed">
            {t(
              'Capire il metabolismo è il primo passo verso un piano alimentare e di allenamento che funziona davvero — non una dieta copiata da internet.',
              'Understanding your metabolism is the first step toward a nutrition and training plan that actually works — not a diet copied from the internet.'
            )}
          </p>
        </div>
        <BMRCalculator />
      </div>
    </section>
  );
}
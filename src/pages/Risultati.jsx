import { useLang } from '../lib/LanguageContext';
import SectionLabel from '../components/SectionLabel';
import AnimatedHeadline from '../components/AnimatedHeadline';
import TransformationCarousel from '../components/TransformationCarousel';


export default function Risultati() {
  const { t } = useLang();

  return (
    <section className="min-h-screen bg-[#050505]">
      {/* Transformation section */}
      <div className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-16 w-full flex justify-center">
  <AnimatedHeadline
    text={t('TRASFORMAZIONI', 'TRANSFORMATIONS')}
    className="text-4xl md:text-6xl font-display font-bold uppercase text-center w-full"
  />
</div>
        <TransformationCarousel />
      </div>


    </section>
  );
}
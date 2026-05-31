import { useLang } from '../lib/LanguageContext';
import AnimatedHeadline from '../components/AnimatedHeadline';
import ScrollReveal from '../components/ScrollReveal';
import MagneticButton from '../components/MagneticButton';
import SectionLabel from '../components/SectionLabel';

const steps = [
  {
    num: '01',
    titleIT: 'VALUTAZIONE',
    titleEN: 'ASSESSMENT',
    descIT: 'Analizziamo la tua condizione fisica, i tuoi obiettivi e le tue esigenze attraverso una consulenza iniziale e un\'anamnesi dettagliata all\'interno dell\'app.',
    descEN: 'We analyse your physical condition, your goals and your needs through an initial consultation and a detailed assessment within the app.',
  },
  {
    num: '02',
    titleIT: 'PIANO PERSONALIZZATO',
    titleEN: 'PERSONALISED PLAN',
    descIT: 'Creazione di un programma di allenamento su misura e di una guida nutrizionale calibrati sul tuo metabolismo, sul tuo stile di vita e sui tuoi obiettivi.',
    descEN: 'Creation of a tailored training programme and nutritional guide calibrated to your metabolism, lifestyle and goals.',
  },
  {
    num: '03',
    titleIT: 'ALLENAMENTO',
    titleEN: 'TRAINING',
    descIT: 'Sessioni in presenza con supervisione diretta, cura della tecnica e adattamento alle caratteristiche del cliente.',
    descEN: "In-person sessions with direct supervision, attention to technique and adaptation to the client's individual characteristics.",
  },
  {
    num: '04',
    titleIT: 'MONITORAGGIO PROGRESSI',
    titleEN: 'PROGRESS MONITORING',
    descIT: 'Check settimanali con analisi dei progressi tramite misurazioni e foto, aggiornamento del piano e supporto continuo. Feedback diretto tramite app, WhatsApp ed email. Il programma si evolve con te.',
    descEN: 'Weekly check-ins with progress analysis through measurements and photos, plan updates and ongoing support. Direct feedback via app, WhatsApp and email. The programme evolves with you.',
  },
];

export default function MetodoPersonale() {
  const { t } = useLang();

  return (
    <section className="min-h-screen bg-[#050505] py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="max-w-xl mb-20">
          <SectionLabel text={t('ALLENAMENTO 1:1', '1:1 TRAINING')} />
          <AnimatedHeadline
            text={t('IL MIO METODO', 'MY METHOD')}
            className="text-4xl md:text-6xl font-display font-bold uppercase mb-6"
          />
          <p className="text-sm text-[#888] leading-relaxed">
            {t(
              'Un percorso strutturato in 4 fasi per l\'allenamento personale in presenza.',
              'A structured 4-phase journey for personal in-person training.'
            )}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-16 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 150}>
                <div className="flex gap-8 md:gap-16 items-start">
                  <div className="relative z-10 flex-shrink-0">
                    <span className="text-5xl md:text-7xl font-display font-bold text-[#2F78F5] opacity-80">
                      {step.num}
                    </span>
                    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#2F78F5] shadow-[0_0_10px_rgba(47,120,245,0.5)]" />
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl md:text-2xl font-display font-bold uppercase mb-4 text-[#F2F2F2]">
                      {t(step.titleIT, step.titleEN)}
                    </h3>
                    <p className="text-sm md:text-base text-[#999] leading-relaxed max-w-lg">
                      {t(step.descIT, step.descEN)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={600}>
          <div className="mt-20 text-center">
            <MagneticButton href="/contatti">
              {t('PRENOTA UNA CONSULENZA GRATUITA', 'BOOK A FREE CONSULTATION')}
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
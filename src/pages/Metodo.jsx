import { useLang } from '../lib/LanguageContext';
import SectionLabel from '../components/SectionLabel';
import AnimatedHeadline from '../components/AnimatedHeadline';
import ScrollReveal from '../components/ScrollReveal';
import MagneticButton from '../components/MagneticButton';

const steps = [
  {
    num: '01',
    titleIT: 'VALUTAZIONE',
    titleEN: 'ASSESSMENT',
    descIT: 'Analizziamo insieme la tua condizione fisica attuale, i tuoi obiettivi e le tue esigenze tramite una video call approfondita. Nessun dettaglio viene trascurato.',
    descEN: 'Together we analyze your current physical condition, your goals, and your needs through an in-depth video call. No detail is overlooked.',
  },
  {
    num: '02',
    titleIT: 'PIANO PERSONALIZZATO',
    titleEN: 'PERSONALIZED PLAN',
    descIT: 'Creo un programma di allenamento e alimentazione su misura, calibrato esattamente sul tuo metabolismo, le tue capacità e il tuo stile di vita.',
    descEN: 'I create a custom training and nutrition program, calibrated exactly to your metabolism, your abilities, and your lifestyle.',
  },
  {
    num: '03',
    titleIT: 'ALLENAMENTO',
    titleEN: 'TRAINING',
    descIT: 'Sessioni guidate via video call o programmazione dettagliata per allenamento autonomo. Ogni esercizio è spiegato con video e istruzioni precise.',
    descEN: 'Guided sessions via video call or detailed programming for autonomous training. Every exercise is explained with video and precise instructions.',
  },
  {
    num: '04',
    titleIT: 'MONITORAGGIO PROGRESSI',
    titleEN: 'PROGRESS MONITORING',
    descIT: 'Check-in settimanali con analisi dei progressi, adattamento del piano e supporto continuo. Il tuo programma evolve con te.',
    descEN: 'Weekly check-ins with progress analysis, plan adaptation, and continuous support. Your program evolves with you.',
  },
];

export default function Metodo() {
  const { t } = useLang();

  return (
    <section className="min-h-screen bg-[#050505] py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="max-w-xl mb-20">
          <SectionLabel text={t('IL PROCESSO', 'THE PROCESS')} />
          <AnimatedHeadline
            text={t('IL MIO METODO', 'MY METHOD')}
            className="text-4xl md:text-6xl font-display font-bold uppercase mb-6"
          />
          <p className="text-sm text-[#888] leading-relaxed">
            {t(
              'Un percorso strutturato in 4 fasi, interamente fruibile online via video call e programmazione personalizzata. Funziona ovunque tu sia.',
              'A structured 4-phase journey, entirely available online via video call and personalized programming. It works wherever you are.'
            )}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-16 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 150}>
                <div className="flex gap-8 md:gap-16 items-start">
                  {/* Number */}
                  <div className="relative z-10 flex-shrink-0">
                    <span className="text-5xl md:text-7xl font-display font-bold text-[#2F78F5] opacity-80">
                      {step.num}
                    </span>
                    {/* Dot on line */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#2F78F5] shadow-[0_0_10px_rgba(47,120,245,0.5)]" />
                  </div>

                  {/* Content */}
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
              {t('INIZIA ADESSO →', 'START NOW →')}
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
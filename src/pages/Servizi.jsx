import { Link } from 'react-router-dom';
import { useLang } from '../lib/LanguageContext';
import SectionLabel from '../components/SectionLabel';
import AnimatedHeadline from '../components/AnimatedHeadline';
import ScrollReveal from '../components/ScrollReveal';

const services = [
  {
    num: '01',
    titleIT: '01 — ALLENAMENTO 1:1',
    titleEN: '01 — 1:1 TRAINING',
    descIT: 'Allenamenti individuali con supervisione costante e cura di ogni dettaglio.',
    descEN: 'Individual training sessions with constant supervision and attention to every detail.',
    image: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/4286eb487_generated_b97c7820.png',
    href: '/metodo-personale',
  },
  {
    num: '02',
    titleIT: '02 — COACHING ONLINE',
    titleEN: '02 — ONLINE COACHING',
    descIT: 'Allenamento personalizzato e supervisione settimanale, per risultati ovunque tu sia.',
    descEN: 'Personalised training and weekly supervision, for results wherever you are.',
    image: 'https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/af45d6421_generated_207f0899.png',
    href: '/metodo-online',
  },
];

export default function Servizi() {
  const { t } = useLang();

  return (
    <section className="min-h-screen bg-[#050505] py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-16 gap-6">
          <div>
            <AnimatedHeadline
              text={t('I MIEI SERVIZI', 'MY SERVICES')}
              className="text-4xl md:text-6xl font-display font-bold uppercase"
            />
          </div>
          <p className="text-sm text-[#888] leading-relaxed max-w-sm md:text-right md:mt-8">
            {t(
              'Ogni programma è pensato per il tuo corpo, la tua routine e i tuoi obiettivi.',
              'Every programme is designed around your body, your routine and your goals.'
            )}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <ScrollReveal key={service.num} delay={i * 200}>
              <Link to={service.href} className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer block">
                <img
                  src={service.image}
                  alt={t(service.titleIT, service.titleEN)}
                  className="absolute inset-0 w-full h-full object-cover ken-burns transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <h3 className="text-xl md:text-2xl font-display font-bold uppercase mb-3">
                    {t(service.titleIT, service.titleEN)}
                  </h3>
                  <p className="text-sm text-[#999] leading-relaxed max-w-sm">
                    {t(service.descIT, service.descEN)}
                  </p>
                  <span className="mt-4 inline-block text-xs font-display text-[#2F78F5] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t('Scopri di più →', 'Learn more →')}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
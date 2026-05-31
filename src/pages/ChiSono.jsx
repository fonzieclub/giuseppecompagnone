import { useState } from 'react';
import { useLang } from '../lib/LanguageContext';
import useLenis from '../hooks/useLenis';
import SectionLabel from '../components/SectionLabel';
import AnimatedHeadline from '../components/AnimatedHeadline';
import ScrollReveal from '../components/ScrollReveal';
import MagneticButton from '../components/MagneticButton';

export default function ChiSono() {
  const { t } = useLang();
  const [scrollY, setScrollY] = useState(0);
  useLenis(({ scroll }) => setScrollY(scroll));

  return (
    <section className="min-h-screen bg-[#050505] py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <ScrollReveal direction="left">
            <div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(to right, #0a0a0a 0%, #1a2845 100%)' }}
            >
              <img
                src="https://media.base44.com/images/public/69f51acefd0e16cb4ea978c4/716f14377_GiuseppeNoBGBlu.png"
                alt="Giuseppe Compagnone — Personal Trainer Certificato"
                className="w-full h-full object-cover ken-burns"
                style={{
                  transform: `scale(1.1) translateY(${scrollY * 0.06}px)`,
                  transition: 'transform 0.1s linear',
                  filter: 'brightness(0.95) contrast(1.05) saturate(0.9)',
                  boxShadow: 'inset 0 0 100px rgba(47, 120, 245, 0.15)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent" />
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="right" delay={200}>
            <SectionLabel text={t('CHI SONO', 'ABOUT ME')} />
            <AnimatedHeadline
              text={t('GIUSEPPE COMPAGNONE', 'GIUSEPPE COMPAGNONE')}
              className="text-3xl md:text-5xl font-display font-bold uppercase mb-8"
            />
            <div className="space-y-5 text-[#999] text-sm md:text-base leading-relaxed">
              <p>{t('Sono un personal trainer con 19 anni di esperienza nel mondo del fitness, di cui oltre 8 anni dedicati al coaching personalizzato.', 'I am a personal trainer with 19 years of experience in the fitness industry, more than 8 of which have been dedicated to personalised coaching.')}</p>
              <p>{t('Nel corso del tempo ho sviluppato e affinato le mie competenze direttamente sul campo, specializzandomi nella ricomposizione corporea e nello sviluppo della massa muscolare, sempre attraverso un approccio sostenibile nel lungo periodo. Ogni percorso viene costruito tenendo conto delle condizioni di partenza, dello stile di vita e degli obiettivi specifici della persona.', 'Over the years I have developed and refined my skills directly in the field, specialising in body recomposition and muscle development, always through an approach designed to be sustainable over the long term. Every journey is built around the individual\'s starting point, lifestyle and specific goals.')}</p>
              <p>{t('Credo fortemente nell\'individualità: ogni corpo è diverso, e per questo ogni programma viene progettato su misura. Non lavoro con schede standard o protocolli "copia e incolla", ma con una struttura costruita attorno alla persona, pensata per essere efficace e sostenibile nel tempo.', 'I believe strongly in individuality: every body is different, and for that reason every programme is designed from scratch. I don\'t work with standard templates or copy-and-paste protocols — I work with a structure built entirely around the person, designed to be both effective and sustainable over time.')}</p>
              <p>{t('Il mio approccio è basato su metodo, costanza e realismo. Non ho mai venduto scorciatoie né promesso risultati irrealizzabili. Lavoro esclusivamente su ciò che può essere ottenuto in modo naturale, con un percorso serio e costruito nel tempo, lontano da visioni estreme o poco sostenibili del fitness.', 'My approach is grounded in method, consistency and realism. I have never sold shortcuts or promised unachievable results. I work exclusively with what can be obtained naturally, through a serious and carefully constructed path — far removed from extreme or unsustainable visions of fitness.')}</p>
              <p>{t('Unisco metodo scientifico ed esperienza pratica, supportati da un continuo aggiornamento professionale. Nonostante gran parte del mio lavoro si svolga online, ho sempre mantenuto un forte legame con il lavoro diretto sul campo.', 'I combine scientific method with practical experience, supported by ongoing professional development. Although much of my work takes place online, I have always maintained a strong connection to direct, hands-on work with clients.')}</p>
              <p>{t('Nel tempo ho seguito numerosi clienti, sia uomini che donne. Ho aiutato molti uomini a raggiungere una definizione addominale concreta e sostenibile, e molte donne a migliorare visibilmente la qualità del proprio corpo, con particolare attenzione alla zona glutei.', 'Over the years I have worked with a wide range of clients — both men and women. I have helped many men achieve concrete, sustainable abdominal definition, and many women to visibly improve their body composition, with particular attention to the glutes.')}</p>
              <p>{t('La mia missione è trasmettere una visione del fitness equilibrata e sostenibile: prendersi cura del proprio corpo e della propria mente, costruendo risultati concreti nel tempo, senza estremismi, ma con metodo e consapevolezza.', 'My mission is to share a balanced and sustainable vision of fitness: taking care of both body and mind, building real results over time — not through extremes, but through method, awareness and dedication.')}</p>
            </div>
            <div className="mt-10">
              <MagneticButton href="/contatti">
                {t('INIZIA IL TUO PERCORSO', 'START YOUR JOURNEY')}
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
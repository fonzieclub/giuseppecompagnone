import { useLang } from '@/lib/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const cardClass = 'bg-white/[0.02] border border-white/5 rounded-2xl p-5 md:p-6';

export function MetricGuideCards() {
  const { t } = useLang();

  const cards = [
    {
      title: 'BMI',
      subtitleIT: 'Indice di massa corporea',
      subtitleEN: 'Body Mass Index',
      bodyIT:
        'Confronta peso e altezza per capire se sei in sottopeso, normopeso, sovrappeso o obesità. È un indicatore generale: non distingue muscolo da grasso e non dice quanto mangiare.',
      bodyEN:
        'Compares weight and height to see if you are underweight, normal, overweight, or obese. It is a general indicator: it does not separate muscle from fat and does not tell you how much to eat.',
    },
    {
      title: 'BMR',
      subtitleIT: 'Metabolismo basale',
      subtitleEN: 'Basal Metabolic Rate',
      bodyIT:
        'Le calorie che il corpo brucia ogni giorno solo per funzionare — a riposo totale. Include respirazione, circolazione, temperatura corporea e rigenerazione cellulare. Si calcola con la formula di Mifflin-St Jeor.',
      bodyEN:
        'Calories your body burns daily just to function — at complete rest. Includes breathing, circulation, body temperature, and cell repair. Calculated using the Mifflin-St Jeor equation.',
    },
    {
      title: 'TDEE',
      subtitleIT: 'Dispendio energetico totale',
      subtitleEN: 'Total Daily Energy Expenditure',
      bodyIT:
        'BMR moltiplicato per il tuo livello di attività. È il numero più utile per dimagrire, mantenere o aumentare peso: rappresenta quanto consumi davvero in un giorno tipo.',
      bodyEN:
        'BMR multiplied by your activity level. The most useful number to lose, maintain, or gain weight: it reflects what you actually burn on a typical day.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {cards.map(card => (
        <div key={card.title} className={cardClass}>
          <p className="text-[#2F78F5] font-display font-bold text-lg uppercase mb-1">{card.title}</p>
          <p className="text-[10px] font-display uppercase tracking-wider text-[#666] mb-3">
            {t(card.subtitleIT, card.subtitleEN)}
          </p>
          <p className="text-sm text-[#999] leading-relaxed">
            {t(card.bodyIT, card.bodyEN)}
          </p>
        </div>
      ))}
    </div>
  );
}

const BMI_SCALE_MIN = 15;
const BMI_SCALE_MAX = 40;

const BMI_SEGMENTS = [
  { min: 15, max: 18.5, color: 'bg-blue-500/50', marker: '#3b82f6' },
  { min: 18.5, max: 25, color: 'bg-green-500/50', marker: '#22c55e' },
  { min: 25, max: 30, color: 'bg-yellow-500/50', marker: '#eab308' },
  { min: 30, max: 40, color: 'bg-red-500/50', marker: '#ef4444' },
];

function bmiToPositionPercent(bmi) {
  const span = BMI_SCALE_MAX - BMI_SCALE_MIN;
  return Math.min(Math.max(((bmi - BMI_SCALE_MIN) / span) * 100, 1), 99);
}

function bmiSegmentIndex(bmi) {
  const idx = BMI_SEGMENTS.findIndex(s => bmi < s.max);
  return idx === -1 ? BMI_SEGMENTS.length - 1 : idx;
}

export function BmiScale({ bmi, categoryLabelIT, categoryLabelEN }) {
  const { t } = useLang();
  const span = BMI_SCALE_MAX - BMI_SCALE_MIN;
  const position = bmiToPositionPercent(bmi);
  const activeSegment = BMI_SEGMENTS[bmiSegmentIndex(bmi)];

  const tickLabels = [
    { value: 15, pct: 0 },
    { value: 18.5, pct: ((18.5 - BMI_SCALE_MIN) / span) * 100 },
    { value: 25, pct: ((25 - BMI_SCALE_MIN) / span) * 100 },
    { value: 30, pct: ((30 - BMI_SCALE_MIN) / span) * 100 },
    { value: 40, pct: 100 },
  ];

  return (
    <div className={cardClass}>
      <h4 className="text-lg font-display font-bold uppercase text-[#F2F2F2] mb-2">
        {t('Cosa significa il tuo BMI?', 'What does your BMI mean?')}
      </h4>
      <p className="text-sm text-[#999] leading-relaxed mb-5">
        {t(
          `Il tuo BMI è ${bmi}. È un dato di partenza, non una sentenza: atleti con molta massa muscolare possono risultare "sovrappeso" pur essendo in forma. Per questo affianchiamo sempre BMR e TDEE.`,
          `Your BMI is ${bmi}. It's a starting point, not a verdict: athletes with high muscle mass may show as "overweight" while being fit. That's why we always pair it with BMR and TDEE.`
        )}
      </p>
      <div className="relative h-3 rounded-full overflow-hidden flex mb-3">
        {BMI_SEGMENTS.map((seg) => (
          <div
            key={seg.max}
            className={`h-full ${seg.color}`}
            style={{ width: `${((seg.max - seg.min) / span) * 100}%` }}
          />
        ))}
        <div
          className="absolute top-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg z-10"
          style={{
            left: `${position}%`,
            transform: 'translate(-50%, -50%)',
            border: `2px solid ${activeSegment.marker}`,
          }}
        />
      </div>
      <div className="relative h-4 mb-1">
        {tickLabels.map((tick) => (
          <span
            key={tick.value}
            className="absolute text-[9px] text-[#666] uppercase tracking-wider font-display -translate-x-1/2"
            style={{ left: `${tick.pct}%` }}
          >
            {tick.value === 40 ? '40+' : tick.value}
          </span>
        ))}
      </div>
      <p
        className="text-xs mt-3 font-display uppercase tracking-wider"
        style={{ color: activeSegment.marker }}
      >
        {t(`La tua fascia: ${categoryLabelIT}`, `Your range: ${categoryLabelEN}`)}
      </p>
    </div>
  );
}

export function TdeeBreakdown({ bmr, currentActivityId, activityLevels }) {
  const { t } = useLang();

  return (
    <div className={cardClass}>
      <h4 className="text-lg font-display font-bold uppercase text-[#F2F2F2] mb-2">
        {t('TDEE per ogni livello di attività', 'TDEE at each activity level')}
      </h4>
      <p className="text-sm text-[#999] leading-relaxed mb-4">
        {t(
          `Partendo dal tuo BMR di ${bmr} kcal, ecco quanto cambierebbe il fabbisogno se modificassi la routine. La riga evidenziata è il livello che hai selezionato.`,
          `Based on your BMR of ${bmr} kcal, here's how your needs would change with a different routine. The highlighted row is your selected level.`
        )}
      </p>
      <ul className="space-y-2 text-sm">
        {activityLevels.map(level => {
          const kcal = Math.round(bmr * level.multiplier);
          const selected = level.id === currentActivityId;
          return (
            <li
              key={level.id}
              className={`flex justify-between gap-4 px-4 py-3 rounded-xl border ${
                selected ? 'bg-[#2F78F5]/10 border-[#2F78F5]/40' : 'border-white/5 bg-white/[0.02]'
              }`}
            >
              <span className={selected ? 'text-white' : 'text-[#888]'}>
                {t(level.labelIT, level.labelEN)}
              </span>
              <span className={`font-display font-semibold shrink-0 ${selected ? 'text-[#2F78F5]' : 'text-[#ccc]'}`}>
                {kcal} kcal
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function HowToUseResults({ bmr, tdee, categoryLabelIT, categoryLabelEN, calorieTargets, weightKg }) {
  const { t } = useLang();
  const proteinLow = Math.round(weightKg * 1.6);
  const proteinHigh = Math.round(weightKg * 2.2);
  const range = t(calorieTargets.rangeIT, calorieTargets.rangeEN);

  const steps = [
    {
      titleIT: '1. Usa il TDEE come riferimento principale',
      titleEN: '1. Use TDEE as your main reference',
      bodyIT: `Il tuo TDEE è ${tdee} kcal/giorno. Per perdere peso si mangia sotto questa cifra; per aumentarla si mangia sopra. Il BMR (${bmr} kcal) da solo è troppo basso perché ignora la tua vita quotidiana.`,
      bodyEN: `Your TDEE is ${tdee} kcal/day. To lose weight, eat below this; to gain, eat above. BMR (${bmr} kcal) alone is too low because it ignores your daily life.`,
    },
    {
      titleIT: '2. Applica un deficit o surplus moderato',
      titleEN: '2. Apply a moderate deficit or surplus',
      bodyIT: `Per la tua situazione (${categoryLabelIT}), punta a ${range}. Cambiamenti di 300–500 kcal al giorno sono sostenibili nel lungo periodo.`,
      bodyEN: `For your situation (${categoryLabelEN}), aim for ${range}. Changes of 300–500 kcal per day are sustainable long term.`,
    },
    {
      titleIT: '3. Non trascurare le proteine',
      titleEN: "3. Don't neglect protein",
      bodyIT: `Indicativamente ${proteinLow}–${proteinHigh} g di proteine al giorno (circa 1,6–2,2 g per kg di peso) aiutano a preservare o costruire muscolo durante qualsiasi obiettivo.`,
      bodyEN: `Roughly ${proteinLow}–${proteinHigh} g of protein daily (about 1.6–2.2 g per kg of body weight) helps preserve or build muscle during any goal.`,
    },
    {
      titleIT: '4. Monitora e adatta nel tempo',
      titleEN: '4. Monitor and adjust over time',
      bodyIT:
        'Pesa e valuta come ti senti ogni 2–4 settimane. Se il peso non si muove nella direzione desiderata, aggiusta le calorie di 100–200 kcal — non serve stravolgere tutto.',
      bodyEN:
        'Weigh yourself and check how you feel every 2–4 weeks. If weight is not moving as desired, adjust calories by 100–200 kcal — no need to overhaul everything.',
    },
  ];

  return (
    <div className={cardClass}>
      <h4 className="text-lg font-display font-bold uppercase text-[#F2F2F2] mb-4">
        {t('Come usare questi numeri', 'How to use these numbers')}
      </h4>
      <ol className="space-y-5">
        {steps.map((step, i) => (
          <li key={i}>
            <p className="text-sm font-display uppercase tracking-wider text-[#F2F2F2] mb-1">
              {t(step.titleIT, step.titleEN)}
            </p>
            <p className="text-sm text-[#999] leading-relaxed">
              {t(step.bodyIT, step.bodyEN)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CalculatorFaq() {
  const { t } = useLang();

  const faqs = [
    {
      qIT: 'BMR e TDEE sono la stessa cosa?',
      qEN: 'Are BMR and TDEE the same thing?',
      aIT:
        'No. Il BMR è solo a riposo. Il TDEE include tutto il resto: camminare, lavorare, allenarti, fare le scale. Per mangiare in modo corretto serve quasi sempre il TDEE.',
      aEN:
        'No. BMR is at rest only. TDEE includes everything else: walking, work, training, stairs. For eating correctly you almost always need TDEE.',
    },
    {
      qIT: 'Il BMI è affidabile per chi si allena?',
      qEN: 'Is BMI reliable for people who train?',
      aIT:
        'Parzialmente. Chi ha molta massa muscolare può avere un BMI alto pur essendo magro. Per questo il BMI va letto insieme a circonferenze, forza e percentuale di grasso — non da solo.',
      aEN:
        'Partly. People with high muscle mass may have a high BMI while being lean. Read BMI alongside measurements, strength, and body fat — not alone.',
    },
    {
      qIT: 'Quanto è preciso questo calcolo?',
      qEN: 'How accurate is this calculation?',
      aIT:
        'È una stima basata su formule validate (Mifflin-St Jeor per il BMR). Il metabolismo reale varia in base a genetica, sonno, stress e storia dietetica. Usa questi numeri come punto di partenza, poi adatta in base ai risultati.',
      aEN:
        'It is an estimate using validated formulas (Mifflin-St Jeor for BMR). Real metabolism varies with genetics, sleep, stress, and diet history. Use these numbers as a starting point, then adjust based on results.',
    },
    {
      qIT: 'Devo mangiare esattamente il TDEE ogni giorno?',
      qEN: 'Do I need to eat exactly my TDEE every day?',
      aIT:
        'Non serve la perfezione giornaliera. Conta la media settimanale: qualche giorno sopra o sotto è normale. La costanza nel medio termine è ciò che produce risultati.',
      aEN:
        'Daily perfection is not required. Track your weekly average: some days above or below is normal. Consistency over weeks is what produces results.',
    },
    {
      qIT: 'Cosa succede se cambio allenamento?',
      qEN: 'What if I change my training?',
      aIT:
        'Se passi da sedentario a 4 allenamenti a settimana, il TDEE sale: dovrai probabilmente mangiare di più per mantenere il peso, o accettare un deficit più leggero se stai dimagrendo. Ricalcola o cambia il livello di attività qui sopra.',
      aEN:
        'If you go from sedentary to 4 workouts per week, TDEE rises: you may need to eat more to maintain weight, or accept a lighter deficit if losing fat. Recalculate or change your activity level above.',
    },
  ];

  return (
    <div className={cardClass}>
      <h4 className="text-lg font-display font-bold uppercase text-[#F2F2F2] mb-4">
        {t('Domande frequenti', 'Frequently asked questions')}
      </h4>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-white/10">
            <AccordionTrigger className="text-sm text-[#ccc] hover:text-white hover:no-underline font-display uppercase tracking-wider">
              {t(faq.qIT, faq.qEN)}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-[#999] leading-relaxed pb-4">
              {t(faq.aIT, faq.aEN)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function FormulaNote() {
  const { t } = useLang();

  return (
    <p className="text-xs text-[#555] text-center leading-relaxed max-w-xl mx-auto mt-8">
      {t(
        'BMR calcolato con l\'equazione di Mifflin-St Jeor (1990). BMI = peso (kg) ÷ altezza (m)². TDEE = BMR × moltiplicatore di attività. Valori indicativi — non sostituiscono un parere medico.',
        'BMR calculated with the Mifflin-St Jeor equation (1990). BMI = weight (kg) ÷ height (m)². TDEE = BMR × activity multiplier. Indicative values — not a substitute for medical advice.'
      )}
    </p>
  );
}

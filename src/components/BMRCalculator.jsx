import { useState } from 'react';
import { useLang } from '../lib/LanguageContext';
import MagneticButton from './MagneticButton';
import {
  MetricGuideCards,
  BmiScale,
  TdeeBreakdown,
  HowToUseResults,
  CalculatorFaq,
  FormulaNote,
} from './calculator/CalculatorEducation';

const ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    multiplier: 1.2,
    labelIT: 'Sedentario',
    labelEN: 'Sedentary',
    descIT: 'Lavoro da scrivania, poco o nessun esercizio',
    descEN: 'Desk job, little or no exercise',
  },
  {
    id: 'light',
    multiplier: 1.375,
    labelIT: 'Leggermente attivo',
    labelEN: 'Lightly active',
    descIT: '1–2 allenamenti leggeri a settimana',
    descEN: '1–2 light workouts per week',
  },
  {
    id: 'moderate',
    multiplier: 1.55,
    labelIT: 'Moderatamente attivo',
    labelEN: 'Moderately active',
    descIT: '3–4 allenamenti a settimana',
    descEN: '3–4 workouts per week',
  },
  {
    id: 'active',
    multiplier: 1.725,
    labelIT: 'Molto attivo',
    labelEN: 'Very active',
    descIT: '5–6 allenamenti intensi a settimana',
    descEN: '5–6 intense workouts per week',
  },
  {
    id: 'very_active',
    multiplier: 1.9,
    labelIT: 'Estremamente attivo',
    labelEN: 'Extremely active',
    descIT: 'Allenamento quotidiano o lavoro fisico intenso',
    descEN: 'Daily training or intense physical job',
  },
];

function getBmiCategory(bmi) {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

function getBmrTier(bmr, gender) {
  const low = gender === 'male' ? 1500 : 1300;
  const high = gender === 'male' ? 1900 : 1700;
  if (bmr < low) return 'low';
  if (bmr > high) return 'high';
  return 'average';
}

function getCalorieTargets(tdee, bmiCategory) {
  const deficit = Math.round(tdee - 400);
  const surplus = Math.round(tdee + 400);

  if (bmiCategory === 'underweight') {
    return {
      goalIT: 'Per aumentare massa in modo sano',
      goalEN: 'To build mass in a healthy way',
      rangeIT: `${surplus}–${surplus + 200} kcal/giorno`,
      rangeEN: `${surplus}–${surplus + 200} kcal/day`,
      noteIT: 'Surplus controllato rispetto al tuo TDEE, con allenamento progressivo.',
      noteEN: 'A controlled surplus above your TDEE, with progressive training.',
    };
  }
  if (bmiCategory === 'overweight' || bmiCategory === 'obese') {
    return {
      goalIT: 'Per perdere peso in modo sostenibile',
      goalEN: 'To lose weight sustainably',
      rangeIT: `${deficit}–${Math.round(tdee - 300)} kcal/giorno`,
      rangeEN: `${deficit}–${Math.round(tdee - 300)} kcal/day`,
      noteIT: 'Deficit moderato rispetto al TDEE — senza saltare i pasti né diete estreme.',
      noteEN: 'A moderate deficit below your TDEE — without skipping meals or extreme diets.',
    };
  }
  return {
    goalIT: 'Per mantenere o ricomporre il fisico',
    goalEN: 'To maintain or recompose your physique',
    rangeIT: `${Math.round(tdee - 150)}–${Math.round(tdee + 150)} kcal/giorno`,
    rangeEN: `${Math.round(tdee - 150)}–${Math.round(tdee + 150)} kcal/day`,
    noteIT: 'Intorno al TDEE, con proteine e allenamento ben strutturati.',
    noteEN: 'Around your TDEE, with structured protein intake and training.',
  };
}

const bmiLabels = {
  underweight: { it: 'sottopeso', en: 'underweight' },
  normal: { it: 'normopeso', en: 'normal weight' },
  overweight: { it: 'sovrappeso', en: 'overweight' },
  obese: { it: 'obesità', en: 'obese' },
};

const bmrTierCopy = {
  low: {
    titleIT: 'Metabolismo a riposo contenuto',
    titleEN: 'A lower resting metabolism',
    bodyIT: (bmr) =>
      `Il BMR (${bmr} kcal) è ciò che bruci solo per vivere — a riposo, senza contare camminare, lavorare o allenarti. È la base su cui si costruisce il TDEE.`,
    bodyEN: (bmr) =>
      `Your BMR (${bmr} kcal) is what you burn just to stay alive — at rest, without counting walking, work, or training. It's the foundation your TDEE is built on.`,
  },
  average: {
    titleIT: 'Metabolismo a riposo nella media',
    titleEN: 'An average resting metabolism',
    bodyIT: (bmr) =>
      `Il tuo BMR è ${bmr} kcal: energia minima quotidiana per respirare, digerire e rigenerare le cellule. Il TDEE aggiunge il costo della tua vita attiva sopra questa cifra.`,
    bodyEN: (bmr) =>
      `Your BMR is ${bmr} kcal: the minimum daily energy to breathe, digest, and regenerate cells. TDEE adds the cost of your active life on top of that.`,
  },
  high: {
    titleIT: 'Metabolismo a riposo elevato',
    titleEN: 'A higher resting metabolism',
    bodyIT: (bmr) =>
      `Con ${bmr} kcal di BMR, il corpo già consuma molta energia a riposo. Il TDEE sarà ancora più alto una volta inclusa la tua attività quotidiana.`,
    bodyEN: (bmr) =>
      `At ${bmr} kcal BMR, your body already uses significant energy at rest. TDEE will be even higher once your daily activity is included.`,
  },
};

const personalizedMessages = {
  underweight: {
    headlineIT: 'Il tuo obiettivo: crescere in modo sano',
    headlineEN: 'Your goal: grow in a healthy way',
    bodyIT: (bmi, bmr, tdee) =>
      `BMI ${bmi} (sottopeso) · BMR ${bmr} kcal · TDEE ${tdee} kcal. Il BMI descrive il rapporto peso/altezza; il BMR le calorie a riposo; il TDEE quanto consumi davvero con la tua routine. Per aumentare massa, punta sopra il TDEE con un piano strutturato.`,
    bodyEN: (bmi, bmr, tdee) =>
      `BMI ${bmi} (underweight) · BMR ${bmr} kcal · TDEE ${tdee} kcal. BMI describes weight-to-height ratio; BMR is calories at rest; TDEE is what you actually burn with your routine. To build mass, aim above your TDEE with a structured plan.`,
    ctaIT: 'PRENOTA UNA CONSULENZA GRATUITA',
    ctaEN: 'BOOK A FREE CONSULTATION',
    ctaHref: '/contatti',
  },
  normal: {
    headlineIT: 'Sei in equilibrio: ora scegli la direzione',
    headlineEN: "You're in balance: now choose your direction",
    bodyIT: (bmi, bmr, tdee) =>
      `BMI ${bmi} (normopeso) · BMR ${bmr} kcal · TDEE ${tdee} kcal. Hai una base solida: il BMI è in range salutare, il TDEE ti dice quanto mangiare per mantenere, definire o costruire muscolo in base al tuo obiettivo.`,
    bodyEN: (bmi, bmr, tdee) =>
      `BMI ${bmi} (normal weight) · BMR ${bmr} kcal · TDEE ${tdee} kcal. You have a solid base: healthy BMI, and TDEE tells you how much to eat to maintain, lean out, or build muscle depending on your goal.`,
    ctaIT: 'PRENOTA UNA CONSULENZA GRATUITA',
    ctaEN: 'BOOK A FREE CONSULTATION',
    ctaHref: '/contatti',
  },
  overweight: {
    headlineIT: 'Piccoli cambiamenti, risultati visibili',
    headlineEN: 'Small changes, visible results',
    bodyIT: (bmi, bmr, tdee) =>
      `BMI ${bmi} (sovrappeso) · BMR ${bmr} kcal · TDEE ${tdee} kcal. Il BMI segnala eccesso di peso rispetto all'altezza; il TDEE è il numero da usare per un deficit sostenibile — non il BMR da solo.`,
    bodyEN: (bmi, bmr, tdee) =>
      `BMI ${bmi} (overweight) · BMR ${bmr} kcal · TDEE ${tdee} kcal. BMI flags excess weight for your height; TDEE is the number to use for a sustainable deficit — not BMR alone.`,
    ctaIT: 'PRENOTA UNA CONSULENZA GRATUITA',
    ctaEN: 'BOOK A FREE CONSULTATION',
    ctaHref: '/contatti',
  },
  obese: {
    headlineIT: 'Un percorso sostenibile, passo dopo passo',
    headlineEN: 'A sustainable path, one step at a time',
    bodyIT: (bmi, bmr, tdee) =>
      `BMI ${bmi} · BMR ${bmr} kcal · TDEE ${tdee} kcal. Tre numeri diversi: il BMI è un indicatore generale, il BMR la base a riposo, il TDEE il fabbisogno reale con la tua attività. È da lì che partiamo per un percorso realistico.`,
    bodyEN: (bmi, bmr, tdee) =>
      `BMI ${bmi} · BMR ${bmr} kcal · TDEE ${tdee} kcal. Three different numbers: BMI is a general indicator, BMR is your resting baseline, TDEE is your real need with activity. That's where a realistic path starts.`,
    ctaIT: 'PRENOTA UNA CONSULENZA GRATUITA',
    ctaEN: 'BOOK A FREE CONSULTATION',
    ctaHref: '/contatti',
  },
};

export default function BMRCalculator() {
  const { t } = useLang();
  const [unit, setUnit] = useState('metric');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('moderate');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [result, setResult] = useState(null);

  const activityLevel = ACTIVITY_LEVELS.find(a => a.id === activity) ?? ACTIVITY_LEVELS[2];
  const tdee = result ? Math.round(result.bmr * activityLevel.multiplier) : null;

  const calculate = () => {
    let w, h;
    if (unit === 'metric') {
      w = parseFloat(weight);
      h = parseFloat(heightCm);
    } else {
      w = parseFloat(weight) * 0.453592;
      h = (parseFloat(heightFt || 0) * 12 + parseFloat(heightIn || 0)) * 2.54;
    }
    const a = parseInt(age);
    if (!w || !h || !a) return;

    let bmr;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const bmi = w / Math.pow(h / 100, 2);
    setResult({
      bmr: Math.round(bmr),
      bmi: Math.round(bmi * 10) / 10,
      weightKg: Math.round(w * 10) / 10,
    });
  };

  const gaugePosition = result ? Math.min(Math.max((result.bmr - 1000) / (2500 - 1000) * 100, 5), 95) : 50;
  const bmiCategory = result ? getBmiCategory(result.bmi) : null;
  const bmrTier = result ? getBmrTier(result.bmr, gender) : null;
  const bmrCopy = bmrTier ? bmrTierCopy[bmrTier] : null;
  const msg = bmiCategory ? personalizedMessages[bmiCategory] : null;
  const calorieTargets = result && tdee && bmiCategory ? getCalorieTargets(tdee, bmiCategory) : null;

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-[#F2F2F2] text-base md:text-sm font-body placeholder:text-[#555] focus:border-[#2F78F5] focus:ring-1 focus:ring-[#2F78F5] focus:outline-none transition-all min-h-[48px]";

  return (
    <div className="max-w-2xl mx-auto">

      <p className="text-sm text-[#888] text-center mb-3">
        {t('Calcola BMR, TDEE e BMI in un solo passaggio', 'Calculate your BMR, TDEE and BMI in one step')}
      </p>
      <p className="text-sm text-[#999] text-center mb-8 leading-relaxed max-w-lg mx-auto">
        {t(
          'Inserisci i tuoi dati qui sotto. Troverai spiegazioni chiare su ogni risultato e come usarlo per il tuo obiettivo.',
          'Enter your details below. You will find clear explanations for each result and how to use them for your goal.'
        )}
      </p>

      <MetricGuideCards />

      <div className="flex justify-center mb-8">
        <div className="bg-white/5 rounded-full p-1 border border-white/10 flex">
          <button
            type="button"
            onClick={() => setUnit('metric')}
            className={`px-6 py-2 rounded-full text-xs font-display uppercase tracking-wider transition-all min-h-[40px] ${unit === 'metric' ? 'bg-[#2F78F5] text-white' : 'text-[#888]'}`}
          >
            {t('METRICO (kg/cm)', 'METRIC (kg/cm)')}
          </button>
          <button
            type="button"
            onClick={() => setUnit('us')}
            className={`px-6 py-2 rounded-full text-xs font-display uppercase tracking-wider transition-all min-h-[40px] ${unit === 'us' ? 'bg-[#2F78F5] text-white' : 'text-[#888]'}`}
          >
            US (lbs/ft-in)
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">{t('Età', 'Age')}</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder={t('Inserisci la tua età', 'Enter your age')} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">{t('Sesso', 'Gender')}</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setGender('male')} className={`flex-1 py-4 rounded-full text-sm font-display uppercase tracking-wider border transition-all min-h-[48px] ${gender === 'male' ? 'bg-[#2F78F5] border-[#2F78F5] text-white' : 'bg-white/5 border-white/10 text-[#888] hover:border-white/30'}`}>{t('UOMO', 'MAN')}</button>
            <button type="button" onClick={() => setGender('female')} className={`flex-1 py-4 rounded-full text-sm font-display uppercase tracking-wider border transition-all min-h-[48px] ${gender === 'female' ? 'bg-[#2F78F5] border-[#2F78F5] text-white' : 'bg-white/5 border-white/10 text-[#888] hover:border-white/30'}`}>{t('DONNA', 'WOMAN')}</button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">{t('Altezza', 'Height')}</label>
          {unit === 'metric' ? (
            <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} placeholder="cm" className={inputClass} />
          ) : (
            <div className="flex gap-3">
              <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="ft" className={inputClass} />
              <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="in" className={inputClass} />
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">{t('Peso', 'Weight')}</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={unit === 'metric' ? 'kg' : 'lbs'} className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">
            {t('Livello di attività (per il TDEE)', 'Activity level (for TDEE)')}
          </label>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map(level => (
              <button
                key={level.id}
                type="button"
                onClick={() => setActivity(level.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl border transition-all min-h-[48px] ${
                  activity === level.id
                    ? 'bg-[#2F78F5]/15 border-[#2F78F5] text-white'
                    : 'bg-white/5 border-white/10 text-[#888] hover:border-white/30'
                }`}
              >
                <span className="block text-sm font-display uppercase tracking-wider">
                  {t(level.labelIT, level.labelEN)}
                </span>
                <span className="block text-xs mt-1 opacity-80">
                  {t(level.descIT, level.descEN)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={calculate}
        className="w-full py-4 rounded-full bg-[#2F78F5] text-white font-display uppercase text-sm tracking-wider font-semibold hover:shadow-[0_0_30px_rgba(47,120,245,0.4)] transition-all min-h-[48px] btn-sweep relative overflow-hidden"
      >
        {t('CALCOLA BMR, TDEE E BMI', 'CALCULATE BMR, TDEE & BMI')}
      </button>
      <p className="text-center text-xs text-[#555] mt-3">
        {t('I dati inseriti non vengono salvati né condivisi. Il calcolo è solo a scopo informativo.', 'Your data is never saved or shared. This calculation is for informational purposes only.')}
      </p>

      {result && bmrCopy && msg && tdee && calorieTargets && (
        <div className="mt-12 space-y-6" style={{ animation: 'maskReveal 0.8s ease-out forwards' }}>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-center">
              <p className="text-[10px] font-display uppercase tracking-wider text-[#666] mb-1">BMI</p>
              <p className="text-3xl font-display font-bold text-white">{result.bmi}</p>
              <p className="text-[10px] text-[#888] mt-1 uppercase tracking-wider">
                {t(bmiLabels[bmiCategory].it, bmiLabels[bmiCategory].en)}
              </p>
              <p className="text-[10px] text-[#555] mt-2 leading-snug">
                {t('Peso ÷ altezza²', 'Weight ÷ height²')}
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-center">
              <p className="text-[10px] font-display uppercase tracking-wider text-[#666] mb-1">BMR</p>
              <p className="text-3xl font-display font-bold text-[#2F78F5]">{result.bmr}</p>
              <p className="text-[10px] text-[#888] mt-1">{t('kcal/giorno', 'kcal/day')}</p>
              <p className="text-[10px] text-[#555] mt-2 leading-snug">
                {t('A riposo', 'At rest')}
              </p>
            </div>
            <div className="bg-[#2F78F5]/10 border border-[#2F78F5]/30 rounded-2xl p-5 text-center">
              <p className="text-[10px] font-display uppercase tracking-wider text-[#2F78F5] mb-1">TDEE</p>
              <p className="text-3xl font-display font-bold text-[#2F78F5] glow-blue">{tdee}</p>
              <p className="text-[10px] text-[#888] mt-1">{t('kcal/giorno', 'kcal/day')}</p>
              <p className="text-[10px] text-[#555] mt-2 leading-snug">
                {t(activityLevel.labelIT, activityLevel.labelEN)}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#666] text-center leading-relaxed">
            {t(
              'Puoi cambiare il livello di attività sopra e ricalcolare il TDEE senza reinserire i dati.',
              'You can change your activity level above and the TDEE updates without re-entering your details.'
            )}
          </p>

          <div className="space-y-3">
            <div className="relative h-1 bg-white/10 rounded-full overflow-visible">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2F78F5]/30 to-[#2F78F5] rounded-full transition-all duration-1000 ease-out" style={{ width: `${gaugePosition}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#2F78F5] shadow-[0_0_12px_rgba(47,120,245,0.6)] transition-all duration-1000 ease-out" style={{ left: `${gaugePosition}%`, transform: 'translate(-50%, -50%)' }} />
            </div>
            <div className="flex justify-between text-[10px] font-display uppercase tracking-wider text-[#666]">
              <span>{t('BMR basso', 'Lower BMR')}</span>
              <span>{t('BMR alto', 'Higher BMR')}</span>
            </div>
          </div>

          <BmiScale
            bmi={result.bmi}
            categoryLabelIT={bmiLabels[bmiCategory].it}
            categoryLabelEN={bmiLabels[bmiCategory].en}
          />

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h4 className="text-lg font-display font-bold uppercase text-[#F2F2F2] mb-3">
              {t('Cos\'è il BMR?', 'What is BMR?')}
            </h4>
            <p className="text-sm text-[#999] leading-relaxed mb-4">
              {t(bmrCopy.bodyIT(result.bmr), bmrCopy.bodyEN(result.bmr))}
            </p>
            <p className="text-sm text-[#999] leading-relaxed mb-6">
              {t(
                'Il BMR copre circa il 60–70% del dispendio giornaliero nella maggior parte delle persone. Il resto dipende da quanto ti muovi: da qui nasce il TDEE.',
                'BMR accounts for roughly 60–70% of daily expenditure for most people. The rest depends on how much you move — that is where TDEE comes from.'
              )}
            </p>
            <h4 className="text-lg font-display font-bold uppercase text-[#F2F2F2] mb-3">
              {t('Cos\'è il TDEE?', 'What is TDEE?')}
            </h4>
            <p className="text-sm text-[#999] leading-relaxed">
              {t(
                `Il tuo TDEE (${tdee} kcal) = BMR (${result.bmr}) × ${activityLevel.multiplier} (${t(activityLevel.labelIT, activityLevel.labelEN)}). Mangiare sotto il TDEE tende a far scendere il peso; mangiare sopra tende a farlo salire. Il BMI da solo non dice quanto mangiare.`,
                `Your TDEE (${tdee} kcal) = BMR (${result.bmr}) × ${activityLevel.multiplier} (${t(activityLevel.labelIT, activityLevel.labelEN)}). Eating below TDEE tends to lower weight; eating above tends to raise it. BMI alone does not tell you how much to eat.`
              )}
            </p>
          </div>

          <TdeeBreakdown
            bmr={result.bmr}
            currentActivityId={activity}
            activityLevels={ACTIVITY_LEVELS}
          />

          <div className="bg-white/[0.02] border border-[#2F78F5]/20 rounded-2xl p-6 md:p-8">
            <h4 className="text-lg font-display font-bold uppercase text-[#F2F2F2] mb-2">
              {t(calorieTargets.goalIT, calorieTargets.goalEN)}
            </h4>
            <p className="text-3xl font-display font-bold text-[#2F78F5] mb-2">
              {t(calorieTargets.rangeIT, calorieTargets.rangeEN)}
            </p>
            <p className="text-sm text-[#999] leading-relaxed mb-4">
              {t(calorieTargets.noteIT, calorieTargets.noteEN)}
            </p>
            <p className="text-xs text-[#666] leading-relaxed">
              {t(
                '1 kg di grasso ≈ 7.700 kcal. Un deficit di 500 kcal al giorno può portare circa 0,5 kg a settimana — senza garanzie, perché ogni corpo reagisce in modo diverso.',
                '1 kg of fat ≈ 7,700 kcal. A 500 kcal daily deficit may yield roughly 0.5 kg per week — not guaranteed, as every body responds differently.'
              )}
            </p>
          </div>

          <HowToUseResults
            bmr={result.bmr}
            tdee={tdee}
            categoryLabelIT={bmiLabels[bmiCategory].it}
            categoryLabelEN={bmiLabels[bmiCategory].en}
            calorieTargets={calorieTargets}
            weightKg={result.weightKg}
          />

          <div className="bg-white/[0.03] border border-[#2F78F5]/20 rounded-2xl p-6 md:p-8">
            <h4 className="text-xl md:text-2xl font-display font-bold uppercase mb-4 text-[#F2F2F2]">
              {t(msg.headlineIT, msg.headlineEN)}
            </h4>
            <p className="text-sm text-[#999] leading-relaxed mb-6">
              {t(msg.bodyIT(result.bmi, result.bmr, tdee), msg.bodyEN(result.bmi, result.bmr, tdee))}
            </p>
            <MagneticButton href="/contatti">
              {t(msg.ctaIT, msg.ctaEN)}
            </MagneticButton>
          </div>
        </div>
      )}

      <div className="mt-16">
        <CalculatorFaq />
        <FormulaNote />
      </div>
    </div>
  );
}

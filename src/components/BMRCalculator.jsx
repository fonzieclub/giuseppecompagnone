import { useState } from 'react';
import { useLang } from '../lib/LanguageContext';
import MagneticButton from './MagneticButton';

function getBmiCategory(bmi) {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

const personalizedMessages = {
  underweight: {
    headlineIT: 'Costruire massa richiede strategia.',
    headlineEN: 'Building mass takes strategy.',
    bodyIT: 'Il tuo corpo ha bisogno di più di quanto stia ricevendo. Aumentare massa muscolare in modo sano non significa mangiare di più a caso — significa allenarsi nel modo giusto e nutrire il corpo con precisione. Posso costruire un piano che ti aiuti a crescere forte, non solo a ingrassare.',
    bodyEN: "Your body needs more than it's currently getting. Building healthy muscle isn't about eating more at random — it's about training the right way and fueling your body with precision. I can build you a plan that helps you grow strong, not just heavier.",
    ctaIT: 'INIZIA IL TUO PERCORSO',
    ctaEN: 'START YOUR JOURNEY',
  },
  normal: {
    headlineIT: 'Sei a un ottimo punto di partenza.',
    headlineEN: "You're at a great starting point.",
    bodyIT: 'Il tuo peso è in un range salutare — ora si tratta di scegliere cosa vuoi davvero: più forza, più tonicità, più resistenza, o semplicemente sentirti meglio nel tuo corpo. È qui che un piano personalizzato fa la differenza tra "stare bene" e "stare al meglio".',
    bodyEN: 'Your weight is in a healthy range — now it\'s about choosing what you really want: more strength, more tone, more endurance, or simply feeling better in your body. This is where a personalized plan makes the difference between "doing fine" and "doing your best".',
    ctaIT: 'DEFINIAMO IL TUO OBIETTIVO',
    ctaEN: "LET'S DEFINE YOUR GOAL",
  },
  overweight: {
    headlineIT: 'Il cambiamento è più vicino di quanto pensi.',
    headlineEN: 'Change is closer than you think.',
    bodyIT: 'Sei in una fascia in cui anche piccoli cambiamenti possono portare risultati visibili e duraturi — senza diete estreme né allenamenti impossibili. La differenza la fa avere un piano costruito su di te, non copiato da internet. Possiamo iniziare insieme, al tuo ritmo.',
    bodyEN: "You're in a range where even small changes can bring visible, lasting results — without extreme diets or impossible workouts. The real difference is having a plan built around you, not copied from the internet. We can start together, at your pace.",
    ctaIT: 'INIZIA IL TUO PERCORSO',
    ctaEN: 'START YOUR JOURNEY',
  },
  obese: {
    headlineIT: 'Ogni grande trasformazione inizia con un primo passo.',
    headlineEN: 'Every great transformation starts with one first step.',
    bodyIT: 'Voglio essere onesto con te: il fatto che tu sia qui, calcolando il tuo metabolismo, è già più di quanto fa la maggior parte delle persone. Non servono soluzioni miracolose — serve un percorso sostenibile, costruito sul tuo corpo, sui tuoi tempi e sulla tua vita reale. Io ti accompagno, senza giudizio, con metodi che funzionano davvero.',
    bodyEN: "I want to be honest with you: the fact that you're here, calculating your metabolism, is already more than most people ever do. You don't need miracle solutions — you need a sustainable path, built around your body, your time, and your real life. I'll walk it with you, without judgment, with methods that actually work.",
    ctaIT: 'INIZIA IL TUO PERCORSO',
    ctaEN: 'START YOUR JOURNEY',
  },
};

const bmiLabels = {
  underweight: { it: 'sottopeso', en: 'underweight' },
  normal: { it: 'normopeso', en: 'normal weight' },
  overweight: { it: 'sovrappeso', en: 'overweight' },
  obese: { it: 'obesità', en: 'obese' },
};

export default function BMRCalculator() {
  const { t } = useLang();
  const [unit, setUnit] = useState('metric');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [result, setResult] = useState(null);

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
    setResult({ bmr: Math.round(bmr), bmi: Math.round(bmi * 10) / 10 });
  };

  const gaugePosition = result ? Math.min(Math.max((result.bmr - 1000) / (2500 - 1000) * 100, 5), 95) : 50;
  const bmiCategory = result ? getBmiCategory(result.bmi) : null;
  const msg = bmiCategory ? personalizedMessages[bmiCategory] : null;

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-[#F2F2F2] text-sm font-body placeholder:text-[#555] focus:border-[#2F78F5] focus:ring-1 focus:ring-[#2F78F5] focus:outline-none transition-all min-h-[48px]";

  return (
    <div className="max-w-2xl mx-auto">

      <p className="text-sm text-[#888] text-center mb-3">
        {t('Scopri quante calorie brucia il tuo corpo a riposo', 'Discover how many calories your body burns at rest')}
      </p>
      <p className="text-sm text-[#999] text-center mb-10 leading-relaxed max-w-lg mx-auto">
        {t(
          'Inserisci i tuoi dati per scoprire il tuo metabolismo basale — il primo passo per costruire un piano davvero personalizzato.',
          'Enter your details to discover your basal metabolic rate — the first step toward a truly personalized plan.'
        )}
      </p>

      {/* Unit toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/5 rounded-full p-1 border border-white/10 flex">
          <button
            onClick={() => setUnit('metric')}
            className={`px-6 py-2 rounded-full text-xs font-display uppercase tracking-wider transition-all min-h-[40px] ${unit === 'metric' ? 'bg-[#2F78F5] text-white' : 'text-[#888]'}`}
          >
            {t('METRICO (kg/cm)', 'METRIC (kg/cm)')}
          </button>
          <button
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
            <button onClick={() => setGender('male')} className={`flex-1 py-4 rounded-full text-sm font-display uppercase tracking-wider border transition-all min-h-[48px] ${gender === 'male' ? 'bg-[#2F78F5] border-[#2F78F5] text-white' : 'bg-white/5 border-white/10 text-[#888] hover:border-white/30'}`}>{t('UOMO', 'MAN')}</button>
            <button onClick={() => setGender('female')} className={`flex-1 py-4 rounded-full text-sm font-display uppercase tracking-wider border transition-all min-h-[48px] ${gender === 'female' ? 'bg-[#2F78F5] border-[#2F78F5] text-white' : 'bg-white/5 border-white/10 text-[#888] hover:border-white/30'}`}>{t('DONNA', 'WOMAN')}</button>
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
      </div>

      <button
        onClick={calculate}
        className="w-full py-4 rounded-full bg-[#2F78F5] text-white font-display uppercase text-sm tracking-wider font-semibold hover:shadow-[0_0_30px_rgba(47,120,245,0.4)] transition-all min-h-[48px] btn-sweep relative overflow-hidden"
      >
        {t('CALCOLA', 'CALCULATE')}
      </button>
      <p className="text-center text-xs text-[#555] mt-3">
        {t('I dati inseriti non vengono salvati né condivisi. Il calcolo è solo a scopo informativo.', 'Your data is never saved or shared. This calculation is for informational purposes only.')}
      </p>

      {result && (
        <div className="mt-12 space-y-8" style={{ animation: 'maskReveal 0.8s ease-out forwards' }}>
          <div className="text-center">
            <p className="text-sm text-[#888] mb-2 font-display uppercase tracking-wider">{t('Il tuo BMR è', 'Your BMR is')}</p>
            <p className="text-5xl md:text-6xl font-display font-bold text-[#2F78F5] glow-blue">
              {result.bmr} <span className="text-2xl text-[#888]">{t('kcal/giorno', 'kcal/day')}</span>
            </p>
            <p className="mt-3 text-sm text-[#888] font-display uppercase tracking-wider">
              {t(`Il tuo BMI è ${result.bmi} — ${bmiLabels[bmiCategory].it}`, `Your BMI is ${result.bmi} — ${bmiLabels[bmiCategory].en}`)}
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative h-1 bg-white/10 rounded-full overflow-visible">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2F78F5]/30 to-[#2F78F5] rounded-full transition-all duration-1000 ease-out" style={{ width: `${gaugePosition}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#2F78F5] shadow-[0_0_12px_rgba(47,120,245,0.6)] transition-all duration-1000 ease-out" style={{ left: `${gaugePosition}%`, transform: 'translate(-50%, -50%)' }} />
            </div>
            <div className="flex justify-between text-[10px] font-display uppercase tracking-wider text-[#666]">
              <span>{t('Metabolismo lento', 'Slow metabolism')}</span>
              <span>{t('Metabolismo veloce', 'Fast metabolism')}</span>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <p className="text-sm text-[#999] leading-[1.8]">
              {t(
                `Il tuo BMR è il numero di calorie che il tuo corpo brucia ogni giorno semplicemente per tenerti in vita — respirare, pompare il sangue, rigenerare le cellule. Anche se stessi immobile tutto il giorno, il tuo corpo consumerebbe comunque ${result.bmr} kcal. Conoscere il tuo BMR è il punto di partenza per qualsiasi obiettivo: dimagrire, aumentare la massa muscolare o semplicemente stare meglio. Il passo successivo si chiama TDEE — il fabbisogno calorico reale tenendo conto della tua attività fisica.`,
                `Your BMR is the number of calories your body burns every day just to keep you alive — breathing, circulating blood, regenerating cells. Even if you stayed completely still all day, your body would still burn ${result.bmr} kcal. Knowing your BMR is the starting point for any physical goal: losing fat, building muscle, or simply feeling better. The next step is called your TDEE — your real daily calorie need factored against your activity level.`
              )}
            </p>
          </div>

          {msg && (
            <div className="bg-white/[0.03] border border-[#2F78F5]/20 rounded-2xl p-6 md:p-8" style={{ animation: 'maskReveal 0.8s ease-out forwards' }}>
              <h4 className="text-xl md:text-2xl font-display font-bold uppercase mb-4 text-[#F2F2F2]">
                {t(msg.headlineIT, msg.headlineEN)}
              </h4>
              <p className="text-sm text-[#999] leading-relaxed mb-6">
                {t(msg.bodyIT, msg.bodyEN)}
              </p>
              <MagneticButton href="/contatti">
                {t(msg.ctaIT, msg.ctaEN)}
              </MagneticButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
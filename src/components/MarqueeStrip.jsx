import { useLang } from '../lib/LanguageContext';

const itemsIT = ['COACHING ONLINE', 'COACHING 1:1', 'PERSONAL TRAINER IN CAMPANIA', 'TRASFORMAZIONI REALI'];
const itemsEN = ['ONLINE COACHING', '1:1 COACHING', 'PERSONAL TRAINER IN CAMPANIA', 'REAL TRANSFORMATIONS'];

export default function MarqueeStrip() {
  const { t } = useLang();
  const items = t(itemsIT, itemsEN);
  const repeated = [...items, ...items, ...items];

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {repeated.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <span className="marquee-dot">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
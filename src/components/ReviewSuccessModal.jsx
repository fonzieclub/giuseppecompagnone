import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';

export default function ReviewSuccessModal({ isOpen, onClose }) {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-[#050505] border border-[#2F78F5] rounded-2xl p-6 md:p-8 w-[90%] max-w-[400px] mx-auto text-center transition-all duration-300 ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CheckCircle2 size={40} className="text-[#2F78F5] mx-auto mb-4" />
        
        <h2 className="text-lg font-display font-bold text-white mb-6">
          {t('Grazie per la tua recensione!', 'Thank you for your review!')}
        </h2>
        
        <button
          onClick={onClose}
          className="w-full px-6 py-2 rounded-full bg-[#2F78F5] text-white font-display uppercase text-xs tracking-wider font-semibold hover:shadow-[0_0_30px_rgba(47,120,245,0.4)] transition-all btn-sweep"
        >
          {t('CHIUDI', 'CLOSE')}
        </button>
      </div>
    </div>
  );
}
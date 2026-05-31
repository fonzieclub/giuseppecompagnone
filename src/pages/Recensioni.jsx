import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import AnimatedHeadline from '../components/AnimatedHeadline';
import ScrollReveal from '../components/ScrollReveal';
import ReviewSuccessModal from '../components/ReviewSuccessModal';
import { legacyReviews } from '@/data/legacyReviews';

const sortedLegacy = [...legacyReviews].sort(
  (a, b) => new Date(b.created_at) - new Date(a.created_at)
);

export default function Recensioni() {
  const { t } = useLang();
  const { user, isAuthenticated, signOut } = useAuth();
  const [reviews, setReviews] = useState(sortedLegacy);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    // Always show legacy reviews immediately; merge Supabase reviews when ready
    setReviews(sortedLegacy);

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading reviews:', error);
      return;
    }

    const supabaseReviews = data || [];
    const merged = [
      ...supabaseReviews,
      ...sortedLegacy.filter(r => !supabaseReviews.some(s => s.id === r.id)),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setReviews(merged);
  };

  const handleLogout = async () => {
    await signOut();
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) {
      toast.error(t('Scrivi qualcosa prima di inviare', 'Write something before submitting'));
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      rating,
      text: text.trim(),
      author_name: user.full_name,
      author_email: user.email,
    });

    if (error) {
      console.error('Review submission error:', error);
      toast.error(`${t('Errore:', 'Error:')} ${error.message}`);
      setSubmitting(false);
      return;
    }

    setText('');
    setRating(5);
    setShowForm(false);
    setSubmitting(false);
    setShowSuccess(true);
  };

  return (
    <>
      <ReviewSuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
      <section className="min-h-screen bg-[#050505] pt-20 md:pt-28 pb-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="flex flex-col items-center text-center mb-6">
          <AnimatedHeadline
            text={t('COSA DICONO I CLIENTI', 'WHAT CLIENTS SAY')}
            className="text-4xl md:text-6xl font-display font-bold uppercase"
          />
          <p className="mt-4 text-sm md:text-base text-[#777] font-body max-w-xl leading-relaxed">
            {t(
              'Le esperienze di chi ha scelto di investire su se stesso.',
              'The experiences of those who chose to invest in themselves.'
            )}
          </p>
          <div className="mt-6 w-12 h-[2px] bg-[#2F78F5] rounded-full" />
        </div>

        <div className="flex flex-col items-center gap-4 mt-16 mb-10">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <span className="text-sm text-[#888] font-body">{t('Accesso eseguito come:', 'Logged in as:')} {user.full_name}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-[#555] hover:text-[#2F78F5] transition-colors underline"
                >
                  {t('Esci', 'Logout')}
                </button>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-10 py-5 rounded-full bg-[#2F78F5] text-white font-display uppercase text-sm tracking-wider font-semibold hover:shadow-[0_0_30px_rgba(47,120,245,0.4)] transition-all btn-sweep max-w-xs w-full"
              >
                {showForm ? t('CHIUDI', 'CLOSE') : t('LASCIA UNA RECENSIONE', 'LEAVE A REVIEW')}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full max-w-sm">
              <Link
                to="/login?redirect=/recensioni&mode=signup"
                className="px-10 py-5 rounded-full bg-[#2F78F5] text-white font-display uppercase text-sm tracking-wider font-semibold hover:shadow-[0_0_30px_rgba(47,120,245,0.4)] transition-all btn-sweep w-full text-center min-h-[48px] flex items-center justify-center"
              >
                {t('REGISTRATI PER LASCIARE UNA RECENSIONE', 'SIGN UP TO LEAVE A REVIEW')}
              </Link>
              <Link
                to="/login?redirect=/recensioni&mode=login"
                className="text-sm text-[#888] hover:text-[#2F78F5] transition-colors underline"
              >
                {t('Hai già un account? Accedi', 'Already have an account? Log in')}
              </Link>
            </div>
          )}
        </div>

        {showForm && isAuthenticated && user && (
          <ScrollReveal>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 mb-12 w-full max-w-xl mx-auto">
              <h3 className="text-lg font-display font-bold text-white mb-6">{t('La tua opinione', 'Your Opinion')}</h3>

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#2F78F5]/20 flex items-center justify-center text-xs font-display font-bold text-[#2F78F5]">
                  {(user.full_name || 'A')[0].toUpperCase()}
                </div>
                <p className="text-sm font-display font-semibold text-white">{user.full_name}</p>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-3">{t('Valutazione', 'Rating')}</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoveredStar(s)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`transition-colors ${
                          s <= (hoveredStar || rating) ? 'fill-[#2F78F5] text-[#2F78F5]' : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-3">{t('Testo', 'Text')}</label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={t('Condividi la tua esperienza...', 'Share your experience...')}
                  className="review-form-input w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-[#F2F2F2] placeholder:text-[#555] focus:border-[#2F78F5] focus:outline-none min-h-[120px] resize-none"
                  rows="5"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !text.trim()}
                className="w-full py-3 rounded-full bg-[#2F78F5] text-white font-display uppercase text-sm tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(47,120,245,0.4)] transition-all min-h-[48px]"
              >
                {submitting ? t('INVIO IN CORSO...', 'SUBMITTING...') : t('INVIA RECENSIONE', 'SUBMIT REVIEW')}
              </button>
            </div>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <ScrollReveal key={review.id} delay={i * 100}>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-[#2F78F5]/30 transition-all duration-500">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= review.rating ? 'fill-[#2F78F5] text-[#2F78F5]' : 'text-white/20'}
                    />
                  ))}
                </div>

                <p className="text-sm text-[#ccc] leading-relaxed mb-6">{review.text}</p>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2F78F5]/20 flex items-center justify-center text-xs font-display font-bold text-[#2F78F5]">
                    {(review.author_name || 'A')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-display text-[#888] uppercase tracking-wider">
                    {review.author_name || t('Anonimo', 'Anonymous')}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="flex flex-col items-center gap-3 mt-2">
            <Star size={16} className="text-[#2F78F5]" />
            <p className="text-[#555] text-sm italic font-body">
              {t('Nessuna recensione ancora. Sii il primo!', 'No reviews yet. Be the first!')}
            </p>
          </div>
        )}
      </div>
    </section>
    </>
  );
}

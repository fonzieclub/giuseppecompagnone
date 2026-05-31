import { useState, useEffect } from 'react';
import { Star, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    loadReviews();
  }, [filter]);

  const loadReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', filter)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating review:', error);
      return;
    }
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#050505] py-24 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest mb-8">
          Admin — Moderazione Recensioni
        </h1>

        <div className="flex gap-3 mb-8">
          {['pending', 'approved', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-full text-xs font-display uppercase tracking-wider border transition-all ${
                filter === s
                  ? 'bg-[#2F78F5] border-[#2F78F5] text-white'
                  : 'border-white/20 text-[#888] hover:border-white/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[#666] text-sm">Caricamento...</p>
        ) : reviews.length === 0 ? (
          <p className="text-[#666] text-sm">Nessuna recensione con stato "{filter}".</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-display font-semibold">{review.author_name || 'Anonimo'}</span>
                    <span className="text-[#666] text-xs ml-3">{review.author_email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={12} className={s <= review.rating ? 'fill-[#2F78F5] text-[#2F78F5]' : 'text-white/20'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#ccc] mb-4">{review.text}</p>
                <div className="flex gap-3">
                  {filter !== 'approved' && (
                    <button
                      onClick={() => updateStatus(review.id, 'approved')}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/20 border border-green-600/40 text-green-400 text-xs font-display uppercase hover:bg-green-600/30 transition-all"
                    >
                      <Check size={14} /> Approva
                    </button>
                  )}
                  {filter !== 'rejected' && (
                    <button
                      onClick={() => updateStatus(review.id, 'rejected')}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-display uppercase hover:bg-red-600/30 transition-all"
                    >
                      <X size={14} /> Rifiuta
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

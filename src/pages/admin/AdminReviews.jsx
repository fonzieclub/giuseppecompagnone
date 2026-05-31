import { useState, useEffect } from 'react';
import { Star, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    loadReviews();
    loadCounts();
  }, [filter]);

  const loadCounts = async () => {
    const statuses = ['pending', 'approved', 'rejected'];
    const results = await Promise.all(
      statuses.map(async (status) => {
        const { count } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
        return [status, count || 0];
      })
    );
    setCounts(Object.fromEntries(results));
  };

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
      toast.error('Errore nel caricamento recensioni');
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
      toast.error('Errore durante l\'aggiornamento');
      return;
    }

    toast.success(status === 'approved' ? 'Recensione approvata' : 'Recensione rifiutata');
    setReviews(prev => prev.filter(r => r.id !== id));
    loadCounts();
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
          Moderazione Recensioni
        </h1>
        <p className="text-sm text-[#666] mt-2">
          Le recensioni approvate appaiono su /recensioni. Quelle in sospeso restano nascoste.
        </p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {['pending', 'approved', 'rejected'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-5 py-2 rounded-full text-xs font-display uppercase tracking-wider border transition-all flex items-center gap-2 ${
              filter === s
                ? 'bg-[#2F78F5] border-[#2F78F5] text-white'
                : 'border-white/20 text-[#888] hover:border-white/40'
            }`}
          >
            {s === 'pending' ? 'In attesa' : s === 'approved' ? 'Approvate' : 'Rifiutate'}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === s ? 'bg-white/20' : 'bg-white/10'}`}>
              {counts[s] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[#666] text-sm">Caricamento...</p>
      ) : reviews.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
          <Star size={24} className="text-[#2F78F5] mx-auto mb-4" />
          <p className="text-[#666] text-sm">
            {filter === 'pending'
              ? 'Nessuna recensione in attesa di approvazione.'
              : `Nessuna recensione ${filter === 'approved' ? 'approvata' : 'rifiutata'}.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3 gap-4">
                <div>
                  <span className="text-white font-display font-semibold">{review.author_name || 'Anonimo'}</span>
                  <span className="text-[#666] text-xs ml-3">{review.author_email}</span>
                  <p className="text-[#555] text-xs mt-1">
                    {new Date(review.created_at).toLocaleDateString('it-IT', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} className={s <= review.rating ? 'fill-[#2F78F5] text-[#2F78F5]' : 'text-white/20'} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-[#ccc] mb-4 leading-relaxed">{review.text}</p>
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
  );
}

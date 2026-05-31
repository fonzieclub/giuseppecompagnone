import { useState, useEffect } from 'react';
import { Star, Check, X, Pencil, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const emptyEdit = { text: '', author_name: '', rating: 5 };

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEdit);
  const [saving, setSaving] = useState(false);

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

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditForm({
      text: review.text,
      author_name: review.author_name || '',
      rating: review.rating,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyEdit);
  };

  const saveEdit = async (id) => {
    if (!editForm.text.trim()) {
      toast.error('Il testo della recensione non può essere vuoto');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('reviews')
      .update({
        text: editForm.text.trim(),
        author_name: editForm.author_name.trim() || 'Anonimo',
        rating: editForm.rating,
      })
      .eq('id', id);

    setSaving(false);

    if (error) {
      toast.error('Errore nel salvataggio');
      return;
    }

    toast.success('Recensione aggiornata');
    setReviews(prev => prev.map(r =>
      r.id === id
        ? { ...r, text: editForm.text.trim(), author_name: editForm.author_name.trim(), rating: editForm.rating }
        : r
    ));
    cancelEdit();
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
    if (editingId === id) cancelEdit();
    setReviews(prev => prev.filter(r => r.id !== id));
    loadCounts();
  };

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-[#F2F2F2] placeholder:text-[#555] focus:border-[#2F78F5] focus:outline-none';

  const actionBtn = 'flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-display uppercase transition-all min-h-[44px] w-full sm:w-auto';

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-widest">
          Moderazione Recensioni
        </h1>
        <p className="text-sm text-[#666] mt-2">
          Approva, rifiuta o modifica le recensioni prima della pubblicazione.
        </p>
      </div>

      <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
        {['pending', 'approved', 'rejected'].map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); cancelEdit(); }}
            className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-display uppercase tracking-wider border transition-all flex items-center justify-center gap-2 min-h-[44px] ${
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
          {reviews.map(review => {
            const isEditing = editingId === review.id;

            return (
              <div key={review.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="mb-3">
                        <label className="text-xs text-[#888] uppercase tracking-wider mb-1 block">Nome visualizzato</label>
                        <input
                          className={inputClass}
                          value={editForm.author_name}
                          onChange={e => setEditForm({ ...editForm, author_name: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                        <span className="text-white font-display font-semibold">{review.author_name || 'Anonimo'}</span>
                        <span className="text-[#666] text-xs sm:ml-3 break-all">{review.author_email}</span>
                      </div>
                    )}
                    <p className="text-[#555] text-xs mt-1">
                      {new Date(review.created_at).toLocaleDateString('it-IT', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {isEditing ? (
                    <div className="shrink-0">
                      <label className="text-xs text-[#888] uppercase tracking-wider mb-2 block">Valutazione</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setEditForm({ ...editForm, rating: s })}
                            className="p-2 -m-1"
                          >
                            <Star
                              size={22}
                              className={s <= editForm.rating ? 'fill-[#2F78F5] text-[#2F78F5]' : 'text-white/20'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 shrink-0">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={16} className={s <= review.rating ? 'fill-[#2F78F5] text-[#2F78F5]' : 'text-white/20'} />
                      ))}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mb-4">
                    <label className="text-xs text-[#888] uppercase tracking-wider mb-1 block">Testo recensione</label>
                    <textarea
                      className={`${inputClass} min-h-[140px] resize-y`}
                      value={editForm.text}
                      onChange={e => setEditForm({ ...editForm, text: e.target.value })}
                      rows={5}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-[#ccc] mb-4 leading-relaxed whitespace-pre-wrap break-words">{review.text}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:flex-wrap">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(review.id)}
                        disabled={saving}
                        className={`${actionBtn} bg-[#2F78F5] text-white hover:bg-[#2568d4] disabled:opacity-50`}
                      >
                        <Save size={14} /> {saving ? 'Salvataggio...' : 'Salva modifiche'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className={`${actionBtn} border border-white/20 text-[#888] hover:border-white/40`}
                      >
                        Annulla
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(review)}
                        className={`${actionBtn} bg-white/5 border border-white/20 text-[#ccc] hover:bg-white/10`}
                      >
                        <Pencil size={14} /> Modifica
                      </button>
                      {filter !== 'approved' && (
                        <button
                          onClick={() => updateStatus(review.id, 'approved')}
                          className={`${actionBtn} bg-green-600/20 border border-green-600/40 text-green-400 hover:bg-green-600/30`}
                        >
                          <Check size={14} /> Approva
                        </button>
                      )}
                      {filter !== 'rejected' && (
                        <button
                          onClick={() => updateStatus(review.id, 'rejected')}
                          className={`${actionBtn} bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30`}
                        >
                          <X size={14} /> Rifiuta
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

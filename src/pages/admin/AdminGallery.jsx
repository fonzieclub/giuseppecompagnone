import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const emptyForm = {
  name_it: '',
  name_en: '',
  result_it: '',
  result_en: '',
  desc_it: '',
  desc_en: '',
  image_url: '',
  sort_order: 0,
  is_published: true,
};

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast.error('Errore nel caricamento galleria');
      setItems([]);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const uploadImage = async (file) => {
    const ext = file.name.split('.').pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    setUploading(true);

    const { error } = await supabase.storage.from('gallery').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    setUploading(false);

    if (error) {
      toast.error('Errore upload immagine');
      return null;
    }

    const { data } = supabase.storage.from('gallery').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      setForm(prev => ({ ...prev, image_url: url }));
      toast.success('Immagine caricata');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name_it || !form.image_url) {
      toast.error('Nome e immagine sono obbligatori');
      return;
    }

    setSaving(true);
    const payload = {
      name_it: form.name_it,
      name_en: form.name_en || form.name_it,
      result_it: form.result_it,
      result_en: form.result_en || form.result_it,
      desc_it: form.desc_it,
      desc_en: form.desc_en || form.desc_it,
      image_url: form.image_url,
      sort_order: Number(form.sort_order) || 0,
      is_published: form.is_published,
    };

    const { error } = form.id
      ? await supabase.from('gallery_items').update(payload).eq('id', form.id)
      : await supabase.from('gallery_items').insert(payload);

    setSaving(false);

    if (error) {
      toast.error('Errore nel salvataggio');
      return;
    }

    toast.success(form.id ? 'Aggiornato' : 'Aggiunto');
    setForm(null);
    loadItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminare questa voce dalla galleria?')) return;
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) {
      toast.error('Errore nell\'eliminazione');
      return;
    }
    toast.success('Eliminato');
    loadItems();
  };

  const togglePublished = async (item) => {
    const { error } = await supabase
      .from('gallery_items')
      .update({ is_published: !item.is_published })
      .eq('id', item.id);

    if (error) {
      toast.error('Errore nell\'aggiornamento');
      return;
    }
    loadItems();
  };

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F2F2F2] placeholder:text-[#555] focus:border-[#2F78F5] focus:outline-none';

  return (
    <div className="p-8 lg:p-12 max-w-5xl">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
            Galleria Trasformazioni
          </h1>
          <p className="text-sm text-[#666] mt-2">
            Gestisci le foto e i risultati mostrati nella pagina Risultati.
          </p>
        </div>
        {!form && (
          <button
            onClick={() => setForm({ ...emptyForm, sort_order: items.length + 1 })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2F78F5] text-white text-xs font-display uppercase tracking-wider shrink-0"
          >
            <Plus size={14} /> Aggiungi
          </button>
        )}
      </div>

      {form && (
        <form onSubmit={handleSave} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="font-display font-bold text-white uppercase tracking-wider text-sm">
            {form.id ? 'Modifica voce' : 'Nuova voce'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#888] uppercase tracking-wider mb-1 block">Nome (IT) *</label>
              <input className={inputClass} value={form.name_it} onChange={e => setForm({ ...form, name_it: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase tracking-wider mb-1 block">Nome (EN)</label>
              <input className={inputClass} value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase tracking-wider mb-1 block">Risultato (IT)</label>
              <input className={inputClass} value={form.result_it} onChange={e => setForm({ ...form, result_it: e.target.value })} placeholder="-24kg" />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase tracking-wider mb-1 block">Risultato (EN)</label>
              <input className={inputClass} value={form.result_en} onChange={e => setForm({ ...form, result_en: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase tracking-wider mb-1 block">Descrizione (IT)</label>
              <input className={inputClass} value={form.desc_it} onChange={e => setForm({ ...form, desc_it: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase tracking-wider mb-1 block">Descrizione (EN)</label>
              <input className={inputClass} value={form.desc_en} onChange={e => setForm({ ...form, desc_en: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase tracking-wider mb-1 block">Ordine</label>
              <input type="number" className={inputClass} value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#888] uppercase tracking-wider mb-2 block">Immagine *</label>
            <div className="flex items-start gap-4 flex-wrap">
              {form.image_url && (
                <img src={form.image_url} alt="" className="w-24 h-24 object-cover rounded-xl border border-white/10" />
              )}
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/20 text-sm text-[#888] hover:border-[#2F78F5] hover:text-[#2F78F5] cursor-pointer transition-all">
                <Upload size={16} />
                {uploading ? 'Caricamento...' : 'Carica foto'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploading} />
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#888]">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
            Pubblicato (visibile sul sito)
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-full bg-[#2F78F5] text-white text-xs font-display uppercase tracking-wider disabled:opacity-50">
              {saving ? 'Salvataggio...' : 'Salva'}
            </button>
            <button type="button" onClick={() => setForm(null)} className="px-6 py-2.5 rounded-full border border-white/20 text-[#888] text-xs font-display uppercase tracking-wider">
              Annulla
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-[#666] text-sm">Caricamento...</p>
      ) : items.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-[#666] text-sm">Nessuna voce in galleria. Aggiungi la prima o esegui la migration SQL in Supabase.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className={`bg-white/[0.03] border rounded-2xl overflow-hidden ${item.is_published ? 'border-white/10' : 'border-yellow-500/30 opacity-70'}`}>
              <img src={item.image_url} alt={item.name_it} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-semibold text-white text-sm">{item.name_it}</span>
                  <span className="text-[#2F78F5] text-xs font-display">{item.result_it}</span>
                </div>
                <p className="text-xs text-[#666] mb-3 line-clamp-2">{item.desc_it}</p>
                <div className="flex gap-2">
                  <button onClick={() => setForm(item)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#888] hover:text-white transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => togglePublished(item)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#888] hover:text-white transition-all">
                    {item.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-400/10 text-[#888] hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

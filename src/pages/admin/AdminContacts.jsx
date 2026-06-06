import { useState, useEffect } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error loading contacts:', error);
      toast.error('Errore nel caricamento messaggi');
      setMessages([]);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Eliminare questo messaggio?')) return;

    const { error } = await supabase.from('contact_requests').delete().eq('id', id);

    if (error) {
      toast.error('Errore durante l\'eliminazione');
      return;
    }

    toast.success('Messaggio eliminato');
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-widest">
          Messaggi di contatto
        </h1>
        <p className="text-sm text-[#666] mt-2">
          Tutte le richieste inviate dal form contatti. Se non ricevi email, controlla qui.
        </p>
      </div>

      {loading ? (
        <p className="text-[#666] text-sm">Caricamento...</p>
      ) : messages.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
          <Mail size={24} className="text-[#2F78F5] mx-auto mb-4" />
          <p className="text-[#666] text-sm">Nessun messaggio ricevuto.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map(msg => (
            <div key={msg.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-white font-display font-semibold">{msg.name}</p>
                  <a
                    href={`mailto:${msg.email}?subject=Re: Richiesta da giuseppecompagnone.com`}
                    className="text-[#2F78F5] text-sm break-all hover:underline"
                  >
                    {msg.email}
                  </a>
                  {msg.goal && (
                    <p className="text-xs text-[#888] mt-1">
                      Obiettivo: <span className="text-[#ccc]">{msg.goal}</span>
                    </p>
                  )}
                  <p className="text-[#555] text-xs mt-1">
                    {new Date(msg.created_at).toLocaleDateString('it-IT', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={`mailto:${msg.email}?subject=Re: Richiesta da giuseppecompagnone.com`}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-display uppercase bg-[#2F78F5]/20 border border-[#2F78F5]/40 text-[#2F78F5] hover:bg-[#2F78F5]/30 transition-all min-h-[44px]"
                  >
                    <Mail size={14} /> Rispondi
                  </a>
                  <button
                    type="button"
                    onClick={() => deleteMessage(msg.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-display uppercase bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30 transition-all min-h-[44px]"
                  >
                    <Trash2 size={14} /> Elimina
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#ccc] leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

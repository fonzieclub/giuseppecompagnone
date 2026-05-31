import { useState } from 'react';
import { useLang } from '../lib/LanguageContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import AnimatedHeadline from '../components/AnimatedHeadline';
import ScrollReveal from '../components/ScrollReveal';


export default function Contatti() {
  const { t } = useLang();
  const [form, setForm] = useState({ nome: '', email: '', obiettivo: '', messaggio: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.messaggio) return;
    setSending(true);

    const { error } = await supabase.from('contact_requests').insert({
      name: form.nome,
      email: form.email,
      goal: form.obiettivo,
      message: form.messaggio,
    });

    if (error) {
      console.error('Contact form error:', error);
      toast.error(t('Errore durante l\'invio. Riprova.', 'Error sending message. Please try again.'));
      setSending(false);
      return;
    }

    supabase.functions.invoke('send-contact-email', {
      body: {
        name: form.nome,
        email: form.email,
        goal: form.obiettivo,
        message: form.messaggio,
      },
    }).catch(() => {
      // Email notification is optional; form data is already saved
    });

    setSent(true);
    setSending(false);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-[#F2F2F2] text-sm font-body placeholder:text-[#555] focus:border-[#2F78F5] focus:ring-1 focus:ring-[#2F78F5] focus:outline-none transition-all min-h-[48px]";

  return (
    <section className="min-h-screen bg-[#050505] py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">

            <AnimatedHeadline
              text={t('RICHIEDI INFORMAZIONI', 'REQUEST INFORMATION')}
              className="text-3xl md:text-5xl font-display font-bold uppercase mb-4"
            />

          </div>

          {sent ? (
            <ScrollReveal>
              <div className="text-center py-16 bg-white/[0.03] border border-white/10 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-[#2F78F5]/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-display font-bold uppercase mb-2">
                  {t('MESSAGGIO INVIATO', 'MESSAGE SENT')}
                </h3>
                <p className="text-sm text-[#888]">
                  {t('Ti ricontatterò il prima possibile.', 'I will get back to you as soon as possible.')}
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">
                    {t('Nome', 'Name')} *
                  </label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={e => handleChange('nome', e.target.value)}
                    placeholder={t('Il tuo nome', 'Your name')}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder={t('La tua email', 'Your email')}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">
                    {t('Obiettivo', 'Goal')}
                  </label>
                  <input
                    type="text"
                    value={form.obiettivo}
                    onChange={e => handleChange('obiettivo', e.target.value)}
                    placeholder={t('Es. perdere peso, aumentare massa...', 'E.g. lose weight, build muscle...')}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">
                    {t('Messaggio', 'Message')} *
                  </label>
                  <textarea
                    value={form.messaggio}
                    onChange={e => handleChange('messaggio', e.target.value)}
                    placeholder={t('Raccontami di te e dei tuoi obiettivi...', 'Tell me about yourself and your goals...')}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[#F2F2F2] text-sm font-body placeholder:text-[#555] focus:border-[#2F78F5] focus:ring-1 focus:ring-[#2F78F5] focus:outline-none min-h-[140px] resize-none transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 rounded-full bg-[#2F78F5] text-white font-display uppercase text-sm tracking-wider font-semibold hover:shadow-[0_0_30px_rgba(47,120,245,0.4)] transition-all min-h-[48px] btn-sweep relative overflow-hidden disabled:opacity-50"
                >
                  {sending ? '...' : t('INVIA RICHIESTA', 'SEND REQUEST')}
                </button>
              </form>
            </ScrollReveal>
          )}


        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const finish = async () => {
      try {
        // Give Supabase time to exchange the OAuth code in the URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          // Retry once after a short delay (PKCE exchange can be async)
          await new Promise(r => setTimeout(r, 1000));
          const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
          if (retryError) throw retryError;
          if (!retrySession) throw new Error('Accesso non completato. Riprova.');
        }

        const redirect = sessionStorage.getItem('auth_redirect') || '/recensioni';
        sessionStorage.removeItem('auth_redirect');
        navigate(redirect, { replace: true });
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Errore durante l\'accesso');
      }
    };

    finish();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/login" className="text-[#2F78F5] underline text-sm">
            Torna al login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/20 border-t-[#2F78F5] rounded-full animate-spin" />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const TIMEOUT_MS = 15000;

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let done = false;

    const finish = (redirect) => {
      if (done) return;
      done = true;
      sessionStorage.removeItem('auth_redirect');
      navigate(redirect, { replace: true });
    };

    const fail = (message) => {
      if (done) return;
      done = true;
      sessionStorage.removeItem('auth_redirect');
      setError(message);
    };

    const redirect = sessionStorage.getItem('auth_redirect') || '/recensioni';

    const timeout = setTimeout(() => {
      fail('Accesso non completato. Riprova dal login.');
    }, TIMEOUT_MS);

    const complete = (session) => {
      if (!session || done) return;
      clearTimeout(timeout);
      finish(redirect);
    };

    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const authError = params.get('error_description') || params.get('error');

        if (authError) {
          clearTimeout(timeout);
          fail(authError);
          return;
        }

        // Wait for the client PKCE auto-exchange (detectSessionInUrl)
        for (let i = 0; i < 16 && !done; i++) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            complete(session);
            return;
          }
          await new Promise((r) => setTimeout(r, 250));
        }

        if (done) return;

        // Fallback: exchange the code explicitly if still no session
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              complete(retrySession);
              return;
            }
            throw exchangeError;
          }
          complete(data.session);
          return;
        }

        clearTimeout(timeout);
        fail('Accesso non completato. Riprova dal login.');
      } catch (err) {
        console.error('Auth callback error:', err);
        clearTimeout(timeout);
        fail(err.message || 'Errore durante l\'accesso');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')) {
        complete(session);
      }
    });

    void run();

    return () => {
      done = true;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
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

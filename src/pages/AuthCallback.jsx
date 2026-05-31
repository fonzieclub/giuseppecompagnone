import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const TIMEOUT_MS = 12000;

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        clearTimeout(timeout);
        finish(redirect);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        clearTimeout(timeout);
        finish(redirect);
      }
    });

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

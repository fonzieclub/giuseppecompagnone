import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LanguageContext';
import { toast } from 'sonner';

function getInitialMode(searchParams, redirect) {
  const mode = searchParams.get('mode');
  if (mode === 'login' || mode === 'signup') return mode;
  if (redirect.includes('recensioni')) return 'signup';
  return 'login';
}

export default function Login() {
  const { t } = useLang();
  const { signIn, signUp, signInWithGoogle, isAuthenticated, isLoadingProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/recensioni';

  const [mode, setMode] = useState(() => getInitialMode(searchParams, redirect));
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  useEffect(() => {
    // Wait for profile/role so admin redirects don't hit a false "access denied"
    if (isAuthenticated && !isLoadingProfile) {
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, isLoadingProfile, navigate, redirect]);

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-[#F2F2F2] text-base sm:text-sm font-body placeholder:text-[#555] focus:border-[#2F78F5] focus:ring-1 focus:ring-[#2F78F5] focus:outline-none transition-all min-h-[48px]';

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle(redirect);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAwaitingConfirmation(false);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          toast.error(t('Inserisci il tuo nome', 'Enter your name'));
          setLoading(false);
          return;
        }
        const data = await signUp({ email, password, fullName: fullName.trim() });
        if (data.session) {
          toast.success(t('Account creato!', 'Account created!'));
          navigate(redirect, { replace: true });
        } else {
          setAwaitingConfirmation(true);
          setMode('login');
          toast.success(
            t(
              'Account creato! Controlla la tua email e clicca il link di conferma, poi accedi.',
              'Account created! Check your email, confirm your account, then log in.'
            ),
            { duration: 8000 }
          );
        }
      } else {
        await signIn({ email, password });
        toast.success(t('Accesso effettuato', 'Logged in successfully'));
        navigate(redirect, { replace: true });
      }
    } catch (error) {
      const msg = error.message || '';
      if (msg.toLowerCase().includes('email not confirmed')) {
        toast.error(
          t(
            'Devi confermare la tua email prima di accedere. Controlla la posta in arrivo.',
            'Please confirm your email before logging in. Check your inbox.'
          ),
          { duration: 8000 }
        );
      } else if (msg.toLowerCase().includes('already registered')) {
        toast.error(t('Email già registrata. Prova ad accedere.', 'Email already registered. Try logging in.'));
        setMode('login');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050505] pt-20 md:pt-28 pb-32 flex items-start justify-center">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold uppercase text-white tracking-widest">
            {mode === 'login'
              ? t('Accedi', 'Login')
              : t('Registrati', 'Sign up')}
          </h1>
          <p className="mt-3 text-sm text-[#777] font-body">
            {t(
              'Crea un account gratuito per lasciare una recensione.',
              'Create a free account to leave a review.'
            )}
          </p>
        </div>

        {awaitingConfirmation && (
          <div className="mb-6 p-4 rounded-2xl bg-[#2F78F5]/10 border border-[#2F78F5]/30 text-sm text-[#ccc] text-center">
            {t(
              'Ti abbiamo inviato un\'email di conferma. Clicca il link, poi torna qui e accedi.',
              'We sent you a confirmation email. Click the link, then come back here and log in.'
            )}
          </div>
        )}

        <div className="flex gap-2 mb-8 p-1 bg-white/[0.03] border border-white/10 rounded-full">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-full text-xs font-display uppercase tracking-wider transition-all min-h-[44px] ${
              mode === 'login' ? 'bg-[#2F78F5] text-white' : 'text-[#888] hover:text-white'
            }`}
          >
            {t('Accedi', 'Login')}
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 rounded-full text-xs font-display uppercase tracking-wider transition-all min-h-[44px] ${
              mode === 'signup' ? 'bg-[#2F78F5] text-white' : 'text-[#888] hover:text-white'
            }`}
          >
            {t('Registrati', 'Sign up')}
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-4 rounded-full bg-white text-[#050505] font-display uppercase text-sm tracking-wider font-semibold hover:bg-white/90 transition-all min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-3 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {t('Continua con Google', 'Continue with Google')}
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-[#666] font-display uppercase tracking-wider">{t('oppure', 'or')}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">
                {t('Nome', 'Name')} *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('Il tuo nome', 'Your name')}
                className={inputClass}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('La tua email', 'Your email')}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-[#888] mb-2 ml-2">
              {t('Password', 'Password')} *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#2F78F5] text-white font-display uppercase text-sm tracking-wider font-semibold hover:shadow-[0_0_30px_rgba(47,120,245,0.4)] transition-all min-h-[48px] disabled:opacity-50"
          >
            {loading
              ? '...'
              : mode === 'login'
                ? t('ACCEDI', 'LOGIN')
                : t('CREA ACCOUNT', 'CREATE ACCOUNT')}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-[#666]">
          <Link to="/" className="text-[#2F78F5] hover:underline">
            {t('Torna alla home', 'Back to home')}
          </Link>
        </p>
      </div>
    </section>
  );
}

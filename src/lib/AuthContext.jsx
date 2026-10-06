import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { clearLegacyStorage } from '@/lib/clearLegacyStorage';

const AuthContext = createContext();

const withTimeout = (promise, ms, label = 'Operation') =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout`)), ms)
    ),
  ]);

const mapProfileToUser = (authUser, profile) => {
  if (!authUser) return null;
  return {
    id: authUser.id,
    email: authUser.email,
    full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
    role: profile?.role || 'user',
  };
};

const ensureProfile = async (authUser) => {
  if (!authUser?.id) return;

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', authUser.id)
    .maybeSingle();

  if (existing) return;

  await supabase.from('profiles').insert({
    id: authUser.id,
    full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Utente',
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const profileLoadRef = useRef(0);

  const loadUser = useCallback(async (authSession) => {
    if (!authSession?.user) {
      setSession(null);
      setUser(null);
      setIsLoadingProfile(false);
      return;
    }

    setSession(authSession);
    setUser(mapProfileToUser(authSession.user, null));
    setIsLoadingProfile(true);

    const loadId = ++profileLoadRef.current;

    try {
      await withTimeout(ensureProfile(authSession.user), 5000, 'Profile create');

      const { data: profile, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', authSession.user.id)
          .maybeSingle(),
        5000,
        'Profile fetch'
      );

      if (loadId !== profileLoadRef.current) return;

      if (error) {
        console.warn('Profile fetch failed:', error.message);
      }

      setUser(mapProfileToUser(authSession.user, profile));
    } catch (err) {
      if (loadId !== profileLoadRef.current) return;
      console.warn('Profile load skipped:', err.message);
    } finally {
      if (loadId === profileLoadRef.current) {
        setIsLoadingProfile(false);
      }
    }
  }, []);

  useEffect(() => {
    clearLegacyStorage();

    let mounted = true;

    const finishLoading = () => {
      if (mounted) setIsLoadingAuth(false);
    };

    const init = async () => {
      try {
        const { data: { session: initialSession }, error } = await withTimeout(
          supabase.auth.getSession(),
          8000,
          'Auth session'
        );

        if (error) throw error;

        if (mounted && initialSession) {
          await loadUser(initialSession);
        }
      } catch (err) {
        console.warn('Auth init failed, continuing as guest:', err.message);
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsLoadingProfile(false);
        }
      } finally {
        finishLoading();
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        void loadUser(nextSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUser]);

  const signUp = async ({ email, password, fullName }) => {
    const redirectTo = `${window.location.origin}/recensioni`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: redirectTo,
      },
    });
    if (error) throw error;

    if (data.session) {
      await loadUser(data.session);
    }

    return data;
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (data.session) {
      await loadUser(data.session);
    }

    return data;
  };

  const signInWithGoogle = async (redirectTo = '/recensioni') => {
    sessionStorage.setItem('auth_redirect', redirectTo);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setIsLoadingProfile(false);
  };

  const isAuthenticated = !!session?.user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      isAdmin,
      isLoadingAuth,
      isLoadingProfile,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

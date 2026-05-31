import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { clearLegacyStorage } from '@/lib/clearLegacyStorage';

const AuthContext = createContext();

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

  const loadUser = useCallback(async (authSession) => {
    if (!authSession?.user) {
      setSession(null);
      setUser(null);
      return;
    }

    setSession(authSession);

    try {
      await ensureProfile(authSession.user);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', authSession.user.id)
        .maybeSingle();

      if (error) {
        console.warn('Profile fetch failed:', error.message);
      }

      setUser(mapProfileToUser(authSession.user, profile));
    } catch (err) {
      console.warn('Profile fetch error:', err);
      setUser(mapProfileToUser(authSession.user, null));
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
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 8000)
        );

        const { data: { session: initialSession }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise,
        ]);

        if (error) throw error;

        if (mounted) {
          await loadUser(initialSession);
        }
      } catch (err) {
        console.warn('Auth init failed, continuing as guest:', err.message);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        finishLoading();
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (mounted) {
        await loadUser(nextSession);
        finishLoading();
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`}`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
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

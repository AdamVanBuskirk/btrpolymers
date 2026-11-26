import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../Core/supabase';

import {
  salesRequest,
  SalesApiError,
} from '../api/salesApi';

export type SalesRole = 'employee' | 'admin';

export interface SalesUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: SalesRole;
  is_active: boolean;
}

interface SalesAuthContextType {
  session: Session | null;
  profile: SalesUser | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const SalesAuthContext =
  createContext<SalesAuthContextType | undefined>(
    undefined
  );

export function SalesAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [profile, setProfile] =
    useState<SalesUser | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let requestId = 0;

    async function resolveSession(
      currentSession: Session | null
    ) {
      if (!mounted) return;

      const currentRequest = ++requestId;

      setLoading(true);
      setSession(currentSession);
      setProfile(null);
      setError(null);

      if (!currentSession) {
        setLoading(false);
        return;
      }

        try {
        const data = await salesRequest<SalesUser>(
            '/me',
            {},
            currentSession.access_token
        );

        if (
            !mounted ||
            currentRequest !== requestId
        ) {
            return;
        }

        if (!data || !data.is_active) {
            setError(
            'Your account is not authorized to access the BTR Sales Platform.'
            );
            return;
        }

        setProfile(data);

        } catch (err) {
        if (
            mounted &&
            currentRequest === requestId
        ) {
            setError(
            err instanceof SalesApiError
                ? err.message
                : 'Unable to verify your sales platform access.'
            );
        }
        } finally {
        if (
            mounted &&
            currentRequest === requestId
        ) {
            setLoading(false);
        }
        }
    }

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(
        (_event, currentSession) => {
          // Run database queries outside the
          // Supabase auth callback.
          setTimeout(() => {
            if (mounted) {
              void resolveSession(currentSession);
            }
          }, 0);
        }
      );

    return () => {
      mounted = false;
      requestId++;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(
    email: string,
    password: string
  ) {
    setError(null);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  async function signOut() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    setSession(null);
    setProfile(null);
    setError(null);
  }

  async function signInWithGoogle() {
  setError(null);

  const { error } =
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/sales`,
        queryParams: {
          hd: 'btrpolymers.com',
          prompt: 'select_account',
        },
      },
    });

  if (error) {
    throw new Error(error.message);
  }
}

  return (
    <SalesAuthContext.Provider
      value={{
        session,
        profile,
        loading,
        error,
        isAdmin: profile?.role === 'admin',
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </SalesAuthContext.Provider>
  );
}

export function useSalesAuth() {
  const context = useContext(SalesAuthContext);

  if (!context) {
    throw new Error(
      'useSalesAuth must be used within SalesAuthProvider'
    );
  }

  return context;
}
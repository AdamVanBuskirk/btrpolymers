import React, { useState } from 'react';
import {
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useSalesAuth } from './SalesAuthProvider';

export default function SalesLogin() {
    const {
    session,
    profile,
    loading,
    error: authError,
    signIn,
    signInWithGoogle,
    signOut,
    } = useSalesAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [googleBusy, setGoogleBusy] = useState(false);

  const location = useLocation();

  const requestedPath = (
    location.state as { from?: string } | null
  )?.from;

  const destination =
    requestedPath?.startsWith('/sales/') &&
    requestedPath !== '/sales/login'
      ? requestedPath
      : '/sales';

  async function submit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setBusy(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    setError('');
    setGoogleBusy(true);

    try {
        await signInWithGoogle();
    } catch (err) {
        setError(
        err instanceof Error
            ? err.message
            : 'Unable to sign in with Google.'
        );
    } finally {
        setGoogleBusy(false);
    }
    }

  async function switchAccount() {
    setError('');

    try {
      await signOut();
      setPassword('');
    } catch {
      setError('Unable to sign out.');
    }
  }

  if (!loading && profile) {
    return (
      <Navigate to={destination} replace />
    );
  }

  return (
    <main className="sales-login">

      <section className="sales-login-brand">

        <div>
          <img
            className="sales-login-logo"
            src="/images/btr-green-arrow.gif"
            alt="BTR Polymers"
          />

          <div className="sales-login-eyebrow">
            SALES PLATFORM
          </div>
        </div>

        <div className="sales-login-message">

          <h1>
            Built for the business of recycling.
          </h1>

          <p>
            The tools, knowledge and resources
            to help our team source, qualify
            and sell post-industrial plastic scrap.
          </p>

          <div className="sales-green-line" />

          <h2>3 billion pounds.</h2>

          <p>Our mission by 2036.</p>

        </div>

        <div className="sales-login-footer">
          BTR POLYMERS · INTERNAL PLATFORM
        </div>

      </section>

      <section className="sales-login-content">

        <div className="sales-login-form">

          <h2>Welcome back.</h2>

          <p className="sales-muted">
            Sign in to your BTR Sales Platform account.
          </p>

          {(error || authError) && (
            <div
              className="sales-error"
              role="alert"
            >
              {error || authError}
            </div>
          )}

          {loading ? (
            <p>Verifying your account...</p>
          ) : session ? (
            <button
              className="sales-button"
              onClick={switchAccount}
            >
              Sign out and switch account
            </button>
          ) : (
            <form onSubmit={submit}>

                <button
                type="button"
                className="sales-google-button"
                onClick={handleGoogleSignIn}
                disabled={busy || googleBusy}
                >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                >
                    <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.79 7.18l7.73 6C44.4 38.03 46.98 31.88 46.98 24.55z"
                    />
                    <path
                    fill="#FBBC05"
                    d="M10.53 28.59C10.05 27.15 9.77 25.61 9.77 24s.28-3.15.77-4.59l-7.98-6.19C.93 16.46 0 20.12 0 24s.93 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6C30.03 37.65 27.26 38.5 24 38.5c-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                </svg>

                {googleBusy
                    ? 'Connecting to Google...'
                    : 'Sign in with Google'}
                </button>

                <div className="sales-login-divider">
                <span>or sign in with email</span>
                </div>

              <label htmlFor="sales-email">
                Email address
              </label>

              <input
                id="sales-email"
                type="email"
                autoComplete="username"
                placeholder="you@btrpolymers.com"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

              <label htmlFor="sales-password">
                Password
              </label>

              <input
                id="sales-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

              <button
                className="sales-button"
                type="submit"
                disabled={busy || googleBusy}
              >
                {busy ? 'Signing in...' : 'Sign in →'}
              </button>

            </form>
          )}

          <div className="sales-login-notice">
            Authorized BTR personnel only.
          </div>

        </div>

      </section>

    </main>
  );
}
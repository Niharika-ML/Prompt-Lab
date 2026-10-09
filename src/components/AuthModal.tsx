import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    continueAsGuest,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (authModalMode === 'login') {
        if (!email || !password) {
          setError('Please provide email and password.');
          setIsLoading(false);
          return;
        }
        await loginWithEmail(email, password);
      } else if (authModalMode === 'signup') {
        if (!email || !password) {
          setError('Please provide email and password.');
          setIsLoading(false);
          return;
        }
        await signupWithEmail(name || 'Niharika', email, password);
      } else if (authModalMode === 'forgot') {
        if (!email) {
          setError('Please enter your account email.');
          setIsLoading(false);
          return;
        }
        setResetSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch {
      setError('Google Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {authModalMode === 'login'
              ? 'Welcome to PromptLab'
              : authModalMode === 'signup'
              ? 'Create Your Account'
              : 'Reset Your Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {authModalMode === 'login'
              ? 'Sign in to access your personal dashboard, saved prompts & streak'
              : authModalMode === 'signup'
              ? 'Start your journey from prompt beginner to AI creator'
              : 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {authModalMode !== 'forgot' && (
          <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 mb-6">
            <button
              onClick={() => {
                setError(null);
                openAuthModal('login');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setError(null);
                openAuthModal('signup');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Google 1-Click Button */}
        {authModalMode !== 'forgot' && (
          <div className="space-y-4 mb-6">
            <button
              onClick={handleGoogle}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-white transition-all cursor-pointer shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">or with email</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
          </div>
        )}

        {/* Error notice */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Reset Confirmation */}
        {resetSent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Check Your Inbox</h3>
            <p className="text-xs text-slate-400">
              We've dispatched password reset instructions to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                openAuthModal('login');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Niharika"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {authModalMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => openAuthModal('forgot')}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authModalMode === 'login'
                      ? 'Sign In to Dashboard'
                      : authModalMode === 'signup'
                      ? 'Create Free Account'
                      : 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Continue as Guest Button (Requirement 1) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={continueAsGuest}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Continue as Guest (Try Without Login)</span>
          </button>
          <span className="text-[10px] text-slate-500 block mt-2">
            Instant practice access • Local storage saves your progress
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PageView } from '../types';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: PageView) => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onSuccess }) => {
  const { loginWithEmail, loginWithGoogle, continueAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError('Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    onNavigate('practice');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-grid-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl border border-slate-800 relative z-10 backdrop-blur-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Continue your prompt learning journey.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {showForgotNotice && (
            <div className="mb-6 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs">
              <p className="font-semibold text-white mb-1">Password reset instructions:</p>
              <p>For this interactive demo, enter any email and password or use "Continue with Google" for instant 1-click access!</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="niharika@promptlab.ai"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(!showForgotNotice)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>🔐 Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              or continue with
            </span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
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

          {/* Guest Action */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={handleGuest}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Continue as Guest (No login required)</span>
            </button>
          </div>

          {/* Footer switch */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <span>Don't have an account? </span>
            <button
              onClick={() => onNavigate('signup')}
              className="font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

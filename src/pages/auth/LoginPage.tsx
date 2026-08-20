import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { loginWithCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your institutional email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await loginWithCredentials(trimmedEmail, password);
      onLoginSuccess();
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setErrorMessage('Unable to reach GKCE authentication server. Please verify connection.');
      } else {
        setErrorMessage(msg || 'Invalid institutional email or password. Please verify your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/60 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/60 p-6 sm:p-8 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Institutional Academic Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30 mx-auto tracking-tight border border-blue-400/30">
            GK
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">GKCE DSA Monitor</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Gokula Krishna College of Engineering • Academic Evaluation Portal
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3.5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  placeholder="name@gkce.edu.in"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Chips (Mobile-friendly single-tap) */}
        <div className="space-y-2 pt-2 border-t border-slate-700/50">
          <div className="text-[11px] font-semibold text-slate-400 text-center">
            Institutional Access Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('dean.academics@gkce.edu.in');
                setPassword('Dean@GKCE2026');
              }}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/70 hover:border-blue-500/50 text-left transition-all active:scale-98 cursor-pointer group"
            >
              <div className="text-[10px] font-bold text-blue-400 group-hover:text-blue-300">🏛️ Dean</div>
              <div className="text-[10px] text-slate-200 font-semibold truncate">Prof. Dr. R. V. Raman</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('ludvika@gkce.edu.in');
                setPassword('Mentor@GKCE2026');
              }}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/70 hover:border-indigo-500/50 text-left transition-all active:scale-98 cursor-pointer group"
            >
              <div className="text-[10px] font-bold text-indigo-400 group-hover:text-indigo-300">👨‍🏫 Mentor (Team 07)</div>
              <div className="text-[10px] text-slate-200 font-semibold truncate">Mrs. Ludvika</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('chakri24f81a0522@gkce.edu.in');
                setPassword('gkce@1234');
              }}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/70 hover:border-emerald-500/50 text-left transition-all active:scale-98 cursor-pointer group"
            >
              <div className="text-[10px] font-bold text-emerald-400 group-hover:text-emerald-300">🎓 Student</div>
              <div className="text-[10px] text-slate-200 font-semibold truncate">CH. CHAKRI</div>
            </button>
          </div>
        </div>

        {/* Security Trust Badge */}
        <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Session • Strict 3-Tier RBAC</span>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-500">
          Gokula Krishna College of Engineering (Autonomous) • Affiliated to JNTUA
        </div>
      </div>
    </div>
  );
};

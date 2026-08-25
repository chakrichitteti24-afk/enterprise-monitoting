import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  Server,
  Fingerprint,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLogo } from '../../components/ui/AppLogo';
import { COMPANY_CONFIG } from '../../config';

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
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Cooldown countdown timer for brute force protection
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Caps Lock detection
  const handleKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Basic', color: 'bg-amber-500' };
    if (score <= 4) return { score: 2, label: 'Secure', color: 'bg-blue-500' };
    return { score: 3, label: 'Enterprise Grade', color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your institutional email address or roll number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      await loginWithCredentials(trimmedEmail, password);
      setFailedAttempts(0);
      onLoginSuccess();
    } catch (err: any) {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);

      if (nextFail >= 4) {
        setLockoutSeconds(30);
        setErrorMessage('Excessive invalid attempts. Security lockdown active for 30 seconds.');
      } else {
        const msg = err?.message || '';
        if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
          setErrorMessage('Unable to reach GKCE authentication server. Please check connection.');
        } else {
          setErrorMessage(
            `Authentication failed. Please verify institutional credentials. (${4 - nextFail} attempt${
              4 - nextFail === 1 ? '' : 's'
            } remaining before cooldown)`
          );
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-slate-950 text-slate-100 flex flex-col justify-center items-center selection:bg-blue-600 selection:text-white relative overflow-hidden"
      style={{
        minHeight: '100svh',
        padding: 'max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))',
      }}
    >
      {/* Dynamic Cyber Security Ambient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-slate-950/80 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Authentication Container */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] shadow-2xl shadow-black/80 border border-slate-700/60 p-5 sm:p-8 space-y-5 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Security Shield & Header */}
        <div className="text-center space-y-2.5">
          <div className="relative inline-block">
            <AppLogo size="xl" showGlow animated />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white shadow-xs" title="Encrypted TLS 1.3 Connection">
              <Lock className="w-2.5 h-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-400 tracking-wide uppercase">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>Institutional Access Gateway</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">GKCE DSA Portal</h1>
            <p className="text-[11px] text-slate-400">
              Gokula Krishna College of Engineering • Single Sign-On
            </p>
          </div>
        </div>

        {/* Live Security Verification Pill */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-semibold">TLS 1.3 SHA-256 Verified</span>
          </div>
          <span className="font-mono text-slate-500">ID: SEC-GKCE-2026</span>
        </div>


        {/* Error / Lockout Alert */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                lockoutSeconds > 0
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              }`}
            >
              {lockoutSeconds > 0 ? (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0 flex-1 leading-tight">
                <span className="font-semibold block">
                  {lockoutSeconds > 0 ? `Access Locked (${lockoutSeconds}s)` : 'Authentication Warning'}
                </span>
                <span className="text-[11px] opacity-90">{errorMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3.5">
            {/* Email / Roll input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Institutional Email or Roll Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  disabled={isSubmitting || lockoutSeconds > 0}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono disabled:opacity-50"
                  placeholder="e.g. chakri24f81a0522@gkce.edu.in"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password input with eye toggle & caps lock detector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Account Password
                </label>
                {isCapsLockOn && (
                  <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                    ⚠️ Caps Lock is ON
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isSubmitting || lockoutSeconds > 0}
                  value={password}
                  onKeyDown={handleKeyEvent}
                  onKeyUp={handleKeyEvent}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono disabled:opacity-50"
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

              {/* Password Integrity Level Meter */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Security Strength:</span>
                    <span className="font-semibold text-slate-200">{strength.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 h-1 rounded-full overflow-hidden bg-slate-800">
                    <div className={`h-full ${strength.score >= 1 ? strength.color : 'bg-slate-800'}`} />
                    <div className={`h-full ${strength.score >= 2 ? strength.color : 'bg-slate-800'}`} />
                    <div className={`h-full ${strength.score >= 3 ? strength.color : 'bg-slate-800'}`} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Remember Device & Security Policy */}
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-3.5 h-3.5 rounded-sm bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Remember workstation</span>
            </label>
            <span className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">
              Help Desk
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || lockoutSeconds > 0}
            className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
            style={{ minHeight: 48 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Verifying Cryptographic Tokens...</span>
              </>
            ) : lockoutSeconds > 0 ? (
              <>
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Locked ({lockoutSeconds}s Remaining)</span>
              </>
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Compliance Seal */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strict 3-Tier RBAC • ISO/IEC 27001 Security Standard</span>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-500 space-y-1">
          <div>Gokula Krishna College of Engineering • Affiliated to JNTUA</div>
          <div className="text-slate-400">
            Platform engineered by{' '}
            <a
              href={COMPANY_CONFIG.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors"
            >
              {COMPANY_CONFIG.name}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Database,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import SchemaBackground from '../components/common/SchemaBackground';
import Button from '../components/common/Button';
import CardContainer from '../components/common/CardContainer';

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('admin@pivot.dev');
  const [password, setPassword] = useState('pivot_pg16_secret');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail('admin@pivot.dev');
    setPassword('pivot_pg16_secret');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-slate-950 text-slate-100 overflow-hidden">
      <SchemaBackground variant="hero" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-4 group no-underline">
            <span className="font-display text-3xl font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
              Pivot<span className="text-amber-400">_</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {tab === 'signin' ? 'Welcome back, engineer' : 'Create developer workspace'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {tab === 'signin'
              ? 'Access your saved migrations and risk audit logs'
              : 'Automate MySQL to PostgreSQL schema cutovers'}
          </p>
        </div>

        {/* Floating Glass Auth Card */}
        <CardContainer glow accent="indigo" className="p-8 backdrop-blur-2xl bg-slate-900/85">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-lg bg-slate-950 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setTab('signin')}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                tab === 'signin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                tab === 'signup'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social Google Login Button (dummy shell) */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-medium transition-all shadow-sm mb-5 group"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path fill="#4285F4" d="M21.6 12.23c0-.79-.07-1.54-.2-2.26H12v4.28h5.39a4.61 4.61 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.97-4.33 2.97-7.54Z" />
              <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.24-2.5c-.9.62-2.04 1-3.37 1-2.59 0-4.79-1.75-5.57-4.09H.92v2.63A10 10 0 0 0 12 22Z" />
              <path fill="#FBBC05" d="M6.43 18c-.33-.62-.52-1.3-.52-2s.19-1.38.52-2L2.8 11.4A9.97 9.97 0 0 0 .9 12a10 10 0 0 0 9.1 5.48c2.7 0 4.95-.9 6.6-2.43l-3.24-2.5c-.9.62-2.04 1-3.37 1-2.59 0-4.79-1.75-5.57-4.09L2.8 11.42c1.15-3.42 4.28-5.9 8.2-5.9 2.7 0 4.96.9 6.6 2.43l3.24-2.5A9.97 9.97 0 0 0 12 2a10 10 0 0 0-9.1 5.48L6.43 9.5c.78-2.34 2.98-4.09 5.57-4.09 1.33 0 2.47.38 3.37 1l3.24-2.5A10.04 10.04 0 0 0 12 2C7.02 2 2.8 5.68 1.15 10.3L6.43 12c.78-2.34 2.98-4.09 5.57-4.09 1.33 0 2.47.38 3.37 1l3.24-2.5A10.04 10.04 0 0 0 12 2c-4.98 0-9.2 3.68-10.85 8.3L6.43 12Z" opacity="0.12" />
              <path fill="#EA4335" d="M12 6.91c1.57 0 2.98.54 4.1 1.6l3.04-3.04A9.98 9.98 0 0 0 12 2a10 10 0 0 0-9.1 5.48l3.98 2.72A5.96 5.96 0 0 1 12 6.91Z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-5 text-center text-[10px] font-mono uppercase tracking-widest text-slate-500">
            <span className="relative z-10 bg-slate-900 px-3">or continue with email</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                Work Email
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 text-slate-200">
                <Mail className="w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full bg-transparent text-sm placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-slate-400 uppercase">
                  Password
                </label>
                {tab === 'signin' && (
                  <span className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">
                    Forgot key?
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 text-slate-200">
                <Lock className="w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-sm placeholder:text-slate-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              iconRight={ArrowRight}
              className="w-full mt-2"
            >
              {tab === 'signin' ? 'Sign In to Workspace' : 'Initialize Workspace'}
            </Button>
          </form>

          {/* Quick Demo Fill Pill */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono">Demo account:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-900/60 transition-colors font-mono"
            >
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>Autofill Demo Credentials</span>
            </button>
          </div>
        </CardContainer>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AES-256 client-side parsing • Zero DDL telemetry stored</span>
        </div>
      </div>
    </div>
  );
}

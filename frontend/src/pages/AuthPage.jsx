import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  LoaderCircle,
} from 'lucide-react';
import SchemaBackground from '../components/common/SchemaBackground';
import Button from '../components/common/Button';
import CardContainer from '../components/common/CardContainer';
import { useAuth } from '../contexts/useAuth';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);
    try {
      if (tab === 'signup') {
        await register({ email, password });
        setTab('signin');
        setPassword('');
        setNotice('Account created. Sign in with your new credentials.');
      } else {
        await login({ email, password });
        navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
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
              onClick={() => { setTab('signin'); setError(''); setNotice(''); }}
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
              onClick={() => { setTab('signup'); setError(''); setNotice(''); }}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                tab === 'signup'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
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
                  autoComplete="email"
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
                  <span className="text-xs text-slate-500">
                    Forgot key?
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 text-slate-200">
                <Lock className="w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
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
              iconRight={isSubmitting ? LoaderCircle : ArrowRight}
              className="w-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Connecting...'
                : tab === 'signin' ? 'Sign In to Workspace' : 'Create Account'}
            </Button>
          </form>

          {error && (
            <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-rose-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}
          {notice && <p role="status" className="mt-4 text-sm text-emerald-300">{notice}</p>}
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

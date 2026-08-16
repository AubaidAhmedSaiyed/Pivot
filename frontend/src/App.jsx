import React, { useEffect, useState } from 'react';
import {
  Database,
  Terminal,
  FileCode2,
  Settings2,
  Table,
  Check,
  AlertCircle,
  Download,
  Search,
  Activity,
  ArrowRight,
  Code2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin;

const DEMO_CREDENTIALS = {
  email: 'admin@pivot.com',
  password: 'admin123',
};

function decodeJwtPayload(token) {
  const parts = token.split('.');

  if (parts.length < 2) {
    return null;
  }

  const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64Url + '='.repeat((4 - (base64Url.length % 4)) % 4);

  try {
    const decoded = atob(padded);
    const binary = decoded
      .split('')
      .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('');
    return JSON.parse(decodeURIComponent(binary));
  } catch (error) {
    return null;
  }
}

function GoogleBrandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.79-.07-1.54-.2-2.26H12v4.28h5.39a4.61 4.61 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.97-4.33 2.97-7.54Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.24-2.5c-.9.62-2.04 1-3.37 1-2.59 0-4.79-1.75-5.57-4.09H.92v2.63A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.43 18c-.33-.62-.52-1.3-.52-2s.19-1.38.52-2L2.8 11.4A9.97 9.97 0 0 0 .9 12a10 10 0 0 0 9.1 5.48c2.7 0 4.95-.9 6.6-2.43l-3.24-2.5c-.9.62-2.04 1-3.37 1-2.59 0-4.79-1.75-5.57-4.09L2.8 11.42c1.15-3.42 4.28-5.9 8.2-5.9 2.7 0 4.96.9 6.6 2.43l3.24-2.5A9.97 9.97 0 0 0 12 2a10 10 0 0 0-9.1 5.48L6.43 9.5c.78-2.34 2.98-4.09 5.57-4.09 1.33 0 2.47.38 3.37 1l3.24-2.5A10.04 10.04 0 0 0 12 2C7.02 2 2.8 5.68 1.15 10.3L6.43 12c.78-2.34 2.98-4.09 5.57-4.09 1.33 0 2.47.38 3.37 1l3.24-2.5A10.04 10.04 0 0 0 12 2c-4.98 0-9.2 3.68-10.85 8.3L6.43 12Z" opacity="0.12" />
      <path fill="#EA4335" d="M12 6.91c1.57 0 2.98.54 4.1 1.6l3.04-3.04A9.98 9.98 0 0 0 12 2a10 10 0 0 0-9.1 5.48l3.98 2.72A5.96 5.96 0 0 1 12 6.91Z" />
    </svg>
  );
}

function App() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState('admin@pivot.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!showSignIn || !GOOGLE_CLIENT_ID) {
      return undefined;
    }

    const renderGoogleButton = () => {
      const container = document.getElementById('google-signin-btn');

      if (!container || !window.google?.accounts?.id) {
        return;
      }

      container.innerHTML = '';

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          const payload = decodeJwtPayload(response.credential);

          if (!payload) {
            setError('Google sign-in could not be verified. Please try again.');
            return;
          }

          if (payload.email) {
            setEmail(payload.email);
          }

          setError('');
          setIsLoggedIn(true);
          setShowSignIn(false);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup',
        redirect_uri: GOOGLE_REDIRECT_URI,
      });

      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        type: 'standard',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      });
    };

    const scriptId = 'google-gsi-script';
    const existingScript = document.getElementById(scriptId);

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return undefined;
    }

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      document.body.appendChild(script);
    }

    return undefined;
  }, [showSignIn]);

  const handleLogin = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      setError('');
      setIsLoggedIn(true);
      setShowSignIn(false);
      return;
    }

    setError('Invalid email or password. Try admin@pivot.com / admin123');
  };

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Add VITE_GOOGLE_CLIENT_ID in your frontend .env file to enable Google login.');
      return;
    }

    if (!window.google?.accounts?.id) {
      setError('Google sign-in is still loading. Please try again in a moment.');
      return;
    }

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setError('Google sign-in popup was blocked. Please try again.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-[#0D1117] text-[#24292F] dark:text-[#C9D1D9] font-sans selection:bg-[#336791] selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-[#D0D7DE] dark:border-[#30363D] bg-white dark:bg-[#161B22] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#336791] flex items-center justify-center rounded shadow-sm">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-[#24292F] dark:text-[#C9D1D9]">Pivot_</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-base font-semibold text-[#57606A] dark:text-[#8B949E]">
            <a href="#features" className="hover:text-[#24292F] dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#24292F] dark:hover:text-white transition-colors">Pipeline</a>
            <a href="#pricing" className="hover:text-[#24292F] dark:hover:text-white transition-colors">Documentation</a>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setShowSignIn(true)}
              className="text-base font-semibold text-[#57606A] dark:text-[#8B949E] hover:text-[#24292F] dark:hover:text-white bg-transparent border-none cursor-pointer"
            >
              {isLoggedIn ? 'Dashboard' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => (isLoggedIn ? setIsLoggedIn(false) : setShowSignIn(true))}
              className="bg-[#2DA44E] text-white px-5 py-2.5 rounded-md text-base font-bold shadow-sm hover:bg-[#2C974B] transition-colors border border-[rgba(27,31,36,0.15)]"
            >
              {isLoggedIn ? 'Log out' : 'Get Started'}
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="border-b border-[#D0D7DE] dark:border-[#30363D] bg-white dark:bg-[#0D1117] relative">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e1e4e8_1px,transparent_1px),linear-gradient(to_bottom,#e1e4e8_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#30363d_1px,transparent_1px),linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E48E00]/10 text-[#E48E00] dark:bg-[#E48E00]/10 dark:text-[#E48E00] text-sm font-mono font-bold mb-8 border border-[#E48E00]/30 rounded-md tracking-wider">
                  <Settings2 className="w-4 h-4" />
                  Application v2.0 Released
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-[#24292F] dark:text-[#C9D1D9] leading-tight">
                  <span className="text-[#E48E00]">MySQL</span> to <span className="text-[#336791]">PostgreSQL</span> engine.
                </h1>
                
                <p className="text-xl text-[#57606A] dark:text-[#8B949E] mb-10 leading-relaxed max-w-2xl font-medium">
                  A deterministic, AST-based conversion utility. Translate schemas, map data types, assess constraints, and generate strict PostgreSQL compliant DDL instantly.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-[#336791] text-white px-8 py-4 text-lg font-bold border border-[#1b3b55] hover:bg-[#2b557a] transition-colors flex items-center justify-center gap-3 rounded shadow-sm">
                    Run Migration
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="bg-[#F6F8FA] dark:bg-[#21262D] text-[#24292F] dark:text-[#C9D1D9] px-8 py-4 text-lg font-bold border border-[#D0D7DE] dark:border-[#30363D] hover:bg-[#F3F4F6] dark:hover:bg-[#30363D] transition-colors flex items-center justify-center gap-3 rounded">
                    <Code2 className="w-5 h-5" />
                    Read Documentation
                  </button>
                </div>
              </div>

              {/* GUI Application Block */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden shadow-2xl flex flex-col font-sans">
                {/* Window Header */}
                <div className="flex items-center px-4 py-3 bg-[#0D1117] border-b border-[#30363D]">
                  <div className="flex gap-2 mr-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]"></div>
                  </div>
                  <div className="text-[#8B949E] text-xs font-semibold">Pivot Workspace - schema_migration</div>
                </div>
                {/* App Content */}
                <div className="flex">
                  {/* Sidebar */}
                  <div className="w-48 bg-[#0D1117]/50 border-r border-[#30363D] p-3 hidden sm:block">
                    <div className="text-xs font-bold text-[#57606A] uppercase tracking-wider mb-3">Sources</div>
                    <div className="flex items-center gap-2 text-sm text-[#C9D1D9] bg-[#21262D] p-2 rounded mb-2 border border-[#30363D]">
                      <Database className="w-4 h-4 text-[#E48E00]" /> <span className="truncate">prod_db_mysql</span>
                    </div>
                    <div className="text-xs font-bold text-[#57606A] uppercase tracking-wider mb-3 mt-4">Targets</div>
                    <div className="flex items-center gap-2 text-sm text-[#8B949E] hover:text-[#C9D1D9] p-2 rounded">
                      <Database className="w-4 h-4 text-[#336791]" /> <span className="truncate">new_pg_cluster</span>
                    </div>
                  </div>
                  {/* Main view */}
                  <div className="flex-1 p-6 bg-[#161B22]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-white font-bold text-lg">Migration Status</h3>
                      <span className="bg-[#2DA44E]/20 text-[#3FB950] px-2.5 py-1 rounded-full text-xs font-bold border border-[#2DA44E]/30">Completed</span>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#C9D1D9] font-medium">Translating AST & Mapping Types</span>
                          <span className="text-[#8B949E]">100%</span>
                        </div>
                        <div className="h-2 w-full bg-[#30363D] rounded-full overflow-hidden">
                          <div className="h-full bg-[#336791] w-full"></div>
                        </div>
                      </div>
                      <div className="bg-[#0D1117] border border-[#30363D] rounded-md p-4 font-mono text-sm shadow-inner">
                        <div className="flex items-center gap-3 text-[#3FB950] mb-3">
                          <Check className="w-4 h-4 shrink-0" /> <span>Mapped TINYINT(1) → BOOLEAN</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#3FB950] mb-3">
                          <Check className="w-4 h-4 shrink-0" /> <span>Mapped DATETIME → TIMESTAMP</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#D29922]">
                          <AlertCircle className="w-4 h-4 shrink-0" /> <span>WARN: AUTO_INCREMENT → SERIAL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics/Value Section - Table styling */}
        <section className="py-24 bg-white dark:bg-[#0D1117] border-b border-[#D0D7DE] dark:border-[#30363D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-[#D0D7DE] dark:border-[#30363D] bg-[#F6F8FA] dark:bg-[#161B22] rounded overflow-hidden">
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D0D7DE] dark:divide-[#30363D]">
                <div className="p-10 bg-white dark:bg-[#0D1117]">
                  <div className="flex items-center gap-4 mb-5">
                    <Activity className="w-7 h-7 text-[#E48E00]" />
                    <h3 className="font-bold text-xl text-[#24292F] dark:text-[#C9D1D9]">Performance Constraint</h3>
                  </div>
                  <p className="text-[#57606A] dark:text-[#8B949E] text-lg leading-relaxed">
                    Manual migrations of massive schemas carry significant time overhead. Pivot automates AST conversion, reducing time by 98%.
                  </p>
                </div>
                <div className="p-10 bg-white dark:bg-[#0D1117]">
                  <div className="flex items-center gap-4 mb-5">
                    <AlertCircle className="w-7 h-7 text-[#E48E00]" />
                    <h3 className="font-bold text-xl text-[#24292F] dark:text-[#C9D1D9]">Engine Discrepancies</h3>
                  </div>
                  <p className="text-[#57606A] dark:text-[#8B949E] text-lg leading-relaxed">
                    MySQL-specific index types and zero-dates do not map directly. The engine isolates incompatibilities before staging.
                  </p>
                </div>
                <div className="p-10 bg-white dark:bg-[#0D1117]">
                  <div className="flex items-center gap-4 mb-5">
                    <Table className="w-7 h-7 text-[#E48E00]" />
                    <h3 className="font-bold text-xl text-[#24292F] dark:text-[#C9D1D9]">Data Type Safety</h3>
                  </div>
                  <p className="text-[#57606A] dark:text-[#8B949E] text-lg leading-relaxed">
                    Ensure rigorous data type translation. Maintain strict integrity constraints during transition without losing bindings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Grid/Tabular Layout */}
        <section id="features" className="py-32 bg-[#F6F8FA] dark:bg-[#0F1115]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 border-b border-[#D0D7DE] dark:border-[#30363D] pb-8">
              <h2 className="text-4xl font-extrabold tracking-tight text-[#24292F] dark:text-white">System Capabilities</h2>
              <p className="text-[#57606A] dark:text-[#8B949E] mt-4 font-mono text-base uppercase tracking-widest font-bold">Tooling for database architects</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "AST Parser", icon: FileCode2, desc: "Parses MySQL DDL into an Abstract Syntax Tree for accurate, programmatic translation to PostgreSQL syntax." },
                { title: "Compatibility Report", icon: Search, desc: "Generates an exhaustive audit of unsupported functions, triggers, and storage engine specifics." },
                { title: "Type Mapping", icon: Database, desc: "1-to-1 deterministic mapping of proprietary MySQL types to standard PostgreSQL types." },
                { title: "Schema Diffing", icon: Table, desc: "Tabular side-by-side DDL comparison tool to review exact structural changes before execution." },
                { title: "Artifact Export", icon: Download, desc: "Export compliant .sql files, rollback scripts, and migration audit logs in CSV/PDF format." },
                { title: "Configuration Rules", icon: Settings2, desc: "Define custom translation rules for specific tables, custom enum overrides, and index mapping parameters." }
              ].map((f, i) => (
                <div key={i} className="bg-white dark:bg-[#161B22] border border-[#D0D7DE] dark:border-[#30363D] p-8 rounded-lg shadow-sm hover:border-[#336791] dark:hover:border-[#336791] transition-colors group">
                  <div className="w-12 h-12 bg-[#F6F8FA] dark:bg-[#0D1117] border border-[#D0D7DE] dark:border-[#30363D] rounded flex items-center justify-center mb-6 group-hover:border-[#336791] dark:group-hover:border-[#336791] transition-colors">
                    <f.icon className="w-6 h-6 text-[#336791]" />
                  </div>
                  <h3 className="font-bold text-2xl mb-3 text-[#24292F] dark:text-[#C9D1D9]">{f.title}</h3>
                  <p className="text-[#57606A] dark:text-[#8B949E] text-lg leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Flow - Linear flowchart style */}
        <section id="how-it-works" className="py-32 border-t border-[#D0D7DE] dark:border-[#30363D] bg-white dark:bg-[#0D1117]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 border-b border-[#D0D7DE] dark:border-[#30363D] pb-8">
              <h2 className="text-4xl font-extrabold tracking-tight text-[#24292F] dark:text-white">Execution Pipeline</h2>
              <p className="text-[#57606A] dark:text-[#8B949E] mt-4 font-mono text-base uppercase tracking-widest font-bold">Deterministic workflow</p>
            </div>

            <div className="flex flex-col lg:flex-row border border-[#D0D7DE] dark:border-[#30363D] rounded overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-[#D0D7DE] dark:divide-[#30363D] bg-[#F6F8FA] dark:bg-[#161B22]">
              {[
                { step: "01", title: "Input Config", desc: "Supply MySQL DDL dump or URI." },
                { step: "02", title: "Parsing Engine", desc: "System parses and maps AST." },
                { step: "03", title: "Validation", desc: "Review warnings and flags." },
                { step: "04", title: "Generation", desc: "Deploy PostgreSQL schema to cluster." }
              ].map((item, i) => (
                <div key={i} className="flex-1 p-10 relative bg-white dark:bg-[#0D1117]">
                  <div className="text-5xl font-black text-[#F6F8FA] dark:text-[#21262D] absolute top-6 right-6">{item.step}</div>
                  <h4 className="font-bold text-2xl mb-3 text-[#336791] relative z-10">{item.title}</h4>
                  <p className="text-lg text-[#57606A] dark:text-[#8B949E] relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Diff UI - strict table view resembling GitHub split diff */}
            <div className="mt-16 border border-[#D0D7DE] dark:border-[#30363D] rounded overflow-hidden bg-white dark:bg-[#0D1117] shadow-sm">
              <div className="grid grid-cols-2 bg-[#F6F8FA] dark:bg-[#161B22] border-b border-[#D0D7DE] dark:border-[#30363D] text-sm font-bold uppercase tracking-widest text-[#57606A] dark:text-[#8B949E] divide-x divide-[#D0D7DE] dark:divide-[#30363D]">
                <div className="p-4 pl-6 flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#E48E00]" /> 
                  Source: MySQL
                </div>
                <div className="p-4 pl-6 flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#336791]" /> 
                  Target: PostgreSQL
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[#D0D7DE] dark:divide-[#30363D] font-mono text-base">
                {/* Left Side (MySQL / Deletions) */}
                <div className="bg-[#FFEBE9] dark:bg-[#490202]/30 text-[#24292F] dark:text-[#C9D1D9] overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="hover:bg-[#FFD8D3] dark:hover:bg-[#67060C]/40 transition-colors">
                        <td className="px-4 py-2 text-[#CF222E] dark:text-[#FF7B72] border-r border-[#FF8182]/40 dark:border-[#FF7B72]/20 w-12 text-right opacity-70">1</td>
                        <td className="px-4 py-2">CREATE TABLE users (</td>
                      </tr>
                      <tr className="hover:bg-[#FFD8D3] dark:hover:bg-[#67060C]/40 transition-colors">
                        <td className="px-4 py-2 text-[#CF222E] dark:text-[#FF7B72] border-r border-[#FF8182]/40 dark:border-[#FF7B72]/20 text-right opacity-70">2</td>
                        <td className="px-4 py-2 bg-[#FFC1C0] dark:bg-[#67060C]/60">  id <span className="font-bold">INT(11) NOT NULL AUTO_INCREMENT</span>,</td>
                      </tr>
                      <tr className="hover:bg-[#FFD8D3] dark:hover:bg-[#67060C]/40 transition-colors">
                        <td className="px-4 py-2 text-[#CF222E] dark:text-[#FF7B72] border-r border-[#FF8182]/40 dark:border-[#FF7B72]/20 text-right opacity-70">3</td>
                        <td className="px-4 py-2">  email VARCHAR(255) NOT NULL,</td>
                      </tr>
                      <tr className="hover:bg-[#FFD8D3] dark:hover:bg-[#67060C]/40 transition-colors">
                        <td className="px-4 py-2 text-[#CF222E] dark:text-[#FF7B72] border-r border-[#FF8182]/40 dark:border-[#FF7B72]/20 text-right opacity-70">4</td>
                        <td className="px-4 py-2 bg-[#FFC1C0] dark:bg-[#67060C]/60">  is_active <span className="font-bold">TINYINT(1) DEFAULT 1</span>,</td>
                      </tr>
                      <tr className="hover:bg-[#FFD8D3] dark:hover:bg-[#67060C]/40 transition-colors">
                        <td className="px-4 py-2 text-[#CF222E] dark:text-[#FF7B72] border-r border-[#FF8182]/40 dark:border-[#FF7B72]/20 text-right opacity-70">5</td>
                        <td className="px-4 py-2 bg-[#FFC1C0] dark:bg-[#67060C]/60">  <span className="font-bold">PRIMARY KEY (id)</span></td>
                      </tr>
                      <tr className="hover:bg-[#FFD8D3] dark:hover:bg-[#67060C]/40 transition-colors">
                        <td className="px-4 py-2 text-[#CF222E] dark:text-[#FF7B72] border-r border-[#FF8182]/40 dark:border-[#FF7B72]/20 text-right opacity-70">6</td>
                        <td className="px-4 py-2 bg-[#FFC1C0] dark:bg-[#67060C]/60">) <span className="font-bold">ENGINE=InnoDB;</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Side (PostgreSQL / Additions) */}
                <div className="bg-[#E6FFEC] dark:bg-[#04260F]/30 text-[#24292F] dark:text-[#C9D1D9] overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="hover:bg-[#CCFFD8] dark:hover:bg-[#033A16]/40 transition-colors">
                        <td className="px-4 py-2 text-[#1A7F37] dark:text-[#3FB950] border-r border-[#4AC26B]/40 dark:border-[#3FB950]/20 w-12 text-right opacity-70">1</td>
                        <td className="px-4 py-2">CREATE TABLE users (</td>
                      </tr>
                      <tr className="hover:bg-[#CCFFD8] dark:hover:bg-[#033A16]/40 transition-colors">
                        <td className="px-4 py-2 text-[#1A7F37] dark:text-[#3FB950] border-r border-[#4AC26B]/40 dark:border-[#3FB950]/20 text-right opacity-70">2</td>
                        <td className="px-4 py-2 bg-[#ABF2BC] dark:bg-[#033A16]/60">  id <span className="font-bold">SERIAL PRIMARY KEY</span>,</td>
                      </tr>
                      <tr className="hover:bg-[#CCFFD8] dark:hover:bg-[#033A16]/40 transition-colors">
                        <td className="px-4 py-2 text-[#1A7F37] dark:text-[#3FB950] border-r border-[#4AC26B]/40 dark:border-[#3FB950]/20 text-right opacity-70">3</td>
                        <td className="px-4 py-2">  email VARCHAR(255) NOT NULL,</td>
                      </tr>
                      <tr className="hover:bg-[#CCFFD8] dark:hover:bg-[#033A16]/40 transition-colors">
                        <td className="px-4 py-2 text-[#1A7F37] dark:text-[#3FB950] border-r border-[#4AC26B]/40 dark:border-[#3FB950]/20 text-right opacity-70">4</td>
                        <td className="px-4 py-2 bg-[#ABF2BC] dark:bg-[#033A16]/60">  is_active <span className="font-bold">BOOLEAN DEFAULT TRUE</span></td>
                      </tr>
                      <tr className="hover:bg-[#CCFFD8] dark:hover:bg-[#033A16]/40 transition-colors">
                        <td className="px-4 py-2 text-[#1A7F37] dark:text-[#3FB950] border-r border-[#4AC26B]/40 dark:border-[#3FB950]/20 text-right opacity-70">5</td>
                        <td className="px-4 py-2"></td>
                      </tr>
                      <tr className="hover:bg-[#CCFFD8] dark:hover:bg-[#033A16]/40 transition-colors">
                        <td className="px-4 py-2 text-[#1A7F37] dark:text-[#3FB950] border-r border-[#4AC26B]/40 dark:border-[#3FB950]/20 text-right opacity-70">6</td>
                        <td className="px-4 py-2">);</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-[#24292F] dark:bg-[#010409] text-white border-y border-[#30363D]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Initialize workspace</h2>
            <p className="text-xl text-[#8B949E] mb-12 max-w-3xl mx-auto leading-relaxed">
              Access the enterprise-grade schema translation engine today. Eliminate migration risk and ensure strict PostgreSQL compliance instantly.
            </p>
            <div className="flex justify-center gap-6">
              <button className="bg-[#2DA44E] text-white px-8 py-4 rounded font-bold shadow-sm hover:bg-[#2C974B] transition-colors text-lg">
                Create Free Account
              </button>
              <button className="bg-transparent border border-[#8B949E]/40 text-[#C9D1D9] px-8 py-4 rounded font-bold hover:bg-[#8B949E]/10 transition-colors text-lg">
                View Documentation
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#F6F8FA] dark:bg-[#0D1117] text-[#57606A] dark:text-[#8B949E] py-16 border-t border-[#D0D7DE] dark:border-[#30363D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#336791] flex items-center justify-center rounded-sm">
                <Database className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#24292F] dark:text-[#C9D1D9]">Pivot_</span>
            </div>
            <p className="text-sm leading-relaxed">Deterministic schema translation engine for enterprise applications.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-base mb-6 text-[#24292F] dark:text-[#C9D1D9]">Product</h4>
            <ul className="space-y-4 text-base">
              <li><a href="#" className="hover:text-[#336791] transition-colors">Desktop App</a></li>
              <li><a href="#" className="hover:text-[#336791] transition-colors">Enterprise</a></li>
              <li><a href="#" className="hover:text-[#336791] transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base mb-6 text-[#24292F] dark:text-[#C9D1D9]">Resources</h4>
            <ul className="space-y-4 text-base">
              <li><a href="#" className="hover:text-[#336791] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#336791] transition-colors">MySQL Mapping Guide</a></li>
              <li><a href="#" className="hover:text-[#336791] transition-colors">Releases</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-[#D0D7DE] dark:border-[#30363D] text-sm">
          &copy; 2026 Pivot Engine. All rights reserved.
        </div>
      </footer>

      {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1117]/80 backdrop-blur-sm p-4" onClick={() => setShowSignIn(false)}>
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-[#30363D] bg-[#0D1117] shadow-2xl shadow-black/40" onClick={(event) => event.stopPropagation()}>
            <div className="grid md:grid-cols-2">
              <div className="bg-[#111827] p-8 md:p-10 border-r border-[#30363D]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-[#336791] flex items-center justify-center rounded-md">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-2xl tracking-tight text-white">Pivot_</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E48E00]/30 bg-[#E48E00]/10 text-[#E48E00] text-xs font-bold uppercase tracking-[0.12em] mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  Secure Workspace
                </div>

                <h2 className="text-4xl font-extrabold tracking-tight text-white leading-none mb-4">
                  Sign in to <span className="text-[#336791]">access your migration desk</span>
                </h2>

                <p className="text-[#8B949E] text-lg leading-relaxed mb-8">
                  Turn database migration into a clean, secure workflow with automated schema checks and review-ready outputs.
                </p>

                <ul className="space-y-4 text-white">
                  <li className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#336791]/15 text-[#7CC5FF]"><Check className="w-3.5 h-3.5" /></span>Schema validation and type mapping</li>
                  <li className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#336791]/15 text-[#7CC5FF]"><Check className="w-3.5 h-3.5" /></span>Team review and migration tracking</li>
                  <li className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#336791]/15 text-[#7CC5FF]"><Check className="w-3.5 h-3.5" /></span>Deployment-ready PostgreSQL outputs</li>
                </ul>
              </div>

              <div className="bg-[#161B22] p-8 md:p-10">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B949E] mb-2">Welcome back</p>
                    <h3 className="text-3xl font-extrabold tracking-tight text-white">Sign in</h3>
                  </div>
                  <button type="button" onClick={() => setShowSignIn(false)} className="text-sm font-semibold text-[#7CC5FF] bg-transparent border-none cursor-pointer">
                    Back home
                  </button>
                </div>

                {GOOGLE_CLIENT_ID ? (
                  <div className="mb-5 w-full">
                    <div id="google-signin-btn" className="w-full" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleClick}
                    className="w-full mb-5 flex items-center justify-center gap-3 rounded-md border border-[#D0D7DE] bg-white px-4 py-3 text-base font-semibold text-[#24292F] hover:bg-[#F6F8FA] transition-colors"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <GoogleBrandIcon />
                    </span>
                    Continue with Google
                  </button>
                )}

                <div className="relative my-5 text-center text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#8B949E]">
                  <span className="relative z-10 bg-[#161B22] px-3">or continue with email</span>
                  <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#30363D]"></span>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <label className="block text-sm font-semibold text-white">
                    <span className="mb-2 block">Email address</span>
                    <div className="flex items-center gap-3 rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-3 text-[#8B949E] focus-within:border-[#336791] focus-within:ring-2 focus-within:ring-[#336791]/30">
                      <Mail className="w-4 h-4" />
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="admin@pivot.com"
                        className="w-full bg-transparent text-white placeholder:text-[#8B949E] outline-none"
                      />
                    </div>
                  </label>

                  <label className="block text-sm font-semibold text-white">
                    <span className="mb-2 block">Password</span>
                    <div className="flex items-center gap-3 rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-3 text-[#8B949E] focus-within:border-[#336791] focus-within:ring-2 focus-within:ring-[#336791]/30">
                      <Lock className="w-4 h-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-transparent text-white placeholder:text-[#8B949E] outline-none"
                      />
                      <button type="button" onClick={() => setShowPassword((value) => !value)} className="bg-transparent border-none text-[#8B949E] p-0 cursor-pointer">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </label>

                  <div className="flex items-center justify-between gap-3 text-sm text-[#8B949E]">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#336791]" />
                      Remember me
                    </label>
                    <button type="button" className="bg-transparent border-none text-[#7CC5FF] font-semibold cursor-pointer">
                      Forgot password?
                    </button>
                  </div>

                  {error && <div className="rounded-md border border-[#F85149]/30 bg-[#F85149]/10 px-3 py-2 text-sm text-[#FFB3AD]">{error}</div>}

                  <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-md border border-[#2DA44E] bg-[#2DA44E] px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-[#2C974B]">
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-6 rounded-md border border-[#30363D] bg-[#0D1117] px-4 py-3 text-center text-sm text-[#C9D1D9]">
                  Demo login: <strong className="text-white">admin@pivot.com</strong> / <strong className="text-white">admin123</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  ArrowRight,
  ShieldCheck,
  Code2,
  Table,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Copy,
  Check,
  Sparkles,
  Terminal,
  Activity,
  Layers,
  Flame,
  Search,
  ExternalLink,
  Bot,
  Sliders,
  FileDown,
  UserCheck,
  TrendingDown,
  XCircle,
  UploadCloud,
  Cpu,
  FileDiff,
  FileText,
} from 'lucide-react';
import SchemaBackground from '../components/common/SchemaBackground';
import Button from '../components/common/Button';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mockupTab, setMockupTab] = useState('diff'); // 'diff' | 'risk'
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#070b14] text-slate-100 overflow-hidden font-sans">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION (Dark Base: #070b14) */}
      {/* ========================================================================= */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 border-b border-slate-800/80 bg-[#070b14]">
        <SchemaBackground variant="hero" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14">
            {/* Scope Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-mono mb-7 shadow-[0_0_15px_rgba(245,158,11,0.08)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Dedicated DDL Engine: MySQL 8.0 → PostgreSQL 16</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-semibold">Schema-Only Migration</span>
            </div>

            {/* Display Headline with Clear Schema Migration Focus & Subordinate Second Line */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.12] mb-6">
              MySQL to PostgreSQL Schema Migration
              <span className="block font-sans text-xl sm:text-2xl md:text-3xl font-normal text-slate-300 mt-3 sm:mt-4 tracking-tight">
                without the post-cutover <span className="text-[#ea580c] font-semibold">disaster</span>.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed font-normal mb-8">
              Pure schema and DDL conversion — zero row data risk. Pivot translates your tables,
              data types, indexes, and constraints deterministically, explains unsupported dialect features,
              and scores cutover risk upfront.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button
                variant="amber"
                size="lg"
                iconRight={ArrowRight}
                onClick={() => navigate('/upload')}
                className="w-full sm:w-auto text-sm sm:text-base px-7 py-3"
              >
                Upload Schema Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={Code2}
                onClick={() => navigate('/review')}
                className="w-full sm:w-auto text-sm sm:text-base px-6 py-3"
              >
                Inspect Schema Diff
              </Button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STATS ROW (REPORT-ALIGNED CLAIMS ONLY) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-14">
            <div className="p-5 rounded-xl bg-slate-900/85 border border-slate-800 text-center shadow-lg shadow-black/40 relative group">
              <div className="font-mono text-3xl sm:text-4xl font-bold text-slate-100 mb-1">
                Target: X%
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Auto-resolved
              </p>
              <span className="text-[11px] text-slate-500 block mt-1">
                Target conversion objective
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/85 border border-slate-800 text-center shadow-lg shadow-black/40 relative group">
              <div className="font-mono text-3xl sm:text-4xl font-bold text-amber-400 mb-1">
                Target: X%
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Risk accuracy
              </p>
              <span className="text-[11px] text-slate-500 block mt-1">
                ML complexity verification
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/85 border border-slate-800 text-center shadow-lg shadow-black/40 relative group">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-indigo-300 mb-1">
                1 DB pair
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
                MySQL → Postgres
              </p>
              <span className="text-[11px] text-slate-500 block mt-1">
                Deep, dialect-specific focus
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/85 border border-slate-800 text-center shadow-lg shadow-black/40 relative group">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">
                Schema-only
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
                No row data touched
              </p>
              <span className="text-[11px] text-slate-500 block mt-1">
                Zero data extraction or ETL risk
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* FLOATING PRODUCT MOCKUP PANEL WITH SOFT ACCENT GLOW */}
          {/* ========================================================================= */}
          <div className="relative max-w-5xl mx-auto">
            {/* Subtle floating glow behind panel */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-indigo-500/10 blur-xl opacity-80 -z-10" />

            <div className="rounded-xl bg-[#0b1120] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-md">
              {/* Mockup Header Bar */}
              <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-[#060913] border-b border-slate-800 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="ml-3 font-mono text-xs text-slate-400">
                    pivot://project/ecom_storefront_mysql
                  </span>
                </div>

                {/* Mockup Tab Switcher */}
                <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMockupTab('diff')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      mockupTab === 'diff'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Schema Diff Viewer
                  </button>
                  <button
                    type="button"
                    onClick={() => setMockupTab('risk')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      mockupTab === 'risk'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ML Complexity & Effort
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <RiskBadge score={28} tier="Low" size="sm" />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Copy DDL"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Mockup Body Content */}
              {mockupTab === 'diff' ? (
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-mono text-xs">
                  {/* Left: MySQL Source */}
                  <div className="p-5 bg-slate-950/60 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider">
                        <Database className="w-3.5 h-3.5" /> Source: MySQL 8.0
                      </span>
                      <span className="text-[11px] text-rose-400 font-medium">4 non-standard constructs</span>
                    </div>

                    <div className="space-y-1 text-slate-300 overflow-x-auto pt-1">
                      <p className="text-slate-500">1  CREATE TABLE users (</p>
                      <p className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded border border-rose-900/50">
                        2    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
                      </p>
                      <p className="text-slate-400">3    uuid VARCHAR(36) NOT NULL,</p>
                      <p className="text-slate-400">4    email VARCHAR(255) NOT NULL UNIQUE,</p>
                      <p className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded border border-rose-900/50">
                        5    role ENUM('customer', 'vendor', 'support') DEFAULT 'customer',
                      </p>
                      <p className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded border border-rose-900/50">
                        6    is_active TINYINT(1) NOT NULL DEFAULT 1,
                      </p>
                      <p className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded border border-rose-900/50">
                        7    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
                      </p>
                      <p className="text-slate-400">8    PRIMARY KEY (id)</p>
                      <p className="text-slate-500">9  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;</p>
                    </div>
                  </div>

                  {/* Right: PostgreSQL Target */}
                  <div className="p-5 bg-slate-950/60 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-indigo-400 uppercase tracking-wider">
                        <Database className="w-3.5 h-3.5" /> Target: PostgreSQL 16
                      </span>
                      <span className="text-[11px] text-emerald-400 font-medium">Standards Compliant</span>
                    </div>

                    <div className="space-y-1 text-slate-300 overflow-x-auto pt-1">
                      <p className="text-slate-500 italic">-- 1. Standalone Enum</p>
                      <p className="bg-emerald-950/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                        CREATE TYPE user_role_enum AS ENUM ('customer', 'vendor', 'support');
                      </p>
                      <p className="text-slate-500">CREATE TABLE users (</p>
                      <p className="bg-emerald-950/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                        &nbsp;&nbsp;id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                      </p>
                      <p className="bg-emerald-950/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                        &nbsp;&nbsp;uuid UUID NOT NULL DEFAULT gen_random_uuid(),
                      </p>
                      <p className="text-slate-400">&nbsp;&nbsp;email VARCHAR(255) NOT NULL UNIQUE,</p>
                      <p className="bg-emerald-950/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                        &nbsp;&nbsp;role user_role_enum NOT NULL DEFAULT 'customer',
                      </p>
                      <p className="bg-emerald-950/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                        &nbsp;&nbsp;is_active BOOLEAN NOT NULL DEFAULT TRUE,
                      </p>
                      <p className="bg-emerald-950/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                        &nbsp;&nbsp;updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                      </p>
                      <p className="text-slate-500">);</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Mockup ML Prediction & Effort View */
                <div className="p-7 bg-[#080d1a] space-y-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-slate-950/90 border border-slate-800">
                      <span className="text-xs text-slate-400 font-mono uppercase">ML Predicted Risk</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-extrabold text-emerald-400 font-mono">28</span>
                        <span className="text-slate-500 text-sm font-mono">/ 100</span>
                      </div>
                      <p className="text-xs text-emerald-400 mt-1">Tier: Low Cutover Risk</p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950/90 border border-slate-800">
                      <span className="text-xs text-slate-400 font-mono uppercase">Estimated Effort</span>
                      <div className="text-2xl font-bold text-slate-100 mt-2 font-mono">~2.5 hours</div>
                      <p className="text-xs text-slate-400 mt-1">Review & dry-run validation time</p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950/90 border border-slate-800">
                      <span className="text-xs text-slate-400 font-mono uppercase">Success Probability</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-extrabold text-amber-400 font-mono">94%</span>
                        <span className="text-slate-400 text-xs font-mono">predicted</span>
                      </div>
                      <p className="text-xs text-amber-400 mt-1">High confidence AST mapping</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-950/90 border border-slate-800 flex items-start gap-4">
                    <Bot className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <h4 className="font-semibold text-slate-200 mb-1">
                        AI Migration Assistant Note: `audit_logs.recorded_at`
                      </h4>
                      <p className="text-slate-400 leading-relaxed text-xs">
                        PostgreSQL rejects '0000-00-00 00:00:00' as invalid calendar timestamps. Rule-based
                        engine substituted `DEFAULT NOW()` and logged the transformation for review.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mockup Footer */}
              <div className="flex items-center justify-between px-5 py-3 bg-[#060913] border-t border-slate-800 text-xs text-slate-400">
                <span className="font-mono">
                  Schema: 4 tables • SQLGlot Canonical AST Parsed
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/review')}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  View full migration review <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: THE PROBLEM (Distinct Dark Shade: #0f182e / Charcoal) */}
      {/* ========================================================================= */}
      <section className="relative py-24 bg-[#0e1628] border-b border-slate-800/80 overflow-hidden">
        {/* Subtle background texture on outer section only: 12% opacity, soft-edged */}
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.12] [filter:blur(0.3px)] pointer-events-none select-none z-0" aria-hidden="true" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-rose-500/4 rounded-full blur-[140px] pointer-events-none select-none z-0" aria-hidden="true" />

        {/* Distinct Background Motifs for Section 2: Schema Failure & Drift Diagnostic Tokens (14% opacity) */}
        <div className="absolute inset-0 font-mono text-[10px] md:text-xs select-none opacity-[0.14] text-slate-400 [filter:blur(0.4px)] pointer-events-none z-0" aria-hidden="true">
          {/* Left Flank */}
          <span className="absolute top-16 left-4 sm:left-8 text-rose-400/80">
            [ERR_TYPE_MISMATCH: MySQL enum → Pg text]
          </span>
          <span className="absolute top-26 left-6 sm:left-12 text-slate-500">
            ALTER TABLE DROP CONSTRAINT fk_tsb_core;
          </span>
          <span className="absolute top-[260px] left-4 sm:left-8 text-amber-400/80">
            INDEX_NOT_CARRIED: gitlab#5681
          </span>
          <span className="absolute top-[340px] left-6 sm:left-12 text-slate-500">
            FOREIGN KEY (account_id) REFERENCES users(id) FAIL
          </span>
          <span className="absolute top-[420px] left-4 sm:left-8 text-rose-400/80">
            CRITICAL: 5.2M customers impacted (£330M)
          </span>

          {/* Right Flank */}
          <span className="absolute top-16 right-4 sm:right-8 text-rose-400/80">
            FAIL_RATE: 70% [RudderStack Survey]
          </span>
          <span className="absolute top-26 right-6 sm:right-12 text-slate-500">
            DRIFT: silent_data_truncation (TINYINT)
          </span>
          <span className="absolute top-[260px] right-4 sm:right-8 text-amber-400/80">
            COLLISION: duplicate_key_err on cutover
          </span>
          <span className="absolute top-[340px] right-6 sm:right-12 text-slate-500">
            UNHANDLED_ENGINE: MyISAM non-transactional
          </span>
          <span className="absolute top-[420px] right-4 sm:right-8 text-slate-500">
            POST_CUTOVER_INCIDENT_SEV_1
          </span>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Headline */}
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3 block">
              The Reality of Schema Conversion
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Migrations fail more often than teams admit.
            </h2>
          </div>

          {/* Real Failure Case Study: TSB Bank */}
          <div className="p-8 sm:p-10 rounded-xl bg-[#090e1b] border border-slate-800 shadow-2xl mb-8 relative">
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-6 font-normal relative z-10">
              In April 2018, TSB Bank migrated its core banking systems to a new platform. The data
              migration itself succeeded — but the new platform immediately experienced technical
              failures, disrupting branch, telephone, online, and mobile banking. A significant
              proportion of TSB's 5.2 million customers were affected, and it took until December 2018
              for the bank to return to normal operations. The total cost, including compensation,
              remediation, and lost business, reached roughly <strong className="text-white font-bold">£330 million</strong>. The migration
              wasn't the failure — what came after cutover was.{' '}
              <a
                href="https://brokeninfra.tech/tsb-migration-disaster/"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 underline font-medium inline-flex items-center gap-1"
              >
                [Broken Infra Pages] <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </p>

            {/* Stat Callout (smaller text under paragraph) */}
            <div className="pt-5 border-t border-slate-800/90 flex items-start sm:items-center gap-3 text-xs sm:text-sm text-slate-400 relative z-10">
              <TrendingDown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <p>
                <strong className="text-slate-200">Schema mismatches</strong> — mismatched field names,
                data types, and relationships between source and target — are one of the most common causes
                of migration failure, affecting <strong className="text-amber-300">up to 70% of migration projects</strong> according
                to industry surveys.{' '}
                <a
                  href="https://www.rudderstack.com/blog/data-migration-challenges/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  [RudderStack]
                </a>
              </p>
            </div>
          </div>

          {/* POV Card: Horizontal (GitLab Issue #5681) */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#090e1b] border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xl">
            <div className="w-12 h-12 rounded-lg bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Terminal className="w-6 h-6" />
            </div>

            <div className="flex-1 text-sm text-slate-300 leading-relaxed">
              <p className="mb-2 italic text-slate-200">
                “When GitLab migrated from MySQL to PostgreSQL, one specific problem surfaced in
                production: index names didn't carry over correctly during the migration, and the team had
                to write custom tooling (migra) to diff the migrated schema against the original just to
                catch it.”
              </p>
              <div className="text-xs font-mono text-slate-400 flex flex-wrap items-center gap-1.5">
                <span>— GitLab, public issue tracker,</span>
                <span className="text-slate-300">"Migration from MySQL to PostgreSQL doesn't change index names"</span>
                <a
                  href="https://gitlab.com/gitlab-org/gitlab/-/issues/5681"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline inline-flex items-center gap-0.5"
                >
                  (gitlab.com/gitlab-org/gitlab/-/issues/5681) <ExternalLink className="w-3 h-3" />
                </a>
                <span>— filed 2018, publicly visible since.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: DARK FULL-BLEED MECHANICAL CIRCUIT ROW (Deep Obsidian: #040710) */}
      {/* ========================================================================= */}
      <section className="relative py-16 md:py-20 bg-[#040710] border-b border-slate-800 overflow-hidden">
        {/* Faint ghosted ER diagram / table outline line-art in background (14% opacity, soft-edged) */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.14] [filter:blur(0.5px)] z-0" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none">
            <rect x="60" y="30" width="180" height="90" rx="6" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60" y1="56" x2="240" y2="56" stroke="#334155" strokeWidth="1" />
            <rect x="520" y="60" width="190" height="100" rx="6" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="520" y1="86" x2="710" y2="86" stroke="#334155" strokeWidth="1" />
            <rect x="1100" y="40" width="180" height="90" rx="6" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="1100" y1="66" x2="1280" y2="66" stroke="#334155" strokeWidth="1" />
            <path d="M 240 75 C 380 75, 420 110, 520 110" stroke="#334155" strokeWidth="1" fill="none" />
            <path d="M 710 110 C 900 110, 950 85, 1100 85" stroke="#334155" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Distinct Background Motifs for Section 3: AST Canonical Compiler Pipeline (14% opacity) */}
        <div className="absolute inset-0 font-mono text-[10px] md:text-xs select-none opacity-[0.14] text-slate-400 [filter:blur(0.4px)] pointer-events-none z-0" aria-hidden="true">
          <span className="absolute top-4 left-4 sm:left-8 text-amber-400/80">
            SQLGlot::ParseTree(dialect="mysql")
          </span>
          <span className="absolute top-10 left-6 sm:left-14 text-slate-500">
            AST::CreateStatement -&gt; CanonicalSchemaAST
          </span>
          <span className="absolute bottom-4 left-4 sm:left-8 text-indigo-400/80">
            RuleEngine::ApplyMapping(table="*")
          </span>

          <span className="absolute top-4 right-4 sm:right-8 text-indigo-400/80">
            MLPredictor::EvaluateDepth(ast_tree)
          </span>
          <span className="absolute top-10 right-6 sm:right-14 text-slate-500">
            Pg16Generator::EmitDDL(strict=True)
          </span>
          <span className="absolute bottom-4 right-4 sm:right-8 text-emerald-400/80">
            VerificationPass::AuditLevel=0
          </span>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Compact Section Intro */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-10 pb-4 border-b border-slate-900">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold block mb-1">
                Execution Pipeline
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Deterministic 4-Stage Trace
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-500">
              AST Canonical • Rule-Driven • ML-Scored
            </span>
          </div>

          {/* The Connected Nodes Row */}
          <div className="relative">
            {/* Literal Connecting Line / Dashed Circuit Trace behind nodes on desktop */}
            <div className="hidden lg:block absolute top-[36px] left-[10%] right-[10%] h-[2px] -z-0">
              <div className="w-full h-full border-t-2 border-dashed border-slate-700 relative">
                {/* Circuit pad markers */}
                <span className="absolute left-[28%] -top-[5px] w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600" />
                <span className="absolute left-[62%] -top-[5px] w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600" />
              </div>
            </div>

            {/* 4 Connected Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative z-10">
              {[
                {
                  num: '01',
                  title: 'Upload',
                  desc: 'Ingest MySQL DDL dump',
                  icon: UploadCloud,
                  activeBorder: 'border-slate-700 hover:border-amber-400/60',
                  iconColor: 'text-amber-400',
                  glow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
                },
                {
                  num: '02',
                  title: 'Convert',
                  desc: 'Deterministic rule mapping',
                  icon: Cpu,
                  activeBorder: 'border-slate-700 hover:border-indigo-400/60',
                  iconColor: 'text-indigo-400',
                  glow: 'hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]',
                },
                {
                  num: '03',
                  title: 'Predict Risk',
                  desc: 'ML effort & complexity score',
                  icon: Activity,
                  activeBorder: 'border-slate-700 hover:border-amber-400/60',
                  iconColor: 'text-amber-400',
                  glow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
                },
                {
                  num: '04',
                  title: 'Review Diff',
                  desc: 'Side-by-side AST comparison',
                  icon: FileDiff,
                  activeBorder: 'border-slate-700 hover:border-emerald-400/60',
                  iconColor: 'text-emerald-400',
                  glow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
                },
              ].map((node, idx) => (
                <div key={idx} className="flex flex-col items-start lg:items-center text-left lg:text-center group">
                  {/* Elevated Circular/Hexagonal Node with subtle glow */}
                  <div className="flex items-center gap-3 lg:flex-col lg:gap-0">
                    <div
                      className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#0b1222] border ${node.activeBorder} ${node.glow} flex items-center justify-center shadow-[0_6px_25px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:scale-105 relative`}
                    >
                      <node.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${node.iconColor} stroke-[1.5]`} />
                    </div>

                    {/* Step number in Monospace font, uppercase, letter-spaced */}
                    <span className="font-mono text-xs font-bold tracking-widest text-slate-400 group-hover:text-amber-400 transition-colors lg:mt-3">
                      {node.num}
                    </span>
                  </div>

                  {/* Step Title in bold sans-serif, compact */}
                  <h4 className="font-sans font-bold text-base text-white mt-1.5 sm:mt-2">
                    {node.title}
                  </h4>

                  {/* Short muted single-line fragment description */}
                  <p className="font-sans text-xs text-slate-400 mt-0.5 whitespace-normal lg:whitespace-nowrap">
                    {node.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION 4: FEATURES — TERMINAL-LOG STYLE (Charcoal: #0a101f, slightly lighter than Section 3) */}
      {/* ========================================================================= */}
      <section className="relative py-24 md:py-28 bg-[#0a101f] border-b border-slate-800/90 overflow-hidden">
        {/* Layered Background Glows in outer section only (3-5% opacity, soft ambient blur) */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[140px] pointer-events-none select-none z-0" aria-hidden="true" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[500px] rounded-full bg-amber-500/4 blur-[150px] pointer-events-none select-none z-0" aria-hidden="true" />

        {/* Distinct Background Motifs for Section 4: CLI Engine Flags & Runtime Configs (14% opacity) */}
        <div className="absolute inset-0 font-mono text-[10px] md:text-xs select-none opacity-[0.14] text-slate-400 [filter:blur(0.4px)] pointer-events-none z-0" aria-hidden="true">
          {/* Left Flank */}
          <span className="absolute top-16 left-4 sm:left-10 text-amber-400/80">
            $ pivot --dialect-source=mysql8.0
          </span>
          <span className="absolute top-26 left-6 sm:left-14 text-indigo-400/80">
            $ pivot --dialect-target=postgres16
          </span>
          <span className="absolute top-[280px] left-4 sm:left-8 text-slate-500">
            --strict-syntax-validation=true
          </span>
          <span className="absolute top-[360px] left-6 sm:left-12 text-slate-500">
            PIVOT_ADMIN_RULES_DIR=/etc/pivot/rules.d
          </span>
          <span className="absolute top-[440px] left-4 sm:left-10 text-slate-500">
            PIVOT_ENV=production • AST_CACHE=1
          </span>

          {/* Right Flank */}
          <span className="absolute top-16 right-4 sm:right-10 text-slate-400">
            AST_NODES_PROCESSED: 24,180
          </span>
          <span className="absolute top-26 right-6 sm:right-14 text-amber-400/80">
            TRANSFORM_RULES_LOADED: 142
          </span>
          <span className="absolute top-[280px] right-4 sm:right-8 text-emerald-400/80">
            ML_RISK_CONFIDENCE: 94.2%
          </span>
          <span className="absolute top-[360px] right-6 sm:right-12 text-indigo-400/80">
            ROLLBACK_SCRIPT_GENERATED: true
          </span>
          <span className="absolute top-[440px] right-4 sm:right-10 text-slate-500">
            TARGET_VERSION: PostgreSQL 16.2
          </span>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="max-w-3xl mb-12 text-center mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase mb-3.5 shadow-sm">
              Core Capabilities
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-3">
              Deterministic tooling designed for zero guesswork.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Every subsystem executes verified schema conversion, risk verification, and developer handoff.
            </p>
          </div>

          {/* Terminal-Window Frame */}
          <div className="rounded-2xl bg-[#060a14]/95 border border-slate-700/70 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden backdrop-blur-md">
            {/* macOS-Style Window Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#0b1120] border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/70" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/70" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/70" />
                <span className="ml-3 font-mono text-xs text-slate-400">
                  pivot-cli v2.4 — bash — 84x28
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">engine: ready</span>
              </div>
            </div>

            {/* Terminal Body: Sequential Output */}
            <div className="p-6 sm:p-10 font-mono space-y-6 sm:space-y-7">
              {/* Command Prompt Line */}
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold pb-2 border-b border-slate-800/80 text-slate-200">
                <span className="text-amber-400 select-none">$</span>
                <span className="text-slate-100">pivot --features</span>
              </div>

              {/* 6 Sequential Features with checkmark, bold feature name, indented single muted description line */}
              {[
                {
                  name: 'Rule-Based Engine',
                  desc: 'Converts types, keys, and constraints using admin-editable mapping rules.',
                },
                {
                  name: 'AI Migration Assistant',
                  desc: 'Flags unsupported features and explains every decision in plain language.',
                },
                {
                  name: 'ML Risk Predictor',
                  desc: 'Scores complexity, estimates effort, and predicts migration success.',
                },
                {
                  name: 'Schema Diff Viewer',
                  desc: 'Compares source and converted schema side by side before you commit.',
                },
                {
                  name: 'Dashboard & Reports',
                  desc: 'Download the migration SQL and a full PDF summary in one place.',
                },
                {
                  name: 'Role-Based Access',
                  desc: 'Separate user and admin permissions, with admin-only rule management.',
                },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="animate-terminal-reveal pl-1"
                  style={{
                    animationDelay: `${idx * 0.12 + 0.1}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className="flex items-baseline gap-2.5 font-bold text-slate-100 text-sm sm:text-base">
                    <span className="text-amber-400 font-bold select-none text-base">✓</span>
                    <span className="tracking-tight text-white hover:text-amber-300 transition-colors">
                      {feat.name}
                    </span>
                  </div>
                  <div className="pl-6 sm:pl-7 text-xs sm:text-sm text-slate-400 font-normal leading-relaxed mt-1">
                    {feat.desc}
                  </div>
                </div>
              ))}

              {/* Terminal Bottom Prompt Cursor */}
              <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">$</span>
                  <span className="w-2 h-4 bg-amber-400 animate-pulse inline-block align-middle" />
                </div>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Status: 6/6 subsystems active • 0 unhandled dialect exceptions
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: HOW WE ARE DIFFERENT FROM OTHERS (Graphite Dark: #060a14) */}
      {/* ========================================================================= */}
      <section className="relative py-24 bg-[#060a14] border-b border-slate-800/80 overflow-hidden">
        {/* Distinct Background Motifs for Section 5: Naive Regex Failures vs Canonical AST Decisions (14% opacity) */}
        <div className="absolute inset-0 font-mono text-[10px] md:text-xs select-none opacity-[0.14] text-slate-400 [filter:blur(0.4px)] pointer-events-none z-0" aria-hidden="true">
          {/* Left Flank: Naive regex syntax crashes */}
          <span className="absolute top-16 left-4 sm:left-10 text-rose-400/80">
            - s/AUTO_INCREMENT/SERIAL/g (breaks)
          </span>
          <span className="absolute top-26 left-6 sm:left-14 text-rose-400/70">
            - s/DATETIME/TIMESTAMP/g (tz lost)
          </span>
          <span className="absolute top-[260px] left-4 sm:left-8 text-slate-500">
            - sed: illegal byte sequence in utf8mb4
          </span>
          <span className="absolute top-[340px] left-6 sm:left-12 text-slate-500">
            - regex fail: multiline trigger syntax
          </span>
          <span className="absolute top-[420px] left-4 sm:left-10 text-rose-400/80">
            - AI Chatbot: hallucinated datatype INT_8
          </span>

          {/* Right Flank: Canonical AST Transpilation rules */}
          <span className="absolute top-16 right-4 sm:right-10 text-emerald-400/80">
            + CREATE TABLE -&gt; pg_catalog.pg_class
          </span>
          <span className="absolute top-26 right-6 sm:right-14 text-emerald-400/70">
            + IDENTITY ALWAYS -&gt; pg_sequence
          </span>
          <span className="absolute top-[260px] right-4 sm:right-8 text-indigo-400/80">
            + gin_trgm_ops -&gt; pg_am indexing
          </span>
          <span className="absolute top-[340px] right-6 sm:right-12 text-slate-500">
            + AST_TRANSPILE_STRICT_SAFE=true
          </span>
          <span className="absolute top-[420px] right-4 sm:right-10 text-emerald-400/80">
            + DETERMINISTIC_AUDIT_LOG_WRITTEN
          </span>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2 block">
              Architectural Difference
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              How Pivot is different from scripts and generic AI.
            </h2>
            <p className="text-slate-400 text-base mt-2">
              Why relying on naive regex find-and-replace or unstructured LLM prompts falls short for database schemas.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0d1424] text-xs font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Capability</th>
                    <th className="py-3.5 px-6 text-slate-400">Manual Scripts / sed</th>
                    <th className="py-3.5 px-6 text-slate-400">Generic AI Chatbot</th>
                    <th className="py-3.5 px-6 text-amber-400 font-bold bg-slate-900">Pivot Engine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs sm:text-sm">
                  <tr className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-200">
                      Parsing Mechanism
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      Regex replacement (breaks on quotes, multiline definitions)
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      Unstructured text generation (hallucinates types)
                    </td>
                    <td className="py-3.5 px-6 text-emerald-300 font-medium bg-slate-900/40">
                      SQLGlot canonical AST syntax tree parsing
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-200">
                      Upfront Risk & Effort Prediction
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      <span className="inline-flex items-center gap-1 text-rose-400 font-mono">
                        <XCircle className="w-3.5 h-3.5" /> None
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      High-level conversational guesses
                    </td>
                    <td className="py-3.5 px-6 text-emerald-300 font-medium bg-slate-900/40">
                      ML model: risk score + estimated effort + success probability
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-200">
                      Decision Logging & Mapping
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      Silent replacements without an audit trail
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      Opaque reasoning, non-reproducible outputs
                    </td>
                    <td className="py-3.5 px-6 text-emerald-300 font-medium bg-slate-900/40">
                      Deterministic rule engine logs every conversion decision
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-200">
                      Admin Rule Customization
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      Hardcoded shell scripts
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      Prompt engineering required per table
                    </td>
                    <td className="py-3.5 px-6 text-emerald-300 font-medium bg-slate-900/40">
                      Admin role can configure and edit mapping rules
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-200">
                      Scope Guarantee
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      Ad-hoc script scope
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      Unbounded, potential schema leakage
                    </td>
                    <td className="py-3.5 px-6 text-emerald-300 font-medium bg-slate-900/40">
                      Schema-only: no row data touched
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: FINAL CTA (Obsidian with Amber Ambient Wash: #0a0f20) */}
      {/* ========================================================================= */}
      <section className="relative py-24 bg-[#0a0f20] overflow-hidden">
        {/* Distinct Background Motifs for Section 6: Cutover Transaction Barrier (14% opacity) */}
        <div className="absolute inset-0 font-mono text-[10px] md:text-xs select-none opacity-[0.14] text-slate-400 [filter:blur(0.4px)] pointer-events-none z-0" aria-hidden="true">
          {/* Left Flank */}
          <span className="absolute top-16 left-4 sm:left-10 text-indigo-400/80">
            BEGIN; -- strict cutover boundary
          </span>
          <span className="absolute top-26 left-6 sm:left-14 text-slate-500">
            SET CONSTRAINTS ALL DEFERRED;
          </span>
          <span className="absolute top-36 left-4 sm:left-10 text-slate-500">
            SET lock_timeout = '15s';
          </span>
          <span className="absolute bottom-16 left-6 sm:left-12 text-amber-400/80">
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
          </span>

          {/* Right Flank */}
          <span className="absolute top-16 right-4 sm:right-10 text-emerald-400/80">
            ANALYZE VERIFY ALL TABLES;
          </span>
          <span className="absolute top-26 right-6 sm:right-14 text-emerald-400/80">
            COMMIT; -- schema cutover certified
          </span>
          <span className="absolute top-36 right-4 sm:right-10 text-slate-500">
            [STATUS: ZERO_ERRORS_DETECTED]
          </span>
          <span className="absolute bottom-16 right-6 sm:right-12 text-indigo-400/80">
            PG_DUMP_VERIFIED: PostgreSQL 16.2
          </span>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            Eliminate migration panic before your next cutover.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Inspect your tables, verify types, score risk upfront, and download certified PostgreSQL
            scripts and PDF reports in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="amber"
              size="lg"
              iconRight={ArrowRight}
              onClick={() => navigate('/upload')}
              className="w-full sm:w-auto px-7 py-3 text-sm sm:text-base"
            >
              Upload Schema Now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-7 py-3 text-sm sm:text-base"
            >
              Open Workspace Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

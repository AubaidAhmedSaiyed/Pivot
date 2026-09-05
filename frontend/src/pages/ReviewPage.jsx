import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Copy,
  Check,
  Download,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Code2,
  CheckCircle2,
  Info,
  Sparkles,
  ExternalLink,
  Activity,
} from 'lucide-react';
import SchemaBackground from '../components/common/SchemaBackground';
import Button from '../components/common/Button';
import CardContainer from '../components/common/CardContainer';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';
import { SCHEMA_DIFF_TABLES, UNRESOLVED_OBJECTS, GENERATED_PG_SQL } from '../data/mockData';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [activeTable, setActiveTable] = useState('users');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [expandedObject, setExpandedObject] = useState('unresolved-1');
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  const currentDiff = SCHEMA_DIFF_TABLES[activeTable] || SCHEMA_DIFF_TABLES.users;

  const filteredUnresolved = UNRESOLVED_OBJECTS.filter(
    (item) => severityFilter === 'All' || item.severity === severityFilter
  );

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([GENERATED_PG_SQL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pivot_postgres_migration.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 pb-28 overflow-hidden">
      <SchemaBackground variant="review" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        {/* ========================================================================= */}
        {/* HEADER: SERIF DISPLAY HEADLINE & MIGRATION TARGET META */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status="Completed" size="sm" />
              <span className="text-xs font-mono text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-400">AST Parse ID: #m-9481b</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Review your <span className="italic font-normal text-amber-400">migration</span>
            </h1>
            <p className="text-slate-400 mt-2 text-base">
              Inspect automated type translations, review synthesized triggers, and verify cutover risk score.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={FileText}
              onClick={() => navigate('/reports')}
            >
              Reports & Audit
            </Button>
            <Button
              variant="amber"
              size="md"
              icon={Download}
              onClick={handleDownloadSQL}
            >
              Download PostgreSQL DDL
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROMINENT RISK SCORE PANEL */}
        {/* ========================================================================= */}
        <div className="my-8">
          <CardContainer glow accent="amber" className="p-6 sm:p-8 bg-slate-900/90">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Left Score Gauge Column */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center gap-6 pr-0 lg:pr-6 lg:border-r border-slate-800">
                {/* Circular Dial Representation */}
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  {/* Glowing background ring */}
                  <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-md" />
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#1e293b"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="180.8" // 28% of 251.2
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-mono text-3xl font-black text-emerald-400">28</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      / 100 Risk
                    </span>
                  </div>
                </div>

                <div className="text-center sm:text-left lg:text-center">
                  <div className="inline-block mb-1">
                    <RiskBadge score={28} tier="Low" size="md" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">Safe Cutover Profile</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                    AST parser converted all types and relations safely. Triggers emulated MySQL clauses
                    cleanly without breaking integrity.
                  </p>
                </div>
              </div>

              {/* Right Breakdown Grid: ML Model Outputs */}
              <div className="lg:col-span-8 grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2 text-indigo-400 font-mono text-xs font-semibold">
                    <Activity className="w-4 h-4" />
                    <span>ML Estimated Effort</span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">~2.5 hours</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Predicted review & dry-run validation time.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-2 text-amber-400 font-mono text-xs font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Success Probability</span>
                  </div>
                  <div className="text-2xl font-black text-amber-300 font-mono">94%</div>
                  <p className="text-xs text-slate-400 mt-1">
                    High-confidence rule-based AST translation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30">
                  <div className="flex items-center gap-2 mb-2 text-rose-400 font-mono text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Unsupported Flags</span>
                  </div>
                  <div className="text-2xl font-black text-rose-400 font-mono">3 Items</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Flagged by AI Assistant for manual sign-off.
                  </p>
                </div>
              </div>
            </div>
          </CardContainer>
        </div>

        {/* ========================================================================= */}
        {/* AI ASSISTANT: UNRESOLVED OBJECTS & PLAIN-LANGUAGE EXPLANATIONS */}
        {/* ========================================================================= */}
        <div className="my-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                AI Migration Assistant
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Unsupported Features & Plain-Language Explanations
              </h2>
            </div>

            {/* Severity Filter Pills */}
            <div className="flex items-center gap-1.5">
              {['All', 'High', 'Medium', 'Low'].map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    severityFilter === sev
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {sev} Severity
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredUnresolved.map((item) => {
              const isExpanded = expandedObject === item.id;
              const isHigh = item.severity === 'High';
              const isMedium = item.severity === 'Medium';

              return (
                <CardContainer
                  key={item.id}
                  accent={isHigh ? 'coral' : isMedium ? 'amber' : 'indigo'}
                  className="overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedObject(isExpanded ? null : item.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isHigh
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : isMedium
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isHigh ? (
                          <AlertOctagon className="w-5 h-5" />
                        ) : isMedium ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-slate-400">{item.target}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[11px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="font-display text-base font-bold text-white">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold text-indigo-400 hidden sm:inline">
                        {item.status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800 bg-slate-950/60 space-y-4 text-sm">
                      {/* MySQL original snippet */}
                      <div>
                        <span className="text-xs font-mono uppercase text-slate-500 block mb-1">
                          Source MySQL Snippet
                        </span>
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300">
                          {item.mysqlSnippet}
                        </div>
                      </div>

                      {/* Plain Language Explanation */}
                      <div>
                        <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
                          Plain-Language Technical Explanation
                        </span>
                        <p className="text-slate-300 leading-relaxed text-sm">
                          {item.plainLanguage}
                        </p>
                      </div>

                      {/* Pivot Action / Recommendation */}
                      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/25 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase font-bold text-indigo-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            How Pivot Solved This in PostgreSQL
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.id, item.resolvedSnippet)}
                            className="text-xs font-mono text-indigo-400 hover:text-white flex items-center gap-1 bg-indigo-900/50 px-2 py-1 rounded"
                          >
                            {copiedCodeId === item.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            Copy Fix
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.recommendation}
                        </p>
                        <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                          {item.resolvedSnippet}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContainer>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SIDE-BY-SIDE SCHEMA DIFF VIEWER */}
        {/* ========================================================================= */}
        <div className="my-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                AST Comparison
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Side-by-Side Schema Diff
              </h2>
            </div>

            {/* Table Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              {Object.keys(SCHEMA_DIFF_TABLES).map((tKey) => (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => setActiveTable(tKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    activeTable === tKey
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tKey}.sql
                </button>
              ))}
            </div>
          </div>

          {/* Diff Viewer Container */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Diff Header */}
            <div className="grid grid-cols-2 divide-x divide-slate-800 bg-slate-950 px-6 py-3.5 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between pr-4">
                <span className="flex items-center gap-2 text-amber-400 font-bold">
                  <Database className="w-4 h-4" />
                  MySQL 8.0 Source ({currentDiff.tableName})
                </span>
                <span className="text-slate-500">{currentDiff.mysqlRows.length} lines</span>
              </div>
              <div className="flex items-center justify-between pl-4">
                <span className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Database className="w-4 h-4" />
                  PostgreSQL 16 Target (Synthesized DDL)
                </span>
                <span className="text-slate-500">{currentDiff.postgresRows.length} lines</span>
              </div>
            </div>

            {/* Side-by-side Table Lines */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-mono text-xs overflow-x-auto">
              {/* MySQL Source Column */}
              <div className="bg-rose-950/5 p-4 space-y-1">
                {currentDiff.mysqlRows.map((row, idx) => {
                  const isDel = row.type === 'changed-del';
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 py-1 px-2 rounded ${
                        isDel
                          ? 'bg-rose-950/40 text-rose-200 border border-rose-900/50'
                          : 'text-slate-400'
                      }`}
                    >
                      <span className="w-6 text-right select-none text-slate-600 shrink-0">
                        {row.num}
                      </span>
                      <span className="flex-1 whitespace-pre">{row.text}</span>
                      {row.note && (
                        <span className="hidden sm:inline-block text-[10px] text-amber-400/90 italic bg-slate-950/80 px-1.5 rounded shrink-0">
                          {row.note}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* PostgreSQL Target Column */}
              <div className="bg-emerald-950/5 p-4 space-y-1">
                {currentDiff.postgresRows.map((row, idx) => {
                  const isAdd = row.type === 'changed-add';
                  const isComment = row.type === 'comment';
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 py-1 px-2 rounded ${
                        isAdd
                          ? 'bg-emerald-950/40 text-emerald-200 border border-emerald-800/50'
                          : isComment
                          ? 'text-slate-500 italic'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="w-6 text-right select-none text-slate-600 shrink-0">
                        {row.num || ' '}
                      </span>
                      <span className="flex-1 whitespace-pre">{row.text}</span>
                      {row.note && (
                        <span className="hidden sm:inline-block text-[10px] text-emerald-400/90 font-semibold bg-slate-950/80 px-1.5 rounded shrink-0">
                          {row.note}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-900/60 border border-rose-800" />
                  MySQL Legacy Construct
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-900/60 border border-emerald-700" />
                  Standard PostgreSQL 16
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy('all-ddl', GENERATED_PG_SQL)}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedCodeId === 'all-ddl' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  Copy Generated DDL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-indigo-950/50 border border-indigo-500/25 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">
              Ready for stage deployment?
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Download the complete transactional script or review the audit checklist.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="amber"
              size="md"
              iconRight={ArrowRight}
              onClick={() => navigate('/reports')}
            >
              Open Reports Panel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

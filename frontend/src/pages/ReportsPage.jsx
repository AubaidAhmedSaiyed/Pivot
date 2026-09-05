import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  FileText,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Printer,
  Table,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import SchemaBackground from '../components/common/SchemaBackground';
import Button from '../components/common/Button';
import CardContainer from '../components/common/CardContainer';
import {
  MIGRATION_AUDIT_LOGS,
  GENERATED_PG_SQL,
  ROLLBACK_PG_SQL,
} from '../data/mockData';

export default function ReportsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sql'); // 'sql' | 'rollback' | 'audit'
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [checklist, setChecklist] = useState({
    extensions: true,
    sandbox: true,
    timezone: true,
    backup: false,
    pooler: false,
  });

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const handleDownloadRollback = () => {
    const blob = new Blob([ROLLBACK_PG_SQL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pivot_postgres_rollback.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      setPdfGenerating(false);
      window.print();
    }, 600);
  };

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 pb-28 overflow-hidden">
      <SchemaBackground variant="default" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        {/* Header with Serif headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Certified Artifacts Ready</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Migration <span className="italic font-normal text-amber-400">Reports</span> & Artifacts
            </h1>
            <p className="text-slate-400 mt-2 text-base">
              Download PostgreSQL scripts, review execution audit logs, and print summary risk assessments.
            </p>
          </div>

          {/* Quick Download CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={Printer}
              onClick={handleDownloadPDF}
            >
              {pdfGenerating ? 'Generating PDF...' : 'Print PDF Summary'}
            </Button>
            <Button
              variant="amber"
              size="md"
              icon={Download}
              onClick={handleDownloadSQL}
            >
              Download .sql Script
            </Button>
          </div>
        </div>

        {/* Quick Artifact Cards Row */}
        <div className="grid md:grid-cols-3 gap-6 my-8">
          {/* Card 1: Migration DDL */}
          <CardContainer accent="indigo" className="p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-1">
                PostgreSQL DDL Script
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Full deterministic migration wrapped in atomic transactions with extension bootstrapping.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-500">3.8 KB • 120 lines</span>
              <button
                type="button"
                onClick={handleDownloadSQL}
                className="text-xs font-mono text-indigo-400 hover:text-white font-bold flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> .sql file
              </button>
            </div>
          </CardContainer>

          {/* Card 2: Rollback Script */}
          <CardContainer accent="coral" className="p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-1">
                Emergency Rollback DDL
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Safe teardown statements for dropping synthesized triggers, functions, and newly created tables.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-500">1.2 KB • Cascade safety</span>
              <button
                type="button"
                onClick={handleDownloadRollback}
                className="text-xs font-mono text-rose-400 hover:text-white font-bold flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> rollback.sql
              </button>
            </div>
          </CardContainer>

          {/* Card 3: Executive PDF Summary */}
          <CardContainer accent="amber" className="p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-1">
                Executive Audit Report
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Comprehensive cutover risk analysis, sign-off metrics, and unresolved construct remedies.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-500">Print / PDF Export</span>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="text-xs font-mono text-amber-400 hover:text-white font-bold flex items-center gap-1"
              >
                <Printer className="w-3 h-3" /> Export PDF
              </button>
            </div>
          </CardContainer>
        </div>

        {/* Script Viewer & Audit Tabs */}
        <div className="my-10">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('sql')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'sql'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              PostgreSQL Script Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rollback')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'rollback'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              Rollback Script Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'audit'
                  ? 'bg-amber-600 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              Transformation Audit Log
            </button>
          </div>

          {activeTab === 'sql' ? (
            <CardContainer className="p-6 bg-slate-950 border-slate-800">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400 font-mono">
                <span>pivot_postgres_migration.sql</span>
                <button
                  type="button"
                  onClick={() => handleCopy(GENERATED_PG_SQL)}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto max-h-96">
                {GENERATED_PG_SQL}
              </pre>
            </CardContainer>
          ) : activeTab === 'rollback' ? (
            <CardContainer className="p-6 bg-slate-950 border-slate-800">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400 font-mono">
                <span className="text-rose-400">pivot_postgres_rollback.sql</span>
                <button
                  type="button"
                  onClick={() => handleCopy(ROLLBACK_PG_SQL)}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Rollback'}</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-rose-300 leading-relaxed overflow-x-auto max-h-96">
                {ROLLBACK_PG_SQL}
              </pre>
            </CardContainer>
          ) : (
            /* Audit Log Table */
            <CardContainer className="overflow-hidden border-slate-800 bg-slate-950/80">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Rule Applied</th>
                      <th className="py-3 px-4">Source Syntax</th>
                      <th className="py-3 px-4">Target Translation</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {MIGRATION_AUDIT_LOGS.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                        <td className="py-3 px-4 text-amber-400 font-bold">{log.rule}</td>
                        <td className="py-3 px-4 text-rose-300">{log.source}</td>
                        <td className="py-3 px-4 text-emerald-300">{log.target}</td>
                        <td className="py-3 px-4 text-slate-300">{log.confidence}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              log.status === 'Safe'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : log.status === 'Synthesized'
                                ? 'bg-indigo-500/10 text-indigo-300'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContainer>
          )}
        </div>

        {/* Pre-Cutover Execution Checklist */}
        <div className="my-10">
          <CardContainer className="p-6 sm:p-8 bg-slate-900/80">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Pre-Cutover Execution Checklist
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Confirm cluster prerequisites before applying DDL to your target PostgreSQL instance.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: 'extensions',
                  title: 'Required PostgreSQL Extensions Enabled',
                  desc: 'Ensure `uuid-ossp` and `pgcrypto` extensions are available in the public or target schema.',
                },
                {
                  key: 'sandbox',
                  title: 'Dry-Run Tested in Staging Replica',
                  desc: 'Applied generated script within a rollback transaction to verify zero constraint collisions.',
                },
                {
                  key: 'timezone',
                  title: 'Timezone Consistency Configured',
                  desc: 'Confirm Postgres `TIMEZONE = UTC` aligns with application server expectations for TIMESTAMPTZ.',
                },
                {
                  key: 'backup',
                  title: 'Full MySQL Logical Snapshot Verified',
                  desc: 'mysqldump snapshot backed up with `--single-transaction --quick` flags.',
                },
                {
                  key: 'pooler',
                  title: 'Connection Pooler (PgBouncer) Session Mode',
                  desc: 'If using PgBouncer, ensure prepared statements and identity sequences operate in session mode.',
                },
              ].map((chk) => (
                <div
                  key={chk.key}
                  onClick={() => toggleCheck(chk.key)}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3.5 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checklist[chk.key]}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                  />
                  <div className="text-sm">
                    <h4
                      className={`font-semibold ${
                        checklist[chk.key] ? 'text-slate-200 line-through opacity-75' : 'text-white'
                      }`}
                    >
                      {chk.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {chk.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContainer>
        </div>
      </div>
    </div>
  );
}

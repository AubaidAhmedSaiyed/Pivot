import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileCode2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Terminal,
  Database,
  Cpu,
  AlertCircle,
  FileText,
  RotateCcw,
  Play,
  Check,
} from 'lucide-react';
import SchemaBackground from '../components/common/SchemaBackground';
import Button from '../components/common/Button';
import CardContainer from '../components/common/CardContainer';
import { SAMPLE_SCHEMAS } from '../data/mockData';

export default function UploadPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [selectedSample, setSelectedSample] = useState('ecommerce');
  const [pastedSql, setPastedSql] = useState(SAMPLE_SCHEMAS.ecommerce.sql);
  const [fileName, setFileName] = useState('ecommerce_storefront.sql');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0); // 0: idle, 1: uploading, 2: parsing AST, 3: converting types, 4: done
  const [logs, setLogs] = useState([]);

  // Stepper definition aligned with system workflow
  const steps = [
    { id: 1, label: 'Uploading', desc: 'Ingesting MySQL SQL schema' },
    { id: 2, label: 'Canonical Parse', desc: 'SQLGlot canonical syntax tree' },
    { id: 3, label: 'Rule Engine', desc: 'Converting types & logging decisions' },
    { id: 4, label: 'Done', desc: 'ML risk prediction & diff ready' },
  ];

  const handleSelectSample = (key) => {
    setSelectedSample(key);
    setPastedSql(SAMPLE_SCHEMAS[key].sql);
    setFileName(`${key}_schema.sql`);
  };

  const startConversion = () => {
    setIsProcessing(true);
    setStep(1);
    setLogs(['[00:00.012] Ingesting SQL schema buffer (3.4 KB, UTF-8)...']);

    setTimeout(() => {
      setStep(2);
      setLogs((prev) => [
        ...prev,
        '[00:00.320] Parsing MySQL 8.0 DDL via SQLGlot into canonical schema tree...',
        '[00:00.540] Extracted 4 canonical table definitions, 18 columns, 6 foreign keys.',
      ]);
    }, 900);

    setTimeout(() => {
      setStep(3);
      setLogs((prev) => [
        ...prev,
        '[00:01.110] Rule-based engine converting types: TINYINT(1) -> BOOLEAN, DATETIME -> TIMESTAMPTZ.',
        '[00:01.420] Detected unsupported MySQL clause ON UPDATE CURRENT_TIMESTAMP on `users.updated_at`.',
        '[00:01.780] AI Assistant flagged unsupported clause and generated PL/pgSQL BEFORE UPDATE trigger.',
        '[00:02.010] Upgraded AUTO_INCREMENT keys to SQL:2008 GENERATED ALWAYS AS IDENTITY.',
      ]);
    }, 1900);

    setTimeout(() => {
      setStep(4);
      setLogs((prev) => [
        ...prev,
        '[00:02.450] ML model prediction: Complexity 28/100 • Estimated Effort ~2.5 hrs • Success Probability 94%.',
        '[00:02.620] PostgreSQL 16 schema generated. Diff viewer & downloadable SQL/PDF ready.',
      ]);
      setIsProcessing(false);
    }, 3000);
  };

  const resetAll = () => {
    setStep(0);
    setIsProcessing(false);
    setLogs([]);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 pb-24 overflow-hidden">
      <SchemaBackground variant="default" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        {/* Header with typography contrast */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Engine: PostgreSQL 16.2 Strict Dialect</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Upload your <span className="italic font-normal text-amber-400">schema</span>
          </h1>
          <p className="text-slate-400 text-base">
            Drop a MySQL dump file or paste DDL statements directly to compile an AST translation.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mb-10 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((s, idx) => {
              const isDone = step > s.id || step === 4;
              const isCurrent = step === s.id && step !== 4;
              const isPending = step < s.id;

              return (
                <div key={s.id} className="flex flex-col gap-1.5 relative">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.id}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isDone
                          ? 'text-emerald-400'
                          : isCurrent
                          ? 'text-amber-300 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-9 line-clamp-1">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Stage */}
        {step === 0 ? (
          <div className="space-y-6">
            {/* Quick Sample Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                Quick-test with curated sample schemas:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {Object.keys(SAMPLE_SCHEMAS).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectSample(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
                      selectedSample === key
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {SAMPLE_SCHEMAS[key].name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area / Paste Area Container */}
            <CardContainer glow className="p-8">
              {/* Tab Selector */}
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 text-sm font-semibold pb-1 transition-all ${
                    activeTab === 'upload'
                      ? 'text-amber-400 border-b-2 border-amber-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  Drag & Drop File (.sql)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`flex items-center gap-2 text-sm font-semibold pb-1 transition-all ${
                    activeTab === 'paste'
                      ? 'text-amber-400 border-b-2 border-amber-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode2 className="w-4 h-4" />
                  Paste DDL Text
                </button>
              </div>

              {activeTab === 'upload' ? (
                /* Drag and Drop Zone */
                <div
                  onClick={startConversion}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-12 text-center transition-all bg-slate-950/50 hover:bg-slate-900/50 cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400 group-hover:scale-110 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Click to load <span className="text-amber-300 font-mono text-lg">{fileName}</span> or drop files here
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                    Supports standard MySQL dumps from mysqldump, phpMyAdmin, Navicat, and Prisma schema exports.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run AST Parse & Convert</span>
                  </div>
                </div>
              ) : (
                /* Paste DDL View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Source: MySQL 8.0 DDL</span>
                    <span>{pastedSql.split('\n').length} lines • {pastedSql.length} characters</span>
                  </div>
                  <textarea
                    rows={12}
                    value={pastedSql}
                    onChange={(e) => setPastedSql(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="amber"
                      size="md"
                      icon={Play}
                      onClick={startConversion}
                    >
                      Process & Translate Schema
                    </Button>
                  </div>
                </div>
              )}
            </CardContainer>
          </div>
        ) : (
          /* Real-Time Processing Console & Step Results */
          <div className="space-y-6">
            <CardContainer className="p-6 bg-slate-950/90 border-slate-800">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AST Translation Pipeline Stream</h3>
                    <p className="text-xs text-slate-500 font-mono">Worker: ast-node-04 • Session ID: #8839-x</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {step === 4 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Conversion Complete
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      Analyzing AST...
                    </span>
                  )}
                </div>
              </div>

              {/* Log Window */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 max-h-72 overflow-y-auto">
                {logs.map((line, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      line.includes('Risk scoring')
                        ? 'text-emerald-300 font-bold bg-emerald-950/30 p-1 rounded'
                        : line.includes('Detected') || line.includes('Synthesized')
                        ? 'text-amber-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>

              {/* Action Buttons when Done */}
              {step === 4 && (
                <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Upload another schema
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => navigate('/reports')}
                    >
                      View Reports & SQL
                    </Button>
                    <Button
                      variant="amber"
                      size="md"
                      iconRight={ArrowRight}
                      onClick={() => navigate('/review')}
                    >
                      Review Side-by-Side Diff
                    </Button>
                  </div>
                </div>
              )}
            </CardContainer>
          </div>
        )}
      </div>
    </div>
  );
}

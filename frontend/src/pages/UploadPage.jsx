import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileCode2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Terminal,
  Database,
  AlertCircle,
  RotateCcw,
  Play,
  Check,
} from 'lucide-react';
import SchemaBackground from '../components/common/SchemaBackground';
import Button from '../components/common/Button';
import CardContainer from '../components/common/CardContainer';
import { SAMPLE_SCHEMAS } from '../data/mockData';
import { useMigration } from '../contexts/useMigration';

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { migration, loading: isProcessing, step, error, runMigration, clearMigration } = useMigration();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [selectedSample, setSelectedSample] = useState('ecommerce');
  const [pastedSql, setPastedSql] = useState(SAMPLE_SCHEMAS.ecommerce.sql);
  const [fileName, setFileName] = useState('ecommerce_storefront.sql');
  const [logs, setLogs] = useState([]);
  const [fileError, setFileError] = useState('');

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
    setFileError('');
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.sql')) {
      setFileError('Please select a .sql file.');
      return;
    }
    try {
      setPastedSql(await file.text());
      setFileName(file.name);
      setSelectedSample('');
      setFileError('');
      setActiveTab('paste');
    } catch (readError) {
      setFileError(`Could not read the selected file: ${readError.message}`);
    }
  };

  const startConversion = async () => {
    setFileError('');
    setLogs(['Submitting schema for backend analysis...']);
    try {
      const result = await runMigration(pastedSql);
      setLogs([
        `Schema analysis complete: ${result.analysis?.summary?.table_count ?? 0} tables, ${result.analysis?.summary?.column_count ?? 0} columns.`,
        `Complexity prediction: ${result.prediction?.complexity ?? 'Not provided'}.`,
        `Generated PostgreSQL SQL (${result.migration.sql.length} characters).`,
        `Review and schema diff complete: ${result.diff?.changes?.length ?? 0} changes reported.`,
      ]);
    } catch (requestError) {
      setFileError(requestError.message);
      setLogs([]);
    }
  };

  const resetAll = () => {
    clearMigration();
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
            {steps.map((s) => {
              const isDone = step > s.id || step === 4;
              const isCurrent = step === s.id && step !== 4;
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
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleFile(event.dataTransfer.files?.[0]);
                  }}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-12 text-center transition-all bg-slate-950/50 hover:bg-slate-900/50 cursor-pointer group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".sql,text/plain"
                    className="hidden"
                    onChange={(event) => {
                      const [file] = event.target.files || [];
                      event.target.value = '';
                      handleFile(file);
                    }}
                  />
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400 group-hover:scale-110 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Click to choose a <span className="text-amber-300 font-mono text-lg">.sql file</span> or drop it here
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                    Supports standard MySQL dumps from mysqldump, phpMyAdmin, Navicat, and Prisma schema exports.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold shadow-md">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Choose SQL File</span>
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
                    onChange={(e) => {
                      setPastedSql(e.target.value);
                      setSelectedSample('');
                      setFileError('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="amber"
                      size="md"
                      icon={Play}
                      onClick={startConversion}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Analyze & Convert Schema'}
                    </Button>
                  </div>
                </div>
              )}
              {(fileError || error) && (
                <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-rose-300">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{fileError || error}</span>
                </p>
              )}
              {activeTab === 'upload' && (
                <div className="flex justify-end mt-4">
                  <Button
                    variant="amber"
                    size="md"
                    icon={Play}
                    onClick={startConversion}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Analyze Selected Schema'}
                  </Button>
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
                    <p className="text-xs text-slate-500 font-mono">{fileName} • Backend migration APIs</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {migration ? (
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
                {isProcessing && (
                  <div className="leading-relaxed text-amber-300">
                    {step === 1 && 'Analyzing schema and predicting migration complexity...'}
                    {step === 2 && 'Generating PostgreSQL migration SQL...'}
                    {step === 3 && 'Building migration review and schema diff...'}
                  </div>
                )}
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
              {migration && (
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

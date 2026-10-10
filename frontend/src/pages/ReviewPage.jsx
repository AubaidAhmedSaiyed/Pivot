import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FileDiff,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import SchemaBackground from '../components/common/SchemaBackground';
import Button from '../components/common/Button';
import CardContainer from '../components/common/CardContainer';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';
import { useMigration } from '../contexts/useMigration';

function downloadSql(sql) {
  const blob = new Blob([sql], { type: 'text/sql' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'pivot_postgresql_migration.sql';
  anchor.click();
  URL.revokeObjectURL(url);
}

function titleCase(value) {
  return String(value || 'unknown').toLowerCase().replaceAll('_', ' ');
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { migration } = useMigration();
  const [activeTable, setActiveTable] = useState('');
  const [expandedIssue, setExpandedIssue] = useState(null);

  const tables = migration?.analysis?.tables || [];
  const selectedTable = tables.find((table) => table.name === activeTable) || tables[0] || null;
  const issues = [
    ...(migration?.review?.issues || []),
    ...(migration?.review?.ai_review?.issues || []),
  ];
  const risks = migration?.analysis?.risk;
  const riskLevel = risks?.risk_level || 'LOW';
  const riskTier = riskLevel.charAt(0) + riskLevel.slice(1).toLowerCase();

  if (!migration) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-slate-100 pb-24 overflow-hidden">
        <SchemaBackground variant="review" />
        <div className="max-w-3xl mx-auto px-4 pt-24 relative z-10">
          <CardContainer className="p-10 text-center bg-slate-900/80">
            <FileDiff className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
            <h1 className="font-display text-3xl font-bold text-white mb-3">No migration to review</h1>
            <p className="text-slate-400 mb-7">Analyze a MySQL schema to see backend-generated review findings and schema differences.</p>
            <Button variant="amber" iconRight={ArrowRight} onClick={() => navigate('/upload')}>Analyze a Schema</Button>
          </CardContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 pb-28 overflow-hidden">
      <SchemaBackground variant="review" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status="Completed" size="sm" />
              <span className="text-xs font-mono text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-400">Backend analysis</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Review your <span className="italic font-normal text-amber-400">migration</span>
            </h1>
            <p className="text-slate-400 mt-2 text-base">
              Findings, schema mappings, and SQL below are returned by the migration APIs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" icon={FileText} onClick={() => navigate('/reports')}>Reports & SQL</Button>
            <Button variant="amber" icon={Download} onClick={() => downloadSql(migration.migration.sql)}>
              Download PostgreSQL DDL
            </Button>
          </div>
        </div>

        <div className="my-8">
          <CardContainer glow accent="amber" className="p-6 sm:p-8 bg-slate-900/90">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center gap-6 pr-0 lg:pr-6 lg:border-r border-slate-800">
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-md" />
                  <div className="w-full h-full rounded-full border-[8px] border-slate-800 flex items-center justify-center">
                    {riskLevel === 'LOW'
                      ? <ShieldCheck className="w-12 h-12 text-emerald-400" />
                      : <ShieldAlert className="w-12 h-12 text-amber-400" />}
                  </div>
                  <span className="absolute bottom-5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    {risks?.risk_count ?? 0} findings
                  </span>
                </div>
                <div className="text-center sm:text-left lg:text-center">
                  <div className="inline-block mb-1"><RiskBadge tier={riskTier} showScore={false} size="md" /></div>
                  <h2 className="font-display text-lg font-bold text-white">Schema Risk Assessment</h2>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                    Risk level and findings are based on the backend schema analysis.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-8 grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-indigo-400 font-mono text-xs font-semibold mb-2">ML COMPLEXITY</div>
                  <div className="text-2xl font-black text-white font-mono">{migration.prediction?.complexity ?? 'Unavailable'}</div>
                  <p className="text-xs text-slate-400 mt-1">Prediction from the complexity endpoint.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
                  <div className="text-amber-400 font-mono text-xs font-semibold mb-2">TABLES</div>
                  <div className="text-2xl font-black text-amber-300 font-mono">{migration.analysis?.summary?.table_count ?? 0}</div>
                  <p className="text-xs text-slate-400 mt-1">{migration.analysis?.summary?.column_count ?? 0} columns analyzed.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30">
                  <div className="text-rose-400 font-mono text-xs font-semibold mb-2">SQL WARNINGS</div>
                  <div className="text-2xl font-black text-white font-mono">{migration.migration.warnings?.length ?? 0}</div>
                  <p className="text-xs text-slate-400 mt-1">Generated migration warnings.</p>
                </div>
              </div>
            </div>
          </CardContainer>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 my-10">
          <CardContainer className="p-6 bg-slate-900/80">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="font-display text-xl font-bold text-white">Migration review</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {migration.review?.summary || migration.review?.ai_review?.summary || 'No review summary was returned.'}
            </p>
            {migration.review?.recommendations?.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-slate-400 list-disc pl-5">
                {migration.review.recommendations.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
              </ul>
            )}
          </CardContainer>
          <CardContainer className="p-6 bg-slate-900/80">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h2 className="font-display text-xl font-bold text-white">Analysis issues & risks</h2>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {[...(migration.analysis?.issues || []), ...(risks?.risks || [])].length === 0 ? (
                <p className="text-sm text-emerald-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />No schema risks or analysis issues were reported.</p>
              ) : [...(migration.analysis?.issues || []), ...(risks?.risks || [])].map((item, index) => (
                <div key={`${item.type}-${index}`} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-mono uppercase text-amber-300">{titleCase(item.severity || item.type)}</div>
                  <p className="text-sm text-slate-300 mt-1">{item.message || item.explanation}</p>
                  {(item.table || item.column) && <p className="text-xs text-slate-500 mt-1">{[item.table, item.column].filter(Boolean).join('.')}</p>}
                </div>
              ))}
            </div>
          </CardContainer>
        </div>

        <section className="my-10">
          <div className="mb-5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">Schema analysis</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Type mappings by table</h2>
          </div>
          {tables.length === 0 ? (
            <CardContainer className="p-6 text-sm text-slate-400">The analysis returned no tables.</CardContainer>
          ) : (
            <CardContainer className="overflow-hidden bg-slate-950/80">
              <div className="flex gap-2 overflow-x-auto border-b border-slate-800 p-3">
                {tables.map((table) => (
                  <button
                    key={table.name}
                    type="button"
                    onClick={() => setActiveTable(table.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap ${
                      selectedTable?.name === table.name ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {table.name}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 uppercase">
                    <tr><th className="py-3 px-4">Column</th><th className="py-3 px-4">MySQL type</th><th className="py-3 px-4">PostgreSQL type</th><th className="py-3 px-4">Rule / note</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedTable?.columns?.map((column) => (
                      <tr key={column.name}>
                        <td className="py-3 px-4 text-white">{column.name}</td>
                        <td className="py-3 px-4 text-rose-300">{column.source_type}</td>
                        <td className="py-3 px-4 text-emerald-300">{column.target_type || 'Unsupported'}</td>
                        <td className="py-3 px-4 text-slate-400">{column.migration_rule || column.mapping_error || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContainer>
          )}
        </section>

        <section className="my-10">
          <div className="mb-5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">AI migration assistant</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Review findings</h2>
          </div>
          {issues.length === 0 ? (
            <CardContainer className="p-6 text-sm text-slate-400">No additional review issues were returned.</CardContainer>
          ) : (
            <div className="space-y-3">
              {issues.map((issue, index) => {
                const isExpanded = expandedIssue === index;
                return (
                  <CardContainer key={`${issue.type || 'issue'}-${index}`} className="overflow-hidden bg-slate-900/80">
                    <button
                      type="button"
                      onClick={() => setExpandedIssue(isExpanded ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4"
                    >
                      <span>
                        <span className="block text-[11px] uppercase font-mono text-amber-300">{titleCase(issue.severity || issue.type)}</span>
                        <span className="block text-sm text-white mt-1">{issue.explanation || issue.message || titleCase(issue.type)}</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-slate-800 pt-3 text-sm text-slate-300">
                        <span className="text-xs uppercase font-mono text-indigo-300">Recommendation</span>
                        <p className="mt-1">{issue.recommendation || 'Review this item before applying the generated SQL.'}</p>
                      </div>
                    )}
                  </CardContainer>
                );
              })}
            </div>
          )}
        </section>

        <section className="my-10">
          <div className="mb-5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">AST comparison</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Schema diff</h2>
          </div>
          <CardContainer className="p-6 bg-slate-900/80">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {Object.entries(migration.diff?.summary || {}).map(([key, value]) => (
                <div key={key} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="block text-xl font-mono font-bold text-white">{value}</span>
                  <span className="text-xs text-slate-400 capitalize">{titleCase(key)}</span>
                </div>
              ))}
            </div>
            {migration.diff?.changes?.length ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {migration.diff.changes.map((change, index) => (
                  <div key={`${change.type}-${index}`} className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono">
                    <span className="text-indigo-300 uppercase">{titleCase(change.type)}</span>
                    {change.table && <span className="text-white">{change.table}</span>}
                    {change.column && <span className="text-amber-300">{change.column}</span>}
                    {(change.source_type || change.target_type) && <span className="text-slate-400">{change.source_type} → {change.target_type}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No schema differences were reported.</p>
            )}
          </CardContainer>
        </section>
      </div>
    </div>
  );
}

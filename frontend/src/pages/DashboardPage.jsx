import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Download,
  AlertTriangle,
  Clock,
  GitBranch,
  Table,
  CheckCircle2,
  Sparkles,
  Layers,
  FileCode,
  SlidersHorizontal,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import SchemaBackground from '../components/common/SchemaBackground';
import Button from '../components/common/Button';
import CardContainer from '../components/common/CardContainer';
import StatusBadge from '../components/common/StatusBadge';
import RiskBadge from '../components/common/RiskBadge';
import { MIGRATION_PROJECTS, WORKSPACE_STATS } from '../data/mockData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Filter projects
  const filteredProjects = MIGRATION_PROJECTS.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.sourceEngine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 pb-24 overflow-hidden">
      <SchemaBackground variant="default" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        {/* ========================================================================= */}
        {/* TOP HEADER: SERIF DISPLAY HEADLINE & ACTIONS */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Active Cluster: Production-East</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Migration <span className="italic font-normal text-amber-400">Workspace</span>
            </h1>
            <p className="text-slate-400 mt-2 text-base">
              Manage database cutovers, inspect upfront risk scores, and download PostgreSQL DDL scripts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Empty State Demonstration */}
            <button
              type="button"
              onClick={() => setShowEmptyState(!showEmptyState)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
              title="Toggle to preview empty state design"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showEmptyState ? 'Show Projects' : 'Preview Empty State'}</span>
            </button>

            <Button
              variant="amber"
              size="md"
              icon={Plus}
              onClick={() => navigate('/upload')}
            >
              New Migration
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STATS OVERVIEW CARDS (REPORT SUPPORTED ONLY) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
          <CardContainer className="p-5 bg-slate-900/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Auto-resolved
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                Target: X%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Conversion accuracy goal</p>
          </CardContainer>

          <CardContainer className="p-5 bg-slate-900/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Risk Accuracy
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-400 font-mono">
                Target: X%
              </span>
            </div>
            <p className="text-xs text-amber-400/80 mt-2">ML prediction baseline</p>
          </CardContainer>

          <CardContainer className="p-5 bg-slate-900/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Engine Pair
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-mono">
                1 DB pair
              </span>
            </div>
            <p className="text-xs text-indigo-300/80 mt-2">MySQL → PostgreSQL</p>
          </CardContainer>

          <CardContainer className="p-5 bg-slate-900/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Scope Boundary
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                Schema-only
              </span>
            </div>
            <p className="text-xs text-emerald-400/80 mt-2">No row data touched</p>
          </CardContainer>
        </div>

        {/* ========================================================================= */}
        {/* SEARCH & FILTERS BAR */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-6 backdrop-blur-md">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by schema name or dialect..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'Completed', 'In Review', 'Needs Attention'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROJECTS LIST OR EMPTY STATE */}
        {/* ========================================================================= */}
        {showEmptyState || filteredProjects.length === 0 ? (
          /* Empty State */
          <CardContainer className="p-16 text-center max-w-2xl mx-auto my-12 bg-slate-900/50 border-dashed border-slate-700">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              No schema migrations found
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              {showEmptyState
                ? "This is a demonstration of the clean empty state when no migrations have been initialized yet."
                : "No migrations match your search criteria. Clear filters or start a new schema conversion."}
            </p>
            <div className="flex items-center justify-center gap-3">
              {showEmptyState ? (
                <Button variant="secondary" onClick={() => setShowEmptyState(false)}>
                  Back to Real Projects
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}>
                  Reset Filters
                </Button>
              )}
              <Button
                variant="amber"
                icon={Plus}
                onClick={() => navigate('/upload')}
              >
                Upload First Schema
              </Button>
            </div>
          </CardContainer>
        ) : (
          /* Project Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <CardContainer
                key={project.id}
                interactive
                accent={project.riskTier === 'High' ? 'coral' : project.riskTier === 'Medium' ? 'amber' : 'indigo'}
                className="p-6 flex flex-col justify-between"
                onClick={() => navigate('/review')}
              >
                <div>
                  {/* Top Meta: Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <StatusBadge status={project.status} size="sm" />
                    <RiskBadge score={project.riskScore} tier={project.riskTier} size="sm" />
                  </div>

                  {/* Schema Name */}
                  <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                    <span className="truncate">{project.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 ml-2" />
                  </h3>

                  {/* Engines Line */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4 pb-3 border-b border-slate-800">
                    <span className="text-amber-300">{project.sourceEngine}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-indigo-300">{project.targetEngine}</span>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 py-2 mb-4 bg-slate-950/60 rounded-lg px-3 border border-slate-800/80 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Tables</span>
                      <span className="font-mono text-sm font-bold text-slate-200">{project.tableCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Triggers</span>
                      <span className="font-mono text-sm font-bold text-slate-200">{project.triggerCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Flagged</span>
                      <span className={`font-mono text-sm font-bold ${project.flaggedItems > 5 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {project.flaggedItems}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Author, time, actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {project.lastRun}
                  </span>
                  <span className="font-mono text-indigo-400 hover:text-indigo-300 font-semibold">
                    Inspect Diff →
                  </span>
                </div>
              </CardContainer>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

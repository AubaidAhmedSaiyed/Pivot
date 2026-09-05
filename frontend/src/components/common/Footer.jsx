import React from 'react';
import { Terminal, Shield, Cpu, GitCommit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070b14] relative z-10 text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center">
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                Pivot<span className="text-amber-400">_</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Deterministic AST-based database schema migration engine. Translates MySQL DDL structures,
              maps complex constraints, scores cutover risk upfront, and exports verified PostgreSQL DDL.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                AST Compiler v2.4
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <GitCommit className="w-3 h-3 text-slate-500" />
                rev-9f82d
              </span>
            </div>
          </div>

          {/* Navigation Col 1: Platform */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-slate-200 transition-colors no-underline">
                  Workspace Dashboard
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-slate-400 hover:text-slate-200 transition-colors no-underline">
                  Schema Uploader
                </Link>
              </li>
              <li>
                <Link to="/review" className="text-slate-400 hover:text-slate-200 transition-colors no-underline">
                  Diff & Risk Inspector
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-slate-400 hover:text-slate-200 transition-colors no-underline">
                  Migration Reports & SQL
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Col 2: Dialects & Rules */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4">
              Conversion Rules
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  AUTO_INCREMENT → Identity
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  ON UPDATE → PL/pgSQL Triggers
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  FULLTEXT → GIN tsvector
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  Zero-Dates & Calendar Safety
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  Spatial & Geometry Types
                </span>
              </li>
            </ul>
          </div>

          {/* Navigation Col 3: Engine */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4">
              Engines
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>MySQL 5.7 / 8.0 / 8.4</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>PostgreSQL 14 / 15 / 16</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Strict Transaction Safety</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Pivot Database Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Security Overview</span>
            <span className="hover:text-slate-400 cursor-pointer">Postgres AST Reference</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy & Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

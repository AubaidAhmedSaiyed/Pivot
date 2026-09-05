import React from 'react';

/**
 * SchemaBackground
 * 
 * Strict Background Element Rules:
 * - Positioned with absolute positioning behind all content (z-index: 0, pointer-events: none)
 * - Real content sits at higher z-index (z-10+)
 * - Opacity 12-18% — visible when actively looking ("oh, that's a table diagram"), but purely peripheral on normal read
 * - Sits strictly in the negative space around content (flanks/periphery), never directly behind text
 * - Soft-edged / subtly blurred (0.4px) so it reads as technical atmosphere/texture
 * - Purely decorative (aria-hidden, select-none, zero interactivity)
 */
export default function SchemaBackground({ variant = 'default', className = '' }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      {/* ========================================================================= */}
      {/* 1. BASE TECHNICAL TEXTURE: SUBTLE GRID (12% Opacity in Negative Space) */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-[0.12] [mask-image:radial-gradient(ellipse_750px_450px_at_50%_35%,transparent_35%,black_80%)] [filter:blur(0.3px)] pointer-events-none" 
      />

      {/* ========================================================================= */}
      {/* 2. ATMOSPHERIC AMBIENT GLOWS (Very soft, non-neon, deep dark theme) */}
      {/* ========================================================================= */}
      {variant === 'hero' ? (
        <>
          <div className="absolute -top-32 left-1/4 w-[650px] h-[350px] rounded-full bg-slate-800/25 blur-[140px] pointer-events-none" />
          <div className="absolute top-28 right-1/5 w-[450px] h-[300px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />
          <div className="absolute top-96 left-10 w-[500px] h-[350px] rounded-full bg-indigo-950/25 blur-[140px] pointer-events-none" />
        </>
      ) : variant === 'review' ? (
        <>
          <div className="absolute top-10 right-1/4 w-[500px] h-[350px] rounded-full bg-slate-800/30 blur-[130px] pointer-events-none" />
          <div className="absolute top-72 left-8 w-[450px] h-[350px] rounded-full bg-amber-500/5 blur-[140px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute -top-24 left-1/3 w-[550px] h-[300px] rounded-full bg-slate-800/20 blur-[130px] pointer-events-none" />
          <div className="absolute top-64 right-10 w-[400px] h-[280px] rounded-full bg-amber-500/4 blur-[140px] pointer-events-none" />
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. SPLIT / BEFORE-AFTER LINE (Source MySQL ⇌ Target Postgres Divide) */}
      {/* ========================================================================= */}
      {variant === 'hero' && (
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-700/20 to-transparent flex flex-col justify-between py-24 items-center opacity-[0.14] [filter:blur(0.4px)] pointer-events-none">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 select-none bg-[#070b14]/70 px-2 py-0.5 rounded border border-slate-800/40">
            Source: MySQL ⇌ Target: Postgres
          </span>
          <span className="font-mono text-[10px] text-slate-500 tracking-widest">
            →
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GHOSTED ER TABLE DIAGRAMS (15-16% Opacity, Strictly Flanked in Negative Space) */}
      {/* Visible to anyone looking at the background, zero interference with center text */}
      {/* ========================================================================= */}
      {variant === 'hero' && (
        <>
          {/* Left Flank: Ghosted ER Table 'users [InnoDB]' */}
          <div className="absolute top-20 left-4 sm:left-8 lg:left-12 w-[220px] rounded-lg border border-slate-400/35 bg-[#0c1324]/40 p-3.5 opacity-[0.16] [filter:blur(0.4px)] shadow-lg pointer-events-none">
            <div className="flex items-center justify-between pb-2 border-b border-slate-500/30 mb-2">
              <span className="font-mono text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                users
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300/80 border border-amber-500/20">
                InnoDB
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-[10px] text-slate-300">
              <div className="flex items-center justify-between text-slate-300">
                <span>id</span>
                <span className="text-slate-400 text-[9px]">INT PK AUTO</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>email</span>
                <span className="text-slate-500 text-[9px]">VARCHAR(255)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>role</span>
                <span className="text-slate-500 text-[9px]">ENUM(...)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>created_at</span>
                <span className="text-slate-500 text-[9px]">DATETIME</span>
              </div>
            </div>
          </div>

          {/* Right Flank: Ghosted ER Table 'orders [PostgreSQL]' */}
          <div className="absolute top-20 right-4 sm:right-8 lg:right-12 w-[230px] rounded-lg border border-slate-400/35 bg-[#0c1324]/40 p-3.5 opacity-[0.16] [filter:blur(0.4px)] shadow-lg pointer-events-none">
            <div className="flex items-center justify-between pb-2 border-b border-slate-500/30 mb-2">
              <span className="font-mono text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400/80" />
                orders
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300/80 border border-indigo-500/20">
                PostgreSQL 16
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-[10px] text-slate-300">
              <div className="flex items-center justify-between text-slate-300">
                <span>id</span>
                <span className="text-slate-400 text-[9px]">BIGINT GENERATED</span>
              </div>
              <div className="flex items-center justify-between text-indigo-300/80">
                <span>user_id</span>
                <span className="text-slate-400 text-[9px]">FK → users(id)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>status</span>
                <span className="text-slate-500 text-[9px]">order_status</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>metadata</span>
                <span className="text-slate-500 text-[9px]">JSONB</span>
              </div>
            </div>
          </div>

          {/* Lower Right Flank: Ghosted Foreign Key Table 'order_items' */}
          <div className="hidden xl:block absolute top-[390px] right-6 sm:right-14 w-[210px] rounded-lg border border-slate-400/25 bg-[#0c1324]/35 p-3 opacity-[0.14] [filter:blur(0.4px)] shadow-md pointer-events-none">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-500/25 mb-1.5">
              <span className="font-mono text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                order_items
              </span>
              <span className="font-mono text-[8px] text-emerald-400/70">1:N FK</span>
            </div>
            <div className="space-y-1 font-mono text-[9px] text-slate-400">
              <div className="flex justify-between"><span>order_id</span><span>FK → orders(id)</span></div>
              <div className="flex justify-between"><span>price</span><span>NUMERIC(10,2)</span></div>
            </div>
          </div>

          {/* Lower Left Flank: Skeleton Table Grid */}
          <div className="hidden xl:block absolute top-[410px] left-6 sm:left-14 w-[190px] rounded-lg border border-dashed border-slate-500/30 bg-[#0c1324]/30 p-3 opacity-[0.14] [filter:blur(0.4px)] pointer-events-none">
            <div className="h-2 w-20 bg-slate-500/30 rounded mb-2" />
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-slate-600/20 rounded" />
              <div className="h-1.5 w-4/5 bg-slate-600/20 rounded" />
              <div className="h-1.5 w-3/4 bg-slate-600/20 rounded" />
            </div>
          </div>
        </>
      )}

      {/* Review Radar Mode */}
      {variant === 'review' && (
        <svg className="absolute top-10 right-10 w-60 h-60 opacity-[0.14] [filter:blur(0.4px)] pointer-events-none" viewBox="0 0 240 240">
          <circle cx="120" cy="120" r="100" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" fill="none" />
          <circle cx="120" cy="120" r="65" stroke="#475569" strokeWidth="1" fill="none" />
          <circle cx="120" cy="120" r="30" stroke="#475569" strokeWidth="1" fill="none" />
          <line x1="0" y1="120" x2="240" y2="120" stroke="#334155" strokeWidth="1" />
          <line x1="120" y1="0" x2="120" y2="240" stroke="#334155" strokeWidth="1" />
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 5. GHOSTED COLUMN TAGS & DDL FRAGMENTS (14-15% Opacity in Flanks Only) */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 font-mono text-[10px] md:text-xs select-none opacity-[0.15] text-slate-300 [filter:blur(0.4px)] pointer-events-none"
      >
        {/* Left Flank Negative Space */}
        <span className="absolute top-[210px] left-4 sm:left-8 lg:left-12 tracking-wider text-amber-400/80">
          TINYINT(1) ⇌ BOOLEAN
        </span>
        <span className="absolute top-[235px] left-6 sm:left-10 lg:left-14 text-indigo-400/80">
          DATETIME → TIMESTAMPTZ
        </span>
        <span className="absolute top-[260px] left-4 sm:left-8 lg:left-12 text-slate-400">
          AUTO_INCREMENT → IDENTITY
        </span>

        {/* Right Flank Negative Space */}
        <span className="absolute top-[210px] right-4 sm:right-8 lg:right-12 text-indigo-300/80">
          VARCHAR(255) • UUID • JSONB
        </span>
        <span className="absolute top-[235px] right-6 sm:right-10 lg:right-14 text-slate-400">
          INDEX idx_orders_placed USING gin (metadata)
        </span>
        <span className="absolute top-[260px] right-4 sm:right-8 lg:right-12 text-amber-300/80">
          CREATE TYPE order_status AS ENUM (...)
        </span>

        {/* Bottom Bleed Outer Margins */}
        <span className="absolute bottom-16 left-6 sm:left-16 text-slate-500">
          SQLGlot AST Canon::ParseNode
        </span>
        <span className="absolute bottom-10 right-1/4 text-slate-500">
          BEGIN; -- strict transactional boundary
        </span>
        <span className="absolute bottom-24 right-6 sm:right-14 text-slate-500">
          COMMIT; -- cutover verification pass
        </span>
      </div>
    </div>
  );
}

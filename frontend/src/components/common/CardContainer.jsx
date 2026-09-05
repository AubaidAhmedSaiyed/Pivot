import React from 'react';

export default function CardContainer({
  children,
  className = '',
  glow = false,
  interactive = false,
  accent = 'none', // 'indigo' | 'amber' | 'coral' | 'none'
  onClick,
}) {
  const accentBorders = {
    none: 'border-slate-800',
    indigo: 'border-slate-800 hover:border-indigo-400/40',
    amber: 'border-slate-800 hover:border-amber-500/40',
    coral: 'border-slate-800 hover:border-rose-500/40',
  };

  const glowStyles = glow
    ? 'shadow-2xl shadow-black/60 border-slate-750'
    : 'shadow-lg shadow-black/40';

  const interactiveStyles = interactive
    ? 'hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
    : 'transition-all duration-200';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl bg-slate-900/80 backdrop-blur-md border ${
        accentBorders[accent] || accentBorders.none
      } ${glowStyles} ${interactiveStyles} ${className}`}
    >
      {/* Subtle top edge highlight line for visual depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none rounded-t-xl" />
      {children}
    </div>
  );
}

import React from 'react';
import { ShieldCheck, ShieldAlert, AlertOctagon } from 'lucide-react';

export default function RiskBadge({ score = 20, tier, showScore = true, size = 'md' }) {
  // Determine tier if not explicitly passed
  let resolvedTier = tier;
  if (!resolvedTier) {
    if (score <= 30) resolvedTier = 'Low';
    else if (score <= 69) resolvedTier = 'Medium';
    else resolvedTier = 'High';
  }

  const configs = {
    Low: {
      bg: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
      pill: 'bg-emerald-500/20 text-emerald-300',
      icon: ShieldCheck,
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]',
      label: 'Low Risk',
    },
    Medium: {
      bg: 'bg-amber-950/40 text-amber-300 border-amber-500/35',
      pill: 'bg-amber-500/20 text-amber-300',
      icon: ShieldAlert,
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]',
      label: 'Medium Risk',
    },
    High: {
      bg: 'bg-rose-950/50 text-rose-300 border-rose-500/40',
      pill: 'bg-rose-500/20 text-rose-300',
      icon: AlertOctagon,
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]',
      label: 'High Risk',
    },
  };

  const config = configs[resolvedTier] || configs.Low;
  const Icon = config.icon;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono rounded-md border font-semibold ${
        config.bg
      } ${config.glow} ${isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
      {showScore && typeof score === 'number' && (
        <span className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${config.pill}`}>
          {score}/100
        </span>
      )}
    </span>
  );
}

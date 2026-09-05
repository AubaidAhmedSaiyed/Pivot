import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';

export default function StatusBadge({ status = 'Completed', size = 'md' }) {
  const configs = {
    Completed: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
      icon: CheckCircle2,
      label: 'Completed',
    },
    'In Review': {
      bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      dot: 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]',
      icon: Clock,
      label: 'In Review',
    },
    'Needs Attention': {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
      icon: AlertTriangle,
      label: 'Needs Attention',
    },
    Failed: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]',
      icon: XCircle,
      label: 'Failed',
    },
    Queued: {
      bg: 'bg-slate-500/10 text-slate-400 border-slate-600/30',
      dot: 'bg-slate-400',
      icon: Clock,
      label: 'Queued',
    },
  };

  const config = configs[status] || configs.Completed;
  const Icon = config.icon;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border transition-all ${
        config.bg
      } ${isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs tracking-wide'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className={`w-3 h-3 opacity-80`} />
      <span>{config.label}</span>
    </span>
  );
}

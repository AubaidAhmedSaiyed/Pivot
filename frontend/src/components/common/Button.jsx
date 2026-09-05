import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'amber' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconRight: IconRight,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm border border-indigo-500/40 hover:border-indigo-400',
    amber:
      'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-sm border border-amber-400 hover:border-amber-300',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 shadow-sm',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent',
    outline:
      'bg-transparent hover:bg-slate-800/40 text-slate-200 border border-slate-700 hover:border-slate-500',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-sm border border-rose-500',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {IconRight && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}

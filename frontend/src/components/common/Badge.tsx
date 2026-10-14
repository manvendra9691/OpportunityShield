import React from 'react';
import type { ApplicationStatus, SafetyRiskLevel } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  const colorStyles: Record<ApplicationStatus, string> = {
    Saved: 'bg-slate-800 text-slate-300 border-slate-700',
    Applied: 'bg-blue-950/80 text-blue-300 border-blue-800',
    Assessment: 'bg-purple-950/80 text-purple-300 border-purple-800',
    Interview: 'bg-amber-950/80 text-amber-300 border-amber-800',
    Offer: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    Rejected: 'bg-rose-950/80 text-rose-300 border-rose-800',
    Withdrawn: 'bg-zinc-800/80 text-zinc-400 border-zinc-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${colorStyles[status]} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {status}
    </span>
  );
};

interface SafetyBadgeProps {
  level: SafetyRiskLevel;
}

export const SafetyBadge: React.FC<SafetyBadgeProps> = ({ level }) => {
  switch (level) {
    case 'WARNING_SIGNS_FOUND':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-700">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          Warning Signs Found
        </span>
      );
    case 'NEEDS_VERIFICATION':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/90 text-amber-300 border border-amber-700">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Needs Verification
        </span>
      );
    case 'NO_WARNINGS_FOUND':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          No Configured Warning Signs Found
        </span>
      );
  }
};

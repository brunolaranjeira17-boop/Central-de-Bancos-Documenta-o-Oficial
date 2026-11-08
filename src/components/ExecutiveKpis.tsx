import React from 'react';
import { Target, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters.ts';

interface ExecutiveKpisProps {
  totalTarget: number;
  totalAchieved: number;
  totalContractsCount: number;
  onOpenGoalsModal?: () => void;
  canEditGoals?: boolean;
}

export const ExecutiveKpis: React.FC<ExecutiveKpisProps> = ({
  totalTarget,
  totalAchieved,
  totalContractsCount,
  onOpenGoalsModal,
  canEditGoals = false,
}) => {
  const percentage = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;
  const remaining = Math.max(0, totalTarget - totalAchieved);
  const isSuperGoal = totalAchieved >= totalTarget;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Meta Total */}
      <div className="darkroom-card p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#a09b93] uppercase tracking-wider">
            Meta Total Mensal
          </span>
          <div className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <Target className="w-4 h-4 text-[#e8a54b]" />
          </div>
        </div>

        <div className="mt-1">
          <div className="text-2xl sm:text-3xl font-display font-bold text-[#f2efe8] tracking-tight tabular-nums">
            {formatCurrency(totalTarget)}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-[#a09b93]">
            <span>6 produtos configurados</span>
            {canEditGoals && (
              <button
                onClick={onOpenGoalsModal}
                className="text-[#e8a54b] hover:text-[#f0b45e] font-medium transition-colors"
              >
                Ajustar metas →
              </button>
            )}
          </div>
        </div>

        {/* Ambient bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e8a54b]/30" />
      </div>

      {/* 2. Realizado Total */}
      <div className="darkroom-card p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#a09b93] uppercase tracking-wider">
            Realizado Total
          </span>
          <div className="w-8 h-8 rounded-[8px] bg-[#3ecf8e]/10 border border-[#3ecf8e]/25 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#3ecf8e]" />
          </div>
        </div>

        <div className="mt-1">
          <div className="text-2xl sm:text-3xl font-display font-bold text-[#3ecf8e] tracking-tight tabular-nums">
            {formatCurrency(totalAchieved)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#a09b93]">
            <span className="text-[#f2efe8] font-medium tabular-nums">{totalContractsCount}</span>
            <span>operações liquidadas/aprovadas</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3ecf8e]/40" />
      </div>

      {/* 3. Atingimento Geral (%) */}
      <div className="darkroom-card p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#a09b93] uppercase tracking-wider">
            Atingimento Geral
          </span>
          <div
            className={`w-8 h-8 rounded-[8px] flex items-center justify-center border ${
              isSuperGoal
                ? 'bg-[#3ecf8e]/10 border-[#3ecf8e]/30'
                : percentage >= 50
                ? 'bg-[#e8a54b]/10 border-[#e8a54b]/30'
                : 'bg-[#ef6b6b]/10 border-[#ef6b6b]/30'
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 ${
                isSuperGoal
                  ? 'text-[#3ecf8e]'
                  : percentage >= 50
                  ? 'text-[#e8a54b]'
                  : 'text-[#ef6b6b]'
              }`}
            />
          </div>
        </div>

        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-display font-bold tracking-tight tabular-nums ${
                isSuperGoal
                  ? 'text-[#3ecf8e]'
                  : percentage >= 50
                  ? 'text-[#e8a54b]'
                  : 'text-[#ef6b6b]'
              }`}
            >
              {formatPercent(percentage)}
            </span>
            <span className="text-xs text-[#a09b93]">do objetivo</span>
          </div>

          <div className="mt-3 progress-rail">
            <div
              className={
                isSuperGoal
                  ? 'progress-fill-green'
                  : percentage >= 50
                  ? 'progress-fill-amber'
                  : 'progress-fill-red'
              }
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.06]" />
      </div>

      {/* 4. Falta para o Alvo (R$) */}
      <div className="darkroom-card p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#a09b93] uppercase tracking-wider">
            {isSuperGoal ? 'Superávit / Excedente' : 'Falta para o Alvo'}
          </span>
          <div className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            {isSuperGoal ? (
              <CheckCircle2 className="w-4 h-4 text-[#3ecf8e]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#e8a54b]" />
            )}
          </div>
        </div>

        <div className="mt-1">
          <div
            className={`text-2xl sm:text-3xl font-display font-bold tracking-tight tabular-nums ${
              isSuperGoal ? 'text-[#3ecf8e]' : 'text-[#f2efe8]'
            }`}
          >
            {isSuperGoal
              ? `+ ${formatCurrency(totalAchieved - totalTarget)}`
              : formatCurrency(remaining)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#a09b93]">
            <Clock className="w-3.5 h-3.5 text-[#a09b93]" />
            <span>Ciclo mensal em andamento</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.06]" />
      </div>
    </div>
  );
};

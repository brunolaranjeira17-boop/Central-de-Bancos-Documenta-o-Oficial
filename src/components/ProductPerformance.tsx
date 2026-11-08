import React from 'react';
import { ProductGoal } from '../types.ts';
import { formatCurrency, formatPercent } from '../utils/formatters.ts';
import { Layers, Sliders, ChevronRight } from 'lucide-react';

interface ProductPerformanceProps {
  goals: ProductGoal[];
  productionByProduct: Record<string, number>;
  onEditGoal?: (goal: ProductGoal) => void;
  canEditGoals?: boolean;
}

export const ProductPerformance: React.FC<ProductPerformanceProps> = ({
  goals,
  productionByProduct,
  onEditGoal,
  canEditGoals = false,
}) => {
  return (
    <div className="darkroom-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-white/[0.07]">
        <div>
          <h2 className="text-lg font-display font-bold text-[#f2efe8] tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#e8a54b]" />
            Faróis de Desempenho por Produto
          </h2>
          <p className="text-xs text-[#a09b93] mt-0.5">
            Classificação dinâmica: &lt;50% crítico (vermelho), 50–99% atenção (âmbar), ≥100% meta batida (verde)
          </p>
        </div>

        {/* Legend indicator */}
        <div className="flex items-center gap-4 text-xs text-[#a09b93]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ef6b6b]" />
            <span>&lt;50%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e8a54b]" />
            <span>50-99%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3ecf8e]" />
            <span>≥100%</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {goals.map((product) => {
          const achieved = productionByProduct[product.id] || 0;
          const target = product.targetValue;
          const percentage = target > 0 ? (achieved / target) * 100 : 0;
          const isGreen = percentage >= 100;
          const isAmber = percentage >= 50 && percentage < 100;
          const isRed = percentage < 50;

          const statusColor = isGreen
            ? 'text-[#3ecf8e]'
            : isAmber
            ? 'text-[#e8a54b]'
            : 'text-[#ef6b6b]';

          const statusBadge = isGreen
            ? 'bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/25'
            : isAmber
            ? 'bg-[#e8a54b]/10 text-[#e8a54b] border-[#e8a54b]/25'
            : 'bg-[#ef6b6b]/10 text-[#ef6b6b] border-[#ef6b6b]/25';

          const progressClass = isGreen
            ? 'progress-fill-green'
            : isAmber
            ? 'progress-fill-amber'
            : 'progress-fill-red';

          const statusLabel = isGreen
            ? 'Meta Atingida'
            : isAmber
            ? 'Em Ritmo'
            : 'Abaixo do Alvo';

          return (
            <div
              key={product.id}
              className="group p-3.5 rounded-[10px] bg-[#121214]/60 border border-white/[0.04] hover:border-white/[0.09] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isGreen ? 'bg-[#3ecf8e] dot-pulse' : isAmber ? 'bg-[#e8a54b]' : 'bg-[#ef6b6b]'
                    }`}
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#f2efe8] group-hover:text-[#e8a54b] transition-colors">
                      {product.name}
                    </span>
                    <span className="text-xs text-[#a09b93] ml-2 font-mono">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusBadge}`}
                  >
                    {statusLabel}
                  </span>

                  {canEditGoals && (
                    <button
                      onClick={() => onEditGoal && onEditGoal(product)}
                      className="p-1 rounded text-[#a09b93] hover:text-[#e8a54b] hover:bg-white/[0.05] transition-colors"
                      title="Editar meta deste produto"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Rail (Slim 3-4px Darkroom Studio style) */}
              <div className="progress-rail my-2">
                <div
                  className={progressClass}
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>

              {/* Detailed Numbers in Tabular Layout */}
              <div className="flex flex-wrap items-center justify-between text-xs text-[#a09b93] mt-2 gap-2">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[#6b6660]">Realizado: </span>
                    <span className="text-[#f2efe8] font-semibold tabular-nums">
                      {formatCurrency(achieved)}
                    </span>
                  </div>
                  <span className="text-white/10">·</span>
                  <div>
                    <span className="text-[#6b6660]">Meta: </span>
                    <span className="text-[#a09b93] tabular-nums">
                      {formatCurrency(target)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-display font-bold tabular-nums text-sm ${statusColor}`}>
                    {formatPercent(percentage)}
                  </span>
                  <span className="text-[#6b6660] text-[11px]">
                    {achieved >= target
                      ? `+${formatCurrency(achieved - target)} saldo positivo`
                      : `Falta ${formatCurrency(target - achieved)}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

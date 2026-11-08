import React from 'react';
import { Trophy, Medal, Award, Flame } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters.ts';

export interface ConsultantScore {
  name: string;
  volume: number;
  count: number;
  individualGoal: number;
}

interface TeamRankingProps {
  consultants: ConsultantScore[];
}

export const TeamRanking: React.FC<TeamRankingProps> = ({ consultants }) => {
  const sorted = [...consultants].sort((a, b) => b.volume - a.volume);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <div className="w-7 h-7 rounded-[8px] bg-[#e8a54b]/20 border border-[#e8a54b]/40 flex items-center justify-center text-[#e8a54b] shadow-[0_0_10px_rgba(232,165,75,0.3)]">
          <Trophy className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="w-7 h-7 rounded-[8px] bg-white/[0.1] border border-white/[0.2] flex items-center justify-center text-[#f2efe8]">
          <Medal className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="w-7 h-7 rounded-[8px] bg-[#d97706]/20 border border-[#d97706]/40 flex items-center justify-center text-[#f59e0b]">
          <Award className="w-3.5 h-3.5" />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-[8px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center font-mono text-xs text-[#a09b93]">
        {index + 1}º
      </div>
    );
  };

  return (
    <div className="darkroom-card p-6 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.07]">
          <div>
            <h2 className="text-lg font-display font-bold text-[#f2efe8] tracking-tight flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#e8a54b]" />
              Ranking Comercial do Mês
            </h2>
            <p className="text-xs text-[#a09b93] mt-0.5">
              Volume total liquidado por consultor / correspondente
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8a54b]/10 border border-[#e8a54b]/25 text-[11px] text-[#e8a54b]">
            <Flame className="w-3 h-3 text-[#e8a54b]" />
            <span className="font-medium">Top Performers</span>
          </div>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {sorted.map((item, index) => {
            const percentage = item.individualGoal > 0 ? (item.volume / item.individualGoal) * 100 : 0;
            const isLeader = index === 0;

            return (
              <div
                key={item.name}
                className={`py-3 px-2 flex items-center justify-between gap-3 rounded-[8px] transition-colors ${
                  isLeader ? 'bg-[#e8a54b]/[0.04] border border-[#e8a54b]/15' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getRankBadge(index)}
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#f2efe8] truncate">
                        {item.name}
                      </span>
                      {isLeader && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-[#e8a54b] text-[#1a1208] font-bold rounded">
                          Líder
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#a09b93] flex items-center gap-2">
                      <span className="tabular-nums">{item.count} contratos</span>
                      <span>·</span>
                      <span className="tabular-nums">{formatPercent(percentage)} da meta ind.</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#f2efe8] tabular-nums font-mono">
                    {formatCurrency(item.volume)}
                  </div>
                  <div className="text-[10px] text-[#3ecf8e]">
                    {item.volume >= item.individualGoal ? '● Meta Batida' : 'Em produção'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.07] text-[11px] text-[#6b6660] flex items-center justify-between">
        <span>Premiação do 1º lugar: +1.2% rebate geral</span>
        <span className="font-mono">Ciclo Nov/2026</span>
      </div>
    </div>
  );
};

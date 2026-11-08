import React, { useState } from 'react';
import { MarketRate, MarketNotice } from '../types.ts';
import {
  Megaphone,
  Plus,
} from 'lucide-react';

interface MarketNoticesAndRatesProps {
  rates?: MarketRate[];
  notices: MarketNotice[];
  canManageNotices?: boolean;
  onAddNotice?: (notice: Omit<MarketNotice, 'id'>) => void;
}

export const MarketNoticesAndRates: React.FC<MarketNoticesAndRatesProps> = ({
  rates,
  notices,
  canManageNotices = false,
  onAddNotice,
}) => {
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeSummary, setNoticeSummary] = useState('');
  const [noticeTag, setNoticeTag] = useState<MarketNotice['tag']>('COMUNICADO');
  const [noticePriority, setNoticePriority] = useState<MarketNotice['priority']>('normal');

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeSummary.trim()) return;

    if (onAddNotice) {
      onAddNotice({
        title: noticeTitle,
        summary: noticeSummary,
        date: 'Agora',
        tag: noticeTag,
        priority: noticePriority,
      });
    }

    setNoticeTitle('');
    setNoticeSummary('');
    setShowAddNoticeModal(false);
  };

  const getTagBadge = (tag: MarketNotice['tag']) => {
    switch (tag) {
      case 'OPERACIONAL':
        return 'bg-[#6ba3f5]/10 text-[#6ba3f5] border-[#6ba3f5]/20';
      case 'CAMPANHA':
        return 'bg-[#e8a54b]/10 text-[#e8a54b] border-[#e8a54b]/20';
      case 'MERCADO':
        return 'bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/20';
      case 'COMUNICADO':
      default:
        return 'bg-white/[0.08] text-[#f2efe8] border-white/[0.12]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mural de Recados & Avisos Operacionais */}
      <div className="darkroom-card p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.07]">
          <div>
            <h2 className="text-lg font-display font-bold text-[#f2efe8] tracking-tight flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#e8a54b]" />
              Mural de Recados & Comunicados Internos
            </h2>
            <p className="text-xs text-[#a09b93] mt-0.5">
              Alertas operacionais diários, manutenções de esteiras e campanhas ativas
            </p>
          </div>

          {canManageNotices && (
            <button
              onClick={() => setShowAddNoticeModal(true)}
              className="btn-darkroom-secondary px-3 py-1.5 rounded-[8px] text-xs font-medium flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#e8a54b]" />
              <span>Publicar Aviso</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-4 rounded-[10px] bg-[#121214] border transition-all ${
                notice.priority === 'high'
                  ? 'border-[#e8a54b]/30 bg-[#e8a54b]/[0.02]'
                  : 'border-white/[0.05]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${getTagBadge(
                    notice.tag
                  )}`}
                >
                  {notice.tag}
                </span>
                <span className="text-[11px] text-[#6b6660] font-mono">{notice.date}</span>
              </div>

              <h3 className="text-sm font-semibold text-[#f2efe8] mb-1.5 leading-snug">
                {notice.title}
              </h3>

              <p className="text-xs text-[#a09b93] leading-relaxed">
                {notice.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to add notice */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="darkroom-card max-w-md w-full p-6 shadow-2xl border border-white/10">
            <h3 className="text-base font-display font-bold text-[#f2efe8] mb-4">
              Publicar Novo Comunicado no Mural
            </h3>
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="text-xs text-[#a09b93] block mb-1">Título do Aviso</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="Ex: Liberação de Lote CIP Banco Santander"
                  className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-sm text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
                />
              </div>

              <div>
                <label className="text-xs text-[#a09b93] block mb-1">Conteúdo do Comunicado</label>
                <textarea
                  required
                  rows={3}
                  value={noticeSummary}
                  onChange={(e) => setNoticeSummary(e.target.value)}
                  placeholder="Detalhes operacionais e orientações para a equipe e correspondentes..."
                  className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-sm text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#a09b93] block mb-1">Categoria / Tag</label>
                  <select
                    value={noticeTag}
                    onChange={(e) => setNoticeTag(e.target.value as MarketNotice['tag'])}
                    className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
                  >
                    <option value="OPERACIONAL">OPERACIONAL</option>
                    <option value="CAMPANHA">CAMPANHA</option>
                    <option value="MERCADO">MERCADO</option>
                    <option value="COMUNICADO">COMUNICADO</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#a09b93] block mb-1">Prioridade</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as MarketNotice['priority'])}
                    className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">Alta (Destaque Âmbar)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-3.5 py-2 text-xs text-[#a09b93] hover:text-[#f2efe8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-amber-primary px-4 py-2 rounded-[8px] text-xs font-semibold"
                >
                  Publicar Aviso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

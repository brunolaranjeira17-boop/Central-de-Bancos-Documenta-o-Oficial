import React, { useState } from 'react';
import { InternalProposal, UserRole } from '../types.ts';
import { formatCurrency, formatDate, exportToCsv } from '../utils/formatters.ts';
import {
  Inbox,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  FileSpreadsheet,
  Send,
  UserCheck,
} from 'lucide-react';

interface MesaInternaProposalsProps {
  proposals: InternalProposal[];
  onOpenNewProposalModal: () => void;
  onUpdateProposalStatus: (id: string, newStatus: InternalProposal['status'], note?: string) => void;
  currentRole: UserRole;
}

export const MesaInternaProposals: React.FC<MesaInternaProposalsProps> = ({
  proposals,
  onOpenNewProposalModal,
  onUpdateProposalStatus,
  currentRole,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewingProposal, setReviewingProposal] = useState<InternalProposal | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const canReview = currentRole === 'ADMIN' || currentRole === 'ANALYST';

  const filteredProposals = proposals.filter((p) => {
    const matchesStatus = statusFilter === 'TODAS' || p.status === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.clientName.toLowerCase().includes(q) ||
      p.clientCpf.includes(q) ||
      p.proposalCode.toLowerCase().includes(q) ||
      p.targetBank.toLowerCase().includes(q) ||
      p.consultantName.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleExportCsv = () => {
    const headers = [
      'Código',
      'Cliente',
      'CPF/CNPJ',
      'Produto',
      'Banco Pretendido',
      'Valor Solicitado (R$)',
      'Prazo (Meses)',
      'Consultor / Parceiro',
      'Status',
      'Data de Envio',
      'Parecer do Analista',
    ];

    const rows = filteredProposals.map((p) => [
      p.proposalCode,
      p.clientName,
      p.clientCpf,
      p.productName,
      p.targetBank,
      p.requestedValue,
      p.termMonths,
      p.consultantName,
      p.status,
      p.submittedAt,
      p.analystNote || '',
    ]);

    exportToCsv(`propostas_mesa_interna_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const getStatusBadge = (status: InternalProposal['status']) => {
    switch (status) {
      case 'EM_ANALISE':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#e8a54b]/10 text-[#e8a54b] border border-[#e8a54b]/20">
            <Clock className="w-3 h-3 text-[#e8a54b]" />
            Em Análise de Mesa
          </span>
        );
      case 'APROVADA':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
            <CheckCircle className="w-3 h-3 text-[#3ecf8e]" />
            Aprovada
          </span>
        );
      case 'PENDENTE_DOCS':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#6ba3f5]/10 text-[#6ba3f5] border border-[#6ba3f5]/20">
            <AlertCircle className="w-3 h-3 text-[#6ba3f5]" />
            Pendente Documentação
          </span>
        );
      case 'RECUSADA':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ef6b6b]/10 text-[#ef6b6b] border border-[#ef6b6b]/20">
            <XCircle className="w-3 h-3 text-[#ef6b6b]" />
            Recusada / Inviável
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="darkroom-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
          <div>
            <h2 className="text-lg font-display font-bold text-[#f2efe8] tracking-tight flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#e8a54b]" />
              Mesa Interna de Crédito · Esteira de Propostas
            </h2>
            <p className="text-xs text-[#a09b93] mt-0.5">
              Fila direta de triagem prévia, validação de margem e parecer para formalização
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCsv}
              className="btn-darkroom-secondary px-3 py-1.5 rounded-[8px] text-xs font-medium flex items-center gap-1.5"
              title="Exportar dados das propostas em planilha CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#3ecf8e]" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={onOpenNewProposalModal}
              className="btn-amber-primary px-3.5 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Nova Proposta</span>
            </button>
          </div>
        </div>

        {/* Filters and search row */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a09b93]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, CPF, código ou banco..."
              className="w-full pl-9 pr-3 py-1.5 rounded-[8px] bg-[#121214] border border-white/[0.08] text-xs text-[#f2efe8] placeholder-[#6b6660] focus:outline-none focus:border-[#e8a54b]"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {['TODAS', 'EM_ANALISE', 'APROVADA', 'PENDENTE_DOCS', 'RECUSADA'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-[#e8a54b] text-[#1a1208] font-semibold'
                    : 'bg-[#121214] text-[#a09b93] hover:text-[#f2efe8] border border-white/[0.05]'
                }`}
              >
                {st === 'TODAS'
                  ? 'Todas'
                  : st === 'EM_ANALISE'
                  ? 'Em Análise'
                  : st === 'APROVADA'
                  ? 'Aprovadas'
                  : st === 'PENDENTE_DOCS'
                  ? 'Pendentes'
                  : 'Recusadas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proposals Table */}
      <div className="darkroom-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121214] border-b border-white/[0.07] text-[#a09b93] font-medium uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Código / Urgência</th>
                <th className="py-3 px-4">Cliente & Documento</th>
                <th className="py-3 px-4">Produto & Banco</th>
                <th className="py-3 px-4 text-right">Valor Pretendido</th>
                <th className="py-3 px-4">Consultor / Envio</th>
                <th className="py-3 px-4">Status & Parecer</th>
                {canReview && <th className="py-3 px-4 text-center">Ação</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#a09b93]">
                    Nenhuma proposta encontrada com os critérios informados.
                  </td>
                </tr>
              ) : (
                filteredProposals.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-[#f2efe8] font-bold">{item.proposalCode}</div>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono ${
                          item.urgency === 'VIP'
                            ? 'bg-[#e8a54b]/20 text-[#e8a54b] font-bold'
                            : item.urgency === 'ALTA'
                            ? 'bg-[#ef6b6b]/20 text-[#ef6b6b]'
                            : 'bg-white/[0.05] text-[#a09b93]'
                        }`}
                      >
                        Prioridade {item.urgency}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#f2efe8] font-semibold">{item.clientName}</div>
                      <div className="text-[11px] font-mono text-[#a09b93]">{item.clientCpf}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#f2efe8]">{item.productName}</div>
                      <div className="text-[11px] text-[#e8a54b]">{item.targetBank}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <div className="text-sm font-bold text-[#f2efe8]">
                        {formatCurrency(item.requestedValue)}
                      </div>
                      <div className="text-[11px] text-[#6b6660]">{item.termMonths} parcelas</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#f2efe8]">{item.consultantName}</div>
                      <div className="text-[10px] text-[#6b6660]">{formatDate(item.submittedAt)}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="mb-1">{getStatusBadge(item.status)}</div>
                      {item.analystNote && (
                        <p className="text-[11px] text-[#a09b93] max-w-xs truncate" title={item.analystNote}>
                          💬 {item.analystNote}
                        </p>
                      )}
                    </td>

                    {canReview && (
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setReviewingProposal(item);
                            setReviewNote(item.analystNote || '');
                          }}
                          className="px-2.5 py-1 rounded bg-[#1e1e24] hover:bg-[#e8a54b] hover:text-[#1a1208] text-[#f2efe8] text-[11px] font-medium border border-white/10 transition-colors"
                        >
                          Avaliar
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Proposal Modal */}
      {reviewingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="darkroom-card max-w-lg w-full p-6 shadow-2xl border border-white/10">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-[#e8a54b] uppercase">
                  Parecer da Mesa de Crédito
                </span>
                <h3 className="text-base font-display font-bold text-[#f2efe8]">
                  Proposta {reviewingProposal.proposalCode}
                </h3>
              </div>
              <button
                onClick={() => setReviewingProposal(null)}
                className="text-[#a09b93] hover:text-[#f2efe8] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-4 p-3 rounded-[8px] bg-[#121214] border border-white/[0.04] text-xs">
              <div className="flex justify-between">
                <span className="text-[#a09b93]">Cliente:</span>
                <span className="text-[#f2efe8] font-semibold">{reviewingProposal.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a09b93]">Valor Pretendido:</span>
                <span className="text-[#3ecf8e] font-mono font-bold">
                  {formatCurrency(reviewingProposal.requestedValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a09b93]">Banco / Produto:</span>
                <span className="text-[#f2efe8]">
                  {reviewingProposal.targetBank} · {reviewingProposal.productName}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#a09b93] block mb-1">
                  Parecer / Instruções do Analista:
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Ex: Margem conferida com sucesso no sistema. Proposta apta para envio da CCB ao cliente."
                  className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
                />
              </div>

              <div>
                <label className="text-xs text-[#a09b93] block mb-2">Definir Novo Status:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProposalStatus(reviewingProposal.id, 'APROVADA', reviewNote);
                      setReviewingProposal(null);
                    }}
                    className="py-2 px-3 rounded-[8px] bg-[#3ecf8e]/15 border border-[#3ecf8e]/30 text-[#3ecf8e] text-xs font-semibold hover:bg-[#3ecf8e]/25 transition-colors"
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProposalStatus(reviewingProposal.id, 'PENDENTE_DOCS', reviewNote);
                      setReviewingProposal(null);
                    }}
                    className="py-2 px-3 rounded-[8px] bg-[#6ba3f5]/15 border border-[#6ba3f5]/30 text-[#6ba3f5] text-xs font-semibold hover:bg-[#6ba3f5]/25 transition-colors"
                  >
                    Pendente Docs
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProposalStatus(reviewingProposal.id, 'RECUSADA', reviewNote);
                      setReviewingProposal(null);
                    }}
                    className="py-2 px-3 rounded-[8px] bg-[#ef6b6b]/15 border border-[#ef6b6b]/30 text-[#ef6b6b] text-xs font-semibold hover:bg-[#ef6b6b]/25 transition-colors"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { UserRole, UserProfile } from '../types.ts';
import { PROFILES } from '../mockData.ts';
import { ShieldCheck, Plus, Send, FileSpreadsheet, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: 'extranet' | 'intranet' | 'mesa' | 'historico';
  onTabChange: (tab: 'extranet' | 'intranet' | 'mesa' | 'historico') => void;
  onOpenNewSaleModal: () => void;
  onOpenNewProposalModal: () => void;
  onOpenExportModal: () => void;
  pendingProposalsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenNewSaleModal,
  onOpenNewProposalModal,
  onOpenExportModal,
  pendingProposalsCount,
}) => {
  const currentProfile: UserProfile = PROFILES[currentRole];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0b0d]/95 backdrop-blur-md border-b border-white/[0.07] px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#3ecf8e]/35 shadow-[0_0_16px_rgba(62,207,142,0.25)] bg-[#051a0e] shrink-0">
              <img
                src="/assets/aistudio/Captura_de_tela_2026-11-08_000939_2f9bf02e.png"
                alt="Logo Verde Norte Soluções"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg tracking-tight text-[#f2efe8] whitespace-nowrap">
                  Verde Norte
                </span>
                <span className="text-[11px] font-mono uppercase text-[#3ecf8e] bg-[#3ecf8e]/10 px-2 py-0.5 rounded-full border border-[#3ecf8e]/25">
                  Soluções
                </span>
              </div>
              <p className="text-[11px] text-[#a09b93] hidden sm:block">
                Central de Operações · Extranet & Intranet
              </p>
            </div>
          </div>

          {/* System Online Live Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#17171a] border border-white/[0.07] text-[11px] text-[#a09b93]">
            <span className="w-2 h-2 rounded-full bg-[#3ecf8e] dot-pulse" />
            <span className="text-[#f2efe8] font-medium hidden sm:inline">Esteiras Ativas</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line interactive tabs) */}
        <nav className="flex items-center gap-1 bg-[#121214] p-1 rounded-[10px] border border-white/[0.07] w-full md:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => onTabChange('extranet')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-[8px] whitespace-nowrap transition-all ${
              activeTab === 'extranet'
                ? 'bg-[#1e1e23] text-[#f2efe8] shadow-sm border border-white/[0.09]'
                : 'text-[#a09b93] hover:text-[#f2efe8]'
            }`}
          >
            Central de Bancos
          </button>

          <button
            onClick={() => onTabChange('intranet')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-[8px] whitespace-nowrap transition-all ${
              activeTab === 'intranet'
                ? 'bg-[#1e1e23] text-[#f2efe8] shadow-sm border border-white/[0.09]'
                : 'text-[#a09b93] hover:text-[#f2efe8]'
            }`}
          >
            Metas & KPIs
          </button>

          <button
            onClick={() => onTabChange('mesa')}
            className={`relative px-3.5 py-1.5 text-xs font-medium rounded-[8px] whitespace-nowrap transition-all ${
              activeTab === 'mesa'
                ? 'bg-[#1e1e23] text-[#f2efe8] shadow-sm border border-white/[0.09]'
                : 'text-[#a09b93] hover:text-[#f2efe8]'
            }`}
          >
            Mesa de Crédito
            {pendingProposalsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 font-mono text-[10px] bg-[#e8a54b] text-[#1a1208] font-bold rounded-full">
                {pendingProposalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('historico')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-[8px] whitespace-nowrap transition-all ${
              activeTab === 'historico'
                ? 'bg-[#1e1e23] text-[#f2efe8] shadow-sm border border-white/[0.09]'
                : 'text-[#a09b93] hover:text-[#f2efe8]'
            }`}
          >
            Produção Geral
          </button>
        </nav>

        {/* Zone 3: Actions & Profile Switcher */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Role Switcher Pill */}
          <div className="flex items-center bg-[#17171a] border border-white/[0.09] rounded-[10px] p-0.5">
            <span className="text-[10px] uppercase font-mono text-[#a09b93] px-2 hidden lg:inline">
              Perfil:
            </span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-xs text-[#f2efe8] font-medium py-1 px-2 focus:outline-none cursor-pointer"
              title="Trocar perfil de usuário para testar permissões"
            >
              <option value="ADMIN" className="bg-[#17171a] text-[#f2efe8]">
                Diretoria (Admin)
              </option>
              <option value="ANALYST" className="bg-[#17171a] text-[#f2efe8]">
                Analista de Mesa
              </option>
              <option value="CONSULTANT" className="bg-[#17171a] text-[#f2efe8]">
                Consultor / Parceiro
              </option>
            </select>
          </div>

          {/* Quick proposal button */}
          <button
            onClick={onOpenNewProposalModal}
            className="btn-darkroom-secondary px-3 py-1.5 rounded-[10px] text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
            title="Enviar proposta direto para a esteira da mesa interna"
          >
            <Send className="w-3.5 h-3.5 text-[#e8a54b]" />
            <span className="hidden sm:inline">Mesa Interna</span>
          </button>

          {/* Primary CTA: Register Sale */}
          <button
            onClick={onOpenNewSaleModal}
            className="btn-amber-primary px-3.5 py-1.5 rounded-[10px] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            title="Registrar contrato de venda liquidado ou aprovado"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Lançar Venda</span>
          </button>
        </div>

      </div>
    </header>
  );
};

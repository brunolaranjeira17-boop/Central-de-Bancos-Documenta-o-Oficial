import React, { useState, useMemo } from 'react';
import { Bank, BankCategory } from '../types.ts';
import { BankLogo } from './BankLogo.tsx';
import {
  Search,
  ExternalLink,
  Plus,
  FolderPlus,
  Edit2,
  Folder,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface BankCentralProps {
  banks: Bank[];
  categories: BankCategory[];
  onOpenAddBankModal: () => void;
  onOpenEditBankModal: (bank: Bank) => void;
  onOpenAddCategoryModal: () => void;
  canManageBanks?: boolean;
}

export const BankCentral: React.FC<BankCentralProps> = ({
  banks,
  categories,
  onOpenAddBankModal,
  onOpenEditBankModal,
  onOpenAddCategoryModal,
  canManageBanks = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Count banks per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { TODAS: banks.length };
    categories.forEach((cat) => {
      counts[cat.name] = banks.filter((b) => b.category === cat.name).length;
    });
    return counts;
  }, [banks, categories]);

  // Filtered banks
  const filteredBanks = useMemo(() => {
    return banks.filter((b) => {
      const matchesCategory =
        selectedCategory === 'TODAS' || b.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.notes.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [banks, selectedCategory, searchQuery]);

  const getStatusBadge = (status: Bank['status'], label: string) => {
    switch (status) {
      case 'OPERATING':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e] dot-pulse" />
            {label}
          </span>
        );
      case 'TOKEN_REQUIRED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#e8a54b]/10 text-[#e8a54b] border border-[#e8a54b]/25">
            <ShieldCheck className="w-3 h-3 text-[#e8a54b]" />
            {label}
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ef6b6b]/10 text-[#ef6b6b] border border-[#ef6b6b]/25">
            <AlertTriangle className="w-3 h-3 text-[#ef6b6b]" />
            {label}
          </span>
        );
      case 'HIGH_DEMAND':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#6ba3f5]/10 text-[#6ba3f5] border border-[#6ba3f5]/25">
            <Clock className="w-3 h-3 text-[#6ba3f5]" />
            {label}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-white">
            {label}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar: Search & Categorization & Manager CTAs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09b93]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por banco, código Bacen (ex: 033), observação ou regra..."
            className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-[#121214] border border-white/[0.08] text-sm text-[#f2efe8] placeholder-[#6b6660] focus:outline-none focus:border-[#e8a54b]/50 focus:ring-1 focus:ring-[#e8a54b]/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a09b93] hover:text-[#f2efe8]"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end lg:self-auto">
          {canManageBanks && (
            <>
              <button
                onClick={onOpenAddCategoryModal}
                className="btn-darkroom-secondary px-3.5 py-2 rounded-[10px] text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
                title="Criar nova pasta / categoria de produto"
              >
                <FolderPlus className="w-4 h-4 text-[#e8a54b]" />
                <span>Nova Pasta</span>
              </button>

              <button
                onClick={onOpenAddBankModal}
                className="btn-amber-primary px-4 py-2 rounded-[10px] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                title="Cadastrar novo parceiro bancário"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Cadastrar Banco</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Category Folders Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('TODAS')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'TODAS'
              ? 'bg-[#e8a54b] text-[#1a1208] font-semibold shadow-[0_2px_12px_rgba(232,165,75,0.25)]'
              : 'bg-[#121214] text-[#a09b93] hover:text-[#f2efe8] border border-white/[0.06]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Todas as Pastas</span>
          <span
            className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'TODAS'
                ? 'bg-[#1a1208]/20 text-[#1a1208]'
                : 'bg-white/[0.06] text-[#a09b93]'
            }`}
          >
            {categoryCounts['TODAS'] || 0}
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const count = categoryCounts[cat.name] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#e8a54b] text-[#1a1208] font-semibold shadow-[0_2px_12px_rgba(232,165,75,0.25)]'
                  : 'bg-[#121214] text-[#a09b93] hover:text-[#f2efe8] border border-white/[0.06]'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-[#1a1208]/20 text-[#1a1208]'
                    : 'bg-white/[0.06] text-[#a09b93]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Bank Cards */}
      {filteredBanks.length === 0 ? (
        <div className="darkroom-card p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5 text-[#a09b93]" />
          </div>
          <h3 className="text-base font-semibold text-[#f2efe8]">Nenhum banco encontrado</h3>
          <p className="text-xs text-[#a09b93] mt-1">
            Não encontramos resultados para sua busca ou pasta selecionada.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('TODAS');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-[#e8a54b] hover:text-[#f0b45e]"
          >
            Limpar filtros e exibir todos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBanks.map((bank) => (
            <div
              key={bank.id}
              className="darkroom-card darkroom-card-amber-hover p-5 flex flex-col justify-between group relative"
            >
              <div>
                {/* Header of the Card: Logo + Monogram + Badges */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <BankLogo
                      name={bank.name}
                      code={bank.code}
                      logoUrl={bank.logoUrl}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-display font-bold text-[#f2efe8] group-hover:text-[#e8a54b] transition-colors leading-tight">
                          {bank.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs text-[#e8a54b] font-medium">
                          Bacen {bank.code}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="text-xs text-[#a09b93] truncate max-w-[140px]">
                          {bank.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {canManageBanks && (
                    <button
                      onClick={() => onOpenEditBankModal(bank)}
                      className="p-1.5 rounded-[6px] text-[#a09b93] hover:text-[#e8a54b] hover:bg-white/[0.05] transition-colors"
                      title="Editar cadastro do banco"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status & Highlight Tag */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {getStatusBadge(bank.status, bank.statusLabel)}
                  {bank.highlightTag && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/[0.04] text-[#a09b93] border border-white/[0.06]">
                      {bank.highlightTag}
                    </span>
                  )}
                </div>

                {/* Commission info */}
                <div className="mb-3 px-3 py-2 rounded-[8px] bg-[#121214] border border-white/[0.04] flex items-center justify-between text-xs">
                  <span className="text-[#a09b93]">Repasse Comercial:</span>
                  <span className="text-[#f2efe8] font-mono font-semibold tabular-nums">
                    {bank.commissionRate}
                  </span>
                </div>

                {/* Operational Notes */}
                <p className="text-xs text-[#a09b93] leading-relaxed line-clamp-3 mb-4">
                  {bank.notes}
                </p>
              </div>

              {/* Direct Access Link */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-[#6b6660]">Esteira Homologada</span>
                <a
                  href={bank.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-amber-primary px-3.5 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 transition-transform"
                >
                  <span>Acessar Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

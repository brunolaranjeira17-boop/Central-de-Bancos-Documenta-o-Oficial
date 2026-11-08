import React, { useState, useEffect, useMemo } from 'react';
import {
  Bank,
  BankCategory,
  ProductGoal,
  ProductionContract,
  InternalProposal,
  MarketNotice,
  QuickDocument,
  UserRole,
} from './types.ts';
import {
  INITIAL_BANKS,
  INITIAL_CATEGORIES,
  INITIAL_GOALS,
  INITIAL_PRODUCTION,
  INITIAL_PROPOSALS,
  MARKET_RATES,
  MARKET_NOTICES,
  QUICK_DOCS,
  PROFILES,
} from './mockData.ts';
import { Header } from './components/Header.tsx';
import { ExecutiveKpis } from './components/ExecutiveKpis.tsx';
import { ProductPerformance } from './components/ProductPerformance.tsx';
import { TeamRanking, ConsultantScore } from './components/TeamRanking.tsx';
import { BankCentral } from './components/BankCentral.tsx';
import { MarketNoticesAndRates } from './components/MarketNoticesAndRates.tsx';
import { QuickDownloads } from './components/QuickDownloads.tsx';
import { MesaInternaProposals } from './components/MesaInternaProposals.tsx';
import { ProductionHistory } from './components/ProductionHistory.tsx';
import {
  ModalBank,
  ModalCategory,
  ModalSale,
  ModalGoals,
  ModalProposal,
} from './components/Modals.tsx';
import {
  Shield,
  Layers,
  Sparkles,
  RotateCcw,
  Building,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  // 1. Role State
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('vn_role');
    return (saved as UserRole) || 'ADMIN';
  });

  // 2. Active Tab State ('extranet' | 'intranet' | 'mesa' | 'historico')
  const [activeTab, setActiveTab] = useState<'extranet' | 'intranet' | 'mesa' | 'historico'>('extranet');

  // 3. Persistent Data States
  const [banks, setBanks] = useState<Bank[]>(() => {
    const saved = localStorage.getItem('vn_banks');
    return saved ? JSON.parse(saved) : INITIAL_BANKS;
  });

  const [categories, setCategories] = useState<BankCategory[]>(() => {
    const saved = localStorage.getItem('vn_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [goals, setGoals] = useState<ProductGoal[]>(() => {
    const saved = localStorage.getItem('vn_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [production, setProduction] = useState<ProductionContract[]>(() => {
    const saved = localStorage.getItem('vn_production');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTION;
  });

  const [proposals, setProposals] = useState<InternalProposal[]>(() => {
    const saved = localStorage.getItem('vn_proposals');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  const [notices, setNotices] = useState<MarketNotice[]>(() => {
    const saved = localStorage.getItem('vn_notices');
    return saved ? JSON.parse(saved) : MARKET_NOTICES;
  });

  const [documents, setDocuments] = useState<QuickDocument[]>(() => {
    const saved = localStorage.getItem('vn_documents');
    return saved ? JSON.parse(saved) : QUICK_DOCS;
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vn_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('vn_banks', JSON.stringify(banks));
  }, [banks]);

  useEffect(() => {
    localStorage.setItem('vn_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('vn_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('vn_production', JSON.stringify(production));
  }, [production]);

  useEffect(() => {
    localStorage.setItem('vn_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('vn_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('vn_documents', JSON.stringify(documents));
  }, [documents]);

  // Modals state
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankToEdit, setBankToEdit] = useState<Bank | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  // Dynamic Calculations for KPIs & Product Goals
  const { totalTarget, totalAchieved, productionByProduct, consultantScores } = useMemo(() => {
    const target = goals.reduce((acc, curr) => acc + curr.targetValue, 0);

    const byProd: Record<string, number> = {};
    const consultantMap: Record<string, { volume: number; count: number }> = {
      'Juliana Mendes': { volume: 0, count: 0 },
      'Rodrigo Cavalcante': { volume: 0, count: 0 },
      'Lucas Albuquerque': { volume: 0, count: 0 },
      'Fernanda Silveira': { volume: 0, count: 0 },
      'Marcos Vinicius': { volume: 0, count: 0 },
      'Camila Barreto': { volume: 0, count: 0 },
    };

    let achievedSum = 0;

    production.forEach((item) => {
      // Contracts in PAGO or APROVADO count towards target achievement
      if (item.status === 'PAGO' || item.status === 'APROVADO') {
        achievedSum += item.value;
        byProd[item.productId] = (byProd[item.productId] || 0) + item.value;

        if (!consultantMap[item.consultantName]) {
          consultantMap[item.consultantName] = { volume: 0, count: 0 };
        }
        consultantMap[item.consultantName].volume += item.value;
        consultantMap[item.consultantName].count += 1;
      }
    });

    const cScores: ConsultantScore[] = Object.entries(consultantMap).map(([name, data]) => ({
      name,
      volume: data.volume,
      count: data.count,
      individualGoal: 2000000, // Individual baseline goal R$ 2.000.000
    }));

    return {
      totalTarget: target,
      totalAchieved: achievedSum,
      productionByProduct: byProd,
      consultantScores: cScores,
    };
  }, [goals, production]);

  const pendingProposalsCount = useMemo(() => {
    return proposals.filter((p) => p.status === 'EM_ANALISE').length;
  }, [proposals]);

  // Handlers for Data Mutations
  const handleSaveBank = (savedBank: Bank) => {
    setBanks((prev) => {
      const idx = prev.findIndex((b) => b.id === savedBank.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedBank;
        return next;
      }
      return [savedBank, ...prev];
    });
    showToast(`Banco "${savedBank.name}" salvo com sucesso!`);
  };

  const handleSaveCategory = (newCategory: BankCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    showToast(`Pasta "${newCategory.name}" criada com sucesso!`);
  };

  const handleSaveSale = (newContract: ProductionContract) => {
    setProduction((prev) => [newContract, ...prev]);
    showToast(`Contrato ${newContract.contractNumber} de ${newContract.clientName} registrado!`);
  };

  const handleSaveGoals = (updatedGoals: ProductGoal[]) => {
    setGoals(updatedGoals);
    showToast('Metas corporativas atualizadas com sucesso!');
  };

  const handleSaveProposal = (newProposal: InternalProposal) => {
    setProposals((prev) => [newProposal, ...prev]);
    showToast(`Proposta ${newProposal.proposalCode} enviada para a Mesa de Crédito!`);
  };

  const handleUpdateProposalStatus = (
    id: string,
    newStatus: InternalProposal['status'],
    note?: string
  ) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus, analystNote: note || p.analystNote } : p))
    );
    showToast(`Proposta atualizada para "${newStatus}"!`);
  };

  const handleAddNotice = (newNoticeData: Omit<MarketNotice, 'id'>) => {
    const notice: MarketNotice = {
      id: `not-${Date.now()}`,
      ...newNoticeData,
    };
    setNotices((prev) => [notice, ...prev]);
    showToast('Aviso publicado com sucesso no Mural!');
  };

  const handleAddDocument = (newDoc: QuickDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Documento "${newDoc.title}" anexado com sucesso!`);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast('Documento removido da central de downloads.');
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados originais de demonstração da Verde Norte?')) {
      localStorage.clear();
      setBanks(INITIAL_BANKS);
      setCategories(INITIAL_CATEGORIES);
      setGoals(INITIAL_GOALS);
      setProduction(INITIAL_PRODUCTION);
      setProposals(INITIAL_PROPOSALS);
      setNotices(MARKET_NOTICES);
      setDocuments(QUICK_DOCS);
      showToast('Dados de demonstração restaurados com sucesso.');
    }
  };

  // Permissions based on currentRole
  const canManageBanks = currentRole === 'ADMIN';
  const canEditGoals = currentRole === 'ADMIN';
  const canManageNotices = currentRole === 'ADMIN' || currentRole === 'ANALYST';

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#f2efe8] relative flex flex-col justify-between selection:bg-[#e8a54b]/30 selection:text-[#f2efe8]">
      {/* Visual Signatures: Film Grain & Ambient Atmospheric Glows */}
      <div className="darkroom-grain" aria-hidden="true" />
      <div className="darkroom-glow-top" aria-hidden="true" />
      <div className="darkroom-glow-bottom" aria-hidden="true" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Bar Header */}
        <Header
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenNewSaleModal={() => setIsSaleModalOpen(true)}
          onOpenNewProposalModal={() => setIsProposalModalOpen(true)}
          onOpenExportModal={() => setActiveTab('historico')}
          pendingProposalsCount={pendingProposalsCount}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[10px] bg-[#1a1815] border border-[#e8a54b]/40 text-xs font-semibold text-[#f2efe8] shadow-[0_8px_30px_rgba(0,0,0,0.6)] animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#3ecf8e]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Hero Context & Switcher Banner */}
        <section className="px-4 sm:px-8 pt-6 pb-4 max-w-7xl mx-auto w-full no-print">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.07] pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-[#e8a54b]">
                  {activeTab === 'extranet' && 'Extranet Operacional · Módulo Bancário'}
                  {activeTab === 'intranet' && 'Intranet Corporativa · Metas & Produção'}
                  {activeTab === 'mesa' && 'Mesa de Crédito · Fila Interna'}
                  {activeTab === 'historico' && 'Livro de Contratos · Contabilidade Comercial'}
                </span>
                <span className="text-white/20">/</span>
                <span className="text-xs text-[#a09b93]">
                  {PROFILES[currentRole].name} ({PROFILES[currentRole].department})
                </span>
              </div>

              {activeTab !== 'extranet' && (
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#f2efe8] tracking-tight">
                  {activeTab === 'intranet' && 'Metas Financeiras, Faróis & Performance'}
                  {activeTab === 'mesa' && 'Esteira de Propostas & Pareceres de Mesa'}
                  {activeTab === 'historico' && 'Histórico Consolidado de Produção'}
                </h1>
              )}
            </div>

            {/* Quick module stats bar */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-[8px] bg-[#121214] border border-white/[0.06] text-right">
                <span className="text-[10px] text-[#a09b93] block">Bancos Homologados</span>
                <span className="font-mono text-sm font-bold text-[#f2efe8] tabular-nums">
                  {banks.length} instituições
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-[8px] bg-[#121214] border border-white/[0.06] text-right">
                <span className="text-[10px] text-[#a09b93] block">Volume Produzido</span>
                <span className="font-mono text-sm font-bold text-[#3ecf8e] tabular-nums">
                  {totalAchieved.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Viewport */}
        <main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full flex-1 space-y-8">
          
          {/* TAB 1: EXTRANET (Central de Bancos + Mural de Recados & Taxas + Downloads Rápidos) */}
          {activeTab === 'extranet' && (
            <div className="space-y-8">
              {/* Central de Bancos Grid with Folder Filter & Real-time Search */}
              <BankCentral
                banks={banks}
                categories={categories}
                onOpenAddBankModal={() => {
                  setBankToEdit(null);
                  setIsBankModalOpen(true);
                }}
                onOpenEditBankModal={(bank) => {
                  setBankToEdit(bank);
                  setIsBankModalOpen(true);
                }}
                onOpenAddCategoryModal={() => setIsCategoryModalOpen(true)}
                canManageBanks={canManageBanks}
              />

              {/* Mural de Recados & Taxas de Mercado */}
              <MarketNoticesAndRates
                rates={MARKET_RATES}
                notices={notices}
                canManageNotices={canManageNotices}
                onAddNotice={handleAddNotice}
              />

              {/* Downloads Rápidos de Manuais e Termos */}
              <QuickDownloads
                documents={documents}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
                canManageDocuments={true}
              />
            </div>
          )}

          {/* TAB 2: INTRANET (Metas Financeiras, KPIs, Faróis de Desempenho & Ranking da Equipe) */}
          {activeTab === 'intranet' && (
            <div className="space-y-8">
              {/* Executive KPI Cards */}
              <ExecutiveKpis
                totalTarget={totalTarget}
                totalAchieved={totalAchieved}
                totalContractsCount={production.filter((p) => p.status === 'PAGO' || p.status === 'APROVADO').length}
                onOpenGoalsModal={() => setIsGoalsModalOpen(true)}
                canEditGoals={canEditGoals}
              />

              {/* 2-Column Split: Faróis de Desempenho por Produto & Ranking da Equipe */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-7">
                  <ProductPerformance
                    goals={goals}
                    productionByProduct={productionByProduct}
                    onEditGoal={() => setIsGoalsModalOpen(true)}
                    canEditGoals={canEditGoals}
                  />
                </div>

                <div className="lg:col-span-5">
                  <TeamRanking consultants={consultantScores} />
                </div>
              </div>

              {/* Histórico Recente de Operações */}
              <ProductionHistory
                production={production.slice(0, 8)}
                onOpenNewSaleModal={() => setIsSaleModalOpen(true)}
                canAddSale={true}
              />
            </div>
          )}

          {/* TAB 3: MESA DE CRÉDITO (Propostas Internas, Análise & Parecer) */}
          {activeTab === 'mesa' && (
            <MesaInternaProposals
              proposals={proposals}
              onOpenNewProposalModal={() => setIsProposalModalOpen(true)}
              onUpdateProposalStatus={handleUpdateProposalStatus}
              currentRole={currentRole}
            />
          )}

          {/* TAB 4: PRODUÇÃO GERAL & HISTÓRICO CONSOLIDADO */}
          {activeTab === 'historico' && (
            <ProductionHistory
              production={production}
              onOpenNewSaleModal={() => setIsSaleModalOpen(true)}
              canAddSale={true}
            />
          )}
        </main>
      </div>

      {/* Modals Container */}
      <ModalBank
        isOpen={isBankModalOpen}
        onClose={() => {
          setIsBankModalOpen(false);
          setBankToEdit(null);
        }}
        onSave={handleSaveBank}
        categories={categories}
        bankToEdit={bankToEdit}
      />

      <ModalCategory
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      <ModalSale
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSave={handleSaveSale}
        goals={goals}
        banks={banks}
        consultantDefault={PROFILES[currentRole].name}
      />

      <ModalGoals
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        goals={goals}
        onSaveGoals={handleSaveGoals}
      />

      <ModalProposal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        onSave={handleSaveProposal}
        goals={goals}
        banks={banks}
        consultantDefault={PROFILES[currentRole].name}
      />

      {/* Discrete Darkroom Footer */}
      <footer className="mt-12 border-t border-white/[0.07] py-6 px-4 sm:px-8 bg-[#0b0b0d] text-xs text-[#a09b93] relative z-10 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/Captura_de_tela_2026-11-08_000939_2f9bf02e.png"
              alt="Logo Verde Norte Soluções"
              className="w-6 h-6 rounded-full object-cover border border-[#3ecf8e]/30"
            />
            <span className="font-display font-bold text-[#f2efe8]">
              Verde Norte Soluções
            </span>
            <span className="text-white/20">·</span>
            <span>Plataforma Integrada Extranet & Intranet</span>
            <span className="text-white/20">·</span>
            <span className="font-mono text-[11px] text-[#e8a54b]">Darkroom Studio 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 text-[#6b6660] hover:text-[#e8a54b] transition-colors"
              title="Restaurar dados de teste para o padrão inicial"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Demonstração</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

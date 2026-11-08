import React, { useState, useEffect } from 'react';
import {
  Bank,
  BankCategory,
  ProductGoal,
  ProductionContract,
  InternalProposal,
  UserRole,
} from '../types.ts';
import { BankLogo } from './BankLogo.tsx';
import {
  X,
  Building2,
  FolderPlus,
  BadgeDollarSign,
  Target,
  Send,
  Sparkles,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 1. Modal: Cadastrar / Editar Banco                                         */
/* -------------------------------------------------------------------------- */
interface ModalBankProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bank: Bank) => void;
  categories: BankCategory[];
  bankToEdit?: Bank | null;
}

export const ModalBank: React.FC<ModalBankProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  bankToEdit,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [url, setUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [status, setStatus] = useState<Bank['status']>('OPERATING');
  const [notes, setNotes] = useState('');
  const [commissionRate, setCommissionRate] = useState('14.0% a 18.0%');
  const [highlightTag, setHighlightTag] = useState('');

  useEffect(() => {
    if (bankToEdit) {
      setName(bankToEdit.name);
      setCode(bankToEdit.code);
      setCategory(bankToEdit.category);
      setUrl(bankToEdit.url);
      setLogoUrl(bankToEdit.logoUrl || '');
      setStatus(bankToEdit.status);
      setNotes(bankToEdit.notes);
      setCommissionRate(bankToEdit.commissionRate);
      setHighlightTag(bankToEdit.highlightTag || '');
    } else {
      setName('');
      setCode('');
      setCategory(categories[0]?.name || 'Crédito Consignado');
      setUrl('https://');
      setLogoUrl('');
      setStatus('OPERATING');
      setNotes('');
      setCommissionRate('12.0% a 16.5%');
      setHighlightTag('Esteira Digital');
    }
  }, [bankToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !url.trim()) return;

    let statusLabel = 'Operando 100%';
    if (status === 'TOKEN_REQUIRED') statusLabel = 'Token Obrigatório';
    if (status === 'MAINTENANCE') statusLabel = 'Manutenção CIP';
    if (status === 'HIGH_DEMAND') statusLabel = 'Alta Demanda';

    const savedBank: Bank = {
      id: bankToEdit ? bankToEdit.id : `bank-${Date.now()}`,
      name: name.trim(),
      code: code.trim(),
      category: category || categories[0]?.name || 'Geral',
      url: url.trim(),
      logoUrl: logoUrl.trim() || undefined,
      status,
      statusLabel,
      notes: notes.trim() || 'Esteira padrão homologada na Verde Norte Soluções.',
      commissionRate: commissionRate.trim() || 'Sob consulta',
      highlightTag: highlightTag.trim() || undefined,
    };

    onSave(savedBank);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="darkroom-card max-w-xl w-full p-6 shadow-2xl border border-white/10 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#e8a54b]/15 border border-[#e8a54b]/30 flex items-center justify-center text-[#e8a54b]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-[#f2efe8]">
                {bankToEdit ? 'Editar Dados do Banco' : 'Cadastrar Novo Banco Parceiro'}
              </h3>
              <p className="text-[11px] text-[#a09b93]">
                Central de Bancos & Regras de Acesso Operacional
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#a09b93] hover:text-[#f2efe8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Live Logo Preview Box */}
          <div className="p-3.5 rounded-[10px] bg-[#121214] border border-white/[0.06] flex items-center gap-3.5">
            <BankLogo
              name={name || 'Nome do Banco'}
              code={code || '000'}
              logoUrl={logoUrl || undefined}
              size="lg"
            />
            <div>
              <span className="text-[10px] font-mono text-[#e8a54b] uppercase block">
                Pré-visualização da Logomarca / Fallback Âmbar
              </span>
              <p className="text-[11px] text-[#a09b93] mt-0.5">
                Se a URL for inválida ou não informada, o sistema aplica o avatar estilizado Darkroom Studio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[#a09b93] block mb-1">Nome Oficial da Instituição</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Banco Santander, Caixa Econômica, Daycoval"
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
              />
            </div>

            <div>
              <label className="text-[#a09b93] block mb-1">Código Bacen (Sigla)</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: 033, 104, 707"
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#a09b93] block mb-1">Pasta / Categoria de Produto</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#a09b93] block mb-1">Status de Operação</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Bank['status'])}
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
              >
                <option value="OPERATING">Operando 100% (Verde)</option>
                <option value="TOKEN_REQUIRED">Token Obrigatório (Âmbar)</option>
                <option value="MAINTENANCE">Manutenção CIP (Vermelho)</option>
                <option value="HIGH_DEMAND">Alta Demanda (Azul)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[#a09b93] block mb-1">URL Direta de Acesso ao Portal do Banco</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://correspondente.banco.com.br"
              className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b] font-mono"
            />
          </div>

          <div>
            <label className="text-[#a09b93] block mb-1">
              URL da Logomarca (PNG / SVG / WebP)
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://exemplo.com/logo-banco.png (opcional)"
              className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b] font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#a09b93] block mb-1">Repasse Comercial Médio</label>
              <input
                type="text"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="Ex: 14.5% a 18.0%"
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[#a09b93] block mb-1">Destaque / Tag Operacional</label>
              <input
                type="text"
                value={highlightTag}
                onChange={(e) => setHighlightTag(e.target.value)}
                placeholder="Ex: Esteira Rápida, D+0 Comissões"
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[#a09b93] block mb-1">
              Observações Operacionais & Exigências de Acesso
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruções sobre certificados A1, horários de lote de averbação, rotinas de validação de biometria facial, etc."
              className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] text-xs text-[#a09b93] hover:text-[#f2efe8]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-amber-primary px-5 py-2 rounded-[8px] text-xs font-semibold cursor-pointer"
            >
              {bankToEdit ? 'Salvar Alterações' : 'Cadastrar Banco'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Modal: Criar Nova Pasta / Categoria                                     */
/* -------------------------------------------------------------------------- */
interface ModalCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: BankCategory) => void;
}

export const ModalCategory: React.FC<ModalCategoryProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: `cat-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Categoria de operações homologada.',
    });

    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="darkroom-card max-w-md w-full p-6 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-[#e8a54b]" />
            <h3 className="text-base font-display font-bold text-[#f2efe8]">
              Criar Nova Pasta de Bancos
            </h3>
          </div>
          <button onClick={onClose} className="text-[#a09b93] hover:text-[#f2efe8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[#a09b93] block mb-1">Nome da Pasta / Linha</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Financiamento de Veículos Leves, Câmbio & Comex"
              className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
            />
          </div>

          <div>
            <label className="text-[#a09b93] block mb-1">Descrição Operacional</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Regras resumidas para essa esteira..."
              className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs text-[#a09b93] hover:text-[#f2efe8]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-amber-primary px-4 py-2 rounded-[8px] text-xs font-semibold"
            >
              Criar Pasta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Modal: Registrar Produção / Venda (Instant calculation on goals)       */
/* -------------------------------------------------------------------------- */
interface ModalSaleProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: ProductionContract) => void;
  goals: ProductGoal[];
  banks: Bank[];
  consultantDefault?: string;
}

export const ModalSale: React.FC<ModalSaleProps> = ({
  isOpen,
  onClose,
  onSave,
  goals,
  banks,
  consultantDefault = 'Juliana Mendes',
}) => {
  const [clientName, setClientName] = useState('');
  const [clientDocument, setClientDocument] = useState('');
  const [productId, setProductId] = useState(goals[0]?.id || '');
  const [bankId, setBankId] = useState(banks[0]?.id || '');
  const [value, setValue] = useState('');
  const [consultantName, setConsultantName] = useState(consultantDefault);
  const [status, setStatus] = useState<ProductionContract['status']>('PAGO');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (goals.length > 0 && !productId) setProductId(goals[0].id);
    if (banks.length > 0 && !bankId) setBankId(banks[0].id);
  }, [goals, banks, productId, bankId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseFloat(value.replace(/\D/g, '')) / 100;
    if (!clientName.trim() || !numericValue || numericValue <= 0) return;

    const selectedProduct = goals.find((g) => g.id === productId);
    const selectedBank = banks.find((b) => b.id === bankId);

    const newContract: ProductionContract = {
      id: `CTR-${Math.floor(10000 + Math.random() * 90000)}`,
      contractNumber: `CTR-${Math.floor(10000 + Math.random() * 90000)}`,
      clientName: clientName.trim(),
      clientDocument: clientDocument.trim() || '000.000.000-00',
      productId: productId || goals[0]?.id || 'prod-consignado',
      productName: selectedProduct?.name || 'Operação Homologada',
      bankId: bankId || banks[0]?.id || 'bank-santander',
      bankName: selectedBank?.name || 'Banco Santander',
      value: numericValue,
      consultantName: consultantName.trim() || 'Juliana Mendes',
      status,
      date: new Date().toISOString(),
      notes: notes.trim(),
    };

    onSave(newContract);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="darkroom-card max-w-lg w-full p-6 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BadgeDollarSign className="w-5 h-5 text-[#3ecf8e]" />
            <div>
              <h3 className="text-base font-display font-bold text-[#f2efe8]">
                Lançar Nova Produção / Contrato
              </h3>
              <p className="text-[11px] text-[#a09b93]">
                Calculado instantaneamente sobre as metas e ranking da equipe
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#a09b93] hover:text-[#f2efe8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#a09b93] block mb-1">Nome do Cliente / Empresa</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Carlos Eduardo de Oliveira"
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
              />
            </div>
            <div>
              <label className="text-[#a09b93] block mb-1">CPF ou CNPJ</label>
              <input
                type="text"
                required
                value={clientDocument}
                onChange={(e) => setClientDocument(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#a09b93] block mb-1">Produto Financeiro</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#a09b93] block mb-1">Banco Liquidante</label>
              <select
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
              >
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#a09b93] block mb-1">Valor do Contrato (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09b93] font-mono">
                  R$
                </span>
                <input
                  type="text"
                  required
                  value={value}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    const formatted = (Number(raw) / 100).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    });
                    setValue(raw ? formatted : '');
                  }}
                  placeholder="0,00"
                  className="w-full pl-9 pr-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#3ecf8e] font-bold font-mono focus:outline-none focus:border-[#e8a54b]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#a09b93] block mb-1">Consultor Comercial</label>
              <select
                value={consultantName}
                onChange={(e) => setConsultantName(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
              >
                <option value="Juliana Mendes">Juliana Mendes</option>
                <option value="Rodrigo Cavalcante">Rodrigo Cavalcante</option>
                <option value="Lucas Albuquerque">Lucas Albuquerque</option>
                <option value="Fernanda Silveira">Fernanda Silveira</option>
                <option value="Marcos Vinicius">Marcos Vinicius</option>
                <option value="Camila Barreto">Camila Barreto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[#a09b93] block mb-1">Status da Operação</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductionContract['status'])}
              className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
            >
              <option value="PAGO">Liquidado / Pago na Conta (Soma na Meta Total)</option>
              <option value="APROVADO">Aprovado (CCB Emitida - Soma na Meta Total)</option>
              <option value="EM_ANALISE">Em Análise de Crédito</option>
              <option value="AGUARDANDO_AVERBACAO">Aguardando Averbação Dataprev/CIP</option>
            </select>
          </div>

          <div>
            <label className="text-[#a09b93] block mb-1">Observações da Operação</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Portabilidade 84 parcelas; troco de R$ 14.500 liberado."
              className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#a09b93] hover:text-[#f2efe8]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-amber-primary px-5 py-2 rounded-[8px] text-xs font-semibold"
            >
              Registrar Produção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. Modal: Definir / Atualizar Metas Individuais por Produto                */
/* -------------------------------------------------------------------------- */
interface ModalGoalsProps {
  isOpen: boolean;
  onClose: () => void;
  goals: ProductGoal[];
  onSaveGoals: (updatedGoals: ProductGoal[]) => void;
}

export const ModalGoals: React.FC<ModalGoalsProps> = ({
  isOpen,
  onClose,
  goals,
  onSaveGoals,
}) => {
  const [localGoals, setLocalGoals] = useState<ProductGoal[]>(goals);

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals, isOpen]);

  if (!isOpen) return null;

  const handleValueChange = (id: string, newTarget: number) => {
    setLocalGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, targetValue: newTarget } : g))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGoals(localGoals);
    onClose();
  };

  const totalCalculated = localGoals.reduce((acc, curr) => acc + curr.targetValue, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="darkroom-card max-w-lg w-full p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#e8a54b]" />
            <div>
              <h3 className="text-base font-display font-bold text-[#f2efe8]">
                Definir Metas Financeiras por Produto
              </h3>
              <p className="text-[11px] text-[#a09b93]">
                Alvos corporativos para o ciclo mensal da Verde Norte Soluções
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#a09b93] hover:text-[#f2efe8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-3">
            {localGoals.map((goal) => (
              <div
                key={goal.id}
                className="p-3 rounded-[8px] bg-[#121214] border border-white/[0.05] flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-semibold text-[#f2efe8] block">{goal.name}</span>
                  <span className="text-[10px] text-[#a09b93]">{goal.category}</span>
                </div>

                <div className="relative w-44">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a09b93] font-mono text-xs">
                    R$
                  </span>
                  <input
                    type="number"
                    step="50000"
                    value={goal.targetValue}
                    onChange={(e) => handleValueChange(goal.id, Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-[6px] bg-[#17171a] border border-white/10 text-xs font-mono font-bold text-[#e8a54b] focus:outline-none focus:border-[#e8a54b]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-[8px] bg-[#e8a54b]/10 border border-[#e8a54b]/20 flex items-center justify-between">
            <span className="text-xs font-medium text-[#f2efe8]">Soma Total das Metas:</span>
            <span className="text-base font-bold text-[#e8a54b] font-mono tabular-nums">
              {totalCalculated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#a09b93] hover:text-[#f2efe8]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-amber-primary px-5 py-2 rounded-[8px] text-xs font-semibold cursor-pointer"
            >
              Salvar Metas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. Modal: Enviar Proposta para Mesa Interna                                */
/* -------------------------------------------------------------------------- */
interface ModalProposalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (proposal: InternalProposal) => void;
  goals: ProductGoal[];
  banks: Bank[];
  consultantDefault?: string;
}

export const ModalProposal: React.FC<ModalProposalProps> = ({
  isOpen,
  onClose,
  onSave,
  goals,
  banks,
  consultantDefault = 'Juliana Mendes',
}) => {
  const [clientName, setClientName] = useState('');
  const [clientCpf, setClientCpf] = useState('');
  const [productId, setProductId] = useState(goals[0]?.id || '');
  const [targetBank, setTargetBank] = useState(banks[0]?.name || 'Banco Santander');
  const [requestedValue, setRequestedValue] = useState('');
  const [termMonths, setTermMonths] = useState(84);
  const [urgency, setUrgency] = useState<InternalProposal['urgency']>('NORMAL');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseFloat(requestedValue.replace(/\D/g, '')) / 100;
    if (!clientName.trim() || !numericValue) return;

    const selectedProduct = goals.find((g) => g.id === productId);

    const newProposal: InternalProposal = {
      id: `PRP-2026-${Math.floor(400 + Math.random() * 500)}`,
      proposalCode: `PRP-2026-${Math.floor(400 + Math.random() * 500)}`,
      clientName: clientName.trim(),
      clientCpf: clientCpf.trim() || '000.000.000-00',
      productId: productId || goals[0]?.id || 'prod-consignado',
      productName: selectedProduct?.name || 'Crédito Consignado INSS',
      targetBank: targetBank || 'Banco Santander',
      requestedValue: numericValue,
      termMonths: Number(termMonths) || 84,
      consultantName: consultantDefault,
      status: 'EM_ANALISE',
      analystNote: 'Proposta recebida na esteira digital da Mesa Interna. Em conferência de documentos.',
      submittedAt: new Date().toISOString(),
      urgency,
    };

    onSave(newProposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="darkroom-card max-w-lg w-full p-6 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-[#e8a54b]" />
            <div>
              <h3 className="text-base font-display font-bold text-[#f2efe8]">
                Enviar Proposta para Mesa Interna
              </h3>
              <p className="text-[11px] text-[#a09b93]">
                Triagem imediata e esteira direta de aprovação de crédito
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#a09b93] hover:text-[#f2efe8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#a09b93] block mb-1">Nome Completo do Cliente</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Carlos Nogueira Fontes"
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
              />
            </div>
            <div>
              <label className="text-[#a09b93] block mb-1">CPF do Titular</label>
              <input
                type="text"
                required
                value={clientCpf}
                onChange={(e) => setClientCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#a09b93] block mb-1">Linha de Crédito / Produto</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#a09b93] block mb-1">Banco Indicado</label>
              <select
                value={targetBank}
                onChange={(e) => setTargetBank(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
              >
                {banks.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[#a09b93] block mb-1">Valor Solicitado (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09b93] font-mono">
                  R$
                </span>
                <input
                  type="text"
                  required
                  value={requestedValue}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    const formatted = (Number(raw) / 100).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    });
                    setRequestedValue(raw ? formatted : '');
                  }}
                  placeholder="0,00"
                  className="w-full pl-9 pr-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs font-mono font-bold text-[#e8a54b] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[#a09b93] block mb-1">Prazo (Meses)</label>
              <input
                type="number"
                min="12"
                max="420"
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value) || 84)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#a09b93] block mb-1">Prioridade / Urgência</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as InternalProposal['urgency'])}
                className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none"
              >
                <option value="NORMAL">Normal (Até 24h úteis)</option>
                <option value="ALTA">Alta (Até 4h úteis)</option>
                <option value="VIP">VIP / Grandes Tickets (Prioridade Imediata)</option>
              </select>
            </div>
            <div>
              <label className="text-[#a09b93] block mb-1">Consultor Responsável</label>
              <input
                type="text"
                disabled
                value={consultantDefault}
                className="w-full px-3 py-2 rounded-[8px] bg-[#17171a] border border-white/5 text-xs text-[#a09b93] cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-[#a09b93] block mb-1">
              Observações / Informações de Documentos Anexos
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: CNH e comprovante de endereço conferidos. Cliente sem restrições impeditivas."
              className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#a09b93] hover:text-[#f2efe8]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-amber-primary px-5 py-2 rounded-[8px] text-xs font-semibold cursor-pointer"
            >
              Disparar para a Mesa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

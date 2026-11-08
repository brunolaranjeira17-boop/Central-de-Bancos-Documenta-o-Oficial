import React, { useState } from 'react';
import { ProductionContract, ProductionStatus } from '../types.ts';
import { formatCurrency, formatDate, exportToCsv } from '../utils/formatters.ts';
import {
  FileSpreadsheet,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  Layers,
} from 'lucide-react';

interface ProductionHistoryProps {
  production: ProductionContract[];
  onOpenNewSaleModal: () => void;
  canAddSale?: boolean;
}

export const ProductionHistory: React.FC<ProductionHistoryProps> = ({
  production,
  onOpenNewSaleModal,
  canAddSale = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [productFilter, setProductFilter] = useState<string>('TODOS');

  // Unique products for secondary filter
  const productOptions = Array.from(new Set(production.map((p) => p.productName)));

  const filtered = production.filter((item) => {
    const matchesStatus = statusFilter === 'TODOS' || item.status === statusFilter;
    const matchesProduct = productFilter === 'TODOS' || item.productName === productFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.clientName.toLowerCase().includes(q) ||
      item.contractNumber.toLowerCase().includes(q) ||
      item.clientDocument.includes(q) ||
      item.consultantName.toLowerCase().includes(q) ||
      item.bankName.toLowerCase().includes(q);

    return matchesStatus && matchesProduct && matchesSearch;
  });

  const handleExportCsv = () => {
    const headers = [
      'Contrato',
      'Cliente',
      'Documento',
      'Produto',
      'Banco',
      'Valor Líquido (R$)',
      'Consultor Comercial',
      'Status',
      'Data / Hora',
      'Observações',
    ];

    const rows = filtered.map((c) => [
      c.contractNumber,
      c.clientName,
      c.clientDocument,
      c.productName,
      c.bankName,
      c.value,
      c.consultantName,
      c.status,
      c.date,
      c.notes || '',
    ]);

    exportToCsv(`relatorio_producao_verde_norte_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: ProductionStatus) => {
    switch (status) {
      case 'PAGO':
        return (
          <span className="flex items-center gap-1 font-mono text-[11px] font-medium text-[#3ecf8e] bg-[#3ecf8e]/10 px-2 py-0.5 rounded-full border border-[#3ecf8e]/20">
            <CheckCircle2 className="w-3 h-3" />
            Liquidado / Pago
          </span>
        );
      case 'APROVADO':
        return (
          <span className="flex items-center gap-1 font-mono text-[11px] font-medium text-[#e8a54b] bg-[#e8a54b]/10 px-2 py-0.5 rounded-full border border-[#e8a54b]/20">
            <Clock className="w-3 h-3" />
            Aprovado (CCB Emitida)
          </span>
        );
      case 'EM_ANALISE':
        return (
          <span className="flex items-center gap-1 font-mono text-[11px] font-medium text-[#6ba3f5] bg-[#6ba3f5]/10 px-2 py-0.5 rounded-full border border-[#6ba3f5]/20">
            <Clock className="w-3 h-3" />
            Em Análise de Crédito
          </span>
        );
      case 'AGUARDANDO_AVERBACAO':
      default:
        return (
          <span className="flex items-center gap-1 font-mono text-[11px] font-medium text-[#ef6b6b] bg-[#ef6b6b]/10 px-2 py-0.5 rounded-full border border-[#ef6b6b]/20">
            <AlertTriangle className="w-3 h-3" />
            Aguardando Averbação
          </span>
        );
    }
  };

  const totalFilteredValue = filtered.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Area */}
      <div className="darkroom-card p-6 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
          <div>
            <h2 className="text-lg font-display font-bold text-[#f2efe8] tracking-tight flex items-center gap-2">
              <History className="w-4 h-4 text-[#e8a54b]" />
              Histórico & Livro de Produção Comercial
            </h2>
            <p className="text-xs text-[#a09b93] mt-0.5">
              Registro contábil de todas as operações fechadas com bancos parceiros
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="btn-darkroom-secondary px-3 py-1.5 rounded-[8px] text-xs font-medium flex items-center gap-1.5"
              title="Imprimir relatório formatado ou salvar como PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#a09b93]" />
              <span>Imprimir Relatório</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="btn-darkroom-secondary px-3 py-1.5 rounded-[8px] text-xs font-medium flex items-center gap-1.5"
              title="Exportar dados filtrados em CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#3ecf8e]" />
              <span>Exportar CSV</span>
            </button>

            {canAddSale && (
              <button
                onClick={onOpenNewSaleModal}
                className="btn-amber-primary px-3.5 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5"
              >
                <span>+ Lançar Venda</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Summary Bar */}
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a09b93]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar contrato, cliente ou consultor..."
                className="w-full pl-9 pr-3 py-1.5 rounded-[8px] bg-[#121214] border border-white/[0.08] text-xs text-[#f2efe8] placeholder-[#6b6660] focus:outline-none focus:border-[#e8a54b]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#121214] border border-white/[0.08] rounded-[8px] px-2.5 py-1.5 text-xs text-[#f2efe8] focus:outline-none"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="PAGO">Liquidado / Pago</option>
              <option value="APROVADO">Aprovado</option>
              <option value="EM_ANALISE">Em Análise</option>
              <option value="AGUARDANDO_AVERBACAO">Aguardando Averbação</option>
            </select>

            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="bg-[#121214] border border-white/[0.08] rounded-[8px] px-2.5 py-1.5 text-xs text-[#f2efe8] focus:outline-none hidden sm:block"
            >
              <option value="TODOS">Todos os Produtos</option>
              {productOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right text-xs">
            <span className="text-[#a09b93]">Total Filtrado: </span>
            <span className="font-bold text-[#3ecf8e] font-mono text-sm tabular-nums">
              {formatCurrency(totalFilteredValue)}
            </span>
            <span className="text-[#6b6660] ml-2 font-mono">({filtered.length} contratos)</span>
          </div>
        </div>
      </div>

      {/* Production Feed Table */}
      <div className="darkroom-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121214] border-b border-white/[0.07] text-[#a09b93] font-medium uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Contrato</th>
                <th className="py-3 px-4">Cliente & Documento</th>
                <th className="py-3 px-4">Produto & Banco</th>
                <th className="py-3 px-4">Consultor</th>
                <th className="py-3 px-4 text-right">Valor Operado</th>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#a09b93]">
                    Nenhuma operação encontrada com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#e8a54b]">
                      {item.contractNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#f2efe8] font-semibold">{item.clientName}</div>
                      <div className="text-[11px] font-mono text-[#a09b93]">
                        {item.clientDocument}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#f2efe8]">{item.productName}</div>
                      <div className="text-[11px] text-[#e8a54b]">{item.bankName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#f2efe8] font-medium">{item.consultantName}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <div className="text-sm font-bold text-[#f2efe8]">
                        {formatCurrency(item.value)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#a09b93]">
                      {formatDate(item.date)}
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { QuickDocument } from '../types.ts';
import { downloadDocument } from '../utils/formatters.ts';
import {
  Download,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Upload,
  Plus,
  Trash2,
  X,
  FileUp,
  Search,
  Paperclip,
} from 'lucide-react';

interface QuickDownloadsProps {
  documents: QuickDocument[];
  onAddDocument: (doc: QuickDocument) => void;
  onDeleteDocument?: (id: string) => void;
  canManageDocuments?: boolean;
}

export const QuickDownloads: React.FC<QuickDownloadsProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  canManageDocuments = true,
}) => {
  const [downloadedDocId, setDownloadedDocId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('TODAS');

  // Form states for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | undefined>(undefined);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentCategory, setDocumentCategory] = useState('Manuais de Esteira');
  const [customCategory, setCustomCategory] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories list
  const defaultCategories = [
    'Manuais de Esteira',
    'Ferramentas de Cálculo',
    'Jurídico & Compliance',
    'Inteligência Comercial',
    'Checklists de Mesa',
    'Políticas de Crédito & Bancos',
  ];

  const handleDownload = (doc: QuickDocument) => {
    downloadDocument(doc.title, doc.category, doc.fileData);
    setDownloadedDocId(doc.id);
    setTimeout(() => {
      setDownloadedDocId(null);
    }, 2500);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const detectFormat = (filename: string): QuickDocument['format'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return 'XLSX';
    if (ext === 'docx' || ext === 'doc' || ext === 'odt' || ext === 'txt') return 'DOCX';
    return 'PDF';
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    if (!documentTitle) {
      setDocumentTitle(file.name);
    }
    setIsReadingFile(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFileBase64(result);
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      setIsReadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentTitle.trim()) return;

    const chosenCategory =
      documentCategory === 'OUTRO' && customCategory.trim()
        ? customCategory.trim()
        : documentCategory;

    const detectedFormat = selectedFile ? detectFormat(selectedFile.name) : detectFormat(documentTitle);
    const sizeString = selectedFile ? formatFileSize(selectedFile.size) : '450 KB';

    const now = new Date();
    const formattedDate = `Hoje, ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newDoc: QuickDocument = {
      id: `doc-${Date.now()}`,
      title: documentTitle.trim(),
      format: detectedFormat,
      size: sizeString,
      category: chosenCategory,
      updatedAt: formattedDate,
      fileData: fileBase64,
      customUploaded: true,
    };

    onAddDocument(newDoc);

    // Reset form & close modal
    setSelectedFile(null);
    setFileBase64(undefined);
    setDocumentTitle('');
    setDocumentCategory('Manuais de Esteira');
    setCustomCategory('');
    setShowUploadModal(false);
  };

  const getFormatBadge = (format: QuickDocument['format']) => {
    switch (format) {
      case 'PDF':
        return (
          <span className="flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#ef6b6b]/10 text-[#ef6b6b] border border-[#ef6b6b]/20">
            <FileText className="w-3 h-3" />
            PDF
          </span>
        );
      case 'XLSX':
        return (
          <span className="flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
            <FileSpreadsheet className="w-3 h-3" />
            XLSX
          </span>
        );
      case 'DOCX':
      default:
        return (
          <span className="flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#6ba3f5]/10 text-[#6ba3f5] border border-[#6ba3f5]/20">
            <FileText className="w-3 h-3" />
            DOCX
          </span>
        );
    }
  };

  // Unique categories for filtering
  const allCategories = ['TODAS', ...Array.from(new Set(documents.map((d) => d.category)))];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = categoryFilter === 'TODAS' || doc.category === categoryFilter;
    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q || doc.title.toLowerCase().includes(q) || doc.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="darkroom-card p-6">
      {/* Header and CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-white/[0.07]">
        <div>
          <h2 className="text-lg font-display font-bold text-[#f2efe8] tracking-tight flex items-center gap-2">
            <Download className="w-4 h-4 text-[#e8a54b]" />
            Downloads Rápidos & Documentação Operacional
          </h2>
          <p className="text-xs text-[#a09b93] mt-0.5">
            Manuais de esteira, tabelas de coeficientes, termos LGPD, minutas e anexos enviados
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span className="text-xs text-[#a09b93] hidden md:inline">
            {documents.length} arquivos disponíveis
          </span>

          {canManageDocuments && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-amber-primary px-3.5 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Anexar novo arquivo, PDF, planilha ou manual"
            >
              <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Anexar Novo Arquivo</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a09b93]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Buscar documento por nome ou categoria..."
            className="w-full pl-9 pr-3 py-1.5 rounded-[8px] bg-[#121214] border border-white/[0.08] text-xs text-[#f2efe8] placeholder-[#6b6660] focus:outline-none focus:border-[#e8a54b]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#e8a54b] text-[#1a1208] font-semibold'
                  : 'bg-[#121214] text-[#a09b93] hover:text-[#f2efe8] border border-white/[0.05]'
              }`}
            >
              {cat === 'TODAS' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Documents */}
      {filteredDocs.length === 0 ? (
        <div className="py-10 text-center text-xs text-[#a09b93] border border-dashed border-white/10 rounded-[10px]">
          <Paperclip className="w-6 h-6 text-[#6b6660] mx-auto mb-2" />
          <p>Nenhum documento encontrado com os filtros aplicados.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-2 text-[#e8a54b] hover:underline font-medium"
          >
            Clique aqui para anexar o primeiro arquivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredDocs.map((doc) => {
            const isRecentlyDownloaded = downloadedDocId === doc.id;

            return (
              <div
                key={doc.id}
                className="p-3.5 rounded-[10px] bg-[#121214] border border-white/[0.05] hover:border-white/[0.12] transition-all flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getFormatBadge(doc.format)}
                      {doc.customUploaded && (
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#e8a54b]/15 text-[#e8a54b] border border-[#e8a54b]/25">
                          Anexado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#6b6660]">{doc.size}</span>
                      {canManageDocuments && onDeleteDocument && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Excluir o documento "${doc.title}"?`)) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#6b6660] hover:text-[#ef6b6b] transition-all rounded hover:bg-white/5"
                          title="Remover documento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3
                    className="text-xs font-semibold text-[#f2efe8] group-hover:text-[#e8a54b] transition-colors leading-snug line-clamp-2"
                    title={doc.title}
                  >
                    {doc.title}
                  </h3>

                  <div className="text-[11px] text-[#a09b93] mt-2">
                    <span>{doc.category}</span>
                    <span className="text-white/20 mx-1.5">·</span>
                    <span className="font-mono text-[#6b6660]">{doc.updatedAt}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <button
                    onClick={() => handleDownload(doc)}
                    className={`w-full py-1.5 px-3 rounded-[8px] text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isRecentlyDownloaded
                        ? 'bg-[#3ecf8e]/15 text-[#3ecf8e] border border-[#3ecf8e]/30'
                        : 'btn-darkroom-secondary hover:text-[#e8a54b]'
                    }`}
                  >
                    {isRecentlyDownloaded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3ecf8e]" />
                        <span>Baixado com Sucesso</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Documento</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Anexar Novo Arquivo / Documento */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="darkroom-card max-w-lg w-full p-6 shadow-2xl border border-white/10 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-[#e8a54b]" />
                <div>
                  <h3 className="text-base font-display font-bold text-[#f2efe8]">
                    Anexar Documento Operacional
                  </h3>
                  <p className="text-[11px] text-[#a09b93]">
                    Disponibilize manuais, tabelas, circulares ou formulários para a equipe
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#a09b93] hover:text-[#f2efe8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-4 text-xs">
              {/* Drag and Drop Zone with real file input */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-[10px] border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#e8a54b] bg-[#e8a54b]/10'
                    : selectedFile
                    ? 'border-[#3ecf8e]/40 bg-[#3ecf8e]/5'
                    : 'border-white/10 hover:border-[#e8a54b]/50 bg-[#121214]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.xlsx,.xls,.docx,.doc,.csv,.txt"
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <CheckCircle2 className="w-8 h-8 text-[#3ecf8e]" />
                    <span className="font-semibold text-[#f2efe8] text-sm break-all">
                      {selectedFile.name}
                    </span>
                    <span className="font-mono text-xs text-[#a09b93]">
                      {formatFileSize(selectedFile.size)} · Formato detectado: {detectFormat(selectedFile.name)}
                    </span>
                    <span className="text-[11px] text-[#e8a54b] mt-1 hover:underline">
                      Clique para escolher outro arquivo
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#e8a54b]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#f2efe8]">
                        Clique para selecionar um arquivo
                      </span>
                      <span className="text-[#a09b93]"> ou arraste até aqui</span>
                    </div>
                    <span className="text-[10px] text-[#6b6660]">
                      Suporta PDF, Planilhas Excel (.xlsx, .xls), Word (.docx) e CSV (até 25 MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Title Field */}
              <div>
                <label className="text-[#a09b93] block mb-1">Título / Nome do Documento</label>
                <input
                  type="text"
                  required
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Ex: Tabela_Comissao_Safra_2026.pdf ou Manual do Parceiro"
                  className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
                />
              </div>

              {/* Category Picker */}
              <div>
                <label className="text-[#a09b93] block mb-1">Categoria Operacional</label>
                <select
                  value={documentCategory}
                  onChange={(e) => setDocumentCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
                >
                  {defaultCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="OUTRO">+ Outra categoria personalizada</option>
                </select>
              </div>

              {documentCategory === 'OUTRO' && (
                <div>
                  <label className="text-[#a09b93] block mb-1">Nome da Nova Categoria</label>
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Ex: Campanhas de Premiação, Scripts de Vendas"
                    className="w-full px-3 py-2 rounded-[8px] bg-[#121214] border border-white/10 text-xs text-[#f2efe8] focus:outline-none focus:border-[#e8a54b]"
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs text-[#a09b93] hover:text-[#f2efe8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isReadingFile}
                  className="btn-amber-primary px-5 py-2 rounded-[8px] text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isReadingFile ? 'Lendo Arquivo...' : 'Anexar Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

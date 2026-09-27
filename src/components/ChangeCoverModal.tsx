import React, { useState, useRef } from 'react';
import { Book } from '../types/library';
import { Image as ImageIcon, Upload, Link as LinkIcon, Check, X, Sparkles } from 'lucide-react';

interface ChangeCoverModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCover: (bookId: string, newCoverUrl: string) => void;
}

const PRESET_COVERS = [
  {
    name: 'Dom Casmurro (Orquídea Assis)',
    url: '/src/assets/images/cover_dom_casmurro_1790291703864.jpg',
  },
  {
    name: 'A Metamorfose (Besouro Geométrico)',
    url: '/src/assets/images/cover_metamorfose_1790291714560.jpg',
  },
  {
    name: 'O Príncipe (Coroa Dourada Renascença)',
    url: '/src/assets/images/cover_o_principe_1790291724695.jpg',
  },
  {
    name: 'O Pequeno Príncipe (Asteroide B612)',
    url: '/src/assets/images/cover_pequeno_principe_1790291734155.jpg',
  },
  {
    name: 'Jardim Botânico Escuro & Flores',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Biblioteca Clássica & Lombadas',
    url: 'https://images.unsplash.com/photo-1507842229450-799895ba2e66?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Manuscrito Antigo & Pena',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Noite Estrelada & Constelações',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Café & Livro Aberto',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Veludo & Rosas Roxas',
    url: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80',
  },
];

export const ChangeCoverModal: React.FC<ChangeCoverModalProps> = ({
  book,
  isOpen,
  onClose,
  onSaveCover,
}) => {
  if (!isOpen || !book) return null;

  const [selectedCover, setSelectedCover] = useState<string>(book.coverUrl);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione um arquivo de imagem (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('A imagem deve ter no máximo 5MB.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedCover(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Erro ao carregar a imagem do arquivo.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setSelectedCover(customUrl.trim());
  };

  const handleSave = () => {
    if (selectedCover) {
      onSaveCover(book.id, selectedCover);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#170b22] border border-purple-800/80 rounded-2xl p-6 shadow-2xl space-y-6 text-purple-100 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-900/40 border border-purple-600/40 flex items-center justify-center text-[#c084fc]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-purple-100">
                Alterar Capa do Livro
              </h3>
              <p className="text-xs text-purple-300/70 truncate max-w-md">
                Personalize a capa de <span className="font-semibold text-purple-200">"{book.title}"</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-400 hover:text-purple-100 hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Top Preview Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-purple-950/40 border border-purple-900/50">
            {/* Live Cover Preview */}
            <div className="w-24 sm:w-28 aspect-[3/4] rounded-lg overflow-hidden bg-purple-950 shadow-xl border border-purple-700/60 shrink-0 relative group">
              <img
                src={selectedCover}
                alt="Prévia da nova capa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = book.coverUrl;
                }}
              />
              <div className="absolute inset-0 bg-purple-900/30 pointer-events-none" />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="text-[11px] font-mono text-[#c084fc] uppercase tracking-wider">
                Prévia da Capa Atualizada
              </span>
              <h4 className="text-sm font-semibold text-purple-100">{book.title}</h4>
              <p className="text-xs text-purple-300/70">{book.author} · {book.genre}</p>
              <p className="text-[11px] text-purple-400/80">
                Selecione uma das opções abaixo: envie um arquivo do seu dispositivo, cole um link de imagem ou escolha da nossa galeria artística.
              </p>
            </div>
          </div>

          {/* Option 1: Upload from Device */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#c084fc]" />
              <span>1. Enviar Imagem do seu Dispositivo</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-xl border border-dashed border-purple-700/80 hover:border-purple-400 bg-purple-950/30 hover:bg-purple-900/40 text-xs font-medium text-purple-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#c084fc]" />
              <span>Clique para selecionar um arquivo (PNG, JPG, WebP)</span>
            </button>
            {uploadError && (
              <p className="text-xs text-red-400 mt-1">{uploadError}</p>
            )}
          </div>

          {/* Option 2: Image URL */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#c084fc]" />
              <span>2. Ou Cole uma URL de Imagem da Web</span>
            </label>
            <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://exemplo.com/minha-capa.jpg"
                className="flex-1 px-3 py-2 text-xs bg-[#12081a] rounded-lg border border-purple-900/70 text-purple-100 placeholder:text-purple-400/40 focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-medium rounded-lg border border-purple-700/50 transition-colors cursor-pointer"
              >
                Aplicar
              </button>
            </form>
          </div>

          {/* Option 3: Presets Gallery */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
              <span>3. Ou Escolha da Galeria Literária e Artística</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {PRESET_COVERS.map((preset, index) => {
                const isSelected = selectedCover === preset.url;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedCover(preset.url)}
                    className={`relative aspect-[3/4] rounded-lg overflow-hidden border transition-all cursor-pointer group text-left ${
                      isSelected
                        ? 'border-[#c084fc] ring-2 ring-purple-500/50 shadow-lg scale-[1.02]'
                        : 'border-purple-900/60 hover:border-purple-600'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-sans text-purple-100 line-clamp-1 leading-tight">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-900/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-purple-300 hover:text-white rounded-lg hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg shadow-md border border-purple-500/30 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Salvar Nova Capa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

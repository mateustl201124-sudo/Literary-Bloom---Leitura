import React, { useState } from 'react';
import { Book } from '../types/library';
import confetti from 'canvas-confetti';
import { X, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { TulipOrnament } from './TulipOrnament';

interface ProgressModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveProgress: (bookId: string, newPage: number, durationMinutes?: number) => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  book,
  isOpen,
  onClose,
  onSaveProgress,
}) => {
  if (!isOpen || !book) return null;

  const [page, setPage] = useState<number>(book.currentPage || 0);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const percent = Math.min(100, Math.round((page / (book.totalPages || 1)) * 100));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (page >= book.totalPages) {
      confetti({ particleCount: 70, spread: 60 });
    }
    onSaveProgress(book.id, page, durationMinutes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0513]/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#180b22] border border-purple-900/70 rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-purple-100 flex items-center gap-1.5">
              <span>Registrar Leitura</span>
              <TulipOrnament className="w-5 h-2.5 opacity-40" />
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-purple-400 hover:text-purple-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Book Details */}
        <div className="flex items-center gap-3 bg-[#13071b] p-3 rounded-xl border border-purple-900/40">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-11 aspect-[3/4] object-cover rounded shadow"
          />
          <div className="truncate">
            <h4 className="text-xs font-semibold text-purple-100 truncate">{book.title}</h4>
            <p className="text-[11px] text-purple-400/70 truncate">{book.author}</p>
            <div className="text-[10px] text-purple-300 font-mono mt-0.5">
              Anterior: pág. {book.currentPage} ({Math.round((book.currentPage / book.totalPages) * 100)}%)
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Page input and range */}
          <div>
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <label className="text-purple-200">Página Atual</label>
              <span className="font-mono tabular-nums text-purple-300 font-semibold text-sm">
                {page} / {book.totalPages} ({percent}%)
              </span>
            </div>

            <input
              type="range"
              min="0"
              max={book.totalPages}
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-purple-950 rounded-lg"
            />

            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                min="0"
                max={book.totalPages}
                value={page}
                onChange={(e) => setPage(Math.min(book.totalPages, Math.max(0, Number(e.target.value))))}
                className="w-24 px-2.5 py-1.5 bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 font-mono tabular-nums focus:outline-none focus:border-purple-500"
              />
              <span className="text-purple-400/60">de {book.totalPages} páginas</span>

              <button
                type="button"
                onClick={() => setPage(book.totalPages)}
                className="ml-auto text-[11px] text-purple-400 hover:text-purple-300 underline underline-offset-2 cursor-pointer"
              >
                Concluir livro
              </button>
            </div>
          </div>

          {/* Time spent */}
          <div>
            <label className="block text-purple-200 mb-1 font-medium">
              Tempo dedicado nesta sessão (minutos)
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-purple-400/60" />
              <input
                type="number"
                min="1"
                max="300"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Math.max(1, Number(e.target.value)))}
                className="w-24 px-2.5 py-1.5 bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 font-mono tabular-nums focus:outline-none focus:border-purple-500"
              />
              <span className="text-purple-400/60">minutos lidos hoje</span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 border-t border-purple-900/60 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 transition-colors cursor-pointer border border-purple-900/50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-medium transition-colors shadow-sm border border-purple-500/30 cursor-pointer"
            >
              Salvar Progresso
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

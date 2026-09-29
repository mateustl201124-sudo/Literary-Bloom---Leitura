import React from 'react';
import { Book } from '../types/library';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { resolveCoverUrl, handleImageError } from '../utils/coverAssets';

interface DeleteConfirmModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  book,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#180b22] border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-5 text-purple-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-purple-400 hover:text-purple-100 hover:bg-purple-900/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with warning icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-red-200">
              Excluir Livro da Biblioteca
            </h3>
            <p className="text-xs text-purple-300/70">
              Esta ação removerá a obra e seus marcadores.
            </p>
          </div>
        </div>

        {/* Book Preview */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-purple-950/50 border border-purple-900/50">
          <div className="w-12 h-16 rounded overflow-hidden bg-purple-900 shrink-0 border border-purple-800/60">
            <img
              src={resolveCoverUrl(book.coverUrl, book.title, book.author)}
              alt={book.title}
              onError={(e) => handleImageError(e, book.title, book.author)}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="truncate flex-1">
            <h4 className="text-sm font-semibold text-purple-100 truncate">
              {book.title}
            </h4>
            <p className="text-xs text-purple-400/80 truncate mt-0.5">
              {book.author}
            </p>
            <span className="text-[10px] font-mono text-purple-400/60">
              {book.currentPage}/{book.totalPages} págs lidas
            </span>
          </div>
        </div>

        <div className="text-xs text-purple-300/80 bg-red-950/20 border border-red-900/30 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            Você tem certeza de que deseja excluir permanentemente este livro? Os marcadores, anotações e progresso salvos serão apagados.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-purple-300 hover:text-white rounded-lg hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(book.id);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-red-950/50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir Definitivamente</span>
          </button>
        </div>
      </div>
    </div>
  );
};

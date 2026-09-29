import React, { useState } from 'react';
import { Book, ReadingStatus } from '../types/library';
import { BookOpen, MoreVertical, CheckCircle, Trash2, Edit3, Heart, Image as ImageIcon } from 'lucide-react';
import { resolveCoverUrl, handleImageError } from '../utils/coverAssets';

interface BookCardProps {
  book: Book;
  onRead: (book: Book) => void;
  onUpdateProgress: (book: Book) => void;
  onToggleStatus: (book: Book, status: ReadingStatus) => void;
  onToggleFavorite: (book: Book) => void;
  onDelete: (id: string) => void;
  onChangeCover?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onRead,
  onUpdateProgress,
  onToggleStatus,
  onToggleFavorite,
  onDelete,
  onChangeCover,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const percent = Math.min(100, Math.round((book.currentPage / (book.totalPages || 1)) * 100));

  const statusLabels: Record<ReadingStatus, string> = {
    reading: 'Lendo agora',
    completed: 'Concluído',
    want_to_read: 'Quero ler',
    on_hold: 'Em pausa',
  };

  return (
    <div className="group relative flex flex-col bg-[#1a0d26]/80 hover:bg-[#200f2e] border border-purple-900/40 hover:border-purple-700/60 rounded-xl overflow-hidden transition-all duration-200">
      
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#14081c]">
        <img
          src={resolveCoverUrl(book.coverUrl, book.title, book.author)}
          alt={`Capa do livro ${book.title}`}
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, book.title, book.author)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* Favorite indicator */}
        {book.favorite && (
          <button
            onClick={() => onToggleFavorite(book)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-[#160b20]/80 backdrop-blur-sm text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
            title="Livro favorito"
          >
            <Heart className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
          </button>
        )}

        {/* Format badge as discreet overlay */}
        <div className="absolute bottom-2 left-2 text-[10px] uppercase font-mono font-medium tracking-wider text-purple-200/90 bg-[#160b20]/85 backdrop-blur-sm px-1.5 py-0.5 rounded border border-purple-800/40">
          {book.format}
        </div>

        {/* Hover Quick Action */}
        <div className="absolute inset-0 bg-[#12081a]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center p-3 transition-opacity">
          <button
            onClick={() => onRead(book)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-medium text-xs rounded-lg shadow-md border border-purple-500/30 transform translate-y-1 group-hover:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{book.currentPage > 0 ? 'Continuar' : 'Ler'}</span>
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Metadata Discipline: Clean unboxed text with typographic separators */}
          <div className="flex items-center gap-1.5 text-[11px] text-purple-400/80 mb-1 truncate">
            <span className="truncate">{book.author}</span>
            <span aria-hidden="true" className="text-purple-800">·</span>
            <span className="truncate text-purple-400/70">{book.genre}</span>
          </div>

          <h3 className="font-semibold text-xs text-purple-100 leading-snug line-clamp-2 group-hover:text-purple-200 transition-colors">
            {book.title}
          </h3>
        </div>

        {/* Reading Progress */}
        <div className="space-y-1 pt-1.5 border-t border-purple-900/40">
          <div className="flex items-center justify-between text-[11px] text-purple-300/80 font-mono tabular-nums">
            <span>
              {book.currentPage}/{book.totalPages} págs
            </span>
            <span className="font-semibold text-purple-300">{percent}%</span>
          </div>

          {/* Progress track */}
          <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percent === 100 ? 'bg-emerald-400' : 'bg-purple-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[10px] text-purple-400/60">
              {statusLabels[book.status]}
            </span>

            {/* Menu trigger */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 text-purple-400/70 hover:text-purple-200 rounded hover:bg-purple-900/50 transition-colors cursor-pointer"
                title="Mais opções"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 bottom-full mb-1 w-44 bg-[#180b22] border border-purple-800/80 rounded-lg shadow-xl z-30 py-1 text-xs text-purple-100 backdrop-blur-md">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onRead(book);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-purple-900/50 text-left transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                      <span>Abrir no leitor</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onUpdateProgress(book);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-purple-900/50 text-left transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Atualizar páginas</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onToggleFavorite(book);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-purple-900/50 text-left transition-colors cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${book.favorite ? 'text-purple-400 fill-purple-400' : 'text-purple-400/70'}`} />
                      <span>{book.favorite ? 'Desfavoritar' : 'Favoritar'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onToggleStatus(book, book.status === 'completed' ? 'reading' : 'completed');
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-purple-900/50 text-left transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{book.status === 'completed' ? 'Marcar Lendo' : 'Concluir'}</span>
                    </button>
                    {onChangeCover && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onChangeCover(book);
                        }}
                        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-purple-900/50 text-left transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#c084fc]" />
                        <span>Alterar capa</span>
                      </button>
                    )}
                    <div className="h-px bg-purple-900/60 my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(book.id);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-red-500/10 text-red-400 text-left transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir livro</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

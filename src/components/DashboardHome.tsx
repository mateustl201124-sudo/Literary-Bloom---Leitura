import React from 'react';
import { Book, ReadingStatus } from '../types/library';
import { BookCard } from './BookCard';
import { BookOpen, Sparkles, Plus, Clock, ArrowRight } from 'lucide-react';
import { TulipFrameCorner } from './TulipOrnament';

interface DashboardHomeProps {
  books: Book[];
  onRead: (book: Book) => void;
  onUpdateProgress: (book: Book) => void;
  onToggleStatus: (book: Book, status: ReadingStatus) => void;
  onToggleFavorite: (book: Book) => void;
  onDelete: (id: string) => void;
  onChangeCover?: (book: Book) => void;
  onOpenUpload: () => void;
  onViewAllInLibrary: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  books,
  onRead,
  onUpdateProgress,
  onToggleStatus,
  onToggleFavorite,
  onDelete,
  onChangeCover,
  onOpenUpload,
  onViewAllInLibrary,
}) => {
  // Find book to spotlight in compact "Continuar Leitura"
  const readingBooks = books.filter((b) => b.status === 'reading');
  const spotlightBook = readingBooks.length > 0
    ? [...readingBooks].sort((a, b) => {
        const dateA = a.lastReadDate ? new Date(a.lastReadDate).getTime() : 0;
        const dateB = b.lastReadDate ? new Date(b.lastReadDate).getTime() : 0;
        return dateB - dateA;
      })[0]
    : books.find((b) => b.currentPage > 0) || books[0];

  const spotlightPercent = spotlightBook
    ? Math.min(100, Math.round((spotlightBook.currentPage / (spotlightBook.totalPages || 1)) * 100))
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Compact "Continuar Leitura" Card with delicate frame */}
      {spotlightBook && (
        <section className="relative overflow-hidden rounded-xl bg-[#1b0d26]/80 border border-purple-900/60 p-4 sm:p-5 transition-all">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Small book cover thumbnail */}
            <div className="shrink-0 w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden shadow-md ring-1 ring-purple-800/40 bg-purple-950">
              <img
                src={spotlightBook.coverUrl}
                alt={spotlightBook.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Compact details */}
            <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5 w-full">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-purple-400 font-medium">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Continuar Leitura</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-purple-100 font-reader-serif truncate">
                {spotlightBook.title}
              </h2>

              <p className="text-xs text-purple-300/70 truncate">
                {spotlightBook.author} · <span className="text-purple-400/80">{spotlightBook.genre}</span>
              </p>

              {/* Mini progress bar */}
              <div className="pt-1 max-w-sm mx-auto sm:mx-0 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-purple-300/80 font-mono tabular-nums">
                  <span>Pág. {spotlightBook.currentPage} de {spotlightBook.totalPages}</span>
                  <span className="font-semibold text-purple-300">{spotlightPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-purple-950/90 rounded-full overflow-hidden border border-purple-900/40">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${spotlightPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Single streamlined action button */}
            <div className="shrink-0 self-center sm:self-auto sm:pt-2">
              <button
                onClick={() => onRead(spotlightBook)}
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-medium text-xs rounded-lg shadow-sm border border-purple-500/30 transition-colors cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Continuar</span>
              </button>
            </div>

          </div>
        </section>
      )}

      {/* Main Books Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-purple-200">
            Minha Coleção
          </h3>
          <span className="text-xs text-purple-400/60 font-mono">({books.length} obras)</span>
        </div>

        {books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onRead={onRead}
                onUpdateProgress={onUpdateProgress}
                onToggleStatus={onToggleStatus}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDelete}
                onChangeCover={onChangeCover}
              />
            ))}
          </div>
        ) : (
          <div className="relative text-center py-16 bg-[#1a0d24]/60 rounded-xl border border-purple-900/50 p-6 space-y-3">
            <TulipFrameCorner position="top-left" />
            <TulipFrameCorner position="top-right" />
            <TulipFrameCorner position="bottom-left" />
            <TulipFrameCorner position="bottom-right" />

            <BookOpen className="w-10 h-10 mx-auto text-purple-500/50" />
            <div>
              <p className="text-sm font-semibold text-purple-200">Nenhum livro encontrado</p>
              <p className="text-xs text-purple-400/70 mt-1">
                Utilize o botão abaixo ou arraste um arquivo para adicionar à sua biblioteca.
              </p>
            </div>
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-medium text-xs rounded-lg shadow-sm border border-purple-500/30 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Primeiro Livro</span>
            </button>
          </div>
        )}
      </section>

    </div>
  );
};

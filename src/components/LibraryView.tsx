import React, { useState } from 'react';
import { Book, ReadingStatus } from '../types/library';
import { BookCard } from './BookCard';
import { Layers, Library, BookOpen, Plus } from 'lucide-react';
import { TulipOrnament, TulipFrameCorner } from './TulipOrnament';

interface LibraryViewProps {
  books: Book[];
  onRead: (book: Book) => void;
  onUpdateProgress: (book: Book) => void;
  onToggleStatus: (book: Book, status: ReadingStatus) => void;
  onToggleFavorite: (book: Book) => void;
  onDelete: (id: string) => void;
  onChangeCover?: (book: Book) => void;
  onOpenUpload: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  onRead,
  onUpdateProgress,
  onToggleStatus,
  onToggleFavorite,
  onDelete,
  onChangeCover,
  onOpenUpload,
}) => {
  const [subTab, setSubTab] = useState<'all' | 'genres'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Group genres
  const genreStats = React.useMemo(() => {
    const map = new Map<string, { count: number; totalPages: number; readPages: number; completedCount: number }>();

    books.forEach((book) => {
      const g = book.genre || 'Geral';
      const current = map.get(g) || { count: 0, totalPages: 0, readPages: 0, completedCount: 0 };
      current.count += 1;
      current.totalPages += book.totalPages || 0;
      current.readPages += book.currentPage || 0;
      if (book.status === 'completed') current.completedCount += 1;
      map.set(g, current);
    });

    return Array.from(map.entries()).map(([genre, stats]) => ({
      genre,
      ...stats,
      percent: stats.totalPages > 0 ? Math.round((stats.readPages / stats.totalPages) * 100) : 0,
    }));
  }, [books]);

  // Display books for genre sub-tab
  const displayedBooks = selectedGenre
    ? books.filter((b) => b.genre === selectedGenre)
    : books;

  return (
    <div className="space-y-6">
      
      {/* Header with Sub-tabs & Subtle Tulip Ornaments */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-950/70">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-800/40 flex items-center justify-center text-purple-300">
            <Library className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-purple-100 font-reader-serif flex items-center gap-2">
              <span>Biblioteca</span>
              <TulipOrnament size="sm" className="w-10 h-8 inline-block opacity-80" />
            </h2>
            <p className="text-xs text-purple-300/70 mt-0.5">
              Acervo pessoal completo e organização de coleções por gênero ({books.length} obras).
            </p>
          </div>
        </div>

        {/* Sub-tabs: Todos os Livros | Gêneros e Coleções */}
        <div className="flex items-center gap-1 p-1 bg-[#1a0c24] rounded-lg border border-purple-900/60 self-start sm:self-auto">
          <button
            onClick={() => {
              setSubTab('all');
              setSelectedGenre(null);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              subTab === 'all'
                ? 'bg-purple-900/80 text-purple-100 font-semibold shadow-xs'
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            Todos os Livros ({books.length})
          </button>
          <button
            onClick={() => setSubTab('genres')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              subTab === 'genres'
                ? 'bg-purple-900/80 text-purple-100 font-semibold shadow-xs'
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            Gêneros & Coleções ({genreStats.length})
          </button>
        </div>
      </div>

      {/* View 1: Todos os Livros */}
      {subTab === 'all' && (
        <div className="space-y-4">
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
              <p className="text-sm font-semibold text-purple-200">Sua biblioteca está vazia</p>
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-medium text-xs rounded-lg shadow-sm border border-purple-500/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Primeiro Livro</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* View 2: Gêneros e Coleções */}
      {subTab === 'genres' && (
        <div className="space-y-6">
          {/* Genre Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {genreStats.map((item) => {
              const isSelected = selectedGenre === item.genre;
              return (
                <button
                  key={item.genre}
                  onClick={() => setSelectedGenre(isSelected ? null : item.genre)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-purple-900/40 border-purple-600/70 shadow-md ring-1 ring-purple-500/40'
                      : 'bg-[#1b0d26]/70 hover:bg-[#200f2e] border-purple-900/50 hover:border-purple-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-800/40 flex items-center justify-center text-purple-400">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-mono text-purple-300/70 tabular-nums">
                      {item.count} {item.count === 1 ? 'obra' : 'obras'}
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs text-purple-100 mt-2.5 truncate">
                    {item.genre}
                  </h4>

                  <div className="mt-2.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-purple-300/70 font-mono tabular-nums">
                      <span>{item.readPages} / {item.totalPages} págs</span>
                      <span className="font-semibold text-purple-300">{item.percent}%</span>
                    </div>
                    <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Books in selected genre or all */}
          <div className="pt-4 border-t border-purple-950/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-purple-200">
                {selectedGenre
                  ? `Livros no gênero: ${selectedGenre} (${displayedBooks.length})`
                  : `Todos os Livros da Biblioteca (${displayedBooks.length})`}
              </h3>
              {selectedGenre && (
                <button
                  onClick={() => setSelectedGenre(null)}
                  className="text-xs text-purple-400 hover:text-purple-300 underline cursor-pointer"
                >
                  Mostrar todos os gêneros
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayedBooks.map((book) => (
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
          </div>
        </div>
      )}

    </div>
  );
};

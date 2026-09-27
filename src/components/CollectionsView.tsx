import React, { useState } from 'react';
import { Book, ReadingStatus } from '../types/library';
import { BookCard } from './BookCard';
import { FolderPlus, Layers, Library, BookOpen, CheckCircle2, Bookmark } from 'lucide-react';

interface CollectionsViewProps {
  books: Book[];
  onRead: (book: Book) => void;
  onUpdateProgress: (book: Book) => void;
  onToggleStatus: (book: Book, status: ReadingStatus) => void;
  onToggleFavorite: (book: Book) => void;
  onDelete: (id: string) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  books,
  onRead,
  onUpdateProgress,
  onToggleStatus,
  onToggleFavorite,
  onDelete,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);

  // Extract all distinct genres with stats
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

  // Extract custom shelves
  const shelfStats = React.useMemo(() => {
    const map = new Map<string, { count: number; totalPages: number; readPages: number }>();
    books.forEach((book) => {
      if (book.shelf) {
        const current = map.get(book.shelf) || { count: 0, totalPages: 0, readPages: 0 };
        current.count += 1;
        current.totalPages += book.totalPages || 0;
        current.readPages += book.currentPage || 0;
        map.set(book.shelf, current);
      }
    });

    return Array.from(map.entries()).map(([shelf, stats]) => ({
      shelf,
      ...stats,
      percent: stats.totalPages > 0 ? Math.round((stats.readPages / stats.totalPages) * 100) : 0,
    }));
  }, [books]);

  // Filtered books
  const displayBooks = books.filter((b) => {
    if (selectedGenre && b.genre !== selectedGenre) return false;
    if (selectedShelf && b.shelf !== selectedShelf) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-100 font-reader-serif">
          Gêneros & Coleções
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Organize sua biblioteca por temas, vertentes literárias e estantes temáticas personalizadas.
        </p>
      </div>

      {/* Genres Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
            Coleções por Gênero ({genreStats.length})
          </h3>
          {(selectedGenre || selectedShelf) && (
            <button
              onClick={() => {
                setSelectedGenre(null);
                setSelectedShelf(null);
              }}
              className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Ver todos os livros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {genreStats.map((item) => {
            const isSelected = selectedGenre === item.genre;
            return (
              <button
                key={item.genre}
                onClick={() => {
                  setSelectedGenre(isSelected ? null : item.genre);
                  setSelectedShelf(null);
                }}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-neutral-850/60 hover:bg-neutral-800/80 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-amber-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                    {item.count} {item.count === 1 ? 'livro' : 'livros'}
                  </span>
                </div>

                <h4 className="font-semibold text-sm text-neutral-100 mt-3 truncate">
                  {item.genre}
                </h4>

                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono tabular-nums">
                    <span>{item.readPages} / {item.totalPages} págs</span>
                    <span className="font-semibold text-amber-400">{item.percent}%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Shelves (if any) */}
      {shelfStats.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-neutral-800/80">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
            Estantes Temáticas ({shelfStats.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {shelfStats.map((item) => {
              const isSelected = selectedShelf === item.shelf;
              return (
                <button
                  key={item.shelf}
                  onClick={() => {
                    setSelectedShelf(isSelected ? null : item.shelf);
                    setSelectedGenre(null);
                  }}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                      : 'bg-neutral-850/60 hover:bg-neutral-800/80 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-neutral-200 truncate">
                      {item.shelf}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                      {item.count} livros
                    </span>
                  </div>
                  <div className="mt-2 w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filtered Books List */}
      <div className="space-y-4 pt-6 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-200">
            {selectedGenre
              ? `Obras no gênero: ${selectedGenre} (${displayBooks.length})`
              : selectedShelf
              ? `Obras na estante: ${selectedShelf} (${displayBooks.length})`
              : `Todas as Obras da Biblioteca (${displayBooks.length})`}
          </h3>
        </div>

        {displayBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onRead={onRead}
                onUpdateProgress={onUpdateProgress}
                onToggleStatus={onToggleStatus}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-850/40 rounded-xl border border-neutral-800">
            <BookOpen className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
            <p className="text-xs text-neutral-400">Nenhum livro encontrado nesta coleção.</p>
          </div>
        )}
      </div>

    </div>
  );
};

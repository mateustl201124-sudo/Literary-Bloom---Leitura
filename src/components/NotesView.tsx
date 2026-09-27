import React, { useState } from 'react';
import { Book } from '../types/library';
import { Highlighter, Search, ExternalLink } from 'lucide-react';
import { TulipOrnament, TulipFrameCorner } from './TulipOrnament';

interface NotesViewProps {
  books: Book[];
  onOpenBookAtPage: (book: Book, page: number) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ books, onOpenBookAtPage }) => {
  const [selectedBookId, setSelectedBookId] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'notes' | 'bookmarks'>('all');
  const [search, setSearch] = useState('');

  // Collect all notes and bookmarks with book context
  const allItems = React.useMemo(() => {
    const list: Array<{
      type: 'note' | 'bookmark';
      id: string;
      book: Book;
      page: number;
      quote?: string;
      text: string;
      chapterTitle?: string;
      createdAt: string;
    }> = [];

    books.forEach((book) => {
      if (selectedBookId !== 'all' && book.id !== selectedBookId) return;

      if (filterType !== 'bookmarks' && book.notes) {
        book.notes.forEach((n) => {
          list.push({
            type: 'note',
            id: n.id,
            book,
            page: n.page,
            quote: n.quote,
            text: n.note,
            createdAt: n.createdAt,
          });
        });
      }

      if (filterType !== 'notes' && book.bookmarks) {
        book.bookmarks.forEach((bm) => {
          list.push({
            type: 'bookmark',
            id: bm.id,
            book,
            page: bm.page,
            text: bm.label,
            chapterTitle: bm.chapterTitle,
            createdAt: bm.createdAt,
          });
        });
      }
    });

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [books, selectedBookId, filterType]);

  const filteredItems = allItems.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.text.toLowerCase().includes(q) ||
      (item.quote && item.quote.toLowerCase().includes(q)) ||
      item.book.title.toLowerCase().includes(q) ||
      item.book.author.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* View Header with subtle tulip */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-950/70">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-purple-100 font-reader-serif flex items-center gap-2">
            <span>Anotações & Citações</span>
            <TulipOrnament className="w-6 h-3 opacity-40" />
          </h2>
          <p className="text-xs text-purple-300/70 mt-0.5">
            Citações destacadas, anotações de leitura e marcadores salvos nas obras.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#180b22]/70 p-3 rounded-xl border border-purple-900/50">
        
        {/* Book filter dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-300/70 shrink-0">Obra:</span>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="px-2.5 py-1.5 bg-[#14081c] border border-purple-900/80 rounded-lg text-xs text-purple-100 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="all">Todas as Obras ({books.length})</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>

        {/* Type Toggle: All / Notes / Bookmarks */}
        <div className="flex items-center gap-1 bg-[#14081c] p-1 rounded-lg border border-purple-900/60">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterType === 'all' ? 'bg-purple-900/80 text-purple-100 font-semibold' : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            Todos ({allItems.length})
          </button>
          <button
            onClick={() => setFilterType('notes')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterType === 'notes' ? 'bg-purple-900/80 text-purple-100 font-semibold' : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            Anotações
          </button>
          <button
            onClick={() => setFilterType('bookmarks')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterType === 'bookmarks' ? 'bg-purple-900/80 text-purple-100 font-semibold' : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            Marcadores
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-purple-400/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar anotação..."
            className="w-full bg-[#14081c] border border-purple-900/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-purple-500"
          />
        </div>

      </div>

      {/* Items Stream */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#1a0d26]/80 hover:bg-[#200f2e] border border-purple-900/50 transition-colors flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-purple-100 truncate">{item.book.title}</span>
                    <span className="text-purple-700">·</span>
                    <span className="text-purple-300/70 font-mono tabular-nums">Pág. {item.page}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400">
                    {item.type === 'note' ? 'Anotação' : 'Marcador'}
                  </span>
                </div>

                {item.quote && (
                  <div className="relative pl-3 border-l-2 border-purple-500/70 py-0.5 my-2">
                    <p className="text-xs text-purple-200 italic font-serif leading-relaxed">
                      "{item.quote}"
                    </p>
                  </div>
                )}

                <p className="text-xs text-purple-100 font-medium leading-relaxed">
                  {item.text}
                </p>

                {item.chapterTitle && (
                  <p className="text-[11px] text-purple-400/60 font-mono">
                    {item.chapterTitle}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px]">
                <span className="text-purple-400/50 font-mono">
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <button
                  onClick={() => onOpenBookAtPage(item.book, item.page)}
                  className="flex items-center gap-1 text-purple-300 hover:text-purple-100 font-medium cursor-pointer"
                >
                  <span>Abrir na pág. {item.page}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative text-center py-16 bg-[#180b22]/40 rounded-xl border border-purple-900/50 p-6">
          <TulipFrameCorner position="top-left" />
          <TulipFrameCorner position="top-right" />
          <TulipFrameCorner position="bottom-left" />
          <TulipFrameCorner position="bottom-right" />

          <Highlighter className="w-8 h-8 mx-auto text-purple-400/50 mb-2" />
          <p className="text-sm font-semibold text-purple-200">Nenhuma anotação encontrada</p>
          <p className="text-xs text-purple-400/60 mt-1 max-w-sm mx-auto">
            Ao ler qualquer obra no leitor integrado, use a aba de Marcadores ou Anotações para salvar suas passagens.
          </p>
        </div>
      )}

    </div>
  );
};

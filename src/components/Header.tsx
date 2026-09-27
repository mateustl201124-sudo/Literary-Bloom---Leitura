import React from 'react';
import { BookOpen, Plus, Search, Flame, BarChart3, Highlighter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'library' | 'notes' | 'stats';
  setActiveTab: (tab: 'home' | 'library' | 'notes' | 'stats') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenUpload: () => void;
  streakDays: number;
  booksReadTodayCount: number;
  // Attached filter/sort in search
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  genreFilter: string;
  setGenreFilter: (genre: string) => void;
  availableGenres: string[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenUpload,
  streakDays,
  booksReadTodayCount,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  genreFilter,
  setGenreFilter,
  availableGenres,
}) => {
  const [showSearchFilters, setShowSearchFilters] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#160b1f]/95 backdrop-blur-md border-b border-purple-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Zone 1: Single element Brand wordmark */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 text-left text-purple-100 hover:text-white transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-700/40 flex items-center justify-center text-purple-300 group-hover:bg-purple-800/50 transition-all">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight font-reader-serif">
                <span className="text-purple-100">Literary</span>{' '}
                <span className="text-[#c084fc]">Bloom</span>
              </span>
            </button>

            {/* Zone 2: Simplified Nav - only "Início" and "Biblioteca" */}
            <nav className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'home'
                    ? 'text-purple-100 bg-purple-950/80 border border-purple-800/40 shadow-xs'
                    : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/40'
                }`}
              >
                Início
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'library'
                    ? 'text-purple-100 bg-purple-950/80 border border-purple-800/40 shadow-xs'
                    : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/40'
                }`}
              >
                Biblioteca
              </button>
            </nav>
          </div>

          {/* Zone 3: Search with integrated filter/sort + Daily Streak flame + subtle icons + Add Book */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Input with embedded filter button */}
            <div className="relative w-44 sm:w-64">
              <Search className="w-3.5 h-3.5 text-purple-400/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar livro, autor, gênero..."
                className="w-full bg-[#200f2e]/80 border border-purple-900/60 rounded-lg pl-8 pr-8 py-1.5 text-xs text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-purple-500/70 transition-colors"
              />
              
              {/* Integrated Filter/Sort trigger right inside search */}
              <button
                onClick={() => setShowSearchFilters(!showSearchFilters)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-purple-900/60 transition-colors cursor-pointer ${
                  statusFilter !== 'all' || sortBy !== 'recent' || genreFilter !== 'all'
                    ? 'text-purple-300'
                    : 'text-purple-400/50 hover:text-purple-300'
                }`}
                title="Filtrar e ordenar pesquisa"
              >
                <SlidersHorizontal className="w-3 h-3" />
              </button>

              {/* Attached Filter Popover */}
              {showSearchFilters && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowSearchFilters(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-[#1e0e2b] border border-purple-800/60 rounded-xl shadow-2xl z-40 p-3.5 space-y-3 text-xs text-purple-100 backdrop-blur-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-900/50">
                      <span className="font-semibold text-purple-200">Filtros & Ordenação</span>
                      {(statusFilter !== 'all' || sortBy !== 'recent' || genreFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setStatusFilter('all');
                            setSortBy('recent');
                            setGenreFilter('all');
                          }}
                          className="text-[11px] text-purple-400 hover:text-purple-300 underline cursor-pointer"
                        >
                          Limpar
                        </button>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="text-[11px] text-purple-300/70 block mb-1 font-mono uppercase">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-2 py-1.5 bg-[#14081c] border border-purple-900/70 rounded-md text-xs text-purple-100 focus:outline-none focus:border-purple-500"
                      >
                        <option value="all">Todos os Status</option>
                        <option value="reading">Lendo Agora</option>
                        <option value="want_to_read">Quero Ler</option>
                        <option value="completed">Concluídos</option>
                        <option value="favorites">Apenas Favoritos</option>
                      </select>
                    </div>

                    {/* Genre */}
                    <div>
                      <label className="text-[11px] text-purple-300/70 block mb-1 font-mono uppercase">Gênero</label>
                      <select
                        value={genreFilter}
                        onChange={(e) => setGenreFilter(e.target.value)}
                        className="w-full px-2 py-1.5 bg-[#14081c] border border-purple-900/70 rounded-md text-xs text-purple-100 focus:outline-none focus:border-purple-500"
                      >
                        <option value="all">Todos os Gêneros</option>
                        {availableGenres.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="text-[11px] text-purple-300/70 block mb-1 font-mono uppercase">Ordenar por</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-2 py-1.5 bg-[#14081c] border border-purple-900/70 rounded-md text-xs text-purple-100 focus:outline-none focus:border-purple-500"
                      >
                        <option value="recent">Recentemente Lidos</option>
                        <option value="progress">Maior Progresso</option>
                        <option value="title">Título (A-Z)</option>
                        <option value="author">Autor (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Daily Streak Flame & count */}
            <div
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-purple-950/60 border border-purple-900/60 text-xs font-mono tabular-nums text-purple-200"
              title={`Sequência de leitura diária: ${streakDays} dia(s). ${booksReadTodayCount > 0 ? `${booksReadTodayCount} sessão/livro hoje!` : 'Leia hoje para manter a chama!'}`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
              <span className="font-semibold text-purple-100">{streakDays}</span>
            </div>

            {/* Discreet Icon: Anotações */}
            <button
              onClick={() => setActiveTab('notes')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-purple-900/60 border-purple-600/60 text-purple-200'
                  : 'bg-transparent border-transparent text-purple-400/70 hover:text-purple-200 hover:bg-purple-950/50'
              }`}
              title="Anotações & Citações"
            >
              <Highlighter className="w-4 h-4" />
            </button>

            {/* Discreet Icon: Estatísticas */}
            <button
              onClick={() => setActiveTab('stats')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-purple-900/60 border-purple-600/60 text-purple-200'
                  : 'bg-transparent border-transparent text-purple-400/70 hover:text-purple-200 hover:bg-purple-950/50'
              }`}
              title="Estatísticas de Leitura"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            {/* Add Book CTA in orchid style */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-600 rounded-lg shadow-sm border border-purple-500/30 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Adicionar Livro</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

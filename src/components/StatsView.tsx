import React, { useState } from 'react';
import { Book, ReadingGoal } from '../types/library';
import { BarChart3, Target, BookOpen, Flame, Calendar, Clock, Trophy, Edit2 } from 'lucide-react';
import { TulipOrnament, TulipFrameCorner } from './TulipOrnament';

interface StatsViewProps {
  books: Book[];
  readingGoal: ReadingGoal;
  onUpdateGoal: (newGoal: ReadingGoal) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ books, readingGoal, onUpdateGoal }) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoalBooks, setTempGoalBooks] = useState(readingGoal.targetBooks);
  const [tempGoalPages, setTempGoalPages] = useState(readingGoal.targetPages);

  // Compute stats
  const totalBooks = books.length;
  const completedBooks = books.filter((b) => b.status === 'completed');
  const readingBooks = books.filter((b) => b.status === 'reading');
  const wantToReadBooks = books.filter((b) => b.status === 'want_to_read');

  const totalPagesRead = books.reduce((acc, b) => acc + (b.currentPage || 0), 0);

  // Collect reading sessions
  const allSessions: Array<{ date: string; pagesRead: number; durationMinutes?: number }> = [];
  books.forEach((b) => {
    if (b.readingSessions) {
      allSessions.push(...b.readingSessions);
    }
  });

  // Calculate streak
  const sessionDates = Array.from(new Set(allSessions.map((s) => s.date))).sort();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (sessionDates.includes(today) || sessionDates.includes(yesterday)) {
    streak = sessionDates.length;
  }

  // Genre distribution
  const genreCountMap = new Map<string, number>();
  books.forEach((b) => {
    const g = b.genre || 'Geral';
    genreCountMap.set(g, (genreCountMap.get(g) || 0) + 1);
  });
  const genreDistribution = Array.from(genreCountMap.entries()).sort((a, b) => b[1] - a[1]);

  const goalBooksPercent = Math.min(100, Math.round((completedBooks.length / readingGoal.targetBooks) * 100));
  const goalPagesPercent = Math.min(100, Math.round((totalPagesRead / readingGoal.targetPages) * 100));

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoal({
      ...readingGoal,
      targetBooks: tempGoalBooks,
      targetPages: tempGoalPages,
    });
    setIsEditingGoal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-950/70">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-purple-100 font-reader-serif flex items-center gap-2">
            <span>Estatísticas de Leitura</span>
            <TulipOrnament className="w-6 h-3 opacity-40" />
          </h2>
          <p className="text-xs text-purple-300/70 mt-0.5">
            Ritmo de leitura, frequência diária e distribuição de obras.
          </p>
        </div>

        <button
          onClick={() => setIsEditingGoal(!isEditingGoal)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-800/60 bg-[#1e0e2b] hover:bg-purple-900/40 text-xs font-medium text-purple-200 transition-colors self-start cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 text-purple-400" />
          <span>{isEditingGoal ? 'Fechar Edição' : 'Ajustar Meta Anual'}</span>
        </button>
      </div>

      {/* Goal Edit Panel */}
      {isEditingGoal && (
        <form onSubmit={handleSaveGoal} className="p-4 bg-[#180b22] border border-purple-800/70 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-purple-200">
            Definir Metas para {readingGoal.year}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-purple-300/70 mb-1">Meta de Livros Concluídos</label>
              <input
                type="number"
                min="1"
                max="200"
                value={tempGoalBooks}
                onChange={(e) => setTempGoalBooks(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-purple-300/70 mb-1">Meta de Páginas Lidas</label>
              <input
                type="number"
                min="100"
                max="100000"
                step="500"
                value={tempGoalPages}
                onChange={(e) => setTempGoalPages(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 font-mono tabular-nums"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer border border-purple-500/30"
            >
              Salvar Metas
            </button>
          </div>
        </form>
      )}

      {/* Primary Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Books read */}
        <div className="p-4 rounded-xl bg-[#1a0d26]/80 border border-purple-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-300/70">
            <span>Livros Concluídos</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-purple-100">
            {completedBooks.length} <span className="text-xs font-normal text-purple-400/60">/ {readingGoal.targetBooks}</span>
          </div>
          <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${goalBooksPercent}%` }} />
          </div>
          <div className="text-[11px] text-purple-400/70 font-mono">
            {goalBooksPercent}% da meta anual
          </div>
        </div>

        {/* Metric 2: Pages read */}
        <div className="p-4 rounded-xl bg-[#1a0d26]/80 border border-purple-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-300/70">
            <span>Páginas Lidas</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-purple-100">
            {totalPagesRead.toLocaleString()} <span className="text-xs font-normal text-purple-400/60">/ {readingGoal.targetPages.toLocaleString()}</span>
          </div>
          <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${goalPagesPercent}%` }} />
          </div>
          <div className="text-[11px] text-purple-400/70 font-mono">
            {goalPagesPercent}% das páginas previstas
          </div>
        </div>

        {/* Metric 3: Active streak */}
        <div className="p-4 rounded-xl bg-[#1a0d26]/80 border border-purple-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-300/70">
            <span>Sequência Diária</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-purple-100">
            {streak} <span className="text-xs font-normal text-purple-400/60">{streak === 1 ? 'dia' : 'dias'}</span>
          </div>
          <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full" style={{ width: `${Math.min(100, streak * 20)}%` }} />
          </div>
          <div className="text-[11px] text-purple-400/70">
            {streak > 0 ? 'Hábito constante mantido' : 'Leia hoje para iniciar!'}
          </div>
        </div>

        {/* Metric 4: In Progress */}
        <div className="p-4 rounded-xl bg-[#1a0d26]/80 border border-purple-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-300/70">
            <span>Lendo Agora</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-purple-100">
            {readingBooks.length} <span className="text-xs font-normal text-purple-400/60">obras</span>
          </div>
          <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${Math.min(100, (readingBooks.length / (totalBooks || 1)) * 100)}%` }} />
          </div>
          <div className="text-[11px] text-purple-400/70">
            {wantToReadBooks.length} na lista "Quero Ler"
          </div>
        </div>
      </div>

      {/* Genre distribution */}
      <div className="p-4 rounded-xl bg-[#1a0d26]/80 border border-purple-900/50 space-y-3">
        <h3 className="text-xs font-semibold text-purple-200">
          Distribuição por Gênero
        </h3>

        <div className="space-y-2">
          {genreDistribution.map(([genre, count]) => {
            const p = Math.round((count / (totalBooks || 1)) * 100);
            return (
              <div key={genre} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-purple-200">
                  <span className="truncate pr-2">{genre}</span>
                  <span className="font-mono tabular-nums text-purple-400/80 shrink-0">
                    {count} ({p}%)
                  </span>
                </div>
                <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

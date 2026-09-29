import React, { useState, useEffect } from 'react';
import { Book, Bookmark, BookNote, ReadingGoal, ReadingStatus } from './types/library';
import {
  getLibraryBooks,
  saveBookToDB,
  deleteBookFromDB,
  updateBookCoverInDB,
  updateBookProgress,
  addBookmarkToBook,
  removeBookmarkFromBook,
  addNoteToBook,
  removeNoteFromBook,
  getReadingGoal,
  saveReadingGoal,
} from './services/storage';

import { Header } from './components/Header';
import { DashboardHome } from './components/DashboardHome';
import { LibraryView } from './components/LibraryView';
import { NotesView } from './components/NotesView';
import { StatsView } from './components/StatsView';
import { BookReader } from './components/BookReader';
import { UploadModal } from './components/UploadModal';
import { ProgressModal } from './components/ProgressModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ChangeCoverModal } from './components/ChangeCoverModal';
import { TulipBackgroundAtmosphere } from './components/TulipOrnament';
import { getAccurateBookPageCount } from './utils/bookPaginator';
import { INITIAL_BOOKS } from './data/initialBooks';
import { resolveCoverUrl } from './utils/coverAssets';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingGoal, setReadingGoal] = useState<ReadingGoal>({
    year: 2026,
    targetBooks: 24,
    targetPages: 6000,
  });

  // Navigation tab: 'home' | 'library' | 'notes' | 'stats'
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'notes' | 'stats'>('home');

  // Search & Filter state attached to the search bar
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [genreFilter, setGenreFilter] = useState('all');

  // Modals & Reader state
  const [activeReadingBook, setActiveReadingBook] = useState<Book | null>(null);
  const [progressModalBook, setProgressModalBook] = useState<Book | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [bookToChangeCover, setBookToChangeCover] = useState<Book | null>(null);

  // Load books & goal on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedBooks, loadedGoal] = await Promise.all([
          getLibraryBooks(),
          getReadingGoal(),
        ]);
        const initialMap = new Map(INITIAL_BOOKS.map((ib) => [ib.id, ib]));
        const synchronizedBooks = loadedBooks.map((b) => {
          const initialMatch = initialMap.get(b.id);
          let currentBook = b;
          if (initialMatch && (!b.chapters || b.chapters.length < (initialMatch.chapters?.length || 0))) {
            currentBook = {
              ...b,
              chapters: initialMatch.chapters,
            };
            saveBookToDB(currentBook);
          }

          // Migrate any legacy or unbundled coverUrls
          const resolvedCover = resolveCoverUrl(currentBook.coverUrl, currentBook.title, currentBook.author);
          if (resolvedCover !== currentBook.coverUrl) {
            currentBook = {
              ...currentBook,
              coverUrl: resolvedCover,
            };
            saveBookToDB(currentBook);
          }

          if (currentBook.format !== 'pdf') {
            const accuratePages = getAccurateBookPageCount(currentBook);
            if (accuratePages > 0 && currentBook.totalPages !== accuratePages) {
              const clamped = Math.min(currentBook.currentPage, accuratePages);
              const updated = {
                ...currentBook,
                totalPages: accuratePages,
                currentPage: clamped,
                status: clamped >= accuratePages ? 'completed' : currentBook.status,
              };
              saveBookToDB(updated);
              return updated;
            }
          }
          return currentBook;
        });
        setBooks(synchronizedBooks);
        setReadingGoal(loadedGoal);
      } catch (err) {
        console.error('Falha ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute daily reading streak and today's activity
  const { streakDays, booksReadTodayCount } = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const sessionDates = new Set<string>();
    let todayCount = 0;

    books.forEach((b) => {
      if (b.readingSessions) {
        b.readingSessions.forEach((s) => {
          sessionDates.add(s.date);
          if (s.date === today) todayCount += 1;
        });
      }
    });

    const datesArray = Array.from(sessionDates).sort();
    let streak = 0;
    if (datesArray.includes(today) || datesArray.includes(yesterday)) {
      streak = datesArray.length;
    }

    return { streakDays: streak, booksReadTodayCount: todayCount };
  }, [books]);

  // Available genres
  const availableGenres = Array.from(new Set(books.map((b) => b.genre || 'Geral')));

  // Filter and sort books based on search bar and attached filters
  const filteredAndSortedBooks = React.useMemo(() => {
    let result = [...books];

    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q) ||
          (b.shelf && b.shelf.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter === 'reading') result = result.filter((b) => b.status === 'reading');
    else if (statusFilter === 'want_to_read') result = result.filter((b) => b.status === 'want_to_read');
    else if (statusFilter === 'completed') result = result.filter((b) => b.status === 'completed');
    else if (statusFilter === 'favorites') result = result.filter((b) => b.favorite);

    // Genre filter
    if (genreFilter !== 'all') {
      result = result.filter((b) => b.genre === genreFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        const dateA = a.lastReadDate ? new Date(a.lastReadDate).getTime() : new Date(a.dateAdded).getTime();
        const dateB = b.lastReadDate ? new Date(b.lastReadDate).getTime() : new Date(b.dateAdded).getTime();
        return dateB - dateA;
      }
      if (sortBy === 'progress') {
        const pA = a.totalPages > 0 ? a.currentPage / a.totalPages : 0;
        const pB = b.totalPages > 0 ? b.currentPage / b.totalPages : 0;
        return pB - pA;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'author') {
        return a.author.localeCompare(b.author);
      }
      return 0;
    });

    return result;
  }, [books, searchQuery, statusFilter, genreFilter, sortBy]);

  // Action handlers
  const handleOpenReader = (book: Book) => {
    setActiveReadingBook(book);
  };

  const handleOpenProgressModal = (book: Book) => {
    setProgressModalBook(book);
  };

  const handleSaveBook = async (newBook: Book) => {
    await saveBookToDB(newBook);
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleDeleteBook = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setBookToDelete(book);
    }
  };

  const handleConfirmDeleteBook = async (bookId: string) => {
    await deleteBookFromDB(bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    if (activeReadingBook?.id === bookId) {
      setActiveReadingBook(null);
    }
    setBookToDelete(null);
  };

  const handleSaveNewCover = async (bookId: string, newCoverUrl: string) => {
    const updated = await updateBookCoverInDB(bookId, newCoverUrl);
    if (updated) {
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      if (activeReadingBook && activeReadingBook.id === bookId) {
        setActiveReadingBook(updated);
      }
    }
  };

  const handleUpdateProgressInDB = async (bookId: string, newPage: number, durationMinutes = 15, newTotalPages?: number) => {
    const updated = await updateBookProgress(bookId, newPage, durationMinutes, newTotalPages);
    if (updated) {
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      if (activeReadingBook && activeReadingBook.id === bookId) {
        setActiveReadingBook(updated);
      }
    }
  };

  const handleToggleStatus = async (book: Book, newStatus: ReadingStatus) => {
    const updated: Book = {
      ...book,
      status: newStatus,
      currentPage: newStatus === 'completed' ? book.totalPages : book.currentPage,
    };
    await saveBookToDB(updated);
    setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
  };

  const handleToggleFavorite = async (book: Book) => {
    const updated: Book = {
      ...book,
      favorite: !book.favorite,
    };
    await saveBookToDB(updated);
    setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
  };

  const handleAddBookmark = async (bookmark: Bookmark) => {
    if (!activeReadingBook) return;
    const updated = await addBookmarkToBook(activeReadingBook.id, bookmark);
    if (updated) {
      setBooks((prev) => prev.map((b) => (b.id === activeReadingBook.id ? updated : b)));
      setActiveReadingBook(updated);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    if (!activeReadingBook) return;
    const updated = await removeBookmarkFromBook(activeReadingBook.id, bookmarkId);
    if (updated) {
      setBooks((prev) => prev.map((b) => (b.id === activeReadingBook.id ? updated : b)));
      setActiveReadingBook(updated);
    }
  };

  const handleAddNote = async (note: BookNote) => {
    if (!activeReadingBook) return;
    const updated = await addNoteToBook(activeReadingBook.id, note);
    if (updated) {
      setBooks((prev) => prev.map((b) => (b.id === activeReadingBook.id ? updated : b)));
      setActiveReadingBook(updated);
    }
  };

  const handleRemoveNote = async (noteId: string) => {
    if (!activeReadingBook) return;
    const updated = await removeNoteFromBook(activeReadingBook.id, noteId);
    if (updated) {
      setBooks((prev) => prev.map((b) => (b.id === activeReadingBook.id ? updated : b)));
      setActiveReadingBook(updated);
    }
  };

  const handleOpenBookAtPage = (book: Book, page: number) => {
    const targetBook = { ...book, currentPage: page };
    setActiveReadingBook(targetBook);
  };

  const handleUpdateGoal = async (newGoal: ReadingGoal) => {
    setReadingGoal(newGoal);
    await saveReadingGoal(newGoal);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12081a] flex items-center justify-center text-purple-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-purple-400">Carregando acervo literário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12081a] text-[#f5eefb] flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200 relative overflow-x-hidden">
      
      {/* 3x Larger & Vivid Purple Tulip Background Atmosphere */}
      <TulipBackgroundAtmosphere />

      {/* Top Bar Navigation with discreet streak and icons */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        streakDays={streakDays}
        booksReadTodayCount={booksReadTodayCount}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
        availableGenres={availableGenres}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* Search / Filter active indicator */}
        {(searchQuery.trim() || statusFilter !== 'all' || genreFilter !== 'all') && (
          <div className="mb-4 pb-3 border-b border-purple-900/50 flex items-center justify-between text-xs">
            <p className="text-purple-300">
              Filtro ativo: {searchQuery && <span>"{searchQuery}" </span>}
              {statusFilter !== 'all' && <span className="text-purple-400 font-mono">({statusFilter}) </span>}
              {genreFilter !== 'all' && <span className="text-purple-400 font-mono">[{genreFilter}] </span>}
              — {filteredAndSortedBooks.length} livro(s) encontrado(s)
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setGenreFilter('all');
              }}
              className="text-purple-400 hover:text-purple-200 underline cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Tab 1: Início (Home) */}
        {activeTab === 'home' && (
          <DashboardHome
            books={filteredAndSortedBooks}
            onRead={handleOpenReader}
            onUpdateProgress={handleOpenProgressModal}
            onToggleStatus={handleToggleStatus}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteBook}
            onChangeCover={(book) => setBookToChangeCover(book)}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onViewAllInLibrary={() => setActiveTab('library')}
          />
        )}

        {/* Tab 2: Biblioteca (Todos os livros + Gêneros & Coleções) */}
        {activeTab === 'library' && (
          <LibraryView
            books={filteredAndSortedBooks}
            onRead={handleOpenReader}
            onUpdateProgress={handleOpenProgressModal}
            onToggleStatus={handleToggleStatus}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteBook}
            onChangeCover={(book) => setBookToChangeCover(book)}
            onOpenUpload={() => setIsUploadModalOpen(true)}
          />
        )}

        {/* Tab 3: Anotações & Citações (accessible via discreet top icon) */}
        {activeTab === 'notes' && (
          <NotesView
            books={books}
            onOpenBookAtPage={handleOpenBookAtPage}
          />
        )}

        {/* Tab 4: Estatísticas de Leitura (accessible via discreet top icon) */}
        {activeTab === 'stats' && (
          <StatsView
            books={books}
            readingGoal={readingGoal}
            onUpdateGoal={handleUpdateGoal}
          />
        )}

      </main>

      {/* Reader Modal (Full viewport immersion) */}
      {activeReadingBook && (
        <BookReader
          book={activeReadingBook}
          onClose={() => setActiveReadingBook(null)}
          onUpdateProgress={(newPage, newTotalPages) => handleUpdateProgressInDB(activeReadingBook.id, newPage, 15, newTotalPages)}
          onAddBookmark={handleAddBookmark}
          onRemoveBookmark={handleRemoveBookmark}
          onAddNote={handleAddNote}
          onRemoveNote={handleRemoveNote}
        />
      )}

      {/* Upload Book Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveBook={handleSaveBook}
        existingGenres={availableGenres}
      />

      {/* Quick Progress Update Modal */}
      <ProgressModal
        book={progressModalBook}
        isOpen={!!progressModalBook}
        onClose={() => setProgressModalBook(null)}
        onSaveProgress={handleUpdateProgressInDB}
      />

      {/* Custom Functional Delete Confirmation Modal */}
      <DeleteConfirmModal
        book={bookToDelete}
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={handleConfirmDeleteBook}
      />

      {/* Change Book Cover Modal */}
      <ChangeCoverModal
        book={bookToChangeCover}
        isOpen={!!bookToChangeCover}
        onClose={() => setBookToChangeCover(null)}
        onSaveCover={handleSaveNewCover}
      />

    </div>
  );
}

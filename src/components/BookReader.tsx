import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Book, Bookmark, BookNote, ReaderFont, ReaderTheme } from '../types/library';
import { paginateBookContent, BookPage } from '../utils/bookPaginator';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark as BookmarkIcon,
  BookmarkPlus,
  BookOpen,
  Sliders,
  Maximize2,
  Minimize2,
  CheckCircle,
  FileText,
  Highlighter,
  List,
  Columns,
  Square,
  X,
  Plus,
  Star
} from 'lucide-react';
import { TulipOrnament } from './TulipOrnament';

interface BookReaderProps {
  book: Book;
  onClose: () => void;
  onUpdateProgress: (newPage: number, newTotalPages?: number) => void;
  onAddBookmark: (bookmark: Bookmark) => void;
  onRemoveBookmark: (bookmarkId: string) => void;
  onAddNote: (note: BookNote) => void;
  onRemoveNote: (noteId: string) => void;
}

export const BookReader: React.FC<BookReaderProps> = ({
  book,
  onClose,
  onUpdateProgress,
  onAddBookmark,
  onRemoveBookmark,
  onAddNote,
  onRemoveNote,
}) => {
  // Generate real, authentic pages based on book text
  const pages: BookPage[] = useMemo(() => paginateBookContent(book), [book]);
  const totalPages = pages.length;

  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (book.currentPage > 0) {
      return Math.min(book.currentPage, totalPages);
    }
    return 1;
  });

  // Reading spread mode: 'double' (open book spread) or 'single'
  const [spreadMode, setSpreadMode] = useState<'double' | 'single'>(() => {
    return window.innerWidth >= 900 ? 'double' : 'single';
  });

  const [theme, setTheme] = useState<ReaderTheme>('dark');
  const [font, setFont] = useState<ReaderFont>('serif');
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<number>(1.75);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'none' | 'toc' | 'bookmarks' | 'notes' | 'settings'>('none');

  // Top header auto-hide state: only appears when mouse hovers over top
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(false);

  // Bottom toolbar visibility: only appears after clicking bottom-left page icon button
  const [showBottomControls, setShowBottomControls] = useState<boolean>(false);

  // Bookmark / Note modal state
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  const [showAddBookmarkInput, setShowAddBookmarkInput] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteQuote, setNewNoteQuote] = useState('');
  const [showAddNoteInput, setShowAddNoteInput] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPageBodyRef = useRef<HTMLDivElement>(null);
  const rightPageBodyRef = useRef<HTMLDivElement>(null);

  // Reset reading page scroll to top whenever page turns
  useEffect(() => {
    if (leftPageBodyRef.current) leftPageBodyRef.current.scrollTop = 0;
    if (rightPageBodyRef.current) rightPageBodyRef.current.scrollTop = 0;
  }, [currentPage]);

  // Sync actual totalPages with book metadata if different
  useEffect(() => {
    if (book.totalPages !== totalPages) {
      onUpdateProgress(currentPage, totalPages);
    }
  }, [book.id, totalPages]);

  // Sync page when book changes
  useEffect(() => {
    if (book.currentPage > 0) {
      setCurrentPage(Math.min(book.currentPage, totalPages));
    } else {
      setCurrentPage(1);
    }
  }, [book.id, totalPages]);

  // Turn page logic
  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(clamped);
    onUpdateProgress(clamped, totalPages);

    if (clamped === totalPages) {
      triggerCompletionConfetti();
    }
  };

  const handleNext = () => {
    if (spreadMode === 'double' && window.innerWidth >= 900) {
      if (currentPage === 1) {
        handlePageChange(2);
      } else if (currentPage + 2 <= totalPages) {
        handlePageChange(currentPage + 2);
      } else if (currentPage + 1 <= totalPages) {
        handlePageChange(currentPage + 1);
      }
    } else {
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    }
  };

  const handlePrev = () => {
    if (spreadMode === 'double' && window.innerWidth >= 900) {
      if (currentPage <= 2) {
        handlePageChange(1);
      } else {
        handlePageChange(currentPage - 2);
      }
    } else {
      if (currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen?.();
          setIsFullscreen(false);
        } else if (activeSidebarTab !== 'none') {
          setActiveSidebarTab('none');
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, spreadMode, isFullscreen, activeSidebarTab]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const triggerCompletionConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCreateBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookmarkLabel.trim()) return;

    const pageObj = pages[currentPage - 1];
    const newBookmark: Bookmark = {
      id: 'bm-' + Date.now(),
      page: currentPage,
      chapterTitle: pageObj?.chapterTitle || `Página ${currentPage}`,
      label: bookmarkLabel.trim(),
      createdAt: new Date().toISOString(),
    };

    onAddBookmark(newBookmark);
    setBookmarkLabel('');
    setShowAddBookmarkInput(false);
  };

  const handleToggleRibbonBookmark = () => {
    const existing = book.bookmarks?.find((b) => b.page === currentPage);
    if (existing) {
      onRemoveBookmark(existing.id);
    } else {
      const pageObj = pages[currentPage - 1];
      const newBookmark: Bookmark = {
        id: 'bm-' + Date.now(),
        page: currentPage,
        chapterTitle: pageObj?.chapterTitle || `Página ${currentPage}`,
        label: `Marcador na pág. ${currentPage}`,
        createdAt: new Date().toISOString(),
      };
      onAddBookmark(newBookmark);
    }
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: BookNote = {
      id: 'note-' + Date.now(),
      page: currentPage,
      quote: newNoteQuote.trim() || undefined,
      note: newNoteText.trim(),
      createdAt: new Date().toISOString(),
      color: 'amber',
    };

    onAddNote(newNote);
    setNewNoteText('');
    setNewNoteQuote('');
    setShowAddNoteInput(false);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selected = selection.toString().trim();
      if (selected.length > 5) {
        setNewNoteQuote(selected);
        setActiveSidebarTab('notes');
        setShowAddNoteInput(true);
      }
    }
  };

  // Chapter jump handler
  const handleJumpToChapter = (chapterTitle: string) => {
    const targetPageIndex = pages.findIndex((p) => p.chapterTitle === chapterTitle);
    if (targetPageIndex >= 0) {
      handlePageChange(targetPageIndex + 1);
      setActiveSidebarTab('none');
    }
  };

  // Calculate pages for double spread:
  // In classic book design: Page 1 is on the right (recto) facing the frontispiece (verso)
  // Pages 2 & 3, 4 & 5, etc. are facing spreads
  const isDouble = spreadMode === 'double' && window.innerWidth >= 900;
  
  let leftPageNumber: number | null = null;
  let rightPageNumber: number | null = null;

  if (isDouble) {
    if (currentPage === 1) {
      leftPageNumber = null; // Title page / Frontispiece
      rightPageNumber = 1;
    } else if (currentPage % 2 === 0) {
      leftPageNumber = currentPage;
      rightPageNumber = currentPage + 1 <= totalPages ? currentPage + 1 : null;
    } else {
      leftPageNumber = currentPage - 1;
      rightPageNumber = currentPage;
    }
  } else {
    rightPageNumber = currentPage;
  }

  const leftPageObj = leftPageNumber ? pages[leftPageNumber - 1] : null;
  const rightPageObj = rightPageNumber ? pages[rightPageNumber - 1] : null;

  const isCurrentBookmarked = Boolean(book.bookmarks?.some((b) => b.page === currentPage));
  const isLeftBookmarked = Boolean(leftPageNumber && book.bookmarks?.some((b) => b.page === leftPageNumber));
  const isRightBookmarked = Boolean(rightPageNumber && book.bookmarks?.some((b) => b.page === rightPageNumber));
  const percent = Math.min(100, Math.round((currentPage / (totalPages || 1)) * 100));

  // Authentic physical book themes
  const themePageClasses: Record<ReaderTheme, { bg: string; text: string; spineShadow: string; spineLine: string; paperEdge: string; border: string }> = {
    // 1. Dark Plum / Literary Bloom signature theme
    dark: {
      bg: 'bg-[#1a0e28]',
      text: 'text-[#f5eefb]',
      spineShadow: 'from-black/40 via-black/10 to-transparent',
      spineLine: 'bg-purple-950/60',
      paperEdge: 'shadow-[0_8px_30px_rgb(0,0,0,0.5)]',
      border: 'border-purple-900/40',
    },
    // 2. Classic Cream Book Paper (authentic hardback novel feel)
    light: {
      bg: 'bg-[#FAF7F0]',
      text: 'text-[#231812]',
      spineShadow: 'from-amber-950/20 via-amber-950/5 to-transparent',
      spineLine: 'bg-[#e4dac5]',
      paperEdge: 'shadow-[0_8px_30px_rgba(40,25,10,0.25)]',
      border: 'border-[#dfd3be]',
    },
    // 3. Vintage Sepia Parchment
    sepia: {
      bg: 'bg-[#F4ECD8]',
      text: 'text-[#322013]',
      spineShadow: 'from-amber-950/25 via-amber-950/5 to-transparent',
      spineLine: 'bg-[#d8c7a6]',
      paperEdge: 'shadow-[0_8px_30px_rgba(50,30,15,0.3)]',
      border: 'border-[#d2c09d]',
    },
    // 4. Soft Ebony Night
    slate: {
      bg: 'bg-[#141419]',
      text: 'text-[#e5e5ec]',
      spineShadow: 'from-black/50 via-black/15 to-transparent',
      spineLine: 'bg-neutral-800',
      paperEdge: 'shadow-[0_8px_30px_rgb(0,0,0,0.6)]',
      border: 'border-neutral-800',
    },
  };

  const fontClasses: Record<ReaderFont, string> = {
    serif: 'font-reader-serif',
    sans: 'font-reader-sans',
    mono: 'font-reader-mono',
  };

  const currentThemeStyles = themePageClasses[theme];

  // Distinct chapter titles for TOC
  const distinctChapters = useMemo(() => {
    const map = new Map<string, number>();
    pages.forEach((p, idx) => {
      if (!map.has(p.chapterTitle)) {
        map.set(p.chapterTitle, idx + 1);
      }
    });
    return Array.from(map.entries()).map(([title, startPage]) => ({ title, startPage }));
  }, [pages]);

  return (
    <div
      onMouseMove={(e) => {
        if (e.clientY <= 65) {
          setIsHeaderVisible(true);
        } else if (activeSidebarTab === 'none' && e.clientY > 85) {
          setIsHeaderVisible(false);
        }
      }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0e0614] select-text text-purple-100 overflow-hidden"
    >
      {/* Invisible top hover trigger band */}
      <div
        onMouseEnter={() => setIsHeaderVisible(true)}
        className="fixed top-0 left-0 right-0 h-4 z-40"
      />

      {/* Top Header Bar: Slides down on hover so it does not stay over the book */}
      <header
        onMouseEnter={() => setIsHeaderVisible(true)}
        onMouseLeave={() => {
          if (activeSidebarTab === 'none') {
            setIsHeaderVisible(false);
          }
        }}
        className={`fixed top-0 left-0 right-0 h-14 px-4 sm:px-6 flex items-center justify-between shrink-0 bg-[#160b1f]/95 backdrop-blur-md border-b border-purple-950/70 z-50 transition-all duration-300 ease-in-out ${
          isHeaderVisible || activeSidebarTab !== 'none'
            ? 'translate-y-0 opacity-100 shadow-2xl pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        
        {/* Left: Exit & Book Details */}
        <div className="flex items-center gap-3 truncate">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-purple-900/40 text-purple-300 hover:text-white transition-colors cursor-pointer"
            title="Voltar para a biblioteca"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="truncate">
            <h2 className="text-sm font-semibold truncate leading-tight text-purple-100 flex items-center gap-2">
              <span>{book.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/40 text-purple-300 font-mono">
                {totalPages} págs.
              </span>
            </h2>
            <p className="text-xs text-purple-400/70 truncate font-mono">
              {book.author}
            </p>
          </div>
        </div>

        {/* Right: Spread Mode, Drawers & Format Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Spread Toggle: Livro Aberto (2 Páginas) vs Página Única */}
          <button
            onClick={() => setSpreadMode(spreadMode === 'double' ? 'single' : 'double')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
              spreadMode === 'double'
                ? 'bg-purple-900/60 border-purple-600/60 text-purple-100'
                : 'bg-purple-950/40 border-purple-900/40 text-purple-300 hover:bg-purple-900/40'
            }`}
            title={spreadMode === 'double' ? 'Alternar para Página Única' : 'Alternar para Livro Aberto (2 Páginas)'}
          >
            {spreadMode === 'double' ? (
              <>
                <Columns className="w-3.5 h-3.5 text-[#c084fc]" />
                <span className="hidden md:inline">Livro Aberto</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5 text-[#c084fc]" />
                <span className="hidden md:inline">Página Única</span>
              </>
            )}
          </button>

          {/* Sumário */}
          <button
            onClick={() => setActiveSidebarTab(activeSidebarTab === 'toc' ? 'none' : 'toc')}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSidebarTab === 'toc' ? 'bg-purple-600 text-white font-semibold' : 'text-purple-300 hover:bg-purple-900/40'
            }`}
            title="Sumário de Capítulos"
          >
            <List className="w-4 h-4" />
            <span className="hidden lg:inline">Capítulos</span>
          </button>

          {/* Marcadores */}
          <button
            onClick={() => setActiveSidebarTab(activeSidebarTab === 'bookmarks' ? 'none' : 'bookmarks')}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSidebarTab === 'bookmarks' ? 'bg-purple-600 text-white font-semibold' : 'text-purple-300 hover:bg-purple-900/40'
            }`}
            title="Marcadores"
          >
            <BookmarkIcon className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
            <span className="hidden lg:inline">Marcadores</span>
            {(book.bookmarks?.length || 0) > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/80 font-mono text-purple-200">
                {book.bookmarks?.length}
              </span>
            )}
          </button>

          {/* Anotações */}
          <button
            onClick={() => setActiveSidebarTab(activeSidebarTab === 'notes' ? 'none' : 'notes')}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSidebarTab === 'notes' ? 'bg-purple-600 text-white font-semibold' : 'text-purple-300 hover:bg-purple-900/40'
            }`}
            title="Anotações e Citações"
          >
            <Highlighter className="w-4 h-4" />
            <span className="hidden lg:inline">Anotações</span>
            {(book.notes?.length || 0) > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/80 font-mono text-purple-200">
                {book.notes?.length}
              </span>
            )}
          </button>

          {/* Aparência */}
          <button
            onClick={() => setActiveSidebarTab(activeSidebarTab === 'settings' ? 'none' : 'settings')}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSidebarTab === 'settings' ? 'bg-purple-600 text-white font-semibold' : 'text-purple-300 hover:bg-purple-900/40'
            }`}
            title="Ajustes de Aparência"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden lg:inline">Aparência</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-purple-900/40 text-purple-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
            title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Reading Stage */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Desk / Reading Surface */}
        <div
          ref={containerRef}
          onMouseUp={handleTextSelection}
          className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 sm:py-8 flex flex-col items-center justify-center relative"
        >
          {book.format === 'pdf' ? (
            /* PDF Document Viewer */
            <div className="w-full h-full max-w-5xl flex flex-col items-center">
              {book.contentBlobUrl ? (
                <iframe
                  src={`${book.contentBlobUrl}#page=${currentPage}&toolbar=1&navpanes=0`}
                  title={book.title}
                  className="w-full flex-1 rounded-xl border border-purple-900/50 shadow-2xl bg-white"
                  style={{ minHeight: 'calc(100vh - 160px)' }}
                />
              ) : (
                <div className="text-center py-20">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50 text-purple-400" />
                  <p className="text-base font-medium">Documento PDF pronto para leitura.</p>
                  <p className="text-xs opacity-70 mt-1">Navegue pelas páginas através dos controles abaixo.</p>
                </div>
              )}
            </div>
          ) : (
            /* AUTHENTIC OPEN BOOK SPREAD */
            <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
              
              {/* The Physical Hardcover Volume Frame */}
              <div
                className={`relative w-full rounded-2xl p-2 sm:p-4 bg-[#14081c] border border-purple-950/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex justify-center`}
              >
                
                {/* Purple Silk Bookmark Ribbon hanging from the spine */}
                <button
                  onClick={handleToggleRibbonBookmark}
                  className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 group cursor-pointer"
                  title={isCurrentBookmarked ? 'Remover marcador desta página' : 'Marcar esta página com a fita'}
                >
                  <div
                    className={`w-3.5 transition-all duration-200 rounded-b-sm shadow-md border-x ${
                      isCurrentBookmarked
                        ? 'h-16 bg-gradient-to-b from-purple-700 via-purple-600 to-fuchsia-500 border-purple-300/60 shadow-purple-900/50'
                        : 'h-10 group-hover:h-14 bg-gradient-to-b from-purple-900 to-purple-700 border-purple-400/30 opacity-70 group-hover:opacity-100'
                    }`}
                  />
                  <div className="w-0 h-0 border-x-[7px] border-x-transparent border-t-[6px] border-t-purple-600 -mt-0.5 mx-auto" />
                </button>

                {/* The Open Paper Spread (Two Pages or Single Page) - Uniform classic dimensions for all books */}
                <div
                  className={`w-full ${
                    isDouble ? 'flex flex-row' : 'flex flex-col max-w-2xl'
                  } rounded-xl overflow-hidden ${currentThemeStyles.bg} ${currentThemeStyles.text} ${currentThemeStyles.border} ${currentThemeStyles.paperEdge} transition-all duration-200 h-[640px] sm:h-[680px] max-h-[calc(100vh-100px)] shadow-2xl`}
                >
                  
                  {/* LEFT PAGE (Verso) - Visible in double-page spread */}
                  {isDouble && (
                    <section
                      onClick={handlePrev}
                      className={`flex-1 h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 relative cursor-pointer select-text border-r ${currentThemeStyles.spineLine} hover:brightness-[0.98] transition-all overflow-hidden`}
                    >
                      {/* Golden Star for bookmarked page in the top-right corner (doesn't affect reading) */}
                      {isLeftBookmarked && (
                        <div
                          className="absolute top-3 right-4 sm:top-4 sm:right-6 pointer-events-none select-none z-20 flex items-center gap-1 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.65)]"
                          title="Página marcada"
                        >
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-300 animate-pulse" />
                        </div>
                      )}

                      {/* Inner Spine Shadow Gradient */}
                      <div className={`absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l ${currentThemeStyles.spineShadow} pointer-events-none`} />

                      {/* Left Page Running Header */}
                      <header className="flex items-center justify-between text-[11px] uppercase tracking-widest font-mono opacity-50 pb-4 border-b border-current/10 shrink-0">
                        <span className="truncate">{book.author}</span>
                        <span className="text-[10px] font-sans">verso</span>
                      </header>

                      {/* Left Page Body (Scrollable to reveal the rest of the page) */}
                      <div
                        ref={leftPageBodyRef}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 min-h-0 py-4 sm:py-6 pr-2 sm:pr-3 overflow-y-auto overscroll-contain reader-page-scroll ${fontClasses[font]} leading-relaxed select-text cursor-auto`}
                        style={{ fontSize: `${fontSize}px`, lineHeight }}
                      >
                        {leftPageObj ? (
                          <div className="space-y-4 text-justify">
                            {leftPageObj.isChapterStart && (
                              <div className="mb-6 pb-2 text-center border-b border-current/15">
                                <span className="text-xs uppercase tracking-widest opacity-60 block mb-1">
                                  {leftPageObj.chapterKicker}
                                </span>
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                                  {leftPageObj.chapterTitle}
                                </h3>
                              </div>
                            )}

                            {leftPageObj.paragraphs.map((paragraph, pIdx) => {
                              const isOpening = leftPageObj.isChapterStart && pIdx === 0;
                              return (
                                <p
                                  key={pIdx}
                                  className={`${
                                    isOpening
                                      ? 'first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:text-[#c084fc]'
                                      : 'indent-6 sm:indent-8'
                                  }`}
                                >
                                  {paragraph}
                                </p>
                              );
                            })}
                          </div>
                        ) : (
                          /* Frontispiece / Title Page when viewing Page 1 */
                          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 space-y-4 opacity-80">
                            <TulipOrnament size="sm" className="w-16 h-10 opacity-70" />
                            <h1 className="text-2xl sm:text-3xl font-bold font-reader-serif tracking-tight">
                              {book.title}
                            </h1>
                            <p className="text-sm font-mono tracking-widest uppercase opacity-70">
                              {book.author}
                            </p>
                            <div className="w-12 h-px bg-current opacity-30 my-2" />
                            <p className="text-xs italic max-w-xs opacity-60">
                              {book.genre} • Edição Digital Literary Bloom
                            </p>
                            <div className="pt-8 text-[11px] font-mono opacity-40">
                              Toque na página direita para avançar ➔
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Left Page Running Footer */}
                      <footer className="flex items-center justify-between text-xs font-mono opacity-60 pt-4 border-t border-current/10 shrink-0">
                        <span>{leftPageNumber ? `pág. ${leftPageNumber}` : ''}</span>
                        <span className="text-[10px] font-serif opacity-40">❦</span>
                      </footer>
                    </section>
                  )}

                  {/* CENTER SPINE CREASE (Binding Seam) */}
                  {isDouble && (
                    <div className={`w-px shrink-0 ${currentThemeStyles.spineLine} relative`}>
                      <div className="absolute inset-y-0 -left-1 -right-1 pointer-events-none shadow-inner" />
                    </div>
                  )}

                  {/* RIGHT PAGE (Recto) */}
                  <section
                    onClick={handleNext}
                    className={`flex-1 h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 relative cursor-pointer select-text hover:brightness-[0.98] transition-all overflow-hidden`}
                  >
                    {/* Golden Star for bookmarked page in the top-right corner (doesn't affect reading) */}
                    {isRightBookmarked && (
                      <div
                        className="absolute top-3 right-4 sm:top-4 sm:right-6 pointer-events-none select-none z-20 flex items-center gap-1 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.65)]"
                        title="Página marcada"
                      >
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-300 animate-pulse" />
                      </div>
                    )}

                    {/* Inner Spine Shadow Gradient */}
                    {isDouble && (
                      <div className={`absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r ${currentThemeStyles.spineShadow} pointer-events-none`} />
                    )}

                    {/* Right Page Running Header */}
                    <header className="flex items-center justify-between text-[11px] uppercase tracking-widest font-mono opacity-50 pb-4 border-b border-current/10 shrink-0">
                      <span className="truncate">{rightPageObj?.chapterTitle || book.title}</span>
                      <span className="text-[10px] font-sans">pág. {rightPageNumber}</span>
                    </header>

                    {/* Right Page Body (Scrollable to reveal the rest of the page) */}
                    <div
                      ref={rightPageBodyRef}
                      onClick={(e) => e.stopPropagation()}
                      className={`flex-1 min-h-0 py-4 sm:py-6 pr-2 sm:pr-3 overflow-y-auto overscroll-contain reader-page-scroll ${fontClasses[font]} leading-relaxed select-text cursor-auto`}
                      style={{ fontSize: `${fontSize}px`, lineHeight }}
                    >
                      {rightPageObj ? (
                        <div className="space-y-4 text-justify">
                          {rightPageObj.isChapterStart && (
                            <div className="mb-6 pb-2 text-center border-b border-current/15">
                              <span className="text-xs uppercase tracking-widest opacity-60 block mb-1">
                                {rightPageObj.chapterKicker}
                              </span>
                              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                                {rightPageObj.chapterTitle}
                              </h3>
                            </div>
                          )}

                          {rightPageObj.paragraphs.map((paragraph, pIdx) => {
                            const isOpening = rightPageObj.isChapterStart && pIdx === 0;
                            return (
                              <p
                                key={pIdx}
                                className={`${
                                  isOpening
                                    ? 'first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:text-[#c084fc]'
                                    : 'indent-6 sm:indent-8'
                                }`}
                              >
                                {paragraph}
                              </p>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                          <p className="font-serif italic">Fim da obra.</p>
                        </div>
                      )}
                    </div>

                    {/* Right Page Running Footer */}
                    <footer className="flex items-center justify-between text-xs font-mono opacity-60 pt-4 border-t border-current/10 shrink-0">
                      <span className="text-[10px] font-serif opacity-40">❦</span>
                      <span>pág. {rightPageNumber}</span>
                    </footer>
                  </section>

                </div>
              </div>

              {/* Quick Turn Helpers underneath */}
              <div className="w-full flex items-center justify-between px-2 pt-2 text-[11px] text-purple-400/60 font-mono">
                <span className="hidden sm:inline">← Clique no lado esquerdo ou tecla [←] para voltar</span>
                <span className="hidden sm:inline">Clique no lado direito ou tecla [→] para avançar →</span>
              </div>

            </div>
          )}
        </div>

        {/* Sidebar Drawers (TOC, Bookmarks, Notes, Appearance) */}
        {activeSidebarTab !== 'none' && (
          <aside className="w-80 md:w-96 border-l border-purple-950/80 bg-[#160b1f]/95 backdrop-blur-xl flex flex-col z-40 transition-all shadow-2xl">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-purple-900/60 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-purple-100 flex items-center gap-2">
                {activeSidebarTab === 'toc' && <span>Sumário de Capítulos</span>}
                {activeSidebarTab === 'bookmarks' && <span>Marcadores de Página</span>}
                {activeSidebarTab === 'notes' && <span>Anotações & Citações</span>}
                {activeSidebarTab === 'settings' && <span>Ajustes de Aparência</span>}
              </h3>
              <button
                onClick={() => setActiveSidebarTab('none')}
                className="p-1 rounded-md hover:bg-purple-900/40 text-purple-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* 1. TABLE OF CONTENTS */}
              {activeSidebarTab === 'toc' && (
                <div className="space-y-1.5">
                  {distinctChapters.map((chap, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleJumpToChapter(chap.title)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer bg-purple-950/40 hover:bg-purple-900/50 border border-purple-900/40 text-purple-200"
                    >
                      <span className="truncate pr-2 font-medium">{chap.title}</span>
                      <span className="text-[10px] font-mono text-purple-400 shrink-0">pág. {chap.startPage}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 2. BOOKMARKS */}
              {activeSidebarTab === 'bookmarks' && (
                <div className="space-y-4">
                  {!showAddBookmarkInput ? (
                    <button
                      onClick={() => setShowAddBookmarkInput(true)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-purple-700/60 hover:border-purple-400 text-xs font-medium text-purple-300 hover:text-purple-100 transition-colors cursor-pointer"
                    >
                      <BookmarkPlus className="w-4 h-4 text-[#c084fc]" />
                      <span>Marcar Página Atual (pág. {currentPage})</span>
                    </button>
                  ) : (
                    <form onSubmit={handleCreateBookmark} className="p-3 rounded-lg bg-purple-950/80 space-y-2 border border-purple-800/60">
                      <div className="text-xs font-medium text-purple-200">Marcador na pág. {currentPage}</div>
                      <input
                        type="text"
                        autoFocus
                        value={bookmarkLabel}
                        onChange={(e) => setBookmarkLabel(e.target.value)}
                        placeholder="Ex: Trecho marcante do diálogo..."
                        className="w-full px-2.5 py-1.5 text-xs bg-[#12081a] rounded border border-purple-800/60 text-purple-100 focus:outline-none focus:border-purple-400"
                      />
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddBookmarkInput(false)}
                          className="px-2.5 py-1 text-xs text-purple-400 hover:text-purple-200 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded text-xs transition-colors cursor-pointer"
                        >
                          Salvar
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {book.bookmarks && book.bookmarks.length > 0 ? (
                      book.bookmarks.map((bm) => (
                        <div
                          key={bm.id}
                          className="p-3 rounded-lg bg-purple-950/40 border border-purple-900/50 flex items-start justify-between gap-2 group hover:border-purple-600/50 transition-colors"
                        >
                          <button
                            onClick={() => {
                              handlePageChange(bm.page);
                              setActiveSidebarTab('none');
                            }}
                            className="text-left flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5 text-xs text-[#c084fc] font-semibold font-mono">
                              <BookmarkIcon className="w-3 h-3 fill-[#c084fc]" />
                              <span>Página {bm.page}</span>
                            </div>
                            <p className="text-xs mt-1 font-medium text-purple-100 leading-relaxed">{bm.label}</p>
                            {bm.chapterTitle && (
                              <p className="text-[10px] text-purple-400/60 mt-0.5">{bm.chapterTitle}</p>
                            )}
                          </button>
                          <button
                            onClick={() => onRemoveBookmark(bm.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-purple-400 transition-opacity cursor-pointer"
                            title="Remover marcador"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-purple-400/60 text-center py-6">
                        Nenhum marcador salvo ainda nesta obra.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 3. NOTES & HIGHLIGHTS */}
              {activeSidebarTab === 'notes' && (
                <div className="space-y-4">
                  {!showAddNoteInput ? (
                    <button
                      onClick={() => setShowAddNoteInput(true)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-purple-700/60 hover:border-purple-400 text-xs font-medium text-purple-300 hover:text-purple-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#c084fc]" />
                      <span>Nova Anotação ou Citação</span>
                    </button>
                  ) : (
                    <form onSubmit={handleCreateNote} className="p-3 rounded-lg bg-purple-950/80 space-y-2.5 border border-purple-800/60">
                      <div className="text-xs font-medium text-purple-200">Anotação na pág. {currentPage}</div>
                      <div>
                        <label className="text-[10px] uppercase font-mono text-purple-400/70 block mb-1">
                          Citação do Livro (opcional)
                        </label>
                        <textarea
                          rows={2}
                          value={newNoteQuote}
                          onChange={(e) => setNewNoteQuote(e.target.value)}
                          placeholder="Dica: selecione um texto no livro para citar automaticamente..."
                          className="w-full px-2.5 py-1.5 text-xs bg-[#12081a] rounded border border-purple-800/60 text-purple-100 focus:outline-none focus:border-purple-400 italic"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono text-purple-400/70 block mb-1">
                          Sua Reflexão / Nota
                        </label>
                        <textarea
                          rows={3}
                          autoFocus
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          placeholder="Escreva sua reflexão, insight ou comentário literário..."
                          className="w-full px-2.5 py-1.5 text-xs bg-[#12081a] rounded border border-purple-800/60 text-purple-100 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddNoteInput(false);
                            setNewNoteQuote('');
                          }}
                          className="px-2.5 py-1 text-xs text-purple-400 hover:text-purple-200 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded text-xs transition-colors cursor-pointer"
                        >
                          Salvar Anotação
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2.5">
                    {book.notes && book.notes.length > 0 ? (
                      book.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 rounded-lg bg-purple-950/40 border border-purple-900/50 border-l-2 border-l-[#c084fc] space-y-1.5 group hover:bg-purple-950/60 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-purple-400">
                            <span>Página {note.page}</span>
                            <button
                              onClick={() => onRemoveNote(note.id)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 text-purple-400 transition-opacity cursor-pointer"
                              title="Excluir nota"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {note.quote && (
                            <blockquote className="text-xs italic pl-2 border-l border-purple-400/40 text-purple-300 font-serif my-1">
                              "{note.quote}"
                            </blockquote>
                          )}
                          <p className="text-xs text-purple-100 leading-relaxed">{note.note}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-purple-400/60 text-center py-6">
                        Nenhuma anotação salva nesta obra ainda.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 4. SETTINGS & APPEARANCE */}
              {activeSidebarTab === 'settings' && (
                <div className="space-y-6 text-xs text-purple-200">
                  {/* Theme Mode */}
                  <div>
                    <label className="font-semibold block mb-2 text-purple-100">Tema do Papel</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                          theme === 'dark' ? 'border-[#c084fc] bg-purple-950 font-medium' : 'border-purple-900/60 hover:border-purple-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#1a0e28] border border-purple-700 inline-block shadow-xs" />
                          <span>Noite Lilás</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                          theme === 'light' ? 'border-[#c084fc] bg-purple-950 font-medium' : 'border-purple-900/60 hover:border-purple-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#FAF7F0] border border-amber-300 inline-block shadow-xs" />
                          <span className="text-purple-200">Papel Creme</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setTheme('sepia')}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                          theme === 'sepia' ? 'border-[#c084fc] bg-purple-950 font-medium' : 'border-purple-900/60 hover:border-purple-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#F4ECD8] border border-[#d2c09d] inline-block shadow-xs" />
                          <span>Pergaminho</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setTheme('slate')}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                          theme === 'slate' ? 'border-[#c084fc] bg-purple-950 font-medium' : 'border-purple-900/60 hover:border-purple-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#141419] border border-neutral-700 inline-block shadow-xs" />
                          <span>Ébano Noite</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Typography Font */}
                  <div>
                    <label className="font-semibold block mb-2 text-purple-100">Fonte Literária</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setFont('serif')}
                        className={`py-2 px-3 rounded-lg border text-center font-reader-serif cursor-pointer ${
                          font === 'serif' ? 'border-[#c084fc] bg-purple-900/60 font-semibold text-purple-100' : 'border-purple-900/60'
                        }`}
                      >
                        Serifada
                      </button>
                      <button
                        onClick={() => setFont('sans')}
                        className={`py-2 px-3 rounded-lg border text-center font-reader-sans cursor-pointer ${
                          font === 'sans' ? 'border-[#c084fc] bg-purple-900/60 font-semibold text-purple-100' : 'border-purple-900/60'
                        }`}
                      >
                        Moderna
                      </button>
                      <button
                        onClick={() => setFont('mono')}
                        className={`py-2 px-3 rounded-lg border text-center font-reader-mono cursor-pointer ${
                          font === 'mono' ? 'border-[#c084fc] bg-purple-900/60 font-semibold text-purple-100' : 'border-purple-900/60'
                        }`}
                      >
                        Mono
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-semibold text-purple-100">Tamanho da Letra</label>
                      <span className="font-mono tabular-nums text-purple-300">{fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                        className="px-2.5 py-1 rounded bg-purple-900/40 hover:bg-purple-800 text-purple-200 font-semibold cursor-pointer"
                      >
                        A-
                      </button>
                      <input
                        type="range"
                        min="14"
                        max="26"
                        step="1"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="flex-1 accent-purple-500 cursor-pointer"
                      />
                      <button
                        onClick={() => setFontSize(Math.min(26, fontSize + 1))}
                        className="px-2.5 py-1 rounded bg-purple-900/40 hover:bg-purple-800 text-purple-200 font-semibold cursor-pointer"
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* Line Height */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-semibold text-purple-100">Espaçamento Entre Linhas</label>
                      <span className="font-mono tabular-nums text-purple-300">{lineHeight}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.4"
                      max="2.2"
                      step="0.1"
                      value={lineHeight}
                      onChange={(e) => setLineHeight(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                </div>
              )}

            </div>
          </aside>
        )}

      </div>

      {/* Bottom-Left Page Icon Button (Toggles streamlined reading controls) */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setShowBottomControls((prev) => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-lg ${
            showBottomControls
              ? 'bg-purple-900/90 border-purple-500 text-purple-100 ring-2 ring-purple-500/30 shadow-purple-950/50'
              : 'bg-[#160b1f]/90 hover:bg-purple-900/60 border-purple-900/60 text-purple-300 hover:text-white'
          }`}
          title={showBottomControls ? 'Ocultar controles de página' : 'Mostrar controles de página'}
        >
          <FileText className="w-4 h-4 text-[#c084fc]" />
          <span className="text-xs font-mono font-medium tabular-nums">
            pág. {currentPage}/{totalPages}
          </span>
        </button>
      </div>

      {/* Streamlined Floating Bottom Controls (Only visible after clicking bottom-left page button) */}
      {showBottomControls && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#160b1f]/95 backdrop-blur-xl border border-purple-800/80 rounded-2xl px-4 py-2 shadow-2xl flex items-center gap-3 max-w-md w-[92vw] sm:w-auto animate-in slide-in-from-bottom-2 fade-in duration-200">
          {/* Previous Page */}
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg hover:bg-purple-900/50 text-purple-200 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Página Anterior"
          >
            <ChevronLeft className="w-4 h-4 text-[#c084fc]" />
          </button>

          {/* Compact Scrubber */}
          <div className="flex items-center gap-2 flex-1 min-w-[130px] sm:min-w-[180px]">
            <input
              type="range"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-purple-950 rounded-full"
            />
            <span className="text-[11px] font-mono text-[#c084fc] font-semibold shrink-0 tabular-nums">
              {percent}%
            </span>
          </div>

          {/* Next Page / Finish */}
          {currentPage >= totalPages ? (
            <button
              onClick={() => {
                triggerCompletionConfetti();
                handlePageChange(totalPages);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Concluído</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg hover:bg-purple-900/50 text-purple-200 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Próxima Página"
            >
              <ChevronRight className="w-4 h-4 text-[#c084fc]" />
            </button>
          )}

          <div className="h-4 w-px bg-purple-900/60" />

          {/* Close button to hide bottom bar */}
          <button
            onClick={() => setShowBottomControls(false)}
            className="p-1 text-purple-400 hover:text-purple-200 rounded-lg hover:bg-purple-900/40 transition-colors cursor-pointer"
            title="Ocultar barra"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};

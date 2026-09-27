export type BookFormat = 'epub' | 'pdf' | 'txt' | 'markdown';

export type ReadingStatus = 'want_to_read' | 'reading' | 'completed' | 'on_hold';

export interface BookChapter {
  id: string;
  title: string;
  content: string;
}

export interface Bookmark {
  id: string;
  page: number;
  chapterTitle?: string;
  label: string;
  createdAt: string;
}

export interface BookNote {
  id: string;
  page: number;
  quote?: string;
  note: string;
  createdAt: string;
  color?: string;
}

export interface ReadingSession {
  date: string;
  pagesRead: number;
  durationMinutes?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverUrl: string;
  totalPages: number;
  currentPage: number;
  format: BookFormat;
  content?: string;
  contentBlobUrl?: string;
  chapters?: BookChapter[];
  status: ReadingStatus;
  rating?: number;
  favorite?: boolean;
  shelf?: string;
  dateAdded: string;
  lastReadDate?: string;
  readingSessions?: ReadingSession[];
  bookmarks?: Bookmark[];
  notes?: BookNote[];
}

export interface ReadingGoal {
  year: number;
  targetBooks: number;
  targetPages: number;
}

export type ReaderTheme = 'light' | 'sepia' | 'dark' | 'slate';
export type ReaderFont = 'serif' | 'sans' | 'mono';

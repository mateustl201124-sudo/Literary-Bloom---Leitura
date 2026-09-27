import { Book, Bookmark, BookNote, ReadingGoal } from '../types/library';
import { INITIAL_BOOKS } from '../data/initialBooks';

const DB_NAME = 'folio_library_db';
const DB_VERSION = 1;
const STORE_BOOKS = 'books';
const STORE_SETTINGS = 'settings';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_BOOKS)) {
        db.createObjectStore(STORE_BOOKS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getLibraryBooks(): Promise<Book[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKS, 'readonly');
      const store = tx.objectStore(STORE_BOOKS);
      const request = store.getAll();

      request.onsuccess = () => {
        const books: Book[] = request.result;
        if (!books || books.length === 0) {
          // Seed with initial classics
          seedInitialBooks(db).then(resolve).catch(reject);
        } else {
          resolve(books);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('IndexedDB error, falling back to initial books:', err);
    return INITIAL_BOOKS;
  }
}

async function seedInitialBooks(db: IDBDatabase): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    for (const book of INITIAL_BOOKS) {
      store.put(book);
    }
    tx.oncomplete = () => resolve(INITIAL_BOOKS);
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveBookToDB(book: Book): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const request = store.put(book);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteBookFromDB(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function updateBookCoverInDB(bookId: string, coverUrl: string): Promise<Book | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const getReq = store.get(bookId);

    getReq.onsuccess = () => {
      const book: Book | undefined = getReq.result;
      if (!book) return resolve(null);
      const updatedBook: Book = {
        ...book,
        coverUrl,
      };
      store.put(updatedBook);
      tx.oncomplete = () => resolve(updatedBook);
      tx.onerror = () => reject(tx.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function updateBookProgress(
  id: string,
  newPage: number,
  sessionDurationMinutes = 15,
  newTotalPages?: number
): Promise<Book | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const book: Book | undefined = getReq.result;
      if (!book) {
        resolve(null);
        return;
      }

      const totalPages = newTotalPages && newTotalPages > 0 ? newTotalPages : book.totalPages;
      const clampedPage = Math.max(0, Math.min(newPage, totalPages));
      const pagesDiff = Math.max(0, clampedPage - book.currentPage);
      const isCompleted = clampedPage >= totalPages;

      const todayStr = new Date().toISOString().split('T')[0];
      const existingSessions = book.readingSessions || [];
      const updatedSessions = [...existingSessions];

      if (pagesDiff > 0) {
        const todaySessionIdx = updatedSessions.findIndex((s) => s.date === todayStr);
        if (todaySessionIdx >= 0) {
          updatedSessions[todaySessionIdx] = {
            ...updatedSessions[todaySessionIdx],
            pagesRead: updatedSessions[todaySessionIdx].pagesRead + pagesDiff,
            durationMinutes: (updatedSessions[todaySessionIdx].durationMinutes || 0) + sessionDurationMinutes,
          };
        } else {
          updatedSessions.push({
            date: todayStr,
            pagesRead: pagesDiff,
            durationMinutes: sessionDurationMinutes,
          });
        }
      }

      const updatedBook: Book = {
        ...book,
        totalPages,
        currentPage: clampedPage,
        status: isCompleted ? 'completed' : clampedPage > 0 ? 'reading' : book.status,
        lastReadDate: new Date().toISOString(),
        readingSessions: updatedSessions,
      };

      const putReq = store.put(updatedBook);
      putReq.onsuccess = () => resolve(updatedBook);
      putReq.onerror = () => reject(putReq.error);
    };

    getReq.onerror = () => reject(getReq.error);
  });
}

export async function addBookmarkToBook(bookId: string, bookmark: Bookmark): Promise<Book | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const getReq = store.get(bookId);

    getReq.onsuccess = () => {
      const book: Book | undefined = getReq.result;
      if (!book) return resolve(null);
      const updatedBook: Book = {
        ...book,
        bookmarks: [...(book.bookmarks || []), bookmark],
      };
      store.put(updatedBook);
      tx.oncomplete = () => resolve(updatedBook);
      tx.onerror = () => reject(tx.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function removeBookmarkFromBook(bookId: string, bookmarkId: string): Promise<Book | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const getReq = store.get(bookId);

    getReq.onsuccess = () => {
      const book: Book | undefined = getReq.result;
      if (!book) return resolve(null);
      const updatedBook: Book = {
        ...book,
        bookmarks: (book.bookmarks || []).filter((b) => b.id !== bookmarkId),
      };
      store.put(updatedBook);
      tx.oncomplete = () => resolve(updatedBook);
      tx.onerror = () => reject(tx.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function addNoteToBook(bookId: string, note: BookNote): Promise<Book | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const getReq = store.get(bookId);

    getReq.onsuccess = () => {
      const book: Book | undefined = getReq.result;
      if (!book) return resolve(null);
      const updatedBook: Book = {
        ...book,
        notes: [...(book.notes || []), note],
      };
      store.put(updatedBook);
      tx.oncomplete = () => resolve(updatedBook);
      tx.onerror = () => reject(tx.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function removeNoteFromBook(bookId: string, noteId: string): Promise<Book | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const getReq = store.get(bookId);

    getReq.onsuccess = () => {
      const book: Book | undefined = getReq.result;
      if (!book) return resolve(null);
      const updatedBook: Book = {
        ...book,
        notes: (book.notes || []).filter((n) => n.id !== noteId),
      };
      store.put(updatedBook);
      tx.oncomplete = () => resolve(updatedBook);
      tx.onerror = () => reject(tx.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export const DEFAULT_READING_GOAL: ReadingGoal = {
  year: 2026,
  targetBooks: 24,
  targetPages: 6000,
};

export async function getReadingGoal(): Promise<ReadingGoal> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_SETTINGS, 'readonly');
      const store = tx.objectStore(STORE_SETTINGS);
      const req = store.get('readingGoal');
      req.onsuccess = () => {
        if (req.result && req.result.value) {
          resolve(req.result.value);
        } else {
          resolve(DEFAULT_READING_GOAL);
        }
      };
      req.onerror = () => resolve(DEFAULT_READING_GOAL);
    });
  } catch {
    return DEFAULT_READING_GOAL;
  }
}

export async function saveReadingGoal(goal: ReadingGoal): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SETTINGS, 'readwrite');
    const store = tx.objectStore(STORE_SETTINGS);
    const req = store.put({ key: 'readingGoal', value: goal });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

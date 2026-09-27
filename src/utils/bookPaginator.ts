import { Book, BookChapter } from '../types/library';

export interface BookPage {
  pageNumber: number;
  chapterIndex: number;
  chapterTitle: string;
  isChapterStart: boolean;
  chapterKicker?: string;
  paragraphs: string[];
}

const WORDS_PER_PAGE_STANDARD = 200;
const WORDS_PER_CHAPTER_START = 165;

/**
 * Paginates a book's text into realistic individual book pages.
 * Ensures the total number of pages corresponds faithfully to the book's text length.
 */
export function paginateBookContent(book: Book): BookPage[] {
  const pages: BookPage[] = [];
  const chapters = book.chapters && book.chapters.length > 0
    ? book.chapters
    : splitRawContentIntoChapters(book.content || book.description || 'Início da obra.');

  let globalPage = 1;

  chapters.forEach((chapter, chapterIndex) => {
    const rawParagraphs = chapter.content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (rawParagraphs.length === 0) {
      pages.push({
        pageNumber: globalPage++,
        chapterIndex,
        chapterTitle: chapter.title,
        isChapterStart: true,
        chapterKicker: `Capítulo ${chapterIndex + 1}`,
        paragraphs: ['[Início do capítulo]'],
      });
      return;
    }

    let currentPageParagraphs: string[] = [];
    let currentWordCount = 0;
    let isFirstPageOfChapter = true;

    for (let i = 0; i < rawParagraphs.length; i++) {
      const paragraph = rawParagraphs[i];
      const paraWords = paragraph.split(/\s+/).length;
      const targetLimit = isFirstPageOfChapter ? WORDS_PER_CHAPTER_START : WORDS_PER_PAGE_STANDARD;

      // If adding this paragraph exceeds target limit by a large margin and we already have text
      if (currentPageParagraphs.length > 0 && currentWordCount + paraWords > targetLimit * 1.25) {
        // Close current page
        pages.push({
          pageNumber: globalPage++,
          chapterIndex,
          chapterTitle: chapter.title,
          isChapterStart: isFirstPageOfChapter,
          chapterKicker: isFirstPageOfChapter ? `Capítulo ${chapterIndex + 1}` : undefined,
          paragraphs: currentPageParagraphs,
        });

        isFirstPageOfChapter = false;
        currentPageParagraphs = [];
        currentWordCount = 0;
      }

      // If a single paragraph is colossal (> 380 words), split into natural sentence chunks
      if (paraWords > 360) {
        const sentences = paragraph.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [paragraph];
        let subPara = '';

        for (const sentence of sentences) {
          const sentWords = sentence.split(/\s+/).length;
          if (currentWordCount + sentWords > targetLimit && currentPageParagraphs.length > 0) {
            if (subPara.trim()) currentPageParagraphs.push(subPara.trim());
            pages.push({
              pageNumber: globalPage++,
              chapterIndex,
              chapterTitle: chapter.title,
              isChapterStart: isFirstPageOfChapter,
              chapterKicker: isFirstPageOfChapter ? `Capítulo ${chapterIndex + 1}` : undefined,
              paragraphs: currentPageParagraphs,
            });
            isFirstPageOfChapter = false;
            currentPageParagraphs = [];
            currentWordCount = 0;
            subPara = sentence;
            currentWordCount = sentWords;
          } else {
            subPara += ' ' + sentence;
            currentWordCount += sentWords;
          }
        }
        if (subPara.trim()) {
          currentPageParagraphs.push(subPara.trim());
        }
      } else {
        currentPageParagraphs.push(paragraph);
        currentWordCount += paraWords;
      }
    }

    // Flush any remaining paragraphs of this chapter
    if (currentPageParagraphs.length > 0) {
      pages.push({
        pageNumber: globalPage++,
        chapterIndex,
        chapterTitle: chapter.title,
        isChapterStart: isFirstPageOfChapter,
        chapterKicker: isFirstPageOfChapter ? `Capítulo ${chapterIndex + 1}` : undefined,
        paragraphs: currentPageParagraphs,
      });
    }
  });

  return pages.length > 0 ? pages : [
    {
      pageNumber: 1,
      chapterIndex: 0,
      chapterTitle: book.title,
      isChapterStart: true,
      chapterKicker: 'Início',
      paragraphs: [book.description || 'Página de introdução.'],
    }
  ];
}

function splitRawContentIntoChapters(content: string): BookChapter[] {
  const lines = content.split('\n');
  const chapters: BookChapter[] = [];
  let currentTitle = 'Prólogo';
  let currentLines: string[] = [];
  let chapCount = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    const isHeading =
      /^(Capítulo|Capitulo|Chapter|PARTE|Parte|\#+)\s+/i.test(trimmed) ||
      /^[IVXLCDM]+\s*[-–.]/i.test(trimmed);

    if (isHeading && currentLines.length > 3) {
      chapters.push({
        id: `chap-${chapCount++}`,
        title: currentTitle,
        content: currentLines.join('\n').trim(),
      });
      currentTitle = trimmed.replace(/^#+\s*/, '') || `Capítulo ${chapCount}`;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    chapters.push({
      id: `chap-${chapCount}`,
      title: currentTitle,
      content: currentLines.join('\n').trim(),
    });
  }

  return chapters;
}

export function getAccurateBookPageCount(book: Book): number {
  if (book.format === 'pdf') {
    return book.totalPages || 50;
  }
  return paginateBookContent(book).length;
}

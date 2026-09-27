import JSZip from 'jszip';
import { Book, BookChapter, BookFormat } from '../types/library';

export interface ParsedBookData {
  title: string;
  author: string;
  genre: string;
  description: string;
  totalPages: number;
  format: BookFormat;
  content?: string;
  contentBlobUrl?: string;
  chapters?: BookChapter[];
  coverUrl: string;
}

export function generateFallbackCoverSvg(title: string, author: string, genre: string): string {
  // Generate a distinct, elegant SVG book cover
  const hues = [
    { bg: '#1e293b', accent: '#f59e0b', text: '#f8fafc' },
    { bg: '#1c1917', accent: '#d97706', text: '#fafaf9' },
    { bg: '#064e3b', accent: '#34d399', text: '#ecfdf5' },
    { bg: '#312e81', accent: '#a5b4fc', text: '#eef2ff' },
    { bg: '#4c0519', accent: '#fb7185', text: '#fff1f2' },
  ];
  const charCode = (title.charCodeAt(0) || 65) + (author.charCodeAt(0) || 66);
  const theme = hues[charCode % hues.length];

  const cleanTitle = title.length > 36 ? title.substring(0, 36) + '...' : title;
  const cleanAuthor = author.length > 28 ? author.substring(0, 28) + '...' : author;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420" width="300" height="420">
    <defs>
      <linearGradient id="coverGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${theme.bg}"/>
        <stop offset="100%" stop-color="#0a0a0a"/>
      </linearGradient>
      <pattern id="lines" width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="20" y2="20" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="300" height="420" fill="url(#coverGrad)"/>
    <rect width="300" height="420" fill="url(#lines)"/>
    
    <!-- Spine shadow -->
    <rect x="0" y="0" width="16" height="420" fill="rgba(0,0,0,0.3)"/>
    <line x1="16" y1="0" x2="16" y2="420" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    
    <!-- Framing border -->
    <rect x="28" y="28" width="244" height="364" fill="none" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="1"/>
    <rect x="34" y="34" width="232" height="352" fill="none" stroke="${theme.accent}" stroke-opacity="0.15" stroke-width="1"/>

    <!-- Genre top kicker -->
    <text x="150" y="70" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="600" fill="${theme.accent}" text-anchor="middle" letter-spacing="2">
      ${genre.toUpperCase()}
    </text>

    <!-- Center Ornament -->
    <circle cx="150" cy="140" r="28" fill="none" stroke="${theme.accent}" stroke-opacity="0.4" stroke-width="1"/>
    <polygon points="150,122 165,140 150,158 135,140" fill="none" stroke="${theme.accent}" stroke-width="1.5"/>

    <!-- Title -->
    <text x="150" y="230" font-family="Newsreader, serif" font-size="20" font-weight="bold" fill="${theme.text}" text-anchor="middle">
      <tspan x="150" dy="0">${cleanTitle.split(' ').slice(0, 3).join(' ')}</tspan>
      ${cleanTitle.split(' ').length > 3 ? `<tspan x="150" dy="24">${cleanTitle.split(' ').slice(3).join(' ')}</tspan>` : ''}
    </text>

    <!-- Divider -->
    <line x1="110" y1="285" x2="190" y2="285" stroke="${theme.accent}" stroke-opacity="0.5" stroke-width="1"/>

    <!-- Author -->
    <text x="150" y="325" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="500" fill="rgba(255,255,255,0.8)" text-anchor="middle" letter-spacing="1">
      ${cleanAuthor}
    </text>

    <!-- Bottom mark -->
    <text x="150" y="365" font-family="Newsreader, serif" font-style="italic" font-size="10" fill="rgba(255,255,255,0.4)" text-anchor="middle">
      Folio Personal Library
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function parseUploadedBook(
  file: File,
  overrideMetadata?: { genre?: string; shelf?: string }
): Promise<ParsedBookData> {
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  // Clean filename for auto-title and auto-author
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  let inferredTitle = baseName;
  let inferredAuthor = 'Autor Desconhecido';

  if (baseName.includes(' - ')) {
    const parts = baseName.split(' - ');
    if (parts.length >= 2) {
      inferredAuthor = parts[0].trim();
      inferredTitle = parts.slice(1).join(' - ').trim();
    }
  }

  const defaultGenre = overrideMetadata?.genre || 'Geral';

  if (extension === 'epub') {
    return await parseEpubFile(file, inferredTitle, inferredAuthor, defaultGenre);
  } else if (extension === 'pdf') {
    return await parsePdfFile(file, inferredTitle, inferredAuthor, defaultGenre);
  } else if (extension === 'txt' || extension === 'md') {
    return await parseTextFile(file, inferredTitle, inferredAuthor, defaultGenre, extension === 'md' ? 'markdown' : 'txt');
  } else {
    // Fallback text
    return await parseTextFile(file, inferredTitle, inferredAuthor, defaultGenre, 'txt');
  }
}

async function parseTextFile(
  file: File,
  title: string,
  author: string,
  genre: string,
  format: BookFormat
): Promise<ParsedBookData> {
  const text = await file.text();

  // Split into chapters based on common patterns
  const lines = text.split('\n');
  const chapters: BookChapter[] = [];
  let currentChapterTitle = 'Início';
  let currentChapterContent: string[] = [];
  let chapterIndex = 1;

  for (const line of lines) {
    const isHeading =
      line.trim().match(/^(#+\s+|CAPÍTULO|Capítulo|PARTE|Parte|CHAPTER|Chapter)\s*(.*)/i) ||
      (line.trim().length > 3 && line.trim().length < 40 && line.trim() === line.trim().toUpperCase() && /^[A-Z0-9\s]+$/.test(line.trim()));

    if (isHeading && currentChapterContent.length > 5) {
      chapters.push({
        id: `chap-${chapterIndex}`,
        title: currentChapterTitle,
        content: currentChapterContent.join('\n').trim(),
      });
      chapterIndex++;
      currentChapterTitle = line.replace(/^#+\s*/, '').trim() || `Capítulo ${chapterIndex}`;
      currentChapterContent = [];
    } else {
      currentChapterContent.push(line);
    }
  }

  if (currentChapterContent.length > 0) {
    chapters.push({
      id: `chap-${chapterIndex}`,
      title: currentChapterTitle,
      content: currentChapterContent.join('\n').trim(),
    });
  }

  // Calculate pages: roughly 1800 characters per page (or 300 words)
  const charCount = text.length;
  const estimatedPages = Math.max(1, Math.ceil(charCount / 1800));

  return {
    title,
    author,
    genre,
    description: text.slice(0, 240).trim() + (text.length > 240 ? '...' : ''),
    totalPages: estimatedPages,
    format,
    content: text,
    chapters: chapters.length > 0 ? chapters : [{ id: 'chap-1', title: 'Texto Completo', content: text }],
    coverUrl: generateFallbackCoverSvg(title, author, genre),
  };
}

async function parsePdfFile(
  file: File,
  title: string,
  author: string,
  genre: string
): Promise<ParsedBookData> {
  // Convert PDF to base64 Data URL or Blob URL so it can be stored in IndexedDB and viewed
  const buffer = await file.arrayBuffer();
  const blob = new Blob([buffer], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  // Estimate page count from PDF binary stream (/Type /Page count)
  let detectedPages = 50;
  try {
    const textBytes = new Uint8Array(buffer.slice(0, Math.min(buffer.byteLength, 5000000)));
    let text = '';
    // Sample ASCII parts
    for (let i = 0; i < textBytes.length; i++) {
      if (textBytes[i] >= 32 && textBytes[i] <= 126) {
        text += String.fromCharCode(textBytes[i]);
      }
    }
    const pageMatches = text.match(/\/Type\s*\/Page\b/g);
    if (pageMatches && pageMatches.length > 0) {
      detectedPages = pageMatches.length;
    } else {
      const countMatch = text.match(/\/Count\s+(\d+)/);
      if (countMatch && countMatch[1]) {
        const c = parseInt(countMatch[1], 10);
        if (c > 0 && c < 5000) detectedPages = c;
      }
    }
  } catch {
    detectedPages = 80;
  }

  // Convert blob to base64 data URL for permanent IndexedDB storage
  const base64DataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  return {
    title,
    author,
    genre,
    description: `Documento PDF carregado (${(file.size / (1024 * 1024)).toFixed(1)} MB). Pronto para leitura no leitor integrado.`,
    totalPages: detectedPages,
    format: 'pdf',
    contentBlobUrl: base64DataUrl,
    coverUrl: generateFallbackCoverSvg(title, author, genre),
  };
}

async function parseEpubFile(
  file: File,
  title: string,
  author: string,
  genre: string
): Promise<ParsedBookData> {
  try {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);

    let extractedTitle = title;
    let extractedAuthor = author;
    const chapters: BookChapter[] = [];
    let fullText = '';
    let extractedCoverUrl = '';

    // 1. Locate container.xml to find OPF path
    const containerFile = content.file('META-INF/container.xml');
    let opfPath = '';
    if (containerFile) {
      const containerXml = await containerFile.async('text');
      const rootfileMatch = containerXml.match(/full-path=["']([^"']+)["']/i);
      if (rootfileMatch && rootfileMatch[1]) {
        opfPath = rootfileMatch[1];
      }
    }

    // 2. Read OPF if found
    const opfFolder = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';
    const opfFile = opfPath ? content.file(opfPath) : null;

    if (opfFile) {
      const opfXml = await opfFile.async('text');
      const titleMatch = opfXml.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i);
      if (titleMatch && titleMatch[1]) extractedTitle = titleMatch[1].trim();

      const authorMatch = opfXml.match(/<dc:creator[^>]*>([^<]+)<\/dc:creator>/i);
      if (authorMatch && authorMatch[1]) extractedAuthor = authorMatch[1].trim();

      // Look for cover image in manifest
      const coverMatch = opfXml.match(/<item[^>]+id=["'][^"']*cover[^"']*["'][^>]+href=["']([^"']+)["']/i) ||
                         opfXml.match(/<item[^>]+properties=["'][^"']*cover-image[^"']*["'][^>]+href=["']([^"']+)["']/i);
      if (coverMatch && coverMatch[1]) {
        const coverPath = opfFolder + coverMatch[1];
        const coverImgFile = content.file(coverPath);
        if (coverImgFile) {
          const coverBase64 = await coverImgFile.async('base64');
          const ext = coverPath.split('.').pop()?.toLowerCase() || 'jpeg';
          const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
          extractedCoverUrl = `data:${mime};base64,${coverBase64}`;
        }
      }
    }

    // 3. Extract text from HTML/XHTML files
    const htmlFiles = Object.keys(content.files).filter(
      (path) => path.endsWith('.xhtml') || path.endsWith('.html') || path.endsWith('.htm')
    );

    // Sort files logically
    htmlFiles.sort();

    let chapNum = 1;
    for (const filePath of htmlFiles) {
      const fileObj = content.file(filePath);
      if (!fileObj) continue;

      const htmlContent = await fileObj.async('text');
      // Clean HTML tags into clean readable paragraphs
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Strip scripts and styles
      doc.querySelectorAll('script, style, link').forEach((el) => el.remove());

      const rawTitle = doc.querySelector('h1, h2, h3, title')?.textContent?.trim();
      const chapterTitle = rawTitle && rawTitle.length < 60 ? rawTitle : `Capítulo ${chapNum}`;

      // Extract text content cleanly preserving paragraphs
      const paragraphs: string[] = [];
      doc.querySelectorAll('p, h1, h2, h3, h4, blockquote').forEach((el) => {
        const t = el.textContent?.trim();
        if (t && t.length > 0) paragraphs.push(t);
      });

      const chapterText = paragraphs.join('\n\n');
      if (chapterText.length > 80) {
        chapters.push({
          id: `epub-chap-${chapNum}`,
          title: chapterTitle,
          content: chapterText,
        });
        fullText += chapterText + '\n\n';
        chapNum++;
      }
    }

    const estimatedPages = Math.max(1, Math.ceil(fullText.length / 1800));

    return {
      title: extractedTitle,
      author: extractedAuthor,
      genre,
      description: `Livro no formato EPUB com ${chapters.length} capítulos extraídos.`,
      totalPages: estimatedPages,
      format: 'epub',
      content: fullText,
      chapters: chapters.length > 0 ? chapters : [{ id: 'chap-1', title: 'Início', content: fullText }],
      coverUrl: extractedCoverUrl || generateFallbackCoverSvg(extractedTitle, extractedAuthor, genre),
    };
  } catch (err) {
    console.warn('Erro ao processar EPUB, usando fallback:', err);
    return {
      title,
      author,
      genre,
      description: 'Livro EPUB carregado.',
      totalPages: 100,
      format: 'epub',
      content: 'Conteúdo do livro pronto para leitura.',
      coverUrl: generateFallbackCoverSvg(title, author, genre),
    };
  }
}

import React, { useState, useRef } from 'react';
import { Book, BookFormat, ReadingStatus } from '../types/library';
import { parseUploadedBook, generateFallbackCoverSvg } from '../services/bookParser';
import { PRESET_GENRES } from '../data/initialBooks';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { TulipOrnament } from './TulipOrnament';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBook: (book: Book) => void;
  existingGenres: string[];
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSaveBook,
  existingGenres,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Clássicos Brasileiros');
  const [customGenre, setCustomGenre] = useState('');
  const [shelf, setShelf] = useState('');
  const [totalPages, setTotalPages] = useState<number>(200);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [status, setStatus] = useState<ReadingStatus>('want_to_read');
  const [format, setFormat] = useState<BookFormat>('txt');
  const [coverUrl, setCoverUrl] = useState('');
  const [bookContent, setBookContent] = useState<string | undefined>(undefined);
  const [bookBlobUrl, setBookBlobUrl] = useState<string | undefined>(undefined);
  const [chapters, setChapters] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const allGenres = Array.from(new Set([...PRESET_GENRES.filter((g) => g !== 'Todos'), ...existingGenres]));

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsed = await parseUploadedBook(file, { genre: customGenre || genre, shelf });
      setTitle(parsed.title);
      setAuthor(parsed.author);
      setTotalPages(parsed.totalPages);
      setFormat(parsed.format);
      setCoverUrl(parsed.coverUrl);
      setBookContent(parsed.content);
      setBookBlobUrl(parsed.contentBlobUrl);
      setChapters(parsed.chapters || []);
      if (parsed.genre && allGenres.includes(parsed.genre)) {
        setGenre(parsed.genre);
      }
    } catch (err: any) {
      console.error(err);
      setError('Não foi possível ler o arquivo. Certifique-se de que é um arquivo EPUB, PDF, TXT ou MD válido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor informe o título do livro.');
      return;
    }

    const finalGenre = customGenre.trim() || genre;
    const finalCover = coverUrl || generateFallbackCoverSvg(title, author || 'Autor Desconhecido', finalGenre);

    const newBook: Book = {
      id: 'book-' + Date.now(),
      title: title.trim(),
      author: author.trim() || 'Autor Desconhecido',
      genre: finalGenre,
      description: `Obra cadastrada na sua biblioteca pessoal.`,
      coverUrl: finalCover,
      totalPages: Math.max(1, totalPages),
      currentPage: Math.min(Math.max(0, currentPage), totalPages),
      format: format,
      content: bookContent,
      contentBlobUrl: bookBlobUrl,
      chapters: chapters.length > 0 ? chapters : undefined,
      status: currentPage >= totalPages ? 'completed' : currentPage > 0 ? 'reading' : status,
      shelf: shelf.trim() || undefined,
      dateAdded: new Date().toISOString(),
      bookmarks: [],
      notes: [],
      readingSessions: currentPage > 0 ? [{ date: new Date().toISOString().split('T')[0], pagesRead: currentPage }] : [],
    };

    onSaveBook(newBook);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0513]/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#180b22] border border-purple-900/70 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-purple-900/60 flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-300">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-purple-100 flex items-center gap-2">
                <span>Adicionar Livro à Biblioteca</span>
                <TulipOrnament className="w-5 h-3 opacity-40" />
              </h3>
              <p className="text-xs text-purple-300/70">Faça upload de EPUB, PDF, TXT ou cadastre manualmente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-400 hover:text-purple-200 hover:bg-purple-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3.5 border-b border-purple-950/70">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-purple-400 text-purple-300 font-semibold'
                : 'border-transparent text-purple-400/60 hover:text-purple-200'
            }`}
          >
            Upload de Arquivo (EPUB, PDF, TXT, MD)
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'manual'
                ? 'border-purple-400 text-purple-300 font-semibold'
                : 'border-transparent text-purple-400/60 hover:text-purple-200'
            }`}
          >
            Cadastro Manual / Livro Físico
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'upload' && !title && (
            /* Drag and Drop Zone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-purple-400 bg-purple-500/10'
                  : 'border-purple-800/60 hover:border-purple-600 bg-purple-950/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".epub,.pdf,.txt,.md"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileText className="w-10 h-10 mx-auto text-purple-400/60 mb-3" />
              <p className="text-sm font-medium text-purple-100">
                Arraste seu arquivo aqui ou clique para selecionar
              </p>
              <p className="text-xs text-purple-300/60 mt-1">
                Formatos suportados: <strong className="text-purple-200">EPUB, PDF, TXT, Markdown</strong>
              </p>
              {isLoading && (
                <div className="mt-3 text-xs text-purple-300 animate-pulse">
                  Processando e extraindo capítulos do livro...
                </div>
              )}
            </div>
          )}

          {/* Metadata Fields (visible when file is processed or in manual mode) */}
          {(title || activeTab === 'manual') && (
            <div className="space-y-4">
              <div className="flex gap-4">
                {/* Book Cover Preview & custom upload */}
                <div className="shrink-0 w-24 aspect-[3/4] bg-[#14081c] rounded-lg overflow-hidden border border-purple-800/60 relative group">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Capa" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-purple-400/50 text-center p-2">
                      Sem capa
                    </div>
                  )}
                  <label className="absolute inset-0 bg-[#12081a]/85 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-purple-300 cursor-pointer p-1 text-center font-medium transition-opacity">
                    Alterar capa
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">
                      Título do Livro *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Dom Casmurro"
                      className="w-full px-3 py-1.5 text-xs bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">
                      Autor / Escritor
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Ex: Machado de Assis"
                      className="w-full px-3 py-1.5 text-xs bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Genre Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-purple-200 mb-1">
                    Gênero / Categoria
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => {
                      setGenre(e.target.value);
                      if (e.target.value !== 'Outro') setCustomGenre('');
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {allGenres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                    <option value="Outro">+ Criar Novo Gênero...</option>
                  </select>
                </div>

                {genre === 'Outro' ? (
                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">
                      Nome do Novo Gênero
                    </label>
                    <input
                      type="text"
                      value={customGenre}
                      onChange={(e) => setCustomGenre(e.target.value)}
                      placeholder="Ex: Ficção Distópica"
                      className="w-full px-3 py-1.5 text-xs bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">
                      Coleção / Estante (opcional)
                    </label>
                    <input
                      type="text"
                      value={shelf}
                      onChange={(e) => setShelf(e.target.value)}
                      placeholder="Ex: Favoritos, Clássicos"
                      className="w-full px-3 py-1.5 text-xs bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Pages & Status */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-purple-200 mb-1">
                    Total de Páginas
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalPages}
                    onChange={(e) => setTotalPages(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 text-xs bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 font-mono tabular-nums focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-purple-200 mb-1">
                    Página Atual
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Math.min(totalPages, Math.max(0, Number(e.target.value))))}
                    className="w-full px-3 py-1.5 text-xs bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 font-mono tabular-nums focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-purple-200 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ReadingStatus)}
                    className="w-full px-3 py-1.5 text-xs bg-[#14081c] border border-purple-900/80 rounded-lg text-purple-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="want_to_read">Quero Ler</option>
                    <option value="reading">Lendo Agora</option>
                    <option value="completed">Concluído</option>
                    <option value="on_hold">Em Pausa</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-purple-900/60 flex items-center justify-between">
            {activeTab === 'upload' && title && (
              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  setCoverUrl('');
                }}
                className="text-xs text-purple-400 hover:text-purple-200 cursor-pointer"
              >
                Trocar arquivo
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-purple-300 hover:text-purple-100 bg-purple-950 hover:bg-purple-900 rounded-lg transition-colors cursor-pointer border border-purple-900/50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!title}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors cursor-pointer shadow-sm border border-purple-500/30"
              >
                Salvar na Biblioteca
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

import coverDomCasmurro from '../assets/images/cover_dom_casmurro_1790291703864.jpg';
import coverMetamorfose from '../assets/images/cover_metamorfose_1790291714560.jpg';
import coverOPrincipe from '../assets/images/cover_o_principe_1790291724695.jpg';
import coverPequenoPrincipe from '../assets/images/cover_pequeno_principe_1790291734155.jpg';
import { generateFallbackCoverSvg } from '../services/bookParser';

export const PRESET_COVERS = {
  domCasmurro: coverDomCasmurro,
  metamorfose: coverMetamorfose,
  oPrincipe: coverOPrincipe,
  pequenoPrincipe: coverPequenoPrincipe,
};

/**
 * Resolves any cover URL to ensure it works in Vite development, production bundles,
 * and static deployments like Vercel.
 *
 * Handles:
 * - Legacy `/src/assets/images/...` paths stored in IndexedDB
 * - Direct ES module imported assets
 * - External http/https URLs and data URLs
 * - Clean `/covers/...` public paths
 * - Fallback SVG generation if missing
 */
export function resolveCoverUrl(url?: string | null, title: string = 'Obra', author: string = 'Autor'): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return generateFallbackCoverSvg(title, author, 'Clássicos');
  }

  const trimmed = url.trim();

  // If already a data URI or external URL
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Handle known preset covers
  if (trimmed.includes('dom_casmurro')) {
    return coverDomCasmurro;
  }
  if (trimmed.includes('metamorfose')) {
    return coverMetamorfose;
  }
  if (trimmed.includes('o_principe') || trimmed.includes('principe_1790291724')) {
    return coverOPrincipe;
  }
  if (trimmed.includes('pequeno_principe') || trimmed.includes('principe_1790291734')) {
    return coverPequenoPrincipe;
  }

  // Clean public paths
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return trimmed;
}

/**
 * Event handler for img onError to replace broken images with an SVG fallback
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, title: string = 'Obra', author: string = 'Autor') {
  const target = e.currentTarget;
  const fallbackSvg = generateFallbackCoverSvg(title, author, 'Livro');
  if (target.src !== fallbackSvg) {
    target.src = fallbackSvg;
  }
}

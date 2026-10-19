export interface MediaTransformOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
}

/**
 * Resolves media URLs: returns direct HTTPS/Cloudinary URLs as-is,
 * or prepends backend API origin for legacy local /uploads paths.
 * Automatically optimizes Cloudinary URLs with f_auto, q_auto, and max width to avoid massive uncompressed downloads.
 */
export const getMediaUrl = (
  url?: string | null,
  fallback = '',
  options?: MediaTransformOptions
): string => {
  if (!url || !url.trim()) return fallback;
  const trimmed = url.trim();

  // Automatic Cloudinary optimization: inject modern WebP/AVIF format, auto quality & responsive sizing
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/image/upload/')) {
    if (!trimmed.includes('/image/upload/f_auto') && !trimmed.includes('/image/upload/q_auto')) {
      const width = options?.width || 500;
      const crop = options?.crop || 'c_limit';
      const transform = `f_auto,q_auto,w_${width},${crop}/`;
      return trimmed.replace('/image/upload/', `/image/upload/${transform}`);
    }
    return trimmed;
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Frontend public static assets
  if (
    trimmed.startsWith('/banners/') ||
    trimmed.startsWith('/promos/') ||
    trimmed.startsWith('/images/') ||
    trimmed.startsWith('/assets/')
  ) {
    return trimmed;
  }

  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  return `${apiBase}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};


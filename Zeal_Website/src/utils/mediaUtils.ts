export interface MediaTransformOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
}

/**
 * Strips any injected Cloudinary transformation segments (such as f_auto, q_auto, w_500, etc.)
 * from a Cloudinary URL so that the exact 100% original, uncompressed, high-definition image is served.
 */
export const stripCloudinaryTransforms = (url: string): string => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url;
  }
  const prefix = '/image/upload/';
  const idx = url.indexOf(prefix);
  if (idx === -1) return url;

  const afterUpload = url.substring(idx + prefix.length);
  const segments = afterUpload.split('/');

  // If the segment immediately following /image/upload/ is a transformation parameter set (not a version like v12345 or folder):
  if (segments.length > 1 && !/^v\d+$/.test(segments[0])) {
    const firstSegment = segments[0];
    if (
      firstSegment.includes('q_') ||
      firstSegment.includes('w_') ||
      firstSegment.includes('h_') ||
      firstSegment.includes('c_') ||
      firstSegment.includes('f_') ||
      firstSegment.includes('auto')
    ) {
      return url.substring(0, idx + prefix.length) + segments.slice(1).join('/');
    }
  }

  return url;
};

/**
 * Resolves media URLs: returns direct HTTPS/Cloudinary URLs as pristine original quality,
 * or prepends backend API origin for legacy local /uploads paths.
 * By default, serves 100% original uncompressed resolution as uploaded.
 */
export const getMediaUrl = (
  url?: string | null,
  fallback = '',
  options?: MediaTransformOptions
): string => {
  if (!url || !url.trim()) return fallback;
  const trimmed = url.trim();

  // Cloudinary: deliver 100% original uploaded image clarity by default
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/image/upload/')) {
    const cleanUrl = stripCloudinaryTransforms(trimmed);

    // Only apply custom transformations if explicitly requested via options
    if (options && (options.width || options.height || options.quality || options.format || options.crop)) {
      const parts: string[] = [];
      if (options.format) parts.push(`f_${options.format}`);
      if (options.quality) parts.push(`q_${options.quality}`);
      if (options.width) parts.push(`w_${options.width}`);
      if (options.height) parts.push(`h_${options.height}`);
      if (options.crop) parts.push(options.crop);
      if (parts.length > 0) {
        return cleanUrl.replace('/image/upload/', `/image/upload/${parts.join(',')}/`);
      }
    }

    return cleanUrl;
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

  const apiBase = (import.meta.env.VITE_API_URL || 'https://zeal-pharmacure-backend.vercel.app/api').replace(/\/api\/?$/, '');
  return `${apiBase}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};


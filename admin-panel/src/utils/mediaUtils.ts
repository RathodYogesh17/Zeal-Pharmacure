/**
 * Strips any injected Cloudinary transformation segments (such as f_auto, q_auto, w_500, etc.)
 * so that the exact 100% original, uncompressed, high-definition image is served.
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
 */
export const getMediaUrl = (url?: string | null, fallback = ''): string => {
  if (!url) return fallback;
  const trimmed = url.trim();

  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/image/upload/')) {
    return stripCloudinaryTransforms(trimmed);
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  const apiBase = (import.meta.env.VITE_API_URL || 'https://zeal-pharmacure-backend.vercel.app/api').replace(/\/api\/?$/, '');
  return `${apiBase}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

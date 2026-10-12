/**
 * Resolves media URLs: returns direct HTTPS/Cloudinary URLs as-is,
 * or prepends backend API origin for legacy local /uploads paths.
 */
export const getMediaUrl = (url?: string | null, fallback = ''): string => {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  return `${apiBase}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

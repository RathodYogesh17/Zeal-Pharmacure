import { request, API_BASE } from './apiClient';

export interface IMediaItem {
  _id: string;
  originalName: string;
  filename: string;
  url: string;
  storageKey?: string;
  storageProvider?: 'LOCAL' | 'CLOUDINARY' | 'S3' | 'OTHER';
  mediaType?: 'IMAGE' | 'VIDEO' | 'PDF' | 'DOCUMENT' | 'OTHER';
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  title?: string;
  altText?: string;
  caption?: string;
  folder?: string;
  tags?: string[];
  isPublic?: boolean;
  tag?: 'PRODUCT' | 'LOGO' | 'PROFILE' | 'BANNER' | 'OTHER' | string;
  createdAt?: string;
}

export interface IGalleryResponse {
  items: IMediaItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const galleryService = {
  // Format URL to ensure it points to backend server if relative
  formatUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const backendHost = API_BASE.replace(/\/api$/, '');
    return `${backendHost}${url.startsWith('/') ? url : `/${url}`}`;
  },

  async getImages(params: {
    tag?: string;
    folder?: string;
    mediaType?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<IGalleryResponse> {
    const query = new URLSearchParams();
    if (params.folder && params.folder !== 'ALL') query.append('folder', params.folder);
    else if (params.tag && params.tag !== 'ALL') query.append('tag', params.tag);
    if (params.mediaType && params.mediaType !== 'ALL') query.append('mediaType', params.mediaType);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit || 50));

    const res = await request<IGalleryResponse>(`/gallery?${query.toString()}`);
    return res.data;
  },

  async uploadImages(files: File[], tag: string = 'PRODUCT'): Promise<IMediaItem[]> {
    const formData = new FormData();
    files.forEach((file) => { formData.append('images', file);});
    formData.append('tag', tag);
    const res = await request<{ created: IMediaItem[]; existing: IMediaItem[]; total: number }>( '/gallery/upload', { method: 'POST',  body: formData, } );
    return [...(res.data.created || []), ...(res.data.existing || [])];
  },

  async deleteImage(id: string): Promise<void> {
    await request(`/gallery/${id}`, { method: 'DELETE', });
  },
};

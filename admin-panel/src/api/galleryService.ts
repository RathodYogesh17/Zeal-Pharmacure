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
    if (!files || files.length === 0) return [];

    const allResults: IMediaItem[] = [];

    // Helper to upload a single file (ensures payload stays well under Vercel's 4.5MB limit)
    const uploadSingle = async (file: File): Promise<IMediaItem[]> => {
      const formData = new FormData();
      formData.append('images', file);
      formData.append('tag', tag);
      formData.append('folder', tag);

      const res = await request<{ created: IMediaItem[]; existing: IMediaItem[]; total: number }>(
        '/gallery/upload',
        { method: 'POST', body: formData }
      );
      return [...(res?.data?.created || []), ...(res?.data?.existing || [])];
    };

    // Upload with concurrency of 3 workers for speed and reliability
    const CONCURRENCY = 3;
    const queue = [...files];
    const workers = Array.from({ length: Math.min(CONCURRENCY, files.length) }, async () => {
      while (queue.length > 0) {
        const file = queue.shift();
        if (file) {
          try {
            const items = await uploadSingle(file);
            allResults.push(...items);
          } catch (err: any) {
            console.error(`Failed to upload ${file.name}:`, err.message);
          }
        }
      }
    });

    await Promise.all(workers);
    return allResults;
  },

  async updateImage(
    id: string,
    data: {
      folder?: string;
      tag?: string;
      title?: string;
      altText?: string;
      caption?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ): Promise<IMediaItem> {
    const res = await request<IMediaItem>(`/gallery/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async batchMoveImages(ids: string[], folder: string): Promise<void> {
    await request(`/gallery/batch-move`, {
      method: 'POST',
      body: JSON.stringify({ ids, folder }),
    });
  },

  async autoOrganize(): Promise<{
    totalUpdated: number;
    profileCount: number;
    productCount: number;
    logoCount: number;
    bannerCount: number;
  }> {
    const res = await request<any>(`/gallery/auto-organize`, {
      method: 'POST',
    });
    return res.data;
  },

  async deleteImage(id: string): Promise<void> {
    await request(`/gallery/${id}`, { method: 'DELETE' });
  },

  async batchDeleteImages(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) return;
    try {
      await request(`/gallery/batch-delete`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      });
    } catch (err: any) {
      // Resilient fallback: If server returns 404 (endpoint not deployed on server yet), delete individually
      const errMsg = err?.message || String(err);
      if (err?.status === 404 || errMsg.includes('404')) {
        console.warn('batch-delete returned 404, falling back to individual deletes...');
        await Promise.all(ids.map((id) => this.deleteImage(id)));
        return;
      }
      throw err;
    }
  },
};


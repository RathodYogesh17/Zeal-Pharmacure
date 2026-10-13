const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> { success: boolean; message: string; data: T;}
export async function request<T = any>( endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = localStorage.getItem('zeal_token');
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData, set Content-Type to application/json
  if (options.body && !(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, { ...options,  headers,});
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMsg = data?.message || `Request failed with status ${response.status}`;
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        errorMsg = data.errors.map((e: any) => typeof e === 'string' ? e.replace(/['"]/g, '') : JSON.stringify(e)).join('. ');
      }
      if (response.status === 401) {
        localStorage.removeItem('zeal_token');
        localStorage.removeItem('zeal_user');
        localStorage.removeItem('zeal_login_time');
      }
      throw new Error(errorMsg);
    }

    return data as ApiResponse<T>;
  } catch (err: any) {
    console.warn(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export { API_BASE };

import { request, API_BASE } from './apiClient';

export interface IWhatsAppBotStatus {
  status: 'DISCONNECTED' | 'SCAN_QR' | 'CONNECTING' | 'CONNECTED';
  connectedNumber: string | null;
  hasQr: boolean;
}

export const whatsappBotService = {
  async getStatus(): Promise<IWhatsAppBotStatus> {
    try {
      const res = await request<{ status: IWhatsAppBotStatus['status']; connectedNumber: string | null; hasQr: boolean }>(
        '/whatsapp-bot/status'
      );
      return res.data || { status: 'DISCONNECTED', connectedNumber: null, hasQr: false };
    } catch {
      return { status: 'DISCONNECTED', connectedNumber: null, hasQr: false };
    }
  },

  getQrHtmlUrl(): string {
    return `${API_BASE}/whatsapp-bot/qr`;
  },

  async resetSession(): Promise<{ success: boolean; message: string }> {
    const res = await request<{ success: boolean; message: string }>('/whatsapp-bot/reset', {
      method: 'POST',
    });
    return res.data || { success: true, message: 'Session reset requested' };
  },

  async sendTestMessage(phone: string, message?: string): Promise<{ success: boolean; message?: string }> {
    const res = await request<any>('/whatsapp-bot/test-send', {
      method: 'POST',
      body: JSON.stringify({ phone, message }),
    });
    return res.data;
  },
};

import { request, API_BASE } from './apiClient';

export interface IWhatsAppBotStatus {
  status: 'CONNECTED' | 'DISCONNECTED' | 'SCAN_QR' | 'CONNECTING';
  connectedNumber?: string | null;
  hasQr?: boolean;
}

export interface ISendWhatsAppResponse {
  success: boolean;
  to?: string;
  messageId?: string;
  error?: string;
  message?: string;
}

export const whatsappService = {
  /**
   * Get live status of the WhatsApp Bot (Safe fallback in serverless mode)
   */
  async getStatus(): Promise<IWhatsAppBotStatus> {
    try {
      const res = await request<{ status: IWhatsAppBotStatus['status']; connectedNumber?: string; hasQr?: boolean }>(
        '/whatsapp-bot/status'
      );
      return res.data || { status: 'DISCONNECTED', connectedNumber: null, hasQr: false };
    } catch {
      return { status: 'DISCONNECTED', connectedNumber: null, hasQr: false };
    }
  },

  async getBotStatus(): Promise<IWhatsAppBotStatus> {
    return this.getStatus();
  },

  getQrHtmlUrl(): string {
    return `${API_BASE}/whatsapp-bot/qr`;
  },

  async resetSession(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await request<{ success: boolean; message: string }>('/whatsapp-bot/reset', {
        method: 'POST',
      });
      return res.data || { success: true, message: 'Session reset requested' };
    } catch {
      return { success: true, message: 'Session reset requested' };
    }
  },

  async sendTestMessage(phone: string, message?: string): Promise<{ success: boolean; message?: string }> {
    const res = await request<any>('/whatsapp-bot/test-send', {
      method: 'POST',
      body: JSON.stringify({ phone, message }),
    });
    return res.data;
  },

  async sendDirectMessage(phone: string, message: string): Promise<ISendWhatsAppResponse> {
    const res = await request<ISendWhatsAppResponse>('/whatsapp-bot/send-message', {
      method: 'POST',
      body: JSON.stringify({ phone, message }),
    });
    return res.data || res;
  },
};


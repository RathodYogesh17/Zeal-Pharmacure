import { request } from './apiClient';

export interface IWhatsAppBotStatus {
  status: 'CONNECTED' | 'DISCONNECTED' | 'SCAN_QR';
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
   * Get live status of the WhatsApp Bot (Baileys session)
   */
  async getBotStatus(): Promise<IWhatsAppBotStatus> {
    try {
      const res = await request<{ status: 'CONNECTED' | 'DISCONNECTED' | 'SCAN_QR'; connectedNumber?: string; hasQr?: boolean }>(
        '/whatsapp-bot/status'
      );
      return res.data || { status: 'DISCONNECTED' };
    } catch {
      return { status: 'DISCONNECTED' };
    }
  },

  /**
   * Push direct message from server via WhatsApp Bot (Zero click required by user)
   */
  async sendDirectMessage(phone: string, message: string): Promise<ISendWhatsAppResponse> {
    const res = await request<ISendWhatsAppResponse>('/whatsapp-bot/send-message', {
      method: 'POST',
      body: JSON.stringify({ phone, message }),
    });
    return res.data || res;
  },
};

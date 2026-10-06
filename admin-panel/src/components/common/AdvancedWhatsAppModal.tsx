import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  Bot,
  User,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { whatsappService, type IWhatsAppBotStatus } from '../../api/whatsappService';
import {
  getWhatsAppCategoryColor,
  getCategoryWhatsAppTemplates,
  buildWhatsAppWebUrl,
  normalizeWhatsAppRecipient,
  type WhatsAppEnquiryCategory,
  type MessageTemplate,
  type WhatsAppTemplateDetails,
} from './whatsapp';

export interface AdvancedWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: WhatsAppEnquiryCategory;
  recipientName?: string;
  recipientPhone?: string;
  currentStatus?: string;
  referenceTitle?: string;
  details?: WhatsAppTemplateDetails;
  recipient?: any;
  enquiry?: any;
  onMessageSent?: (message: string) => void;
}

export const AdvancedWhatsAppModal: React.FC<AdvancedWhatsAppModalProps> = (props) => {
  const { isOpen, onClose, onMessageSent } = props;

  const normalized = useMemo(() => normalizeWhatsAppRecipient(props), [props]);
  const { category, recipientName, recipientPhone, cleanPhone, currentStatus, referenceTitle, details } = normalized;

  // Category message templates from shared common definitions
  const templates: MessageTemplate[] = useMemo(
    () => getCategoryWhatsAppTemplates(category, recipientName, referenceTitle, details),
    [category, recipientName, referenceTitle, details]
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [botStatus, setBotStatus] = useState<IWhatsAppBotStatus>({ status: 'DISCONNECTED' });
  const [sendingBot, setSendingBot] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [botSuccessMsg, setBotSuccessMsg] = useState<string>('');
  const [botErrorMsg, setBotErrorMsg] = useState<string>('');

  // Sync templates on open or category/recipient change
  useEffect(() => {
    if (templates.length > 0) {
      setSelectedTemplateId(templates[0].id);
      setMessageText(templates[0].getMessage());
    }
  }, [templates]);

  // Check live bot status when modal is opened
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    whatsappService
      .getBotStatus()
      .then((status) => {
        if (isMounted) setBotStatus(status);
      })
      .catch(() => {
        if (isMounted) setBotStatus({ status: 'DISCONNECTED' });
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectTemplate = (template: MessageTemplate) => {
    setSelectedTemplateId(template.id);
    setMessageText(template.getMessage());
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleOpenWhatsAppWeb = () => {
    const url = buildWhatsAppWebUrl(cleanPhone || recipientPhone, messageText);
    window.open(url, '_blank', 'noopener,noreferrer');
    onMessageSent?.(messageText);
    onClose();
  };

  const handleSendViaBot = async () => {
    setSendingBot(true);
    setBotSuccessMsg('');
    setBotErrorMsg('');
    try {
      const res = await whatsappService.sendDirectMessage(cleanPhone || recipientPhone, messageText);
      if (res.success) {
        setBotSuccessMsg(`Message successfully delivered to +${cleanPhone || recipientPhone} via WhatsApp Bot!`);
        onMessageSent?.(messageText);
        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        setBotErrorMsg(res.error || res.message || 'Bot could not deliver message. Please open via WhatsApp Web.');
      }
    } catch (err: any) {
      setBotErrorMsg(err?.message || 'Failed to dispatch message via WhatsApp Bot. Use WhatsApp Web.');
    } finally {
      setSendingBot(false);
    }
  };

  const catStyle = getWhatsAppCategoryColor(category);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          border: '1.5px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1.5px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MessageSquare size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                  Executive WhatsApp Communication Hub
                </h3>
                <span
                  style={{
                    background: catStyle.bg,
                    border: `1px solid ${catStyle.border}`,
                    color: catStyle.text,
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '100px',
                  }}
                >
                  {catStyle.badge}
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                Official WhatsApp Sender Desk (+91 9316227576)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Recipient Details & Bot Status Bar */}
        <div
          style={{
            padding: '12px 24px',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Recipient Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
              <User size={15} style={{ color: '#6828DC' }} />
              <span>{recipientName}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>
              <Phone size={14} />
              <span>+{cleanPhone}</span>
            </div>

            {currentStatus && (
              <span
                style={{
                  background: '#EDE9FE',
                  color: '#6828DC',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '1px 8px',
                  borderRadius: '6px',
                }}
              >
                Status: {currentStatus}
              </span>
            )}
          </div>

          {/* Bot Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: botStatus.status === 'CONNECTED' ? '#10B981' : '#94A3B8',
                boxShadow: botStatus.status === 'CONNECTED' ? '0 0 8px #10B981' : 'none',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 700, color: botStatus.status === 'CONNECTED' ? '#065F46' : '#64748B' }}>
              {botStatus.status === 'CONNECTED' ? 'WhatsApp Bot Active (Server Push)' : 'WhatsApp Web Ready'}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          {/* Alerts */}
          {botSuccessMsg && (
            <div
              style={{
                padding: '10px 14px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Check size={16} />
              <span>{botSuccessMsg}</span>
            </div>
          )}

          {botErrorMsg && (
            <div
              style={{
                padding: '10px 14px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                borderRadius: '10px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} />
              <span>{botErrorMsg}</span>
            </div>
          )}

          {/* Template Selector Pills */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Smart Message Template
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {templates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    style={{
                      padding: '7px 14px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid #10B981' : '1.5px solid #E2E8F0',
                      background: isSelected ? '#ECFDF5' : '#FFFFFF',
                      color: isSelected ? '#065F46' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none',
                    }}
                  >
                    {tpl.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editable Textarea */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Message Content (Fully Editable)
              </label>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                {messageText.length} characters
              </span>
            </div>
            <textarea
              rows={8}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13px',
                lineHeight: 1.55,
                color: '#0F172A',
                fontFamily: 'monospace, sans-serif',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#FAFAFA',
              }}
            />
          </div>

          {/* WhatsApp Chat Live Preview Bubble */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
              LIVE RECIPIENT PREVIEW
            </span>
            <div
              style={{
                background: '#EFEAE2',
                padding: '14px',
                borderRadius: '14px',
                border: '1px solid #E2D9C8',
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  maxWidth: '92%',
                  fontSize: '12.5px',
                  lineHeight: 1.45,
                  color: '#111827',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  whiteSpace: 'pre-wrap',
                  position: 'relative',
                }}
              >
                {messageText}
                <div style={{ textAlign: 'right', fontSize: '10px', color: '#9CA3AF', marginTop: '4px' }}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1.5px solid #F1F5F9',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {/* Left Actions: Copy */}
          <button
            type="button"
            onClick={handleCopy}
            style={{
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1.2px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {copied ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          {/* Right Actions: Bot Push & WhatsApp Web */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                fontSize: '12.5px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            {/* Direct Bot Send */}
            <button
              type="button"
              onClick={handleSendViaBot}
              disabled={sendingBot}
              style={{
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '10px',
                border: 'none',
                background: botStatus.status === 'CONNECTED' ? '#6828DC' : '#475569',
                color: '#FFFFFF',
                cursor: sendingBot ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: sendingBot ? 0.7 : 1,
                boxShadow: '0 2px 10px rgba(104, 40, 220, 0.25)',
              }}
              title={botStatus.status === 'CONNECTED' ? 'Send direct message from server via bot' : 'Send test via bot'}
            >
              <Bot size={15} />
              <span>{sendingBot ? 'Pushing Message...' : '🚀 Send via Bot'}</span>
            </button>

            {/* WhatsApp Web Direct Chat */}
            <button
              type="button"
              onClick={handleOpenWhatsAppWeb}
              style={{
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '10px',
                border: 'none',
                background: '#10B981',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
              }}
            >
              <MessageSquare size={15} />
              <span>Open in WhatsApp</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

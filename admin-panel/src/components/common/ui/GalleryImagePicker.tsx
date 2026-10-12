import React, { useState } from 'react';
import { Image as ImageIcon, X, ExternalLink, UploadCloud } from 'lucide-react';

export interface GalleryImagePickerProps {
  label: string;
  helperText?: string;
  value?: string | null;
  onChange: (url: string) => void;
  onOpenGallery: () => void;
  aspect?: 'square' | 'banner';
  disabled?: boolean;
}

export const GalleryImagePicker: React.FC<GalleryImagePickerProps> = ({
  label,
  helperText,
  value,
  onChange,
  onOpenGallery,
  aspect = 'square',
  disabled = false,
}) => {
  const [showManualInput, setShowManualInput] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          disabled={disabled}
          style={{
            background: 'none',
            border: 'none',
            color: '#6828DC',
            fontSize: '11px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: 0,
            textDecoration: 'underline',
            fontWeight: 500,
          }}
        >
          {showManualInput ? 'Hide Manual URL' : 'Manual URL'}
        </button>
      </div>

      {value ? (
        <div
          style={{
            position: 'relative',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            background: '#F8FAFC',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src={value}
            alt={label}
            style={{
              width: aspect === 'banner' ? '120px' : '56px',
              height: '56px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://placehold.co/100x100?text=Invalid+Image';
            }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: '11.5px',
                color: '#64748B',
                wordBreak: 'break-all',
                maxHeight: '34px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {value}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onOpenGallery}
                disabled={disabled}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6828DC',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  padding: 0,
                }}
              >
                Change from Media
              </button>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#64748B',
                  fontSize: '11px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  textDecoration: 'none',
                }}
              >
                <span>View Full</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={() => onChange('')}
              title="Remove image"
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && onOpenGallery()}
          style={{
            border: '1.5px dashed #CBD5E1',
            borderRadius: '10px',
            padding: '16px',
            background: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = '#6828DC';
              e.currentTarget.style.background = '#F5F3FF';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.background = '#F8FAFC';
            }
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#EDE9FE',
              color: '#6828DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageIcon size={18} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
            Choose from Media Gallery
          </span>
          {helperText && (
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>{helperText}</span>
          )}
        </div>
      )}

      {showManualInput && (
        <div style={{ marginTop: '4px' }}>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL here (https://...)"
            disabled={disabled}
            style={{
              width: '100%',
              padding: '7px 10px',
              fontSize: '12px',
              color: '#1E293B',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              outline: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
};

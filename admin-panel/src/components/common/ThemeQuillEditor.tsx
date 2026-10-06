import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export interface ThemeQuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string | number;
  label?: React.ReactNode;
  helperText?: string;
  toolbarPreset?: 'full' | 'standard' | 'simple';
  style?: React.CSSProperties;
}

export const ThemeQuillEditor: React.FC<ThemeQuillEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write here...',
  minHeight = '120px',
  label,
  helperText,
  toolbarPreset = 'standard',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isInternalChangeRef = useRef(false);

  const getToolbarOptions = () => {
    if (toolbarPreset === 'simple') {
      return [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
      ];
    }
    if (toolbarPreset === 'full') {
      return [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'clean'],
      ];
    }
    // standard
    return [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: ['#0F172A', '#6828DC', '#059669', '#DC2626', '#D97706', '#2563EB'] }],
      ['link', 'clean'],
    ];
  };

  const isHtmlString = (str: string) => {
    const trimmed = str.trim();
    return /<[a-z][\s\S]*>/i.test(trimmed);
  };

  const setQuillContent = (q: Quill, val: string) => {
    if (!val) {
      q.setText('');
      return;
    }
    if (isHtmlString(val)) {
      q.clipboard.dangerouslyPasteHTML(val);
    } else {
      q.setText(val);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous child nodes to prevent duplicate mount in StrictMode / fast refresh
    containerRef.current.innerHTML = '';

    // Create a sub-div for editor mount to avoid React DOM reconciliation issues
    const editorDiv = document.createElement('div');
    containerRef.current.appendChild(editorDiv);

    const quill = new Quill(editorDiv, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: getToolbarOptions(),
      },
    });

    quillRef.current = quill;

    // Initialize content
    if (value) {
      setQuillContent(quill, value);
    }

    // Handle user changes
    quill.on('text-change', (_delta, _oldDelta, source) => {
      if (source === 'user') {
        isInternalChangeRef.current = true;
        // If content is empty (just a trailing newline), return empty string
        const text = quill.getText().trim();
        if (!text) {
          onChange('');
        } else {
          const html = quill.root.innerHTML;
          onChange(html);
        }
        setTimeout(() => {
          isInternalChangeRef.current = false;
        }, 0);
      }
    });

    return () => {
      quillRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Update Quill content if external value changes (and not caused by user typing)
  useEffect(() => {
    if (!quillRef.current || isInternalChangeRef.current) return;

    const currentHtml = quillRef.current.root.innerHTML;
    const currentText = quillRef.current.getText().trim();

    // Avoid unnecessary reset if equivalent
    if (value === currentHtml || (value === '' && currentText === '')) return;

    setQuillContent(quillRef.current, value);
  }, [value]);

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', ...style }}>
      {label && (
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#1E293B',
            marginBottom: '6px',
          }}
        >
          {label}
        </label>
      )}

      {/* Styled Quill Container with Zeal Pharma Purple Branding */}
      <div
        className="theme-quill-wrapper"
        style={{
          borderRadius: '10px',
          border: '1.5px solid #CBD5E1',
          overflow: 'hidden',
          background: '#FFFFFF',
          transition: 'all 0.15s ease',
        }}
        onFocus={() => {
          const wrapper = containerRef.current?.parentElement;
          if (wrapper) {
            wrapper.style.borderColor = '#6828DC';
            wrapper.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
          }
        }}
        onBlur={() => {
          const wrapper = containerRef.current?.parentElement;
          if (wrapper) {
            wrapper.style.borderColor = '#CBD5E1';
            wrapper.style.boxShadow = 'none';
          }
        }}
      >
        <div ref={containerRef} />
      </div>

      {helperText && (
        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>{helperText}</div>
      )}

      <style>{`
        .theme-quill-wrapper .ql-toolbar.ql-snow {
          background: #F8FAFC;
          border: none;
          border-bottom: 1.5px solid #E2E8F0;
          padding: 8px 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
        }
        .theme-quill-wrapper .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 13.5px;
          color: #0F172A;
        }
        .theme-quill-wrapper .ql-editor {
          min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight};
          padding: 12px 14px;
          line-height: 1.6;
        }
        .theme-quill-wrapper .ql-editor.ql-blank::before {
          color: #94A3B8;
          font-style: normal;
          left: 14px;
          right: 14px;
        }
        .theme-quill-wrapper .ql-snow.ql-toolbar button {
          border-radius: 4px;
          padding: 3px 5px;
          transition: all 0.15s ease;
        }
        .theme-quill-wrapper .ql-snow.ql-toolbar button:hover {
          background: #F1F5F9;
        }
        .theme-quill-wrapper .ql-snow.ql-toolbar button.ql-active {
          background: #EDE9FE;
          color: #6828DC !important;
        }
        .theme-quill-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
        .theme-quill-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #6828DC !important;
        }
        .theme-quill-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
        .theme-quill-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #6828DC !important;
        }
        .theme-quill-wrapper .ql-snow .ql-picker.ql-expanded .ql-picker-label {
          color: #6828DC;
          border-color: #CBD5E1;
        }
        .theme-quill-wrapper .ql-snow .ql-picker-options {
          border-color: #CBD5E1;
          border-radius: 8px;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.1);
          background: #FFFFFF;
        }
      `}</style>
    </div>
  );
};

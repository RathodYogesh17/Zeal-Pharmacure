import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, Check } from 'lucide-react';
import { FormField } from './FormField';

export interface FormFileUploadProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect?: (file: File | null) => void;
  previewUrl?: string;
}

export const FormFileUpload: React.FC<FormFileUploadProps> = ({ label, required, error, helperText, accept = 'image/*,.pdf', maxSizeMB = 5, onFileSelect, previewUrl, }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    setFileError(null);
    if (!file) { setSelectedFile(null); onFileSelect?.(null); return; }
    if (file.size > maxSizeMB * 1024 * 1024) { setFileError(`File size exceeds ${maxSizeMB} MB limit.`); return; }
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { handleFile(e.dataTransfer.files[0]); }
  };

  return (
    <FormField label={label} required={required} error={error || fileError || undefined} helperText={helperText}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files && e.target.files.length > 0) { handleFile(e.target.files[0]); } }}
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ border: isDragging ? '2px dashed #6828DC' : '2px dashed #CBD5E1', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', backgroundColor: isDragging ? '#F5F3FF' : '#F8FAFC', cursor: 'pointer', transition: 'all 0.2s ease', }}
      >
        {selectedFile ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#EDE9FE', color: '#6828DC', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
              <File size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>{selectedFile.name}</div>
              <div style={{ fontSize: '11.5px', color: '#64748B' }}>  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload </div>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); handleFile(null); }} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: '8px', }} >
              <X size={14} />
            </button>
          </div>
        ) : previewUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <img src={previewUrl} alt="Preview" style={{ height: '48px', borderRadius: '6px', objectFit: 'contain' }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}> <Check size={14} /> Current File Attached </span>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>Click to replace file</span>
            </div>
          </div>
        ) : (
          <div>
            <UploadCloud size={32} style={{ color: '#6828DC', margin: '0 auto 8px' }} />
              <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '2px' }}>  Click to upload or drag and drop </p>
              <p style={{ fontSize: '11.5px', color: '#64748B' }}> PNG, JPG, PDF up to {maxSizeMB} MB </p>
          </div>
        )}
      </div>
    </FormField>
  );
};

import React, { useState } from 'react';
import { UploadCloud, Search, Check, Folder, Image as ImageIcon, CheckCircle2, AlertCircle} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { ZealLoader } from './ZealLoader';
import { ThemeSelect } from '../tableTheme';
import { useGalleryImagesQuery, useUploadGalleryImagesMutation} from '../../../hooks/queries/useGalleryQuery';
import { galleryService, type IMediaItem } from '../../../api/galleryService';

export interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string, mediaItem?: IMediaItem) => void;
  onSelectMultiple?: (imageUrls: string[], mediaItems?: IMediaItem[]) => void;
  title?: string;
  defaultTag?: 'PRODUCT' | 'LOGO' | 'PROFILE' | 'BANNER' | 'ALL';
  multiple?: boolean;
}

export const MediaGalleryModal: React.FC<MediaGalleryModalProps> = ({ isOpen, onClose, onSelect, onSelectMultiple, title = 'Select Image from Media Gallery', defaultTag = 'ALL', multiple = false}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload'>('browse');
  const [selectedTag, setSelectedTag] = useState<string>(defaultTag);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<IMediaItem | null>(null);
  const [selectedImages, setSelectedImages] = useState<IMediaItem[]>([]);

  // Upload state
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [uploadTag, setUploadTag] = useState<string>(defaultTag === 'ALL' ? 'PRODUCT' : defaultTag);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const { data: galleryData, isLoading } = useGalleryImagesQuery({
    tag: selectedTag,
    search: searchQuery,
    limit: 60,
  });

  const uploadMutation = useUploadGalleryImagesMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFilesToUpload(Array.from(e.target.files));
      setUploadError('');
    }
  };

  const handleUploadSubmit = async () => {
    if (filesToUpload.length === 0) {
      setUploadError('Please select at least one image file.');
      return;
    }

    try {
      setUploadError('');
      const uploaded = await uploadMutation.mutateAsync({
        files: filesToUpload,
        tag: uploadTag,
      });

      setUploadSuccess(`Uploaded ${uploaded.length} image(s) successfully!`);
      setFilesToUpload([]);

      if (uploaded.length > 0) {
        const first = uploaded[0];
        const formatted = galleryService.formatUrl(first.url);
        onSelect(formatted, first);
        setTimeout(() => {
          setUploadSuccess('');
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image.');
    }
  };

  const handleConfirmSelection = () => {
    if (multiple) {
      if (selectedImages.length > 0) {
        const urls = selectedImages.map((img) => galleryService.formatUrl(img.url));
        if (onSelectMultiple) {
          onSelectMultiple(urls, selectedImages);
        } else {
          urls.forEach((url, i) => onSelect(url, selectedImages[i]));
        }
        setSelectedImages([]);
        onClose();
      }
    } else if (selectedImage) {
      const formatted = galleryService.formatUrl(selectedImage.url);
      onSelect(formatted, selectedImage);
      setSelectedImage(null);
      onClose();
    }
  };

  const tags = [
    { id: 'ALL', label: 'All Media' },
    { id: 'PRODUCT', label: 'Products' },
    { id: 'LOGO', label: 'Logos & Branding' },
    { id: 'PROFILE', label: 'Profile Photos' },
    { id: 'BANNER', label: 'Banners & CMS' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
      footer={
        activeTab === 'browse' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              {multiple ? (
                <span>Selected: <strong style={{ color: '#6828DC' }}>{selectedImages.length} images</strong></span>
              ) : selectedImage ? (
                <span>Selected: <strong style={{ color: '#0F172A' }}>{selectedImage.originalName}</strong></span>
              ) : (
                'Click any image to select'
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" size="sm" onClick={onClose}> Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                disabled={multiple ? selectedImages.length === 0 : !selectedImage}
                onClick={handleConfirmSelection}
              >
                {multiple ? `Use ${selectedImages.length} Selected Images` : 'Use Selected Image'}
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      <div>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '16px',}}>
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 700, background: activeTab === 'browse' ? '#6828DC' : '#F1F5F9', color: activeTab === 'browse' ? '#FFFFFF' : '#64748B', cursor: 'pointer', display: 'flex',alignItems: 'center',gap: '6px', border: 'none',}}>
            <ImageIcon size={15} />
            Browse Gallery ({galleryData?.items?.length || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 700, background: activeTab === 'upload' ? '#6828DC' : '#F1F5F9', color: activeTab === 'upload' ? '#FFFFFF' : '#64748B', cursor: 'pointer', display: 'flex',alignItems: 'center', gap: '6px',  border: 'none', }}>
            <UploadCloud size={15} />
            Upload New File
          </button>
        </div>

        {/* TAB 1: BROWSE GALLERY */}
        {activeTab === 'browse' && (
          <div>
            {/* Filter Bar & Search */}
            <div style={{ display: 'flex',flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px',}}>
              {/* Category Filter Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {tags.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTag(t.id)}
                    style={{ padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, border: '1px solid',
                      borderColor: selectedTag === t.id ? '#6828DC' : '#E2E8F0',
                      background: selectedTag === t.id ? '#EDE9FE' : '#FFFFFF',
                      color: selectedTag === t.id ? '#6828DC' : '#64748B',
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search file name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '6px 10px 6px 30px', fontSize: '12.5px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '100%'}}/>
              </div>
            </div>

            {/* Grid of Images */}
            {isLoading ? (
              <ZealLoader
                title="Loading Gallery Media"
                subtitle="Fetching verified media assets..."
                size="md"
                minHeight="220px"
              />
            ) : !galleryData?.items || galleryData.items.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', border: '1.5px dashed #E2E8F0',}}>
                <Folder size={36} style={{ color: '#CBD5E1', margin: '0 auto 10px' }} />
                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>No media found</div>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  No images uploaded in this category yet. Click "Upload New File" to add one!
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', maxHeight: '400px', overflowY: 'auto', padding: '4px',}}>
                {galleryData.items.map((item) => {
                  const isSelected = multiple
                    ? selectedImages.some((i) => i._id === item._id)
                    : selectedImage?._id === item._id;
                  const fullUrl = galleryService.formatUrl(item.url);
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        if (multiple) {
                          setSelectedImages((prev) =>
                            prev.some((p) => p._id === item._id)
                              ? prev.filter((p) => p._id !== item._id)
                              : [...prev, item]
                          );
                        } else {
                          setSelectedImage(item);
                        }
                      }}
                      onDoubleClick={() => {
                        if (!multiple) {
                          setSelectedImage(item);
                          handleConfirmSelection();
                        }
                      }}
                      style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: isSelected ? '2.5px solid #6828DC' : '1px solid #E2E8F0',boxShadow: isSelected ? '0 0 0 3px rgba(104, 40, 220, 0.2)' : 'none', background: '#F8FAFC',cursor: 'pointer', transition: 'all 0.15s ease', }}>
                      {/* Image Thumbnail */}
                      <div style={{ width: '100%', height: '110px', background: '#FFFFFF', overflow: 'hidden' }}>
                        <img
                          src={fullUrl}
                          alt={item.originalName}
                          style={{ width: '100%', height: '100%',objectFit: 'contain', display: 'block',}}
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>

                      {/* Info & Tag */}
                      <div style={{ padding: '6px 8px', background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600,color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }} 
                        title={item.originalName}>
                          {item.originalName}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px',}}>
                          <span style={{ fontSize: '9.5px', background: '#EDE9FE', color: '#6828DC', padding: '1px 5px',  borderRadius: '4px',  fontWeight: 700,}}>
                            {item.tag || 'PRODUCT'}
                          </span>
                          <span style={{ fontSize: '9.5px', color: '#94A3B8' }}>
                            {(item.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      </div>

                      {/* Selected Overlay Checkmark */}
                      {isSelected && (
                        <div style={{ position: 'absolute',top: '6px', right: '6px', width: '22px', height: '22px', borderRadius: '50%', background: '#6828DC', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',}}>
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UPLOAD NEW FILE */}
        {activeTab === 'upload' && (
          <div style={{ padding: '10px 0' }}>
            {uploadSuccess && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px', borderRadius: '8px',display: 'flex',alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px',}}>
                <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {uploadError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px',}}>
                <AlertCircle size={16} style={{ color: '#EF4444' }} />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Tag / Category Choice */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                Asset Category / Folder:
              </label>
              <ThemeSelect
                value={uploadTag}
                onChange={(e) => setUploadTag(e.target.value)}
                containerStyle={{ width: '100%', maxWidth: '340px' }}
              >
                <option value="PRODUCT">Pharmaceutical Products (Packaging, Box, Strip)</option>
                <option value="LOGO">Company Logo & Branding</option>
                <option value="PROFILE">Staff / User Profile Photos</option>
                <option value="BANNER">Website Banners & CMS Assets</option>
                <option value="OTHER">Other Documents & Visual Aids</option>
              </ThemeSelect>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div style={{ border: '2px dashed #6828DC', borderRadius: '12px', padding: '36px 20px', textAlign: 'center', background: '#F5F3FF',cursor: 'pointer', marginBottom: '20px', position: 'relative',}}>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleFileChange}
                style={{ position: 'absolute',   inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', }}/>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#EDE9FE', color: '#6828DC', display: 'flex', alignItems: 'center', justifyContent: 'center',  margin: '0 auto 12px',}}>
                <UploadCloud size={28} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                Choose images or drag & drop files here
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                Supports JPG, PNG, WEBP (Max 5MB per file)
              </div>

              {filesToUpload.length > 0 && ( <div style={{ marginTop: '16px', padding: '8px 12px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #DDD6FE', display: 'inline-block', fontSize: '12.5px',  fontWeight: 700, color: '#6828DC', }}>
                  {filesToUpload.length} file(s) selected: {filesToUpload.map(f => f.name).join(', ')}
                </div>
              )}
            </div>

            {/* Submit Upload */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setFilesToUpload([]); setActiveTab('browse'); }}>
                Back to Gallery
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={filesToUpload.length === 0 || uploadMutation.isPending}
                loading={uploadMutation.isPending}
                onClick={handleUploadSubmit}
              >
                Upload & Select Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

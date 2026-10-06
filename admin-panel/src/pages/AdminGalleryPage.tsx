import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Trash2,
  Copy,
  Check,
  Eye,
  Folder,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  useGalleryImagesQuery,
  useUploadGalleryImagesMutation,
  useDeleteGalleryImageMutation
} from '../hooks/queries/useGalleryQuery';
import { galleryService, type IMediaItem } from '../api/galleryService';
import { Button, Modal, Badge, ThemeSelect } from '../components/common';

export const AdminGalleryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagForUpload, setSelectedTagForUpload] = useState<string>('PRODUCT');
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Batch upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [autoUpload, setAutoUpload] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Preview modal state
  const [previewMedia, setPreviewMedia] = useState<IMediaItem | null>(null);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: galleryData, isLoading, refetch } = useGalleryImagesQuery({
    tag: activeFilter,
    search: searchQuery,
    limit: 100,
  });

  const uploadMutation = useUploadGalleryImagesMutation();
  const deleteMutation = useDeleteGalleryImageMutation();

  const doUpload = async (files: File[], tag: string = selectedTagForUpload) => {
    if (!files || files.length === 0) return;

    try {
      setUploadError('');
      setUploadSuccess(`Uploading ${files.length} asset(s) to ${tag}... Please wait.`);
      const uploaded = await uploadMutation.mutateAsync({
        files,
        tag,
      });

      setUploadSuccess(`Successfully uploaded ${uploaded.length} image(s) to ${tag}!`);
      setFilesToUpload([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setUploadSuccess(''), 4000);
      refetch();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload images. Please check that images are under 30MB.');
      setUploadSuccess('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFilesToUpload(selected);
      setUploadError('');
      if (autoUpload) {
        doUpload(selected, selectedTagForUpload);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (dropped.length > 0) {
        setFilesToUpload(dropped);
        setUploadError('');
        if (autoUpload) {
          doUpload(dropped, selectedTagForUpload);
        }
      }
    }
  };

  const handleUpload = () => {
    if (filesToUpload.length === 0) {
      setUploadError('Please choose at least one image to upload.');
      return;
    }
    doUpload(filesToUpload, selectedTagForUpload);
  };

  const handleCopyLink = (item: IMediaItem) => {
    const fullUrl = galleryService.formatUrl(item.url);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      setDeletingId(null);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete media.');
    }
  };

  const filterTabs = [
    { id: 'ALL', label: 'All Media Assets' },
    { id: 'PRODUCT', label: 'Product Formulations' },
    { id: 'LOGO', label: 'Logos & Branding' },
    { id: 'PROFILE', label: 'Staff Profile Photos' },
    { id: 'BANNER', label: 'Banners & CMS' },
    { id: 'OTHER', label: 'Other Visual Aids' },
  ];

  // Quick stats
  const allItems = galleryData?.items || [];
  const productCount = allItems.filter(i => i.tag === 'PRODUCT').length;
  const logoCount = allItems.filter(i => i.tag === 'LOGO').length;
  const profileCount = allItems.filter(i => i.tag === 'PROFILE').length;

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
            Media &amp; Assets &gt; <strong style={{ color: '#0F172A' }}>Gallery Manager</strong>
          </div>
          <h1 className="admin-page-title">Media Gallery &amp; Asset Central</h1>
          <p className="admin-page-subtitle">
            Upload, categorize, and manage product packaging, logos, staff avatars, and certificates
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Refresh Assets</Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: '#EDE9FE',
            color: '#6828DC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ImageIcon size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>
              {galleryData?.pagination?.total || allItems.length}
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748B' }}>Total Gallery Files</div>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: '#F0FDF4',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>
              {productCount}
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748B' }}>Product Images</div>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>
              {logoCount}
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748B' }}>Logos & Brands</div>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: '#FFF7ED',
            color: '#F97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Folder size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>
              {profileCount}
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748B' }}>Profile Photos</div>
          </div>
        </div>
      </div>

      {/* Upload Box Card matching Image 2 Top-Right */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E2E8F0',
        padding: '24px',
        marginBottom: '28px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
              Upload New Pharmaceutical Assets
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              Upload medicine packaging, logos, banners, or staff photos to the CDN gallery
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoUpload}
                onChange={(e) => setAutoUpload(e.target.checked)}
                style={{ accentColor: '#6828DC', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 600 }}>⚡ Auto-upload immediately upon file selection</span>
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                Target Category:
              </label>
              <ThemeSelect
                value={selectedTagForUpload}
                onChange={(e) => setSelectedTagForUpload(e.target.value)}
                style={{ minWidth: '280px' }}
              >
                <option value="PRODUCT">Pharmaceutical Products (Packaging, 3D Box, Strips)</option>
                <option value="LOGO">Company Logo & Certifications</option>
                <option value="PROFILE">Staff / User Profile Photos</option>
                <option value="BANNER">Website Banners & CMS Assets</option>
                <option value="OTHER">Other Promotional Inputs</option>
              </ThemeSelect>
            </div>
          </div>
        </div>

        {uploadSuccess && (
          <div className="alert-banner alert-success">
            <CheckCircle2 size={18} style={{ color: '#10B981' }} />
            <span>{uploadSuccess}</span>
          </div>
        )}
        {uploadError && (
          <div className="alert-banner alert-error">
            <AlertCircle size={18} style={{ color: '#EF4444' }} />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Drag & Drop Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2.5px dashed #4F46E5' : '2px dashed #6828DC',
            borderRadius: '14px',
            padding: '36px 20px',
            textAlign: 'center',
            background: isDragging ? '#EEF2FF' : '#F5F3FF',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#EDE9FE',
            color: '#6828DC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <UploadCloud size={30} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
            Click to upload or drag & drop multiple images (1 to 50+ at once)
          </div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
            PNG, JPG, WEBP, SVG (Up to 30 MB per file) • Selected Category: <strong style={{ color: '#6828DC' }}>{selectedTagForUpload}</strong>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{
              background: '#FFFFFF',
              border: '1.5px solid #6828DC',
              color: '#6828DC',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(104, 40, 220, 0.08)',
            }}>
              <UploadCloud size={16} />
              <span>Browse 30+ Images</span>
            </span>
          </div>
        </div>

        {/* Selected Files & Batch Upload Bar (outside dropzone, never blocked) */}
        {filesToUpload.length > 0 && !autoUpload && (
          <div style={{
            marginTop: '16px',
            padding: '16px 20px',
            background: '#FAF5FF',
            border: '1.5px solid #DDD6FE',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                {filesToUpload.length} image(s) selected ({ (filesToUpload.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2) } MB)
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Ready to upload to category: <strong>{selectedTagForUpload}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => { setFilesToUpload([]); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#64748B',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>

              <Button
                variant="primary"
                size="sm"
                loading={uploadMutation.isPending}
                disabled={uploadMutation.isPending}
                onClick={handleUpload}
                style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '6px' }}
              >
                <UploadCloud size={16} />
                <span>Upload {filesToUpload.length} Images Now</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '20px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid #F1F5F9',
          paddingBottom: '16px',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: isActive ? '#6828DC' : '#E2E8F0',
                    background: isActive ? '#6828DC' : '#F8FAFC',
                    color: isActive ? '#FFFFFF' : '#64748B',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="admin-search-wrap" style={{ width: '260px', flex: 'none' }}>
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search assets by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            Loading media assets...
          </div>
        ) : allItems.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: '#F8FAFC',
            borderRadius: '12px',
            border: '1.5px dashed #E2E8F0',
          }}>
            <Folder size={48} style={{ color: '#CBD5E1', margin: '0 auto 12px' }} />
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>No media files found</div>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
              Upload your first image above to start managing your digital pharma catalogue.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '18px',
          }}>
            {allItems.map((item) => {
              const fullUrl = galleryService.formatUrl(item.url);
              const isCopied = copiedId === item._id;
              return (
                <div
                  key={item._id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      height: '160px',
                      background: '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={fullUrl}
                      alt={item.originalName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '8px',
                      }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.opacity = '0.3';
                      }}
                    />

                    {/* Tag Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                    }}>
                      <Badge variant="purple" size="sm">
                        {item.tag || 'PRODUCT'}
                      </Badge>
                    </div>

                    {/* Quick View Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewMedia(item)}
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'rgba(15, 23, 42, 0.75)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      title="View Fullscreen"
                    >
                      <Eye size={14} />
                    </button>
                  </div>

                  {/* Card Info */}
                  <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0F172A',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={item.originalName}
                      >
                        {item.originalName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                        {(item.size / 1024).toFixed(0)} KB • {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '12px',
                      paddingTop: '10px',
                      borderTop: '1px solid #F1F5F9',
                    }}>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(item)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: isCopied ? '#ECFDF5' : '#F1F5F9',
                          color: isCopied ? '#065F46' : '#475569',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        title="Copy Public Asset Link"
                      >
                        {isCopied ? <Check size={13} style={{ color: '#10B981' }} /> : <Copy size={13} />}
                        <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingId(item._id)}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#FEF2F2',
                          color: '#EF4444',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        title="Delete Image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      {previewMedia && (
        <Modal
          isOpen={!!previewMedia}
          onClose={() => setPreviewMedia(null)}
          title={previewMedia.originalName}
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: '#64748B' }}>
                Tag: <strong>{previewMedia.tag || 'PRODUCT'}</strong> • Size: {(previewMedia.size / 1024).toFixed(0)} KB
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={galleryService.formatUrl(previewMedia.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: '#F1F5F9',
                    color: '#0F172A',
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={14} />
                  Open in New Tab
                </a>
                <Button variant="primary" size="sm" onClick={() => setPreviewMedia(null)}>
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div style={{ textAlign: 'center', background: '#0F172A', borderRadius: '10px', padding: '16px' }}>
            <img
              src={galleryService.formatUrl(previewMedia.url)}
              alt={previewMedia.originalName}
              style={{
                maxWidth: '100%',
                maxHeight: '450px',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <Modal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          title="Delete Media File"
          size="sm"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
                Yes, Delete File
              </Button>
            </div>
          }
        >
          <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
            Are you sure you want to delete this media file from the gallery? Products or profiles using this image might lose their thumbnail.
          </div>
        </Modal>
      )}
    </div>
  );
};

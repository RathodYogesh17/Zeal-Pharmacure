import React, { useState, useEffect } from 'react';
import {
  Plus,
  Layers,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  Tag,
  Search,
  X,
  Globe,
  Image as ImageIcon,
  Check,
  Calendar,
  User,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { categoryService } from '../api/categoryService';
import { galleryService } from '../api/galleryService';
import { userService } from '../api/userService';
import {
  MediaGalleryModal,
  ThemeSelect,
  CustomThemeSelect,
  DateFilterSelect,
  TablePagination,
  ThemeQuillEditor,
  filterByDateRange,
  type DateFilterType,
  ZealLoader,
} from '../components/common';
import type { ICategory, ISubCategory } from '../types';
import { useAdminCategoriesQuery, useCategoryMutations } from '../hooks/queries/useCategoriesQuery';

interface GalleryImagePickerProps {
  label: string;
  helperText?: string;
  value?: string | null;
  onChange: (url: string) => void;
  onOpenGallery: () => void;
  aspect?: 'square' | 'banner';
}

const GalleryImagePicker: React.FC<GalleryImagePickerProps> = ({
  label,
  helperText,
  value,
  onChange,
  onOpenGallery,
  aspect = 'square',
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
          style={{
            background: 'none',
            border: 'none',
            color: '#6828DC',
            fontSize: '11px',
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          {showManualInput ? 'Hide URL' : 'Manual URL'}
        </button>
      </div>

      {value ? (
        <div
          style={{
            position: 'relative',
            borderRadius: '8px',
            border: '1.5px solid #E2E8F0',
            background: '#F8FAFC',
            overflow: 'hidden',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: aspect === 'banner' ? '90px' : '52px',
              height: '52px',
              borderRadius: '6px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={galleryService.formatUrl(value)}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: aspect === 'banner' ? 'cover' : 'contain' }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '11.5px',
                color: '#475569',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 500,
              }}
              title={value}
            >
              {value.split('/').pop() || value}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={onOpenGallery}
                style={{
                  background: '#EDE9FE',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  color: '#6828DC',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ImageIcon size={12} />
                Gallery
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                style={{
                  background: '#FEE2E2',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  color: '#DC2626',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <X size={12} />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenGallery}
          style={{
            width: '100%',
            padding: aspect === 'banner' ? '14px 12px' : '12px',
            borderRadius: '8px',
            border: '1.5px dashed #CBD5E1',
            background: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#8B5CF6';
            e.currentTarget.style.background = '#F5F3FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.background = '#F8FAFC';
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#EDE9FE',
              color: '#6828DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageIcon size={15} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#6828DC' }}>
            Choose from Gallery
          </span>
          <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
            {helperText || (aspect === 'banner' ? 'Wide hero banner' : 'Square thumbnail')}
          </span>
        </button>
      )}

      {showManualInput && (
        <input
          type="text"
          placeholder="Paste external image URL (https://...)"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 9px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '11.5px',
            marginTop: '2px',
          }}
        />
      )}
    </div>
  );
};

export const AdminCategoriesPage: React.FC = () => {
  const { data: catData, isLoading: loadingCats, isFetching, refetch } = useAdminCategoriesQuery();
  const { invalidateAll } = useCategoryMutations();

  const [categories, setCategories] = useState<ICategory[]>(() => catData?.categories || []);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>(() => catData?.subCategories || []);
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');
  const loading = loadingCats && categories.length === 0;

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterParentCat, setFilterParentCat] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('ALL');

  // Pagination states
  const [catPage, setCatPage] = useState(1);
  const [catPageSize, setCatPageSize] = useState(10);
  const [subPage, setSubPage] = useState(1);
  const [subPageSize, setSubPageSize] = useState(10);

  // Modals Open State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<ISubCategory | null>(null);

  // View Details Modal States
  const [viewingCategory, setViewingCategory] = useState<ICategory | null>(null);
  const [viewingSubCategory, setViewingSubCategory] = useState<ISubCategory | null>(null);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});

  // SEO section toggle in forms
  const [showCatSeo, setShowCatSeo] = useState(false);
  const [showSubSeo, setShowSubSeo] = useState(false);

  // Media Gallery Modal State for Thumbnail & Banner
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState<{
    entity: 'category' | 'subcategory';
    field: 'image' | 'bannerImage';
    title: string;
    tag: 'BANNER' | 'PRODUCT' | 'ALL';
  } | null>(null);

  const initialCategoryForm = {
    name: '',
    code: '',
    shortDescription: '',
    description: '',
    image: '',
    bannerImage: '',
    sortOrder: 0,
    isFeatured: false,
    showOnHome: false,
    showInMenu: true,
    isActive: true,
    seo: {
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
    },
  };

  const initialSubCategoryForm = {
    name: '',
    code: '',
    category: '',
    shortDescription: '',
    description: '',
    image: '',
    bannerImage: '',
    sortOrder: 0,
    isFeatured: false,
    showOnHome: false,
    showInMenu: true,
    isActive: true,
    seo: {
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
    },
  };

  // Category Form State
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [catNameError, setCatNameError] = useState('');

  // SubCategory Form State
  const [subCategoryForm, setSubCategoryForm] = useState(initialSubCategoryForm);
  const [subCatNameError, setSubCatNameError] = useState('');

  useEffect(() => {
    if (catData) {
      setCategories(catData.categories);
      setSubCategories(catData.subCategories);
      setUsersMap(catData.usersMap);

      if (catData.categories.length > 0 && !subCategoryForm.category) {
        setSubCategoryForm((prev) => ({ ...prev, category: catData.categories[0]._id }));
      }
    }
  }, [catData]);

  const loadData = () => {
    refetch();
  };

  const openGalleryFor = (
    entity: 'category' | 'subcategory',
    field: 'image' | 'bannerImage',
    title: string,
    tag: 'BANNER' | 'PRODUCT' | 'ALL' = 'ALL'
  ) => {
    setGalleryTarget({ entity, field, title, tag });
    setGalleryModalOpen(true);
  };

  const handleSelectFromGallery = (url: string) => {
    if (!galleryTarget) return;
    const { entity, field } = galleryTarget;

    if (entity === 'category') {
      setCategoryForm((prev) => ({ ...prev, [field]: url }));
    } else if (entity === 'subcategory') {
      setSubCategoryForm((prev) => ({ ...prev, [field]: url }));
    }

    setGalleryModalOpen(false);
    setGalleryTarget(null);
  };

  // Date and User formatters
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getUserName = (user: unknown) => {
    if (!user) return 'Admin';
    if (typeof user === 'object' && user !== null) {
      const u = user as { _id?: string; name?: string; fullName?: string; email?: string };
      if (u.name) return u.name;
      if (u.fullName) return u.fullName;
      if (u.email) return u.email;
      if (u._id && usersMap[u._id]) return usersMap[u._id];
      return 'Admin';
    }
    const idStr = String(user).trim();
    if (usersMap[idStr]) {
      return usersMap[idStr];
    }
    // If it is an unpopulated 24-char hex ObjectId, show 'Super Admin' instead of raw hex hash
    if (/^[0-9a-fA-F]{24}$/.test(idStr)) {
      return 'Super Admin';
    }
    return idStr || 'Admin';
  };

  const getCategoryName = (cat: unknown): string => {
    if (!cat) return '-';
    if (typeof cat === 'object' && cat !== null) {
      const c = cat as { _id?: string; name?: string };
      return c.name || '-';
    }
    const id = String(cat);
    const found = categories.find(c => c._id === id);
    return found ? found.name : '-';
  };

  // Category Modal Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm(initialCategoryForm);
    setCatNameError('');
    setShowCatSeo(false);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (c: ICategory) => {
    setEditingCategory(c);
    setCatNameError('');
    setCategoryForm({
      name: c.name || '',
      code: c.code || '',
      shortDescription: c.shortDescription || '',
      description: c.description || '',
      image: c.image || '',
      bannerImage: c.bannerImage || '',
      sortOrder: c.sortOrder ?? 0,
      isFeatured: !!c.isFeatured,
      showOnHome: !!c.showOnHome,
      showInMenu: c.showInMenu !== false,
      isActive: c.isActive !== false,
      seo: {
        metaTitle: c.seo?.metaTitle || '',
        metaDescription: c.seo?.metaDescription || '',
        canonicalUrl: c.seo?.canonicalUrl || '',
      },
    });
    setShowCatSeo(false);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setCatNameError('Category Name is required.');
      return;
    }
    setCatNameError('');

    try {
      const payload = {
        ...categoryForm,
        code: categoryForm.code ? categoryForm.code.trim().toUpperCase() : undefined,
      };
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, payload);
        setFeedbackMsg(`Category "${categoryForm.name}" updated successfully!`);
      } else {
        await categoryService.createCategory(payload);
        setFeedbackMsg(`Category "${categoryForm.name}" created successfully!`);
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      loadData();
      setTimeout(() => setFeedbackMsg(''), 3500);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || 'Failed to save category.');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Products in this category may be affected.`)) return;
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c._id !== id));
      setFeedbackMsg(`Category "${name}" deleted.`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || 'Failed to delete category.');
    }
  };

  // SubCategory Modal Handlers
  const handleOpenAddSubCategory = () => {
    setEditingSubCategory(null);
    setSubCatNameError('');
    setSubCategoryForm({
      ...initialSubCategoryForm,
      category: categories.length > 0 ? categories[0]._id : '',
    });
    setShowSubSeo(false);
    setIsSubCategoryModalOpen(true);
  };

  const handleOpenEditSubCategory = (s: ISubCategory) => {
    setEditingSubCategory(s);
    setSubCatNameError('');
    const parentId = typeof s.category === 'object' && s.category !== null ? s.category._id : s.category || '';
    setSubCategoryForm({
      name: s.name || '',
      code: s.code || '',
      category: parentId,
      shortDescription: s.shortDescription || '',
      description: s.description || '',
      image: s.image || '',
      bannerImage: s.bannerImage || '',
      sortOrder: s.sortOrder ?? 0,
      isFeatured: !!s.isFeatured,
      showOnHome: !!s.showOnHome,
      showInMenu: s.showInMenu !== false,
      isActive: s.isActive !== false,
      seo: {
        metaTitle: s.seo?.metaTitle || '',
        metaDescription: s.seo?.metaDescription || '',
        canonicalUrl: s.seo?.canonicalUrl || '',
      },
    });
    setShowSubSeo(false);
    setIsSubCategoryModalOpen(true);
  };

  const handleSaveSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategoryForm.name.trim()) {
      setSubCatNameError('SubCategory Name is required.');
      return;
    }
    setSubCatNameError('');

    try {
      const payload = {
        ...subCategoryForm,
        code: subCategoryForm.code ? subCategoryForm.code.trim().toUpperCase() : undefined,
      };
      if (editingSubCategory) {
        await categoryService.updateSubCategory(editingSubCategory._id, payload);
        setFeedbackMsg(`SubCategory "${subCategoryForm.name}" updated successfully!`);
      } else {
        await categoryService.createSubCategory(payload);
        setFeedbackMsg(`SubCategory "${subCategoryForm.name}" created successfully!`);
      }
      setIsSubCategoryModalOpen(false);
      setEditingSubCategory(null);
      loadData();
      setTimeout(() => setFeedbackMsg(''), 3500);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || 'Failed to save subcategory.');
    }
  };

  const handleDeleteSubCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete subcategory "${name}"?`)) return;
    try {
      await categoryService.deleteSubCategory(id);
      setSubCategories(prev => prev.filter(s => s._id !== id));
      setFeedbackMsg(`SubCategory "${name}" deleted.`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || 'Failed to delete subcategory.');
    }
  };

  const filteredCategories = categories.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.code && c.code.toLowerCase().includes(q)) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  const dateFilteredCategories = filterByDateRange(filteredCategories, c => c.createdAt, dateFilter);
  const catTotalPages = Math.max(1, Math.ceil(dateFilteredCategories.length / catPageSize));
  const paginatedCategories = dateFilteredCategories.slice((catPage - 1) * catPageSize, catPage * catPageSize);

  const filteredSubCategories = subCategories.filter(s => {
    const parentId = typeof s.category === 'object' && s.category !== null ? s.category._id : s.category;
    if (filterParentCat && parentId !== filterParentCat) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.code && s.code.toLowerCase().includes(q)) ||
      s.slug.toLowerCase().includes(q)
    );
  });

  const dateFilteredSubCategories = filterByDateRange(filteredSubCategories, s => s.createdAt, dateFilter);
  const subTotalPages = Math.max(1, Math.ceil(dateFilteredSubCategories.length / subPageSize));
  const paginatedSubCategories = dateFilteredSubCategories.slice((subPage - 1) * subPageSize, subPage * subPageSize);

  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Header with Top Action Button */}
      <div className="page-header">
        <div>
          <h1 className="admin-page-title">Categories &amp; Divisions</h1>
          <p className="admin-page-subtitle">
            Manage therapeutic categories, division codes, banners, homepage visibility, and SEO tags.
          </p>
        </div>
        <div>
          {activeTab === 'categories' ? (
            <button className="btn-primary-action" onClick={handleOpenAddCategory}>
              <Plus size={18} />
              <span>Add Category</span>
            </button>
          ) : (
            <button className="btn-primary-action" onClick={handleOpenAddSubCategory}>
              <Plus size={18} />
              <span>Add SubCategory</span>
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {feedbackMsg && (
        <div className="alert-banner alert-success">
          <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0 }} />
          <div>{feedbackMsg}</div>
        </div>
      )}
      {errorMsg && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn${activeTab === 'categories' ? ' active' : ''}`}
          onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
        >
          <Layers size={17} />
          <span>Therapeutic Categories ({categories.length})</span>
        </button>
        <button
          className={`admin-tab-btn${activeTab === 'subcategories' ? ' active' : ''}`}
          onClick={() => { setActiveTab('subcategories'); setSearchQuery(''); }}
        >
          <Tag size={17} />
          <span>SubCategories &amp; Divisions ({subCategories.length})</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            placeholder={activeTab === 'categories' ? 'Search category by name, code or slug...' : 'Search subcategory by name, code or slug...'}
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCatPage(1); setSubPage(1); }}
            className="admin-search-input"
          />
        </div>
        <DateFilterSelect value={dateFilter} onChange={(val) => { setDateFilter(val); setCatPage(1); setSubPage(1); }} />

        {activeTab === 'subcategories' && (
          <CustomThemeSelect
            value={filterParentCat}
            onChange={(val) => {
              setFilterParentCat(val);
              setSubPage(1);
            }}
            placeholder={`All Parent Categories (${categories.length})`}
            options={[
              { value: '', label: `All Parent Categories (${categories.length})` },
              ...categories.map((c) => ({
                value: c._id,
                label: c.name,
              })),
            ]}
            icon={<Layers size={14} style={{ color: '#6828DC' }} />}
            style={{ minWidth: '240px' }}
            searchable={categories.length > 5}
          />
        )}

        {(searchQuery || filterParentCat || dateFilter !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterParentCat('');
              setDateFilter('ALL');
              setCatPage(1);
              setSubPage(1);
            }}
            className="btn btn-secondary"
            style={{ borderRadius: '8px', padding: '9px 14px', fontSize: '13px' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* =======================================================
          TAB 1: FULL WIDTH CATEGORIES TABLE
         ======================================================= */}
      {activeTab === 'categories' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          width: '100%',
        }}>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '14px 16px', width: '48px', textAlign: 'center' }}>#</th>
                  <th style={{ padding: '14px 16px' }}>Category & Code</th>
                  <th style={{ padding: '14px 16px' }}>Slug</th>
                  <th style={{ padding: '14px 16px' }}>Created / Updated Date</th>
                  <th style={{ padding: '14px 16px' }}>Created / Updated By</th>
                  <th style={{ padding: '14px 16px' }}>Visibility</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <ZealLoader
                    variant="table-row"
                    colSpan={7}
                    title="Loading Categories & Classifications"
                    subtitle="Synchronizing therapeutic divisions from database..."
                    size="md"
                  />
                ) : dateFilteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                      <Layers size={36} style={{ color: '#CBD5E1', margin: '0 auto 10px', display: 'block' }} />
                      No categories found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((c, idx) => (
                    <tr
                      key={c._id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FBFBFE')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Row # */}
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: '#94A3B8', fontWeight: 600, fontSize: '12px' }}>
                        {(catPage - 1) * catPageSize + idx + 1}
                      </td>

                      {/* Category & Code */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              background: '#F8FAFC',
                              border: '1.5px solid #E2E8F0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              flexShrink: 0,
                            }}
                          >
                            {c.image ? (
                              <img
                                src={galleryService.formatUrl(c.image)}
                                alt={c.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            ) : (
                              <Layers size={18} style={{ color: '#6828DC' }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13.5px' }}>{c.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                              <span style={{
                                fontSize: '11px',
                                background: '#F5F3FF',
                                color: '#6828DC',
                                padding: '1px 7px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                letterSpacing: '0.2px',
                              }}>
                                {c.productCount ?? 0} Formulations
                              </span>
                              {c.code && (
                                <span style={{
                                  fontSize: '11px',
                                  background: '#EEF2FF',
                                  color: '#4F46E5',
                                  padding: '1px 7px',
                                  borderRadius: '4px',
                                  fontWeight: 700,
                                  letterSpacing: '0.3px',
                                }}>
                                  {c.code}
                                </span>
                              )}
                              {c.shortDescription && (
                                <span style={{ fontSize: '12px', color: '#64748B', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {c.shortDescription}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td style={{ padding: '14px 16px', color: '#6828DC', fontSize: '12.5px', fontFamily: 'monospace' }}>
                        {c.slug}
                      </td>

                      {/* Created / Updated Date (ONE COLUMN, UP AND DOWN) */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} style={{ color: '#6828DC', flexShrink: 0 }} />
                            <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Created:</span>
                            <span>{formatDate(c.createdAt)}</span>
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
                            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Updated:</span>
                            <span>{c.updatedAt ? formatDate(c.updatedAt) : formatDate(c.createdAt)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Created / Updated By (ONE COLUMN, UP AND DOWN) */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#6828DC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={13} style={{ color: '#6828DC', flexShrink: 0 }} />
                            <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Created:</span>
                            <span>{getUserName(c.createdBy)}</span>
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
                            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Updated:</span>
                            <span>{c.updatedBy ? getUserName(c.updatedBy) : '-'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Visibility & Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '11px',
                            background: c.isActive !== false ? '#ECFDF5' : '#FEF2F2',
                            color: c.isActive !== false ? '#047857' : '#DC2626',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            fontWeight: 700,
                          }}>
                            {c.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                          {c.isFeatured && (
                            <span style={{ fontSize: '11px', background: '#FDF4FF', color: '#A21CAF', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>Featured</span>
                          )}
                          {c.showOnHome && (
                            <span style={{ fontSize: '11px', background: '#EFF6FF', color: '#1D4ED8', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>Home</span>
                          )}
                          {c.showInMenu && (
                            <span style={{ fontSize: '11px', background: '#F0FDF4', color: '#15803D', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>Menu</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setViewingCategory(c)}
                            title="View Category Details"
                            style={{
                              width: '32px',
                              height: '32px',
                              background: '#F5F3FF',
                              border: '1px solid #EDE9FE',
                              borderRadius: '7px',
                              color: '#6828DC',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#EDE9FE';
                              e.currentTarget.style.borderColor = '#DDD6FE';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#F5F3FF';
                              e.currentTarget.style.borderColor = '#EDE9FE';
                            }}
                          >
                            <Eye size={15} style={{ color: '#6828DC' }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(c)}
                            title="Edit Category"
                            style={{
                              width: '32px',
                              height: '32px',
                              background: '#F5F3FF',
                              border: '1px solid #EDE9FE',
                              borderRadius: '7px',
                              color: '#6828DC',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#EDE9FE';
                              e.currentTarget.style.borderColor = '#DDD6FE';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#F5F3FF';
                              e.currentTarget.style.borderColor = '#EDE9FE';
                            }}
                          >
                            <Edit2 size={14} style={{ color: '#6828DC' }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(c._id, c.name)}
                            title="Delete Category"
                            style={{
                              width: '32px',
                              height: '32px',
                              background: '#FEF2F2',
                              border: '1px solid #FEE2E2',
                              borderRadius: '7px',
                              color: '#EF4444',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#FEE2E2';
                              e.currentTarget.style.borderColor = '#FECACA';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#FEF2F2';
                              e.currentTarget.style.borderColor = '#FEE2E2';
                            }}
                          >
                            <Trash2 size={14} style={{ color: '#EF4444' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Categories Table Pagination */}
          <TablePagination
            currentPage={catPage}
            totalPages={catTotalPages}
            totalItems={dateFilteredCategories.length}
            pageSize={catPageSize}
            onPageChange={setCatPage}
            onPageSizeChange={setCatPageSize}
          />
        </div>
      )}

      {/* =======================================================
          TAB 2: FULL WIDTH SUBCATEGORIES TABLE
         ======================================================= */}
      {activeTab === 'subcategories' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          width: '100%',
        }}>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '14px 16px', width: '48px', textAlign: 'center' }}>#</th>
                  <th style={{ padding: '14px 16px' }}>SubCategory & Code</th>
                  <th style={{ padding: '14px 16px' }}>Parent Category</th>
                  <th style={{ padding: '14px 16px' }}>Slug</th>
                  <th style={{ padding: '14px 16px' }}>Created / Updated Date</th>
                  <th style={{ padding: '14px 16px' }}>Created / Updated By</th>
                  <th style={{ padding: '14px 16px' }}>Visibility</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <ZealLoader
                    variant="table-row"
                    colSpan={8}
                    title="Loading Sub-Categories & Divisions"
                    subtitle="Retrieving granular pharmaceutical segments..."
                    size="md"
                  />
                ) : dateFilteredSubCategories.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                      <Tag size={36} style={{ color: '#CBD5E1', margin: '0 auto 10px', display: 'block' }} />
                      No subcategories found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedSubCategories.map((s, idx) => {
                    const parentName = typeof s.category === 'object' && s.category !== null
                      ? s.category.name
                      : categories.find(c => c._id === s.category)?.name || 'Unknown';

                    return (
                      <tr
                        key={s._id}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FBFBFE')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Row # */}
                        <td style={{ padding: '14px 16px', textAlign: 'center', color: '#94A3B8', fontWeight: 600, fontSize: '12px' }}>
                          {(subPage - 1) * subPageSize + idx + 1}
                        </td>

                        {/* SubCategory & Code */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '8px',
                                background: '#F8FAFC',
                                border: '1.5px solid #E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                flexShrink: 0,
                              }}
                            >
                              {s.image ? (
                                <img
                                  src={galleryService.formatUrl(s.image)}
                                  alt={s.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                              ) : (
                                <Tag size={18} style={{ color: '#6828DC' }} />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13.5px' }}>{s.name}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                                {s.code && (
                                  <span style={{
                                    fontSize: '11px',
                                    background: '#EEF2FF',
                                    color: '#4F46E5',
                                    padding: '1px 7px',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    letterSpacing: '0.3px',
                                  }}>
                                    {s.code}
                                  </span>
                                )}
                                {s.shortDescription && (
                                  <span style={{ fontSize: '12px', color: '#64748B', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {s.shortDescription}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Parent Category Badge */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontSize: '12px',
                            background: '#F1F5F9',
                            color: '#334155',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            display: 'inline-block',
                          }}>
                            {parentName}
                          </span>
                        </td>

                        {/* Slug */}
                        <td style={{ padding: '14px 16px', color: '#6828DC', fontSize: '12.5px', fontFamily: 'monospace' }}>
                          {s.slug}
                        </td>

                        {/* Created / Updated Date (ONE COLUMN, UP AND DOWN) */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={13} style={{ color: '#6828DC', flexShrink: 0 }} />
                              <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Created:</span>
                              <span>{formatDate(s.createdAt)}</span>
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
                              <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Updated:</span>
                              <span>{s.updatedAt ? formatDate(s.updatedAt) : formatDate(s.createdAt)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Created / Updated By (ONE COLUMN, UP AND DOWN) */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6828DC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <User size={13} style={{ color: '#6828DC', flexShrink: 0 }} />
                              <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Created:</span>
                              <span>{getUserName(s.createdBy)}</span>
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <User size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
                              <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Updated:</span>
                              <span>{s.updatedBy ? getUserName(s.updatedBy) : '-'}</span>
                            </div>
                          </div>
                        </td>

                        {/* Visibility & Status */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{
                              fontSize: '11px',
                              background: s.isActive !== false ? '#ECFDF5' : '#FEF2F2',
                              color: s.isActive !== false ? '#047857' : '#DC2626',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontWeight: 700,
                            }}>
                              {s.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                            {s.isFeatured && (
                              <span style={{ fontSize: '11px', background: '#FDF4FF', color: '#A21CAF', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>Featured</span>
                            )}
                            {s.showOnHome && (
                              <span style={{ fontSize: '11px', background: '#EFF6FF', color: '#1D4ED8', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>Home</span>
                            )}
                            {s.showInMenu && (
                              <span style={{ fontSize: '11px', background: '#F0FDF4', color: '#15803D', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>Menu</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setViewingSubCategory(s)}
                              title="View SubCategory Details"
                              style={{
                                width: '32px',
                                height: '32px',
                                background: '#F5F3FF',
                                border: '1px solid #EDE9FE',
                                borderRadius: '7px',
                                color: '#6828DC',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#EDE9FE';
                                e.currentTarget.style.borderColor = '#DDD6FE';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#F5F3FF';
                                e.currentTarget.style.borderColor = '#EDE9FE';
                              }}
                            >
                              <Eye size={15} style={{ color: '#6828DC' }} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditSubCategory(s)}
                              title="Edit SubCategory"
                              style={{
                                width: '32px',
                                height: '32px',
                                background: '#F5F3FF',
                                border: '1px solid #EDE9FE',
                                borderRadius: '7px',
                                color: '#6828DC',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#EDE9FE';
                                e.currentTarget.style.borderColor = '#DDD6FE';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#F5F3FF';
                                e.currentTarget.style.borderColor = '#EDE9FE';
                              }}
                            >
                              <Edit2 size={14} style={{ color: '#6828DC' }} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubCategory(s._id, s.name)}
                              title="Delete SubCategory"
                              style={{
                                width: '32px',
                                height: '32px',
                                background: '#FEF2F2',
                                border: '1px solid #FEE2E2',
                                borderRadius: '7px',
                                color: '#EF4444',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#FEE2E2';
                                e.currentTarget.style.borderColor = '#FECACA';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#FEF2F2';
                                e.currentTarget.style.borderColor = '#FEE2E2';
                              }}
                            >
                              <Trash2 size={14} style={{ color: '#EF4444' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* SubCategories Table Pagination */}
          <TablePagination
            currentPage={subPage}
            totalPages={subTotalPages}
            totalItems={dateFilteredSubCategories.length}
            pageSize={subPageSize}
            onPageChange={setSubPage}
            onPageSizeChange={setSubPageSize}
          />
        </div>
      )}

      {/* =======================================================
          MODAL 1: ADD / EDIT CATEGORY (ADVANCED MODERN DESIGN)
         ======================================================= */}
      {isCategoryModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px -15px rgba(104, 40, 220, 0.28), 0 10px 25px -5px rgba(0,0,0,0.1)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 26px',
                borderBottom: '1.5px solid #E9D5FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 60%, #DDD6FE 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  <Layers size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                    {editingCategory ? 'Edit Therapeutic Category' : 'Create Therapeutic Category'}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#6828DC', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{editingCategory ? `Segment: ${editingCategory.name}` : 'WHO-GMP Therapeutic Classification'}</span>
                    {editingCategory?.code && (
                      <span style={{ background: '#EDE9FE', color: '#6828DC', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>
                        {editingCategory.code}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DDD6FE',
                  color: '#64748B',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FEE2E2';
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.borderColor = '#FECACA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.borderColor = '#DDD6FE';
                }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveCategory} noValidate style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                {/* 1. Category Name & Code */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Category Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Antibiotics & Anti-Infectives"
                      value={categoryForm.name}
                      onChange={(e) => {
                        setCategoryForm((prev) => ({ ...prev, name: e.target.value }));
                        setCatNameError('');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '9px',
                        border: catNameError ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                        boxShadow: catNameError ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onFocus={(e) => {
                        if (!catNameError) {
                          e.target.style.borderColor = '#6828DC';
                          e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
                        }
                      }}
                      onBlur={(e) => {
                        if (!catNameError) {
                          e.target.style.borderColor = '#CBD5E1';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    />
                    {catNameError && (
                      <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                        {catNameError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Category Code / SKU
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ANTIBIOTIC-ADV"
                      value={categoryForm.code}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '9px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: '#6828DC',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6828DC';
                        e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#CBD5E1';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* 2. Sort Order & Short Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Sort Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={categoryForm.sortOrder}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '9px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Short Summary / Overview
                    </label>
                    <input
                      type="text"
                      placeholder="Brief punchy 1-line segment summary for visual aids and catalog..."
                      value={categoryForm.shortDescription}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '9px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Full Description */}
                <div>
                  <ThemeQuillEditor
                    label={<span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>Clinical Description / Portfolio Details</span>}
                    toolbarPreset="standard"
                    placeholder="Enter comprehensive therapeutic segment details, medical scope, and indications..."
                    value={categoryForm.description}
                    onChange={(val) => setCategoryForm((prev) => ({ ...prev, description: val }))}
                    minHeight="105px"
                  />
                </div>

                {/* 3. Media Assets: Thumbnail & Hero Banner */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={16} style={{ color: '#6828DC' }} />
                    <span>Visual Media & Packshot Branding</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <GalleryImagePicker
                      label="Category Thumbnail (Square)"
                      value={categoryForm.image}
                      onChange={(url) => setCategoryForm((prev) => ({ ...prev, image: url }))}
                      onOpenGallery={() => openGalleryFor('category', 'image', 'Select Category Thumbnail', 'PRODUCT')}
                      aspect="square"
                    />
                    <GalleryImagePicker
                      label="Hero Banner Image (Wide)"
                      value={categoryForm.bannerImage}
                      onChange={(url) => setCategoryForm((prev) => ({ ...prev, bannerImage: url }))}
                      onOpenGallery={() => openGalleryFor('category', 'bannerImage', 'Select Category Banner', 'BANNER')}
                      aspect="banner"
                    />
                  </div>
                </div>

                {/* 4. Interactive Visibility Switch Cards */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} style={{ color: '#6828DC' }} />
                    <span>Portal Visibility & Status Flags</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {/* Active Switch Card */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: categoryForm.isActive ? '1.5px solid #10B981' : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Active Status</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Live in catalog</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={categoryForm.isActive}
                        onChange={(e) => setCategoryForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer' }}
                      />
                    </label>

                    {/* Featured Switch Card */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: categoryForm.isFeatured ? '1.5px solid #8B5CF6' : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Featured Segment</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Highlight in lists</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={categoryForm.isFeatured}
                        onChange={(e) => setCategoryForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#6828DC', cursor: 'pointer' }}
                      />
                    </label>

                    {/* Show on Home */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: categoryForm.showOnHome ? '1.5px solid #8B5CF6' : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Show on Homepage</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Landing showcase</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={categoryForm.showOnHome}
                        onChange={(e) => setCategoryForm((prev) => ({ ...prev, showOnHome: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#6828DC', cursor: 'pointer' }}
                      />
                    </label>

                    {/* Show in Menu */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: categoryForm.showInMenu ? '1.5px solid #7C3AED' : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Top Navigation Menu</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Header dropdown</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={categoryForm.showInMenu}
                        onChange={(e) => setCategoryForm((prev) => ({ ...prev, showInMenu: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#6828DC', cursor: 'pointer' }}
                      />
                    </label>
                  </div>
                </div>

                {/* 5. SEO Accordion */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCatSeo(!showCatSeo)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6828DC',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: 0,
                    }}
                  >
                    <Globe size={15} />
                    <span>{showCatSeo ? 'âˆ’ Hide SEO Settings' : '+ Configure Search Engine (SEO) Meta Tags'}</span>
                  </button>

                  {showCatSeo && (
                    <div style={{ marginTop: '12px', padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Meta Title"
                        value={categoryForm.seo.metaTitle}
                        onChange={(e) => setCategoryForm((prev) => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }))}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px', boxSizing: 'border-box' }}
                      />
                      <textarea
                        rows={2}
                        placeholder="Meta Description"
                        value={categoryForm.seo.metaDescription}
                        onChange={(e) => setCategoryForm((prev) => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px', resize: 'vertical', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '16px 26px',
                  borderTop: '1.5px solid #E2E8F0',
                  background: '#F8FAFC',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
                  }}
                >
                  <Check size={16} />
                  <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL 2: ADD / EDIT SUBCATEGORY (ADVANCED MODERN DESIGN)
         ======================================================= */}
      {isSubCategoryModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => { setIsSubCategoryModalOpen(false); setEditingSubCategory(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px -15px rgba(104, 40, 220, 0.28), 0 10px 25px -5px rgba(0,0,0,0.1)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 26px',
                borderBottom: '1.5px solid #E9D5FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 60%, #DDD6FE 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  <Tag size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                    {editingSubCategory ? 'Edit SubCategory / Division' : 'Create SubCategory / Division'}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#6828DC', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{editingSubCategory ? `Division: ${editingSubCategory.name}` : 'Specialized division under parent category'}</span>
                    {editingSubCategory?.code && (
                      <span style={{ background: '#EDE9FE', color: '#6828DC', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>
                        {editingSubCategory.code}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setIsSubCategoryModalOpen(false); setEditingSubCategory(null); }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DDD6FE',
                  color: '#64748B',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FEE2E2';
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.borderColor = '#FECACA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.borderColor = '#DDD6FE';
                }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveSubCategory} noValidate style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                {/* Parent Category Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Parent Therapeutic Category <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <CustomThemeSelect
                    value={subCategoryForm.category}
                    onChange={(val) => setSubCategoryForm((prev) => ({ ...prev, category: val }))}
                    placeholder="Select parent category..."
                    options={categories.map((c) => ({
                      value: c._id,
                      label: c.name,
                    }))}
                    icon={<Layers size={15} style={{ color: '#6828DC' }} />}
                    style={{ width: '100%' }}
                    searchable={categories.length > 5}
                  />
                </div>

                {/* SubCategory Name & Division Code */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      SubCategory / Division Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dermatology & Cosmetology"
                      value={subCategoryForm.name}
                      onChange={(e) => {
                        setSubCategoryForm((prev) => ({ ...prev, name: e.target.value }));
                        setSubCatNameError('');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '9px',
                        border: subCatNameError ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                        boxShadow: subCatNameError ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onFocus={(e) => {
                        if (!subCatNameError) {
                          e.target.style.borderColor = '#6828DC';
                          e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.15)';
                        }
                      }}
                      onBlur={(e) => {
                        if (!subCatNameError) {
                          e.target.style.borderColor = '#CBD5E1';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    />
                    {subCatNameError && (
                      <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                        {subCatNameError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Division Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DERMA-DIV"
                      value={subCategoryForm.code}
                      onChange={(e) => setSubCategoryForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '9px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: '#6828DC',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6828DC';
                        e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#CBD5E1';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Sort Order & Short Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Sort Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subCategoryForm.sortOrder}
                      onChange={(e) => setSubCategoryForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '9px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Short Summary / Overview
                    </label>
                    <input
                      type="text"
                      placeholder="Brief division overview..."
                      value={subCategoryForm.shortDescription}
                      onChange={(e) => setSubCategoryForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '9px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Full Description */}
                <div>
                  <ThemeQuillEditor
                    label={<span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>Portfolio Scope &amp; Details</span>}
                    toolbarPreset="standard"
                    placeholder="Detailed division portfolio and focus areas..."
                    value={subCategoryForm.description}
                    onChange={(val) => setSubCategoryForm((prev) => ({ ...prev, description: val }))}
                    minHeight="105px"
                  />
                </div>

                {/* Media Assets: Thumbnail & Banner */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={16} style={{ color: '#6828DC' }} />
                    <span>Visual Media & Division Assets</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <GalleryImagePicker
                      label="Thumbnail Image"
                      value={subCategoryForm.image}
                      onChange={(url) => setSubCategoryForm((prev) => ({ ...prev, image: url }))}
                      onOpenGallery={() => openGalleryFor('subcategory', 'image', 'Select SubCategory Thumbnail', 'PRODUCT')}
                      aspect="square"
                    />
                    <GalleryImagePicker
                      label="Hero Banner Image"
                      value={subCategoryForm.bannerImage}
                      onChange={(url) => setSubCategoryForm((prev) => ({ ...prev, bannerImage: url }))}
                      onOpenGallery={() => openGalleryFor('subcategory', 'bannerImage', 'Select SubCategory Banner', 'BANNER')}
                      aspect="banner"
                    />
                  </div>
                </div>

                {/* Visibility Switch Cards */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} style={{ color: '#6828DC' }} />
                    <span>Visibility & Portal Status</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: subCategoryForm.isActive ? '1.5px solid #10B981' : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Active Status</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Live in catalog</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={subCategoryForm.isActive}
                        onChange={(e) => setSubCategoryForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: subCategoryForm.isFeatured ? '1.5px solid #8B5CF6' : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Featured Division</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Highlight in lists</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={subCategoryForm.isFeatured}
                        onChange={(e) => setSubCategoryForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#6828DC', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: subCategoryForm.showOnHome ? '1.5px solid #8B5CF6' : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Show on Homepage</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Homepage section</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={subCategoryForm.showOnHome}
                        onChange={(e) => setSubCategoryForm((prev) => ({ ...prev, showOnHome: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#6828DC', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: subCategoryForm.showInMenu ? '1.5px solid #7C3AED' : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Show in Menu</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Header dropdown</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={subCategoryForm.showInMenu}
                        onChange={(e) => setSubCategoryForm((prev) => ({ ...prev, showInMenu: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#6828DC', cursor: 'pointer' }}
                      />
                    </label>
                  </div>
                </div>

                {/* SEO Accordion */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowSubSeo(!showSubSeo)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6828DC',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: 0,
                    }}
                  >
                    <Globe size={15} />
                    <span>{showSubSeo ? 'âˆ’ Hide SEO Settings' : '+ Configure Search Engine (SEO) Meta Tags'}</span>
                  </button>

                  {showSubSeo && (
                    <div style={{ marginTop: '12px', padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Meta Title"
                        value={subCategoryForm.seo.metaTitle}
                        onChange={(e) => setSubCategoryForm((prev) => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }))}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px', boxSizing: 'border-box' }}
                      />
                      <textarea
                        rows={2}
                        placeholder="Meta Description"
                        value={subCategoryForm.seo.metaDescription}
                        onChange={(e) => setSubCategoryForm((prev) => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px', resize: 'vertical', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '16px 26px',
                  borderTop: '1.5px solid #E2E8F0',
                  background: '#F8FAFC',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={() => { setIsSubCategoryModalOpen(false); setEditingSubCategory(null); }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
                  }}
                >
                  <Check size={16} />
                  <span>{editingSubCategory ? 'Update SubCategory' : 'Create SubCategory'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL 3: VIEW CATEGORY DETAILS (ADVANCED MODERN DESIGN)
         ======================================================= */}
      {viewingCategory && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setViewingCategory(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '740px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px -12px rgba(104, 40, 220, 0.3)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              overflow: 'hidden',
            }}
          >
            {/* Top Stage: Banner Image with Overlapping Avatar */}
            <div
              style={{
                position: 'relative',
                height: '160px',
                background: viewingCategory.bannerImage
                  ? `linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%), url("${viewingCategory.bannerImage}") center/cover no-repeat`
                  : 'linear-gradient(135deg, #4C1D95 0%, #6828DC 50%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '0 24px',
              }}
            >
              {/* Floating Close Button */}
              <button
                type="button"
                onClick={() => setViewingCategory(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
              >
                <X size={17} />
              </button>

              {/* Floating Thumbnail Overlapping Banner */}
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '16px',
                  border: '4px solid #FFFFFF',
                  background: '#FFFFFF',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translateY(28px)',
                  zIndex: 3,
                  flexShrink: 0,
                }}
              >
                {viewingCategory.image ? (
                  <img
                    src={viewingCategory.image}
                    alt={viewingCategory.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6828DC' }}>
                    <Layers size={32} />
                  </div>
                )}
              </div>
            </div>

            {/* Header Content Below Banner */}
            <div style={{ padding: '34px 26px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em' }}>
                    {viewingCategory.name}
                  </h3>
                  {viewingCategory.code && (
                    <span style={{ background: '#EDE9FE', border: '1px solid #DDD6FE', color: '#6828DC', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                      {viewingCategory.code}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                  Therapeutic Classification Portfolio
                </div>
              </div>

              {/* Status Badges */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11.5px',
                  background: viewingCategory.isActive !== false ? '#ECFDF5' : '#FEF2F2',
                  border: viewingCategory.isActive !== false ? '1px solid #A7F3D0' : '1px solid #FECACA',
                  color: viewingCategory.isActive !== false ? '#047857' : '#DC2626',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: viewingCategory.isActive !== false ? '#10B981' : '#EF4444' }} />
                  {viewingCategory.isActive !== false ? 'Active' : 'Inactive'}
                </span>
                {viewingCategory.isFeatured && (
                  <span style={{ fontSize: '11.5px', background: '#FAF5FF', border: '1px solid #E9D5FF', color: '#6828DC', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                    â˜… Featured
                  </span>
                )}
                {viewingCategory.showOnHome && (
                  <span style={{ fontSize: '11.5px', background: '#FAF5FF', border: '1px solid #DDD6FE', color: '#6828DC', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                    Homepage
                  </span>
                )}
                {viewingCategory.showInMenu && (
                  <span style={{ fontSize: '11.5px', background: '#F5F3FF', border: '1px solid #EDE9FE', color: '#7C3AED', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                    Menu
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Details Body */}
            <div style={{ padding: '20px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
              {/* 3 Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subcategories</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#6828DC', marginTop: '3px' }}>
                    {subCategories.filter((s) => (typeof s.category === 'object' ? s.category?._id : s.category) === viewingCategory._id).length} Divisions
                  </div>
                </div>

                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Display Order</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', marginTop: '3px' }}>
                    #{viewingCategory.sortOrder ?? 0}
                  </div>
                </div>

                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Slug URL</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#6828DC', marginTop: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                    {viewingCategory.slug || '-'}
                  </div>
                </div>
              </div>

              {/* Short & Full Description */}
              {(viewingCategory.shortDescription || viewingCategory.description) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {viewingCategory.shortDescription && (
                    <div style={{ padding: '14px 16px', background: '#FAF5FF', borderRadius: '10px', borderLeft: '4px solid #6828DC', border: '1px solid #EDE9FE', borderLeftWidth: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#6828DC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overview</span>
                      <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#1E293B', lineHeight: 1.5, fontWeight: 500 }}>
                        {viewingCategory.shortDescription}
                      </p>
                    </div>
                  )}

                  {viewingCategory.description && (
                    <div style={{ padding: '14px 16px', background: '#FFFFFF', borderRadius: '10px', border: '1.5px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detailed Specifications</span>
                      <div
                        style={{ margin: '6px 0 0', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}
                        dangerouslySetInnerHTML={{ __html: viewingCategory.description }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Associated Subcategories Chips */}
              {(() => {
                const childSubs = subCategories.filter(
                  (s) => (typeof s.category === 'object' ? s.category?._id : s.category) === viewingCategory._id
                );
                return childSubs.length > 0 ? (
                  <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={15} style={{ color: '#0284C7' }} />
                      <span>Associated Divisions & SubCategories ({childSubs.length})</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {childSubs.map((sub) => (
                        <span
                          key={sub._id}
                          style={{
                            fontSize: '12px',
                            background: '#FFFFFF',
                            border: '1.5px solid #CBD5E1',
                            color: '#1E293B',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284C7' }} />
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Audit Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} style={{ color: '#6828DC' }} />
                    <span>Created By</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} style={{ color: '#6828DC' }} />
                    <span>{getUserName(viewingCategory.createdBy)}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {formatDate(viewingCategory.createdAt)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} style={{ color: '#94A3B8' }} />
                    <span>Last Updated By</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} style={{ color: '#94A3B8' }} />
                    <span>{viewingCategory.updatedBy ? getUserName(viewingCategory.updatedBy) : '-'}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {viewingCategory.updatedAt ? formatDate(viewingCategory.updatedAt) : formatDate(viewingCategory.createdAt)}
                  </div>
                </div>
              </div>

              {/* SEO Meta Box */}
              {(viewingCategory.seo?.metaTitle || viewingCategory.seo?.metaDescription) && (
                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={14} style={{ color: '#6828DC' }} />
                    <span>SEO Meta Information</span>
                  </div>
                  {viewingCategory.seo?.metaTitle && (
                    <div style={{ fontSize: '12.5px', color: '#1E293B' }}>
                      <strong>Meta Title:</strong> {viewingCategory.seo.metaTitle}
                    </div>
                  )}
                  {viewingCategory.seo?.metaDescription && (
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      <strong>Meta Description:</strong> {viewingCategory.seo.metaDescription}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '16px 26px',
                borderTop: '1.5px solid #E2E8F0',
                background: '#F8FAFC',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                type="button"
                onClick={() => setViewingCategory(null)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingCategory;
                  setViewingCategory(null);
                  handleOpenEditCategory(toEdit);
                }}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
                }}
              >
                <Edit2 size={14} />
                <span>Edit Category</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL 4: VIEW SUBCATEGORY DETAILS (ADVANCED MODERN DESIGN)
         ======================================================= */}
      {viewingSubCategory && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setViewingSubCategory(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '740px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px -12px rgba(104, 40, 220, 0.3)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              overflow: 'hidden',
            }}
          >
            {/* Top Stage: Banner Image with Overlapping Avatar */}
            <div
              style={{
                position: 'relative',
                height: '160px',
                background: viewingSubCategory.bannerImage
                  ? `linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%), url("${viewingSubCategory.bannerImage}") center/cover no-repeat`
                  : 'linear-gradient(135deg, #4C1D95 0%, #6828DC 50%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '0 24px',
              }}
            >
              <button
                type="button"
                onClick={() => setViewingSubCategory(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
              >
                <X size={17} />
              </button>

              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '16px',
                  border: '4px solid #FFFFFF',
                  background: '#FFFFFF',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translateY(28px)',
                  zIndex: 3,
                  flexShrink: 0,
                }}
              >
                {viewingSubCategory.image ? (
                  <img
                    src={viewingSubCategory.image}
                    alt={viewingSubCategory.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6828DC' }}>
                    <Tag size={32} />
                  </div>
                )}
              </div>
            </div>

            {/* Header Content Below Banner */}
            <div style={{ padding: '34px 26px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em' }}>
                    {viewingSubCategory.name}
                  </h3>
                  {viewingSubCategory.code && (
                    <span style={{ background: '#EDE9FE', border: '1px solid #DDD6FE', color: '#6828DC', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                      {viewingSubCategory.code}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Division under Parent:</span>
                  <span style={{ color: '#6828DC', fontWeight: 700 }}>
                    {getCategoryName(viewingSubCategory.category)}
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11.5px',
                  background: viewingSubCategory.isActive !== false ? '#ECFDF5' : '#FEF2F2',
                  border: viewingSubCategory.isActive !== false ? '1px solid #A7F3D0' : '1px solid #FECACA',
                  color: viewingSubCategory.isActive !== false ? '#047857' : '#DC2626',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: viewingSubCategory.isActive !== false ? '#10B981' : '#EF4444' }} />
                  {viewingSubCategory.isActive !== false ? 'Active' : 'Inactive'}
                </span>
                {viewingSubCategory.isFeatured && (
                  <span style={{ fontSize: '11.5px', background: '#FAF5FF', border: '1px solid #E9D5FF', color: '#6828DC', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                    â˜… Featured
                  </span>
                )}
                {viewingSubCategory.showOnHome && (
                  <span style={{ fontSize: '11.5px', background: '#FAF5FF', border: '1px solid #DDD6FE', color: '#6828DC', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                    Homepage
                  </span>
                )}
                {viewingSubCategory.showInMenu && (
                  <span style={{ fontSize: '11.5px', background: '#F5F3FF', border: '1px solid #EDE9FE', color: '#7C3AED', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                    Menu
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Details Body */}
            <div style={{ padding: '20px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
              {/* 3 Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Parent Category</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#6828DC', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {getCategoryName(viewingSubCategory.category)}
                  </div>
                </div>

                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Display Order</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', marginTop: '3px' }}>
                    #{viewingSubCategory.sortOrder ?? 0}
                  </div>
                </div>

                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Slug URL</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#6828DC', marginTop: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                    {viewingSubCategory.slug || '-'}
                  </div>
                </div>
              </div>

              {/* Short & Full Description */}
              {(viewingSubCategory.shortDescription || viewingSubCategory.description) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {viewingSubCategory.shortDescription && (
                    <div style={{ padding: '14px 16px', background: '#FAF5FF', borderRadius: '10px', borderLeft: '4px solid #6828DC', border: '1px solid #EDE9FE', borderLeftWidth: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#6828DC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overview</span>
                      <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#1E293B', lineHeight: 1.5, fontWeight: 500 }}>
                        {viewingSubCategory.shortDescription}
                      </p>
                    </div>
                  )}

                  {viewingSubCategory.description && (
                    <div style={{ padding: '14px 16px', background: '#FFFFFF', borderRadius: '10px', border: '1.5px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detailed Specifications</span>
                      <div
                        style={{ margin: '6px 0 0', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}
                        dangerouslySetInnerHTML={{ __html: viewingSubCategory.description }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Audit Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} style={{ color: '#6828DC' }} />
                    <span>Created By</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} style={{ color: '#6828DC' }} />
                    <span>{getUserName(viewingSubCategory.createdBy)}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {formatDate(viewingSubCategory.createdAt)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} style={{ color: '#94A3B8' }} />
                    <span>Last Updated By</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} style={{ color: '#94A3B8' }} />
                    <span>{viewingSubCategory.updatedBy ? getUserName(viewingSubCategory.updatedBy) : '-'}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {viewingSubCategory.updatedAt ? formatDate(viewingSubCategory.updatedAt) : formatDate(viewingSubCategory.createdAt)}
                  </div>
                </div>
              </div>

              {/* SEO Meta Box */}
              {(viewingSubCategory.seo?.metaTitle || viewingSubCategory.seo?.metaDescription) && (
                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={14} style={{ color: '#6828DC' }} />
                    <span>SEO Meta Information</span>
                  </div>
                  {viewingSubCategory.seo?.metaTitle && (
                    <div style={{ fontSize: '12.5px', color: '#1E293B' }}>
                      <strong>Meta Title:</strong> {viewingSubCategory.seo.metaTitle}
                    </div>
                  )}
                  {viewingSubCategory.seo?.metaDescription && (
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      <strong>Meta Description:</strong> {viewingSubCategory.seo.metaDescription}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '16px 26px',
                borderTop: '1.5px solid #E2E8F0',
                background: '#F8FAFC',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                type="button"
                onClick={() => setViewingSubCategory(null)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingSubCategory;
                  setViewingSubCategory(null);
                  handleOpenEditSubCategory(toEdit);
                }}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
                }}
              >
                <Edit2 size={14} />
                <span>Edit SubCategory</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Gallery Modal */}
      {galleryModalOpen && galleryTarget && (
        <MediaGalleryModal
          isOpen={galleryModalOpen}
          onClose={() => {
            setGalleryModalOpen(false);
            setGalleryTarget(null);
          }}
          onSelect={handleSelectFromGallery}
          title={galleryTarget.title}
          defaultTag={galleryTarget.tag}
        />
      )}
    </div>
  );
};


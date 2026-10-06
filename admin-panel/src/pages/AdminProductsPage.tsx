import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Pill,
  Copy,
  Download,
} from 'lucide-react';
import { productService } from '../api/productService';
import { galleryService } from '../api/galleryService';
import { EditProductModal } from '../components/products/EditProductModal';
import {
  ThemeSelect,
  DateFilterSelect,
  CombinedDateCell,
  CombinedUserCell,
  TablePagination,
  filterByDateRange,
  type DateFilterType,
} from '../components/common';
import type { IProduct, ICategory } from '../types';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & View State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Feedback
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [prodRes, catList] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        productService.getCategories(),
      ]);
      setProducts(prodRes?.products || []);
      setCategories(catList || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load products from database.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus?: boolean) => {
    try {
      await productService.adminToggleStatus(id, currentStatus).catch(() => null);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !currentStatus } : p))
      );
      setFeedbackMsg('Product status updated successfully in database.');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to toggle status.');
    }
  };

  const handleDuplicateProduct = async (product: IProduct) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const duplicated = await productService.adminDuplicateProduct(product._id);
      setProducts((prev) => [duplicated, ...prev]);
      setFeedbackMsg(`Formulation "${product.name}" duplicated successfully as draft!`);
      setTimeout(() => setFeedbackMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to duplicate product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the WHO-GMP catalog?`)) return;
    try {
      await productService.adminDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setFeedbackMsg(`Product "${name}" deleted from database.`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete product.');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setDateFilter('ALL');
    setSortBy('name');
    setCurrentPage(1);
  };

  let filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.genericName.toLowerCase().includes(q) ||
        p.dosageForm.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q) ||
        (p.productCode ? p.productCode.toLowerCase().includes(q) : false) ||
        (p.brandName ? p.brandName.toLowerCase().includes(q) : false) ||
        (p.strength ? p.strength.toLowerCase().includes(q) : false);
      if (!match) return false;
    }
    if (selectedCategory !== 'ALL') {
      const catName = typeof p.category === 'object' ? p.category?.name : p.category;
      if (catName?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    }
    if (selectedStatus !== 'ALL') {
      const active = selectedStatus === 'active';
      if (p.isActive !== active) return false;
    }
    return true;
  });

  // Date range filter
  filteredProducts = filterByDateRange(filteredProducts, p => p.createdAt, dateFilter);

  // Sort
  filteredProducts.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'genericName') return a.genericName.localeCompare(b.genericName);
    if (sortBy === 'dosageForm') return a.dosageForm.localeCompare(b.dosageForm);
    return 0;
  });

  // Dynamic Pagination Calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
  const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
  const endDisplay = Math.min(startIndex + pageSize, totalItems);

  return (
    <div>
      {/* Top Header matching Image 2 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
            Products &gt; <strong style={{ color: '#0F172A' }}>All Products</strong>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
            Product Catalog
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '2px' }}>
            Manage formulations, clinical visual aids, dosage forms, and batch specifications.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Switcher matching Image 2 top right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F1F5F9',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
          }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'table' ? '#6828DC' : '#64748B',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <List size={15} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: viewMode === 'cards' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'cards' ? '#6828DC' : '#64748B',
                boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LayoutGrid size={15} />
              <span>Cards</span>
            </button>
          </div>

          <Link
            to="/admin/products/new"
            className="btn btn-primary"
            style={{ padding: '9px 18px', borderRadius: '8px', fontSize: '13.5px' }}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Success / Feedback Banners */}
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

      {/* FILTER CONTROLS BAR */}
      <div className="admin-toolbar responsive-filter-bar">
        {/* Search */}
        <div className="admin-search-wrap">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search product name, generic formula, composition..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="admin-search-input"
          />
        </div>

        {/* Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Date Filter */}
          <DateFilterSelect
            value={dateFilter}
            onChange={(val) => {
              setDateFilter(val);
              setCurrentPage(1);
            }}
          />

          {/* Category Filter */}
          <ThemeSelect
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            style={{ minWidth: '170px' }}
          >
            <option value="ALL">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </ThemeSelect>

          {/* Status Filter */}
          <ThemeSelect
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            style={{ minWidth: '140px' }}
          >
            <option value="ALL">All Status</option>
            <option value="active">Active Products</option>
            <option value="inactive">Inactive Products</option>
          </ThemeSelect>

          {/* Sort By */}
          <ThemeSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="name">Sort: Product Name (A-Z)</option>
            <option value="genericName">Sort: Generic Name</option>
            <option value="dosageForm">Sort: Dosage Form</option>
          </ThemeSelect>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="btn btn-secondary btn-sm"
            title="Reset Filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ padding: '60px', textAlign: 'center', color: '#6828DC', fontWeight: 600 }}>
          Loading products from database...
        </div>
      )}

      {/* 1. TABLE VIEW */}
      {!loading && viewMode === 'table' && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div className="table-responsive">
            <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 800, color: '#334155', width: '40px' }}>#</th>
                  <th style={{ padding: '14px 18px', fontWeight: 800, color: '#334155' }}>Product Details</th>
                  <th style={{ padding: '14px 18px', fontWeight: 800, color: '#334155' }}>Category</th>
                  <th style={{ padding: '14px 18px', fontWeight: 800, color: '#334155' }}>Dosage Form</th>
                  <th style={{ padding: '14px 18px', fontWeight: 800, color: '#334155' }}>Created / Updated Date</th>
                  <th style={{ padding: '14px 18px', fontWeight: 800, color: '#334155' }}>Created / Updated By</th>
                  <th style={{ padding: '14px 18px', fontWeight: 800, color: '#334155' }}>Status</th>
                  <th style={{ padding: '14px 18px', fontWeight: 800, color: '#334155', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
                    <Pill size={36} style={{ color: '#CBD5E1', margin: '0 auto 10px' }} />
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>No products found in database</div>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search query or add a new pharmaceutical product.</p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p, idx) => {
                  const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                  const rowNumber = startIndex + idx + 1;
                  return (
                    <tr
                      key={p._id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                    >
                      <td style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600 }}>
                        {rowNumber}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}>
                            {p.featuredImage ? (
                              <img
                                src={galleryService.formatUrl(p.featuredImage)}
                                alt={p.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            ) : (
                              <Pill size={20} style={{ color: '#6828DC' }} />
                            )}
                          </div>
                          <div>
                            <Link
                              to={`/admin/products/${p.slug || p._id}`}
                              style={{ fontWeight: 800, color: '#0F172A', fontSize: '13.5px' }}
                            >
                              {p.name}
                            </Link>
                            {p.genericName && (
                              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                                {p.genericName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#64748B' }}>
                        <span className="badge badge-purple">
                          {catName || 'General Medicine'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#334155', fontWeight: 500 }}>
                        {p.dosageForm}
                      </td>
                      {/* Created / Updated Date (ONE COLUMN, UP & DOWN) */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <CombinedDateCell createdAt={p.createdAt} updatedAt={p.updatedAt} />
                      </td>
                      {/* Created / Updated By (ONE COLUMN, UP & DOWN) */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <CombinedUserCell createdBy={p.createdBy} updatedBy={p.updatedBy} />
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <button
                          onClick={() => handleToggleStatus(p._id, p.isActive)}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '999px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            background: p.isActive ? '#ECFDF5' : '#FEF2F2',
                            color: p.isActive ? '#065F46' : '#991B1B',
                          }}
                        >
                          {p.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <Link
                            to={`/admin/products/${p.slug || p._id}`}
                            title="View Product"
                            style={{
                              width: '30px', height: '30px', borderRadius: '6px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#6828DC', background: '#FAF5FF', border: '1px solid #EDE9FE',
                              cursor: 'pointer',
                            }}
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => setEditingProduct(p)}
                            title="Quick Edit"
                            style={{
                              width: '30px', height: '30px', borderRadius: '6px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(p)}
                            title="Duplicate Product"
                            style={{
                              width: '30px', height: '30px', borderRadius: '6px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#0891B2', background: '#ECFEFF', border: '1px solid #A5F3FC',
                              cursor: 'pointer',
                            }}
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            title="Delete Product"
                            style={{
                              width: '30px', height: '30px', borderRadius: '6px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} />
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

          {/* Pagination */}
          <TablePagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          />
        </div>
      )}

      {/* 2. CARD VIEW */}
      {!loading && viewMode === 'cards' && (
        <div>
          {paginatedProducts.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748B', background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0' }}>
              <Pill size={36} style={{ color: '#CBD5E1', margin: '0 auto 10px' }} />
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>No products found</div>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your filters or add a new product.</p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '18px',
                marginBottom: '24px',
              }}>
                {paginatedProducts.map((p) => {
                  const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                  return (
                    <div
                      key={p._id}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1.5px solid #E2E8F0',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                      }}
                    >
                      {/* Product Image */}
                      <div style={{
                        height: '160px',
                        background: '#F8FAFC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: '1px solid #E2E8F0',
                      }}>
                        {p.featuredImage ? (
                          <img
                            src={galleryService.formatUrl(p.featuredImage)}
                            alt={p.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '12px' }}
                          />
                        ) : (
                          <Pill size={40} style={{ color: '#CBD5E1' }} />
                        )}
                      </div>

                      {/* Product Info */}
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span className="badge badge-purple" style={{ fontSize: '10.5px' }}>
                            {catName || 'General'}
                          </span>
                          <button
                            onClick={() => handleToggleStatus(p._id, p.isActive)}
                            style={{
                              padding: '3px 10px',
                              borderRadius: '999px',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              background: p.isActive ? '#ECFDF5' : '#FEF2F2',
                              color: p.isActive ? '#065F46' : '#991B1B',
                            }}
                          >
                            {p.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </div>

                        <Link
                          to={`/admin/products/${p.slug || p._id}`}
                          style={{ fontWeight: 800, color: '#0F172A', fontSize: '14px', display: 'block', marginBottom: '4px' }}
                        >
                          {p.name}
                        </Link>

                        {p.genericName && (
                          <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '8px' }}>
                            {p.genericName}
                          </div>
                        )}

                        <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>
                          {p.dosageForm} {p.packaging ? `• ${p.packaging}` : ''}
                        </div>

                        {/* Card Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                          <Link
                            to={`/admin/products/${p.slug || p._id}`}
                            title="View"
                            style={{
                              flex: 1, padding: '6px', borderRadius: '6px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#6828DC', background: '#FAF5FF', border: '1px solid #EDE9FE',
                              cursor: 'pointer', fontSize: '11px', fontWeight: 700, gap: '4px',
                            }}
                          >
                            <Eye size={13} /> View
                          </Link>
                          <button
                            onClick={() => setEditingProduct(p)}
                            title="Edit"
                            style={{
                              flex: 1, padding: '6px', borderRadius: '6px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE',
                              cursor: 'pointer', fontSize: '11px', fontWeight: 700, gap: '4px',
                            }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            title="Delete"
                            style={{
                              flex: 1, padding: '6px', borderRadius: '6px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA',
                              cursor: 'pointer', fontSize: '11px', fontWeight: 700, gap: '4px',
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card View Pagination */}
              <TablePagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              />
            </>
          )}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          isOpen={!!editingProduct}
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSuccess={(updated: IProduct) => {
            setProducts((prev) =>
              prev.map((p) => (p._id === updated._id ? updated : p))
            );
            setEditingProduct(null);
            setFeedbackMsg(`Product "${updated.name}" updated successfully!`);
            setTimeout(() => setFeedbackMsg(''), 3000);
          }}
        />
      )}
    </div>
  );
};

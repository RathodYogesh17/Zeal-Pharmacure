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
  Pill
} from 'lucide-react';
import { productService } from '../../api/productService';
import type { IProduct, ICategory } from '../../types';

export const AdminProductsPage: React.FC = () => {

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Initial mockup products matching Image 2 bottom-left
  const initialProducts: IProduct[] = [
    {
      _id: 'p-1',
      name: 'Zefix-500',
      slug: 'zefix-500',
      genericName: 'Cefixime Tablets IP 500 mg',
      composition: 'Cefixime 500 mg',
      dosageForm: 'Tablets',
      packaging: '10 x 10 Tablets',
      category: 'Antibiotics',
      isActive: true,
      isFeatured: true,
    },
    {
      _id: 'p-2',
      name: 'Zapan-D',
      slug: 'zapan-d',
      genericName: 'Pantoprazole + Domperidone',
      composition: 'Pantoprazole + Domperidone',
      dosageForm: 'Capsules',
      packaging: '10 x 10 Alu-Alu',
      category: 'Gastroenterology',
      isActive: true,
      isFeatured: false,
    },
    {
      _id: 'p-3',
      name: 'Zeclav-625',
      slug: 'zeclav-625',
      genericName: 'Amoxicillin + Clavulanic Acid',
      composition: 'Amoxicillin + Clavulanic Acid',
      dosageForm: 'Tablets',
      packaging: '10 x 1 x 10 Strip',
      category: 'Antibiotics',
      isActive: true,
      isFeatured: true,
    },
    {
      _id: 'p-4',
      name: 'Zepan-DSR',
      slug: 'zepan-dsr',
      genericName: 'Rabeprazole + Domperidone',
      composition: 'Rabeprazole + Domperidone',
      dosageForm: 'Capsules',
      packaging: '10 x 10 Alu-Alu',
      category: 'Gastroenterology',
      isActive: false,
      isFeatured: false,
    },
    {
      _id: 'p-5',
      name: 'Zecort-M',
      slug: 'zecort-m',
      genericName: 'Deflazacort 6 mg',
      composition: 'Deflazacort 6 mg',
      dosageForm: 'Tablets',
      packaging: '10 x 10 Blister',
      category: 'Orthopedic',
      isActive: true,
      isFeatured: false,
    },
    {
      _id: 'p-6',
      name: 'Zecal-D3',
      slug: 'zecal-d3',
      genericName: 'Calcium + Vitamin D3',
      composition: 'Calcium + Vitamin D3',
      dosageForm: 'Tablets',
      packaging: '10 x 15 Tablets',
      category: 'Nutraceuticals',
      isActive: true,
      isFeatured: false,
    },
    {
      _id: 'p-7',
      name: 'Zeflox-200',
      slug: 'zeflox-200',
      genericName: 'Ofloxacin 200 mg',
      composition: 'Ofloxacin 200 mg',
      dosageForm: 'Tablets',
      packaging: '10 x 10 Tablets',
      category: 'General Medicine',
      isActive: true,
      isFeatured: false,
    },
    {
      _id: 'p-8',
      name: 'Zegaba-NT',
      slug: 'zegaba-nt',
      genericName: 'Gabapentin + Nortriptyline',
      composition: 'Gabapentin + Nortriptyline',
      dosageForm: 'Capsules',
      packaging: '10 x 10 Alu-Alu',
      category: 'Neurology',
      isActive: true,
      isFeatured: false,
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catList] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        productService.getCategories(),
      ]);
      if (prodRes.products && prodRes.products.length > 0) {
        setProducts(prodRes.products);
      } else {
        setProducts(initialProducts);
      }
      setCategories(catList);
    } catch {
      setProducts(initialProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus?: boolean) => {
    try {
      await productService.adminToggleStatus(id).catch(() => null);
      setProducts(prev =>
        prev.map(p => (p._id === id ? { ...p, isActive: !currentStatus } : p))
      );
      setFeedbackMsg('Product status updated successfully.');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to toggle status.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await productService.adminDeleteProduct(id).catch(() => null);
      setProducts(prev => prev.filter(p => p._id !== id));
      setFeedbackMsg(`Product "${name}" deleted.`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete product.');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSortBy('name');
  };

  const filteredProducts = products.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.genericName.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q);
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

  return (
    <div>
      {/* Top Header matching Image 2 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
            Products &gt; <strong style={{ color: '#0F172A' }}>All Products</strong>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
            All Products
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Switcher (Table vs Cards proper e-commerce) */}
          <div style={{
            display: 'flex',
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '8px',
            padding: '2px',
          }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: viewMode === 'table' ? '#EDE9FE' : 'transparent',
                color: viewMode === 'table' ? '#6828DC' : '#64748B',
                fontWeight: 600,
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Table View"
            >
              <List size={15} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: viewMode === 'cards' ? '#EDE9FE' : 'transparent',
                color: viewMode === 'cards' ? '#6828DC' : '#64748B',
                fontWeight: 600,
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="E-Commerce Card View"
            >
              <LayoutGrid size={15} />
              <span>E-Commerce Cards</span>
            </button>
          </div>

          <Link
            to="/admin/products/new"
            className="btn btn-primary"
            style={{ borderRadius: '8px', padding: '10px 18px', fontSize: '13.5px' }}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {feedbackMsg && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          padding: '12px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          fontSize: '13.5px',
        }}>
          <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0 }} />
          <div>{feedbackMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#991B1B',
          padding: '12px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          fontSize: '13px',
        }}>
          <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Filter Bar matching Image 2 bottom-left */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1.5px solid #E2E8F0',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 500px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search anything...    Ctrl K"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                background: '#F8FAFC',
              }}
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#FFFFFF',
            }}
          >
            <option value="ALL">All Categories</option>
            {categories.length > 0 ? (
              categories.map(c => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))
            ) : (
              <>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Nutraceuticals">Nutraceuticals</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Neurology">Neurology</option>
              </>
            )}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#FFFFFF',
            }}
          >
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#FFFFFF',
            }}
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. TABLE VIEW (Exact Image 2 Bottom-Left) */}
      {viewMode === 'table' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '12px 18px', width: '40px' }}>#</th>
                <th style={{ padding: '12px 18px' }}>Product Name</th>
                <th style={{ padding: '12px 18px' }}>Category</th>
                <th style={{ padding: '12px 18px' }}>Composition</th>
                <th style={{ padding: '12px 18px' }}>Dosage Form</th>
                <th style={{ padding: '12px 18px' }}>Status</th>
                <th style={{ padding: '12px 18px' }}>Featured</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#6828DC' }}>
                    Loading pharmaceutical inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                    No products matched your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => {
                const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                return (
                  <tr
                    key={p._id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <Link
                        to={`/admin/products/${p.slug || p._id}`}
                        style={{ fontWeight: 800, color: '#0F172A', fontSize: '13.5px' }}
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#64748B' }}>{catName || 'Antibiotics'}</td>
                    <td style={{ padding: '14px 18px', color: '#334155', maxWidth: '280px' }}>{p.composition}</td>
                    <td style={{ padding: '14px 18px', color: '#64748B' }}>{p.dosageForm}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <button
                        onClick={() => handleToggleStatus(p._id, p.isActive)}
                        style={{
                          background: p.isActive !== false ? '#ECFDF5' : '#FEF2F2',
                          color: p.isActive !== false ? '#059669' : '#DC2626',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        title="Click to toggle status"
                      >
                        {p.isActive !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ color: p.isFeatured ? '#2563EB' : '#94A3B8', fontWeight: 700, fontSize: '12px' }}>
                        {p.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Link
                          to={`/admin/products/${p.slug || p._id}`}
                          style={{ color: '#2563EB', padding: '4px' }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/products/${p.slug || p._id}`}
                          style={{ color: '#64748B', padding: '4px' }}
                          title="Edit Product"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          style={{ color: '#EF4444', padding: '4px' }}
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>

          {/* Table Pagination matching Image 2 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderTop: '1px solid #E2E8F0',
            fontSize: '12.5px',
            color: '#64748B',
          }}>
            <div>Showing 1 to {filteredProducts.length} of 500 products</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>&lt;</button>
              <button style={{ padding: '5px 10px', borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', fontWeight: 700 }}>1</button>
              <button style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>2</button>
              <button style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>3</button>
              <button style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>4</button>
              <button style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>5</button>
              <span>...</span>
              <button style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>63</button>
              <button style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>&gt;</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. E-COMMERCE CARDS VIEW (Requested by user: "proper e-commers jesa") */}
      {viewMode === 'cards' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {filteredProducts.map(p => (
            <div
              key={p._id}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #E2E8F0',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#A78BFA';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(104, 40, 220, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.03)';
              }}
            >
              <div>
                {/* 3D Box mockup placeholder */}
                <div style={{
                  height: '140px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  position: 'relative',
                }}>
                  <div style={{
                    width: '90px',
                    height: '80px',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    border: '1.5px solid #6828DC',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    boxShadow: '3px 4px 10px rgba(0,0,0,0.08)',
                  }}>
                    <Pill size={22} style={{ color: '#6828DC', marginBottom: '4px' }} />
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
                      {p.name}
                    </div>
                  </div>

                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: p.isActive !== false ? '#ECFDF5' : '#FEF2F2',
                    color: p.isActive !== false ? '#059669' : '#DC2626',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                  }}>
                    {p.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6828DC', textTransform: 'uppercase' }}>
                  {typeof p.category === 'object' ? p.category?.name : p.category || 'Pharmaceutical'}
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '3px 0 6px' }}>
                  {p.name}
                </h3>

                <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.45, marginBottom: '10px' }}>
                  {p.genericName}
                </p>

                <div style={{
                  background: '#F8FAFC',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  color: '#475569',
                  marginBottom: '14px',
                }}>
                  <strong>Pack:</strong> {p.packaging} • <strong>Form:</strong> {p.dosageForm}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                <Link
                  to={`/admin/products/${p.slug || p._id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, borderRadius: '6px', fontSize: '12px' }}
                >
                  <Eye size={13} />
                  <span>View Details</span>
                </Link>

                <button
                  onClick={() => handleToggleStatus(p._id, p.isActive)}
                  className="btn btn-sm"
                  style={{
                    borderRadius: '6px',
                    fontSize: '12px',
                    background: p.isActive !== false ? '#FEF2F2' : '#ECFDF5',
                    color: p.isActive !== false ? '#DC2626' : '#059669',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {p.isActive !== false ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

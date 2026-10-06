import React, { useState, useEffect } from 'react';
import {
  Plus,
  Layers,
  CheckCircle,
  AlertCircle,
  Trash2,
  Tag
} from 'lucide-react';
import { categoryService } from '../../api/categoryService';
import type { ICategory, ISubCategory } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');
  const [loading, setLoading] = useState(true);

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Create Category State
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    sortOrder: 1,
    isFeatured: true,
  });

  // Create SubCategory State
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: '',
    category: '',
    description: '',
    sortOrder: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, subs] = await Promise.all([
        categoryService.getAdminCategories(),
        categoryService.getSubCategories(),
      ]);
      setCategories(cats);
      setSubCategories(subs);
      if (cats.length > 0) {
        setSubCategoryForm(prev => ({ ...prev, category: cats[0]._id }));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryService.createCategory(categoryForm);
      setFeedbackMsg(`Category "${categoryForm.name}" created successfully!`);
      setCategoryForm({ name: '', description: '', sortOrder: 1, isFeatured: true });
      loadData();
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create category.');
    }
  };

  const handleCreateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryService.createSubCategory(subCategoryForm);
      setFeedbackMsg(`SubCategory "${subCategoryForm.name}" created successfully!`);
      setSubCategoryForm(prev => ({ ...prev, name: '', description: '' }));
      loadData();
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create subcategory.');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c._id !== id));
      setFeedbackMsg(`Category "${name}" deleted.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete category.');
    }
  };

  const handleDeleteSubCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete subcategory "${name}"?`)) return;
    try {
      await categoryService.deleteSubCategory(id);
      setSubCategories(prev => prev.filter(s => s._id !== id));
      setFeedbackMsg(`SubCategory "${name}" deleted.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete subcategory.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
            Categories & SubCategories Management
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
            Configure therapeutic segments, divisions and dependent subcategory taxonomies.
          </p>
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
          marginBottom: '20px',
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
          marginBottom: '20px',
          fontSize: '13px',
        }}>
          <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('categories')}
          style={{
            padding: '12px 18px',
            borderBottom: activeTab === 'categories' ? '2.5px solid #6828DC' : '2.5px solid transparent',
            color: activeTab === 'categories' ? '#6828DC' : '#64748B',
            fontWeight: activeTab === 'categories' ? 700 : 500,
            fontSize: '14px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Layers size={17} />
          <span>Therapeutic Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subcategories')}
          style={{
            padding: '12px 18px',
            borderBottom: activeTab === 'subcategories' ? '2.5px solid #6828DC' : '2.5px solid transparent',
            color: activeTab === 'subcategories' ? '#6828DC' : '#64748B',
            fontWeight: activeTab === 'subcategories' ? 700 : 500,
            fontSize: '14px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Tag size={17} />
          <span>SubCategories & Divisions ({subCategories.length})</span>
        </button>
      </div>

      {/* 1. CATEGORIES VIEW */}
      {activeTab === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px', alignItems: 'start' }}>
          {/* Create Category Form */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            padding: '24px',
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
              Create New Category
            </h3>

            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Antibiotics, Tablets"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Clinical category description..."
                  value={categoryForm.description}
                  onChange={e => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="catFeatured"
                  checked={categoryForm.isFeatured}
                  onChange={e => setCategoryForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="catFeatured" style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                  Show on Homepage as Featured
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '6px', fontWeight: 700 }}>
                <Plus size={16} />
                <span>Save Category</span>
              </button>
            </form>
          </div>

          {/* Categories Table List */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '12px 16px' }}>Category Name</th>
                  <th style={{ padding: '12px 16px' }}>Slug</th>
                  <th style={{ padding: '12px 16px' }}>Featured</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#6828DC' }}>
                      Loading categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                      No categories found. Create one using the form on the left.
                    </td>
                  </tr>
                ) : (
                  categories.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>{c.name}</td>
                    <td style={{ padding: '12px 16px', color: '#6828DC', fontSize: '12px' }}>{c.slug}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={c.isFeatured ? 'badge badge-purple' : 'badge'}>
                        {c.isFeatured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteCategory(c._id, c.name)}
                        style={{ padding: '4px', color: '#EF4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SUBCATEGORIES VIEW */}
      {activeTab === 'subcategories' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px', alignItems: 'start' }}>
          {/* Create SubCategory Form */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            padding: '24px',
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
              Create SubCategory / Division
            </h3>

            <form onSubmit={handleCreateSubCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Parent Category *
                </label>
                <select
                  value={subCategoryForm.category}
                  onChange={e => setSubCategoryForm(prev => ({ ...prev, category: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', background: '#FFFFFF' }}
                >
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  SubCategory Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Derma, Ortho, Gastro"
                  value={subCategoryForm.name}
                  onChange={e => setSubCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Subcategory therapeutic scope..."
                  value={subCategoryForm.description}
                  onChange={e => setSubCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '6px', fontWeight: 700 }}>
                <Plus size={16} />
                <span>Save SubCategory</span>
              </button>
            </form>
          </div>

          {/* SubCategories Table List */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '12px 16px' }}>SubCategory Name</th>
                  <th style={{ padding: '12px 16px' }}>Slug</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.map(s => (
                  <tr key={s._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>{s.name}</td>
                    <td style={{ padding: '12px 16px', color: '#6828DC', fontSize: '12px' }}>{s.slug}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteSubCategory(s._id, s.name)}
                        style={{ padding: '4px', color: '#EF4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

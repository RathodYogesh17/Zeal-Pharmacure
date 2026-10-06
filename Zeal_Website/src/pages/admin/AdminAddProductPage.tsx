import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Plus
} from 'lucide-react';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import type { ICategory, ISubCategory } from '../../types';

export const AdminAddProductPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brandName: '',
    category: '',
    subCategory: '',
    composition: '',
    dosageForm: 'Tablets',
    strength: '',
    packaging: '',
    prescriptionType: 'Schedule H',
    description: '',
    indications: '',
    storage: 'Store in a cool, dry & dark place. Protect from moisture and light.',
    sideEffects: 'Mild nausea or headache in sensitive patients.',
    manufacturing: 'Manufactured under strict WHO-GMP Schedule M conditions at Sanand GIDC.',
  });

  useEffect(() => {
    categoryService.getCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0) {
        setFormData(prev => ({ ...prev, category: cats[0]._id }));
        categoryService.getSubCategories(cats[0]._id).then(setSubCategories);
      }
    });
  }, []);

  const handleCategoryChange = async (catId: string) => {
    setFormData(prev => ({ ...prev, category: catId, subCategory: '' }));
    const subs = await categoryService.getSubCategories(catId);
    setSubCategories(subs);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (isDraft = false) => {
    if (!formData.name || !formData.genericName || !formData.composition) {
      setErrorMsg('Please fill in Product Name, Generic Name, and Active Composition.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const indicationsArray = formData.indications
        .split(',')
        .map(i => i.trim())
        .filter(Boolean);

      await productService.adminCreateProduct({
        name: formData.name,
        genericName: formData.genericName,
        composition: formData.composition,
        dosageForm: formData.dosageForm,
        packaging: formData.packaging || '10 x 10 Tablets',
        prescriptionType: formData.prescriptionType,
        category: formData.category || categories[0]?._id,
        subCategory: formData.subCategory || undefined,
        indicationTags: indicationsArray,
        howToUse: formData.storage,
        precautions: formData.sideEffects,
        sideEffects: formData.sideEffects,
        isActive: !isDraft,
      });

      setSuccessMsg('Product published successfully into the WHO-GMP catalog!');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Top Header matching Image 2 Top-Right */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
            Products &gt; <strong style={{ color: '#0F172A' }}>Add New Product</strong>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
            Add New Product
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '2px' }}>
            Create a new product for your pharmaceutical range
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="btn btn-secondary"
            style={{ borderRadius: '8px', padding: '10px 18px', fontSize: '13.5px' }}
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(false)}
            className="btn btn-primary"
            style={{ borderRadius: '8px', padding: '10px 22px', fontSize: '13.5px' }}
          >
            {loading ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          padding: '14px 18px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
          fontSize: '14px',
        }}>
          <CheckCircle size={20} style={{ color: '#10B981', flexShrink: 0 }} />
          <div>{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#991B1B',
          padding: '14px 18px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
          fontSize: '13.5px',
        }}>
          <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Main 2-Column Grid matching Image 2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* LEFT COLUMN: PRODUCT INFORMATION */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            Product Information
          </h3>

          {/* Row 1: Product Name & Generic Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter product name (e.g. Zefix-500)"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Generic Name *
              </label>
              <input
                type="text"
                name="genericName"
                required
                placeholder="Enter generic name (e.g. Cefixime)"
                value={formData.genericName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                }}
              />
            </div>
          </div>

          {/* Row 2: Brand Name (if any) */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Brand Name (if any)
            </label>
            <input
              type="text"
              name="brandName"
              placeholder="Enter brand name"
              value={formData.brandName}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13.5px',
              }}
            />
          </div>

          {/* Row 3: Category & Sub Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={e => handleCategoryChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  background: '#FFFFFF',
                }}
              >
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Sub Category
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  background: '#FFFFFF',
                }}
              >
                <option value="">Select sub category</option>
                {subCategories.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Composition */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Composition *
            </label>
            <input
              type="text"
              name="composition"
              required
              placeholder="e.g. Cefixime 500 mg"
              value={formData.composition}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13.5px',
              }}
            />
          </div>

          {/* Row 5: Dosage Form & Strength */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Dosage Form *
              </label>
              <select
                name="dosageForm"
                value={formData.dosageForm}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  background: '#FFFFFF',
                }}
              >
                <option value="Tablets">Tablets</option>
                <option value="Capsules">Capsules</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Oil">Oil</option>
                <option value="Ointment">Ointment</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Strength
              </label>
              <input
                type="text"
                name="strength"
                placeholder="e.g. 500 mg"
                value={formData.strength}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                }}
              />
            </div>
          </div>

          {/* Row 6: Packing & Prescription */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Packing *
              </label>
              <input
                type="text"
                name="packaging"
                placeholder="e.g. 10 x 10 Tablets"
                value={formData.packaging}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Prescription
              </label>
              <select
                name="prescriptionType"
                value={formData.prescriptionType}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  background: '#FFFFFF',
                }}
              >
                <option value="Schedule H">Schedule H</option>
                <option value="Schedule H1">Schedule H1</option>
                <option value="Rx">Rx</option>
                <option value="OTC">OTC</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          {/* Row 7: Product Description with Formatting Toolbar matching Image 2 */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Product Description *
            </label>

            <div style={{
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              {/* Toolbar */}
              <div style={{
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#64748B',
              }}>
                <button type="button" style={{ padding: '4px' }}><Bold size={15} /></button>
                <button type="button" style={{ padding: '4px' }}><Italic size={15} /></button>
                <button type="button" style={{ padding: '4px' }}><Underline size={15} /></button>
                <span style={{ color: '#CBD5E1' }}>|</span>
                <button type="button" style={{ padding: '4px' }}><List size={15} /></button>
                <button type="button" style={{ padding: '4px' }}><ListOrdered size={15} /></button>
                <button type="button" style={{ padding: '4px' }}><LinkIcon size={15} /></button>
              </div>

              <textarea
                name="description"
                rows={4}
                placeholder="Write product description here..."
                value={formData.description}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '13.5px',
                  border: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT IMAGES & ADDITIONAL INFORMATION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Product Images Card matching Image 2 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            padding: '24px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
              Product Images
            </h3>

            {/* Drag and Drop Upload Box */}
            <div style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '12px',
              padding: '28px 16px',
              textAlign: 'center',
              background: '#F8FAFC',
              cursor: 'pointer',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#EDE9FE',
                color: '#6828DC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
              }}>
                <UploadCloud size={24} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Click to upload or drag and drop
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                PNG, JPG (Max size: 5 MB)
              </div>
            </div>

            {/* Thumbnails Row */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 700,
                color: '#6828DC',
              }}>
                Box 3D
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 700,
                color: '#64748B',
              }}>
                Strip
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 700,
                color: '#64748B',
              }}>
                LBL
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '8px',
                border: '1.5px dashed #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                cursor: 'pointer',
              }}>
                <Plus size={18} />
              </div>
            </div>
          </div>

          {/* Additional Information Card matching Image 2 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
              Additional Information
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Indications
              </label>
              <input
                type="text"
                name="indications"
                placeholder="Enter indications (comma separated)"
                value={formData.indications}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Storage
              </label>
              <input
                type="text"
                name="storage"
                placeholder="Enter storage information"
                value={formData.storage}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Side Effects
              </label>
              <input
                type="text"
                name="sideEffects"
                placeholder="Enter side effects"
                value={formData.sideEffects}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Manufacturing
              </label>
              <input
                type="text"
                name="manufacturing"
                placeholder="Enter manufacturing info"
                value={formData.manufacturing}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

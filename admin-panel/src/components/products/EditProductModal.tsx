import React, { useState, useEffect } from 'react';
import { X, Plus, UploadCloud, Image as ImageIcon, Save, AlertCircle, CheckCircle, } from 'lucide-react';
import { Modal } from '../common/ui/Modal';
import { MediaGalleryModal } from '../common/ui/MediaGalleryModal';
import { ThemeSelect, ThemeQuillEditor } from '../common';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import { galleryService } from '../../api/galleryService';
import type { IProduct, ICategory, ISubCategory } from '../../types';

export interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct | null;
  categories: ICategory[];
  onSuccess: (updated: IProduct) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product, categories, onSuccess, }) => {
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    composition: '',
    dosageForm: 'Tablets',
    packaging: '',
    prescriptionType: 'Schedule H',
    category: '',
    subCategory: '',
    indications: '',
    storage: '',
    sideEffects: '',
    precautions: '',
    isActive: true,
    isFeatured: false,
    isNewLaunch: false,
  });

  // Images
  const [primaryImage, setPrimaryImage] = useState<string>('');
  const [mediaGallery, setMediaGallery] = useState<string[]>([]);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<'primary' | 'extra'>('primary');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  useEffect(() => {
    if (!product) return;

    const catId = typeof product.category === 'object' && product.category?._id
      ? product.category._id
      : typeof product.category === 'string'
        ? product.category
        : categories[0]?._id || '';

    const subCatId = typeof product.subCategory === 'object' && product.subCategory?._id
      ? product.subCategory._id
      : typeof product.subCategory === 'string'
        ? product.subCategory
        : '';

    const indicationsStr = Array.isArray(product.indicationTags)
      ? product.indicationTags.join(', ')
      : Array.isArray(product.indications)
        ? product.indications.map((i: any) => (typeof i === 'object' ? i.name : i)).join(', ')
        : '';

    const extraImages: string[] = Array.isArray(product.mediaGallery)
      ? product.mediaGallery.map((m: any) => (typeof m === 'object' && m?.url ? m.url : String(m)))
      : [];

    setFormData({
      name: product.name || '',
      genericName: product.genericName || '',
      composition: product.composition || '',
      dosageForm: product.dosageForm || 'Tablets',
      packaging: product.packaging || '10 x 10 Tablets',
      prescriptionType: product.prescriptionType || 'Schedule H',
      category: catId,
      subCategory: subCatId,
      indications: indicationsStr,
      storage: product.howToUse || '',
      sideEffects: product.sideEffects || '',
      precautions: product.precautions || '',
      isActive: product.isActive !== false,
      isFeatured: Boolean(product.isFeatured),
      isNewLaunch: Boolean(product.isNewLaunch),
    });

    setPrimaryImage(product.featuredImage || '');
    setMediaGallery(extraImages);
    setErrorMsg('');
    setSuccessMsg('');
    setFieldErrors({});

    if (catId) {
      categoryService.getSubCategories(catId).then(setSubCategories).catch(() => setSubCategories([]));
    }
  }, [product, categories, isOpen]);

  const handleCategoryChange = async (catId: string) => {
    setFormData((prev) => ({ ...prev, category: catId, subCategory: '' }));
    clearFieldError('category');
    if (catId) {
      const subs = await categoryService.getSubCategories(catId).catch(() => []);
      setSubCategories(subs);
    } else {
      setSubCategories([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    clearFieldError(name);
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Product Name is required.';
    if (!formData.composition.trim()) errs.composition = 'Composition / Formulation is required.';
    const catId = formData.category || categories[0]?._id;
    if (!catId) errs.category = 'Please select a valid product category.';
    if (!formData.packaging?.trim()) errs.packaging = 'Packaging details are required.';

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const indicationsArray = formData.indications
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      const formattedMediaGallery = mediaGallery
        .filter(Boolean)
        .map((img) => ({ url: img, imageId: null, title: '' }));

      const payload = {
        name: formData.name.trim(),
        genericName: formData.genericName.trim() || undefined,
        composition: formData.composition.trim(),
        dosageForm: formData.dosageForm.trim(),
        packaging: formData.packaging?.trim() || '10 x 10 Tablets',
        prescriptionType: formData.prescriptionType || 'Rx',
        category: catId,
        subCategory: formData.subCategory || undefined,
        indications: indicationsArray,
        howToUse: formData.storage?.trim(),
        precautions: formData.precautions?.trim(),
        sideEffects: formData.sideEffects?.trim(),
        featuredImage: primaryImage || undefined,
        mediaGallery: formattedMediaGallery,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isNewLaunch: formData.isNewLaunch,
      };

      const updated = await productService.adminUpdateProduct(product._id, payload);
      setSuccessMsg('Product updated successfully in the live database!');
      onSuccess(updated);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Edit Product: ${product.name}`}
        size="xl"
      >
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {errorMsg && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', }}>
              <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', color: '#065F46', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', }}>
              <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0 }} />
              <div>{successMsg}</div>
            </div>
          )}

          {/* 2-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
            {/* Left Column: Clinical & Formula Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>  Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: fieldErrors.name ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                      boxShadow: fieldErrors.name ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                      outline: 'none',
                    }}
                  />
                  {fieldErrors.name && (
                    <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '4px 0 0 0', lineHeight: 1.4 }}>
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Generic / Scientific Name <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="genericName"
                    value={formData.genericName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}> Composition / Formulation *</label>
                <input
                  type="text"
                  name="composition"
                  value={formData.composition}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: fieldErrors.composition ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                    boxShadow: fieldErrors.composition ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                    outline: 'none',
                  }}
                />
                {fieldErrors.composition && (
                  <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    {fieldErrors.composition}
                  </p>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}> Therapeutic Category *</label>
                  <ThemeSelect
                    name="category"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    style={{
                      width: '100%',
                      borderColor: fieldErrors.category ? '#EF4444' : undefined,
                      boxShadow: fieldErrors.category ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : undefined,
                    }}
                    containerStyle={{ width: '100%' }}
                  >
                    {categories.map((c) => (<option key={c._id} value={c._id}> {c.name} </option>))}
                  </ThemeSelect>
                  {fieldErrors.category && (
                    <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '4px 0 0 0', lineHeight: 1.4 }}>
                      {fieldErrors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}> Sub-Category / Division</label>
                  <ThemeSelect name="subCategory" value={formData.subCategory} onChange={handleChange} style={{ width: '100%' }} containerStyle={{ width: '100%' }}>
                    <option value="">-- General Division --</option>
                    {subCategories.map((s) => (<option key={s._id} value={s._id}> {s.name} </option>))}
                  </ThemeSelect>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}> Dosage Form * </label>
                  <ThemeSelect name="dosageForm" value={formData.dosageForm} onChange={handleChange} style={{ width: '100%' }} containerStyle={{ width: '100%' }}>
                    <option value="Tablets">Tablets</option>
                    <option value="Capsules">Capsules</option>
                    <option value="Syrup">Syrup / Suspension</option>
                    <option value="Injection">Injection</option>
                    <option value="Gel">Gel / Topical Ointment</option>
                    <option value="Oil">Ayurvedic Oil</option>
                    <option value="Eye Drops">Eye / Ear Drops</option>
                    <option value="Powder">Powder / Sachet</option>
                  </ThemeSelect>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}> Packaging * </label>
                  <input
                    type="text"
                    name="packaging"
                    value={formData.packaging}
                    onChange={handleChange}
                    placeholder="e.g. 10 x 10 Alu-Alu"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: fieldErrors.packaging ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                      boxShadow: fieldErrors.packaging ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                      outline: 'none',
                    }}
                  />
                  {fieldErrors.packaging && (
                    <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '4px 0 0 0', lineHeight: 1.4 }}>
                      {fieldErrors.packaging}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}> Prescription Schedule </label>
                  <ThemeSelect name="prescriptionType" value={formData.prescriptionType} onChange={handleChange} style={{ width: '100%' }} containerStyle={{ width: '100%' }}>
                    <option value="Schedule H">Schedule H</option>
                    <option value="Schedule H1">Schedule H1</option>
                    <option value="Rx">Rx</option>
                    <option value="OTC">OTC</option>
                    <option value="General">General</option>
                  </ThemeSelect>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}> Clinical Indications </label>
                  <input type="text" name="indications" value={formData.indications} onChange={handleChange} placeholder="Comma separated (e.g. RTI, UTI, Fever)" style={{ width: '100%', padding: '8px 12px' }} />
                </div>
              </div>

              <div>
                <ThemeQuillEditor
                  label={<span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Dosage &amp; How To Use</span>}
                  toolbarPreset="simple"
                  placeholder="Dosage guidelines or storage instructions"
                  value={formData.storage}
                  onChange={(val) => setFormData((prev) => ({ ...prev, storage: val }))}
                  minHeight="80px"
                />
              </div>

              {/* Status Toggles */}
              <div style={{ display: 'flex', gap: '20px', padding: '12px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} style={{ width: '16px', height: '16px' }} />  Active (Catalog Live)</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} style={{ width: '16px', height: '16px' }} />  Featured Product </label>
              </div>
            </div>

            {/* Right Column: Packaging & Gallery Media */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Primary 3D Box */}
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Primary 3D Packaging</span>
                  <button type="button" onClick={() => { setActiveSlot('primary'); setGalleryModalOpen(true); }} className="btn btn-secondary btn-sm" >
                    <ImageIcon size={13} />
                    <span>Choose</span>
                  </button>
                </div>

                {primaryImage ? (
                  <div style={{ textAlign: 'center', background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #DDD6FE' }}>
                    <img
                      src={galleryService.formatUrl(primaryImage)}
                      alt="Primary"
                      onClick={() => { setActiveSlot('primary'); setGalleryModalOpen(true); }}
                      title="Click to change primary image"
                      style={{ maxHeight: '110px', maxWidth: '100%', objectFit: 'contain', margin: '0 auto', cursor: 'pointer' }}
                    />
                    <button
                      type="button"
                      onClick={() => setPrimaryImage('')}
                      style={{ color: '#EF4444', fontSize: '11.5px', marginTop: '6px', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => { setActiveSlot('primary'); setGalleryModalOpen(true); }}
                    style={{ border: '2px dashed #CBD5E1', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: '#FFFFFF', }}>
                    <UploadCloud size={24} style={{ color: '#6828DC', margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Click to select packaging</div>
                  </div>
                )}
              </div>

              {/* Extra Gallery Images */}
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>  Extra Images ({mediaGallery.length})</span>
                  <button type="button" onClick={() => { setActiveSlot('extra'); setGalleryModalOpen(true); }} className="btn btn-secondary btn-sm" >
                    <Plus size={13} />
                    <span>Add Images</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {mediaGallery.map((img, idx) => (
                    <div
                      key={idx}
                      style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #CBD5E1', background: '#FFFFFF', }}>
                      <img src={galleryService.formatUrl(img)} alt={`Extra ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <button
                        type="button"
                        onClick={() => setMediaGallery((prev) => prev.filter((_, i) => i !== idx))}
                        style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#EF4444', color: '#FFFFFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: 'pointer', }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => { setActiveSlot('extra'); setGalleryModalOpen(true); }}
                    style={{ width: '56px', height: '56px', borderRadius: '6px', border: '1.5px dashed #6828DC', background: '#EDE9FE', color: '#6828DC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', }}
                    title="Add more extra images">
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary"> Cancel </button>
            <button type="submit" disabled={loading} className="btn btn-primary" >
              <Save size={15} />
              <span>{loading ? 'Saving Changes...' : 'Save Product Changes'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Gallery Picker Modal */}
      <MediaGalleryModal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        defaultTag="PRODUCT"
        multiple={activeSlot === 'extra'}
        onSelect={(imgUrl) => {
          if (activeSlot === 'primary') {
            setPrimaryImage(imgUrl);
          } else {
            setMediaGallery((prev) => (prev.includes(imgUrl) ? prev : [...prev, imgUrl]));
          }
        }}
        onSelectMultiple={(imgUrls) => {
          setMediaGallery((prev) => {
            const combined = [...prev];
            imgUrls.forEach((u) => {
              if (!combined.includes(u)) combined.push(u);
            });
            return combined;
          });
        }}
      />
    </>
  );
};

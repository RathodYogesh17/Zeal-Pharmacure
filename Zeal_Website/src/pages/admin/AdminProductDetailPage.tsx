import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';
import { productService } from '../../api/productService';
import type { IProduct } from '../../types';

export const AdminProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [activeTab, setActiveTab] = useState<'indications' | 'sideEffects' | 'storage' | 'composition' | 'packaging'>('indications');

  // Default fallback matching Image 2 middle-right
  const defaultProduct: IProduct = {
    _id: 'prod-zefix',
    name: 'Zefix-500',
    slug: 'zefix-500',
    genericName: 'Cefixime Tablets IP 500 mg',
    composition: 'Cefixime 500 mg',
    dosageForm: 'Tablets',
    packaging: '10 x 10 Tablets',
    prescriptionType: 'Schedule H',
    category: 'Antibiotics',
    isActive: true,
    isFeatured: true,
    indicationTags: [
      'Respiratory tract infections (RTIs)',
      'Urinary tract infections (UTIs)',
      'Typhoid fever',
      'Gastrointestinal infections',
      'Skin and soft tissue infections',
    ],
    precautions: 'Use with caution in renal impaired patients. Complete full antibiotic course.',
    sideEffects: 'Mild diarrhea, nausea, abdominal pain, allergic skin rash.',
    howToUse: 'Adults: 400 mg daily as a single dose or in two divided doses of 200 mg every 12 hours.',
  };

  useEffect(() => {
    if (id) {
      productService.getProductBySlug(id).then(res => {
        if (res) setProduct(res);
        else setProduct(defaultProduct);
      });
    } else {
      setProduct(defaultProduct);
    }
  }, [id]);

  const p = product || defaultProduct;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${p.name}?`)) return;
    await productService.adminDeleteProduct(p._id).catch(() => null);
    navigate('/admin/products');
  };

  return (
    <div>
      {/* Top Header matching Image 2 */}
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
            Products &gt; All Products &gt; <strong style={{ color: '#0F172A' }}>{p.name}</strong>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
            {p.name}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '8px', padding: '8px 16px' }}
          >
            <Edit2 size={14} />
            <span>Edit Product</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '8px', padding: '8px 16px' }}
          >
            <Copy size={14} />
            <span>Duplicate</span>
          </button>

          <button
            onClick={handleDelete}
            className="btn btn-sm"
            style={{
              borderRadius: '8px',
              padding: '8px 16px',
              background: '#FFFFFF',
              color: '#EF4444',
              border: '1.5px solid #FECACA',
            }}
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout matching Image 2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1.4fr 280px',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* 1. LEFT: PRODUCT 3D MOCKUP & THUMBNAILS */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
        }}>
          {/* Main Box Mockup */}
          <div style={{
            height: '240px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid #E2E8F0',
          }}>
            <div style={{
              width: '180px',
              height: '140px',
              borderRadius: '10px',
              background: '#FFFFFF',
              border: '2px solid #6828DC',
              boxShadow: '0 10px 25px rgba(104, 40, 220, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '14px',
              position: 'relative',
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>ZEAL PHARMA</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#6828DC', marginTop: '2px' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '9px', color: '#334155' }}>{p.genericName}</div>
              </div>
              <div style={{
                height: '4px',
                background: 'linear-gradient(90deg, #10B981, #06B6D4)',
                borderRadius: '2px',
              }} />
            </div>
          </div>

          {/* Thumbnails Row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              flex: 1,
              height: '60px',
              borderRadius: '8px',
              border: '2px solid #6828DC',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: '#6828DC',
            }}>
              Box 3D
            </div>
            <div style={{
              flex: 1,
              height: '60px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              color: '#64748B',
            }}>
              Strip
            </div>
            <div style={{
              flex: 1,
              height: '60px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              color: '#64748B',
            }}>
              Visual Aid
            </div>
          </div>
        </div>

        {/* 2. MIDDLE: CLINICAL DETAILS & TABS */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '28px',
        }}>
          {/* Header & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>
              {p.name}
            </h2>
            <span style={{
              background: '#ECFDF5',
              color: '#059669',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              Active
            </span>
            <span style={{
              background: '#EDE9FE',
              color: '#6828DC',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              Featured
            </span>
          </div>

          <div style={{ fontSize: '14px', color: '#6828DC', fontWeight: 600, marginBottom: '20px' }}>
            {p.genericName}
          </div>

          {/* Key-Value Details Grid matching Image 2 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px 24px',
            fontSize: '13px',
            paddingBottom: '20px',
            borderBottom: '1px solid #F1F5F9',
            marginBottom: '20px',
          }}>
            <div>
              <span style={{ color: '#64748B' }}>Category: </span>
              <strong>{typeof p.category === 'object' ? p.category?.name : p.category || 'Antibiotics'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Composition: </span>
              <strong>{p.composition}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Dosage Form: </span>
              <strong>{p.dosageForm}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Strength: </span>
              <strong>500 mg</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Packing: </span>
              <strong>{p.packaging}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Prescription: </span>
              <strong>{p.prescriptionType || 'Schedule H'}</strong>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
            <strong>Description: </strong>
            {p.name} contains Cefixime, a broad spectrum third-generation cephalosporin antibiotic indicated for bacterial infections with peak bioavailability.
          </div>

          {/* Tabbed Navigation matching Image 2 */}
          <div style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '1.5px solid #E2E8F0',
            marginBottom: '16px',
          }}>
            {[
              { id: 'indications', label: 'Indications' },
              { id: 'sideEffects', label: 'Side Effects' },
              { id: 'storage', label: 'Storage' },
              { id: 'composition', label: 'Composition' },
              { id: 'packaging', label: 'Packaging' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? '#6828DC' : '#64748B',
                  borderBottom: activeTab === tab.id ? '2.5px solid #6828DC' : '2.5px solid transparent',
                  background: 'transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'indications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(p.indicationTags || [
                'Respiratory tract infections (RTIs)',
                'Urinary tract infections (UTIs)',
                'Typhoid fever',
                'Gastrointestinal infections',
                'Skin and soft tissue infections',
              ]).map((ind, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sideEffects' && (
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              {p.sideEffects || 'Mild diarrhea, nausea, abdominal pain, allergic skin rash.'}
            </div>
          )}

          {activeTab === 'storage' && (
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              Store below 25°C in a dry place. Protect from moisture, humidity and direct sunlight.
            </div>
          )}

          {activeTab === 'composition' && (
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              {p.composition}
            </div>
          )}

          {activeTab === 'packaging' && (
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              High barrier Alu-Alu and Blister packing with tamper-evident seal.
            </div>
          )}
        </div>

        {/* 3. RIGHT: PRODUCT STATISTICS CARD matching Image 2 */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
            Product Statistics
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: '#F8FAFC', padding: '12px 6px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#6828DC' }}>1,250</div>
              <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>Total Views</div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 6px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#2563EB' }}>320</div>
              <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>Enquiries</div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 6px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#10B981' }}>45</div>
              <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>Brochures</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '12.5px',
            borderTop: '1px solid #F1F5F9',
            paddingTop: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={16} style={{ color: '#64748B' }} />
              <div>
                <span style={{ color: '#94A3B8' }}>Created By: </span>
                <strong style={{ color: '#334155' }}>Admin</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: '#64748B' }} />
              <div>
                <span style={{ color: '#94A3B8' }}>Created On: </span>
                <span style={{ color: '#334155' }}>10 Jan 2025, 11:30 AM</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: '#64748B' }} />
              <div>
                <span style={{ color: '#94A3B8' }}>Last Updated: </span>
                <span style={{ color: '#334155' }}>12 Jan 2025, 09:15 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

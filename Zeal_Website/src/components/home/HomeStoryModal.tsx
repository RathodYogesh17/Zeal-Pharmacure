import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Modal } from '../common';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export interface HomeStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFranchiseModal: () => void;
}

export const HomeStoryModal: React.FC<HomeStoryModalProps> = ({
  isOpen,
  onClose,
  onOpenFranchiseModal,
}) => {
  const { productCount } = useSiteSettings();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Zeal Pharmacure Corporate Story"
      subtitle="WHO-GMP Quality Formulations & Stockists / Distribution Leadership"
      maxWidth="640px"
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ height: '220px', borderRadius: '16px', background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', padding: '20px', marginBottom: '24px', }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--zp-primary, #6828DC)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 0 20px rgba(104, 40, 220, 0.6)', }}>
            <Play size={26} fill="#FFFFFF" />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>A Legacy of Better Healthcare</div>
          <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '4px' }}>
            WHO-GMP Sourced Quality &bull; {productCount}+ Formulations &bull; Pan-India Network
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFranchiseModal();
            }}
            className="btn btn-primary"
            style={{ borderRadius: '8px', padding: '10px 22px' }}
          >
            Apply for Stockists / Distribution
          </button>
          <Link
            to="/about"
            className="btn btn-secondary"
            style={{ borderRadius: '8px', padding: '10px 22px', textDecoration: 'none' }}
            onClick={onClose}
          >
            Read Corporate Profile
          </Link>
        </div>
      </div>
    </Modal>
  );
};

import React from "react";
import { Send } from "lucide-react";

export interface BulkEnquiryFloatingBarProps {
  selectedCount: number;
  onOpenModal: () => void;
  onClearAll: () => void;
}

export const BulkEnquiryFloatingBar: React.FC<BulkEnquiryFloatingBarProps> = ({
  selectedCount,
  onOpenModal,
  onClearAll,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="zp-floating-dock">
      <div className="zp-feb-left">
        <div className="zp-feb-count-badge">{selectedCount}</div>
        <span className="zp-feb-count-label">Formulations Selected for Bulk Order</span>
      </div>
      <div className="zp-feb-right">
        <button type="button" onClick={onOpenModal} className="zp-feb-enquire-btn">
          <Send size={12} />
          <span>Review &amp; Enquire Now</span>
        </button>
        <button type="button" onClick={onClearAll} className="zp-feb-clear-btn">
          Clear All
        </button>
      </div>
    </div>
  );
};

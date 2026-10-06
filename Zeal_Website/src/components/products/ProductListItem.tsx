import React from "react";
import { Pill, FileText, Send, CheckSquare, Square, CheckCircle2 } from "lucide-react";
import type { IProduct } from "../../types";

export interface ProductListItemProps {
  product: IProduct;
  onEnquire: (p: IProduct) => void;
  onViewDossier: (p: IProduct) => void;
  isBulkSelected?: boolean;
  onToggleBulk?: (p: IProduct) => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  onEnquire,
  onViewDossier,
  isBulkSelected = false,
  onToggleBulk,
}) => {
  return (
    <div className={`zp-pli-wrapper${isBulkSelected ? " selected" : ""}`}>
      <div className="zp-pli-left">
        <div className="zp-pli-img-box">
          {product.featuredImage ? (
            <img src={product.featuredImage} alt={product.name} className="zp-pli-img" />
          ) : (
            <Pill size={36} className="zp-pli-pill-icon" />
          )}
        </div>
        <div>
          <div className="zp-pli-badge-row">
            <span className="zp-badge-purple">{product.dosageForm || "Formulation"}</span>
            <span className="zp-badge-green">{product.prescriptionType || "General"}</span>
            <span className="zp-pli-ready">
              <CheckCircle2 size={12} />
              Ready Stock
            </span>
          </div>
          <h4 onClick={() => onViewDossier(product)} className="zp-pli-title">
            {product.name}
          </h4>
          <p className="zp-pli-generic">{product.genericName}</p>
          <p className="zp-pli-comp">{product.composition}</p>
        </div>
      </div>

      <div className="zp-pli-right">
        <span className="zp-pli-pack-label">{product.packaging || "Standard Pack"}</span>

        {onToggleBulk && (
          <button
            type="button"
            onClick={() => onToggleBulk(product)}
            className={`zp-pli-bulk-btn${isBulkSelected ? " selected" : ""}`}
          >
            {isBulkSelected ? <CheckSquare size={15} color="var(--zp-primary)" /> : <Square size={15} />}
            <span>Bulk Order</span>
          </button>
        )}

        <button type="button" onClick={() => onViewDossier(product)} className="zp-btn-secondary">
          <FileText size={13} />
          <span>Dossier</span>
        </button>

        <button type="button" onClick={() => onEnquire(product)} className="zp-btn-primary">
          <Send size={13} />
          <span>Enquire Now</span>
        </button>
      </div>
    </div>
  );
};

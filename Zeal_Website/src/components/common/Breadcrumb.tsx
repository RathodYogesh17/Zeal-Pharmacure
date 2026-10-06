import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  style?: React.CSSProperties;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className, style }) => {
  return (
    <nav aria-label="Breadcrumb" className={`zp-breadcrumb ${className || ''}`} style={style}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {idx > 0 && <ChevronRight size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />}
            {isLast || !item.href ? (
              <span className="zp-breadcrumb-active">{item.label}</span>
            ) : (
              <Link to={item.href}>{item.label}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

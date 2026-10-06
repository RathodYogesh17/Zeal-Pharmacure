import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export interface RatingStarsProps {
  rating?: number;
  totalReviews?: number;
  size?: number;
  showText?: boolean;
  forceStars?: boolean;
  fallbackText?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  totalReviews,
  size = 12,
  showText = true,
  forceStars = false,
  fallbackText = 'WHO-GMP Certified',
}) => {
  const hasReviews = totalReviews !== undefined && totalReviews > 0;
  const currentRating = typeof rating === 'number' && rating > 0 ? rating : 5;
  const roundedRating = Math.round(currentRating);

  // If no reviews and not forced to show stars, display professional pharmaceutical quality credential
  if (!hasReviews && !forceStars) {
    return (
      <div style={{ display: 'inline-flex',  alignItems: 'center', gap: '4px',  fontSize: '11px',  fontWeight: 700,  color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '6px',  border: '1px solid #A7F3D0', letterSpacing: '0.2px',}}
        title="Quality Tested Formulation according to WHO-GMP & Pharmacopoeia Standards"
      >
        <ShieldCheck size={Math.max(12, size)} color="#10B981" />
        <span>{fallbackText}</span>
      </div>
    );
  }

  // Real review star rating display
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <div style={{ display: 'flex', color: '#F59E0B' }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < roundedRating ? '#F59E0B' : 'none'}
            color={i < roundedRating ? '#F59E0B' : '#CBD5E1'}
          />
        ))}
      </div>
      {showText && (
        <span style={{ fontSize: '11.5px', color: '#475569', fontWeight: 700 }}>
          {currentRating.toFixed(1)} {hasReviews && `(${totalReviews} ${totalReviews === 1 ? 'Review' : 'Reviews'})`}
        </span>
      )}
    </div>
  );
};

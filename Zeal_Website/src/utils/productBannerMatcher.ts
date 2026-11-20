import type { IProduct } from '../types';
import { getMediaUrl } from './mediaUtils';

export interface MatchedBannerData {
  product: IProduct | null;
  image: string;
  badge: string;
  title: string;
  subtitle?: string;
  isMatchedFromCategory: boolean;
  isFallback: boolean;
}

const getProductImage = (p: IProduct): string | null => {
  if (!p) return null;
  if (typeof p.featuredImage === 'string' && p.featuredImage.trim()) return p.featuredImage.trim();
  if (typeof (p as any).featuredImage?.url === 'string' && (p as any).featuredImage.url.trim()) {
    return (p as any).featuredImage.url.trim();
  }
  if (Array.isArray((p as any).images) && (p as any).images.length > 0) {
    const first = (p as any).images[0];
    if (typeof first === 'string' && first.trim()) return first.trim();
    if (typeof first?.url === 'string' && first.url.trim()) return first.url.trim();
  }
  if (Array.isArray((p as any).mediaGallery) && (p as any).mediaGallery.length > 0) {
    const g = (p as any).mediaGallery[0];
    if (typeof g === 'string' && g.trim()) return g.trim();
    if (typeof g?.url === 'string' && g.url.trim()) return g.url.trim();
  }
  return null;
};

const getCategoryName = (p: IProduct): string => {
  if (!p) return '';
  if (typeof p.category === 'string') return p.category;
  if (typeof p.category === 'object' && p.category?.name) return p.category.name;
  if (p.subCategoryName) return p.subCategoryName;
  if (typeof p.subCategory === 'object' && p.subCategory?.name) return p.subCategory.name;
  return '';
};

const matchesKeywords = (p: IProduct, keywords: string[]): boolean => {
  const cat = getCategoryName(p).toLowerCase();
  const name = (p.name || '').toLowerCase();
  const comp = (p.composition || '').toLowerCase();
  const text = `${cat} ${name} ${comp}`;
  return keywords.some((k) => text.includes(k.toLowerCase()));
};

/**
 * Match 8 distinct product banner slots from database products:
 * 1. Multivitamin & Wellness Range (Hero Slide)
 * 2. GYNECOLOGY (Hero Promo 1)
 * 3. NUTRACEUTICALS (Hero Promo 2)
 * 4. CHRONIC CARE (Middle Promo 1)
 * 5. DERMA TRICHOLOGY (Middle Promo 2)
 * 6. RESPIRATORY LINE (Middle Promo 3)
 * 7. PEDIATRIC DIVISION (Bottom Promo 1)
 * 8. DERMA CARE (Bottom Promo 2)
 *
 * If category exists in DB: shows that category's real product details and image.
 * If category is not in DB: falls back to another category's best product.
 * In all cases: exact design, layout, styles, and buttons remain 100% preserved.
 */
export const resolveProductBanners = (
  products: IProduct[] = [],
  settings?: any
) => {
  const usedProductIds = new Set<string>();

  const findBestProduct = (
    keywords: string[],
    allowFallback: boolean = true
  ): { product: IProduct | null; isCategoryMatch: boolean } => {
    if (!products || products.length === 0) {
      return { product: null, isCategoryMatch: false };
    }

    // 1. First priority: Matches category keywords AND has an image
    let match = products.find((p) => {
      if (usedProductIds.has(p._id)) return false;
      const hasImg = Boolean(getProductImage(p));
      return hasImg && matchesKeywords(p, keywords);
    });

    // 2. Second priority: Matches category keywords even if image is pending
    if (!match) {
      match = products.find((p) => {
        if (usedProductIds.has(p._id)) return false;
        return matchesKeywords(p, keywords);
      });
    }

    if (match) {
      usedProductIds.add(match._id);
      return { product: match, isCategoryMatch: true };
    }

    // 3. Fallback: If category not in database, pick best available product from another category
    if (allowFallback) {
      // Prioritize featured product with image
      const fallback =
        products.find((p) => !usedProductIds.has(p._id) && Boolean(getProductImage(p)) && p.isFeatured) ||
        products.find((p) => !usedProductIds.has(p._id) && Boolean(getProductImage(p))) ||
        products.find((p) => !usedProductIds.has(p._id));

      if (fallback) {
        usedProductIds.add(fallback._id);
        return { product: fallback, isCategoryMatch: false };
      }
    }

    return { product: null, isCategoryMatch: false };
  };

  // 1. Multivitamin & Wellness Range (Hero Slide)
  const multiResult = findBestProduct([
    'multivitamin',
    'wellness',
    'vitamins, minerals & supplements',
    'antioxidant',
    'supplement',
    'immunity',
  ]);
  const multiImg = multiResult.product && getProductImage(multiResult.product)
    ? getMediaUrl(getProductImage(multiResult.product)!)
    : getMediaUrl((settings as any)?.promoBanners?.productMultivitamin || (settings as any)?.promoBanners?.productHeroSlide1, '/promos/promo_multivitamin.jpg');

  // 2. GYNECOLOGY (Hero Promo 1)
  const gynecResult = findBestProduct([
    'gynecology',
    'women',
    'female',
    'iron & folic',
    'pregnancy',
    'progesterone',
    'ferzeal',
  ]);
  const gynecImg = gynecResult.product && getProductImage(gynecResult.product)
    ? getMediaUrl(getProductImage(gynecResult.product)!)
    : getMediaUrl((settings as any)?.promoBanners?.productGummies, '/promos/promo_gummies.jpg');

  // 3. NUTRACEUTICALS (Hero Promo 2)
  const nutraResult = findBestProduct([
    'nutraceutical',
    'extract',
    'herbal',
    'ayurvedic',
    'antioxidants',
  ]);
  const nutraImg = nutraResult.product && getProductImage(nutraResult.product)
    ? getMediaUrl(getProductImage(nutraResult.product)!)
    : getMediaUrl((settings as any)?.promoBanners?.productWellness, '/promos/promo_wellness.jpg');

  // 4. CHRONIC CARE (Middle Promo 1)
  const chronicResult = findBestProduct([
    'cardiology',
    'diabetes',
    'cardiac',
    'diabetic',
    'hypertension',
    'blood pressure',
    'blood sugar',
    'cholesterol',
    'chronic',
  ]);
  const chronicImg = chronicResult.product && getProductImage(chronicResult.product)
    ? getMediaUrl(getProductImage(chronicResult.product)!)
    : getMediaUrl((settings as any)?.promoBanners?.productDiabetic, '/promos/promo_diabetic.jpg');

  // 5. DERMA TRICHOLOGY (Middle Promo 2)
  const trichoResult = findBestProduct([
    'trichology',
    'hair',
    'biotin',
    'follicle',
    'scalp',
    'hair health',
  ]);
  const trichoImg = trichoResult.product && getProductImage(trichoResult.product)
    ? getMediaUrl(getProductImage(trichoResult.product)!)
    : getMediaUrl((settings as any)?.promoBanners?.productBiotin, '/promos/promo_hair_biotin.jpg');

  // 6. RESPIRATORY LINE (Middle Promo 3)
  const respResult = findBestProduct([
    'respiratory',
    'ent',
    'cough',
    'cold',
    'balm',
    'bronchitis',
    'sinus',
    'allergy',
  ]);
  const respImg = respResult.product && getProductImage(respResult.product)
    ? getMediaUrl(getProductImage(respResult.product)!)
    : getMediaUrl((settings as any)?.promoBanners?.productRespiratory, '/promos/promo_respiratory.jpg');

  // 7. PEDIATRIC DIVISION (Bottom Promo 1)
  const pedResult = findBestProduct([
    'pediatric',
    'child',
    'infant',
    'drops',
    'syrup',
    'suspension',
    'dry syrup',
  ]);
  const pedImg = pedResult.product && getProductImage(pedResult.product)
    ? getMediaUrl(getProductImage(pedResult.product)!)
    : getMediaUrl((settings as any)?.promoBanners?.productPediatric, '/promos/promo_pediatric.jpg');

  // 8. DERMA CARE (Bottom Promo 2)
  const dermaResult = findBestProduct([
    'derma',
    'skin',
    'barrier',
    'cream',
    'lotion',
    'ointment',
    'antifungal',
  ]);
  const dermaImg = dermaResult.product && getProductImage(dermaResult.product)
    ? getMediaUrl(getProductImage(dermaResult.product)!)
    : getMediaUrl((settings as any)?.promoBanners?.productDerma, '/promos/promo_derma_barrier.jpg');

  return {
    multivitamin: {
      product: multiResult.product,
      image: multiImg,
      badge: multiResult.product && !multiResult.isCategoryMatch
        ? getCategoryName(multiResult.product).toUpperCase() || 'FEATURED FORMULATION'
        : 'DCGI & WHO-GMP APPROVED',
      title: multiResult.product
        ? multiResult.product.name
        : 'Multivitamin &\nWellness Range',
      subtitle: multiResult.product
        ? (multiResult.product.composition || 'High-Bioavailability Formulations Ready for Authorized Stockists Distribution.')
        : 'High-Bioavailability Formulations Ready for Authorized Stockists Distribution.',
      isMatchedFromCategory: multiResult.isCategoryMatch,
      isFallback: !multiResult.isCategoryMatch && multiResult.product !== null,
    },
    gynecology: {
      product: gynecResult.product,
      image: gynecImg,
      badge: gynecResult.product && !gynecResult.isCategoryMatch
        ? getCategoryName(gynecResult.product).toUpperCase() || 'SPECIALITY RANGE'
        : 'GYNECOLOGY',
      title: gynecResult.product
        ? gynecResult.product.name
        : "Women's Health Formulations",
      isMatchedFromCategory: gynecResult.isCategoryMatch,
      isFallback: !gynecResult.isCategoryMatch && gynecResult.product !== null,
    },
    nutraceuticals: {
      product: nutraResult.product,
      image: nutraImg,
      badge: nutraResult.product && !nutraResult.isCategoryMatch
        ? getCategoryName(nutraResult.product).toUpperCase() || 'WELLNESS LINE'
        : 'NUTRACEUTICALS',
      title: nutraResult.product
        ? nutraResult.product.name
        : 'Premium Wellness Extracts',
      isMatchedFromCategory: nutraResult.isCategoryMatch,
      isFallback: !nutraResult.isCategoryMatch && nutraResult.product !== null,
    },
    chronicCare: {
      product: chronicResult.product,
      image: chronicImg,
      badge: chronicResult.product && !chronicResult.isCategoryMatch
        ? getCategoryName(chronicResult.product).toUpperCase() || 'CARDIAC & DIABETIC'
        : 'CHRONIC CARE',
      title: chronicResult.product
        ? chronicResult.product.name
        : 'Cardiac & Diabetic Care Range',
      isMatchedFromCategory: chronicResult.isCategoryMatch,
      isFallback: !chronicResult.isCategoryMatch && chronicResult.product !== null,
    },
    dermaTrichology: {
      product: trichoResult.product,
      image: trichoImg,
      badge: trichoResult.product && !trichoResult.isCategoryMatch
        ? getCategoryName(trichoResult.product).toUpperCase() || 'HAIR & TRICHOLOGY'
        : 'DERMA TRICHOLOGY',
      title: trichoResult.product
        ? trichoResult.product.name
        : 'Biotin & Hair Follicle Care',
      isMatchedFromCategory: trichoResult.isCategoryMatch,
      isFallback: !trichoResult.isCategoryMatch && trichoResult.product !== null,
    },
    respiratoryLine: {
      product: respResult.product,
      image: respImg,
      badge: respResult.product && !respResult.isCategoryMatch
        ? getCategoryName(respResult.product).toUpperCase() || 'RESPIRATORY CARE'
        : 'RESPIRATORY LINE',
      title: respResult.product
        ? respResult.product.name
        : 'Cold, Cough & Balm Formulations',
      isMatchedFromCategory: respResult.isCategoryMatch,
      isFallback: !respResult.isCategoryMatch && respResult.product !== null,
    },
    pediatricDivision: {
      product: pedResult.product,
      image: pedImg,
      badge: pedResult.product && !pedResult.isCategoryMatch
        ? getCategoryName(pedResult.product).toUpperCase() || 'PEDIATRIC HEALTH'
        : 'PEDIATRIC DIVISION',
      title: pedResult.product
        ? pedResult.product.name
        : 'Pediatric Healthcare & Infant Therapeutics',
      desc: pedResult.product
        ? (pedResult.product.composition || 'Tested palatable dry syrups, oral drops, and child clinical healthcare range.')
        : 'Tested palatable dry syrups, oral drops, and child clinical healthcare range.',
      isMatchedFromCategory: pedResult.isCategoryMatch,
      isFallback: !pedResult.isCategoryMatch && pedResult.product !== null,
    },
    dermaCare: {
      product: dermaResult.product,
      image: dermaImg,
      badge: dermaResult.product && !dermaResult.isCategoryMatch
        ? getCategoryName(dermaResult.product).toUpperCase() || 'DERMATOLOGY'
        : 'DERMA CARE',
      title: dermaResult.product
        ? dermaResult.product.name
        : 'Dermatology & Barrier Formulations',
      desc: dermaResult.product
        ? (dermaResult.product.composition || 'Premium body butters, antifungal creams, and moisturizers.')
        : 'Premium body butters, antifungal creams, and moisturizers.',
      isMatchedFromCategory: dermaResult.isCategoryMatch,
      isFallback: !dermaResult.isCategoryMatch && dermaResult.product !== null,
    },
  };
};

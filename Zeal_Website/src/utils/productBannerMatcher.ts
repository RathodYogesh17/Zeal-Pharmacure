import type { IProduct } from '../types';
import { getMediaUrl } from './mediaUtils';

export interface ProductThemePalette {
  bg: string;
  border: string;
  shadow: string;
  tagStyle: {
    color: string;
    background: string;
    border?: string;
  };
  btnBg: string;
  btnShadow: string;
  textColor: string;
  accentColor: string;
}

export const THEME_PALETTES: Record<string, ProductThemePalette> = {
  // Orange / Sunset Amber (e.g. Acloz-SP, pain relief, orange/amber packs)
  orange: {
    bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    border: '#FED7AA',
    shadow: '0 4px 16px rgba(234, 88, 12, 0.08)',
    tagStyle: { color: '#C2410C', background: '#FFFFFF', border: '1px solid #FED7AA' },
    btnBg: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    btnShadow: '0 2px 8px rgba(234, 88, 12, 0.3)',
    textColor: '#7C2D12',
    accentColor: '#EA580C',
  },
  // Emerald / Mint Green (e.g. Lulizeal, herbal, green antifungal/creams)
  emerald: {
    bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    border: '#A7F3D0',
    shadow: '0 4px 16px rgba(5, 150, 105, 0.08)',
    tagStyle: { color: '#047857', background: '#FFFFFF', border: '1px solid #A7F3D0' },
    btnBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    btnShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
    textColor: '#064E3B',
    accentColor: '#059669',
  },
  // Royal Purple / Violet (e.g. Amloal-AT, Acloz-MR, Telmizeal, purple packs)
  purple: {
    bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    border: '#DDD6FE',
    shadow: '0 4px 16px rgba(124, 58, 237, 0.08)',
    tagStyle: { color: '#6D28D9', background: '#FFFFFF', border: '1px solid #DDD6FE' },
    btnBg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    btnShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
    textColor: '#3B0764',
    accentColor: '#7C3AED',
  },
  // Rose / Crimson / Ruby Red (e.g. Ferzeal-XT, Becozeal-PLUS, iron/blood packs)
  rose: {
    bg: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    border: '#FECDD3',
    shadow: '0 4px 16px rgba(225, 29, 72, 0.08)',
    tagStyle: { color: '#BE123C', background: '#FFFFFF', border: '1px solid #FECDD3' },
    btnBg: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
    btnShadow: '0 2px 8px rgba(225, 29, 72, 0.3)',
    textColor: '#881337',
    accentColor: '#E11D48',
  },
  // Coral Pink / Rose Petal (e.g. Calcizeal-Rose, rosehip, pink packs)
  pink: {
    bg: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
    border: '#FBCFE8',
    shadow: '0 4px 16px rgba(219, 39, 119, 0.08)',
    tagStyle: { color: '#BE185D', background: '#FFFFFF', border: '1px solid #FBCFE8' },
    btnBg: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    btnShadow: '0 2px 8px rgba(219, 39, 119, 0.3)',
    textColor: '#831843',
    accentColor: '#DB2777',
  },
  // Cyan / Sky Blue / Sapphire (e.g. Multivtaz, hair/biotin, blue packs)
  cyan: {
    bg: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
    border: '#BAE6FD',
    shadow: '0 4px 16px rgba(2, 132, 199, 0.08)',
    tagStyle: { color: '#0369A1', background: '#FFFFFF', border: '1px solid #BAE6FD' },
    btnBg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    btnShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
    textColor: '#082F49',
    accentColor: '#0284C7',
  },
  // Amber / Warm Honey (e.g. Gold vitamins, Omega, Zinc, yellow packs)
  amber: {
    bg: 'linear-gradient(135deg, #FEFCE8 0%, #FEF9C3 100%)',
    border: '#FEF08A',
    shadow: '0 4px 16px rgba(202, 138, 4, 0.08)',
    tagStyle: { color: '#854D0E', background: '#FFFFFF', border: '1px solid #FEF08A' },
    btnBg: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
    btnShadow: '0 2px 8px rgba(202, 138, 4, 0.3)',
    textColor: '#713F12',
    accentColor: '#CA8A04',
  },
  // Mauve / Soft Violet / Lilac (e.g. Zeal's Foot Cure cream)
  mauve: {
    bg: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
    border: '#E9D5FF',
    shadow: '0 4px 16px rgba(147, 51, 234, 0.08)',
    tagStyle: { color: '#7E22CE', background: '#FFFFFF', border: '1px solid #E9D5FF' },
    btnBg: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
    btnShadow: '0 2px 8px rgba(147, 51, 234, 0.3)',
    textColor: '#581C87',
    accentColor: '#9333EA',
  },
};

/**
 * Detect product packaging color and return harmonized matching theme
 */
export const resolveProductTheme = (
  product: IProduct | null,
  fallbackThemeKey: keyof typeof THEME_PALETTES = 'purple'
): ProductThemePalette => {
  if (!product) {
    return THEME_PALETTES[fallbackThemeKey] || THEME_PALETTES.purple;
  }

  const name = (product.name || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();
  const comp = (product.composition || '').toLowerCase();
  const cat = (typeof product.category === 'string' ? product.category : product.category?.name || '').toLowerCase();
  const text = `${name} ${slug} ${comp} ${cat}`;

  // 1. Explicit Product Overrides based on Real Packaging Photos
  if (text.includes('zealcovit')) {
    return THEME_PALETTES.emerald; // Zealcovit has vibrant fresh green vitality & multivitamin packaging
  }
  if (text.includes('nitrol') || text.includes('nitroglycerin')) {
    return THEME_PALETTES.pink; // Nitrol 2.6 has distinctive vibrant pink bottle packaging
  }
  if (text.includes('calcizeal-d3') || text.includes('cholecalciferol')) {
    return THEME_PALETTES.amber; // Calcizeal-D3 60K Sachet has radiant sunshine gold & orange packaging
  }
  if (text.includes('foot cure') || text.includes("zeal's foot cure")) {
    return THEME_PALETTES.mauve; // Zeal's Foot Cure has lilac / mauve packaging band
  }
  if (text.includes('acloz-sp') || text.includes('serratiopeptidase') || text.includes('aceclofenac + paracetamol + ser')) {
    return THEME_PALETTES.orange; // Acloz-SP is bright orange box
  }
  if (text.includes('lulizeal') || text.includes('luliconazole')) {
    return THEME_PALETTES.emerald; // Lulizeal is green tube/box
  }
  if (text.includes('ferzeal') || text.includes('iron & folic') || text.includes('ferrous')) {
    return THEME_PALETTES.rose; // Ferzeal-XT is bright red box
  }
  if (text.includes('calcizeal-rose') || text.includes('rosehip') || text.includes('rose ext')) {
    return THEME_PALETTES.pink; // Calcizeal-Rose is rose-pink box
  }
  if (text.includes('becozeal') || text.includes('b-complex')) {
    return THEME_PALETTES.rose; // Becozeal-PLUS has red & gold packaging
  }
  if (text.includes('amloal') || text.includes('acloz-mr') || text.includes('telmizeal')) {
    return THEME_PALETTES.purple; // Purple/Violet packaging
  }
  if (text.includes('multivtaz') || text.includes('hair grow') || text.includes('biotin')) {
    return THEME_PALETTES.cyan; // Cyan/Sapphire blue packaging
  }

  // 2. Keyword & Therapeutic Color Matching
  // Orange / Amber: Pain, Ortho, Joint relief
  if (text.includes('ortho') || text.includes('joint') || text.includes('pain') || text.includes('diclo') || text.includes('cissus')) {
    return THEME_PALETTES.orange;
  }

  // Emerald Green: Derma, Antifungal, Creams, Herbal, Gastro, Gut
  if (text.includes('derma') || text.includes('skin') || text.includes('cream') || text.includes('lotion') || text.includes('ointment') || text.includes('herbal') || text.includes('antifungal') || text.includes('barrier')) {
    return THEME_PALETTES.emerald;
  }

  // Rose / Crimson: Gynecology, Blood, Women's health
  if (text.includes('gynec') || text.includes('women') || text.includes('blood') || text.includes('folic') || text.includes('pregnancy')) {
    return THEME_PALETTES.rose;
  }

  // Cyan / Blue: Respiratory, Cold, Cough, Allergy, Sinus, Hair
  if (text.includes('respirat') || text.includes('cough') || text.includes('cold') || text.includes('sinus') || text.includes('allergy') || text.includes('hair')) {
    return THEME_PALETTES.cyan;
  }

  // Purple / Violet: Cardiology, Blood Pressure, Diabetes, Chronic, Neuro
  if (text.includes('cardio') || text.includes('hypertension') || text.includes('diabet') || text.includes('sugar') || text.includes('chronic') || text.includes('neuro') || text.includes('brain')) {
    return THEME_PALETTES.purple;
  }

  // Amber / Gold: Vitamins, Minerals, Nutra, Antioxidants
  if (text.includes('vitamin') || text.includes('mineral') || text.includes('supplement') || text.includes('d3') || text.includes('wellness') || text.includes('nutra')) {
    return THEME_PALETTES.amber;
  }

  return THEME_PALETTES[fallbackThemeKey] || THEME_PALETTES.purple;
};

export interface MatchedBannerData {
  product: IProduct | null;
  image: string;
  badge: string;
  title: string;
  subtitle?: string;
  desc?: string;
  theme: ProductThemePalette;
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
  if (typeof p.category === 'object' && p.category?.name) return p.category.name;
  if (p.subCategoryName) return p.subCategoryName;
  if (typeof p.subCategory === 'object' && p.subCategory?.name) return p.subCategory.name;
  if (typeof p.category === 'string' && !/^[0-9a-fA-F]{24}$/.test(p.category)) return p.category;

  const name = (p.name || '').toLowerCase();
  if (name.includes('zealcovit')) return 'Vitamins, Minerals & Supplements';
  if (name.includes('nitrol')) return 'Cardiology & Blood Pressure';
  if (name.includes('calcizeal-d3')) return 'Vitamins, Minerals & Supplements';
  if (name.includes('foot cure')) return 'Dermatology & Skin Care';
  if (name.includes('lulizeal')) return 'Dermatology & Skin Care';
  if (name.includes('amloal') || name.includes('telmi')) return 'Cardiology & Blood Pressure';
  if (name.includes('acloz-mr')) return 'Respiratory Line';
  if (name.includes('acloz-sp')) return 'Orthopedics & Pain Management';
  if (name.includes('multivtaz')) return 'Derma Trichology';
  if (name.includes('ferzeal')) return "Women's Health & Gynecology";
  if (name.includes('becozeal')) return 'Vitamins, Minerals & Supplements';
  return '';
};

/**
 * Match 8 distinct product banner slots from database products:
 * 1. NITROL 2.6 TAB (Hero Main Banner - Pink / Heart Care)
 * 2. CALCIZEAL-D3 60K SACHET (Hero Promo 1 - Amber Sunshine)
 * 3. ZEAL'S FOOT CURE 75 GM CREAM (Hero Promo 2 - Mauve / Derma)
 * 4. CHRONIC CARE (Middle Promo 1 - Amloal-AT)
 * 5. DERMA TRICHOLOGY (Middle Promo 2 - Multivtaz)
 * 6. RESPIRATORY LINE (Middle Promo 3 - Acloz-MR)
 * 7. PEDIATRIC DIVISION (Bottom Promo 1 - Acloz-SP / Pediatric)
 * 8. DERMA CARE (Bottom Promo 2 - Lulizeal 30 GM Cream)
 *
 * Each box's theme dynamically matches its product packaging color!
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

    // 1. Highest priority: Search keywords in order, requiring product to have an image
    for (const kw of keywords) {
      const match = products.find((p) => {
        if (usedProductIds.has(p._id)) return false;
        if (!getProductImage(p)) return false;
        const text = `${p.name || ''} ${p.composition || ''} ${getCategoryName(p)}`.toLowerCase();
        return text.includes(kw.toLowerCase());
      });
      if (match) {
        usedProductIds.add(match._id);
        return { product: match, isCategoryMatch: true };
      }
    }

    // 2. Second priority: Search keywords in order, even if image is pending
    for (const kw of keywords) {
      const match = products.find((p) => {
        if (usedProductIds.has(p._id)) return false;
        const text = `${p.name || ''} ${p.composition || ''} ${getCategoryName(p)}`.toLowerCase();
        return text.includes(kw.toLowerCase());
      });
      if (match) {
        usedProductIds.add(match._id);
        return { product: match, isCategoryMatch: true };
      }
    }

    // 3. Fallback: If category not in database, pick best available product from another category
    if (allowFallback) {
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

  // 1. Slot 1 (Hero Main): ZEALCOVIT TAB (Replaces NITROL 2.6 TAB)
  const slot1Result = findBestProduct([
    'zealcovit tab',
    'zealcovit',
    'grape seed',
    'multivitamine + multiminerals',
    'multivitamin',
    'wellness',
    'vitamins, minerals & supplements',
  ]);
  const isZealcovit = Boolean(slot1Result.product?.name?.toUpperCase().includes('ZEALCOVIT'));
  const slot1Img = isZealcovit
    ? '/promos/promo_zealcovit.jpg'
    : (slot1Result.product && getProductImage(slot1Result.product)
        ? getMediaUrl(getProductImage(slot1Result.product)!)
        : '/promos/promo_zealcovit.jpg');
  const slot1Theme = resolveProductTheme(slot1Result.product, 'emerald');

  // 2. Slot 2 (Hero Promo 1): CALCIZEAL-D3 60K SACHET (Replaces FERZEAL-XT TAB)
  const slot2Result = findBestProduct([
    'calcizeal-d3 60k sachet',
    'calcizeal-d3 sachet',
    'calcizeal-d3 60k',
    'calcizeal-d3',
    'cholecalciferol (vitamin d3) 60000 iu sachet',
    'cholecalciferol',
    'vitamins, minerals & supplements',
    'vitamins',
    'gynecology',
  ]);
  const slot2Img = slot2Result.product && getProductImage(slot2Result.product)
    ? getMediaUrl(getProductImage(slot2Result.product)!)
    : 'https://res.cloudinary.com/dll2ppcmu/image/upload/v1792402840/zeal-pharma/products/phetx7yqmptd4v6ivhjg.png';
  const slot2Theme = resolveProductTheme(slot2Result.product, 'amber');

  // 3. Slot 3 (Hero Promo 2): ZEAL\'S FOOT CURE 75 GM CREAM (Replaces CALCIZEAL-ROSE TAB)
  const slot3Result = findBestProduct([
    "zeal's foot cure 75 gm cream",
    "zeal's foot cure",
    'foot cure',
    'urea 10% w/w',
    'dermatology & skin care',
    'derma',
    'nutraceutical',
  ]);
  const slot3Img = slot3Result.product && getProductImage(slot3Result.product)
    ? getMediaUrl(getProductImage(slot3Result.product)!)
    : 'https://res.cloudinary.com/dll2ppcmu/image/upload/v1793946518/zeal-pharma/products/yfnk69mxxhzuxr8hi75v.png';
  const slot3Theme = resolveProductTheme(slot3Result.product, 'mauve');

  // 4. CHRONIC CARE (Middle Promo 1)
  const chronicResult = findBestProduct([
    'amloal-at tab',
    'amloal',
    'telmizeal',
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
  const chronicTheme = resolveProductTheme(chronicResult.product, 'purple');

  // 5. DERMA TRICHOLOGY (Middle Promo 2)
  const trichoResult = findBestProduct([
    'multivtaz hair grow+ tab',
    'multivtaz',
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
  const trichoTheme = resolveProductTheme(trichoResult.product, 'cyan');

  // 6. RESPIRATORY LINE (Middle Promo 3)
  const respResult = findBestProduct([
    'acloz-mr tab',
    'acloz-mr',
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
  const respTheme = resolveProductTheme(respResult.product, 'purple');

  // 7. PEDIATRIC DIVISION / FALLBACK (Bottom Promo 1)
  const pedResult = findBestProduct([
    'pediatric',
    'child',
    'infant',
    'drops',
    'syrup',
    'suspension',
    'dry syrup',
    'acloz-sp tab',
  ]);
  const pedImg = pedResult.product && getProductImage(pedResult.product)
    ? getMediaUrl(getProductImage(pedResult.product)!)
    : getMediaUrl((settings as any)?.promoBanners?.productPediatric, '/promos/promo_pediatric.jpg');
  const pedTheme = resolveProductTheme(pedResult.product, 'orange');

  // 8. DERMA CARE (Bottom Promo 2)
  const dermaResult = findBestProduct([
    'lulizeal 30 gm cream',
    'lulizeal',
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
  const dermaTheme = resolveProductTheme(dermaResult.product, 'emerald');

  return {
    multivitamin: {
      product: slot1Result.product,
      image: slot1Img,
      badge: slot1Result.product
        ? (getCategoryName(slot1Result.product).toUpperCase() || 'VITAMINS, MINERALS & SUPPLEMENTS')
        : 'VITAMINS, MINERALS & SUPPLEMENTS',
      title: slot1Result.product
        ? slot1Result.product.name
        : 'ZEALCOVIT TAB',
      subtitle: slot1Result.product
        ? (slot1Result.product.composition || 'Multivitamine + Multiminerals + Grape Seed + Antioxidants Tablet')
        : 'Multivitamine + Multiminerals + Grape Seed + Antioxidants Tablet',
      theme: slot1Theme,
      isMatchedFromCategory: slot1Result.isCategoryMatch,
      isFallback: !slot1Result.isCategoryMatch && slot1Result.product !== null,
    },
    gynecology: {
      product: slot2Result.product,
      image: slot2Img,
      badge: slot2Result.product
        ? (getCategoryName(slot2Result.product).toUpperCase() || 'VITAMINS & SUPPLEMENTS')
        : 'VITAMINS & SUPPLEMENTS',
      title: slot2Result.product
        ? slot2Result.product.name
        : 'CALCIZEAL-D3 60K SACHET',
      subtitle: slot2Result.product
        ? (slot2Result.product.composition || 'Cholecalciferol (Vitamin D3) 60000 IU Sachet')
        : 'Cholecalciferol (Vitamin D3) 60000 IU Sachet',
      theme: slot2Theme,
      isMatchedFromCategory: slot2Result.isCategoryMatch,
      isFallback: !slot2Result.isCategoryMatch && slot2Result.product !== null,
    },
    nutraceuticals: {
      product: slot3Result.product,
      image: slot3Img,
      badge: slot3Result.product
        ? (getCategoryName(slot3Result.product).toUpperCase() || 'DERMATOLOGY & SKIN CARE')
        : 'DERMATOLOGY & SKIN CARE',
      title: slot3Result.product
        ? slot3Result.product.name
        : "ZEAL'S FOOT CURE 75 GM CREAM",
      subtitle: slot3Result.product
        ? (slot3Result.product.composition || 'Urea, Propylene Glycol, Lactic Acid & Liquid Paraffin Cream')
        : 'Urea, Propylene Glycol, Lactic Acid & Liquid Paraffin Cream',
      theme: slot3Theme,
      isMatchedFromCategory: slot3Result.isCategoryMatch,
      isFallback: !slot3Result.isCategoryMatch && slot3Result.product !== null,
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
      theme: chronicTheme,
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
      theme: trichoTheme,
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
      theme: respTheme,
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
      theme: pedTheme,
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
      theme: dermaTheme,
      isMatchedFromCategory: dermaResult.isCategoryMatch,
      isFallback: !dermaResult.isCategoryMatch && dermaResult.product !== null,
    },
  };
};

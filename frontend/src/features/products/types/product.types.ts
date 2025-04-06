// 2. 제품 관련 타입 정의
// features/products/types/product.types.ts
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type ProductCategory = 'TOPS' | 'BOTTOMS' | 'DRESSES' | 'OUTERWEAR' | 'ACCESSORIES';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: ProductCategory;
  availableSizes: Size[];
  stock: Record<Size, number>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  sizes?: Size[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  search?: string;
}
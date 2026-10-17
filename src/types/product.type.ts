// src/redux/types/product.types.ts

export interface ProductImage {
  id?: number;
  product_variant_id?: string;
  image?: string;
}

export interface ProductVariant {
  id?: number;
  product_id?: string;
  sku: string;
  price: string;
  sale_price: string | null;
  thumbnail?: string | null;
  status?: string | boolean;
  images: ProductImage[];
  videos?: unknown[];
}

export interface ProductCategory {
  id?: number;
  name: string;
  slug?: string;
  icon?: string | null;
  image?: string | null;
  image_url?: string | null;
}

export interface ProductSubCategory {
  id?: number;
  category_id?: string | number;
  name: string;
  slug?: string;
  icon?: string | null;
  image?: string | null;
  image_url?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description?: string | null;
  thumbnail?: string | null;

  is_featured: boolean | string | number;
  status: boolean | string | number;

  category: string | ProductCategory;
  sub_category: string | ProductSubCategory;
  brand: string | null | Record<string, unknown>;

  category_id?: string | number;
  sub_category_id?: string | number;
  brand_id?: string | number | null;

  // This endpoint returns a single variant object.
  variant?: ProductVariant | null;

  // Retained for endpoints that return multiple variants.
  variants?: ProductVariant[];

  created_at?: string;
  updated_at?: string;
}

export interface ProductMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductPriceRange {
  min: number;
  max: number;
}

export interface ProductFilter {
  [key: string]: unknown;
}

export interface ProductsData {
  filters: ProductFilter[];
  price: ProductPriceRange;
  products: Product[];
  meta: ProductMeta;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: ProductsData;
}

export interface GetProductsParams {
  category_id?: number | string;
  is_featured?: boolean | number | string;
  [key: string]: unknown;
}
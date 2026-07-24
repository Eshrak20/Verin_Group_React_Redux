// src/redux/types/product.types.ts
export interface ProductImage {
  id: number;
  product_variant_id: string;
  image: string;
  image_url: string;
}

export interface ProductVariant {
  id: number;
  product_id: string;
  sku: string;
  price: string;
  sale_price: string;
  thumbnail: string | null;
  status: string;
  images: ProductImage[];
  videos: [];
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image: string;
  image_url: string;
}

export interface ProductSubCategory {
  id: number;
  category_id: string;
  name: string;
  slug: string;
  icon: string;
  image: string | null;
  image_url: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  thumbnail: string | null;
  is_featured: boolean | string | number;
  // is_featured: string;
  status: string;
  created_at: string;
  updated_at: string;
  category_id: string;
  sub_category_id: string;
  brand_id: string | null;
  category: ProductCategory;
  sub_category: ProductSubCategory;
  brand: null;
  variants: ProductVariant[];
}

export interface ProductMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: ProductMeta;
}

















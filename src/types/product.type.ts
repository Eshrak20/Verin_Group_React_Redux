
export interface ProductVariant {
  id?: number;
  product_id?: number;
  price: string;
  sale_price?: string;
  sku: string;
  thumbnail?: string | null;
  status?: boolean | string | number;
  images: string[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  thumbnail?: string | null;

  is_featured: boolean | string | number;
  status: boolean | string | number;

  category: string;
  sub_category: string;
  brand: string ;

  category_id?: string | number;
  sub_category_id?: string | number;
  brand_id?: string | number | null;

  // Product listing API returns a single variant object.
  variant?: ProductVariant | null;

  // Other endpoints may return multiple variants.
  variants?: ProductVariant[];

  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProductFilter {
  id: number;
  name: string;
  options: string[];
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

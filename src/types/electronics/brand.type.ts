export interface Category {
  id: number;
  name: string;
  image_url: string | null;
}

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  short_description: string;
  status: number;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  category: Category;
}

export interface BrandItem {
  id: number;
  sub_category_id: number;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  status: number;
  image_url: string | null;
  sub_category: SubCategory;
}

export interface BrandsApiResponse {
  status: boolean;
  data: BrandItem[];
}
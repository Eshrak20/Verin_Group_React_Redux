export interface ElecSubCategoryResponse {
  status: boolean;
  data: ElecSubCategory[];
}

export interface ElecSubCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  status: number;
  image_url: string | null;
  category: ElecSubCategoryCategory;
}

export interface ElecSubCategoryCategory {
  id: number;
  name: string;
  image_url: string | null;
}
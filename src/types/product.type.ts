export interface Product {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  stock: number;
  sku: string;
  brand: string;
  category: string;
  subCategory: string;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isHotSell: boolean;
  sizes: string[];
  colors: { name: string; code: string }[];
}
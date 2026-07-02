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
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  sizes: string[];
  colors: { name: string; code: string }[];
}
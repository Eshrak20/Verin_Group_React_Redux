import type { Product } from "@/types/product.type";

export function getDiscount(price: string | number, salePrice: string | number): number {
  const p = typeof price === "number" ? price : parseFloat(price);
  const s = typeof salePrice === "number" ? salePrice : parseFloat(salePrice);
  if (!s || s >= p) return 0;
  return Math.round(((p - s) / p) * 100);
}

export function getImage(product: Product): string {
  return (
    product.variants?.[0]?.images?.[0]?.image_url ||
    product.thumbnail ||
    "/placeholder.jpg"
  );
}

export function getDisplayPrice(price: string | number, salePrice: string | number): number {
  const p = typeof price === "number" ? price : parseFloat(price);
  const s = typeof salePrice === "number" ? salePrice : parseFloat(salePrice);
  return s > 0 && s < p ? s : p;
}




// ProductCatalog
export type SortOption =
  | "Newest First"
  | "Price Low to High"
  | "Price High to Low";

export const SORT_OPTIONS: SortOption[] = [
  "Newest First",
  "Price Low to High",
  "Price High to Low",
];

export const INITIAL_VISIBLE = 8;





// DecorFeaturedProducts

// src/hooks/useSearchProducts.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/product/product.api";

export function useSearchProducts() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("category_id");

  const { data, isLoading } = useGetProductsQuery(
    {
      search: query,
      ...(categoryId ? { category_id: Number(categoryId) } : {}),
      per_page: 100,
    },
    { skip: !query.trim() }
  );

  const allProducts = data?.data || [];

  const filteredProducts = allProducts.filter((product: any) => {
    const q = query.toLowerCase();
    const productName = product.name?.toLowerCase() || "";
    const productSku = product.sku?.toLowerCase() || "";

    const variantMatch = product.variants?.some((variant: any) =>
      variant.sku?.toLowerCase().includes(q)
    );

    const matchesSearch =
      productName.includes(q) || productSku.includes(q) || variantMatch;

    const matchesCategory = categoryId
      ? Number(product.category_id) === Number(categoryId) ||
        Number(product.category?.id) === Number(categoryId)
      : true;

    return matchesSearch && matchesCategory;
  });

  return {
    query,
    isLoading,
    filteredProducts,
  };
}
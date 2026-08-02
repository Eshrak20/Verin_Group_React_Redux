/* eslint-disable prefer-const */
/* eslint-disable react-hooks/purity */
// src/hooks/useProductCatalog.ts

import { useState, useMemo } from "react";
import type { Product } from "@/types/product.type";

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

export function useProductCatalog(products: Product[]) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("Newest First");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [animating, setAnimating] = useState(false);

  const allSubCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          products
            .map((p) => p.sub_category?.name)
            .filter(Boolean)
        )
      ),
    ],
    [products]
  );

  const visibleCategories = showAllCategories
    ? allSubCategories
    : allSubCategories.slice(0, INITIAL_VISIBLE);

  const handleCategoryChange = (cat: string, callback?: () => void) => {
    if (cat === selectedCategory) return;
    setAnimating(true);
    setTimeout(() => {
      setSelectedCategory(cat);
      setAnimating(false);
      callback?.();
    }, 250);
  };

  const shuffledProducts = useMemo(() => {
    if (!products.length) return [];
    const array = [...products];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    let result =
      selectedCategory === "All"
        ? [...shuffledProducts]
        : products.filter((p) => p.sub_category?.name === selectedCategory);

    if (sortBy === "Price Low to High") {
      result.sort(
        (a, b) =>
          Number(a.variants?.[0]?.price ?? 0) -
          Number(b.variants?.[0]?.price ?? 0)
      );
    } else if (sortBy === "Price High to Low") {
      result.sort(
        (a, b) =>
          Number(b.variants?.[0]?.price ?? 0) -
          Number(a.variants?.[0]?.price ?? 0)
      );
    } else if (sortBy === "Newest First" && selectedCategory !== "All") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [shuffledProducts, products, selectedCategory, sortBy]);

  return {
    selectedCategory,
    sortBy,
    setSortBy,
    showAllCategories,
    setShowAllCategories,
    animating,
    allSubCategories,
    visibleCategories,
    handleCategoryChange,
    filteredAndSorted,
  };
}
// src/hooks/useTestimonials.ts
import { useGetReviewsQuery } from "@/redux/services/homepage/homePage.api";

export interface ApiReview {
  id: number;
  client_name: string;
  client_position: string | null;
  client_image: string;
  rating: number | string;
  review: string;
  item: string;
  is_active: number | string;
  sort_order: number | string;
  created_at: string;
  updated_at: string;
  image_url: string;
}

export function useTestimonials() {
  const { data, isLoading, isError } = useGetReviewsQuery({});

  const reviewsList: ApiReview[] = data?.data ?? [];

  const activeReviews = [...reviewsList]
    .filter((item) => Number(item.is_active) === 1)
    .sort((a, b) => {
      const orderA = Number(a.sort_order) || 0;
      const orderB = Number(b.sort_order) || 0;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return {
    activeReviews,
    isLoading,
    isError,
  };
}
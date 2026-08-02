// src/utils/client.utils.ts

export interface ApiReview {
  id: number;
  client_name: string;
  client_position: string | null;
  client_image: string;
  rating: number;
  review: string;
  item: string;
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  image_url: string;
}

export function cleanReviewText(htmlString: string) {
  if (!htmlString) return "";
  const parser = new DOMParser();
  const decoded =
    parser.parseFromString(htmlString, "text/html").body.textContent || "";
  return decoded;
}
 export interface Category {
  id: number;
  name: string;
}

export interface Blog {
  id: number;
  title: string;
  title_bng: string | null;
  slug: string;
  content: string;
  content_bng: string | null;
  summary: string | null;
  summary_bng: string | null;
  excerpt: string | null;
  featured_image: string | null;
  category_id: number | null;
  category?: Category | null;
  author_id: number | null;
  status: string;
  created_at: string;
  image_url: string;
}



// src/components/modules/Blog/BlogSEO.tsx
import { Helmet } from "react-helmet-async";

interface BlogSEOProps {
  blog: {
    title: string;
    excerpt?: string | null;
    summary?: string | null;
    image_url?: string | null;
  };
  shareUrl: string;
}

export default function BlogSEO({ blog, shareUrl }: BlogSEOProps) {
  const description = blog.excerpt || blog.summary || "";
  const imageUrl = blog.image_url || "";

  return (
    <Helmet>
      <title>{blog.title} | Verin Group</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={blog.title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={shareUrl} />
      <meta property="og:site_name" content="Verin Group" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={blog.title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
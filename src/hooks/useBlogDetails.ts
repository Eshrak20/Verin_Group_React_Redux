/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/Blog/useBlogDetails.ts
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetBlogQuery } from "@/redux/services/homepage/homePage.api";
import { useGetProductsQuery } from "@/redux/services/product/product.api";

interface Blog {
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
  author_id: number | null;
  status: string;
  created_at: string;
  image_url: string;
}

export function useBlogDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBangla, setIsBangla] = useState(true);
  const [copied, setCopied] = useState(false);

  const { data: blogData, isLoading, isError } = useGetBlogQuery();
  const { data: productsData } = useGetProductsQuery({});

  const rawBlogs: Blog[] = blogData?.data ?? [];
  
  const products = useMemo(() => {
    return productsData?.data ?? [];
  }, [productsData?.data]);

  const suggestedProducts = useMemo(() => {
    if (!products || !products.length) return [];

    const blogIdNum = Number(id) || (id ? id.length : 1);
    
    return [...products]
      .sort((a: any, b: any) => {
        const hashA = (Number(a.id || 0) * 17 + blogIdNum * 31) % 97;
        const hashB = (Number(b.id || 0) * 17 + blogIdNum * 31) % 97;
        return hashA - hashB;
      })
      .slice(0, 5);
  }, [products, id]);

  const currentBlog = rawBlogs.find(
    (b) => b.id === Number(id) || b.slug === id
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const formatDate = (dateString: string, isBn: boolean) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const title = isBangla
    ? currentBlog?.title_bng || currentBlog?.title
    : currentBlog?.title;

  const excerpt = isBangla
    ? currentBlog?.summary_bng || currentBlog?.excerpt || currentBlog?.summary
    : currentBlog?.excerpt || currentBlog?.summary;

  const content = isBangla
    ? currentBlog?.content_bng || currentBlog?.content
    : currentBlog?.content;

  const date = currentBlog ? formatDate(currentBlog.created_at, isBangla) : "";

  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const cleanPath = window.location.pathname.replace(/\s+/g, "-");
  
  const shareUrl = isLocalhost 
    ? `https://v.veringroup.com${cleanPath}` 
    : `${window.location.origin}${cleanPath}`;

  return {
    id,
    navigate,
    isBangla,
    setIsBangla,
    copied,
    isLoading,
    isError,
    currentBlog,
    suggestedProducts,
    title: title || "",
    excerpt,
    content,
    date,
    shareUrl,
    handleCopyLink,
  };
}
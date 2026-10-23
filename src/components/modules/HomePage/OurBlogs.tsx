// src/components/OurBlogs.tsx
import { useGetBlogQuery } from "@/redux/services/homepage/homePage.api";
import { motion } from "framer-motion";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

// 🎯 আপনার এডমিন প্যানেলের ক্যাটাগরি আইডি এবং নাম ম্যাপ করা হলো
const BLOG_CATEGORIES: Record<number, string> = {
  1: "Tech",
  2: "Business",
  3: "Lifestyle",
  4: "Education",
};

interface Category {
  id: number;
  name: string;
}

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
  category?: Category | null; // যদি ব্যাকএন্ড অবজেক্ট ফিল্ড পাঠায়
  author_id: number | null;
  status: string;
  created_at: string;
  image_url: string;
}

export default function OurBlogs() {
  const [isBangla, setIsBangla] = useState(true);

  // Lazy Fetching Observer Setup
  const { ref: containerRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: "300px",
  });

  const { data, isLoading, isError } = useGetBlogQuery(undefined, {
    skip: !inView,
  });

  const rawBlogs: Blog[] = data?.data ?? [];

  // ১. শুধুমাত্র Published ব্লগ নেওয়া
  // ২. slice(0, 6) দিয়ে সর্বোচ্চ ৬টি ব্লগ ফিল্টার করা
  const blogs = rawBlogs
    .filter((blog) => blog.status === "published")
    .slice(0, 6);

  // Date Format Helper
  const formatDate = (dateString: string, isBn: boolean) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // HTML tag রিমুভ করার জন্য হেল্পার ফাংশন
  const stripHtml = (html: string | null) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  // 🎯 Dynamic Category Name (বাংলা / ইংরেজি যেকোনো ভাষাতেই ইংরেজি দেখাবে)
  const getCategoryName = (blog: Blog): string => {
    if (blog.category?.name) return blog.category.name;
    if (blog.category_id && BLOG_CATEGORIES[blog.category_id]) {
      return BLOG_CATEGORIES[blog.category_id];
    }
    return "General";
  };

  // Loading / Before InView Skeleton State
  if (!inView || isLoading) {
    return (
      <section
        ref={containerRef}
        className="py-8 sm:py-10 lg:py-12 max-w-6xl mx-auto w-full px-4"
      >
        <div className="text-center mb-6">
          <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse" />
          <div className="w-12 h-0.5 bg-gray-300 mx-auto mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-72 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Error অথবা No Data Handle
  if (isError || blogs.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="py-8 sm:py-10 lg:py-12">
      {/* Header Scroll Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold home-black-text">
          Our Blogs
        </h2>
        <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2" />
      </motion.div>

      {/* Top Row — Toggle + View All */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center justify-between gap-3 mb-6"
      >
        {/* Language Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-800 rounded-full p-1 border border-gray-100 dark:border-slate-700">
          <button
            onClick={() => setIsBangla(true)}
            className={`
              px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs hover:cursor-pointer font-semibold transition-all duration-300
              ${
                isBangla
                  ? "bg-[#262626] hover:bg-[#003557] text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              }
            `}
          >
            বাংলা
          </button>
          <button
            onClick={() => setIsBangla(false)}
            className={`
              px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs hover:cursor-pointer font-semibold transition-all duration-300
              ${
                !isBangla
                  ? "bg-[#262626] hover:bg-[#003557] text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              }
            `}
          >
            English
          </button>
        </div>

        {/* View All Button */}
        <Link
          to="/blogs"
          className="text-xs sm:text-sm py-2 px-3 rounded-full
                  border border-[#00416A]/30 home-black-text  
                  transition-all duration-300 hover:border-[#a5abaf]
                  hover:bg-gray-200/60"
        >
          {isBangla ? "সব ব্লগ দেখুন" : "View All Blogs"}
        </Link>
      </motion.div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map((blog, index) => {
          const title = isBangla
            ? blog.title_bng || blog.title
            : blog.title;

          const rawExcerpt = isBangla
            ? blog.summary_bng || blog.excerpt || blog.summary
            : blog.excerpt || blog.summary;
          const excerpt = stripHtml(rawExcerpt);

          const date = formatDate(blog.created_at, isBangla);

          // 🎯 Category Name (সর্বদা ইংরেজিতে দেখাবে: Business, Tech, etc.)
          const categoryName = getCategoryName(blog);

          return (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="h-full"
            >
              <Link
                to={`/blogs/${blog.slug || blog.id}`}
                className="
                  group bg-white dark:bg-slate-800
                  border border-gray-200 dark:border-slate-700
                  rounded-2xl overflow-hidden
                  hover:shadow-lg transition-all duration-300
                  flex flex-col h-full
                "
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden aspect-video bg-gray-100 dark:bg-slate-700">
                  <img
                    src={blog.image_url}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x220/e2e8f0/94a3b8?text=Blog+Image";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  {/* Category + Date */}
                  <div className="flex items-center justify-between">
                    {/* 🎯 বাংলা সুইচ করলেও সবসময় ইংরেজি Category (Tech, Business...) দেখাবে */}
                    <span
                      className="
                      text-xs font-semibold px-3 py-1 rounded-full
                      bg-blue-50 dark:bg-blue-900/30
                      home-black-text capitalize
                    "
                    >
                      {categoryName}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="
                    text-sm font-bold home-black-text
                    line-clamp-2 leading-snug
                    transition-colors duration-200
                  "
                  >
                    {title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
                    {excerpt}
                  </p>

                  {/* Read More */}
                  <span
                    className="
                    text-xs font-semibold home-black-text group-hover:underline
                    transition-colors duration-200 mt-1
                  "
                  >
                    {isBangla ? "আরও পড়ুন →" : "Read More →"}
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
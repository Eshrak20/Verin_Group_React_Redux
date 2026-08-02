// src/components/modules/HomePage/BlogCard.tsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BlogCardProps {
  blog: {
    id: number;
    title: string;
    title_bng: string | null;
    slug: string;
    summary: string | null;
    summary_bng: string | null;
    excerpt: string | null;
    created_at: string;
    image_url: string;
  };
  index: number;
  isBangla: boolean;
  categoryName: string;
  formatDate: (dateString: string, isBn: boolean) => string;
  stripHtml: (html: string | null) => string;
}

export default function BlogCard({
  blog,
  index,
  isBangla,
  categoryName,
  formatDate,
  stripHtml,
}: BlogCardProps) {
  const title = isBangla ? blog.title_bng || blog.title : blog.title;
  const rawExcerpt = isBangla
    ? blog.summary_bng || blog.excerpt || blog.summary
    : blog.excerpt || blog.summary;
  const excerpt = stripHtml(rawExcerpt);
  const date = formatDate(blog.created_at, isBangla);

  return (
    <motion.div
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

        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
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

          <h3
            className="
              text-sm font-bold home-black-text
              line-clamp-2 leading-snug
              transition-colors duration-200
            "
          >
            {title}
          </h3>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
            {excerpt}
          </p>

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
}
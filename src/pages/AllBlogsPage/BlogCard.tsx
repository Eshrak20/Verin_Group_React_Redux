/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BlogCardProps {
  blog: any;
  index: number;
  isBangla: boolean;
  formatDate: (dateString: string, isBn: boolean) => string;
  getCategoryName: (blog: any) => string;
}

export default function BlogCard({
  blog,
  index,
  isBangla,
  formatDate,
  getCategoryName,
}: BlogCardProps) {
  const title = isBangla ? blog.title_bng || blog.title : blog.title;
  const excerpt = isBangla
    ? blog.summary_bng || blog.excerpt || blog.summary
    : blog.excerpt || blog.summary;
  const date = formatDate(blog.created_at, isBangla);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.15,
        ease: "easeOut",
      }}
    >
      <Link
        to={`/blogs/${blog.slug || blog.id}`}
        className="
          group bg-white dark:bg-slate-800
          border border-gray-200 dark:border-slate-700
          rounded-2xl overflow-hidden
          shadow-sm hover:shadow-xl hover:-translate-y-1.5
          transition-all duration-300 ease-out
          flex flex-col h-full
        "
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-video bg-gray-100 dark:bg-slate-700">
          <img
            src={blog.image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/400x220/e2e8f0/94a3b8?text=Blog+Image";
            }}
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* Category + Date */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 home-black-text transition-transform duration-300 group-hover:scale-105 capitalize">
              {getCategoryName(blog)}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {date}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold home-black-text line-clamp-2 leading-snug transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
            {excerpt}
          </p>

          {/* Read More */}
          <span className="text-xs font-semibold home-black-text hover:underline inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1 mt-1">
            {isBangla ? "আরও পড়ুন →" : "Read More →"}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
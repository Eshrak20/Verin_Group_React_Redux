// src/components/modules/Blog/BlogContent.tsx
import { motion } from "framer-motion";

interface BlogContentProps {
  title: string;
  date: string;
  excerpt: string | null | undefined; 
  content: string | null | undefined;
  imageUrl: string;
}

export default function BlogContent({ title, date, excerpt, content, imageUrl }: BlogContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-6 md:p-8 shadow-sm space-y-5 transition-all duration-500 hover:shadow-md"
    >
      <div className="text-[11px] text-gray-400 font-medium">
        Home &gt; <span className="text-black dark:text-white">Blog </span>
      </div>

      <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-snug transition-colors duration-300">
        {title}
      </h1>

      <div className="text-[11px] text-gray-400 font-medium pb-2 flex flex-wrap gap-2">
        <span>By Admin • </span>
        <span>{date}</span>
      </div>

      {excerpt && (
        <div 
          className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium transition-opacity duration-300 prose dark:prose-invert max-w-none 
            [&_strong]:font-bold [&_b]:font-bold [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_b]:text-slate-900 dark:[&_b]:text-white
            [&_h1]:text-base [&_h1]:font-extrabold [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h1]:mt-3 [&_h1]:mb-1
            [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-2 [&_h2]:mb-1
            [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-gray-200 [&_h3]:mt-2 [&_h3]:mb-1"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      )}

      <div className="rounded-xl overflow-hidden aspect-video border dark:border-slate-700 bg-gray-50 dark:bg-slate-950 group">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/800x450/e2e8f0/94a3b8?text=Blog+Image";
          }}
        />
      </div>

      <div
        className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-5 leading-relaxed pt-2 prose dark:prose-invert max-w-none transition-all duration-300 
          [&_strong]:font-bold [&_b]:font-bold [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_b]:text-slate-900 dark:[&_b]:text-white
          [&_h1]:text-lg [&_h1]:font-black [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h1]:mt-4 [&_h1]:mb-2
          [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-3 [&_h2]:mb-2
          [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-gray-200 [&_h3]:mt-2 [&_h3]:mb-1"
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
    </motion.div>
  );
}
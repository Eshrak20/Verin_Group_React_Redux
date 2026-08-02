
import { useGetBlogQuery } from "@/redux/services/homepage/homePage.api";
import { useState } from "react";
import BlogSkeleton from "./BlogSkeleton";
import BlogHeaderSection from "./BlogHeaderSection";
import BlogCard from "./BlogCard";
import type { Blog } from "@/types/blogs.type";


const BLOG_CATEGORIES: Record<number, string> = {
  1: "Tech",
  2: "Business",
  3: "Lifestyle",
  4: "Education",
};


export default function BlogsPage() {
  const [isBangla, setIsBangla] = useState(true);

  // RTK Query hook call
  const { data, isLoading, isError } = useGetBlogQuery();

  const rawBlogs: Blog[] = data?.data ?? [];


  const blogs = rawBlogs.filter((blog) => blog.status === "published");

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


  const getCategoryName = (blog: Blog): string => {
    if (blog.category?.name) return blog.category.name;
    if (blog.category_id && BLOG_CATEGORIES[blog.category_id]) {
      return BLOG_CATEGORIES[blog.category_id];
    }
    return "General";
  };

  // Loading State UI Loader
  if (isLoading) {
    return <BlogSkeleton />;
  }


  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-medium animate-pulse">
        {isBangla ? "ব্লগ ডেটা লোড করতে সমস্যা হয়েছে।" : "Failed to load blogs."}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 lg:px-0 max-w-7xl mx-auto transition-colors duration-300">
      {/* Top Header Section */}
      <BlogHeaderSection isBangla={isBangla} setIsBangla={setIsBangla} />

      {/* Empty State */}
      {blogs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {isBangla ? "কোনো ব্লগ পাওয়া যায়নি।" : "No blogs found."}
        </div>
      ) : (
        /* Blog Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              index={index}
              isBangla={isBangla}
              formatDate={formatDate}
              getCategoryName={getCategoryName}
            />
          ))}
        </div>
      )}
    </div>
  );
}













// import { useGetBlogQuery } from "@/redux/services/homepage/homePage.api";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// // 🎯 ক্যাটাগরি আইডি থেকে ইংরেজি নামের ম্যাপ
// const BLOG_CATEGORIES: Record<number, string> = {
//   1: "Tech",
//   2: "Business",
//   3: "Lifestyle",
//   4: "Education",
// };

// interface Category {
//   id: number;
//   name: string;
// }

// interface Blog {
//   id: number;
//   title: string;
//   title_bng: string | null;
//   slug: string;
//   content: string;
//   content_bng: string | null;
//   summary: string | null;
//   summary_bng: string | null;
//   excerpt: string | null;
//   featured_image: string | null;
//   category_id: number | null;
//   category?: Category | null;
//   author_id: number | null;
//   status: string;
//   created_at: string;
//   image_url: string;
// }

// export default function BlogsPage() {
//   const [isBangla, setIsBangla] = useState(true);

//   // RTK Query hook call
//   const { data, isLoading, isError } = useGetBlogQuery();

//   const rawBlogs: Blog[] = data?.data ?? [];

//   // Published ব্লগ ফিল্টার করা
//   const blogs = rawBlogs.filter((blog) => blog.status === "published");

//   // Date Format Helper
//   const formatDate = (dateString: string, isBn: boolean) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // 🎯 Dynamic Category Name Helper (সবসময় ইংরেজিতে রিটার্ন করবে)
//   const getCategoryName = (blog: Blog): string => {
//     if (blog.category?.name) return blog.category.name;
//     if (blog.category_id && BLOG_CATEGORIES[blog.category_id]) {
//       return BLOG_CATEGORIES[blog.category_id];
//     }
//     return "General";
//   };

//   // Loading State UI Loader
//   if (isLoading) {
//     return (
//       <div className="min-h-screen py-8 px-4 lg:px-0 max-w-7xl mx-auto">
//         <div className="mb-6 animate-pulse">
//           <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-3 animate-pulse" />
//           <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-2 animate-pulse" />
//           <div className="h-4 w-full max-w-xl bg-gray-200 dark:bg-slate-700 rounded mt-2 animate-pulse" />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3, 4, 5, 6].map((n) => (
//             <div
//               key={n}
//               className="h-72 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse border border-gray-200/50 dark:border-slate-700"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Error অথবা No Data State
//   if (isError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500 font-medium animate-pulse">
//         {isBangla ? "ব্লগ ডেটা লোড করতে সমস্যা হয়েছে।" : "Failed to load blogs."}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen py-8 px-4 lg:px-0 max-w-7xl mx-auto transition-colors duration-300">
//       {/* Top Header Section */}
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="mb-6"
//       >
//         {/* Breadcrumb */}
//         <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
//           <Link to="/" className="text-blue-600 hover:underline transition-colors duration-200">
//             Home
//           </Link>
//           <span>»</span>
//           <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded transition-colors duration-300">
//             {isBangla ? "সব ব্লগ পেজ" : "Welcome to all blogs page"}
//           </span>
//         </div>

//         {/* Title & Language Toggle in Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
//             {isBangla ? "সকল ব্লগ" : "All blogs"}
//           </h1>

//           {/* Language Toggle */}
//           <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-full p-1 w-fit border dark:border-slate-700 shadow-sm transition-colors duration-300">
//             <button
//               onClick={() => setIsBangla(true)}
//               className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 transform ${
//                 isBangla
//                   ? "bg-[#262626] text-white shadow-md scale-105"
//                   : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
//               }`}
//             >
//               বাংলা
//             </button>
//             <button
//               onClick={() => setIsBangla(false)}
//               className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 transform ${
//                 !isBangla
//                   ? "bg-[#262626] text-white shadow-md scale-105"
//                   : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
//               }`}
//             >
//               English
//             </button>
//           </div>
//         </div>

//         {/* Subtitle / Description */}
//         <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-3xl leading-relaxed transition-all duration-300">
//           {isBangla
//             ? "আমাদের সাম্প্রতিক চিন্তা, গল্প এবং টিপস এক্সপ্লোর করুন। আপনার নতুন কিছু শেখা ও জানার আগ্রহকে বাড়াতে ট্রেন্ড, টিউটোরিয়াল এবং বিশেষজ্ঞ পরামর্শের সাথে যুক্ত থাকুন।"
//             : "Explore our latest insights, stories, and tips on. Stay updated with trends, tutorials, and expert advice to fuel your curiosity and growth."}
//         </p>

//         {/* Divider Line */}
//         <hr className="mt-6 border-gray-200 dark:border-slate-700 transition-colors duration-300" />
//       </motion.div>

//       {/* Empty State */}
//       {blogs.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           {isBangla ? "কোনো ব্লগ পাওয়া যায়নি।" : "No blogs found."}
//         </div>
//       ) : (
//         /* Blog Grid */
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {blogs.map((blog, index) => {
//             const title = isBangla
//               ? blog.title_bng || blog.title
//               : blog.title;
//             const excerpt = isBangla
//               ? blog.summary_bng || blog.excerpt || blog.summary
//               : blog.excerpt || blog.summary;
//             const date = formatDate(blog.created_at, isBangla);

//             return (
//               <motion.div
//                 key={blog.id}
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-50px" }}
//                 transition={{
//                   duration: 0.5,
//                   delay: (index % 3) * 0.15, // একটার পর একটা নিচ থেকে আসার জন্য সিকুয়েন্সিয়াল বিলম্ব
//                   ease: "easeOut",
//                 }}
//               >
//                 <Link
//                   to={`/blogs/${blog.slug || blog.id}`}
//                   className="
//                     group bg-white dark:bg-slate-800
//                     border border-gray-200 dark:border-slate-700
//                     rounded-2xl overflow-hidden
//                     shadow-sm hover:shadow-xl hover:-translate-y-1.5
//                     transition-all duration-300 ease-out
//                     flex flex-col h-full
//                   "
//                 >
//                   {/* Thumbnail */}
//                   <div className="relative overflow-hidden aspect-video bg-gray-100 dark:bg-slate-700">
//                     <img
//                       src={blog.image_url}
//                       alt={title}
//                       className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "https://placehold.co/400x220/e2e8f0/94a3b8?text=Blog+Image";
//                       }}
//                     />
//                     <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//                   </div>

//                   {/* Content */}
//                   <div className="p-4 flex flex-col gap-2 flex-1">
//                     {/* Category + Date */}
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 home-black-text transition-transform duration-300 group-hover:scale-105 capitalize">
//                         {getCategoryName(blog)}
//                       </span>
//                       <span className="text-xs text-gray-400 dark:text-gray-500">
//                         {date}
//                       </span>
//                     </div>

//                     {/* Title */}
//                     <h3 className="text-sm font-bold home-black-text line-clamp-2 leading-snug transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
//                       {title}
//                     </h3>

//                     {/* Excerpt */}
//                     <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
//                       {excerpt}
//                     </p>

//                     {/* Read More */}
//                     <span className="text-xs font-semibold home-black-text hover:underline inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1 mt-1">
//                       {isBangla ? "আরও পড়ুন →" : "Read More →"}
//                     </span>
//                   </div>
//                 </Link>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }







// import { useGetBlogQuery } from "@/redux/services/homepage/homePage.api";
// import { useState } from "react";
// import { Link } from "react-router-dom";



// interface Blog {
//   id: number;
//   title: string;
//   title_bng: string | null;
//   slug: string;
//   content: string;
//   content_bng: string | null;
//   summary: string | null;
//   summary_bng: string | null;
//   excerpt: string | null;
//   featured_image: string | null;
//   category_id: number | null;
//   author_id: number | null;
//   status: string;
//   created_at: string;
//   image_url: string;
// }

// export default function BlogsPage() {
//   const [isBangla, setIsBangla] = useState(true);

//   // RTK Query hook call
//   const { data, isLoading, isError } = useGetBlogQuery();

//   const rawBlogs: Blog[] = data?.data ?? [];

//   // Published ব্লগ ফিল্টার করা
//   const blogs = rawBlogs.filter((blog) => blog.status === "published");

//   // Date Format Helper
//   const formatDate = (dateString: string, isBn: boolean) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // Loading State UI Loader
//   if (isLoading) {
//     return (
//       <div className="min-h-screen py-8 px-4 lg:px-0 max-w-7xl mx-auto">
//         <div className="mb-6 animate-pulse">
//           <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-3" />
//           <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
//           <div className="h-4 w-full max-w-xl bg-gray-200 dark:bg-slate-700 rounded mt-2" />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3, 4, 5, 6].map((n) => (
//             <div
//               key={n}
//               className="h-72 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Error অথবা No Data State
//   if (isError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         {isBangla ? "ব্লগ ডেটা লোড করতে সমস্যা হয়েছে।" : "Failed to load blogs."}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen py-8 px-4 lg:px-0 max-w-7xl mx-auto">
//       {/* Top Header Section */}
//       <div className="mb-6">
//         {/* Breadcrumb */}
//         <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
//           <Link to="/" className="text-blue-600 hover:underline">
//             Home
//           </Link>
//           <span>»</span>
//           <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
//             {isBangla ? "সব ব্লগ পেজ" : "Welcome to all blogs page"}
//           </span>
//         </div>

//         {/* Title & Language Toggle in Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
//             {isBangla ? "সকল ব্লগ" : "All blogs"}
//           </h1>

//           {/* Language Toggle */}
//           <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-full p-1 w-fit">
//             <button
//               onClick={() => setIsBangla(true)}
//               className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
//                 isBangla
//                   ? "bg-[#262626] text-white shadow-sm"
//                   : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
//               }`}
//             >
//               বাংলা
//             </button>
//             <button
//               onClick={() => setIsBangla(false)}
//               className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
//                 !isBangla
//                   ? "bg-[#262626] text-white shadow-sm"
//                   : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
//               }`}
//             >
//               English
//             </button>
//           </div>
//         </div>

//         {/* Subtitle / Description */}
//         <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-3xl leading-relaxed">
//           {isBangla
//             ? "আমাদের সাম্প্রতিক চিন্তা, গল্প এবং টিপস এক্সপ্লোর করুন। আপনার নতুন কিছু শেখা ও জানার আগ্রহকে বাড়াতে ট্রেন্ড, টিউটোরিয়াল এবং বিশেষজ্ঞ পরামর্শের সাথে যুক্ত থাকুন।"
//             : "Explore our latest insights, stories, and tips on. Stay updated with trends, tutorials, and expert advice to fuel your curiosity and growth."}
//         </p>

//         {/* Divider Line */}
//         <hr className="mt-6 border-gray-200 dark:border-slate-700" />
//       </div>

//       {/* Empty State */}
//       {blogs.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           {isBangla ? "কোনো ব্লগ পাওয়া যায়নি।" : "No blogs found."}
//         </div>
//       ) : (
//         /* Blog Grid */
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {blogs.map((blog) => {
//             const title = isBangla
//               ? blog.title_bng || blog.title
//               : blog.title;
//             const excerpt = isBangla
//               ? blog.summary_bng || blog.excerpt || blog.summary
//               : blog.excerpt || blog.summary;
//             const date = formatDate(blog.created_at, isBangla);

//             return (
//               <Link
//                 key={blog.id}
//                 to={`/blogs/${blog.slug || blog.id}`}
//                 className="
//                   group bg-white dark:bg-slate-800
//                   border border-gray-200 dark:border-slate-700
//                   rounded-2xl overflow-hidden
//                   hover:shadow-lg transition-all duration-300
//                   flex flex-col
//                 "
//               >
//                 {/* Thumbnail */}
//                 <div className="relative overflow-hidden aspect-video bg-gray-100 dark:bg-slate-700">
//                   <img
//                     src={blog.image_url}
//                     alt={title}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src =
//                         "https://placehold.co/400x220/e2e8f0/94a3b8?text=Blog+Image";
//                     }}
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="p-4 flex flex-col gap-2 flex-1">
//                   {/* Category + Date */}
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 home-black-text">
//                       {isBangla ? "টিউটোরিয়াল" : "Tutorial"}
//                     </span>
//                     <span className="text-xs text-gray-400 dark:text-gray-500">
//                       {date}
//                     </span>
//                   </div>

//                   {/* Title */}
//                   <h3 className="text-sm font-bold home-black-text line-clamp-2 leading-snug transition-colors duration-200">
//                     {title}
//                   </h3>

//                   {/* Excerpt */}
//                   <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
//                     {excerpt}
//                   </p>

//                   {/* Read More */}
//                   <span className="text-xs font-semibold home-black-text hover:underline transition-colors duration-200 mt-1">
//                     {isBangla ? "আরও পড়ুন →" : "Read More →"}
//                   </span>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }










// import { useState } from "react";
// import { Link } from "react-router-dom";

// interface Blog {
//   id: number;
//   image: string;
//   categoryBn: string;
//   categoryEn: string;
//   titleBn: string;
//   titleEn: string;
//   excerptBn: string;
//   excerptEn: string;
//   dateBn: string;
//   dateEn: string;
//   path: string;
// }

// const blogs: Blog[] = [
//   {
//     id: 1,
//     image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847868/blog6_snmspo.jpg",
//     categoryBn: "টিউটোরিয়াল",
//     categoryEn: "Tutorial",
//     titleBn: "CPU বনাম GPU আর্কিটেকচার: সিকোয়েন্শিয়াল বনাম প্যারালাল এক্সিকিউশন",
//     titleEn: "CPU vs GPU Architecture: Sequential Logic vs Parallel Execution",
//     excerptBn: "একটি ব্লগ পোস্টে বিস্তারিত জানুন কীভাবে CPU এবং GPU একে অপরের থেকে আলাদা এবং কোন কাজে কোনটি বেশি কার্যকর।",
//     excerptEn: "Learn in detail how CPU and GPU differ from each other and which is more effective for which tasks.",
//     dateBn: "জুলাই ১, ২০২৪",
//     dateEn: "July 1, 2024",
//     path: "/blogs/1",
//   },
//   {
//     id: 2,
//     image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog1_z95qzk.jpg",
//     categoryBn: "টিউটোরিয়াল",
//     categoryEn: "Tutorial",
//     titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
//     titleEn: "Why TypeScript is a Game-Changer for Developers",
//     excerptBn: "TypeScript হল JavaScript এর একটি সুপারসেট যা স্ট্যাটিক টাইপিং যোগ করে এবং কোডের মান উন্নত করে।",
//     excerptEn: "TypeScript is a superset of JavaScript that adds static typing and significantly improves code quality.",
//     dateBn: "জুলাই ২, ২০২৪",
//     dateEn: "July 2, 2024",
//     path: "/blogs/2",
//   },
//   {
//     id: 3,
//     image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog4_bczxvg.jpg",
//     categoryBn: "টিউটোরিয়াল",
//     categoryEn: "Tutorial",
//     titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
//     titleEn: "Why TypeScript is a Game-Changer for Developers",
//     excerptBn: "TypeScript হল একটি প্রোগ্রামিং ল্যাঙ্গুয়েজ যা JavaScript এর উপর ভিত্তি করে তৈরি।",
//     excerptEn: "TypeScript is a programming language built on top of JavaScript that provides many benefits in large projects.",
//     dateBn: "জুলাই ২, ২০২৪",
//     dateEn: "July 2, 2024",
//     path: "/blogs/3",
//   },
//   {
//     id: 4,
//     image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog2_pblwwx.jpg",
//     categoryBn: "টিউটোরিয়াল",
//     categoryEn: "Tutorial",
//     titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
//     titleEn: "Why TypeScript is a Game-Changer for Developers",
//     excerptBn: "TypeScript ব্যবহার করে আপনি কোড লেখার সময় অনেক ভুল আগেই ধরতে পারবেন।",
//     excerptEn: "Using TypeScript, you can catch many mistakes while writing code that could have caused runtime problems.",
//     dateBn: "জুলাই ২, ২০২৪",
//     dateEn: "July 2, 2024",
//     path: "/blogs/4",
//   },
//   {
//     id: 5,
//     image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog3_rmvs5h.jpg",
//     categoryBn: "টিউটোরিয়াল",
//     categoryEn: "Tutorial",
//     titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
//     titleEn: "Why TypeScript is a Game-Changer for Developers",
//     excerptBn: "আধুনিক ওয়েব ডেভেলপমেন্টে TypeScript এর ভূমিকা দিন দিন আরও গুরুত্বপূর্ণ হয়ে উঠছে।",
//     excerptEn: "The role of TypeScript in modern web development is becoming increasingly important day by day.",
//     dateBn: "জুলাই ২, ২০২৪",
//     dateEn: "July 2, 2024",
//     path: "/blogs/5",
//   },
//   {
//     id: 6,
//     image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847868/blog5_bkqlqm.jpg",
//     categoryBn: "টিউটোরিয়াল",
//     categoryEn: "Tutorial",
//     titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
//     titleEn: "Why TypeScript is a Game-Changer for Developers",
//     excerptBn: "TypeScript শিখলে আপনি React, Node.js সহ অনেক ফ্রেমওয়ার্কে আরও দক্ষতার সাথে কাজ করতে পারবেন।",
//     excerptEn: "Learning TypeScript will allow you to work more efficiently with React, Node.js and many other frameworks.",
//     dateBn: "জুলাই ২, ২০২৪",
//     dateEn: "July 2, 2024",
//     path: "/blogs/6",
//   },
// ];

// export default function BlogsPage() {
//   const [isBangla, setIsBangla] = useState(true);

//   return (
//     <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//       {/* Top Header Section (Screenshot Layout) */}
//       <div className="mb-6">
//         {/* Breadcrumb */}
//         <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
//           <Link to="/" className="text-blue-600 hover:underline">
//             Home
//           </Link>
//           <span>»</span>
//           <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
//             {isBangla ? "সব ব্লগ পেজ" : "Welcome to all blogs page"}
//           </span>
//         </div>

//         {/* Title & Language Toggle in Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
//             {isBangla ? "সকল ব্লগ" : "All blogs"}
//           </h1>

//           {/* Language Toggle */}
//           <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-full p-1 w-fit">
//             <button
//               onClick={() => setIsBangla(true)}
//               className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
//                 isBangla
//                   ? "bg-[#262626] text-white shadow-sm"
//                   : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
//               }`}
//             >
//               বাংলা
//             </button>
//             <button
//               onClick={() => setIsBangla(false)}
//               className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
//                 !isBangla
//                   ? "bg-[#262626] text-white shadow-sm"
//                   : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
//               }`}
//             >
//               English
//             </button>
//           </div>
//         </div>

//         {/* Subtitle / Description */}
//         <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-3xl leading-relaxed">
//           {isBangla
//             ? "আমাদের সাম্প্রতিক চিন্তা, গল্প এবং টিপস এক্সপ্লোর করুন। আপনার নতুন কিছু শেখা ও জানার আগ্রহকে বাড়াতে ট্রেন্ড, টিউটোরিয়াল এবং বিশেষজ্ঞ পরামর্শের সাথে যুক্ত থাকুন।"
//             : "Explore our latest insights, stories, and tips on. Stay updated with trends, tutorials, and expert advice to fuel your curiosity and growth."}
//         </p>

//         {/* Divider Line */}
//         <hr className="mt-6 border-gray-200 dark:border-slate-700" />
//       </div>

//       {/* Blog Grid (Identical Card UI from OurBlogs) */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {blogs.map((blog) => (
//           <Link
//             key={blog.id}
//             to={blog.path}
//             className="
//               group bg-white dark:bg-slate-800
//               border border-gray-200 dark:border-slate-700
//               rounded-2xl overflow-hidden
//               hover:shadow-lg transition-all duration-300
//               flex flex-col
//             "
//           >
//             {/* Thumbnail */}
//             <div className="relative overflow-hidden aspect-video bg-gray-100 dark:bg-slate-700">
//               <img
//                 src={blog.image}
//                 alt={isBangla ? blog.titleBn : blog.titleEn}
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src =
//                     "https://placehold.co/400x220/e2e8f0/94a3b8?text=Blog+Image";
//                 }}
//               />
//             </div>

//             {/* Content */}
//             <div className="p-4 flex flex-col gap-2 flex-1">
//               {/* Category + Date */}
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 home-black-text">
//                   {isBangla ? blog.categoryBn : blog.categoryEn}
//                 </span>
//                 <span className="text-xs text-gray-400 dark:text-gray-500">
//                   {isBangla ? blog.dateBn : blog.dateEn}
//                 </span>
//               </div>

//               {/* Title */}
//               <h3 className="text-sm font-bold home-black-text line-clamp-2 leading-snug transition-colors duration-200">
//                 {isBangla ? blog.titleBn : blog.titleEn}
//               </h3>

//               {/* Excerpt */}
//               <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
//                 {isBangla ? blog.excerptBn : blog.excerptEn}
//               </p>

//               {/* Read More */}
//               <span className="text-xs font-semibold home-black-text hover:underline transition-colors duration-200 mt-1">
//                 {isBangla ? "আরও পড়ুন →" : "Read More →"}
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
// src/components/OurBlogs.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

interface Blog {
  id: number;
  image: string;
  categoryBn: string;
  categoryEn: string;
  titleBn: string;
  titleEn: string;
  excerptBn: string;
  excerptEn: string;
  dateBn: string;
  dateEn: string;
  path: string;
}

const blogs: Blog[] = [
  {
    id: 1,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847868/blog6_snmspo.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "CPU বনাম GPU আর্কিটেকচার: সিকোয়েন্শিয়াল বনাম প্যারালাল এক্সিকিউশন",
    titleEn: "CPU vs GPU Architecture: Sequential Logic vs Parallel Execution",
    excerptBn: "একটি ব্লগ পোস্টে বিস্তারিত জানুন কীভাবে CPU এবং GPU একে অপরের থেকে আলাদা এবং কোন কাজে কোনটি বেশি কার্যকর।",
    excerptEn: "Learn in detail how CPU and GPU differ from each other and which is more effective for which tasks.",
    dateBn: "জুলাই ১, ২০২৪",
    dateEn: "July 1, 2024",
    path: "/blogs/1",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog1_z95qzk.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
    titleEn: "Why TypeScript is a Game-Changer for Developers",
    excerptBn: "TypeScript হল JavaScript এর একটি সুপারসেট যা স্ট্যাটিক টাইপিং যোগ করে এবং কোডের মান উন্নত করে।",
    excerptEn: "TypeScript is a superset of JavaScript that adds static typing and significantly improves code quality.",
    dateBn: "জুলাই ২, ২০২৪",
    dateEn: "July 2, 2024",
    path: "/blogs/2",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog4_bczxvg.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
    titleEn: "Why TypeScript is a Game-Changer for Developers",
    excerptBn: "TypeScript হল একটি প্রোগ্রামিং ল্যাঙ্গুয়েজ যা JavaScript এর উপর ভিত্তি করে তৈরি।",
    excerptEn: "TypeScript is a programming language built on top of JavaScript that provides many benefits in large projects.",
    dateBn: "জুলাই ২, ২০২৪",
    dateEn: "July 2, 2024",
    path: "/blogs/3",
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog2_pblwwx.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
    titleEn: "Why TypeScript is a Game-Changer for Developers",
    excerptBn: "TypeScript ব্যবহার করে আপনি কোড লেখার সময় অনেক ভুল আগেই ধরতে পারবেন।",
    excerptEn: "Using TypeScript, you can catch many mistakes while writing code that could have caused runtime problems.",
    dateBn: "জুলাই ২, ২০২৪",
    dateEn: "July 2, 2024",
    path: "/blogs/4",
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog3_rmvs5h.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
    titleEn: "Why TypeScript is a Game-Changer for Developers",
    excerptBn: "আধুনিক ওয়েব ডেভেলপমেন্টে TypeScript এর ভূমিকা দিন দিন আরও গুরুত্বপূর্ণ হয়ে উঠছে।",
    excerptEn: "The role of TypeScript in modern web development is becoming increasingly important day by day.",
    dateBn: "জুলাই ২, ২০২৪",
    dateEn: "July 2, 2024",
    path: "/blogs/5",
  },
  {
    id: 6,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847868/blog5_bkqlqm.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
    titleEn: "Why TypeScript is a Game-Changer for Developers",
    excerptBn: "TypeScript শিখলে আপনি React, Node.js সহ অনেক ফ্রেমওয়ার্কে আরও দক্ষতার সাথে কাজ করতে পারবেন।",
    excerptEn: "Learning TypeScript will allow you to work more efficiently with React, Node.js and many other frameworks.",
    dateBn: "জুলাই ২, ২০২৪",
    dateEn: "July 2, 2024",
    path: "/blogs/6",
  },
];

export default function OurBlogs() {
  const [isBangla, setIsBangla] = useState(true);

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold home-black-text">
          Our Blogs
        </h2>
        <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2" />
      </div>

      {/* Top Row — Toggle + View All */}
      <div className="flex items-center justify-between gap-3 mb-6">
        {/* Language Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-800 rounded-full p-1">
          <button
            onClick={() => setIsBangla(true)}
            className={`
              px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs hover:cursor-pointer font-semibold transition-all duration-300
              ${isBangla
                ? "bg-[#262626] hover:bg-[#003557] hover:cursor-pointer text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:cursor-pointer hover:text-gray-700 dark:hover:text-white"
              }
            `}
          >
            বাংলা
          </button>
          <button
            onClick={() => setIsBangla(false)}
            className={`
              px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs hover:cursor-pointer font-semibold transition-all duration-300
              ${!isBangla
                ? "bg-[#262626] hover:bg-[#003557] hover:cursor-pointer text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:cursor-pointer hover:text-gray-700 dark:hover:text-white"
              }
            `}
          >
            English
          </button>
        </div>

        {/* View All */}
        <Link
          to="/blogs"
          className="text-xs sm:text-sm home-black-text hover:underline transition-colors duration-200"
        >
          {isBangla ? "সব ব্লগ দেখুন" : "View All Blogs"}
        </Link>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            to={blog.path}
            className="
              group bg-white dark:bg-slate-800
              border border-gray-200 dark:border-slate-700
              rounded-2xl overflow-hidden
              hover:shadow-lg transition-all duration-300
              flex flex-col
            "
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden aspect-video bg-gray-100 dark:bg-slate-700">
              <img
                src={blog.image}
                alt={isBangla ? blog.titleBn : blog.titleEn}
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
                <span className="
                  text-xs font-semibold px-3 py-1 rounded-full
                  bg-blue-50 dark:bg-blue-900/30
                  home-black-text
                ">
                  {isBangla ? blog.categoryBn : blog.categoryEn}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {isBangla ? blog.dateBn : blog.dateEn}
                </span>
              </div>

              {/* Title */}
              <h3 className="
                text-sm font-bold home-black-text
                line-clamp-2 leading-snug
                 transition-colors duration-200
              ">
                {isBangla ? blog.titleBn : blog.titleEn}
              </h3>

              {/* Excerpt */}
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
                {isBangla ? blog.excerptBn : blog.excerptEn}
              </p>

              {/* Read More */}
              <span className="
                text-xs font-semibold home-black-text  hover:underline
                transition-colors duration-200 mt-1
              ">
                {isBangla ? "আরও পড়ুন →" : "Read More →"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}









// // src/components/OurBlogs.tsx
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

// export default function OurBlogs() {
//   const [isBangla, setIsBangla] = useState(true);

//   return (
//     <section className="py-12">
//       {/* Header */}
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-bold home-black-text">
//           Our Blogs
//         </h2>
//         <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2" />
//       </div>

//       {/* Top Row — Toggle + View All */}
//       <div className="flex items-center justify-between mb-6">
//         {/* Language Toggle */}
//         <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full p-1">
//           <button
//             onClick={() => setIsBangla(true)}
//             className={`
//               px-4 py-1.5 rounded-full text-xs hover:cursor-pointer font-semibold transition-all duration-300
//               ${isBangla
//                 ? "bg-[#262626] hover:bg-[#003557] hover:cursor-pointer text-white shadow-sm"
//                 : "text-gray-500 dark:text-gray-400 hover:cursor-pointer hover:text-gray-700 dark:hover:text-white"
//               }
//             `}
//           >
//             বাংলা
//           </button>
//           <button
//             onClick={() => setIsBangla(false)}
//             className={`
//               px-4 py-1.5 rounded-full text-xs hover:cursor-pointer font-semibold transition-all duration-300
//               ${!isBangla
//                 ? "bg-[#262626] hover:bg-[#003557] hover:cursor-pointer text-white shadow-sm"
//                 : "text-gray-500 dark:text-gray-400 hover:cursor-pointer hover:text-gray-700 dark:hover:text-white"
//               }
//             `}
//           >
//             English
//           </button>
//         </div>

//         {/* View All */}
//         <Link
//           to="/blogs"
//           className="text-sm home-black-text hover:text-blue-600 hover:underline transition-colors duration-200"
//         >
//           {isBangla ? "সব ব্লগ দেখুন" : "View All Blogs"}
//         </Link>
//       </div>

//       {/* Blog Grid */}
//       <div className="grid grid-cols-3 gap-5">
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
//                 <span className="
//                   text-xs font-semibold px-3 py-1 rounded-full
//                   bg-blue-50 dark:bg-blue-900/30
//                   home-black-text
//                 ">
//                   {isBangla ? blog.categoryBn : blog.categoryEn}
//                 </span>
//                 <span className="text-xs text-gray-400 dark:text-gray-500">
//                   {isBangla ? blog.dateBn : blog.dateEn}
//                 </span>
//               </div>

//               {/* Title */}
//               <h3 className="
//                 text-sm font-bold home-black-text
//                 line-clamp-2 leading-snug
//                  transition-colors duration-200
//               ">
//                 {isBangla ? blog.titleBn : blog.titleEn}
//               </h3>

//               {/* Excerpt */}
//               <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
//                 {isBangla ? blog.excerptBn : blog.excerptEn}
//               </p>

//               {/* Read More */}
//               <span className="
//                 text-xs font-semibold home-black-text  hover:underline
//                 transition-colors duration-200 mt-1
//               ">
//                 {isBangla ? "আরও পড়ুন →" : "Read More →"}
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// }
// src/pages/TestimonialsPage.tsx
import { motion } from "framer-motion";
import { useTestimonials } from "@/hooks/useTestimonials";
import TestimonialsHeader from "./TestimonialsHeader";
import TestimonialsSkeleton from "./TestimonialsSkeleton";
import TestimonialCard from "./TestimonialCard";


export default function TestimonialsPage() {
  const { activeReviews, isLoading, isError } = useTestimonials();

  return (
    <div className="min-h-screen py-12 lg:px-0 px-4 max-w-7xl mx-auto overflow-hidden">
      {/* Header Scroll Animation */}
      <TestimonialsHeader />

      {/* Loading Skeleton */}
      {isLoading && <TestimonialsSkeleton />}

      {/* Error State */}
      {isError && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-red-500 font-medium">
            Failed to load testimonials. Please try again later.
          </p>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && activeReviews.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 dark:text-gray-400">
            No testimonials found at the moment.
          </p>
        </motion.div>
      )}

      {/* All Testimonials Grid */}
      {!isLoading && !isError && activeReviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeReviews.map((t, index) => (
            <TestimonialCard key={t.id} testimonial={t} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}











// import { useGetReviewsQuery } from "@/redux/services/homepage/homePage.api";
// import { motion } from "framer-motion";

// // API Response Item Type Definition
// interface ApiReview {
//   id: number;
//   client_name: string;
//   client_position: string | null;
//   client_image: string;
//   rating: number | string;
//   review: string;
//   item: string;
//   is_active: number | string;
//   sort_order: number | string;
//   created_at: string;
//   updated_at: string;
//   image_url: string;
// }

// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex gap-0.5">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <svg
//           key={star}
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill={star <= rating ? "#FBBF24" : "#E5E7EB"}
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//         </svg>
//       ))}
//     </div>
//   );
// }

// function Avatar({ src, name }: { src: string; name: string }) {
//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
//       <img
//         src={src}
//         alt={name}
//         className="w-full h-full object-cover"
//         onError={(e) => {
//           const target = e.target as HTMLImageElement;
//           target.style.display = "none";
//           const parent = target.parentElement;
//           if (parent) {
//             const existingInitials = parent.querySelector('.avatar-initials');
//             if(!existingInitials) {
//                 const span = document.createElement('span');
//                 span.className = "avatar-initials text-base font-bold text-blue-600 dark:text-blue-300";
//                 span.textContent = initials;
//                 parent.appendChild(span);
//             }
//           }
//         }}
//       />
//     </div>
//   );
// }

// function cleanReviewText(htmlString: string) {
//   if (!htmlString) return "";
//   const parser = new DOMParser();
//   return parser.parseFromString(htmlString, "text/html").body.textContent || "";
// }

// export default function TestimonialsPage() {
//   const { data, isLoading, isError } = useGetReviewsQuery({});

//   const reviewsList: ApiReview[] = data?.data ?? [];

//   // 🎯 Dynamic Sorting: প্রথমে sort_order দিয়ে, সমান হলে created_at (Latest first) অনুযায়ী
//   const activeReviews = [...reviewsList]
//     .filter((item) => Number(item.is_active) === 1)
//     .sort((a, b) => {
//       const orderA = Number(a.sort_order) || 0;
//       const orderB = Number(b.sort_order) || 0;

//       if (orderA !== orderB) {
//         return orderA - orderB; // ছোট sort_order আগে দেখাবে (Ascending)
//       }

//       // sort_order সমান হলে সাম্প্রতিক তৈরি হওয়া রিভিও আগে দেখাবে (Descending)
//       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
//     });

//   return (
//     <div className="min-h-screen py-12 lg:px-0 px-4 max-w-7xl mx-auto overflow-hidden">
//       {/* Header Scroll Animation */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.5 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="text-center mb-12"
//       >
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
//           Client Testimonials
//         </h1>
//         <div className="w-16 h-1 bg-[#262626] dark:bg-white mx-auto mt-3 mb-4 rounded-full" />
//         <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//           Read what our valued customers have to say about their experiences with our products and services.
//         </p>
//       </motion.div>

//       {/* Loading Skeleton */}
//       {isLoading && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3, 4, 5, 6].map((n) => (
//             <div
//               key={n}
//               className="h-60 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse p-6 flex flex-col gap-4"
//             >
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700" />
//                 <div className="flex-1 space-y-2">
//                   <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
//                   <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
//                 </div>
//               </div>
//               <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mt-2" />
//               <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
//               <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-full mt-auto" />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Error State */}
//       {isError && (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center py-12"
//         >
//           <p className="text-red-500 font-medium">
//             Failed to load testimonials. Please try again later.
//           </p>
//         </motion.div>
//       )}

//       {/* Empty State */}
//       {!isLoading && !isError && activeReviews.length === 0 && (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center py-12"
//         >
//           <p className="text-gray-500 dark:text-gray-400">
//             No testimonials found at the moment.
//           </p>
//         </motion.div>
//       )}

//       {/* All Testimonials Grid */}
//       {!isLoading && !isError && activeReviews.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {activeReviews.map((t, index) => {
//             const formattedDate = new Date(t.created_at).toLocaleDateString("en-GB", {
//               day: "numeric",
//               month: "long",
//               year: "numeric",
//             });

//             return (
//               <motion.div
//                 key={t.id}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, amount: 0.2 }}
//                 transition={{
//                   duration: 0.5,
//                   delay: index * 0.1,
//                   ease: "easeOut",
//                 }}
//                 className="
//                   bg-white dark:bg-slate-800
//                   border border-gray-200 dark:border-slate-700
//                   rounded-2xl p-6 flex flex-col gap-4
//                   shadow-sm hover:shadow-md transition-shadow duration-300
//                   h-full
//                 "
//               >
//                 {/* Top — Avatar + Name & Date */}
//                 <div className="flex items-center gap-4">
//                   <Avatar src={t.image_url} name={t.client_name} />
//                   <div>
//                     <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//                       {t.client_name}
//                     </h3>
//                     <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
//                       {formattedDate}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Review Text */}
//                 <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
//                   "{cleanReviewText(t.review)}"
//                 </p>

//                 {/* Bottom — Stars + Category Badge */}
//                 <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-slate-700/50">
//                   <StarRating rating={Number(t.rating) || 5} />
//                   {t.item && (
//                     <span className="text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-600">
//                       {t.item}
//                     </span>
//                   )}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }










// import { useGetReviewsQuery } from "@/redux/services/homepage/homePage.api";
// import { motion } from "framer-motion"; // 🎯 Framer Motion Import

// // API Response Item Type Definition
// interface ApiReview {
//   id: number;
//   client_name: string;
//   client_position: string | null;
//   client_image: string;
//   rating: number | string;
//   review: string;
//   item: string;
//   is_active: number | string;
//   sort_order: number | string;
//   created_at: string;
//   updated_at: string;
//   image_url: string;
// }

// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex gap-0.5">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <svg
//           key={star}
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill={star <= rating ? "#FBBF24" : "#E5E7EB"}
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//         </svg>
//       ))}
//     </div>
//   );
// }

// function Avatar({ src, name }: { src: string; name: string }) {
//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
//       <img
//         src={src}
//         alt={name}
//         className="w-full h-full object-cover"
//         onError={(e) => {
//           const target = e.target as HTMLImageElement;
//           target.style.display = "none";
//           const parent = target.parentElement;
//           if (parent) {
//             // পরিষ্কার করার জন্য আগের কন্টেন্ট রিমুভ করে ইনিশিয়াল বসানো হচ্ছে
//             const existingInitials = parent.querySelector('.avatar-initials');
//             if(!existingInitials) {
//                 const span = document.createElement('span');
//                 span.className = "avatar-initials text-base font-bold text-blue-600 dark:text-blue-300";
//                 span.textContent = initials;
//                 parent.appendChild(span);
//             }
//           }
//         }}
//       />
//     </div>
//   );
// }

// function cleanReviewText(htmlString: string) {
//   if (!htmlString) return "";
//   const parser = new DOMParser();
//   return parser.parseFromString(htmlString, "text/html").body.textContent || "";
// }

// export default function TestimonialsPage() {
//   const { data, isLoading, isError } = useGetReviewsQuery({});

//   const reviewsList: ApiReview[] = data?.data ?? [];

//   const activeReviews = [...reviewsList]
//     .filter((item) => Number(item.is_active) === 1)
//     .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

//   return (
//     <div className="min-h-screen py-12 lg:px-0 px-4 max-w-7xl mx-auto overflow-hidden"> {/* overflow-hidden added to prevent scrollbar during animation */}
//       {/* 🎯 Header Scroll Animation */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.5 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="text-center mb-12"
//       >
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
//           Client Testimonials
//         </h1>
//         <div className="w-16 h-1 bg-[#262626] dark:bg-white mx-auto mt-3 mb-4 rounded-full" />
//         <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//           Read what our valued customers have to say about their experiences with our products and services.
//         </p>
//       </motion.div>

//       {/* Loading Skeleton */}
//       {isLoading && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3, 4, 5, 6].map((n) => (
//             <div
//               key={n}
//               className="h-60 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse p-6 flex flex-col gap-4"
//             >
//                 <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700" />
//                     <div className="flex-1 space-y-2">
//                         <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
//                         <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
//                     </div>
//                 </div>
//                 <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mt-2" />
//                 <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
//                 <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-full mt-auto" />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Error State */}
//       {isError && (
//         <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-12"
//         >
//           <p className="text-red-500 font-medium">
//             Failed to load testimonials. Please try again later.
//           </p>
//         </motion.div>
//       )}

//       {/* Empty State */}
//       {!isLoading && !isError && activeReviews.length === 0 && (
//         <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-12"
//         >
//           <p className="text-gray-500 dark:text-gray-400">
//             No testimonials found at the moment.
//           </p>
//         </motion.div>
//       )}

//       {/* All Testimonials Grid */}
//       {!isLoading && !isError && activeReviews.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {activeReviews.map((t, index) => {
//             const formattedDate = new Date(t.created_at).toLocaleDateString("en-GB", {
//               day: "numeric",
//               month: "long",
//               year: "numeric",
//             });

//             return (
//               /* 🎯 Scroll Staggered Entrance Animation for Cards */
//               <motion.div
//                 key={t.id}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, amount: 0.2 }}
//                 transition={{
//                   duration: 0.5,
//                   delay: index * 0.1, // Staggered delay based on index
//                   ease: "easeOut",
//                 }}
//                 className="
//                   bg-white dark:bg-slate-800
//                   border border-gray-200 dark:border-slate-700
//                   rounded-2xl p-6 flex flex-col gap-4
//                   shadow-sm hover:shadow-md transition-shadow duration-300
//                   h-full {/* Ensure full height for grid alignment */}
//                 "
//               >
//                 {/* Top — Avatar + Name & Date */}
//                 <div className="flex items-center gap-4">
//                   <Avatar src={t.image_url} name={t.client_name} />
//                   <div>
//                     <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//                       {t.client_name}
//                     </h3>
//                     <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
//                       {formattedDate}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Review Text */}
//                 <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
//                   "{cleanReviewText(t.review)}"
//                 </p>

//                 {/* Bottom — Stars + Category Badge */}
//                 <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-slate-700/50">
//                   <StarRating rating={Number(t.rating) || 5} />
//                   {t.item && (
//                     <span className="text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-600">
//                       {t.item}
//                     </span>
//                   )}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }









// import { useGetReviewsQuery } from "@/redux/services/homepage/homePage.api";

// // API Response Item Type Definition (সঠিক টাইপ দিয়ে আপডেট করা হয়েছে)
// interface ApiReview {
//   id: number;
//   client_name: string;
//   client_position: string | null;
//   client_image: string;
//   rating: number | string;
//   review: string;
//   item: string;
//   is_active: number | string;
//   sort_order: number | string;
//   created_at: string;
//   updated_at: string;
//   image_url: string;
// }

// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex gap-0.5">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <svg
//           key={star}
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill={star <= rating ? "#FBBF24" : "#E5E7EB"}
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//         </svg>
//       ))}
//     </div>
//   );
// }

// function Avatar({ src, name }: { src: string; name: string }) {
//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
//       <img
//         src={src}
//         alt={name}
//         className="w-full h-full object-cover"
//         onError={(e) => {
//           const target = e.target as HTMLImageElement;
//           target.style.display = "none";
//           const parent = target.parentElement;
//           if (parent) {
//             parent.innerHTML = `<span class="text-base font-bold text-blue-600 dark:text-blue-300">${initials}</span>`;
//           }
//         }}
//       />
//     </div>
//   );
// }

// function cleanReviewText(htmlString: string) {
//   if (!htmlString) return "";
//   const parser = new DOMParser();
//   return parser.parseFromString(htmlString, "text/html").body.textContent || "";
// }

// export default function TestimonialsPage() {
//   const { data, isLoading, isError } = useGetReviewsQuery({});

//   const reviewsList: ApiReview[] = data?.data ?? [];

//   // ✅ number এবং string উভয় ফরম্যাট সেইফলি হ্যান্ডেল করার জন্য Number() চেক ব্যবহার করা হয়েছে
//   const activeReviews = [...reviewsList]
//     .filter((item) => Number(item.is_active) === 1)
//     .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

//   return (
//     <div className="min-h-screen py-12 lg:px-0 px-4 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
//           Client Testimonials
//         </h1>
//         <div className="w-16 h-1 bg-[#262626] dark:bg-white mx-auto mt-3 mb-4 rounded-full" />
//         <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//           Read what our valued customers have to say about their experiences with our products and services.
//         </p>
//       </div>

//       {/* Loading Skeleton */}
//       {isLoading && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3, 4, 5, 6].map((n) => (
//             <div
//               key={n}
//               className="h-48 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse p-6 flex flex-col justify-between"
//             />
//           ))}
//         </div>
//       )}

//       {/* Error State */}
//       {isError && (
//         <div className="text-center py-12">
//           <p className="text-red-500 font-medium">
//             Failed to load testimonials. Please try again later.
//           </p>
//         </div>
//       )}

//       {/* Empty State */}
//       {!isLoading && !isError && activeReviews.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500 dark:text-gray-400">
//             No testimonials found at the moment.
//           </p>
//         </div>
//       )}

//       {/* All Testimonials Grid */}
//       {!isLoading && !isError && activeReviews.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {activeReviews.map((t) => {
//             const formattedDate = new Date(t.created_at).toLocaleDateString("en-GB", {
//               day: "numeric",
//               month: "long",
//               year: "numeric",
//             });

//             return (
//               <div
//                 key={t.id}
//                 className="
//                   bg-white dark:bg-slate-800
//                   border border-gray-200 dark:border-slate-700
//                   rounded-2xl p-6 flex flex-col gap-4
//                   shadow-sm hover:shadow-md transition-shadow duration-300
//                 "
//               >
//                 {/* Top — Avatar + Name & Date */}
//                 <div className="flex items-center gap-4">
//                   <Avatar src={t.image_url} name={t.client_name} />
//                   <div>
//                     <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//                       {t.client_name}
//                     </h3>
//                     <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
//                       {formattedDate}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Review Text */}
//                 <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
//                   "{cleanReviewText(t.review)}"
//                 </p>

//                 {/* Bottom — Stars + Category Badge */}
//                 <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/50">
//                   <StarRating rating={Number(t.rating) || 5} />
//                   {t.item && (
//                     <span className="text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-600">
//                       {t.item}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }






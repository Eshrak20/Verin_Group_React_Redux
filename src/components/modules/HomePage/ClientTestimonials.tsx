import { useGetReviewsQuery } from "@/redux/services/homepage/homePage.api";
import { Link } from "react-router";
import { motion } from "framer-motion";

interface ApiReview {
  id: number;
  client_name: string;
  client_position: string | null;
  client_image: string;
  rating: number;
  review: string;
  item: string;
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  image_url: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#FBBF24" : "#E5E7EB"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ src, name }: { src: string; name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<span class="text-sm font-bold text-blue-600 dark:text-blue-300">${initials}</span>`;
          }
        }}
      />
    </div>
  );
}

function cleanReviewText(htmlString: string) {
  if (!htmlString) return "";
  const parser = new DOMParser();
  const decoded = parser.parseFromString(htmlString, "text/html").body.textContent || "";
  return decoded;
}

export default function ClientTestimonials() {
  const { data, isLoading, isError } = useGetReviewsQuery({});

  const reviewsList: ApiReview[] = data?.data ?? [];

  const latestReviews = [...reviewsList]
    .filter((item) => Number(item.is_active) === 1)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="text-center mb-6 sm:mb-8">
          <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse mb-2" />
          <div className="w-12 h-0.5 bg-gray-300 mx-auto mb-3" />
          <div className="h-4 w-64 sm:w-80 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-44 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse p-4 flex flex-col justify-between" />
          ))}
        </div>
      </section>
    );
  }

  if (isError || latestReviews.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      {/* 🎯 Section Header Scroll Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-6 sm:mb-8"
      >
        <h2 className="text-xl sm:text-2xl font-bold home-black-text dark:text-white">
          What Our Clients Say
        </h2>
        <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2 mb-3" />
        <p className="text-xs sm:text-sm home-black-text px-2 sm:px-0">
          Real feedback from businesses we've grown with and helped to their success.
        </p>
      </motion.div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestReviews.map((t, index) => {
          const formattedDate = new Date(t.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            /* 🎯 Scroll-Triggered Staggered Animation for Testimonial Cards */
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="
                bg-white dark:bg-slate-800
                border border-gray-200 dark:border-slate-700
                rounded-2xl p-4 flex flex-col gap-3
                hover:shadow-md transition-shadow duration-300
              "
            >
              {/* Top — Avatar + Name */}
              <div className="flex items-center gap-3">
                <Avatar src={t.image_url} name={t.client_name} />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t.client_name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Review */}
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                {cleanReviewText(t.review)}
              </p>

              {/* Bottom — Stars + Category Badge */}
              <div className="flex items-center justify-between mt-1">
                <StarRating rating={Number(t.rating) || 5} />
                <span className="text-[10px] font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-slate-600">
                  {t.item}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🎯 View All Button Scroll Animation */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mt-6 sm:mt-8"
      >
        <Link to="/testimonials">
          <button className="
              bg-[#262626] hover:bg-[#003557] text-white
              text-xs sm:text-sm font-semibold px-6 sm:px-8 py-2 sm:py-2.5 hover:cursor-pointer rounded-full
              transition-colors duration-200
            ">
            View All Testimonials
          </button>
        </Link>
      </motion.div>
    </section>
  );
}










// import { useGetReviewsQuery } from "@/redux/services/homepage/homePage.api";
// import { Link } from "react-router";

// // API Response Item Type Definition (Updated Data Types)
// interface ApiReview {
//   id: number;
//   client_name: string;
//   client_position: string | null;
//   client_image: string;
//   rating: number; // Updated to number
//   review: string;
//   item: string;
//   is_active: number; // Updated to number
//   sort_order: number; // Updated to number
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
//           width="14"
//           height="14"
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
//     <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
//       <img
//         src={src}
//         alt={name}
//         className="w-full h-full object-cover"
//         onError={(e) => {
//           const target = e.target as HTMLImageElement;
//           target.style.display = "none";
//           const parent = target.parentElement;
//           if (parent) {
//             parent.innerHTML = `<span class="text-sm font-bold text-blue-600 dark:text-blue-300">${initials}</span>`;
//           }
//         }}
//       />
//     </div>
//   );
// }

// // HTML string থেকে ট্যাগ ও HTML entity দূর করার হেলপার ফাংশন
// function cleanReviewText(htmlString: string) {
//   if (!htmlString) return "";
//   const parser = new DOMParser();
//   const decoded = parser.parseFromString(htmlString, "text/html").body.textContent || "";
//   return decoded;
// }

// export default function ClientTestimonials() {
//   const { data, isLoading, isError } = useGetReviewsQuery({});

//   const reviewsList: ApiReview[] = data?.data ?? [];

//   // ✅1. Fixed filter logic: Checked with number 1 or truthy value
//   const latestReviews = [...reviewsList]
//     .filter((item) => Number(item.is_active) === 1)
//     .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//     .slice(0, 4);

//   // Loading Skeleton State
//   if (isLoading) {
//     return (
//       <section className="py-8 sm:py-10 lg:py-12">
//         <div className="text-center mb-6 sm:mb-8">
//           <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse mb-2" />
//           <div className="w-12 h-0.5 bg-gray-300 mx-auto mb-3" />
//           <div className="h-4 w-64 sm:w-80 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse" />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {[1, 2, 3, 4].map((n) => (
//             <div key={n} className="h-44 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse p-4 flex flex-col justify-between" />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   if (isError || latestReviews.length === 0) {
//     return null; 
//   }

//   return (
//     <section className="py-8 sm:py-10 lg:py-12">
//       {/* Header */}
//       <div className="text-center mb-6 sm:mb-8">
//         <h2 className="text-xl sm:text-2xl font-bold home-black-text dark:text-white">
//           What Our Clients Say
//         </h2>
//         <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2 mb-3" />
//         <p className="text-xs sm:text-sm home-black-text px-2 sm:px-0">
//           Real feedback from businesses we've grown with and helped to their success.
//         </p>
//       </div>

//       {/* Testimonial Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {latestReviews.map((t) => {
//           // Date Formatting
//           const formattedDate = new Date(t.created_at).toLocaleDateString("en-GB", {
//             day: "numeric",
//             month: "long",
//             year: "numeric",
//           });

//           return (
//             <div
//               key={t.id}
//               className="
//                 bg-white dark:bg-slate-800
//                 border border-gray-200 dark:border-slate-700
//                 rounded-2xl p-4 flex flex-col gap-3
//                 hover:shadow-md transition-shadow duration-300
//               "
//             >
//               {/* Top — Avatar + Name */}
//               <div className="flex items-center gap-3">
//                 <Avatar src={t.image_url} name={t.client_name} />
//                 <div>
//                   <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                     {t.client_name}
//                   </p>
//                   <p className="text-xs text-gray-400 dark:text-gray-500">
//                     {formattedDate}
//                   </p>
//                 </div>
//               </div>

//               {/* Review */}
//               <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
//                 {cleanReviewText(t.review)}
//               </p>

//               {/* Bottom — Stars + Category Badge */}
//               <div className="flex items-center justify-between mt-1">
//                 <StarRating rating={Number(t.rating) || 5} />
//                 <span className="text-[10px] font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-slate-600">
//                   {t.item}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* View All Button */}
//       <div className="flex justify-center mt-6 sm:mt-8">
//         <Link to="/testimonials">
//           <button className="
//               bg-[#262626] hover:bg-[#003557] text-white
//               text-xs sm:text-sm font-semibold px-6 sm:px-8 py-2 sm:py-2.5 hover:cursor-pointer rounded-full
//               transition-colors duration-200
//             ">
//             View All Testimonials
//           </button>
//         </Link>
//       </div>
//     </section>
//   );
// }









// import { useGetReviewsQuery } from "@/redux/services/homepage/homePage.api";
// import { Link } from "react-router";

// // API Response Item Type Definition
// interface ApiReview {
//   id: number;
//   client_name: string;
//   client_position: string | null;
//   client_image: string;
//   rating: string;
//   review: string;
//   item: string;
//   is_active: string;
//   sort_order: string;
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
//           width="14"
//           height="14"
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
//     <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
//       <img
//         src={src}
//         alt={name}
//         className="w-full h-full object-cover"
//         onError={(e) => {
//           const target = e.target as HTMLImageElement;
//           target.style.display = "none";
//           const parent = target.parentElement;
//           if (parent) {
//             parent.innerHTML = `<span class="text-sm font-bold text-blue-600 dark:text-blue-300">${initials}</span>`;
//           }
//         }}
//       />
//     </div>
//   );
// }

// // HTML string থেকে ট্যাগ ও HTML entity দূর করার হেলপার ফাংশন
// function cleanReviewText(htmlString: string) {
//   if (!htmlString) return "";
//   const parser = new DOMParser();
//   const decoded = parser.parseFromString(htmlString, "text/html").body.textContent || "";
//   return decoded;
// }

// export default function ClientTestimonials() {
//   const { data, isLoading, isError } = useGetReviewsQuery({});

//   // 1. API ডেটা থেকে লেটেস্ট ৪টি সক্রিয় (is_active === "1") রিভিউ নেওয়া
//   const reviewsList: ApiReview[] = data?.data ?? [];

//   const latestReviews = [...reviewsList]
//     .filter((item) => item.is_active === "1")
//     .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//     .slice(0, 4);

//   // Loading Skeleton State
//   if (isLoading) {
//     return (
//       <section className="py-8 sm:py-10 lg:py-12">
//         <div className="text-center mb-6 sm:mb-8">
//           <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse mb-2" />
//           <div className="w-12 h-0.5 bg-gray-300 mx-auto mb-3" />
//           <div className="h-4 w-64 sm:w-80 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse" />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {[1, 2, 3, 4].map((n) => (
//             <div key={n} className="h-44 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse p-4 flex flex-col justify-between" />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   if (isError || latestReviews.length === 0) {
//     return null; // কোনো এরর বা ডেটা না থাকলে হাইড রাখবে
//   }

//   return (
//     <section className="py-8 sm:py-10 lg:py-12">
//       {/* Header */}
//       <div className="text-center mb-6 sm:mb-8">
//         <h2 className="text-xl sm:text-2xl font-bold home-black-text dark:text-white">
//           What Our Clients Say
//         </h2>
//         <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2 mb-3" />
//         <p className="text-xs sm:text-sm home-black-text px-2 sm:px-0">
//           Real feedback from businesses we've grown with and helped to their success.
//         </p>
//       </div>

//       {/* Testimonial Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {latestReviews.map((t) => {
//           // Date Formatting
//           const formattedDate = new Date(t.created_at).toLocaleDateString("en-GB", {
//             day: "numeric",
//             month: "long",
//             year: "numeric",
//           });

//           return (
//             <div
//               key={t.id}
//               className="
//                 bg-white dark:bg-slate-800
//                 border border-gray-200 dark:border-slate-700
//                 rounded-2xl p-4 flex flex-col gap-3
//                 hover:shadow-md transition-shadow duration-300
//               "
//             >
//               {/* Top — Avatar + Name */}
//               <div className="flex items-center gap-3">
//                 <Avatar src={t.image_url} name={t.client_name} />
//                 <div>
//                   <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                     {t.client_name}
//                   </p>
//                   <p className="text-xs text-gray-400 dark:text-gray-500">
//                     {formattedDate}
//                   </p>
//                 </div>
//               </div>

//               {/* Review */}
//               <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
//                 {cleanReviewText(t.review)}
//               </p>

//               {/* Bottom — Stars + Category Badge */}
//               <div className="flex items-center justify-between mt-1">
//                 <StarRating rating={Number(t.rating) || 5} />
//                 <span className="text-[10px] font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-slate-600">
//                   {t.item}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* View All Button */}
//       <div className="flex justify-center mt-6 sm:mt-8">
//         <Link to="/testimonials">
//           <button className="
//               bg-[#262626] hover:bg-[#003557] text-white
//               text-xs sm:text-sm font-semibold px-6 sm:px-8 py-2 sm:py-2.5 hover:cursor-pointer rounded-full
//               transition-colors duration-200
//             ">
//             View All Testimonials
//           </button>
//         </Link>
//       </div>
//     </section>
//   );
// }


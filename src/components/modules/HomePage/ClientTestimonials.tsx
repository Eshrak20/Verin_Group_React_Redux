import { useGetReviewsQuery } from "@/redux/services/homepage/homePage.api";
import { Link } from "react-router";


// API Response Item Type Definition
interface ApiReview {
  id: number;
  client_name: string;
  client_position: string | null;
  client_image: string;
  rating: string;
  review: string;
  item: string;
  is_active: string;
  sort_order: string;
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

// HTML string থেকে ট্যাগ ও HTML entity দূর করার হেলপার ফাংশন
function cleanReviewText(htmlString: string) {
  if (!htmlString) return "";
  const parser = new DOMParser();
  const decoded = parser.parseFromString(htmlString, "text/html").body.textContent || "";
  return decoded;
}

export default function ClientTestimonials() {
  const { data, isLoading, isError } = useGetReviewsQuery({});

  // 1. API ডেটা থেকে লেটেস্ট ৪টি সক্রিয় (is_active === "1") রিভিউ নেওয়া
  const reviewsList: ApiReview[] = data?.data ?? [];

  const latestReviews = [...reviewsList]
    .filter((item) => item.is_active === "1")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  // Loading Skeleton State
  if (isLoading) {
    return (
      <section className="py-12">
        <div className="text-center mb-8">
          <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse mb-2" />
          <div className="w-12 h-0.5 bg-gray-300 mx-auto mb-3" />
          <div className="h-4 w-80 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse" />
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
    return null; // কোনো এরর বা ডেটা না থাকলে হাইড রাখবে
  }

  return (
    <section className="py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold home-black-text dark:text-white">
          What Our Clients Say
        </h2>
        <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2 mb-3" />
        <p className="text-sm home-black-text">
          Real feedback from businesses we've grown with and helped to their success.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestReviews.map((t) => {
          // Date Formatting (Example: 23 June 2026)
          const formattedDate = new Date(t.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <div
              key={t.id}
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
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <Link to="/testimonials">
          <button className="
              bg-[#262626] hover:bg-[#003557] text-white
              text-sm font-semibold px-8 py-2.5 hover:cursor-pointer rounded-full
              transition-colors duration-200
            ">
            View All Testimonials
          </button>
        </Link>
      </div>
    </section>
  );
}












// interface Testimonial {
//   id: number;
//   name: string;
//   date: string;
//   avatar: string;
//   review: string;
//   rating: number;
//   category: string; // নতুন প্রপার্টি যুক্ত করা হলো
// }

// const testimonials: Testimonial[] = [
//   {
//     id: 1,
//     name: "Chan Man",
//     date: "22 January 2024",
//     avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men1_o2gnb2.jpg",
//     review: "Innovative idea is one who idea was good results.",
//     rating: 3,
//     category: "Decor",
//   },
//   {
//     id: 2,
//     name: "Solvak",
//     date: "13 February 2024",
//     avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men3_i1ubev.jpg",
//     review: "Innovative idea is a non rich company.",
//     rating: 5,
//     category: "Clothing",
//   },
//   {
//     id: 3,
//     name: "Zaan Vai",
//     date: "11 March 2024",
//     avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men2_zcwnkg.jpg",
//     review: "Work is very dedicated and clear.",
//     rating: 5,
//     category: "Electronics",
//   },
//   {
//     id: 4,
//     name: "Rifat",
//     date: "25 March 2024",
//     avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men4_qwrt4l.jpg",
//     review: "Innovative idea solution exactly from the best results and work with exceptional quality.",
//     rating: 5,
//     category: "Electronics",
//   },
// ];

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

// export default function ClientTestimonials() {
//   return (
//     <section className="py-12">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold home-black-text dark:text-white">
//           What Our Clients Say
//         </h2>
//         <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2 mb-3" />
//         <p className="text-sm home-black-text">
//           Real feedback from businesses we've grown with and helped to their success.
//         </p>
//       </div>

//       {/* Testimonial Cards */}
//       <div className="grid grid-cols-4 gap-4">
//         {testimonials.map((t) => (
//           <div
//             key={t.id}
//             className="
//               bg-white dark:bg-slate-800
//               border border-gray-200 dark:border-slate-700
//               rounded-2xl p-4 flex flex-col gap-3
//               hover:shadow-md transition-shadow duration-300
//             "
//           >
//             {/* Top — Avatar + Name */}
//             <div className="flex items-center gap-3">
//               <Avatar src={t.avatar} name={t.name} />
//               <div>
//                 <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                   {t.name}
//                 </p>
//                 <p className="text-xs text-gray-400 dark:text-gray-500">
//                   {t.date}
//                 </p>
//               </div>
//             </div>

//             {/* Review */}
//             <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
//               {t.review}
//             </p>

//             {/* Bottom — Stars + Category Badge */}
//             <div className="flex items-center justify-between mt-1">
//               <StarRating rating={t.rating} />
//               <span className="text-[10px] font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-slate-600">
//                 {t.category}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* View All Button */}
//       <div className="flex justify-center mt-8">
//         <button className="
//           bg-[#262626] hover:bg-[#003557] text-white
//           text-sm font-semibold px-8 py-2.5 rounded-full
//           transition-colors duration-200
//         ">
//           View All Testimonials
//         </button>
//       </div>
//     </section>
//   );
// }








// interface Testimonial {
//   id: number;
//   name: string;
//   date: string;
//   avatar: string;
//   review: string;
//   rating: number;
// }

// // const stats: Stat[] = [
// //   { value: "98%", label: "Client Satisfaction" },
// //   { value: "150+", label: "Project Delivered" },
// //   { value: "4.9", label: "Average Rating" },
// //   { value: "95%", label: "Repeat Clients" },
// // ];

// const testimonials: Testimonial[] = [
//   {
//     id: 1,
//     name: "Chan Man",
//     date: "22 January 2024",
//     avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men1_o2gnb2.jpg",
//     review: "Innovative idea is one who idea was good results.",
//     rating: 3,
//   },
//   {
//     id: 2,
//     name: "Solvak",
//     date: "13 February 2024",
//     avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men3_i1ubev.jpg",
//     review: "Innovative idea is a non rich company.",
//     rating: 5,
//   },
//   {
//     id: 3,
//     name: "Zaan Vai",
//     date: "11 March 2024",
//     avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men2_zcwnkg.jpg",
//     review: "Work is very dedicated and clear.",
//     rating: 5,
//   },
//   {
//     id: 4,
//     name: "Rifat",
//     date: "25 March 2024",
//     avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men4_qwrt4l.jpg",
//     review: "Innovative idea solution exactly from the best results and work with exceptional quality.",
//     rating: 5,
//   },
// ];

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

// export default function ClientTestimonials() {
//   return (
//     <section className="py-12">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold home-black-text dark:text-white">
//           What Our Clients Say
//         </h2>
//         <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2 mb-3" />
//         <p className="text-sm home-black-text">
//           Real feedback from businesses we've grown with and helped to their success.
//         </p>
//       </div>

//       {/* Stats */}
//       {/* <div className="grid grid-cols-4 gap-4 mb-8">
//         {stats.map((stat) => (
//           <div
//             key={stat.label}
//             className="
//               bg-blue-50 dark:bg-slate-800
//               rounded-2xl py-5 px-4 text-center
//               border border-blue-100 dark:border-slate-700
//             "
//           >
//             <p className="text-2xl font-bold text-gray-900 dark:text-white">
//               {stat.value}
//             </p>
//             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//               {stat.label}
//             </p>
//           </div>
//         ))}
//       </div> */}

//       {/* Testimonial Cards */}
//       <div className="grid grid-cols-4 gap-4">
//         {testimonials.map((t) => (
//           <div
//             key={t.id}
//             className="
//               bg-white dark:bg-slate-800
//               border border-gray-200 dark:border-slate-700
//               rounded-2xl p-4 flex flex-col gap-3
//               hover:shadow-md transition-shadow duration-300
//             "
//           >
//             {/* Top — Avatar + Name */}
//             <div className="flex items-center gap-3">
//               <Avatar src={t.avatar} name={t.name} />
//               <div>
//                 <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                   {t.name}
//                 </p>
//                 <p className="text-xs text-gray-400 dark:text-gray-500">
//                   {t.date}
//                 </p>
//               </div>
//             </div>

//             {/* Review */}
//             <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
//               {t.review}
//             </p>

//             {/* Stars */}
//             <StarRating rating={t.rating} />
//           </div>
//         ))}
//       </div>

//       {/* View All Button */}
//       <div className="flex justify-center mt-8">
//         <button className="
//           bg-[#262626] hover:bg-[#003557] text-white
//           text-sm font-semibold px-8 py-2.5 rounded-full
//           transition-colors duration-200
//         ">
//           View All Testimonials
//         </button>
//       </div>
//     </section>
//   );
// }
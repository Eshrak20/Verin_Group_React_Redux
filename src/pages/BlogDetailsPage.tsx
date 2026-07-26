/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, MessageCircle, Send, Globe, Award, Headphones
} from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
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

export default function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBangla, setIsBangla] = useState(true);

  // RTK Query hooks
  const { data: blogData, isLoading, isError } = useGetBlogQuery();
  const { data: productsData } = useGetProductsQuery({});

  const rawBlogs: Blog[] = blogData?.data ?? [];
  const products = productsData?.data ?? [];

  // র‍্যান্ডমলি ২টি প্রোডাক্ট নেওয়ার জন্য useMemo
  const suggestedProducts = useMemo(() => {
    if (!products.length) return [];
    return [...products]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
  }, [products, id]);

  // ID অথবা Slug উভয় দিয়ে ব্লগ ম্যাচিং এর সুবিধা
  const currentBlog = rawBlogs.find(
    (b) => b.id === Number(id) || b.slug === id
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

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

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl p-8 space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/4 rounded" />
              <div className="h-8 bg-gray-200 dark:bg-slate-700 w-3/4 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/3 rounded" />
              <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-xl" />
              <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="lg:col-span-1 space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
              <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Blog Not Found / Error State
  if (isError || !currentBlog) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-[#fbf5f8] dark:bg-slate-900">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
          {isBangla ? "ব্লগ পাওয়া যায়নি" : "Blog Not Found"}
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-[#262626] text-white rounded-xl text-xs hover:cursor-pointer"
        >
          {isBangla ? "হোমে ফিরে যান" : "Back Home"}
        </button>
      </div>
    );
  }

  // Dynamic values selection
  const title = isBangla
    ? currentBlog.title_bng || currentBlog.title
    : currentBlog.title;

  const excerpt = isBangla
    ? currentBlog.summary_bng || currentBlog.excerpt || currentBlog.summary
    : currentBlog.excerpt || currentBlog.summary;

  const content = isBangla
    ? currentBlog.content_bng || currentBlog.content
    : currentBlog.content;

  const date = formatDate(currentBlog.created_at, isBangla);

  return (
    <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        {/* ল্যাঙ্গুয়েজ টগল ও ব্যাক বাটন অ্যাকশন */}
        <div className="flex justify-between items-center mb-6 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:cursor-pointer text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> {isBangla ? "ফিরে যান" : "Go Back"}
          </button>

          <div className="flex bg-white dark:bg-slate-800 rounded-full p-1 border dark:border-slate-700 shadow-sm">
            <button
              onClick={() => setIsBangla(true)}
              className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-200 ${
                isBangla
                  ? "bg-[#262626] text-white shadow-sm"
                  : "text-gray-500"
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setIsBangla(false)}
              className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-200 ${
                !isBangla
                  ? "bg-[#262626] text-white shadow-sm"
                  : "text-gray-500"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* ================= বামের মেইন ব্লগ কন্টেন্ট কার্ড ================= */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-6 md:p-8 shadow-sm space-y-5">
            <div className="text-[11px] text-gray-400 font-medium">
              Home &gt; Blog &gt;{" "}
              <span className="text-gray-600 dark:text-gray-300">
                {isBangla ? "টিউটোরিয়াল" : "Tutorial"}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-snug">
              {title}
            </h1>

            <div className="text-[11px] text-gray-400 font-medium pb-2 flex flex-wrap gap-2">
              <span>By Admin • </span>
              <span>{date}</span>
            </div>

            {excerpt && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {excerpt}
              </p>
            )}

            <div className="rounded-xl overflow-hidden aspect-video border dark:border-slate-700 bg-gray-50 dark:bg-slate-950">
              <img
                src={currentBlog.image_url}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/800x450/e2e8f0/94a3b8?text=Blog+Image";
                }}
              />
            </div>

            {/* API Content Renderer */}
            <div
              className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-5 leading-relaxed pt-2 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content || "" }}
            />
          </div>

          {/* ================= ডানের উইজেট সাইডবার ================= */}
          <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
            {/* ১. শেয়ার বক্স উইজেট */}
            {/* ১. শেয়ার বক্স উইজেট (Fully Functional) */}
{/* ১. শেয়ার বক্স উইজেট (Exact Path Integrated) */}
{/* ১. শেয়ার বক্স উইজেট (Dynamic Path & Fallback Integrated) */}
<div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm">
  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
    {isBangla ? "পোস্টটি শেয়ার করুন" : "Share This Post"}
  </h4>
  
  {(() => {
    // ১. আপনার বর্তমান ব্রাউজারের অরিজিনাল পাথ (যেমন: /blogs/slug-name)
    const currentPath = window.location.pathname;

    // ২. লাইভ ডোমেইনের সাথে পাথ যুক্ত করে ১০০% নিখুঁত শেয়ার লিংক তৈরি
    const shareUrl = `https://v.veringroup.com${currentPath}`;

    return (
      <div className="flex items-center gap-2">
        {/* Facebook Share */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-blue-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center"
          title="Share on Facebook"
        >
          <FaFacebookF size={13} />
        </a>

        {/* Twitter / X Share */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-sky-400 text-white hover:opacity-90 transition-opacity flex items-center justify-center"
          title="Share on Twitter"
        >
          <FaTwitter size={13} />
        </a>

        {/* LinkedIn Share */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-blue-700 text-white hover:opacity-90 transition-opacity flex items-center justify-center"
          title="Share on LinkedIn"
        >
          <FaLinkedinIn size={13} />
        </a>

        {/* WhatsApp Share */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-emerald-500 text-white hover:opacity-90 transition-opacity flex items-center justify-center"
          title="Share on WhatsApp"
        >
          <MessageCircle size={13} />
        </a>

        {/* Telegram Share */}
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-teal-500 text-white hover:opacity-90 transition-opacity flex items-center justify-center"
          title="Share on Telegram"
        >
          <Send size={13} />
        </a>
      </div>
    );
  })()}
</div>

            {/* ২. প্রোডাক্ট সাজেশন্স উইজেট (Dynamic Random from API) */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm space-y-3">
              <h4 className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-slate-700">
                {isBangla ? "পছন্দসই প্রোডাক্টস" : "Recommended Products"}
              </h4>

              <div className="space-y-3">
                {suggestedProducts.length > 0 ? (
                  suggestedProducts.map((product: any) => {
                    // ভ্যারিয়েন্ট থেকে প্রাইস ও ইমেজ বের করা
                    const firstVariant = product.variants?.[0];

                    const displayPrice =
                      firstVariant?.sale_price ||
                      firstVariant?.price ||
                      product.price ||
                      "N/A";

                    const displayImage =
                      firstVariant?.images?.[0]?.image_url ||
                      product.image_url ||
                      product.thumbnail ||
                      "https://placehold.co/100x100/e2e8f0/94a3b8?text=Product";

                    return (
                      <Link
                        key={product.id}
                        to={`/products/${product.slug ?? product.id}`}
                        className="flex gap-3 group items-center p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-slate-700 border border-gray-200/80 dark:border-slate-600">
                          <img
                            src={displayImage}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-gray-200 truncate transition-colors ">
                            {product.name}
                          </h5>

                          {/* প্রাইস প্রদর্শন */}
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            ৳ {displayPrice}
                          </p>

                          <span className="text-[10px] font-semibold  hover:underline">
                            {isBangla ? "অর্ডার করুন →" : "Buy Now →"}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-[11px] text-gray-400 text-center py-2">
                    {isBangla ? "কোনো প্রোডাক্ট পাওয়া যায়নি" : "No products available"}
                  </p>
                )}
              </div>
            </div>

            {/* ৩. স্ট্যাটিস্টিকস উইজেট */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm text-[11px] space-y-3 text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400">
                  <Globe size={13} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-xs">
                    5800+
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Global Job Placements
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-pink-50 dark:bg-slate-700 text-pink-600 dark:text-pink-400">
                  <Award size={13} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-xs">
                    2000+
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Remote Job Placements
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400">
                  <Headphones size={13} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-xs">
                    24/7
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Personal Coding Support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { 
//   ArrowLeft, MessageCircle, Send, Globe, Award, Headphones
// } from "lucide-react";
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
// import { useGetBlogQuery } from "@/redux/services/homepage/homePage.api";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

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

// export default function BlogDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [isBangla, setIsBangla] = useState(true);

//   // RTK Query hooks
//   const { data: blogData, isLoading, isError } = useGetBlogQuery();
//   const { data: productsData } = useGetProductsQuery({});

//   const rawBlogs: Blog[] = blogData?.data ?? [];
//   const products = productsData?.data ?? [];

//   // প্রথম দুটি প্রোডাক্ট সাজেশন হিসেবে নেওয়া
//   const suggestedProducts = products.slice(0, 2);

//   // ID অথবা Slug উভয় দিয়ে ব্লগ ম্যাচিং এর সুবিধা
//   const currentBlog = rawBlogs.find(
//     (b) => b.id === Number(id) || b.slug === id
//   );

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [id]);

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

//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans">
//         <div className="max-w-6xl mx-auto px-4 lg:px-0 pt-8">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl p-8 space-y-4 animate-pulse">
//               <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/4 rounded" />
//               <div className="h-8 bg-gray-200 dark:bg-slate-700 w-3/4 rounded" />
//               <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/3 rounded" />
//               <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-xl" />
//               <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded" />
//             </div>
//             <div className="lg:col-span-1 space-y-4">
//               <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
//               <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Blog Not Found / Error State
//   if (isError || !currentBlog) {
//     return (
//       <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-[#fbf5f8] dark:bg-slate-900">
//         <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
//           {isBangla ? "ব্লগ পাওয়া যায়নি" : "Blog Not Found"}
//         </h2>
//         <button
//           onClick={() => navigate("/")}
//           className="px-4 py-2 bg-[#262626] text-white rounded-xl text-xs hover:cursor-pointer"
//         >
//           {isBangla ? "হোমে ফিরে যান" : "Back Home"}
//         </button>
//       </div>
//     );
//   }

//   // Dynamic values selection
//   const title = isBangla
//     ? currentBlog.title_bng || currentBlog.title
//     : currentBlog.title;

//   const excerpt = isBangla
//     ? currentBlog.summary_bng || currentBlog.excerpt || currentBlog.summary
//     : currentBlog.excerpt || currentBlog.summary;

//   const content = isBangla
//     ? currentBlog.content_bng || currentBlog.content
//     : currentBlog.content;

//   const date = formatDate(currentBlog.created_at, isBangla);

//   return (
//     <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans">
//       <div className="max-w-6xl mx-auto px-4 lg:px-0">
//         {/* ল্যাঙ্গুয়েজ টগল ও ব্যাক বাটন অ্যাকশন */}
//         <div className="flex justify-between items-center mb-6 pt-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 hover:cursor-pointer text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
//           >
//             <ArrowLeft size={14} /> {isBangla ? "ফিরে যান" : "Go Back"}
//           </button>

//           <div className="flex bg-white dark:bg-slate-800 rounded-full p-1 border dark:border-slate-700 shadow-sm">
//             <button
//               onClick={() => setIsBangla(true)}
//               className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-200 ${
//                 isBangla
//                   ? "bg-[#262626] text-white shadow-sm"
//                   : "text-gray-500"
//               }`}
//             >
//               বাংলা
//             </button>
//             <button
//               onClick={() => setIsBangla(false)}
//               className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-200 ${
//                 !isBangla
//                   ? "bg-[#262626] text-white shadow-sm"
//                   : "text-gray-500"
//               }`}
//             >
//               English
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
//           {/* ================= বামের মেইন ব্লগ কন্টেন্ট কার্ড ================= */}
//           <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-6 md:p-8 shadow-sm space-y-5">
//             <div className="text-[11px] text-gray-400 font-medium">
//               Home &gt; Blog &gt;{" "}
//               <span className="text-gray-600 dark:text-gray-300">
//                 {isBangla ? "টিউটোরিয়াল" : "Tutorial"}
//               </span>
//             </div>

//             <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-snug">
//               {title}
//             </h1>

//             <div className="text-[11px] text-gray-400 font-medium pb-2 flex flex-wrap gap-2">
//               <span>By Admin • </span>
//               <span>{date}</span>
//             </div>

//             {excerpt && (
//               <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
//                 {excerpt}
//               </p>
//             )}

//             <div className="rounded-xl overflow-hidden aspect-video border dark:border-slate-700 bg-gray-50 dark:bg-slate-950">
//               <img
//                 src={currentBlog.image_url}
//                 alt={title}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src =
//                     "https://placehold.co/800x450/e2e8f0/94a3b8?text=Blog+Image";
//                 }}
//               />
//             </div>

//             {/* API Content Renderer */}
//             <div
//               className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-5 leading-relaxed pt-2 prose dark:prose-invert max-w-none"
//               dangerouslySetInnerHTML={{ __html: content || "" }}
//             />
//           </div>

//           {/* ================= ডানের উইজেট সাইডবার ================= */}
//           <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
//             {/* ১. শেয়ার বক্স উইজেট */}
//             <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm">
//               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
//                 Share This Post
//               </h4>
//               <div className="flex items-center gap-2">
//                 <button className="p-1.5 rounded bg-blue-600 text-white hover:opacity-90 transition-opacity">
//                   <FaFacebookF size={13} />
//                 </button>
//                 <button className="p-1.5 rounded bg-sky-400 text-white hover:opacity-90 transition-opacity">
//                   <FaTwitter size={13} />
//                 </button>
//                 <button className="p-1.5 rounded bg-blue-700 text-white hover:opacity-90 transition-opacity">
//                   <FaLinkedinIn size={13} />
//                 </button>

//                 <button className="p-1.5 rounded bg-emerald-500 text-white hover:opacity-90 transition-opacity">
//                   <MessageCircle size={13} />
//                 </button>
//                 <button className="p-1.5 rounded bg-teal-500 text-white hover:opacity-90 transition-opacity">
//                   <Send size={13} />
//                 </button>
//               </div>
//             </div>

           
//             {/* ২. প্রোডাক্ট সাজেশন্স উইজেট (Dynamic from API) */}
//             <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm space-y-3">
//               <h4 className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-slate-700">
//                 {isBangla ? "পছন্দসই প্রোডাক্টস" : "Recommended Products"}
//               </h4>

//               <div className="space-y-3">
//                 {suggestedProducts.length > 0 ? (
//                   suggestedProducts.map((product: any) => {
//                     // ১. ভ্যারিয়েন্ট থেকে প্রাইস ও ইমেজ বের করা
//                     const firstVariant = product.variants?.[0];
                    
//                     const displayPrice =
//                       firstVariant?.sale_price ||
//                       firstVariant?.price ||
//                       product.price ||
//                       "N/A";

//                     const displayImage =
//                       firstVariant?.images?.[0]?.image_url ||
//                       product.image_url ||
//                       product.thumbnail ||
//                       "https://placehold.co/100x100/e2e8f0/94a3b8?text=Product";

//                     return (
//                       <Link
//                         key={product.id}
//                         to={`/products/${product.slug ?? product.id}`}
//                         className="flex gap-3 group items-center p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
//                       >
//                         <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-slate-700 border border-gray-200/80 dark:border-slate-600">
//                           <img
//                             src={displayImage}
//                             alt={product.name}
//                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h5 className="text-xs font-bold text-slate-800 dark:text-gray-200 truncate   transition-colors">
//                             {product.name}
//                           </h5>
                          
//                           {/* প্রাইস প্রদর্শন */}
//                           <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
//                             ৳ {displayPrice}
//                           </p>

//                           <span className="text-[10px] font-semibold  hover:underline">
//                             {isBangla ? "অর্ডার করুন →" : "Buy Now →"}
//                           </span>
//                         </div>
//                       </Link>
//                     );
//                   })
//                 ) : (
//                   <p className="text-[11px] text-gray-400 text-center py-2">
//                     {isBangla ? "কোনো প্রোডাক্ট পাওয়া যায়নি" : "No products available"}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* ৩. স্ট্যাটিস্টিকস উইজেট */}
//             <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm text-[11px] space-y-3 text-gray-500 dark:text-gray-400 font-medium">
//               <div className="flex items-center gap-3">
//                 <div className="p-1.5 rounded bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400">
//                   <Globe size={13} />
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-800 dark:text-white text-xs">
//                     5800+
//                   </p>
//                   <p className="text-[10px] text-gray-400">
//                     Global Job Placements
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="p-1.5 rounded bg-pink-50 dark:bg-slate-700 text-pink-600 dark:text-pink-400">
//                   <Award size={13} />
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-800 dark:text-white text-xs">
//                     2000+
//                   </p>
//                   <p className="text-[10px] text-gray-400">
//                     Remote Job Placements
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="p-1.5 rounded bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400">
//                   <Headphones size={13} />
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-800 dark:text-white text-xs">
//                     24/7
//                   </p>
//                   <p className="text-[10px] text-gray-400">
//                     Personal Coding Support
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   ArrowLeft, MessageCircle, Send, Globe, Award, Headphones
// } from "lucide-react";
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
// import { useGetBlogQuery } from "@/redux/services/homepage/homePage.api";




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

// export default function BlogDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [isBangla, setIsBangla] = useState(true);

//   // RTK Query hook
//   const { data, isLoading, isError } = useGetBlogQuery();

//   const rawBlogs: Blog[] = data?.data ?? [];

//   // ID অথবা Slug উভয় দিয়ে ব্লগ ম্যাচিং এর সুবিধা
//   const currentBlog = rawBlogs.find(
//     (b) => b.id === Number(id) || b.slug === id
//   );

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [id]);

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

//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl p-8 space-y-4 animate-pulse">
//               <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/4 rounded" />
//               <div className="h-8 bg-gray-200 dark:bg-slate-700 w-3/4 rounded" />
//               <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/3 rounded" />
//               <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-xl" />
//               <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded" />
//             </div>
//             <div className="lg:col-span-1 space-y-4">
//               <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
//               <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Blog Not Found / Error State
//   if (isError || !currentBlog) {
//     return (
//       <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-[#fbf5f8] dark:bg-slate-900">
//         <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
//           {isBangla ? "ব্লগ পাওয়া যায়নি" : "Blog Not Found"}
//         </h2>
//         <button
//           onClick={() => navigate("/")}
//           className="px-4 py-2 bg-[#262626] text-white rounded-xl text-xs hover:cursor-pointer"
//         >
//           {isBangla ? "হোমে ফিরে যান" : "Back Home"}
//         </button>
//       </div>
//     );
//   }

//   // Dynamic values selection
//   const title = isBangla
//     ? currentBlog.title_bng || currentBlog.title
//     : currentBlog.title;

//   const excerpt = isBangla
//     ? currentBlog.summary_bng || currentBlog.excerpt || currentBlog.summary
//     : currentBlog.excerpt || currentBlog.summary;

//   const content = isBangla
//     ? currentBlog.content_bng || currentBlog.content
//     : currentBlog.content;

//   const date = formatDate(currentBlog.created_at, isBangla);

//   return (
//     <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans">
//       <div className="max-w-6xl mx-auto px-4 lg:px-0">
//         {/* ল্যাঙ্গুয়েজ টগল ও ব্যাক বাটন অ্যাকশন */}
//         <div className="flex justify-between items-center mb-6 pt-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 hover:cursor-pointer text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
//           >
//             <ArrowLeft size={14} /> {isBangla ? "ফিরে যান" : "Go Back"}
//           </button>

//           <div className="flex bg-white dark:bg-slate-800 rounded-full p-1 border dark:border-slate-700 shadow-sm">
//             <button
//               onClick={() => setIsBangla(true)}
//               className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-200 ${
//                 isBangla
//                   ? "bg-[#262626] text-white shadow-sm"
//                   : "text-gray-500"
//               }`}
//             >
//               বাংলা
//             </button>
//             <button
//               onClick={() => setIsBangla(false)}
//               className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-200 ${
//                 !isBangla
//                   ? "bg-[#262626] text-white shadow-sm"
//                   : "text-gray-500"
//               }`}
//             >
//               English
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
//           {/* ================= বামের মেইন ব্লগ কন্টেন্ট কার্ড ================= */}
//           <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-6 md:p-8 shadow-sm space-y-5">
//             <div className="text-[11px] text-gray-400 font-medium">
//               Home &gt; Blog &gt;{" "}
//               <span className="text-gray-600 dark:text-gray-300">
//                 {isBangla ? "টিউটোরিয়াল" : "Tutorial"}
//               </span>
//             </div>

//             <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-snug">
//               {title}
//             </h1>

//             <div className="text-[11px] text-gray-400 font-medium pb-2 flex flex-wrap gap-2">
//               <span>By Admin • </span>
//               <span>{date}</span>
//             </div>

//             {excerpt && (
//               <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
//                 {excerpt}
//               </p>
//             )}

//             <div className="rounded-xl overflow-hidden aspect-video border dark:border-slate-700 bg-gray-50 dark:bg-slate-950">
//               <img
//                 src={currentBlog.image_url}
//                 alt={title}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src =
//                     "https://placehold.co/800x450/e2e8f0/94a3b8?text=Blog+Image";
//                 }}
//               />
//             </div>

//             {/* API Content Renderer */}
//             <div
//               className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-5 leading-relaxed pt-2 prose dark:prose-invert max-w-none"
//               dangerouslySetInnerHTML={{ __html: content || "" }}
//             />
//           </div>

//           {/* ================= ডানের উইজেট সাইডবার ================= */}
//           <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
//             {/* ১. শেয়ার বক্স উইজেট */}
//             <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm">
//               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
//                 Share This Post
//               </h4>
//               <div className="flex items-center gap-2">
//                 <button className="p-1.5 rounded bg-blue-600 text-white hover:opacity-90 transition-opacity">
//                   <FaFacebookF size={13} />
//                 </button>
//                 <button className="p-1.5 rounded bg-sky-400 text-white hover:opacity-90 transition-opacity">
//                   <FaTwitter size={13} />
//                 </button>
//                 <button className="p-1.5 rounded bg-blue-700 text-white hover:opacity-90 transition-opacity">
//                   <FaLinkedinIn size={13} />
//                 </button>

//                 <button className="p-1.5 rounded bg-emerald-500 text-white hover:opacity-90 transition-opacity">
//                   <MessageCircle size={13} />
//                 </button>
//                 <button className="p-1.5 rounded bg-teal-500 text-white hover:opacity-90 transition-opacity">
//                   <Send size={13} />
//                 </button>
//               </div>
//             </div>

//             {/* ২. কোর্স প্রমোশন অ্যাড ব্যানার */}
//             <div className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border border-transparent rounded-xl p-5 shadow-md text-center space-y-4">
//               <div className="flex justify-center">
//                 <div className="p-2 bg-white/10 rounded-full animate-bounce">
//                   <Award size={20} className="text-yellow-300" />
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <span className="text-[9px] font-black uppercase bg-black/30 px-2.5 py-0.5 rounded-full tracking-widest">
//                   Verin Dev Academy
//                 </span>
//                 <h5 className="text-xs sm:text-sm font-black leading-snug">
//                   {isBangla
//                     ? "আমাদের নেক্সট লেভেল ফুল-স্ট্যাক কমপ্লিট ডেভেলপমেন্ট ব্যাচ"
//                     : "Become a Certified Full-Stack Web Developer"}
//                 </h5>
//               </div>
//               <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-black rounded-lg transition-transform active:scale-95 shadow-sm hover:cursor-pointer">
//                 {isBangla ? "কোর্সে এনরোল করুন" : "Enroll Now"}
//               </button>
//             </div>

//             {/* ৩. স্ট্যাটিস্টিকস উইজেট */}
//             <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm text-[11px] space-y-3 text-gray-500 dark:text-gray-400 font-medium">
//               <div className="flex items-center gap-3">
//                 <div className="p-1.5 rounded bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400">
//                   <Globe size={13} />
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-800 dark:text-white text-xs">
//                     5800+
//                   </p>
//                   <p className="text-[10px] text-gray-400">
//                     Global Job Placements
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="p-1.5 rounded bg-pink-50 dark:bg-slate-700 text-pink-600 dark:text-pink-400">
//                   <Award size={13} />
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-800 dark:text-white text-xs">
//                     2000+
//                   </p>
//                   <p className="text-[10px] text-gray-400">
//                     Remote Job Placements
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="p-1.5 rounded bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400">
//                   <Headphones size={13} />
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-800 dark:text-white text-xs">
//                     24/7
//                   </p>
//                   <p className="text-[10px] text-gray-400">
//                     Personal Coding Support
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   ArrowLeft, MessageCircle, Send, Globe, Award, Headphones
// } from "lucide-react";
// // react-icons থেকে সোশ্যাল আইকন ইমপোর্ট করা হলো
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

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

// export default function BlogDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [isBangla, setIsBangla] = useState(true);

//   const currentBlog = blogs.find((b) => b.id === Number(id));

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [id]);

//   if (!currentBlog) {
//     return (
//       <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-[#fbf5f8]">
//         <h2 className="text-lg font-bold text-gray-700">Blog Not Found</h2>
//         <button onClick={() => navigate("/")} className="px-4 py-2 bg-[#262626] text-white rounded-xl text-xs">
//           Back Home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
//         {/* ল্যাঙ্গুয়েজ টগল ও ব্যাক বাটন অ্যাকশন */}
//         <div className="flex justify-between items-center mb-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 hover:cursor-pointer text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
//           >
//             <ArrowLeft size={14} /> {isBangla ? "ফিরে যান" : "Go Back"}
//           </button>

//           <div className="flex bg-white  dark:bg-slate-800 rounded-full p-1 border dark:border-slate-700 shadow-sm">
//             <button
//               onClick={() => setIsBangla(true)}
//               className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-200 ${
//                 isBangla ? "bg-[#262626] text-white shadow-sm" : "text-gray-500"
//               }`}
//             >
//               বাংলা
//             </button>
//             <button
//               onClick={() => setIsBangla(false)}
//               className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-200 ${
//                 !isBangla ? "bg-[#262626] text-white shadow-sm" : "text-gray-500"
//               }`}
//             >
//               English
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
//           {/* ================= বামের মেইন ব্লগ কন্টেন্ট কার্ড ================= */}
//           <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-6 md:p-8 shadow-sm space-y-5">
            
//             <div className="text-[11px] text-gray-400 font-medium">
//               Home &gt; Blog &gt; <span className="text-gray-600 dark:text-gray-300">{isBangla ? currentBlog.categoryBn : currentBlog.categoryEn}</span>
//             </div>

//             <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-snug">
//               {isBangla ? currentBlog.titleBn : currentBlog.titleEn}
//             </h1>

//             <div className="text-[11px] text-gray-400 font-medium pb-2 flex flex-wrap gap-2">
//               <span>By Admin • </span>
//               <span>{isBangla ? currentBlog.dateBn : currentBlog.dateEn}</span>
//             </div>

//             <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
//               {isBangla ? currentBlog.excerptBn : currentBlog.excerptEn}
//             </p>

//             <div className="rounded-xl overflow-hidden aspect-video border dark:border-slate-700 bg-gray-50 dark:bg-slate-950">
//               <img
//                 src={currentBlog.image}
//                 alt="Blog Cover"
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-5 leading-relaxed pt-2">
//               <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
//                 {isBangla ? "The Harsh Reality — মূল সমস্যা এবং কেন আমরা আটকে যাই" : "The Harsh Reality — Why Most People Struggle"}
//               </h3>
              
//               <h4 className="font-bold text-slate-800 dark:text-slate-200">
//                 1. Tutorial Hell Syndrome (টিউটোরিয়াল হেল)
//               </h4>
//               <p>
//                 {isBangla 
//                   ? "অনেক বিগিনার কোডার প্রথম প্রথম একটির পর একটি টিউটোরিয়াল দেখে যান। একে বলা হয় 'Tutorial Hell'। ভিডিও দেখার সময় মনে হয় সব বুঝতে পারছি, কিন্তু যখনই নিজে কোড এডিটর খুলে কোড লিখতে বসা হয়, তখনই আর মাথায় কিছু কাজ করে না।"
//                   : "Many beginner coders get trapped into watching one tutorial after another. This is known as 'Tutorial Hell'. While watching, everything makes perfect sense, but the moment you open a blank code editor, your mind goes completely blank."
//                 }
//               </p>

//               <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-lg border-l-4 border-[#262626] space-y-1">
//                 <p className="font-bold text-slate-800 dark:text-slate-200">How to Break It:</p>
//                 <p>
//                   {isBangla
//                     ? "একটি ছোট প্রজেক্ট সিলেক্ট করুন। শুধুমাত্র ভিডিও টিউটোরিয়াল কপি না করে নিজে থেকে লজিক বিল্ড করার চেষ্টা করুন এবং ডকুমেন্টেশন ব্যবহার করা শিখুন।"
//                     : "Select a very small project. Instead of blindly copying code videos, try building logic on your own and learn to read official documentations."
//                   }
//                 </p>
//               </div>

//               <h4 className="font-bold text-slate-800 dark:text-slate-200">
//                 2. Imposter Syndrome (নিজেকে কম যোগ্য ভাবা)
//               </h4>
//               <p>
//                 {isBangla
//                   ? "কোডিং কমিউনিটিতে অন্যদের সাকসেস প্রোফাইল বা বড় কোনো প্রজেক্ট দেখে বিগিনাররা প্রায়ই ভাবেন যে 'কোডিং হয়তো আমার জন্য নয়'। এই ভয় বা দ্বিধাদ্বন্দ্ব কাটিয়ে ওঠার জন্য প্রতিদিন নিয়মিত প্র্যাকটিস করা ও নিজের ছোট ছোট ইম্প্রুভমেন্ট ট্রাক করা প্রয়োজন।"
//                   : "Looking at other developers' success stories or massive setups, beginners often doubt themselves. Overcoming this requires continuous small efforts and documenting your daily programming steps."
//                 }
//               </p>
//             </div>

//           </div>

//           {/* ================= ডানের উইজেট সাইডবার ================= */}
//           <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
            
//             {/* ১. শেয়ার বক্স উইজেট */}
//             <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm">
//               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
//                 Share This Post
//               </h4>
//               <div className="flex items-center gap-2">
//                 {/* React Icons ব্যবহার করে সোশ্যাল বাটন */}
//                 <button className="p-1.5 rounded bg-blue-600 text-white hover:opacity-90 transition-opacity"><FaFacebookF size={13} /></button>
//                 <button className="p-1.5 rounded bg-sky-400 text-white hover:opacity-90 transition-opacity"><FaTwitter size={13} /></button>
//                 <button className="p-1.5 rounded bg-blue-700 text-white hover:opacity-90 transition-opacity"><FaLinkedinIn size={13} /></button>
                
//                 {/* Lucide Icons */}
//                 <button className="p-1.5 rounded bg-emerald-500 text-white hover:opacity-90 transition-opacity"><MessageCircle size={13} /></button>
//                 <button className="p-1.5 rounded bg-teal-500 text-white hover:opacity-90 transition-opacity"><Send size={13} /></button>
//               </div>
//             </div>

//             {/* ২. কোর্স প্রমোশন অ্যাড ব্যানার */}
//             <div className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border border-transparent rounded-xl p-5 shadow-md text-center space-y-4">
//               <div className="flex justify-center">
//                 <div className="p-2 bg-white/10 rounded-full animate-bounce">
//                   <Award size={20} className="text-yellow-300" />
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <span className="text-[9px] font-black uppercase bg-black/30 px-2.5 py-0.5 rounded-full tracking-widest">Verin Dev Academy</span>
//                 <h5 className="text-xs sm:text-sm font-black leading-snug">
//                   {isBangla ? "আমাদের নেক্সট লেভেল ফুল-স্ট্যাক কমপ্লিট ডেভেলপমেন্ট ব্যাচ" : "Become a Certified Full-Stack Web Developer"}
//                 </h5>
//               </div>
//               <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-black rounded-lg transition-transform active:scale-95 shadow-sm">
//                 {isBangla ? "কোর্সে এনরোল করুন" : "Enroll Now"}
//               </button>
//             </div>

//             {/* ৩. স্ট্যাটিস্টিকস উইজেট */}
//             <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm text-[11px] space-y-3 text-gray-500 dark:text-gray-400 font-medium">
//               <div className="flex items-center gap-3">
//                 <div className="p-1.5 rounded bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400"><Globe size={13} /></div>
//                 <div>
//                   <p className="font-bold text-slate-800 dark:text-white text-xs">5800+</p>
//                   <p className="text-[10px] text-gray-400">Global Job Placements</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="p-1.5 rounded bg-pink-50 dark:bg-slate-700 text-pink-600 dark:text-pink-400"><Award size={13} /></div>
//                 <div>
//                   <p className="font-bold text-slate-800 dark:text-white text-xs">2000+</p>
//                   <p className="text-[10px] text-gray-400">Remote Job Placements</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="p-1.5 rounded bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400"><Headphones size={13} /></div>
//                 <div>
//                   <p className="font-bold text-slate-800 dark:text-white text-xs">24/7</p>
//                   <p className="text-[10px] text-gray-400">Personal Coding Support</p>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, PackageCheck, Tag, X } from "lucide-react";
import { motion } from "framer-motion";

import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product, ProductVariant } from "@/types/product.type";
import { useActiveCategory } from "@/utils/ActiveCategoryContext";

// 🎯 আলাদা তৈরি করা AlsoLike কম্পোনেন্ট ইমপোর্ট
import AlsoLike from "./AlsoLike";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
  const products: Product[] = response?.data || [];
  const product = products.find((item) => item.slug === slug);
  const { setActiveCategory } = useActiveCategory();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);

  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleBackNavigation = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/decor");
    }
  };

  // 🎯 product বা slug পরিবর্তন হলে সরাসরি ভ্যারিয়েন্ট ও ইমেজ রিসেট করা হয়েছে (useEffect ছাড়াই রেন্ডারিং ফেজে হ্যান্ডেল করা নিরাপদ)
  const currentVariant = selectedVariant && product?.variants?.some(v => v.id === selectedVariant.id)
    ? selectedVariant 
    : product?.variants?.[0] || null;

  useEffect(() => {
    if (product) {
      const currentCategory = product.category?.name || product.sub_category?.name || "Decor";
      setActiveCategory(currentCategory);
    }

    return () => {
      setActiveCategory(null);
    };
  }, [product, setActiveCategory]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="text-sm font-medium text-gray-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
      </div>
    );
  }

  const price = Number(currentVariant?.price ?? 0);
  const salePrice = Number(currentVariant?.sale_price ?? 0);
  const hasDiscount = salePrice > 0 && salePrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const productImages: string[] =
    currentVariant?.images && currentVariant.images.length > 0
      ? currentVariant.images.map((img) => img.image_url)
      : [product.thumbnail || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"];

  const whatsappNumber = "8801805734585";
  const productUrl = window.location.href;
  const currentPrice = hasDiscount ? salePrice : price;

  const rawText = `Hello, I am interested in this product.

Product Name: ${product.name}
Price: TK ${currentPrice.toLocaleString()}.00
Product URL: ${productUrl}

Please provide more details.`;

  const whatsappMessage = encodeURIComponent(rawText);

  return (
    <motion.section 
      key={slug} 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-[#FAF9F6] pt-4 sm:pt-6 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-0 max-w-6xl mx-auto w-full"
    >
      {/* IMAGE MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
        >
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:cursor-pointer text-white hover:bg-white/20 transition-all"
          >
            <X size={20} />
          </button>

          <div
            className="relative max-w-[95vw] sm:max-w-[90vw] max-h-[70vh] sm:max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl bg-black flex items-center justify-center cursor-zoom-in"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              ref={imageRef}
              src={productImages[selectedImage]}
              alt={product.name}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isHovered ? "scale(2.2)" : "scale(1)",
              }}
              className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-2xl transition-transform duration-100 ease-out"
            />
          </div>

          {productImages.length > 1 && (
            <div
              className="flex gap-2 sm:gap-3 mt-4 overflow-x-auto p-2 max-w-[95vw] sm:max-w-[90vw] hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all p-1 hover:cursor-pointer ${
                    selectedImage === index
                      ? "border-white bg-white/10 opacity-100 scale-105"
                      : "border-transparent opacity-40 hover:opacity-100 bg-white/5"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Modal Thumbnail ${index}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BACK BUTTON */}
      <div className="mb-6 sm:mb-8">
        <button
          type="button"
          onClick={handleBackNavigation}
          className="text-xs sm:text-sm font-bold tracking-widest text-gray-500 hover:text-gray-900 flex items-center gap-1.5 uppercase cursor-pointer"
        >
          ← BACK TO CATALOG
        </button>
      </div>

      {/* MAIN DETAILS LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-20">
        {/* LEFT SECTION */}
        <motion.div 
          key={`left-${slug}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col gap-3 sm:gap-4"
        >
          <div
            className="w-full bg-white rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100 cursor-zoom-in"
            onClick={() => setModalOpen(true)}
          >
            <div className="w-full rounded-2xl sm:rounded-[32px] overflow-hidden relative">
              <img
                src={productImages[selectedImage] || ""}
                alt={product.name}
                className="w-full h-auto block min-h-62.5 sm:min-h-87.5 md:min-h-112.5 lg:min-h-[60%] object-cover"
              />
            </div>

            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex flex-col gap-1.5 sm:gap-2">
              {product.is_featured === "1" && (
                <span className="bg-[#FF5A00] text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm uppercase">
                  HOT SELL
                </span>
              )}
              <span className="bg-[#5A5A40] text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm uppercase">
                NEW
              </span>
              {discountPercent > 0 && (
                <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>

          {productImages.length > 1 && (
            <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all p-1 ${
                    selectedImage === index
                      ? "border-neutral-900"
                      : "border-transparent opacity-60 hover:opacity-100 bg-white"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* RIGHT SECTION */}
        <motion.div 
          key={`right-${slug}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full lg:w-1/2 pt-0 sm:pt-2 lg:pt-4"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="text-[10px] font-bold text-neutral-900/50 uppercase tracking-widest">
              {product.sub_category?.name || product.category?.name || "DECOR"}
            </span>
            <span className="text-neutral-900/30">•</span>
            <span className="text-[10px] font-mono text-neutral-900/50">
              {currentVariant?.sku || "N/A"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.15] sm:leading-[1.1] text-brand-text mb-4 sm:mb-6">
            {product.name}
          </h1>

          <div className="flex items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
            </span>
            {hasDiscount && (
              <span className="text-base sm:text-xl text-neutral-900/40 line-through mb-0.5 sm:mb-1">
                TK {price.toLocaleString()}.00
              </span>
            )}
          </div>

          <div className="mb-8 sm:mb-10 max-w-none leading-relaxed
            [&_p]:my-1.5 [&_p]:text-[#1A1A1A]/70 [&_p]:text-sm sm:[&_p]:text-base
            [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-2 sm:[&_ul]:space-y-3
            [&_ul_li]:text-[#1A1A1A]/70 [&_ul_li]:text-sm sm:[&_ul_li]:text-base [&_ul_li]:leading-snug
            [&_ul_li]:marker:text-[#1A1A1A]/20
            [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
            [&_em]:italic
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs sm:[&_table]:text-sm
            [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
            [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
            ">
            {product.short_description && (
              <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
            )}
            {product.description && (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <PackageCheck className="text-green-600 w-5 h-5 sm:w-6 sm:h-6 stroke-2" />
              <span className="text-sm sm:text-base font-medium text-green-700">In Stock</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
              <span className="text-sm sm:text-base font-medium">Direct Order</span>
            </div>
          </div>

          {product.variants && product.variants.length > 1 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedImage(0);
                    }}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${
                      currentVariant?.id === v.id
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    Option {idx + 1} ({v.sku})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <a
              href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-[#1A1A1A] text-white w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
            >
              <MessageCircle size={18} className="sm:w-5 sm:h-5" />
              BUY NOW ON WHATSAPP
            </a>
          </div>

          <p className="text-[10px] text-[#1A1A1A]/50 uppercase mt-3 sm:mt-4 tracking-wider text-center md:text-left">
            Clicking this will open a prefilled WhatsApp chat to process your order.
          </p>
        </motion.div>
      </div>

      {/* AlsoLike COMPONENT */}
      <AlsoLike
        subCategoryId={product.sub_category_id}
        currentSlug={product.slug}
      />
    </motion.section>
  );
}















// /* eslint-disable react-hooks/set-state-in-effect */

// import { useState, useEffect, useRef } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { MessageCircle, PackageCheck, Tag, X } from "lucide-react";
// import { motion } from "framer-motion";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";

// // 🎯 আলাদা তৈরি করা AlsoLike কম্পোনেন্ট ইমপোর্ট
// import AlsoLike from "./AlsoLike"; // (পাথ টি আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী অ্যাডজাস্ট করে নিন)

// export default function ProductDetails() {
//   const { slug } = useParams<{ slug: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
//   const products: Product[] = response?.data || [];
//   const product = products.find((item) => item.slug === slug);
//   const { setActiveCategory } = useActiveCategory();

//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
//   const [selectedImage, setSelectedImage] = useState<number>(0);
//   const [modalOpen, setModalOpen] = useState(false);

//   const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
//   const [isHovered, setIsHovered] = useState(false);
//   const imageRef = useRef<HTMLImageElement>(null);

//   const handleBackNavigation = () => {
//     if (location.state?.from) {
//       navigate(location.state.from);
//     } else if (window.history.length > 2) {
//       navigate(-1);
//     } else {
//       navigate("/decor");
//     }
//   };

//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       setSelectedVariant(product.variants[0]);
//       setSelectedImage(0);
//     }
//   }, [product]);

//   useEffect(() => {
//     if (product) {
//       const currentCategory = product.category?.name || product.sub_category?.name || "Decor";
//       setActiveCategory(currentCategory);
//     }

//     return () => {
//       setActiveCategory(null);
//     };
//   }, [product, setActiveCategory]);

//   useEffect(() => {
//     if (modalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [modalOpen]);

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!imageRef.current) return;
//     const { left, top, width, height } = imageRef.current.getBoundingClientRect();
//     const x = ((e.clientX - left) / width) * 100;
//     const y = ((e.clientY - top) / height) * 100;
//     setZoomPos({ x, y });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
//         <div className="text-sm font-medium text-gray-400 animate-pulse">Loading...</div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
//         <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
//       </div>
//     );
//   }

//   const currentVariant = selectedVariant || product.variants?.[0];

//   const price = Number(currentVariant?.price ?? 0);
//   const salePrice = Number(currentVariant?.sale_price ?? 0);
//   const hasDiscount = salePrice > 0 && salePrice < price;
//   const discountPercent = hasDiscount
//     ? Math.round(((price - salePrice) / price) * 100)
//     : 0;

//   const productImages: string[] =
//     currentVariant?.images && currentVariant.images.length > 0
//       ? currentVariant.images.map((img) => img.image_url)
//       : [product.thumbnail || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"];

//   const whatsappNumber = "8801805734585";
//   const productUrl = window.location.href;
//   const currentPrice = hasDiscount ? salePrice : price;

//   const rawText = `Hello, I am interested in this product.

// Product Name: ${product.name}
// Price: TK ${currentPrice.toLocaleString()}.00
// Product URL: ${productUrl}

// Please provide more details.`;

//   const whatsappMessage = encodeURIComponent(rawText);

//   return (
//     <motion.section 
//       key={slug} /* 👈 key={slug} যুক্ত করার ফলে প্রতিবার slug পরিবর্তন হলে framer-motion এনিমেশন পুনরায় রান করবে */
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className="min-h-screen bg-[#FAF9F6] pt-4 sm:pt-6 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-0 max-w-6xl mx-auto w-full"
//     >
//       {/* IMAGE MODAL */}
//       {modalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
//           onClick={() => setModalOpen(false)}
//         >
//           <button
//             onClick={() => setModalOpen(false)}
//             className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:cursor-pointer text-white hover:bg-white/20 transition-all"
//           >
//             <X size={20} />
//           </button>

//           <div
//             className="relative max-w-[95vw] sm:max-w-[90vw] max-h-[70vh] sm:max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl bg-black flex items-center justify-center cursor-zoom-in"
//             onClick={(e) => e.stopPropagation()}
//             onMouseMove={handleMouseMove}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <img
//               ref={imageRef}
//               src={productImages[selectedImage]}
//               alt={product.name}
//               style={{
//                 transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
//                 transform: isHovered ? "scale(2.2)" : "scale(1)",
//               }}
//               className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-2xl transition-transform duration-100 ease-out"
//             />
//           </div>

//           {productImages.length > 1 && (
//             <div
//               className="flex gap-2 sm:gap-3 mt-4 overflow-x-auto p-2 max-w-[95vw] sm:max-w-[90vw] hide-scrollbar"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all p-1 hover:cursor-pointer ${
//                     selectedImage === index
//                       ? "border-white bg-white/10 opacity-100 scale-105"
//                       : "border-transparent opacity-40 hover:opacity-100 bg-white/5"
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Modal Thumbnail ${index}`}
//                     className="w-full h-full object-contain rounded-lg"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* BACK BUTTON */}
//       <div className="mb-6 sm:mb-8">
//         <button
//           type="button"
//           onClick={handleBackNavigation}
//           className="text-xs sm:text-sm font-bold tracking-widest text-gray-500 hover:text-gray-900 flex items-center gap-1.5 uppercase cursor-pointer"
//         >
//           ← BACK TO CATALOG
//         </button>
//       </div>

//       {/* MAIN DETAILS LAYOUT */}
//       <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-20">
//         {/* LEFT SECTION */}
//         <motion.div 
//           key={`left-${slug}`} /* 👈 এখানেও key যোগ করা হলো যাতে ছবির অংশটি আলাদাভাবে Fade In করে */
//           initial={{ opacity: 0, x: -30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
//           className="w-full lg:w-1/2 flex flex-col gap-3 sm:gap-4"
//         >
//           <div
//             className="w-full bg-white rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100 cursor-zoom-in"
//             onClick={() => setModalOpen(true)}
//           >
//             <div className="w-full rounded-2xl sm:rounded-[32px] overflow-hidden relative">
//               <img
//                 src={productImages[selectedImage] || ""}
//                 alt={product.name}
//                 className="w-full h-auto block min-h-62.5 sm:min-h-87.5 md:min-h-112.5 lg:min-h-[60%] object-cover"
//               />
//             </div>

//             <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex flex-col gap-1.5 sm:gap-2">
//               {product.is_featured === "1" && (
//                 <span className="bg-[#FF5A00] text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm uppercase">
//                   HOT SELL
//                 </span>
//               )}
//               <span className="bg-[#5A5A40] text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm uppercase">
//                 NEW
//               </span>
//               {discountPercent > 0 && (
//                 <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm">
//                   -{discountPercent}%
//                 </span>
//               )}
//             </div>
//           </div>

//           {productImages.length > 1 && (
//             <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar">
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all p-1 ${
//                     selectedImage === index
//                       ? "border-neutral-900"
//                       : "border-transparent opacity-60 hover:opacity-100 bg-white"
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Thumbnail ${index}`}
//                     className="w-full h-full object-contain rounded-lg"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </motion.div>

//         {/* RIGHT SECTION */}
//         <motion.div 
//           key={`right-${slug}`} /* 👈 এখানেও key যোগ করা হলো যাতে তথ্যের অংশটি সুন্দরভাবে Fade In করে */
//           initial={{ opacity: 0, x: 30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
//           className="w-full lg:w-1/2 pt-0 sm:pt-2 lg:pt-4"
//         >
//           <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//             <span className="text-[10px] font-bold text-neutral-900/50 uppercase tracking-widest">
//               {product.sub_category?.name || product.category?.name || "DECOR"}
//             </span>
//             <span className="text-neutral-900/30">•</span>
//             <span className="text-[10px] font-mono text-neutral-900/50">
//               {currentVariant?.sku || "N/A"}
//             </span>
//           </div>

//           <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.15] sm:leading-[1.1] text-brand-text mb-4 sm:mb-6">
//             {product.name}
//           </h1>

//           <div className="flex items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
//             <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A]">
//               TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
//             </span>
//             {hasDiscount && (
//               <span className="text-base sm:text-xl text-neutral-900/40 line-through mb-0.5 sm:mb-1">
//                 TK {price.toLocaleString()}.00
//               </span>
//             )}
//           </div>

//           <div className="mb-8 sm:mb-10 max-w-none leading-relaxed
//             [&_p]:my-1.5 [&_p]:text-[#1A1A1A]/70 [&_p]:text-sm sm:[&_p]:text-base
//             [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-2 sm:[&_ul]:space-y-3
//             [&_ul_li]:text-[#1A1A1A]/70 [&_ul_li]:text-sm sm:[&_ul_li]:text-base [&_ul_li]:leading-snug
//             [&_ul_li]:marker:text-[#1A1A1A]/20
//             [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
//             [&_em]:italic
//             [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs sm:[&_table]:text-sm
//             [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
//             [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
//             ">
//             {product.short_description && (
//               <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
//             )}
//             {product.description && (
//               <div dangerouslySetInnerHTML={{ __html: product.description }} />
//             )}
//           </div>

//           <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-neutral-100">
//             <div className="flex items-center gap-2">
//               <PackageCheck className="text-green-600 w-5 h-5 sm:w-6 sm:h-6 stroke-2" />
//               <span className="text-sm sm:text-base font-medium text-green-700">In Stock</span>
//             </div>
//             <div className="flex items-center gap-2 text-neutral-500">
//               <Tag className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
//               <span className="text-sm sm:text-base font-medium">Direct Order</span>
//             </div>
//           </div>

//           {product.variants && product.variants.length > 1 && (
//             <div className="mb-6">
//               <div className="flex flex-wrap gap-2">
//                 {product.variants.map((v, idx) => (
//                   <button
//                     key={v.id}
//                     onClick={() => {
//                       setSelectedVariant(v);
//                       setSelectedImage(0);
//                     }}
//                     className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${
//                       currentVariant?.id === v.id
//                         ? "border-black bg-black text-white"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
//                     }`}
//                   >
//                     Option {idx + 1} ({v.sku})
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div>
//             <a
//               href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-[#1A1A1A] text-white w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
//             >
//               <MessageCircle size={18} className="sm:w-5 sm:h-5" />
//               BUY NOW ON WHATSAPP
//             </a>
//           </div>

//           <p className="text-[10px] text-[#1A1A1A]/50 uppercase mt-3 sm:mt-4 tracking-wider text-center md:text-left">
//             Clicking this will open a prefilled WhatsApp chat to process your order.
//           </p>
//         </motion.div>
//       </div>

//       {/* 🎯 SEPARATE ALSO LIKE COMPONENT */}
//       <AlsoLike
//         subCategoryId={product.sub_category_id}
//         currentSlug={product.slug}
//       />
//     </motion.section>
//   );
// }









// /* eslint-disable react-hooks/set-state-in-effect */
// import { useState, useEffect, useRef } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { MessageCircle, PackageCheck, Tag, X } from "lucide-react";
// import { motion } from "framer-motion";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";

// // 🎯 আলাদা তৈরি করা AlsoLike কম্পোনেন্ট ইমপোর্ট
// import AlsoLike from "./AlsoLike"; // (পাথ টি আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী অ্যাডজাস্ট করে নিন)

// export default function ProductDetails() {
//   const { slug } = useParams<{ slug: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
//   const products: Product[] = response?.data || [];
//   const product = products.find((item) => item.slug === slug);
//   const { setActiveCategory } = useActiveCategory();

//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
//   const [selectedImage, setSelectedImage] = useState<number>(0);
//   const [modalOpen, setModalOpen] = useState(false);

//   const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
//   const [isHovered, setIsHovered] = useState(false);
//   const imageRef = useRef<HTMLImageElement>(null);

//   const handleBackNavigation = () => {
//     if (location.state?.from) {
//       navigate(location.state.from);
//     } else if (window.history.length > 2) {
//       navigate(-1);
//     } else {
//       navigate("/decor");
//     }
//   };

//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       setSelectedVariant(product.variants[0]);
//       setSelectedImage(0);
//     }
//   }, [product]);

//   useEffect(() => {
//     if (product) {
//       const currentCategory = product.category?.name || product.sub_category?.name || "Decor";
//       setActiveCategory(currentCategory);
//     }

//     return () => {
//       setActiveCategory(null);
//     };
//   }, [product, setActiveCategory]);

//   useEffect(() => {
//     if (modalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [modalOpen]);

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!imageRef.current) return;
//     const { left, top, width, height } = imageRef.current.getBoundingClientRect();
//     const x = ((e.clientX - left) / width) * 100;
//     const y = ((e.clientY - top) / height) * 100;
//     setZoomPos({ x, y });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
//         <div className="text-sm font-medium text-gray-400 animate-pulse">Loading...</div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
//         <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
//       </div>
//     );
//   }

//   const currentVariant = selectedVariant || product.variants?.[0];

//   const price = Number(currentVariant?.price ?? 0);
//   const salePrice = Number(currentVariant?.sale_price ?? 0);
//   const hasDiscount = salePrice > 0 && salePrice < price;
//   const discountPercent = hasDiscount
//     ? Math.round(((price - salePrice) / price) * 100)
//     : 0;

//   const productImages: string[] =
//     currentVariant?.images && currentVariant.images.length > 0
//       ? currentVariant.images.map((img) => img.image_url)
//       : [product.thumbnail || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"];

//   const whatsappNumber = "8801805734585";
//   const productUrl = window.location.href;
//   const currentPrice = hasDiscount ? salePrice : price;

//   const rawText = `Hello, I am interested in this product.

// Product Name: ${product.name}
// Price: TK ${currentPrice.toLocaleString()}.00
// Product URL: ${productUrl}

// Please provide more details.`;

//   const whatsappMessage = encodeURIComponent(rawText);

//   return (
//     <motion.section 
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className="min-h-screen bg-[#FAF9F6] pt-4 sm:pt-6 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-0 max-w-6xl mx-auto w-full"
//     >
//       {/* IMAGE MODAL */}
//       {modalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
//           onClick={() => setModalOpen(false)}
//         >
//           <button
//             onClick={() => setModalOpen(false)}
//             className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:cursor-pointer text-white hover:bg-white/20 transition-all"
//           >
//             <X size={20} />
//           </button>

//           <div
//             className="relative max-w-[95vw] sm:max-w-[90vw] max-h-[70vh] sm:max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl bg-black flex items-center justify-center cursor-zoom-in"
//             onClick={(e) => e.stopPropagation()}
//             onMouseMove={handleMouseMove}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <img
//               ref={imageRef}
//               src={productImages[selectedImage]}
//               alt={product.name}
//               style={{
//                 transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
//                 transform: isHovered ? "scale(2.2)" : "scale(1)",
//               }}
//               className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-2xl transition-transform duration-100 ease-out"
//             />
//           </div>

//           {productImages.length > 1 && (
//             <div
//               className="flex gap-2 sm:gap-3 mt-4 overflow-x-auto p-2 max-w-[95vw] sm:max-w-[90vw] hide-scrollbar"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all p-1 hover:cursor-pointer ${
//                     selectedImage === index
//                       ? "border-white bg-white/10 opacity-100 scale-105"
//                       : "border-transparent opacity-40 hover:opacity-100 bg-white/5"
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Modal Thumbnail ${index}`}
//                     className="w-full h-full object-contain rounded-lg"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* BACK BUTTON */}
//       <div className="mb-6 sm:mb-8">
//         <button
//           type="button"
//           onClick={handleBackNavigation}
//           className="text-xs sm:text-sm font-bold tracking-widest text-gray-500 hover:text-gray-900 flex items-center gap-1.5 uppercase cursor-pointer"
//         >
//           ← BACK TO CATALOG
//         </button>
//       </div>

//       {/* MAIN DETAILS LAYOUT */}
//       <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-20">
//         {/* LEFT SECTION */}
//         <motion.div 
//           initial={{ opacity: 0, x: -30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
//           className="w-full lg:w-1/2 flex flex-col gap-3 sm:gap-4"
//         >
//           <div
//             className="w-full bg-white rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100 cursor-zoom-in"
//             onClick={() => setModalOpen(true)}
//           >
//             <div className="w-full rounded-2xl sm:rounded-[32px] overflow-hidden relative">
//               <img
//                 src={productImages[selectedImage] || ""}
//                 alt={product.name}
//                 className="w-full h-auto block min-h-62.5 sm:min-h-87.5 md:min-h-112.5 lg:min-h-[60%] object-cover"
//               />
//             </div>

//             <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex flex-col gap-1.5 sm:gap-2">
//               {product.is_featured === "1" && (
//                 <span className="bg-[#FF5A00] text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm uppercase">
//                   HOT SELL
//                 </span>
//               )}
//               <span className="bg-[#5A5A40] text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm uppercase">
//                 NEW
//               </span>
//               {discountPercent > 0 && (
//                 <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm">
//                   -{discountPercent}%
//                 </span>
//               )}
//             </div>
//           </div>

//           {productImages.length > 1 && (
//             <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar">
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all p-1 ${
//                     selectedImage === index
//                       ? "border-neutral-900"
//                       : "border-transparent opacity-60 hover:opacity-100 bg-white"
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Thumbnail ${index}`}
//                     className="w-full h-full object-contain rounded-lg"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </motion.div>

//         {/* RIGHT SECTION */}
//         <motion.div 
//           initial={{ opacity: 0, x: 30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
//           className="w-full lg:w-1/2 pt-0 sm:pt-2 lg:pt-4"
//         >
//           <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//             <span className="text-[10px] font-bold text-neutral-900/50 uppercase tracking-widest">
//               {product.sub_category?.name || product.category?.name || "DECOR"}
//             </span>
//             <span className="text-neutral-900/30">•</span>
//             <span className="text-[10px] font-mono text-neutral-900/50">
//               {currentVariant?.sku || "N/A"}
//             </span>
//           </div>

//           <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.15] sm:leading-[1.1] text-brand-text mb-4 sm:mb-6">
//             {product.name}
//           </h1>

//           <div className="flex items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
//             <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A]">
//               TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
//             </span>
//             {hasDiscount && (
//               <span className="text-base sm:text-xl text-neutral-900/40 line-through mb-0.5 sm:mb-1">
//                 TK {price.toLocaleString()}.00
//               </span>
//             )}
//           </div>

//           <div className="mb-8 sm:mb-10 max-w-none leading-relaxed
//             [&_p]:my-1.5 [&_p]:text-[#1A1A1A]/70 [&_p]:text-sm sm:[&_p]:text-base
//             [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-2 sm:[&_ul]:space-y-3
//             [&_ul_li]:text-[#1A1A1A]/70 [&_ul_li]:text-sm sm:[&_ul_li]:text-base [&_ul_li]:leading-snug
//             [&_ul_li]:marker:text-[#1A1A1A]/20
//             [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
//             [&_em]:italic
//             [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs sm:[&_table]:text-sm
//             [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
//             [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
//             ">
//             {product.short_description && (
//               <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
//             )}
//             {product.description && (
//               <div dangerouslySetInnerHTML={{ __html: product.description }} />
//             )}
//           </div>

//           <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-neutral-100">
//             <div className="flex items-center gap-2">
//               <PackageCheck className="text-green-600 w-5 h-5 sm:w-6 sm:h-6 stroke-2" />
//               <span className="text-sm sm:text-base font-medium text-green-700">In Stock</span>
//             </div>
//             <div className="flex items-center gap-2 text-neutral-500">
//               <Tag className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
//               <span className="text-sm sm:text-base font-medium">Direct Order</span>
//             </div>
//           </div>

//           {product.variants && product.variants.length > 1 && (
//             <div className="mb-6">
//               <div className="flex flex-wrap gap-2">
//                 {product.variants.map((v, idx) => (
//                   <button
//                     key={v.id}
//                     onClick={() => {
//                       setSelectedVariant(v);
//                       setSelectedImage(0);
//                     }}
//                     className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${
//                       currentVariant?.id === v.id
//                         ? "border-black bg-black text-white"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
//                     }`}
//                   >
//                     Option {idx + 1} ({v.sku})
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div>
//             <a
//               href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-[#1A1A1A] text-white w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
//             >
//               <MessageCircle size={18} className="sm:w-5 sm:h-5" />
//               BUY NOW ON WHATSAPP
//             </a>
//           </div>

//           <p className="text-[10px] text-[#1A1A1A]/50 uppercase mt-3 sm:mt-4 tracking-wider text-center md:text-left">
//             Clicking this will open a prefilled WhatsApp chat to process your order.
//           </p>
//         </motion.div>
//       </div>

//       {/* 🎯 SEPARATE ALSO LIKE COMPONENT */}
//       <AlsoLike
//         subCategoryId={product.sub_category_id}
//         currentSlug={product.slug}
//       />
//     </motion.section>
//   );
// }











// /* eslint-disable react-hooks/set-state-in-effect */

// import { useState, useEffect, useRef } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { MessageCircle, PackageCheck, Tag, X } from "lucide-react";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";
// import AlsoLike from "./AlsoLike";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";

// export default function ProductDetails() {
//   const { slug } = useParams<{ slug: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
//   const products: Product[] = response?.data || [];
//   const product = products.find((item) => item.slug === slug);
//   const { setActiveCategory } = useActiveCategory();

//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
//   const [selectedImage, setSelectedImage] = useState<number>(0);
//   const [modalOpen, setModalOpen] = useState(false);

//   const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
//   const [isHovered, setIsHovered] = useState(false);
//   const imageRef = useRef<HTMLImageElement>(null);

//   // 🎯 Dynamic Back Handler Function
//   const handleBackNavigation = () => {
//     // ১. যদি state-এ 'from' লোকেশন পাঠানো থাকে
//     if (location.state?.from) {
//       navigate(location.state.from);
//     } 
//     // ২. যদি ব্রাউজারে প্রিভিয়াস হিস্ট্রি থাকে (window.history.key "default" না হয়)
//     else if (window.history.length > 2) {
//       navigate(-1);
//     } 
//     // ৩. ডিফল্ট ব্যাকগ্রাউন্ড রাউট
//     else {
//       navigate("/decor");
//     }
//   };

//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       setSelectedVariant(product.variants[0]);
//       setSelectedImage(0);
//     }
//   }, [product]);

//   // Dynamic Category Tracking Effects
//   useEffect(() => {
//     if (product) {
//       const currentCategory = product.category?.name || product.sub_category?.name || "Decor";
//       setActiveCategory(currentCategory);
//     }

//     return () => {
//       setActiveCategory(null);
//     };
//   }, [product, setActiveCategory]);

//   // Modal open এ scroll lock
//   useEffect(() => {
//     if (modalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [modalOpen]);

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!imageRef.current) return;
//     const { left, top, width, height } = imageRef.current.getBoundingClientRect();
//     const x = ((e.clientX - left) / width) * 100;
//     const y = ((e.clientY - top) / height) * 100;
//     setZoomPos({ x, y });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
//         <div className="text-sm font-medium text-gray-400 animate-pulse">Loading...</div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
//         <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
//       </div>
//     );
//   }

//   const currentVariant = selectedVariant || product.variants?.[0];

//   const price = Number(currentVariant?.price ?? 0);
//   const salePrice = Number(currentVariant?.sale_price ?? 0);
//   const hasDiscount = salePrice > 0 && salePrice < price;
//   const discountPercent = hasDiscount
//     ? Math.round(((price - salePrice) / price) * 100)
//     : 0;

//   const productImages: string[] =
//     currentVariant?.images && currentVariant.images.length > 0
//       ? currentVariant.images.map((img) => img.image_url)
//       : [product.thumbnail || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"];

//  // WhatsApp Configuration
//   const whatsappNumber = "8801805734585";
//   const productUrl = window.location.href;
//   const currentPrice = hasDiscount ? salePrice : price;

//   // Custom Formatted WhatsApp Message with exact %0A break
//   const rawText = `Hello, I am interested in this product.

// Product Name: ${product.name}
// Price: TK ${currentPrice.toLocaleString()}.00
// Product URL: ${productUrl}

// Please provide more details.`;

//   const whatsappMessage = encodeURIComponent(rawText);

//   return (
//     <section className="min-h-screen bg-[#FAF9F6] pt-4 sm:pt-6 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-0 max-w-6xl mx-auto w-full">

//       {/* ✅ IMAGE MODAL WITH HOVER ZOOM SYSTEM & THUMBNAILS */}
//       {modalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
//           onClick={() => setModalOpen(false)}
//         >
//           {/* Close button */}
//           <button
//             onClick={() => setModalOpen(false)}
//             className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:cursor-pointer text-white hover:bg-white/20 transition-all"
//           >
//             <X size={20} />
//           </button>

//           {/* Main Zoomable Image in Modal */}
//           <div
//             className="relative max-w-[95vw] sm:max-w-[90vw] max-h-[70vh] sm:max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl bg-black flex items-center justify-center cursor-zoom-in"
//             onClick={(e) => e.stopPropagation()}
//             onMouseMove={handleMouseMove}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <img
//               ref={imageRef}
//               src={productImages[selectedImage]}
//               alt={product.name}
//               style={{
//                 transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
//                 transform: isHovered ? "scale(2.2)" : "scale(1)",
//               }}
//               className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-2xl transition-transform duration-100 ease-out"
//             />
//           </div>

//           {/* Modal Thumbnails */}
//           {productImages.length > 1 && (
//             <div
//               className="flex gap-2 sm:gap-3 mt-4 overflow-x-auto p-2 max-w-[95vw] sm:max-w-[90vw] hide-scrollbar"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all p-1 hover:cursor-pointer ${
//                     selectedImage === index
//                       ? "border-white bg-white/10 opacity-100 scale-105"
//                       : "border-transparent opacity-40 hover:opacity-100 bg-white/5"
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Modal Thumbnail ${index}`}
//                     className="w-full h-full object-contain rounded-lg"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ✅ UPDATED BACK TO CATALOG BUTTON */}
//       <div className="mb-6 sm:mb-8">
//         <button
//           type="button"
//           onClick={handleBackNavigation}
//           className="text-xs sm:text-sm font-bold tracking-widest text-gray-500 hover:text-gray-900 flex items-center gap-1.5 uppercase cursor-pointer"
//         >
//           ← BACK TO CATALOG
//         </button>
//       </div>

//       {/* MAIN LAYOUT */}
//       <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-20">

//         {/* LEFT */}
//         <div className="w-full lg:w-1/2 flex flex-col gap-3 sm:gap-4">

//           {/* Main image card */}
//           <div
//             className="w-full bg-white rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100 cursor-zoom-in"
//             onClick={() => setModalOpen(true)}
//           >
//             <div className="w-full rounded-2xl sm:rounded-[32px] overflow-hidden relative">
//               <img
//                 src={productImages[selectedImage] || ""}
//                 alt={product.name}
//                 className="w-full h-auto block min-h-62.5 sm:min-h-87.5 md:min-h-112.5 lg:min-h-[60%] object-cover"
//               />
//             </div>

//             {/* Badges */}
//             <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex flex-col gap-1.5 sm:gap-2">
//               {product.is_featured === "1" && (
//                 <span className="bg-[#FF5A00] text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm uppercase">
//                   HOT SELL
//                 </span>
//               )}
//               <span className="bg-[#5A5A40] text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm uppercase">
//                 NEW
//               </span>
//               {discountPercent > 0 && (
//                 <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm">
//                   -{discountPercent}%
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Thumbnails */}
//           {productImages.length > 1 && (
//             <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar">
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all p-1 ${
//                     selectedImage === index
//                       ? "border-neutral-900"
//                       : "border-transparent opacity-60 hover:opacity-100 bg-white"
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Thumbnail ${index}`}
//                     className="w-full h-full object-contain rounded-lg"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* RIGHT */}
//         <div className="w-full lg:w-1/2 pt-0 sm:pt-2 lg:pt-4">

//           <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//             <span className="text-[10px] font-bold text-neutral-900/50 uppercase tracking-widest">
//               {product.sub_category?.name || product.category?.name || "DECOR"}
//             </span>
//             <span className="text-neutral-900/30">•</span>
//             <span className="text-[10px] font-mono text-neutral-900/50">
//               {currentVariant?.sku || "N/A"}
//             </span>
//           </div>

//           <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.15] sm:leading-[1.1] text-brand-text mb-4 sm:mb-6">
//             {product.name}
//           </h1>

//           <div className="flex items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
//             <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A]">
//               TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
//             </span>
//             {hasDiscount && (
//               <span className="text-base sm:text-xl text-neutral-900/40 line-through mb-0.5 sm:mb-1">
//                 TK {price.toLocaleString()}.00
//               </span>
//             )}
//           </div>

//           <div className="mb-8 sm:mb-10 max-w-none leading-relaxed
//             [&_p]:my-1.5 [&_p]:text-[#1A1A1A]/70 [&_p]:text-sm sm:[&_p]:text-base
//             [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-2 sm:[&_ul]:space-y-3
//             [&_ul_li]:text-[#1A1A1A]/70 [&_ul_li]:text-sm sm:[&_ul_li]:text-base [&_ul_li]:leading-snug
//             [&_ul_li]:marker:text-[#1A1A1A]/20
//             [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
//             [&_em]:italic
//             [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs sm:[&_table]:text-sm
//             [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
//             [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
//             ">
//             {product.short_description && (
//               <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
//             )}
//             {product.description && (
//               <div dangerouslySetInnerHTML={{ __html: product.description }} />
//             )}
//           </div>

//           <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-neutral-100">
//             <div className="flex items-center gap-2">
//               <PackageCheck className="text-green-600 w-5 h-5 sm:w-6 sm:h-6 stroke-2" />
//               <span className="text-sm sm:text-base font-medium text-green-700">In Stock</span>
//             </div>
//             <div className="flex items-center gap-2 text-neutral-500">
//               <Tag className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
//               <span className="text-sm sm:text-base font-medium">Direct Order</span>
//             </div>
//           </div>

//           {product.variants && product.variants.length > 1 && (
//             <div className="mb-6">
//               <div className="flex flex-wrap gap-2">
//                 {product.variants.map((v, idx) => (
//                   <button
//                     key={v.id}
//                     onClick={() => {
//                       setSelectedVariant(v);
//                       setSelectedImage(0);
//                     }}
//                     className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${
//                       currentVariant?.id === v.id
//                         ? "border-black bg-black text-white"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
//                     }`}
//                   >
//                     Option {idx + 1} ({v.sku})
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* <div>
//             <a
//               href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-[#1A1A1A] text-white w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
//             >
//               <MessageCircle size={18} className="sm:w-5 sm:h-5" />
//               BUY NOW ON WHATSAPP
//             </a>
//           </div> */}
//           <div>
//     <a
//       href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-[#1A1A1A] text-white w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
//     >
//       <MessageCircle size={18} className="sm:w-5 sm:h-5" />
//       BUY NOW ON WHATSAPP
//     </a>
//   </div>

//           <p className="text-[10px] text-[#1A1A1A]/50 uppercase mt-3 sm:mt-4 tracking-wider text-center md:text-left">
//             Clicking this will open a prefilled WhatsApp chat to process your order.
//           </p>

//         </div>
//       </div>

//       <AlsoLike
//         subCategoryId={product.sub_category_id}
//         currentSlug={product.slug}
//       />

//     </section>
//   );
// }



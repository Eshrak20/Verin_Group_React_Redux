/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageCircle, PackageCheck, Tag, X } from "lucide-react";

import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product, ProductVariant } from "@/types/product.type";
import AlsoLike from "./AlsoLike";
import { useActiveCategory } from "@/utils/ActiveCategoryContext";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();

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

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setSelectedImage(0);
    }
  }, [product]);

  // Dynamic Category Tracking Effects
  useEffect(() => {
    if (product) {
      const currentCategory = product.category?.name || product.sub_category?.name || "Decor";
      setActiveCategory(currentCategory);
    }

    return () => {
      setActiveCategory(null);
    };
  }, [product, setActiveCategory]);

  // Modal open এ scroll lock
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

  const currentVariant = selectedVariant || product.variants?.[0];

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

  const whatsappNumber = "8801XXXXXXXXX";
  const whatsappMessage = encodeURIComponent(
    `Hello, I want to order this product:\n\nName: ${product.name}\nSKU: ${currentVariant?.sku || "N/A"}\nPrice: TK ${(hasDiscount ? salePrice : price).toLocaleString()}.00`
  );

  return (
    <section className="min-h-screen bg-[#FAF9F6] pb-24 max-w-6xl mx-auto w-full">

      {/* ✅ IMAGE MODAL WITH HOVER ZOOM SYSTEM & THUMBNAILS */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:cursor-pointer text-white hover:bg-white/20 transition-all"
          >
            <X size={20} />
          </button>

          {/* Main Zoomable Image in Modal */}
          <div
            className="relative max-w-[90vw] max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl bg-black flex items-center justify-center cursor-zoom-in"
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
              className="max-w-full max-h-[75vh] object-contain rounded-2xl transition-transform duration-100 ease-out"
            />
          </div>

          {/* Modal Thumbnails (যদি একের অধিক ছবি থাকে) */}
          {productImages.length > 1 && (
            <div
              className="flex gap-3 mt-4 overflow-x-auto p-2 max-w-[90vw] hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all p-1 hover:cursor-pointer ${
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

      {/* BACK */}
      <div className="mb-8">
        <Link
          to="/decor"
          className="text-sm font-bold tracking-widest text-gray-500 hover:text-gray-900 flex items-center gap-1.5 uppercase"
        >
          ← BACK TO CATALOG
        </Link>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

        {/* LEFT */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">

          {/* Main image card — ✅ cursor-zoom-in + onClick */}
          <div
            className="w-full bg-white rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100 cursor-zoom-in"
            onClick={() => setModalOpen(true)}
          >
            <div className="w-full rounded-[32px] overflow-hidden relative">
              <img
                src={productImages[selectedImage] || ""}
                alt={product.name}
                className="w-full h-auto block min-h-[60%] object-cover"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-8 left-8 flex flex-col gap-2">
              {product.is_featured === "1" && (
                <span className="bg-[#FF5A00] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm uppercase">
                  HOT SELL
                </span>
              )}
              <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm uppercase">
                NEW
              </span>
              {discountPercent > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all p-1 ${
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
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 pt-4">

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold text-neutral-900/50 uppercase tracking-widest">
              {product.sub_category?.name || product.category?.name || "DECOR"}
            </span>
            <span className="text-neutral-900/30">•</span>
            <span className="text-[10px] font-mono text-neutral-900/50">
              {currentVariant?.sku || "N/A"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif leading-[1.1] text-brand-text mb-6">
            {product.name}
          </h1>

          <div className="flex items-end gap-4 mb-8">
            <span className="text-4xl font-bold text-[#1A1A1A]">
              TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
            </span>
            {hasDiscount && (
              <span className="text-xl text-neutral-900/40 line-through mb-1">
                TK {price.toLocaleString()}.00
              </span>
            )}
          </div>

          <div className="mb-10 max-w-none leading-relaxed
            [&_p]:my-1.5 [&_p]:text-[#1A1A1A]/70 [&_p]:text-base
            [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-3
            [&_ul_li]:text-[#1A1A1A]/70 [&_ul_li]:text-base [&_ul_li]:leading-snug
            [&_ul_li]:marker:text-[#1A1A1A]/20
            [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
            [&_em]:italic
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
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

          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <PackageCheck className="text-green-600 w-6 h-6 stroke-2" />
              <span className="font-medium text-green-700">In Stock</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500">
              <Tag className="w-5 h-5 stroke-2" />
              <span className="font-medium">Direct Order</span>
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
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
            >
              <MessageCircle size={20} />
              BUY NOW ON WHATSAPP
            </a>
          </div>

          <p className="text-[10px] text-[#1A1A1A]/50 uppercase mt-4 tracking-wider text-center md:text-left">
            Clicking this will open a prefilled WhatsApp chat to process your order.
          </p>

        </div>
      </div>

      <AlsoLike
        subCategoryId={product.sub_category_id}
        currentSlug={product.slug}
      />

    </section>
  );
}








// /* eslint-disable react-hooks/set-state-in-effect */

// import { useState, useEffect, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import { MessageCircle, PackageCheck, Tag, X } from "lucide-react";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";
// import AlsoLike from "./AlsoLike";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";


// export default function ProductDetails() {
//   const { slug } = useParams<{ slug: string }>();

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
//     return () => { document.body.style.overflow = ""; };
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

//   const whatsappNumber = "8801XXXXXXXXX";
//   const whatsappMessage = encodeURIComponent(
//     `Hello, I want to order this product:\n\nName: ${product.name}\nSKU: ${currentVariant?.sku || "N/A"}\nPrice: TK ${(hasDiscount ? salePrice : price).toLocaleString()}.00`
//   );

//   return (
//     <section className="min-h-screen bg-[#FAF9F6] pb-24 max-w-6xl mx-auto w-full">

//       {/* ✅ IMAGE MODAL WITH HOVER ZOOM SYSTEM */}
//       {modalOpen && (
//         <div
//           className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
//           onClick={() => setModalOpen(false)}
//         >
//           {/* Close button */}
//           <button
//             onClick={() => setModalOpen(false)}
//             className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:cursor-pointer text-white hover:bg-white/20 transition-all"
//           >
//             <X size={20} />
//           </button>

          
//           <div
//             className="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl bg-black flex items-center justify-center cursor-zoom-in"
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
//               className="max-w-full max-h-[90vh] object-contain rounded-2xl transition-transform duration-100 ease-out"
//             />
//           </div>
//         </div>
//       )}

//       {/* BACK */}
//       <div className="mb-8">
//         <Link
//           to="/decor"
//           className="text-sm font-bold tracking-widest text-gray-500 hover:text-gray-900 flex items-center gap-1.5 uppercase"
//         >
//           ← BACK TO CATALOG
//         </Link>
//       </div>

//       {/* MAIN LAYOUT */}
//       <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

//         {/* LEFT */}
//         <div className="w-full lg:w-1/2 flex flex-col gap-4">

//           {/* Main image card — ✅ cursor-zoom-in + onClick */}
//           <div
//             className="w-full bg-white rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100 cursor-zoom-in"
//             onClick={() => setModalOpen(true)}
//           >
//             <div className="w-full rounded-[32px] overflow-hidden relative">
//               <img
//                 src={productImages[selectedImage] || ""}
//                 alt={product.name}
//                 className="w-full h-auto block min-h-[60%] object-cover"
//               />
//             </div>

//             {/* Badges */}
//             <div className="absolute top-8 left-8 flex flex-col gap-2">
//               {product.is_featured === "1" && (
//                 <span className="bg-[#FF5A00] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm uppercase">
//                   HOT SELL
//                 </span>
//               )}
//               <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm uppercase">
//                 NEW
//               </span>
//               {discountPercent > 0 && (
//                 <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm">
//                   -{discountPercent}%
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Thumbnails */}
//           {productImages.length > 1 && (
//             <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all p-1 ${selectedImage === index
//                     ? "border-neutral-900"
//                     : "border-transparent opacity-60 hover:opacity-100 bg-white"
//                     }`}
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
//         <div className="w-full lg:w-1/2 pt-4">

//           <div className="flex items-center gap-3 mb-4">
//             <span className="text-[10px] font-bold text-neutral-900/50 uppercase tracking-widest">
//               {product.sub_category?.name || product.category?.name || "DECOR"}
//             </span>
//             <span className="text-neutral-900/30">•</span>
//             <span className="text-[10px] font-mono text-neutral-900/50">
//               {currentVariant?.sku || "N/A"}
//             </span>
//           </div>

//           <h1 className="text-4xl md:text-6xl font-serif leading-[1.1] text-brand-text mb-6">
//             {product.name}
//           </h1>

//           <div className="flex items-end gap-4 mb-8">
//             <span className="text-4xl font-bold text-[#1A1A1A]">
//               TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
//             </span>
//             {hasDiscount && (
//               <span className="text-xl text-neutral-900/40 line-through mb-1">
//                 TK {price.toLocaleString()}.00
//               </span>
//             )}
//           </div>

//           <div className="mb-10 max-w-none leading-relaxed
//             [&_p]:my-1.5 [&_p]:text-[#1A1A1A]/70 [&_p]:text-base
//             [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-3
//             [&_ul_li]:text-[#1A1A1A]/70 [&_ul_li]:text-base [&_ul_li]:leading-snug
//             [&_ul_li]:marker:text-[#1A1A1A]/20
//             [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
//             [&_em]:italic
//             [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
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

//           <div className="flex items-center gap-6 mb-10 pb-10 border-b border-neutral-100">
//             <div className="flex items-center gap-2">
//               <PackageCheck className="text-green-600 w-6 h-6 stroke-2" />
//               <span className="font-medium text-green-700">In Stock</span>
//             </div>
//             <div className="flex items-center gap-2 text-neutral-500">
//               <Tag className="w-5 h-5 stroke-2" />
//               <span className="font-medium">Direct Order</span>
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
//                     className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${currentVariant?.id === v.id
//                       ? "border-black bg-black text-white"
//                       : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
//                       }`}
//                   >
//                     Option {idx + 1} ({v.sku})
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div>
//             <a
//               href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-3 bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
//             >
//               <MessageCircle size={20} />
//               BUY NOW ON WHATSAPP
//             </a>
//           </div>

//           <p className="text-[10px] text-[#1A1A1A]/50 uppercase mt-4 tracking-wider text-center md:text-left">
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







// /* eslint-disable react-hooks/set-state-in-effect */

// import { useState, useEffect, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import { MessageCircle, PackageCheck, Tag, X } from "lucide-react";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";
// import AlsoLike from "./AlsoLike";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";


// export default function ProductDetails() {
//   const { slug } = useParams<{ slug: string }>();

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

//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       setSelectedVariant(product.variants[0]);
//       setSelectedImage(0);
//     }
//   }, [product]);


  

//   // Modal open এ scroll lock
//   useEffect(() => {
//     if (modalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => { document.body.style.overflow = ""; };
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

//   const whatsappNumber = "8801XXXXXXXXX";
//   const whatsappMessage = encodeURIComponent(
//     `Hello, I want to order this product:\n\nName: ${product.name}\nSKU: ${currentVariant?.sku || "N/A"}\nPrice: TK ${(hasDiscount ? salePrice : price).toLocaleString()}.00`
//   );

//   return (
//     <section className="min-h-screen bg-[#FAF9F6] pb-24 max-w-6xl mx-auto w-full">

//       {/* ✅ IMAGE MODAL WITH HOVER ZOOM SYSTEM */}
//       {modalOpen && (
//         <div
//           className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
//           onClick={() => setModalOpen(false)}
//         >
//           {/* Close button */}
//           <button
//             onClick={() => setModalOpen(false)}
//             className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:cursor-pointer text-white hover:bg-white/20 transition-all"
//           >
//             <X size={20} />
//           </button>

          
//           <div
//             className="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl bg-black flex items-center justify-center cursor-zoom-in"
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
//               className="max-w-full max-h-[90vh] object-contain rounded-2xl transition-transform duration-100 ease-out"
//             />
//           </div>
//         </div>
//       )}

//       {/* BACK */}
//       <div className="mb-8">
//         <Link
//           to="/decor"
//           className="text-sm font-bold tracking-widest text-gray-500 hover:text-gray-900 flex items-center gap-1.5 uppercase"
//         >
//           ← BACK TO CATALOG
//         </Link>
//       </div>

//       {/* MAIN LAYOUT */}
//       <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

//         {/* LEFT */}
//         <div className="w-full lg:w-1/2 flex flex-col gap-4">

//           {/* Main image card — ✅ cursor-zoom-in + onClick */}
//           <div
//             className="w-full bg-white rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100 cursor-zoom-in"
//             onClick={() => setModalOpen(true)}
//           >
//             <div className="w-full rounded-[32px] overflow-hidden relative">
//               <img
//                 src={productImages[selectedImage] || ""}
//                 alt={product.name}
//                 className="w-full h-auto block min-h-[60%] object-cover"
//               />
//             </div>

//             {/* Badges */}
//             <div className="absolute top-8 left-8 flex flex-col gap-2">
//               {product.is_featured === "1" && (
//                 <span className="bg-[#FF5A00] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm uppercase">
//                   HOT SELL
//                 </span>
//               )}
//               <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm uppercase">
//                 NEW
//               </span>
//               {discountPercent > 0 && (
//                 <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm">
//                   -{discountPercent}%
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Thumbnails */}
//           {productImages.length > 1 && (
//             <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all p-1 ${selectedImage === index
//                     ? "border-neutral-900"
//                     : "border-transparent opacity-60 hover:opacity-100 bg-white"
//                     }`}
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
//         <div className="w-full lg:w-1/2 pt-4">

//           <div className="flex items-center gap-3 mb-4">
//             <span className="text-[10px] font-bold text-neutral-900/50 uppercase tracking-widest">
//               {product.sub_category?.name || product.category?.name || "DECOR"}
//             </span>
//             <span className="text-neutral-900/30">•</span>
//             <span className="text-[10px] font-mono text-neutral-900/50">
//               {currentVariant?.sku || "N/A"}
//             </span>
//           </div>

//           <h1 className="text-4xl md:text-6xl font-serif leading-[1.1] text-brand-text mb-6">
//             {product.name}
//           </h1>

//           <div className="flex items-end gap-4 mb-8">
//             <span className="text-4xl font-bold text-[#1A1A1A]">
//               TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
//             </span>
//             {hasDiscount && (
//               <span className="text-xl text-neutral-900/40 line-through mb-1">
//                 TK {price.toLocaleString()}.00
//               </span>
//             )}
//           </div>

//           <div className="mb-10 max-w-none leading-relaxed
//               [&_p]:my-1.5 [&_p]:text-[#1A1A1A]/70 [&_p]:text-base
//               [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-3
//               [&_ul_li]:text-[#1A1A1A]/70 [&_ul_li]:text-base [&_ul_li]:leading-snug
//               [&_ul_li]:marker:text-[#1A1A1A]/20
//               [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
//               [&_em]:italic
//               [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
//               [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
//               [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
//             ">
//             {product.short_description && (
//               <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
//             )}
//             {product.description && (
//               <div dangerouslySetInnerHTML={{ __html: product.description }} />
//             )}
//           </div>

//           <div className="flex items-center gap-6 mb-10 pb-10 border-b border-neutral-100">
//             <div className="flex items-center gap-2">
//               <PackageCheck className="text-green-600 w-6 h-6 stroke-2" />
//               <span className="font-medium text-green-700">In Stock</span>
//             </div>
//             <div className="flex items-center gap-2 text-neutral-500">
//               <Tag className="w-5 h-5 stroke-2" />
//               <span className="font-medium">Direct Order</span>
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
//                     className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${currentVariant?.id === v.id
//                       ? "border-black bg-black text-white"
//                       : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
//                       }`}
//                   >
//                     Option {idx + 1} ({v.sku})
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div>
//             <a
//               href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-3 bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
//             >
//               <MessageCircle size={20} />
//               BUY NOW ON WHATSAPP
//             </a>
//           </div>

//           <p className="text-[10px] text-[#1A1A1A]/50 uppercase mt-4 tracking-wider text-center md:text-left">
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








// /* eslint-disable react-hooks/set-state-in-effect */

// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { MessageCircle, PackageCheck, Tag, X } from "lucide-react";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";
// import AlsoLike from "./AlsoLike";


// export default function ProductDetails() {
//   const { slug } = useParams<{ slug: string }>();

//   const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
//   const products: Product[] = response?.data || [];
//   const product = products.find((item) => item.slug === slug);

//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
//   const [selectedImage, setSelectedImage] = useState<number>(0);
//   const [modalOpen, setModalOpen] = useState(false); // 👈 নতুন

//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       setSelectedVariant(product.variants[0]);
//       setSelectedImage(0);
//     }
//   }, [product]);

//   // Modal open এ scroll lock
//   useEffect(() => {
//     if (modalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => { document.body.style.overflow = ""; };
//   }, [modalOpen]);

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

//   const whatsappNumber = "8801XXXXXXXXX";
//   const whatsappMessage = encodeURIComponent(
//     `Hello, I want to order this product:\n\nName: ${product.name}\nSKU: ${currentVariant?.sku || "N/A"}\nPrice: TK ${(hasDiscount ? salePrice : price).toLocaleString()}.00`
//   );

//   return (
//     <section className="min-h-screen bg-[#FAF9F6] pb-24 max-w-6xl mx-auto w-full">

//       {/* ✅ IMAGE MODAL */}
//       {modalOpen && (
//         <div
//           className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
//           onClick={() => setModalOpen(false)}
//         >
//           {/* Close button */}
//           <button
//             onClick={() => setModalOpen(false)}
//             className="absolute top-5 right-5 hover:cursor-pointer z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
//           >
//             <X size={20} />
//           </button>

//           {/* Image */}
//           <div
//             className="relative max-w-[90vw] max-h-[90vh]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <img
//               src={productImages[selectedImage]}
//               alt={product.name}
//               className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
//             />
//           </div>
//         </div>
//       )}

//       {/* BACK */}
//       <div className="mb-8">
//         <Link
//           to="/decor"
//           className="text-sm font-bold tracking-widest text-gray-500 hover:text-gray-900 flex items-center gap-1.5 uppercase"
//         >
//           ← BACK TO CATALOG
//         </Link>
//       </div>

//       {/* MAIN LAYOUT */}
//       <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

//         {/* LEFT */}
//         <div className="w-full lg:w-1/2 flex flex-col gap-4">

//           {/* Main image card — ✅ cursor-zoom-in + onClick */}
//           <div
//             className="w-full bg-white rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100 cursor-zoom-in"
//             onClick={() => setModalOpen(true)}
//           >
//             <div className="w-full rounded-[32px] overflow-hidden relative">
//               <img
//                 src={productImages[selectedImage] || ""}
//                 alt={product.name}
//                 className="w-full h-auto block min-h-[60%] object-cover"
//               />
//             </div>

//             {/* Badges */}
//             <div className="absolute top-8 left-8 flex flex-col gap-2">
//               {product.is_featured === "1" && (
//                 <span className="bg-[#FF5A00] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm uppercase">
//                   HOT SELL
//                 </span>
//               )}
//               <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm uppercase">
//                 NEW
//               </span>
//               {discountPercent > 0 && (
//                 <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm">
//                   -{discountPercent}%
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Thumbnails */}
//           {productImages.length > 1 && (
//             <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all p-1 ${selectedImage === index
//                     ? "border-neutral-900"
//                     : "border-transparent opacity-60 hover:opacity-100 bg-white"
//                     }`}
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
//         <div className="w-full lg:w-1/2 pt-4">

//           <div className="flex items-center gap-3 mb-4">
//             <span className="text-[10px] font-bold text-neutral-900/50 uppercase tracking-widest">
//               {product.sub_category?.name || product.category?.name || "DECOR"}
//             </span>
//             <span className="text-neutral-900/30">•</span>
//             <span className="text-[10px] font-mono text-neutral-900/50">
//               {currentVariant?.sku || "N/A"}
//             </span>
//           </div>

//           <h1 className="text-4xl md:text-6xl font-serif leading-[1.1] text-brand-text mb-6">
//             {product.name}
//           </h1>

//           <div className="flex items-end gap-4 mb-8">
//             <span className="text-4xl font-bold text-[#1A1A1A]">
//               TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
//             </span>
//             {hasDiscount && (
//               <span className="text-xl text-neutral-900/40 line-through mb-1">
//                 TK {price.toLocaleString()}.00
//               </span>
//             )}
//           </div>

//           <div className="mb-10 max-w-none leading-relaxed
//               [&_p]:my-1.5 [&_p]:text-[#1A1A1A]/70 [&_p]:text-base
//               [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-3
//               [&_ul_li]:text-[#1A1A1A]/70 [&_ul_li]:text-base [&_ul_li]:leading-snug
//               [&_ul_li]:marker:text-[#1A1A1A]/20
//               [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
//               [&_em]:italic
//               [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
//               [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
//               [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
//             ">
//             {product.short_description && (
//               <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
//             )}
//             {product.description && (
//               <div dangerouslySetInnerHTML={{ __html: product.description }} />
//             )}
//           </div>

//           <div className="flex items-center gap-6 mb-10 pb-10 border-b border-neutral-100">
//             <div className="flex items-center gap-2">
//               <PackageCheck className="text-green-600 w-6 h-6 stroke-2" />
//               <span className="font-medium text-green-700">In Stock</span>
//             </div>
//             <div className="flex items-center gap-2 text-neutral-500">
//               <Tag className="w-5 h-5 stroke-2" />
//               <span className="font-medium">Direct Order</span>
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
//                     className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${currentVariant?.id === v.id
//                       ? "border-black bg-black text-white"
//                       : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
//                       }`}
//                   >
//                     Option {idx + 1} ({v.sku})
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div>
//             <a
//               href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-3 bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
//             >
//               <MessageCircle size={20} />
//               BUY NOW ON WHATSAPP
//             </a>
//           </div>

//           <p className="text-[10px] text-[#1A1A1A]/50 uppercase mt-4 tracking-wider text-center md:text-left">
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









// /* eslint-disable react-hooks/set-state-in-effect */

// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { MessageCircle, PackageCheck, Tag } from "lucide-react";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";
// import AlsoLike from "./AlsoLike";


// export default function ProductDetails() {
//   const { slug } = useParams<{ slug: string }>();

//   const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
//   const products: Product[] = response?.data || [];
//   const product = products.find((item) => item.slug === slug);

//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
//   const [selectedImage, setSelectedImage] = useState<number>(0);

//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       setSelectedVariant(product.variants[0]);
//       setSelectedImage(0);
//     }
//   }, [product]);

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

//   const whatsappNumber = "8801XXXXXXXXX";
//   const whatsappMessage = encodeURIComponent(
//     `Hello, I want to order this product:\n\nName: ${product.name}\nSKU: ${currentVariant?.sku || "N/A"}\nPrice: TK ${(hasDiscount ? salePrice : price).toLocaleString()}.00`
//   );

//   return (
//     <section className="min-h-screen bg-[#FAF9F6]  pb-24 max-w-6xl mx-auto w-full">

//       {/* BACK */}
//       <div className="mb-8">
//         <Link
//           to="/decor"
//           className="text-sm font-bold tracking-widest text-gray-500 hover:text-gray-900 flex items-center gap-1.5 text- uppercase"
//         >
//           ← BACK TO CATALOG
//         </Link>
//       </div>

//       {/* MAIN LAYOUT — exact: flex flex-col lg:flex-row gap-12 lg:gap-20 */}
//       <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

//         {/* LEFT — exact: w-full lg:w-1/2 flex flex-col gap-4 */}
//         <div className="w-full lg:w-1/2 flex flex-col gap-4">

//           {/* Main image card — exact: w-full bg-white rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100 */}
//           <div className="w-full bg-white rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100">

//             {/* Inner wrapper — exact: w-full h-full rounded-[32px] overflow-hidden relative */}
//             <div className="w-full  rounded-[32px] overflow-hidden relative">
//               <img
//                 src={productImages[selectedImage] || ""}
//                 alt={product.name}
//                 className="w-full h-auto block min-h-[60%] object-cover"
//               />
//             </div>

           
//             {/* Badges — exact: absolute top-8 left-8 flex flex-col gap-2 */}
//             <div className="absolute top-8 left-8 flex flex-col gap-2">
//               {product.is_featured === "1" && (
//                 <span className="bg-[#FF5A00] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm uppercase">
//                   HOT SELL
//                 </span>
//               )}
//               <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm uppercase">
//                 NEW
//               </span>
//               {discountPercent > 0 && (
//                 <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider shadow-sm">
//                   -{discountPercent}%
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Thumbnails — exact: flex gap-4 overflow-x-auto pb-2 hide-scrollbar */}
//           {productImages.length > 1 && (
//             <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all p-1 ${selectedImage === index
//                     ? "border-neutral-900"
//                     : "border-transparent opacity-60 hover:opacity-100 bg-white"
//                     }`}
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

//         {/* RIGHT — exact: w-full lg:w-1/2 pt-4 */}
//         <div className="w-full lg:w-1/2 pt-4">

//           {/* Category & SKU — exact: flex items-center gap-3 mb-4 */}
//           <div className="flex items-center gap-3 mb-4">
//             <span className="text-[10px] font-bold text-neutral-900/50 uppercase tracking-widest">
//               {product.sub_category?.name || product.category?.name || "DECOR"}
//             </span>
//             <span className="text-neutral-900/30">•</span>
//             <span className="text-[10px] font-mono text-neutral-900/50">
//               {currentVariant?.sku || "N/A"}
//             </span>
//           </div>

//           {/* Title — exact: text-4xl md:text-6xl font-serif leading-[1.1] text-[#1A1A1A] mb-6 */}
//           <h1 className="text-4xl md:text-6xl font-serif leading-[1.1] text-brand-text mb-6">
//             {product.name}
//           </h1>

//           {/* Price — exact: flex items-end gap-4 mb-8 */}
//           <div className="flex items-end gap-4 mb-8">
//             <span className="text-4xl font-bold text-[#1A1A1A]">
//               TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
//             </span>
//             {hasDiscount && (
//               <span className="text-xl text-neutral-900/40 line-through mb-1">
//                 TK {price.toLocaleString()}.00
//               </span>
//             )}
//           </div>

//           {/* Description — exact: prose prose-neutral mb-10 max-w-none text-[#1A1A1A]/70 leading-relaxed text-sm md:text-base */}

//           <div className="mb-10 max-w-none leading-relaxed
//               [&_p]:my-1.5 [&_p]:text-[#1A1A1A]/70 [&_p]:text-base
//               [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-3
//               [&_ul_li]:text-[#1A1A1A]/70 [&_ul_li]:text-base [&_ul_li]:leading-snug
//               [&_ul_li]:marker:text-[#1A1A1A]/20
//               [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
//               [&_em]:italic
//               [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
//               [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
//               [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
//             ">
//             {product.short_description && (
//               <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
//             )}
//             {product.description && (
//               <div dangerouslySetInnerHTML={{ __html: product.description }} />
//             )}
//           </div>

//           {/* Status — exact: flex items-center gap-6 mb-10 pb-10 border-b border-neutral-100 */}
//           <div className="flex items-center gap-6 mb-10 pb-10 border-b border-neutral-100">
//             <div className="flex items-center gap-2">
//               <PackageCheck className="text-green-600 w-6 h-6 stroke-2" />
//               <span className="font-medium text-green-700">In Stock</span>
//             </div>
//             <div className="flex items-center gap-2 text-neutral-500">
//               <Tag className="w-5 h-5 stroke-2" />
//               <span className="font-medium">Direct Order</span>
//             </div>
//           </div>

//           {/* Variant selector */}
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
//                     className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${currentVariant?.id === v.id
//                       ? "border-black bg-black text-white"
//                       : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
//                       }`}
//                   >
//                     Option {idx + 1} ({v.sku})
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Buy Button — exact: w-full md:w-auto bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-bold text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-[#5A5A40] transition-colors */}
//           <div>
//             <a
//               href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-3 bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
//             >
//               <MessageCircle size={20} />
//               BUY NOW ON WHATSAPP
//             </a>
//           </div>

//           {/* Note — exact: text-[10px] text-[#1A1A1A]/50 uppercase mt-4 tracking-wider text-center md:text-left */}
//           <p className="text-[10px] text-[#1A1A1A]/50 uppercase mt-4 tracking-wider text-center md:text-left">
//             Clicking this will open a prefilled WhatsApp chat to process your order.
//           </p>

//         </div>
//       </div>


//       <AlsoLike
//         subCategoryId={product.sub_category_id}
//         currentSlug={product.slug}
//       />

//     </section >
//   );
// }






 {/* height -80% */}
            {/* <div className="w-full max-h-[80vh] flex items-center justify-center rounded-[32px] overflow-hidden relative bg-white">
              <img
                src={productImages[selectedImage] || ""}
                alt={product.name}
                className="w-full h-full max-h-[80vh] object-cover block"
              />
            </div> */}

            {/* image 80% */}
            {/* <div className="w-4/5 mx-auto rounded-[32px] overflow-hidden relative my-6">
              <img
                src={productImages[selectedImage] || ""}
                alt={product.name}
                className="w-full h-auto block object-cover"
              />
            </div> */}





// /* eslint-disable react-hooks/set-state-in-effect */

// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { PackageCheck, ShoppingCart, Tag } from "lucide-react";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";
// import AlsoLike from "./AlsoLike";

// export default function ProductDetails() {
//   const { slug } = useParams<{ slug: string }>();

//   const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
//   const products: Product[] = response?.data || [];

//   const product = products.find((item) => item.slug === slug);

//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
//   const [selectedImage, setSelectedImage] = useState<number>(0);

//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       const defaultVariant = product.variants[0];
//       setSelectedVariant(defaultVariant);
//       setSelectedImage(0);
//     }
//   }, [product]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
//         <div className="text-sm font-medium text-gray-400 animate-pulse">
//           Loading...
//         </div>
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

//   const productImages: string[] = currentVariant?.images && currentVariant.images.length > 0
//     ? currentVariant.images.map((img) => img.image_url)
//     : [product.thumbnail || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"];

//   const whatsappNumber = "8801XXXXXXXXX";
//   const whatsappMessage = encodeURIComponent(
//     `Hello, I want to order this product:\n\nName: ${product.name}\nSKU: ${currentVariant?.sku || "N/A"}\nPrice: TK ${(hasDiscount ? salePrice : price).toLocaleString()}.00`
//   );

//   return (
//     <section className="min-h-screen bg-[#FAF9F6] pt-12 pb-24 px-6 md:px-12">
//       <div className="">

//         {/* BACK TO CATALOG */}
//         <div className="mb-10">
//           <Link to="/decor" className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-gray-900 uppercase flex items-center gap-1.5">
//             ← BACK TO CATALOG
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

//           {/* LEFT - IMAGE GALLERY */}
//           <div className="space-y-4">
//             {/* 🎯 কন্টেইনারে প্যাডিং এবং ম্যাক্সিমাম হাইট কন্ট্রোল যোগ করা হয়েছে */}
//             <div className="relative rounded-[2rem] overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-4 aspect-square max-h-137.5">

//               {/* Badges */}
//               <div className="absolute top-5 left-5 z-10 flex flex-col gap-1">
//                 {product.is_featured === "1" && (
//                   <span className="bg-[#FF5A00] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider uppercase">
//                     HOT SELL
//                   </span>
//                 )}
//                 <span className="bg-[#555E63] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider uppercase">
//                   NEW
//                 </span>
//                 {discountPercent > 0 && (
//                   <span className="bg-[#FF9900] text-black text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider">
//                     -{discountPercent}%
//                   </span>
//                 )}
//               </div>

//               {/* 🎯 object-cover এর বদলে object-contain ব্যবহার করা হয়েছে যাতে ছবি কোনো দিকে কেটে না যায় */}
//               <img
//                 src={productImages[selectedImage] || product.thumbnail || ""}
//                 alt={product.name}
//                 className="w-full h-full block object-contain rounded-[1.5rem]"
//               />
//             </div>

//             {/* Thumbnails */}
//             {productImages.length > 1 && (
//               <div className="flex gap-3 px-1">
//                 {productImages.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`w-16 h-16 rounded-xl overflow-hidden bg-white p-1 border transition-all flex items-center justify-center ${
//                       selectedImage === index ? "border-gray-900 scale-95" : "border-gray-200 opacity-70 hover:opacity-100"
//                     }`}
//                   >
//                     {/* 🎯 থাম্বনেইল ইমেজেও object-contain করা হয়েছে */}
//                     <img src={img} alt="" className="w-full h-full object-contain rounded-lg" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* RIGHT - INFO SECTION */}
//           <div className="space-y-6 pt-2">

//             {/* Category & SKU Line */}
//             <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase font-mono">
//               <span>{product.category?.name || "MINECRAFT"}</span>
//               <span>•</span>
//               <span>{currentVariant?.sku || "PSG-TL10"}</span>
//             </div>

//             {/* Product Title */}
//             <h1 className="text-6xl font-serif text-[#111111] leading-[1.1] font-normal">
//               {product.name}
//             </h1>

//             {/* Price block */}
//             <div className="flex items-baseline gap-3 pt-1">
//               <span className="text-2xl font-bold text-gray-900 font-sans">
//                 TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
//               </span>
//               {hasDiscount && (
//                 <span className="text-sm text-gray-300 line-through font-sans">
//                   TK {price.toLocaleString()}.00
//                 </span>
//               )}
//             </div>

//             {/* Description */}
//             <div className="space-y-4 max-w-xl">
//               {product.short_description && (
//                 <div
//                   className="
//                     text-gray-600 text-sm leading-relaxed font-sans
//                     [&_p]:my-1.5 [&_p]:text-gray-600
//                     [&_ul]:my-3 [&_ul]:space-y-2.5 [&_ul]:pl-0 [&_ul]:list-none
//                     [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:text-gray-500 [&_ul_li]:text-sm [&_ul_li]:leading-snug
//                     [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-1.75
//                     [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:rounded-full
//                     [&_ul_li]:before:bg-stone-400
//                     [&_strong]:text-gray-900 [&_strong]:font-bold
//                     [&_em]:italic
//                   "
//                   dangerouslySetInnerHTML={{ __html: product.short_description }}
//                 />
//               )}

//               {product.description && (
//                 <div
//                   className="
//                     text-gray-600 text-sm md:text-base leading-relaxed font-sans
//                     [&_p]:my-1.5 [&_p]:text-gray-600
//                     [&_ul]:my-3 [&_ul]:space-y-2.5 [&_pl]:pl-0 [&_ul]:list-none
//                     [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:text-gray-500 [&_ul_li]:text-sm [&_ul_li]:leading-snug
//                     [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-1.75
//                     [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:rounded-full
//                     [&_ul_li]:before:bg-stone-300
//                     [&_strong]:text-gray-900 [&_strong]:font-bold
//                     [&_em]:italic
//                     [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
//                     [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
//                     [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
//                   "
//                   dangerouslySetInnerHTML={{ __html: product.description }}
//                 />
//               )}
//             </div>

//             {/* Status and Direct Order Line */}
//             <div className="flex items-center gap-5 pt-2 text-sm font-semibold">
//               <div className="flex items-center gap-1.5 text-[#009444]">
//                 <PackageCheck className="w-5 h-5 stroke-2" />
//                 <span>In Stock</span>
//               </div>

//               <div className="flex items-center gap-1.5 text-[#5A6B7C] font-medium">
//                 <Tag className="w-5 h-5 stroke-2 scale-x-[-1] -rotate-90" />
//                 <span>Direct Order</span>
//               </div>
//             </div>

//             {/* Variant Options Selector */}
//             {product.variants && product.variants.length > 1 && (
//               <div className="pt-2">
//                 <div className="flex flex-wrap gap-2">
//                   {product.variants.map((v, idx) => (
//                     <button
//                       key={v.id}
//                       onClick={() => {
//                         setSelectedVariant(v);
//                         setSelectedImage(0);
//                       }}
//                       className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${
//                         currentVariant?.id === v.id
//                           ? "border-black bg-black text-white"
//                           : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
//                       }`}
//                     >
//                       Option {idx + 1} ({v.sku})
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Buy Button */}
//             <div className="pt-4 max-w-sm">
//               <a
//                 href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3.5 px-6 rounded-full font-bold tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all uppercase"
//               >
//                 <ShoppingCart size={13} className="fill-white" />
//                 Buy Now On Whatsapp
//               </a>
//               <p className="text-[8px] font-mono tracking-widest text-gray-400 text-center mt-2.5 uppercase">
//                 Clicking this will open a prefilled whatsapp chat to process your order.
//               </p>
//             </div>

//           </div>
//         </div>

//       </div>

//       <AlsoLike
//         subCategoryId={product.sub_category_id}
//         currentSlug={product.slug}
//       />

//     </section>
//   );
// }








// /* eslint-disable react-hooks/set-state-in-effect */

// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { PackageCheck, ShoppingCart, Tag } from "lucide-react";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";
// import AlsoLike from "./AlsoLike";

// export default function ProductDetails() {
//   const { slug } = useParams<{ slug: string }>();

//   const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
//   const products: Product[] = response?.data || [];

//   const product = products.find((item) => item.slug === slug);

//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
//   const [selectedImage, setSelectedImage] = useState<number>(0);

//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       const defaultVariant = product.variants[0];
//       setSelectedVariant(defaultVariant);
//       setSelectedImage(0);
//     }
//   }, [product]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
//         <div className="text-sm font-medium text-gray-400 animate-pulse">
//           Loading...
//         </div>
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

//   const productImages: string[] = currentVariant?.images && currentVariant.images.length > 0
//     ? currentVariant.images.map((img) => img.image_url)
//     : [product.thumbnail || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"];

//   const whatsappNumber = "8801XXXXXXXXX";
//   const whatsappMessage = encodeURIComponent(
//     `Hello, I want to order this product:\n\nName: ${product.name}\nSKU: ${currentVariant?.sku || "N/A"}\nPrice: TK ${(hasDiscount ? salePrice : price).toLocaleString()}.00`
//   );

//   return (
//     <section className="min-h-screen bg-[#FAF9F6] pt-12 pb-24 px-6 md:px-12">
//       <div className="">

//         {/* BACK TO CATALOG */}
//         <div className="mb-10">
//           <Link to="/decor" className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-gray-900 uppercase flex items-center gap-1.5">
//             ← BACK TO CATALOG
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

//           {/* LEFT - IMAGE GALLERY */}
//           <div className="space-y-4">
//             <div className="relative rounded-[2rem] overflow-hidden bg-white">

//               {/* Badges */}
//               <div className="absolute top-5 left-5 z-10 flex flex-col gap-1">
//                 {product.is_featured === "1" && (
//                   <span className="bg-[#FF5A00] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider uppercase">
//                     HOT SELL
//                   </span>
//                 )}
//                 <span className="bg-[#555E63] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider uppercase">
//                   NEW
//                 </span>
//                 {discountPercent > 0 && (
//                   <span className="bg-[#FF9900] text-black text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider">
//                     -{discountPercent}%
//                   </span>
//                 )}
//               </div>

//               <img
//                 src={productImages[selectedImage] || product.thumbnail || ""}
//                 alt={product.name}
//                 className="w-full h-auto block object-cover aspect-square rounded-[2rem]"
//               />
//             </div>

//             {/* Thumbnails */}
//             {productImages.length > 1 && (
//               <div className="flex gap-3 px-1">
//                 {productImages.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`w-16 h-16 rounded-xl overflow-hidden bg-white p-0.5 border transition-all ${selectedImage === index ? "border-gray-900 scale-95" : "border-gray-200 opacity-70 hover:opacity-100"
//                       }`}
//                   >
//                     <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* RIGHT - INFO SECTION */}
//           <div className="space-y-6 pt-2">

//             {/* Category & SKU Line */}
//             <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase font-mono">
//               <span>{product.category?.name || "MINECRAFT"}</span>
//               <span>•</span>
//               <span>{currentVariant?.sku || "PSG-TL10"}</span>
//             </div>

//             {/* Product Title */}
//             <h1 className="text-6xl font-serif text-[#111111] leading-[1.1] font-normal">
//               {product.name}
//             </h1>

//             {/* Price block */}
//             <div className="flex items-baseline gap-3 pt-1">
//               <span className="text-2xl font-bold text-gray-900 font-sans">
//                 TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
//               </span>
//               {hasDiscount && (
//                 <span className="text-sm text-gray-300 line-through font-sans">
//                   TK {price.toLocaleString()}.00
//                 </span>
//               )}
//             </div>

//             {/* Description (Rich Text rendered directly here like screenshot) */}


//             <div className="space-y-4 max-w-xl">
//               {product.short_description && (
//                 <div
//                   className="
//                          text-gray-600 text-sm leading-relaxed font-sans
//                             [&_p]:my-1.5 [&_p]:text-gray-600
//                             [&_ul]:my-3 [&_ul]:space-y-2.5 [&_ul]:pl-0 [&_ul]:list-none
//                             [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:text-gray-500 [&_ul_li]:text-sm [&_ul_li]:leading-snug
//                             [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-1.75
//                             [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:rounded-full
//                             [&_ul_li]:before:bg-stone-400
//                             [&_strong]:text-gray-900 [&_strong]:font-bold
//                             [&_em]:italic
//                           "
//                   dangerouslySetInnerHTML={{ __html: product.short_description }}
//                 />
//               )}

//               {product.description && (
//                 // <div
//                 //   className="
//                 //     text-gray-600 text-sm leading-relaxed font-sans
//                 //     [&_p]:my-1.5 [&_p]:text-gray-600
//                 //     [&_ul]:my-3 [&_ul]:space-y-2.5 [&_ul]:pl-0 [&_ul]:list-none
//                 //     [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:text-gray-500 [&_ul_li]:text-sm [&_ul_li]:leading-snug
//                 //     [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-1.75
//                 //     [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:rounded-full
//                 //     [&_ul_li]:before:bg-stone-400
//                 //     [&_strong]:text-gray-900 [&_strong]:font-bold
//                 //     [&_em]:italic
//                 //     [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
//                 //     [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
//                 //     [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
//                 //   "
//                 //   dangerouslySetInnerHTML={{ __html: product.description }}
//                 // />
//                 <div
//                   className="
//     text-gray-600 text-sm md:text-base leading-relaxed font-sans
//     [&_p]:my-1.5 [&_p]:text-gray-600
//     [&_ul]:my-3 [&_ul]:space-y-2.5 [&_pl]:pl-0 [&_ul]:list-none
//     [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:text-gray-500 [&_ul_li]:text-sm [&_ul_li]:leading-snug
//     [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-1.75
//     [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:rounded-full
//     [&_ul_li]:before:bg-stone-300
//     [&_strong]:text-gray-900 [&_strong]:font-bold
//     [&_em]:italic
//     [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
//     [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
//     [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
//   "
//                   dangerouslySetInnerHTML={{ __html: product.description }}
//                 />
//               )}
//             </div>


//             {/* Status and Direct Order Line */}
//             {/* <div className="flex items-center gap-5 pt-2 text-xs font-semibold">
//               <div className="flex items-center gap-1.5 text-[#0D9444]">
//                 <span className="w-4 h-4 rounded-full bg-[#E8F7EE] flex items-center justify-center text-[10px]">✓</span>
//                 <span>In Stock</span>
//               </div>
//               <div className="flex items-center gap-1.5 text-gray-400 font-normal">
//                 <span>🏷️</span>
//                 <span>Direct Order</span>
//               </div>
//             </div> */}
//             <div className="flex items-center gap-5 pt-2 text-sm font-semibold">
//               {/* In Stock */}
//               <div className="flex items-center gap-1.5 text-[#009444]">
//                 <PackageCheck className="w-5 h-5 stroke-2" />
//                 <span>In Stock</span>
//               </div>

//               {/* Direct Order */}
//               <div className="flex items-center gap-1.5 text-[#5A6B7C] font-medium">
//                 <Tag className="w-5 h-5 stroke-2 scale-x-[-1] -rotate-90" />
//                 <span>Direct Order</span>
//               </div>
//             </div>

//             {/* Variant Options Selector (Shows only if multiple variants exist) */}
//             {product.variants && product.variants.length > 1 && (
//               <div className="pt-2">
//                 <div className="flex flex-wrap gap-2">
//                   {product.variants.map((v, idx) => (
//                     <button
//                       key={v.id}
//                       onClick={() => {
//                         setSelectedVariant(v);
//                         setSelectedImage(0);
//                       }}
//                       className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${currentVariant?.id === v.id
//                         ? "border-black bg-black text-white"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
//                         }`}
//                     >
//                       Option {idx + 1} ({v.sku})
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Buy Button */}
//             <div className="pt-4 max-w-sm">
//               <a
//                 href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3.5 px-6 rounded-full font-bold tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all uppercase"
//               >
//                 <ShoppingCart size={13} className="fill-white" />
//                 Buy Now On Whatsapp
//               </a>
//               <p className="text-[8px] font-mono tracking-widest text-gray-400 text-center mt-2.5 uppercase">
//                 Clicking this will open a prefilled whatsapp chat to process your order.
//               </p>
//             </div>

//           </div>
//         </div>

//       </div>


//       <AlsoLike
//         subCategoryId={product.sub_category_id}
//         currentSlug={product.slug}
//       />

//     </section>
//   );
// }




/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product, ProductVariant } from "@/types/product.type";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();

  const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
  const products: Product[] = response?.data || [];

  const product = products.find((item) => item.slug === slug);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      setSelectedVariant(defaultVariant);
      setSelectedImage(0);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="text-sm font-medium text-gray-400 animate-pulse">
          Loading...
        </div>
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

  const productImages: string[] = currentVariant?.images && currentVariant.images.length > 0
    ? currentVariant.images.map((img) => img.image_url)
    : [product.thumbnail || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"];

  const whatsappNumber = "8801XXXXXXXXX"; // আপনার নম্বর দিন
  const whatsappMessage = encodeURIComponent(
    `Hello, I want to order this product:\n\nName: ${product.name}\nSKU: ${currentVariant?.sku || "N/A"}\nPrice: TK ${(hasDiscount ? salePrice : price).toLocaleString()}.00`
  );

  return (
    <section className="min-h-screen bg-[#FAF9F6] pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* BACK TO CATALOG */}
        <div className="mb-10">
          <Link to="/catalog" className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-gray-900 uppercase flex items-center gap-1.5">
            ← BACK TO CATALOG
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT - IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative rounded-[2rem] overflow-hidden bg-white">
              
              {/* Badges */}
              <div className="absolute top-5 left-5 z-10 flex flex-col gap-1">
                {product.is_featured === "1" && (
                  <span className="bg-[#FF5A00] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider uppercase">
                    HOT SELL
                  </span>
                )}
                <span className="bg-[#555E63] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider uppercase">
                  NEW
                </span>
                {discountPercent > 0 && (
                  <span className="bg-[#FF9900] text-black text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              <img
                src={productImages[selectedImage] || product.thumbnail || ""}
                alt={product.name}
                className="w-full h-auto block object-cover aspect-square rounded-[2rem]"
              />
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-3 px-1">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-xl overflow-hidden bg-white p-0.5 border transition-all ${
                      selectedImage === index ? "border-gray-900 scale-95" : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - INFO SECTION */}
          <div className="space-y-6 pt-2">
            
            {/* Category & SKU Line */}
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase font-mono">
              <span>{product.category?.name || "MINECRAFT"}</span>
              <span>•</span>
              <span>{currentVariant?.sku || "PSG-TL10"}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-5xl font-serif text-[#111111] leading-tight font-normal">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-bold text-gray-900 font-sans">
                TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-300 line-through font-sans">
                  TK {price.toLocaleString()}.00
                </span>
              )}
            </div>

            {/* Description (Rich Text rendered directly here like screenshot) */}
            

            <div className="space-y-4 max-w-xl">
              {product.short_description && (
                   <div
                      className="
                         text-gray-600 text-sm leading-relaxed font-sans
                            [&_p]:my-1.5 [&_p]:text-gray-600
                            [&_ul]:my-3 [&_ul]:space-y-2.5 [&_ul]:pl-0 [&_ul]:list-none
                            [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:text-gray-500 [&_ul_li]:text-sm [&_ul_li]:leading-snug
                            [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-1.75
                            [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:rounded-full
                            [&_ul_li]:before:bg-stone-400
                            [&_strong]:text-gray-900 [&_strong]:font-bold
                            [&_em]:italic
                          "
                          dangerouslySetInnerHTML={{ __html: product.short_description }}
                    />
                  )}

              {product.description && (
                <div
                  className="
                    text-gray-600 text-sm leading-relaxed font-sans
                    [&_p]:my-1.5 [&_p]:text-gray-600
                    [&_ul]:my-3 [&_ul]:space-y-2.5 [&_ul]:pl-0 [&_ul]:list-none
                    [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:text-gray-500 [&_ul_li]:text-sm [&_ul_li]:leading-snug
                    [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-1.75
                    [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:rounded-full
                    [&_ul_li]:before:bg-stone-400
                    [&_strong]:text-gray-900 [&_strong]:font-bold
                    [&_em]:italic
                    [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
                    [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
                    [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
                  "
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>
            

            {/* Status and Direct Order Line */}
            <div className="flex items-center gap-5 pt-2 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-[#0D9444]">
                <span className="w-4 h-4 rounded-full bg-[#E8F7EE] flex items-center justify-center text-[10px]">✓</span>
                <span>In Stock</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 font-normal">
                <span>🏷️</span>
                <span>Direct Order</span>
              </div>
            </div>

            {/* Variant Options Selector (Shows only if multiple variants exist) */}
            {product.variants && product.variants.length > 1 && (
              <div className="pt-2">
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

            {/* Buy Button */}
            <div className="pt-4 max-w-sm">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3.5 px-6 rounded-full font-bold tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all uppercase"
              >
                <ShoppingCart size={13} className="fill-white" />
                Buy Now On Whatsapp
              </a>
              <p className="text-[8px] font-mono tracking-widest text-gray-400 text-center mt-2.5 uppercase">
                Clicking this will open a prefilled whatsapp chat to process your order.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}











// /* eslint-disable react-hooks/set-state-in-effect */


// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { ShoppingCart } from "lucide-react";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";

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
//       <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5]">
//         <div className="text-lg font-medium text-slate-500 animate-pulse">
//           Loading product details...
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5]">
//         <h1 className="text-4xl font-bold text-slate-800">Product Not Found</h1>
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

//   // হোয়াটসঅ্যাপ মেসেজের জন্য টেক্সট রেডি করা
//   const whatsappNumber = "8801XXXXXXXXX"; // আপনার হোয়াটসঅ্যাপ নম্বর এখানে দিন
//   const whatsappMessage = encodeURIComponent(
//     `Hello, I want to order this product:\n\nName: ${product.name}\nSKU: ${currentVariant?.sku || "N/A"}\nPrice: ৳${(hasDiscount ? salePrice : price).toLocaleString()}`
//   );

//   return (
//     <section className="min-h-screen bg-[#FAF9F5] py-6 px-4">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Back to Catalog Button */}
//         <div className="mb-6">
//           <Link to="/catalog" className="text-xs font-bold tracking-widest text-gray-500 hover:text-gray-900 uppercase flex items-center gap-1">
//             ← Back to Catalog
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
//           {/* LEFT - IMAGE GALLERY WITH BADGES */}
//           <div className="lg:col-span-5 space-y-4">
//             <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-xs">
              
//               {/* Badges Container (Top Left) */}
//               <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
//                 {product.is_featured === "1" && (
//                   <span className="bg-[#FF5A00] text-white text-[9px] font-extrabold px-2.5 py-1 rounded tracking-widest uppercase">
//                     Hot Sell
//                   </span>
//                 )}
//                 <span className="bg-[#555E63] text-white text-[9px] font-extrabold px-2.5 py-1 rounded tracking-widest uppercase">
//                   New
//                 </span>
//                 {discountPercent > 0 && (
//                   <span className="bg-[#FF9900] text-black text-[9px] font-extrabold px-2.5 py-1 rounded tracking-widest">
//                     -{discountPercent}%
//                   </span>
//                 )}
//               </div>

//               <img
//                 src={productImages[selectedImage] || product.thumbnail || ""}
//                 alt={product.name}
//                 className="w-full h-auto block object-cover aspect-square"
//               />
//             </div>

//             {/* Thumbnails */}
//             {productImages.length > 1 && (
//               <div className="flex gap-3">
//                 {productImages.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`w-20 h-20 rounded-xl overflow-hidden bg-white p-1 border-2 transition-all ${
//                       selectedImage === index ? "border-gray-900" : "border-gray-200 hover:border-gray-400"
//                     }`}
//                   >
//                     <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* RIGHT - INFO SECTION */}
//           <div className="lg:col-span-7 space-y-6">
            
//             {/* Meta Tags */}
//             <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-gray-400 uppercase">
//               <span>{product.category?.name || "Decor"}</span>
//               <span>•</span>
//               <span>{currentVariant?.sku || "N/A"}</span>
//             </div>

//             {/* Product Name */}
//             <h1 className="text-4xl sm:text-5xl font-serif text-[#0E2238] font-normal leading-tight">
//               {product.name}
//             </h1>

//             {/* Price section */}
//             <div className="flex items-baseline gap-4 font-sans">
//               <span className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
//               </span>
//               {hasDiscount && (
//                 <span className="text-base text-gray-400 line-through">
//                   TK {price.toLocaleString()}.00
//                 </span>
//               )}
//             </div>

//             {/* Short Description */}
//             <div
//               className="text-gray-600 text-sm leading-relaxed max-w-2xl font-sans prose prose-sm"
//               dangerouslySetInnerHTML={{ __html: product.short_description }}
//             />

//             {/* Stock and Order Info */}
//             <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-gray-700 font-medium">
//               <div className="flex items-center gap-2">
//                 <span className="w-5 h-5 rounded-full bg-[#E8F7EE] text-[#0D9444] flex items-center justify-center text-xs">✓</span>
//                 <span className="text-[#0D9444]">In Stock</span>
//               </div>
//               <div className="flex items-center gap-2 text-gray-500">
//                 <span>🏷️</span>
//                 <span>Direct Order</span>
//               </div>
//             </div>

//             {/* Action Button */}
//             <div className="pt-4 max-w-md">
//               <a
//                 href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full bg-[#181818] hover:bg-black text-white py-4 px-6 rounded-full font-bold tracking-widest text-xs flex items-center justify-center gap-3 transition-all uppercase shadow-xs"
//               >
//                 <ShoppingCart size={16} />
//                 Buy Now On Whatsapp
//               </a>
//               <p className="text-[9px] font-mono tracking-wider text-gray-400 text-center mt-2 uppercase">
//                 Clicking this will open a prefilled whatsapp chat to process your order.
//               </p>
//             </div>

//             {/* Variants Selector (If multi-variant products exist) */}
//             {product.variants && product.variants.length > 1 && (
//               <div className="pt-4 border-t border-gray-200/60">
//                 <h3 className="text-xs font-bold tracking-wider text-gray-900 uppercase mb-3">Available Options</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {product.variants.map((v, idx) => (
//                     <button
//                       key={v.id}
//                       onClick={() => {
//                         setSelectedVariant(v);
//                         setSelectedImage(0);
//                       }}
//                       className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
//                         currentVariant?.id === v.id
//                           ? "border-black bg-black text-white"
//                           : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
//                       }`}
//                     >
//                       Option {idx + 1} ({v.sku})
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>

//         {/* Detailed Description */}
//         <div className="mt-16 border-t border-gray-200/60 pt-10">
//           <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider">Product Description</h2>
//           <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-2xs">
//             <div
//               className="leading-relaxed text-gray-600 text-sm prose max-w-none 
//               prose-table:w-full prose-table:border-collapse prose-table:my-4 
//               prose-th:border prose-th:border-gray-200 prose-th:p-3 prose-th:bg-gray-50 prose-th:text-left
//               prose-td:border prose-td:border-gray-200 prose-td:p-3
//               prose-ul:list-disc prose-ul:pl-5 prose-li:my-1"
//               dangerouslySetInnerHTML={{ __html: product.description }}
//             />
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }
















// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/set-state-in-effect */

// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { ShoppingCart, Star } from "lucide-react";


// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product, ProductVariant } from "@/types/product.type";

// function InfoCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-md p-4 shadow-xs">
//       <p className="text-sm text-slate-500">{title}</p>
//       <p className="mt-1 font-semibold text-slate-900">{value}</p>
//     </div>
//   );
// }

// export default function ProductDetails() {
//   const { slug } = useParams<{ slug: string }>();


//   const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
//   const products: Product[] = response?.data || [];


//   const product = products.find((item) => item.slug === slug);


//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
//   const [selectedImage, setSelectedImage] = useState<number>(0);


//   const [selectedSize, setSelectedSize] = useState<string>("");
//   const [selectedColor, setSelectedColor] = useState<string>("");


//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       const defaultVariant = product.variants[0];
//       setSelectedVariant(defaultVariant);
//       setSelectedImage(0);
//       setSelectedSize("");
//       setSelectedColor("");
//     }
//   }, [product]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-white">
//         <div className="text-lg font-medium text-slate-500 animate-pulse">
//           Loading product details...
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-white">
//         <h1 className="text-4xl font-bold text-slate-800">Product Not Found</h1>
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

//   return (
//     <section className="min-h-screen bg-white py-14">
//       <div className="mx-auto max-w-7xl px-4">
//         <div className="rounded-3xl border border-slate-200/80 bg-white/40 backdrop-blur-3xl shadow-2xl shadow-slate-200 overflow-hidden">
//           <div className="grid lg:grid-cols-2 gap-10 p-8 lg:p-12">

//             {/* LEFT - IMAGE GALLERY */}
//             <div>
//               <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-lg backdrop-blur-md">
//                 <img
//                   src={productImages[selectedImage] || product.thumbnail || ""}
//                   alt={product.name}
//                   className="aspect-square w-full rounded-2xl object-cover transition duration-500 hover:scale-105"
//                 />

//                 {productImages.length > 1 && (
//                   <div className="mt-5 grid grid-cols-4 gap-3">
//                     {productImages.map((img, index) => (
//                       <img
//                         key={index}
//                         src={img}
//                         alt=""
//                         onClick={() => setSelectedImage(index)}
//                         className={`aspect-square cursor-pointer rounded-xl object-cover border-2 transition ${selectedImage === index
//                           ? "border-cyan-500"
//                           : "border-transparent hover:border-cyan-300"
//                           }`}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* RIGHT - INFO SECTION */}
//             <div>
//               <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
//                 {product.category?.name || "Decor"}
//               </span>

//               <h1 className="mt-5 text-5xl font-bold text-slate-900">
//                 {product.name}
//               </h1>

//               {/* <p className="mt-4 leading-8 text-slate-600">
//                 {product.short_description}
//               </p> */}
//               <div
//                 className="mt-4 leading-8 text-slate-600"
//                 dangerouslySetInnerHTML={{ __html: product.short_description }}
//               />

//               {/* Price Calculation */}
//               <div className="mt-6 flex items-center gap-4">
//                 <h2 className="text-4xl font-bold text-slate-900">
//                   ৳{(hasDiscount ? salePrice : price).toLocaleString()}
//                 </h2>
//                 {hasDiscount && (
//                   <span className="text-xl text-slate-400 line-through">
//                     ৳{price.toLocaleString()}
//                   </span>
//                 )}
//                 {discountPercent > 0 && (
//                   <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
//                     {discountPercent}% OFF
//                   </span>
//                 )}
//               </div>

//               {/* Hardcoded Ratings as per your structure */}
//               <div className="mt-5 flex items-center gap-2">
//                 <Star size={18} className="fill-yellow-400 text-yellow-400" />
//                 <span className="font-semibold">4.8</span>
//                 <span className="text-slate-500">(24 Reviews)</span>
//               </div>

//               {/* Info Cards mapping from real types */}
//               <div className="mt-8 grid grid-cols-2 gap-4">
//                 <InfoCard title="Brand" value={(product.brand as any)?.name || "Premium"} />
//                 <InfoCard title="SKU" value={currentVariant?.sku || "N/A"} />
//                 <InfoCard title="Stock" value={currentVariant?.status === "active" ? "Available" : "Stock Out"} />
//                 <InfoCard title="Category" value={product.sub_category?.name || product.category?.name} />
//               </div>

//               {/* Variants Selector (If multi-variant products exist) */}
//               {product.variants && product.variants.length > 1 && (
//                 <div className="mt-8">
//                   <h3 className="mb-3 text-lg font-semibold text-slate-900">Available Options</h3>
//                   <div className="flex flex-wrap gap-3">
//                     {product.variants.map((v, idx) => (
//                       <button
//                         key={v.id}
//                         onClick={() => {
//                           setSelectedVariant(v);
//                           setSelectedImage(0);
//                         }}
//                         className={`rounded-xl border px-5 py-2 font-medium transition ${currentVariant?.id === v.id
//                           ? "border-cyan-600 bg-cyan-600 text-white"
//                           : "border-slate-200 bg-white/60 backdrop-blur-xs hover:border-cyan-500 hover:bg-cyan-50"
//                           }`}
//                       >
//                         Option {idx + 1} ({v.sku})
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Selected Box Summary */}
//               {(selectedSize || selectedColor) && (
//                 <div className="mt-8 rounded-2xl border border-slate-200/60 bg-white/50 p-5 backdrop-blur-md shadow-xs">
//                   <div className="flex justify-between">
//                     <span className="text-slate-600">Selected Size</span>
//                     <span className="font-semibold text-slate-900">{selectedSize || "N/A"}</span>
//                   </div>
//                   <div className="mt-3 flex justify-between">
//                     <span className="text-slate-600">Selected Color</span>
//                     <span className="font-semibold text-slate-900">{selectedColor || "N/A"}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Order Button */}
//               <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 to-blue-700 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.02] cursor-pointer">
//                 <ShoppingCart size={20} />
//                 Order Now
//               </button>
//             </div>
//           </div>

//           {/* Detailed Description */}
//           <div className="border-t border-slate-100 px-8 pb-10 pt-10 lg:px-12">
//             <h2 className="mb-5 text-3xl font-bold text-slate-900">Product Description</h2>
//             <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-6 backdrop-blur-xl shadow-xs">
//               <div
//                 className="leading-8 text-slate-600 prose max-w-none"
//                 dangerouslySetInnerHTML={{ __html: product.description }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }






// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { ShoppingCart, Star } from "lucide-react";
// import { decorProducts } from "@/data/products/decorProducts";

// function InfoCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-md p-4 shadow-xs">
//       <p className="text-sm text-slate-500">{title}</p>
//       <p className="mt-1 font-semibold text-slate-900">{value}</p>
//     </div>
//   );
// }

// export default function ProductDetails() {
//   const { slug } = useParams();

//   const product = decorProducts.find((item) => item.slug === slug);

//   const [selectedImage, setSelectedImage] = useState(0);

//   const [selectedSize, setSelectedSize] = useState(
//     product?.sizes?.[0] || ""
//   );

//   const [selectedColor, setSelectedColor] = useState(
//     product?.colors?.[0]?.name || ""
//   );

//   if (!product) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-white">
//         <h1 className="text-4xl font-bold">Product Not Found</h1>
//       </div>
//     );
//   }

//   return (
//     <section className="min-h-screen bg-white py-14">

//       <div className="mx-auto max-w-7xl px-4">
//         <div className="rounded-3xl border border-slate-200/80 bg-white/40 backdrop-blur-3xl shadow-2xl shadow-slate-200 overflow-hidden">

//           <div className="grid lg:grid-cols-2 gap-10 p-8 lg:p-12">

//             {/* LEFT */}
//             <div>
//               <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-lg backdrop-blur-md">
//                 <img
//                   src={product.images[selectedImage]}
//                   alt={product.name}
//                   className="aspect-square w-full rounded-2xl object-cover transition duration-500 hover:scale-105"
//                 />

//                 <div className="mt-5 grid grid-cols-4 gap-3">
//                   {product.images.map((img, index) => (
//                     <img
//                       key={index}
//                       src={img}
//                       onClick={() => setSelectedImage(index)}
//                       className={`aspect-square cursor-pointer rounded-xl object-cover border-2 transition
//                       ${selectedImage === index
//                           ? "border-cyan-500"
//                           : "border-transparent hover:border-cyan-300"
//                         }
//                       `}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT */}
//             <div>
//               <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
//                 {product.category}
//               </span>

//               <h1 className="mt-5 text-5xl font-bold text-slate-900">
//                 {product.name}
//               </h1>

//               <p className="mt-4 leading-8 text-slate-600">
//                 {product.shortDescription}
//               </p>

//               <div className="mt-6 flex items-center gap-4">
//                 <h2 className="text-4xl font-bold text-slate-900">
//                   ৳{product.price.toLocaleString()}
//                 </h2>
//                 <span className="text-xl text-slate-400 line-through">
//                   ৳{product.oldPrice?.toLocaleString()}
//                 </span>
//                 <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
//                   {product.discount}% OFF
//                 </span>
//               </div>

//               <div className="mt-5 flex items-center gap-2">
//                 <Star size={18} className="fill-yellow-400 text-yellow-400" />
//                 <span className="font-semibold">{product.rating}</span>
//                 <span className="text-slate-500">({product.reviews} Reviews)</span>
//               </div>

//               <div className="mt-8 grid grid-cols-2 gap-4">
//                 <InfoCard title="Brand" value={product.brand} />
//                 <InfoCard title="SKU" value={product.sku} />
//                 <InfoCard title="Stock" value={`${product.stock} Available`} />
//                 <InfoCard title="Category" value={product.category} />
//               </div>

//               {/* Sizes */}
//               <div className="mt-8">
//                 <h3 className="mb-3 text-lg font-semibold text-slate-900">Available Sizes</h3>
//                 <div className="flex flex-wrap gap-3">
//                   {product.sizes?.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`rounded-xl border px-5 py-2 font-medium transition
//                       ${selectedSize === size
//                           ? "border-cyan-600 bg-cyan-600 text-white"
//                           : "border-slate-200 bg-white/60 backdrop-blur-xs hover:border-cyan-500 hover:bg-cyan-50"
//                         }
//                       `}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Colors */}
//               <div className="mt-8">
//                 <h3 className="mb-3 text-lg font-semibold text-slate-900">Available Colors</h3>
//                 <div className="flex gap-4">
//                   {product.colors?.map((color) => (
//                     <button
//                       key={color.name}
//                       onClick={() => setSelectedColor(color.name)}
//                       title={color.name}
//                       className={`flex h-11 w-11 items-center justify-center rounded-full border-4 transition
//                       ${selectedColor === color.name
//                           ? "border-cyan-500 scale-110"
//                           : "border-white shadow-md hover:scale-105"
//                         }
//                       `}
//                       style={{ backgroundColor: color.code }}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Selected Box */}
//               <div className="mt-8 rounded-2xl border border-slate-200/60 bg-white/50 p-5 backdrop-blur-md shadow-xs">
//                 <div className="flex justify-between">
//                   <span className="text-slate-600">Selected Size</span>
//                   <span className="font-semibold text-slate-900">{selectedSize}</span>
//                 </div>
//                 <div className="mt-3 flex justify-between">
//                   <span className="text-slate-600">Selected Color</span>
//                   <span className="font-semibold text-slate-900">{selectedColor}</span>
//                 </div>
//               </div>

//               {/* Button */}
//               <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 to-blue-700 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.02]">
//                 <ShoppingCart size={20} />
//                 Order Now
//               </button>
//             </div>

//           </div>

//           {/* Description */}
//           <div className="border-t border-slate-100 px-8 pb-10 pt-10 lg:px-12">
//             <h2 className="mb-5 text-3xl font-bold text-slate-900">Product Description</h2>
//             <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-6 backdrop-blur-xl shadow-xs">
//               <p className="leading-8 text-slate-600">{product.description}</p>
//             </div>
//           </div>

//         </div>

//       </div>
//     </section>
//   );
// }


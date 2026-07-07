/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";


import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product, ProductVariant } from "@/types/product.type";

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-md p-4 shadow-xs">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();

 
  const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
  const products: Product[] = response?.data || [];

 
  const product = products.find((item) => item.slug === slug);

 
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);


  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");


  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      setSelectedVariant(defaultVariant);
      setSelectedImage(0);
      setSelectedSize("");
      setSelectedColor("");
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-lg font-medium text-slate-500 animate-pulse">
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800">Product Not Found</h1>
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

  return (
    <section className="min-h-screen bg-white py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl border border-slate-200/80 bg-white/40 backdrop-blur-3xl shadow-2xl shadow-slate-200 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-10 p-8 lg:p-12">

            {/* LEFT - IMAGE GALLERY */}
            <div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-lg backdrop-blur-md">
                <img
                  src={productImages[selectedImage] || product.thumbnail || ""}
                  alt={product.name}
                  className="aspect-square w-full rounded-2xl object-cover transition duration-500 hover:scale-105"
                />

                {productImages.length > 1 && (
                  <div className="mt-5 grid grid-cols-4 gap-3">
                    {productImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt=""
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square cursor-pointer rounded-xl object-cover border-2 transition ${selectedImage === index
                          ? "border-cyan-500"
                          : "border-transparent hover:border-cyan-300"
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT - INFO SECTION */}
            <div>
              <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                {product.category?.name || "Decor"}
              </span>

              <h1 className="mt-5 text-5xl font-bold text-slate-900">
                {product.name}
              </h1>

              <p className="mt-4 leading-8 text-slate-600">
                {product.short_description}
              </p>

              {/* Price Calculation */}
              <div className="mt-6 flex items-center gap-4">
                <h2 className="text-4xl font-bold text-slate-900">
                  ৳{(hasDiscount ? salePrice : price).toLocaleString()}
                </h2>
                {hasDiscount && (
                  <span className="text-xl text-slate-400 line-through">
                    ৳{price.toLocaleString()}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Hardcoded Ratings as per your structure */}
              <div className="mt-5 flex items-center gap-2">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.8</span>
                <span className="text-slate-500">(24 Reviews)</span>
              </div>

              {/* Info Cards mapping from real types */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <InfoCard title="Brand" value={(product.brand as any)?.name || "Premium"} />
                <InfoCard title="SKU" value={currentVariant?.sku || "N/A"} />
                <InfoCard title="Stock" value={currentVariant?.status === "active" ? "Available" : "Stock Out"} />
                <InfoCard title="Category" value={product.sub_category?.name || product.category?.name} />
              </div>

              {/* Variants Selector (If multi-variant products exist) */}
              {product.variants && product.variants.length > 1 && (
                <div className="mt-8">
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">Available Options</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v, idx) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVariant(v);
                          setSelectedImage(0);
                        }}
                        className={`rounded-xl border px-5 py-2 font-medium transition ${currentVariant?.id === v.id
                          ? "border-cyan-600 bg-cyan-600 text-white"
                          : "border-slate-200 bg-white/60 backdrop-blur-xs hover:border-cyan-500 hover:bg-cyan-50"
                          }`}
                      >
                        Option {idx + 1} ({v.sku})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Box Summary */}
              {(selectedSize || selectedColor) && (
                <div className="mt-8 rounded-2xl border border-slate-200/60 bg-white/50 p-5 backdrop-blur-md shadow-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Selected Size</span>
                    <span className="font-semibold text-slate-900">{selectedSize || "N/A"}</span>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <span className="text-slate-600">Selected Color</span>
                    <span className="font-semibold text-slate-900">{selectedColor || "N/A"}</span>
                  </div>
                </div>
              )}

              {/* Order Button */}
              <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 to-blue-700 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.02] cursor-pointer">
                <ShoppingCart size={20} />
                Order Now
              </button>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="border-t border-slate-100 px-8 pb-10 pt-10 lg:px-12">
            <h2 className="mb-5 text-3xl font-bold text-slate-900">Product Description</h2>
            <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-6 backdrop-blur-xl shadow-xs">
              <div
                className="leading-8 text-slate-600 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}






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


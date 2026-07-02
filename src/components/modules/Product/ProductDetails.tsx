



import { useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { decorProducts } from "@/data/products/decorProducts";

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
  const { slug } = useParams();

  const product = decorProducts.find((item) => item.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || ""
  );

  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0]?.name || ""
  );

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <h1 className="text-4xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white py-14">

      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl border border-slate-200/80 bg-white/40 backdrop-blur-3xl shadow-2xl shadow-slate-200 overflow-hidden">

          <div className="grid lg:grid-cols-2 gap-10 p-8 lg:p-12">

            {/* LEFT */}
            <div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-lg backdrop-blur-md">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="aspect-square w-full rounded-2xl object-cover transition duration-500 hover:scale-105"
                />

                <div className="mt-5 grid grid-cols-4 gap-3">
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square cursor-pointer rounded-xl object-cover border-2 transition
                      ${selectedImage === index
                          ? "border-cyan-500"
                          : "border-transparent hover:border-cyan-300"
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                {product.category}
              </span>

              <h1 className="mt-5 text-5xl font-bold text-slate-900">
                {product.name}
              </h1>

              <p className="mt-4 leading-8 text-slate-600">
                {product.shortDescription}
              </p>

              <div className="mt-6 flex items-center gap-4">
                <h2 className="text-4xl font-bold text-slate-900">
                  ৳{product.price.toLocaleString()}
                </h2>
                <span className="text-xl text-slate-400 line-through">
                  ৳{product.oldPrice?.toLocaleString()}
                </span>
                <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                  {product.discount}% OFF
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-slate-500">({product.reviews} Reviews)</span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <InfoCard title="Brand" value={product.brand} />
                <InfoCard title="SKU" value={product.sku} />
                <InfoCard title="Stock" value={`${product.stock} Available`} />
                <InfoCard title="Category" value={product.category} />
              </div>

              {/* Sizes */}
              <div className="mt-8">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Available Sizes</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-xl border px-5 py-2 font-medium transition
                      ${selectedSize === size
                          ? "border-cyan-600 bg-cyan-600 text-white"
                          : "border-slate-200 bg-white/60 backdrop-blur-xs hover:border-cyan-500 hover:bg-cyan-50"
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mt-8">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Available Colors</h3>
                <div className="flex gap-4">
                  {product.colors?.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border-4 transition
                      ${selectedColor === color.name
                          ? "border-cyan-500 scale-110"
                          : "border-white shadow-md hover:scale-105"
                        }
                      `}
                      style={{ backgroundColor: color.code }}
                    />
                  ))}
                </div>
              </div>

              {/* Selected Box */}
              <div className="mt-8 rounded-2xl border border-slate-200/60 bg-white/50 p-5 backdrop-blur-md shadow-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Selected Size</span>
                  <span className="font-semibold text-slate-900">{selectedSize}</span>
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="text-slate-600">Selected Color</span>
                  <span className="font-semibold text-slate-900">{selectedColor}</span>
                </div>
              </div>

              {/* Button */}
              <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 to-blue-700 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.02]">
                <ShoppingCart size={20} />
                Order Now
              </button>
            </div>

          </div>

          {/* Description */}
          <div className="border-t border-slate-100 px-8 pb-10 pt-10 lg:px-12">
            <h2 className="mb-5 text-3xl font-bold text-slate-900">Product Description</h2>
            <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-6 backdrop-blur-xl shadow-xs">
              <p className="leading-8 text-slate-600">{product.description}</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}














// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { Star, ShoppingCart } from "lucide-react";
// import { decorProducts } from "@/data/products/decorProducts";

// function InfoCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-xl bg-white/5 border border-white/10 p-4">
//       <p className="text-sm text-gray-400">{title}</p>

//       <p className="text-white font-semibold mt-1">{value}</p>
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
//       <div className="min-h-screen flex items-center justify-center bg-slate-950">
//         <h1 className="text-4xl text-white font-bold">
//           Product Not Found
//         </h1>
//       </div>
//     );
//   }

//   return (
//     <section className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-4">

//       <div className="max-w-7xl mx-auto">

//         <div
//           className="
//             rounded-3xl
//             border border-white/10
//             bg-white/5
//             backdrop-blur-2xl
//             shadow-[0_20px_60px_rgba(0,0,0,.35)]
//             overflow-hidden
//             p-8 lg:p-12
//           "
//         >

//           <div className="grid lg:grid-cols-2 gap-12">

//             {/* LEFT */}

//             <div>

//               <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-4">

//                 <img
//                   src={product.images[selectedImage]}
//                   alt={product.name}
//                   className="
//                     w-full
//                     aspect-square
//                     object-cover
//                     rounded-xl
//                     transition
//                     duration-500
//                     hover:scale-105
//                   "
//                 />

//                 <div className="grid grid-cols-4 gap-3 mt-4">

//                   {product.images.map((img, index) => (

//                     <img
//                       key={index}
//                       src={img}
//                       alt=""
//                       onClick={() => setSelectedImage(index)}
//                       className={`
//                         aspect-square
//                         rounded-lg
//                         object-cover
//                         cursor-pointer
//                         transition
//                         ${
//                           selectedImage === index
//                             ? "border-2 border-cyan-400"
//                             : "border border-white/10"
//                         }
//                       `}
//                     />

//                   ))}

//                 </div>

//               </div>

//             </div>

//             {/* RIGHT */}

//             <div className="space-y-7">

//               <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm">
//                 {product.category}
//               </span>

//               <h1 className="text-5xl font-bold text-white">
//                 {product.name}
//               </h1>

//               <p className="text-gray-300 leading-8">
//                 {product.shortDescription}
//               </p>

//               <div className="flex items-center gap-4">

//                 <h2 className="text-4xl font-bold text-white">
//                   ৳{product.price.toLocaleString()}
//                 </h2>

//                 <span className="text-xl line-through text-gray-500">
//                   ৳{product.oldPrice?.toLocaleString()}
//                 </span>

//                 <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                   {product.discount}% OFF
//                 </span>

//               </div>

//               <div className="flex items-center gap-2 text-yellow-400">

//                 <Star fill="currentColor" size={18} />

//                 <span className="text-white">
//                   {product.rating}
//                 </span>

//                 <span className="text-gray-400">
//                   ({product.reviews} Reviews)
//                 </span>

//               </div>

//               <div className="grid grid-cols-2 gap-4">

//                 <InfoCard
//                   title="Brand"
//                   value={product.brand}
//                 />

//                 <InfoCard
//                   title="SKU"
//                   value={product.sku}
//                 />

//                 <InfoCard
//                   title="Stock"
//                   value={`${product.stock} Available`}
//                 />

//                 <InfoCard
//                   title="Category"
//                   value={product.category}
//                 />

//               </div>

//                             {/* Sizes */}

//               <div>

//                 <h3 className="text-white font-semibold mb-3">
//                   Available Sizes
//                 </h3>

//                 <div className="flex gap-3 flex-wrap">

//                   {product.sizes?.map((size) => (

//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`
//                         px-5
//                         py-2
//                         rounded-xl
//                         border
//                         transition
//                         ${
//                           selectedSize === size
//                             ? "bg-cyan-500 border-cyan-500 text-white"
//                             : "border-white/10 bg-white/5 text-white hover:bg-cyan-500 hover:border-cyan-500"
//                         }
//                       `}
//                     >
//                       {size}
//                     </button>

//                   ))}

//                 </div>

//               </div>

//               {/* Colors */}

//               <div>

//                 <h3 className="text-white font-semibold mb-3">
//                   Available Colors
//                 </h3>

//                 <div className="flex gap-4">

//                   {product.colors?.map((color) => (

//                     <div
//                       key={color.name}
//                       title={color.name}
//                       onClick={() => setSelectedColor(color.name)}
//                       className={`
//                         w-10
//                         h-10
//                         rounded-full
//                         cursor-pointer
//                         transition
//                         border-4
//                         ${
//                           selectedColor === color.name
//                             ? "border-cyan-400 scale-110"
//                             : "border-white"
//                         }
//                       `}
//                       style={{
//                         backgroundColor: color.code,
//                       }}
//                     />

//                   ))}

//                 </div>

//               </div>

//               {/* Selected */}

//               <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">

//                 <p className="text-gray-300">
//                   Selected Size :
//                   <span className="text-white font-semibold ml-2">
//                     {selectedSize}
//                   </span>
//                 </p>

//                 <p className="text-gray-300">
//                   Selected Color :
//                   <span className="text-white font-semibold ml-2">
//                     {selectedColor}
//                   </span>
//                 </p>

//               </div>

//               {/* Button */}

//               <button
//                 className="
//                   w-full
//                   py-4
//                   rounded-xl
//                   bg-linear-to-r
//                   from-cyan-500
//                   to-blue-600
//                   text-white
//                   font-semibold
//                   text-lg
//                   shadow-lg
//                   hover:scale-[1.02]
//                   transition
//                   flex
//                   items-center
//                   justify-center
//                   gap-2
//                 "
//               >
//                 <ShoppingCart size={20} />
//                 Order Now
//               </button>

//             </div>

//           </div>

//           {/* Description */}

//           <div className="mt-14">

//             <h2 className="text-3xl font-bold text-white mb-5">
//               Product Description
//             </h2>

//             <div className="rounded-2xl bg-white/5 border border-white/10 p-6">

//               <p className="text-gray-300 leading-8">
//                 {product.description}
//               </p>

//             </div>

//           </div>

//         </div>

//       </div>

//     </section>
//   );
// }

















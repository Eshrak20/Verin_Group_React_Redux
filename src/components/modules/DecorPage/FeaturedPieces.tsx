
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product } from "@/types/product.type";
import { useNavigate } from "react-router-dom";

function getDiscount(price: string, salePrice: string): number {
  const p = parseFloat(price);
  const s = parseFloat(salePrice);
  // sale_price, price এর চেয়ে কম হলেই discount
  if (!s || s >= p) return 0;
  return Math.round(((p - s) / p) * 100);
}

function getImage(product: Product): string {
  return (
    product.variants?.[0]?.images?.[0]?.image_url ||
    product.thumbnail ||
    "/placeholder.jpg"
  );
}

function getDisplayPrice(price: string, salePrice: string): number {
  const p = parseFloat(price);
  const s = parseFloat(salePrice);
  // sale_price valid এবং price এর চেয়ে কম হলে সেটা দেখাও
  return s > 0 && s < p ? s : p;
}

export default function FeaturedPieces() {
  const navigate = useNavigate();
const { data, isLoading } = useGetProductsQuery({per_page: 100});

  const featuredItems =
    data?.data?.filter(
      (p) => p.is_featured === "1" && (p.variants?.length ?? 0) > 0
    ) || [];

  if (isLoading) {
    return (
      <section className="bg-[#fbfbf8] py-16 px-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="h-9 w-52 bg-stone-200 rounded animate-pulse" />
            <div className="h-4 w-36 bg-stone-200 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[2.2rem] p-4 border border-stone-100 animate-pulse"
            >
              <div className="aspect-4/5 w-full rounded-[1.8rem] bg-stone-200" />
              <div className="mt-5 px-1 space-y-3">
                <div className="h-3 bg-stone-200 rounded w-1/2" />
                <div className="h-5 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-10 bg-stone-200 rounded-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div>
        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-wide">
              Featured Pieces
            </h2>
            <p className="text-stone-500 text-sm mt-2">
              Our currently hottest selling items.
            </p>
          </div>
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 hover:opacity-70 transition-opacity">
            View All <span className="text-sm">→</span>
          </button>
        </div>

        {/* PRODUCT GRID */}
        {featuredItems.length === 0 ? (
          <p className="text-stone-400 text-sm">No featured products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredItems.map((product: Product) => {
              const variant = product.variants[0];
              const price = variant.price;
              const salePrice = variant.sale_price;
              const discount = getDiscount(price, salePrice);
              const displayPrice = getDisplayPrice(price, salePrice);
              const originalPrice = parseFloat(price);
              const image = getImage(product);
              const sku = variant.sku;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-[2.2rem] p-4 border border-stone-100 shadow-xs flex flex-col justify-between group"
                >
                  {/* IMAGE CONTAINER WITH BADGES */}
                  <div className="relative aspect-4/5 w-full rounded-[1.8rem] overflow-hidden bg-stone-100">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />

                    {/* FLOATING BADGES */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                      {discount > 0 && (
                        <span className="bg-[#ffaa00] text-stone-950 text-[9px] font-black tracking-wider px-2.5 py-1 rounded-xs w-max">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="mt-5 px-1 flex-1 flex flex-col justify-between">
                    <div>
                      {/* SKU & SubCategory */}
                      <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest mb-1.5">
                        {sku}
                        {product.sub_category?.name && (
                          <>
                            <span className="mx-1">•</span>
                            {product.sub_category.name}
                          </>
                        )}
                      </p>

                      {/* Product Title */}
                      <h3 className="text-xl font-serif text-stone-900 leading-snug">
                        {product.name}
                      </h3>
                    </div>

                    {/* PRICE & BUTTON */}
                    <div className="mt-4">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-base font-bold text-stone-900">
                          TK {displayPrice.toLocaleString()}.00
                        </span>
                        {discount > 0 && (
                          <span className="text-xs text-stone-400 line-through">
                            TK {originalPrice.toLocaleString()}.00
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => navigate(`/products/${product.slug}`)}
                        className="w-full bg-[#1c1c1c] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-full transition-all duration-300 hover:bg-[#5A5A40] hover:shadow-md cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}







// import { decorProducts } from "@/data/products/decorProducts";
// import { useNavigate } from "react-router-dom";

// export default function FeaturedPieces() {
//   const featuredItems = decorProducts.filter((product) => product.isFeatured);
//   const navigate = useNavigate();

//   return (
//     <section className="bg-[#fbfbf8] py-16 px-14">
//       <div className="">
        
//         {/* SECTION HEADER */}
//         <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
//           <div>
//             <h2 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-wide">
//               Featured Pieces
//             </h2>
//             <p className="text-stone-500 text-sm mt-2">
//               Our currently hottest selling items.
//             </p>
//           </div>
          
//           <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 hover:opacity-70 transition-opacity">
//             View All <span className="text-sm">→</span>
//           </button>
//         </div>

//         {/* PRODUCT GRID */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {featuredItems.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white rounded-[2.2rem] p-4 border border-stone-100 shadow-xs flex flex-col justify-between group"
//             >
//               {/* IMAGE CONTAINER WITH BADGES */}
//               <div className="relative aspect-4/5 w-full rounded-[1.8rem] overflow-hidden bg-stone-100">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 />

//                 {/* FLOATING BADGES LIST */}
//                 <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
//                   {/* Hot Sell Badge */}
//                   {product.isHotSell && (
//                     <span className="bg-[#ff6a00] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xs w-max">
//                       Hot Sell
//                     </span>
//                   )}

//                   {/* New Badge */}
//                   {product.isNew && (
//                     <span className="bg-[#525345] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs w-max">
//                       New
//                     </span>
//                   )}

//                   {/* Discount Badge */}
//                   {product.discount! > 0 && (
//                     <span className="bg-[#ffaa00] text-stone-950 text-[9px] font-black tracking-wider px-2.5 py-1 rounded-xs w-max">
//                       -{product.discount}%
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* PRODUCT INFO */}
//               <div className="mt-5 px-1 flex-1 flex flex-col justify-between">
//                 <div>
//                   {/* SKU & SubCategory */}
//                   <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest mb-1.5">
//                     {product.sku} <span className="mx-1">•</span> {product.subCategory}
//                   </p>

//                   {/* Product Title */}
//                   <h3 className="text-xl font-serif text-stone-900 leading-snug">
//                     {product.name}
//                   </h3>
//                 </div>

//                 {/* PRICE & BUTTON SECTION */}
//                 <div className="mt-4">
//                   {/* Prices */}
//                   <div className="flex items-baseline gap-2 mb-4">
//                     <span className="text-base font-bold text-stone-900">
//                       TK {product.price.toLocaleString()}.00
//                     </span>
//                     {product.oldPrice && (
//                       <span className="text-xs text-stone-400 line-through">
//                         TK {product.oldPrice.toLocaleString()}.00
//                       </span>
//                     )}
//                   </div>

//                   {/* View Details CTA Button */}
//                   <button
//                   onClick={() => navigate(`/products/${product.slug}`)}
//                    className="w-full bg-[#1c1c1c] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-full transition-all duration-300 hover:bg-stone-800 hover:shadow-md cursor-pointer">
//                     View Details
//                   </button>
//                 </div>
//               </div>

//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// }
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/Product/ProductSearch.tsx

import { useRef, useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import { useGetCategoriesQuery } from "@/redux/services/homepage/homePage.api";


interface ProductSearchProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export default function ProductSearch({ searchOpen, setSearchOpen }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const location = useLocation();

  // 1. ক্যাটাগরি ডাটা ফেচ করা
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  // 2. ইউআরএল থেকে ডায়নামিকালি Category ID বের করা (শুধু একবারই ডিক্লেয়ার করা হয়েছে)
  // এবং রিটার্ন টাইপটিকে number | undefined রাখা হয়েছে
  const currentCategoryId = useMemo<number | undefined>(() => {
    const path = location.pathname.toLowerCase();

    if (path === "/" || path === "") return undefined;

    const matchedCategory = categories.find((cat: any) => {
      const slugMatch = cat.slug && path.includes(cat.slug.toLowerCase());
      const nameMatch = cat.name && path.includes(cat.name.toLowerCase());
      return slugMatch || nameMatch;
    });

    // string/number যা-ই আসুক, সুরক্ষিতভাবে number-এ রূপান্তর করা হচ্ছে
    return matchedCategory ? Number(matchedCategory.id) : undefined;
  }, [location.pathname, categories]);

  // 3. ব্যাকএন্ডে টাইপ-সেফ কোয়েরি প্যারামস পাঠানো
  const { data, isLoading } = useGetProductsQuery(
    { 
      search: searchTerm.trim(), 
      ...(currentCategoryId !== undefined && { category_id: currentCategoryId }), 
      per_page: 10 
    },
    { skip: searchTerm.trim().length < 1 }
  );

  // ড্রপডাউন এর বাইরে ক্লিক করলে তা বন্ধ করার জন্য
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchOpen]);

  const searchResults = (data?.data || []).slice(0, 10);
  const hasResults = searchResults.length > 0;

  const handleIconClick = () => {
    if (!searchOpen) {
      setSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div ref={containerRef} className="relative z-999999 flex justify-end">
      {/* 🎯 সার্চ বার কন্টেইনার */}
      <div 
        onClick={handleIconClick}
        className={`
          flex items-center gap-2 rounded-full border border-gray-300 bg-white h-10 shadow-sm 
          transition-all duration-300 cursor-pointer focus-within:border-gray-400
          ${searchOpen ? "w-44 px-4 border-gray-400" : "w-10 justify-center px-0"}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setSearchOpen(true);
            setIsOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              if (searchTerm.trim().length === 0) {
                setSearchOpen(false);
                setIsOpen(false);
              }
            }, 200);
          }}
          placeholder={currentCategoryId ? "Search in page..." : "Search..."}
          className={`
            bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 transition-all duration-300
            ${searchOpen ? "w-full opacity-100 px-1" : "w-0 opacity-0 pointer-events-none"}
          `}
        />
        <Search size={16} className="text-[#00416A] shrink-0" />
      </div>

      {/* 🎯 Dropdown Panel (UI অবিকল আগের মতো) */}
      {isOpen && searchTerm.trim().length > 0 && searchOpen && (
        <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-2 flex flex-col z-100 min-w-[320px] md:w-96 text-left animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="py-6 text-center text-sm text-gray-400">
              Searching...
            </div>
          ) : hasResults ? (
            <>
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {searchResults.map((product: any) => {
                  const firstVariant = product.variants?.[0];
                  const firstImage = firstVariant?.images?.[0]?.image_url;
                  
                  const imageUrl = product.thumbnail || firstImage || "https://via.placeholder.com/150";
                  const price = firstVariant?.price || product.price || 0;
                  const sku = firstVariant?.sku || `PD-00${product.id}`;

                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        setSearchOpen(false);
                        setSearchTerm("");
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-11 h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold home-black-text line-clamp-1">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
                            {sku}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <span className="text-sm font-bold text-gray-900">
                          TK {Number(price).toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 mt-1 p-2 bg-gray-50/50">
                <Link
                  to={`/search?query=${encodeURIComponent(searchTerm)}${currentCategoryId ? `&category_id=${currentCategoryId}` : ""}`}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchOpen(false);
                    setSearchTerm("");
                  }}
                  className="block w-full text-center py-2 text-xs font-bold home-black-text hover:underline hover:cursor-pointer transition-all"
                >
                  View all results
                </Link>
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-sm text-gray-400">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}









// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/modules/Product/ProductSearch.tsx
// import { useRef, useEffect, useState } from "react";
// import { Search } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// // 🎯 Navbar এর সাথে এনিমেশন স্টেট শেয়ার করার জন্য ইন্টারফেস
// interface ProductSearchProps {
//   searchOpen: boolean;
//   setSearchOpen: (open: boolean) => void;
// }

// export default function ProductSearch({ searchOpen, setSearchOpen }: ProductSearchProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // 🎯 ব্যাকএন্ড সার্চ প্যারামিটার্স
//   // ব্যাকএন্ড API সরাসরি `search` কোয়েরি প্যারামিটার গ্রহণ করে।
//   // অতিরিক্ত ফিল্টার (যেমন specific attributes, category_id, sort ইত্যাদি) প্রয়োজন হলে এখানে অবজেক্টে অবজেক্ট আকারে যোগ করতে পারেন।
//   const { data, isLoading } = useGetProductsQuery(
//     { 
//       search: searchTerm.trim(), 
//       per_page: 10 // লেটেস্ট ১০টি আইটেম নিয়ে আসার জন্য
//     },
//     { skip: searchTerm.trim().length < 1 } // ইনপুট খালি থাকলে কল হবে না
//   );

//   // ড্রপডাউন এর বাইরে ক্লিক করলে তা বন্ধ করার এবং সার্চ বার ছোট করার জন্য
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//         setSearchOpen(false); // Navbar এর স্টেট রিসেট
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [setSearchOpen]);

//   // ব্যাকএন্ড থেকে সরাসরি ১০টি ফিল্টারড রেজাল্ট নেওয়া
//   const searchResults = (data?.data || []).slice(0, 10);
//   const hasResults = searchResults.length > 0;

//   const handleIconClick = () => {
//     if (!searchOpen) {
//       setSearchOpen(true);
//       setTimeout(() => inputRef.current?.focus(), 100); // আইকনে ক্লিক করলে ইনপুট ফোকাস হবে
//     }
//   };

//   return (
//     <div ref={containerRef} className="relative z-999999 flex justify-end">
//       {/* 🎯 সার্চ বার কন্টেইনার (অ্যানিমেশন সহ) */}
//       <div 
//         onClick={handleIconClick}
//         className={`
//           flex items-center gap-2 rounded-full border border-gray-300 bg-white h-10 shadow-sm 
//           transition-all duration-300 cursor-pointer focus-within:border-gray-400
//           ${searchOpen ? "w-44 px-4 border-gray-400" : "w-10 justify-center px-0"}
//         `}
//       >
//         <input
//           ref={inputRef}
//           type="text"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setIsOpen(true);
//           }}
//           onFocus={() => {
//             setSearchOpen(true);
//             setIsOpen(true);
//           }}
//           onBlur={() => {
//             // ইনপুট খালি থাকলে ব্লার হওয়ার পর সার্চ বারটি আবার ছোট হয়ে যাবে
//             setTimeout(() => {
//               if (searchTerm.trim().length === 0) {
//                 setSearchOpen(false);
//                 setIsOpen(false);
//               }
//             }, 200);
//           }}
//           placeholder="Search..."
//           className={`
//             bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 transition-all duration-300
//             ${searchOpen ? "w-full opacity-100 px-1" : "w-0 opacity-0 pointer-events-none"}
//           `}
//         />
//         <Search size={16} className="text-[#00416A] shrink-0" />
//       </div>

//       {/* 🎯 Dropdown Floating Panel (UI অবিকল রাখা হয়েছে) */}
//       {isOpen && searchTerm.trim().length > 0 && searchOpen && (
//         <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-2 flex flex-col z-100 min-w-[320px] md:w-96 text-left animate-in fade-in slide-in-from-top-2 duration-200">
//           {isLoading ? (
//             <div className="py-6 text-center text-sm text-gray-400">
//               Searching...
//             </div>
//           ) : hasResults ? (
//             <>
//               <div className="max-h-80 overflow-y-auto p-2 space-y-1">
//                 {searchResults.map((product: any) => {
//                   const firstVariant = product.variants?.[0];
//                   const firstImage = firstVariant?.images?.[0]?.image_url;
                  
//                   const imageUrl = product.thumbnail || firstImage || "https://via.placeholder.com/150";
//                   const price = firstVariant?.price || product.price || 0;
//                   const sku = firstVariant?.sku || `PD-00${product.id}`;

//                   return (
//                     <Link
//                       key={product.id}
//                       to={`/products/${product.slug}`}
//                       onClick={() => {
//                         setIsOpen(false);
//                         setSearchOpen(false);
//                         setSearchTerm("");
//                       }}
//                       className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group"
//                     >
//                       <div className="flex items-center gap-3 min-w-0">
//                         <img
//                           src={imageUrl}
//                           alt={product.name}
//                           className="w-11 h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
//                         />
//                         <div className="flex flex-col min-w-0">
//                           <span className="text-sm font-semibold home-black-text line-clamp-1">
//                             {product.name}
//                           </span>
//                           <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
//                             {sku}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="text-right shrink-0 pl-3">
//                         <span className="text-sm font-bold text-gray-900">
//                           TK {Number(price).toLocaleString()}
//                         </span>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>

//               <div className="border-t border-gray-100 mt-1 p-2 bg-gray-50/50">
//                 <Link
//                   to={`/search?query=${encodeURIComponent(searchTerm)}`}
//                   onClick={() => {
//                     setIsOpen(false);
//                     setSearchOpen(false);
//                     setSearchTerm("");
//                   }}
//                   className="block w-full text-center py-2 text-xs font-bold home-black-text hover:underline hover:cursor-pointer transition-all"
//                 >
//                   View all results
//                 </Link>
//               </div>
//             </>
//           ) : (
//             <div className="py-6 text-center text-sm text-gray-400">
//               No products found
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }










// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/modules/Product/ProductSearch.tsx
// import { useRef, useEffect, useState } from "react";
// import { Search } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// // 🎯 Navbar এর সাথে এনিমেশন স্টেট শেয়ার করার জন্য ইন্টারফেস
// interface ProductSearchProps {
//   searchOpen: boolean;
//   setSearchOpen: (open: boolean) => void;
// }

// export default function ProductSearch({ searchOpen, setSearchOpen }: ProductSearchProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // ব্যাকএন্ডে রিকোয়েস্ট পাঠানো হচ্ছে
//   const { data } = useGetProductsQuery(
//     { search: searchTerm, per_page: 50 },
//     { skip: searchTerm.trim().length < 1 }
//   );

//   // ড্রপডাউন এর বাইরে ক্লিক করলে তা বন্ধ করার এবং সার্চ বার ছোট করার জন্য
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//         setSearchOpen(false); // Navbar এর স্টেট রিসেট
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [setSearchOpen]);

//   const allProducts = data?.data || [];
  
//   const filteredProducts = allProducts.filter((product: any) => {
//     if (!searchTerm.trim()) return false;
//     const productName = product.name?.toLowerCase() || "";
//     const searchString = searchTerm.toLowerCase();
//     return productName.includes(searchString);
//   });

//   const decorProducts = filteredProducts
//     .filter((p: any) => String(p.category_id) === "5")
//     .slice(0, 3);
    
//   const electronicsProducts = filteredProducts
//     .filter((p: any) => String(p.category_id) === "6")
//     .slice(0, 3);
  
//   const combinedProducts = [...decorProducts, ...electronicsProducts];
//   const hasResults = combinedProducts.length > 0;

//   const handleIconClick = () => {
//     if (!searchOpen) {
//       setSearchOpen(true);
//       setTimeout(() => inputRef.current?.focus(), 100); // আইকনে ক্লিক করলে ইনপুট ফোকাস হবে
//     }
//   };

//   return (
//     <div ref={containerRef} className="relative z-999999 flex justify-end">
//       {/* 🎯 সার্চ বার কন্টেইনার (অ্যানিমেশন সহ) */}
//       <div 
//         onClick={handleIconClick}
//         className={`
//           flex items-center gap-2 rounded-full border border-gray-300 bg-white h-10 shadow-sm 
//           transition-all duration-300 cursor-pointer focus-within:border-gray-400
//           ${searchOpen ? "w-44 px-4 border-gray-400" : "w-10 justify-center px-0"}
//         `}
//       >
//         <input
//           ref={inputRef}
//           type="text"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setIsOpen(true);
//           }}
//           onFocus={() => {
//             setSearchOpen(true);
//             setIsOpen(true);
//           }}
//           onBlur={() => {
//             // ইনপুট খালি থাকলে ব্লার হওয়ার পর সার্চ বারটি আবার ছোট হয়ে যাবে
//             setTimeout(() => {
//               if (searchTerm.trim().length === 0) {
//                 setSearchOpen(false);
//                 setIsOpen(false);
//               }
//             }, 200);
//           }}
//           placeholder="Search..."
//           className={`
//             bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 transition-all duration-300
//             ${searchOpen ? "w-full opacity-100 px-1" : "w-0 opacity-0 pointer-events-none"}
//           `}
//         />
//         <Search size={16} className="text-[#00416A] shrink-0" />
//       </div>

//       {/* Dropdown Floating Panel */}
//       {/* {isOpen && searchTerm.trim().length > 0 && searchOpen && (
//         <div className="absolute top-11 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-1 py-2 flex flex-col z-999999 min-w-[320px] md:min-w-90">
//           {hasResults ? (
//             <>
//               <div className="max-h-90 overflow-y-auto px-2 space-y-1">
//                 {combinedProducts.map((product: any) => {
//                   const firstVariant = product.variants?.[0];
//                   const firstImage = firstVariant?.images?.[0]?.image_url;
                  
//                   const imageUrl = product.thumbnail || firstImage || "https://via.placeholder.com/150";
//                   const price = firstVariant?.price || 0;
//                   const sku = firstVariant?.sku || `PD-00${product.id}`;

//                   return (
//                     <Link
//                       key={product.id}
//                       to={`/products/${product.slug}`}
//                       onClick={() => {
//                         setIsOpen(false);
//                         setSearchOpen(false);
//                         setSearchTerm("");
//                       }}
//                       className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group"
//                     >
//                       <div className="flex items-center gap-3 min-w-0">
//                         <img
//                           src={imageUrl}
//                           alt={product.name}
//                           className="w-11 h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
//                         />
//                         <div className="flex flex-col min-w-0">
//                           <span className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
//                             {product.name}
//                           </span>
//                           <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
//                             {sku}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="text-right shrink-0 pl-3">
//                         <span className="text-sm font-bold text-gray-900">
//                           TK {Number(price).toLocaleString()}
//                         </span>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>

//               <div className="border-t border-gray-100 mt-2 pt-2 px-2 text-center">
//                 <Link
//                   to={`/search?query=${encodeURIComponent(searchTerm)}`}
//                   onClick={() => {
//                     setIsOpen(false);
//                     setSearchOpen(false);
//                     setSearchTerm("");
//                   }}
//                   className="block w-full text-center py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
//                 >
//                   View all results
//                 </Link>
//               </div>
//             </>
//           ) : (
//             <div className="py-6 text-center text-sm text-gray-400">
//               No products found
//             </div>
//           )}
//         </div>
//       )} */}
//       {isOpen && searchTerm.trim().length > 0 && searchOpen && (
//       <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-2 flex flex-col z-100 min-w-[320px] md:w-96 text-left animate-in fade-in slide-in-from-top-2 duration-200">
//         {hasResults ? (
//           <>
//             <div className="max-h-80 overflow-y-auto p-2 space-y-1">
//               {combinedProducts.map((product: any) => {
//                 const firstVariant = product.variants?.[0];
//                 const firstImage = firstVariant?.images?.[0]?.image_url;
                
//                 const imageUrl = product.thumbnail || firstImage || "https://via.placeholder.com/150";
//                 const price = firstVariant?.price || 0;
//                 const sku = firstVariant?.sku || `PD-00${product.id}`;

//                 return (
//                   <Link
//                     key={product.id}
//                     to={`/products/${product.slug}`}
//                     onClick={() => {
//                       setIsOpen(false);
//                       setSearchOpen(false);
//                       setSearchTerm("");
//                     }}
//                     className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group"
//                   >
//                     <div className="flex items-center gap-3 min-w-0">
//                       <img
//                         src={imageUrl}
//                         alt={product.name}
//                         className="w-11 h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
//                       />
//                       <div className="flex flex-col min-w-0">
//                         <span className="text-sm font-semibold home-black-text line-clamp-1 ">
//                           {product.name}
//                         </span>
//                         <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
//                           {sku}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="text-right shrink-0 pl-3">
//                       <span className="text-sm font-bold text-gray-900">
//                         TK {Number(price).toLocaleString()}
//                       </span>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>

//             <div className="border-t border-gray-100 mt-1 p-2 bg-gray-50/50">
//               <Link
//                 to={`/search?query=${encodeURIComponent(searchTerm)}`}
//                 onClick={() => {
//                   setIsOpen(false);
//                   setSearchOpen(false);
//                   setSearchTerm("");
//                 }}
//                 className="block w-full text-center py-2 text-xs font-bold home-black-text hover:underline hover:cursor-pointer transition-all"
//               >
//                 View all results
//               </Link>
//             </div>
//           </>
//         ) : (
//           <div className="py-6 text-center text-sm text-gray-400">
//             No products found
//           </div>
//         )}
//       </div>
//     )}
//     </div>
//   );
// }











// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/modules/Product/ProductSearch.tsx
// import { useState, useRef, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// export default function ProductSearch() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false); // 🎯 অ্যানিমেশন কন্ট্রোল করার জন্য স্টেট
//   const containerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // ব্যাকএন্ডে রিকোয়েস্ট পাঠানো হচ্ছে
//   const { data } = useGetProductsQuery(
//     { search: searchTerm, per_page: 50 },
//     { skip: searchTerm.trim().length < 1 }
//   );

//   // ড্রপডাউন এর বাইরে ক্লিক করলে তা বন্ধ করার এবং সার্চ বার ছোট করার জন্য
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//         setIsExpanded(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const allProducts = data?.data || [];
  
//   // 🎯 প্রধান ফিক্স: ক্লায়েন্ট সাইডে নামের সাথে ইনপুটের মিল (H) ফিল্টার করা হচ্ছে 
//   const filteredProducts = allProducts.filter((product: any) => {
//     if (!searchTerm.trim()) return false;
    
//     const productName = product.name?.toLowerCase() || "";
//     const searchString = searchTerm.toLowerCase();
    
//     // প্রোডাক্টের নামের যেকোনো জায়গায় টাইপ করা অক্ষরগুলো থাকলে সেটি ট্রু রিটার্ন করবে
//     return productName.includes(searchString);
//   });

//   // 🎯 ফিল্টার করা প্রোডাক্ট থেকে Decor (Category 5) আলাদা করে ৩টি নেওয়া হচ্ছে
//   const decorProducts = filteredProducts
//     .filter((p: any) => String(p.category_id) === "5")
//     .slice(0, 3);
    
//   // 🎯 ফিল্টার করা প্রোডাক্ট থেকে Electronics (Category 6) আলাদা করে ৩টি নেওয়া হচ্ছে  
//   const electronicsProducts = filteredProducts
//     .filter((p: any) => String(p.category_id) === "6")
//     .slice(0, 3);
  
//   // ২টি ক্যাটাগরির প্রোডাক্ট একসাথে মার্জ করা হচ্ছে (৩ + ৩ = সর্বোচ্চ ৬টি)
//   const combinedProducts = [...decorProducts, ...electronicsProducts];
//   const hasResults = combinedProducts.length > 0;

//   const handleIconClick = () => {
//     if (!isExpanded) {
//       setIsExpanded(true);
//       setTimeout(() => inputRef.current?.focus(), 100); // আইকনে ক্লিক করলে ইনপুট ফোকাস হবে
//     }
//   };

//   return (
//     <div ref={containerRef} className="relative z-999999 flex justify-end">
//       {/* 🎯 Search Input Field (অ্যানিমেশন ক্লাসেস যুক্ত করা হয়েছে) */}
//       <div 
//         onClick={handleIconClick}
//         className={`
//           flex items-center gap-2 rounded-full border border-gray-300 bg-white h-10 shadow-sm 
//           transition-all duration-300 cursor-pointer focus-within:border-gray-400
//           ${isExpanded ? "w-48 md:w-64 px-4" : "w-10 justify-center px-0"}
//         `}
//       >
//         <input
//           ref={inputRef}
//           type="text"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setIsOpen(true);
//           }}
//           onFocus={() => {
//             setIsExpanded(true);
//             setIsOpen(true);
//           }}
//           onBlur={() => {
//             // ইনপুট খালি থাকলে ব্লার হওয়ার পর সার্চ বারটি আবার ছোট হয়ে যাবে
//             setTimeout(() => {
//               if (searchTerm.trim().length === 0) {
//                 setIsExpanded(false);
//                 setIsOpen(false);
//               }
//             }, 200);
//           }}
//           placeholder="Search..."
//           className={`
//             bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 transition-all duration-300
//             ${isExpanded ? "w-full opacity-100 px-1" : "w-0 opacity-0 pointer-events-none"}
//           `}
//         />
//         <Search size={16} className="text-gray-400 shrink-0" />
//       </div>

//       {/* Dropdown Floating Panel */}
//       {isOpen && searchTerm.trim().length > 0 && isExpanded && (
//         <div className="absolute top-11 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-1 py-2 flex flex-col z-999999 min-w-[320px] md:min-w-90">
          
//           {hasResults ? (
//             <>
//               <div className="max-h-90 overflow-y-auto px-2 space-y-1">
//                 {combinedProducts.map((product: any) => {
//                   const firstVariant = product.variants?.[0];
//                   const firstImage = firstVariant?.images?.[0]?.image_url;
                  
//                   const imageUrl = product.thumbnail || firstImage || "https://via.placeholder.com/150";
//                   const price = firstVariant?.price || 0;
//                   const sku = firstVariant?.sku || `PD-00${product.id}`;

//                   return (
//                     <Link
//                       key={product.id}
//                       to={`/products/${product.slug}`}
//                       onClick={() => {
//                         setIsOpen(false);
//                         setIsExpanded(false);
//                         setSearchTerm("");
//                       }}
//                       className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group"
//                     >
//                       <div className="flex items-center gap-3 min-w-0">
//                         <img
//                           src={imageUrl}
//                           alt={product.name}
//                           className="w-11 h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
//                         />
//                         <div className="flex flex-col min-w-0">
//                           <span className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
//                             {product.name}
//                           </span>
//                           <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
//                             {sku}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="text-right shrink-0 pl-3">
//                         <span className="text-sm font-bold text-gray-900">
//                           TK {Number(price).toLocaleString()}
//                         </span>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>

//               <div className="border-t border-gray-100 mt-2 pt-2 px-2 text-center">
//                 <Link
//                   to={`/search?query=${encodeURIComponent(searchTerm)}`}
//                   onClick={() => {
//                     setIsOpen(false);
//                     setIsExpanded(false);
//                     setSearchTerm("");
//                   }}
//                   className="block w-full text-center py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
//                 >
//                   View all results
//                 </Link>
//               </div>
//             </>
//           ) : (
//             <div className="py-6 text-center text-sm text-gray-400">
//               No products found
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }










// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/modules/Product/ProductSearch.tsx
// import { useState, useRef, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// export default function ProductSearch() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // ব্যাকএন্ডে রিকোয়েস্ট পাঠানো হচ্ছে
//   const { data } = useGetProductsQuery(
//     { search: searchTerm, per_page: 50 },
//     { skip: searchTerm.trim().length < 1 }
//   );

//   // ড্রপডাউন এর বাইরে ক্লিক করলে তা বন্ধ করার জন্য
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const allProducts = data?.data || [];
  
//   // 🎯 প্রধান ফিক্স: ক্লায়েন্ট সাইডে নামের সাথে ইনপুটের মিল (H) ফিল্টার করা হচ্ছে 
//   const filteredProducts = allProducts.filter((product: any) => {
//     if (!searchTerm.trim()) return false;
    
//     const productName = product.name?.toLowerCase() || "";
//     const searchString = searchTerm.toLowerCase();
    
//     // প্রোডাক্টের নামের যেকোনো জায়গায় টাইপ করা অক্ষরগুলো থাকলে সেটি ট্রু রিটার্ন করবে
//     return productName.includes(searchString);
//   });

//   // 🎯 ফিল্টার করা প্রোডাক্ট থেকে Decor (Category 5) আলাদা করে ৩টি নেওয়া হচ্ছে
//   const decorProducts = filteredProducts
//     .filter((p: any) => String(p.category_id) === "5")
//     .slice(0, 3);
    
//   // 🎯 ফিল্টার করা প্রোডাক্ট থেকে Electronics (Category 6) আলাদা করে ৩টি নেওয়া হচ্ছে  
//   const electronicsProducts = filteredProducts
//     .filter((p: any) => String(p.category_id) === "6")
//     .slice(0, 3);
  
//   // ২টি ক্যাটাগরির প্রোডাক্ট একসাথে মার্জ করা হচ্ছে (৩ + ৩ = সর্বোচ্চ ৬টি)
//   const combinedProducts = [...decorProducts, ...electronicsProducts];
//   const hasResults = combinedProducts.length > 0;

//   return (
//     <div ref={containerRef} className="relative w-full z-999999">
//       {/* Search Input Field */}
//       <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 h-10 w-full shadow-sm focus-within:border-gray-400 transition-all">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setIsOpen(true);
//           }}
//           onFocus={() => setIsOpen(true)}
//           placeholder="Search..."
//           className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
//         />
//         <Search size={16} className="text-gray-400 shrink-0" />
//       </div>

//       {/* Dropdown Floating Panel */}
//       {isOpen && searchTerm.trim().length > 0 && (
//         <div className="absolute top-11 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-1 py-2 flex flex-col z-999999 min-w-[320px] md:min-w-90">
          
//           {hasResults ? (
//             <>
//               <div className="max-h-90 overflow-y-auto px-2 space-y-1">
//                 {combinedProducts.map((product: any) => {
//                   const firstVariant = product.variants?.[0];
//                   const firstImage = firstVariant?.images?.[0]?.image_url;
                  
//                   const imageUrl = product.thumbnail || firstImage || "https://via.placeholder.com/150";
//                   const price = firstVariant?.price || 0;
//                   const sku = firstVariant?.sku || `PD-00${product.id}`;

//                   return (
//                     <Link
//                       key={product.id}
//                       to={`/products/${product.slug}`}
//                       onClick={() => setIsOpen(false)}
//                       className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group"
//                     >
//                       <div className="flex items-center gap-3 min-w-0">
//                         <img
//                           src={imageUrl}
//                           alt={product.name}
//                           className="w-11 h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
//                         />
//                         <div className="flex flex-col min-w-0">
//                           <span className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
//                             {product.name}
//                           </span>
//                           <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
//                             {sku}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="text-right shrink-0 pl-3">
//                         <span className="text-sm font-bold text-gray-900">
//                           TK {Number(price).toLocaleString()}
//                         </span>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>

//               <div className="border-t border-gray-100 mt-2 pt-2 px-2 text-center">
//                 <Link
//                   to={`/search?query=${encodeURIComponent(searchTerm)}`}
//                   onClick={() => setIsOpen(false)}
//                   className="block w-full text-center py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
//                 >
//                   View all results
//                 </Link>
//               </div>
//             </>
//           ) : (
//             <div className="py-6 text-center text-sm text-gray-400">
//               No products found
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }








// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/modules/Product/ProductSearch.tsx
// import { useState, useRef, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// export default function ProductSearch() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // API query execution
//   const { data } = useGetProductsQuery(
//     { search: searchTerm, per_page: 50 },
//     { skip: searchTerm.trim().length < 1 }
//   );

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const allProducts = data?.data || [];
  
//   // Safe category filtering supporting both number and string types
//   const decorProducts = allProducts
//     .filter((p: any) => String(p.category_id) === "5")
//     .slice(0, 3);
    
//   const electronicsProducts = allProducts
//     .filter((p: any) => String(p.category_id) === "6")
//     .slice(0, 3);
  
//   let combinedProducts = [...decorProducts, ...electronicsProducts];

//   // Fallback if no matching standard categories are filtered
//   if (combinedProducts.length === 0 && allProducts.length > 0) {
//     combinedProducts = allProducts.slice(0, 6);
//   }

//   const hasResults = combinedProducts.length > 0;

//   return (
//     <div ref={containerRef} className="relative w-full z-999999">
//       {/* Search Input Field */}
//       <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 h-10 w-full shadow-sm focus-within:border-gray-400 transition-all">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setIsOpen(true);
//           }}
//           onFocus={() => setIsOpen(true)}
//           placeholder="Search..."
//           className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
//         />
//         <Search size={16} className="text-gray-400 shrink-0" />
//       </div>

//       {/* Dropdown Floating Panel */}
//       {isOpen && searchTerm.trim().length > 0 && (
//         <div className="absolute top-11 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden py-2 flex flex-col z-999999 min-w-[320px] md:min-w-90">
          
//           {hasResults ? (
//             <>
//               <div className="max-h-90 overflow-y-auto px-2 space-y-1">
//                 {combinedProducts.map((product: any) => {
//                   const firstVariant = product.variants?.[0];
//                   const firstImage = firstVariant?.images?.[0]?.image_url;
                  
//                   // Extract correct image URL, price and SKU code
//                   const imageUrl = product.thumbnail || firstImage || "https://via.placeholder.com/150";
//                   const price = firstVariant?.price || 0;
//                   const sku = firstVariant?.sku || `PD-00${product.id}`;

//                   return (
//                     <Link
//                       key={product.id}
//                       to={`/products/${product.slug}`}
//                       onClick={() => setIsOpen(false)}
//                       className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group"
//                     >
//                       <div className="flex items-center gap-3 min-w-0">
//                         <img
//                           src={imageUrl}
//                           alt={product.name}
//                           className="w-11 h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
//                         />
//                         <div className="flex flex-col min-w-0">
//                           <span className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
//                             {product.name}
//                           </span>
//                           <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
//                             {sku}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="text-right shrink-0 pl-3">
//                         <span className="text-sm font-bold text-gray-900">
//                           TK {Number(price).toLocaleString()}
//                         </span>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>

//               <div className="border-t border-gray-100 mt-2 pt-2 px-2 text-center">
//                 <Link
//                   to={`/search?query=${encodeURIComponent(searchTerm)}`}
//                   onClick={() => setIsOpen(false)}
//                   className="block w-full text-center py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
//                 >
//                   View all results
//                 </Link>
//               </div>
//             </>
//           ) : (
//             <div className="py-6 text-center text-sm text-gray-400">
//               No products found
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }










// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/layout/ProductSearch.tsx
// import { useState, useRef, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// export default function ProductSearch() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // RTK Query দিয়ে ডেটা ফেচ করা হচ্ছে (টাইপ করার সাথে সাথে ট্রিগার হবে)
//   const { data } = useGetProductsQuery(
//     { search: searchTerm, per_page: 50 }, // ক্যাটাগরি ফিল্টারিং ক্লায়েন্ট সাইডে হ্যান্ডেল করার জন্য কিছু বেশি ডেটা আনা হচ্ছে
//     { skip: searchTerm.trim().length < 1 } // ১ অক্ষরের কম হলে API কল স্কিপ করবে
//   );

//   // ক্লিক বাইরে পড়লে ড্রপডাউন বন্ধ করার জন্য
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
  

//   // পূর্ববর্তী রেসপন্স ফরম্যাট অনুযায়ী Decor (5) এবং Electronics (6) এর আইডি ব্যবহার করা হলো
//   const allProducts = data?.data || [];
  
//   const decorProducts = allProducts.filter((p: any) => p.category_id === 5).slice(0, 3);
//   const electronicsProducts = allProducts.filter((p: any) => p.category_id === 6).slice(0, 3);
  
//   const combinedProducts = [...decorProducts, ...electronicsProducts];
//   const hasResults = combinedProducts.length > 0;

//   return (
//     <div ref={containerRef} className="relative w-full max-w-md mx-auto z-50">
//       {/* Search Input Box */}
//       <div className="flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 px-4 h-10 w-full shadow-sm focus-within:border-gray-400 transition-all">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setIsOpen(true);
//           }}
//           onFocus={() => setIsOpen(true)}
//           placeholder="Search..."
//           className="w-full bg-transparent text-sm text-slate-700 dark:text-white outline-none placeholder:text-slate-400"
//         />
//         <Search size={16} className="text-gray-400 shrink-0" />
//       </div>

//       {/* Search Results Dropdown (স্ক্রিনশটের ডিজাইন অনুযায়ী) */}
//       {isOpen && searchTerm.trim().length > 0 && (
//         <div className="absolute top-12 left-0 right-0 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden mt-1 py-2 flex flex-col z-50">
          
//           {hasResults ? (
//             <>
//               {/* Product List */}
//               <div className="max-h-90 overflow-y-auto px-2 space-y-1">
//                 {combinedProducts.map((product: any) => (
//                   <Link
//                     key={product.id}
//                     to={`/products/${product.slug}`}
//                     onClick={() => setIsOpen(false)}
//                     className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
//                   >
//                     <div className="flex items-center gap-3">
//                       {/* Product Image */}
//                       <img
//                         src={product.image_url || `https://v.veringroup.com/storage/${product.image}`}
//                         alt={product.name}
//                         className="w-12 h-12 object-cover rounded-xl bg-gray-100"
//                       />
//                       {/* Product Name & Code */}
//                       <div className="flex flex-col">
//                         <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-blue-600 transition-colors">
//                           {product.name}
//                         </span>
//                         <span className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">
//                           {product.sku || `PD-00${product.id}`}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Product Price */}
//                     <div className="text-right shrink-0 pl-2">
//                       <span className="text-sm font-bold text-gray-900 dark:text-white">
//                         TK {Number(product.price || 0).toLocaleString()}
//                       </span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>

//               {/* View All Results Button */}
//               <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2 px-2 text-center">
//                 <Link
//                   to={`/search?query=${encodeURIComponent(searchTerm)}`}
//                   onClick={() => setIsOpen(false)}
//                   className="block w-full text-center py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all"
//                 >
//                   View all results
//                 </Link>
//               </div>
//             </>
//           ) : (
//             <div className="py-6 text-center text-sm text-gray-400">
//               No products found
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
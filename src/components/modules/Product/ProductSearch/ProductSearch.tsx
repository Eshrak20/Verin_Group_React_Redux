/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/Product/ProductSearch.tsx

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import { useGetCategoriesQuery } from "@/redux/services/homepage/homePage.api";

// Modular Imports
import SearchInputBar from "./SearchInputBar";
import SearchDropdown from "./SearchDropdown";

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
  
  // লিন্ট ওয়ার্নিং দূর করার জন্য categories কে useMemo দিয়ে র‍্যাপ করা হলো
  const categories = useMemo(() => {
    return categoriesData?.data || [];
  }, [categoriesData?.data]);

  // 2. ইউআরএল থেকে ডায়নামিকালি Category ID বের করা
  const currentCategoryId = useMemo<number | undefined>(() => {
    const path = location.pathname.toLowerCase();

    if (path === "/" || path === "") return undefined;

    const matchedCategory = categories.find((cat: any) => {
      const slugMatch = cat.slug && path.includes(cat.slug.toLowerCase());
      const nameMatch = cat.name && path.includes(cat.name.toLowerCase());
      return slugMatch || nameMatch;
    });

    return matchedCategory ? Number(matchedCategory.id) : undefined;
  }, [location.pathname, categories]);

  // 3. ব্যাকএন্ডে টাইপ-সেফ কোয়েরি প্যারামস পাঠানো
  const { data, isLoading } = useGetProductsQuery(
    { 
      search: searchTerm.trim(), 
      ...(currentCategoryId !== undefined && { category_id: currentCategoryId }), 
      per_page: 10 
    },
    { skip: searchTerm.trim().length < 1 }
  );

  // ড্রপডাউন এর বাইরে ক্লিক করলে তা বন্ধ করার জন্য
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setSearchOpen(false);
    }
  }, [setSearchOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  const searchResults = (data?.data || []).slice(0, 10);
  const hasResults = searchResults.length > 0;

  // 🎯 সার্চে পাওয়া প্রথম প্রোডাক্ট বা তার category থেকে Category ID বের করা
  const searchResultCategoryId = searchResults?.[0]?.category_id || searchResults?.[0]?.category?.id;
  const targetCategoryId = currentCategoryId ?? searchResultCategoryId;

  const handleIconCodeClick = () => {
    if (!searchOpen) {
      setSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div ref={containerRef} className="relative z-999999 flex justify-end">
      {/* 🎯 সার্চ বার কন্টেইনার */}
      <SearchInputBar
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        setIsOpen={setIsOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentCategoryId={currentCategoryId}
        inputRef={inputRef}
        handleIconCodeClick={handleIconCodeClick}
      />

      {/* 🎯 Dropdown Panel */}
      <SearchDropdown
        isOpen={isOpen}
        searchTerm={searchTerm}
        searchOpen={searchOpen}
        isLoading={isLoading}
        searchResults={searchResults}
        hasResults={hasResults}
        targetCategoryId={targetCategoryId}
        setIsOpen={setIsOpen}
        setSearchOpen={setSearchOpen}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}













// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/modules/Product/ProductSearch.tsx

// import { useRef, useEffect, useState, useMemo, useCallback } from "react";
// import { Search } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import { useGetCategoriesQuery } from "@/redux/services/homepage/homePage.api";

// interface ProductSearchProps {
//   searchOpen: boolean;
//   setSearchOpen: (open: boolean) => void;
// }

// export default function ProductSearch({ searchOpen, setSearchOpen }: ProductSearchProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
  
//   const location = useLocation();

//   // 1. ক্যাটাগরি ডাটা ফেচ করা
//   const { data: categoriesData } = useGetCategoriesQuery();
  
//   // লিন্ট ওয়ার্নিং দূর করার জন্য categories কে useMemo দিয়ে র‍্যাপ করা হলো
//   const categories = useMemo(() => {
//     return categoriesData?.data || [];
//   }, [categoriesData?.data]);

//   // 2. ইউআরএল থেকে ডায়নামিকালি Category ID বের করা
//   const currentCategoryId = useMemo<number | undefined>(() => {
//     const path = location.pathname.toLowerCase();

//     if (path === "/" || path === "") return undefined;

//     const matchedCategory = categories.find((cat: any) => {
//       const slugMatch = cat.slug && path.includes(cat.slug.toLowerCase());
//       const nameMatch = cat.name && path.includes(cat.name.toLowerCase());
//       return slugMatch || nameMatch;
//     });

//     return matchedCategory ? Number(matchedCategory.id) : undefined;
//   }, [location.pathname, categories]);

//   // 3. ব্যাকএন্ডে টাইপ-সেফ কোয়েরি প্যারামস পাঠানো
//   const { data, isLoading } = useGetProductsQuery(
//     { 
//       search: searchTerm.trim(), 
//       ...(currentCategoryId !== undefined && { category_id: currentCategoryId }), 
//       per_page: 10 
//     },
//     { skip: searchTerm.trim().length < 1 }
//   );

//   // ড্রপডাউন এর বাইরে ক্লিক করলে তা বন্ধ করার জন্য
//   const handleOutsideClick = useCallback((event: MouseEvent) => {
//     if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//       setIsOpen(false);
//       setSearchOpen(false);
//     }
//   }, [setSearchOpen]);

//   useEffect(() => {
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, [handleOutsideClick]);

//   const searchResults = (data?.data || []).slice(0, 10);
//   const hasResults = searchResults.length > 0;

//   // 🎯 সার্চে পাওয়া প্রথম প্রোডাক্ট বা তার category থেকে Category ID বের করা
//   const searchResultCategoryId = searchResults?.[0]?.category_id || searchResults?.[0]?.category?.id;
//   const targetCategoryId = currentCategoryId ?? searchResultCategoryId;

//   const handleIconCodeClick = () => {
//     if (!searchOpen) {
//       setSearchOpen(true);
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   };

//   return (
//     <div ref={containerRef} className="relative z-999999 flex justify-end">
//       {/* 🎯 সার্চ বার কন্টেইনার */}
//       <div 
//         onClick={handleIconCodeClick}
//         className={`
//           flex items-center rounded-full border border-[#00416A]/30 bg-transparent h-8 sm:h-10 shadow-sm 
//           transition-all duration-300 cursor-pointer focus-within:border-[#00416A]
//           ${
//             searchOpen 
//               ? "w-28 sm:w-36 md:w-44 px-2 sm:px-3 border-[#00416A]" 
//               : "w-8 sm:w-10 justify-center px-0 hover:border-[#a5abaf] hover:bg-gray-200/60"
//           }
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
//             setTimeout(() => {
//               if (searchTerm.trim().length === 0) {
//                 setSearchOpen(false);
//                 setIsOpen(false);
//               }
//             }, 200);
//           }}
//           placeholder={currentCategoryId ? "Search in page..." : "Search..."}
//           className={`
//             bg-transparent text-[11px] sm:text-xs text-slate-700 outline-none placeholder:text-slate-400 transition-all duration-300
//             ${searchOpen ? "w-full opacity-100 px-1" : "w-0 opacity-0 pointer-events-none"}
//           `}
//         />
//         <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00416A] shrink-0" />
//       </div>

//       {/* 🎯 Dropdown Panel */}
//       {isOpen && searchTerm.trim().length > 0 && searchOpen && (
//         <div className="absolute top-full -right-12 sm:right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-2 flex flex-col z-100 w-72.5 sm:w-80 md:w-96 text-left animate-in fade-in slide-in-from-top-2 duration-200">
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
//                           className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
//                         />
//                         <div className="flex flex-col min-w-0">
//                           <span className="text-xs sm:text-sm font-semibold home-black-text line-clamp-1">
//                             {product.name}
//                           </span>
//                           <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
//                             {sku}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="text-right shrink-0 pl-2 sm:pl-3">
//                         <span className="text-xs sm:text-sm font-bold text-gray-900">
//                           TK {Number(price).toLocaleString()}
//                         </span>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>

//               <div className="border-t border-gray-100 mt-1 p-2 bg-gray-50/50">
//                 <Link
//                   to={`/search?query=${encodeURIComponent(searchTerm)}${targetCategoryId ? `&category_id=${targetCategoryId}` : ""}`}
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















// // src/components/modules/Product/ProductSearch.tsx

// import { useRef, useEffect, useState, useMemo } from "react";
// import { Search } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import { useGetCategoriesQuery } from "@/redux/services/homepage/homePage.api";

// interface ProductSearchProps {
//   searchOpen: boolean;
//   setSearchOpen: (open: boolean) => void;
// }

// export default function ProductSearch({ searchOpen, setSearchOpen }: ProductSearchProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
  
//   const location = useLocation();

//   // 1. ক্যাটাগরি ডাটা ফেচ করা
//   const { data: categoriesData } = useGetCategoriesQuery();
//   const categories = categoriesData?.data || [];

//   // 2. ইউআরএল থেকে ডায়নামিকালি Category ID বের করা
//   const currentCategoryId = useMemo<number | undefined>(() => {
//     const path = location.pathname.toLowerCase();

//     if (path === "/" || path === "") return undefined;

//     const matchedCategory = categories.find((cat: any) => {
//       const slugMatch = cat.slug && path.includes(cat.slug.toLowerCase());
//       const nameMatch = cat.name && path.includes(cat.name.toLowerCase());
//       return slugMatch || nameMatch;
//     });

//     return matchedCategory ? Number(matchedCategory.id) : undefined;
//   }, [location.pathname, categories]);

//   // 3. ব্যাকএন্ডে টাইপ-সেফ কোয়েরি প্যারামস পাঠানো
//   const { data, isLoading } = useGetProductsQuery(
//     { 
//       search: searchTerm.trim(), 
//       ...(currentCategoryId !== undefined && { category_id: currentCategoryId }), 
//       per_page: 10 
//     },
//     { skip: searchTerm.trim().length < 1 }
//   );

//   // ড্রপডাউন এর বাইরে ক্লিক করলে তা বন্ধ করার জন্য
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//         setSearchOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [setSearchOpen]);

//   const searchResults = (data?.data || []).slice(0, 10);
//   const hasResults = searchResults.length > 0;

//   // 🎯 সার্চে পাওয়া প্রথম প্রোডাক্ট বা তার category থেকে Category ID বের করা
//   const searchResultCategoryId = searchResults?.[0]?.category_id || searchResults?.[0]?.category?.id;
//   const targetCategoryId = currentCategoryId ?? searchResultCategoryId;

//   const handleIconClick = () => {
//     if (!searchOpen) {
//       setSearchOpen(true);
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   };

//   return (
//     <div ref={containerRef} className="relative z-999999 flex justify-end">
//       {/* 🎯 সার্চ বার কন্টেইনার (মোবাইলে Cart/Wishlist বাটনের সাথে আইকন ও বর্ডার সেইম করা হয়েছে) */}
//       <div 
//         onClick={handleIconClick}
//         className={`
//           flex items-center rounded-full border border-[#00416A]/30 bg-transparent h-8 sm:h-10 shadow-sm 
//           transition-all duration-300 cursor-pointer focus-within:border-[#00416A]
//           ${
//             searchOpen 
//               ? "w-28 sm:w-36 md:w-44 px-2 sm:px-3 border-[#00416A]" 
//               : "w-8 sm:w-10 justify-center px-0 hover:border-[#a5abaf] hover:bg-gray-200/60"
//           }
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
//             setTimeout(() => {
//               if (searchTerm.trim().length === 0) {
//                 setSearchOpen(false);
//                 setIsOpen(false);
//               }
//             }, 200);
//           }}
//           placeholder={currentCategoryId ? "Search in page..." : "Search..."}
//           className={`
//             bg-transparent text-[11px] sm:text-xs text-slate-700 outline-none placeholder:text-slate-400 transition-all duration-300
//             ${searchOpen ? "w-full opacity-100 px-1" : "w-0 opacity-0 pointer-events-none"}
//           `}
//         />
//         <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00416A] shrink-0" />
//       </div>

//       {/* 🎯 Dropdown Panel (Small ডিভাইসে -right-12 দিয়ে সেন্টারে এলাইন করা হয়েছে এবং Large/Medium-এ আগের পজিশনে রয়েছে) */}
//       {isOpen && searchTerm.trim().length > 0 && searchOpen && (
//         <div className="absolute top-full -right-12 sm:right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-2 flex flex-col z-100 w-72.5 sm:w-80 md:w-96 text-left animate-in fade-in slide-in-from-top-2 duration-200">
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
//                           className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
//                         />
//                         <div className="flex flex-col min-w-0">
//                           <span className="text-xs sm:text-sm font-semibold home-black-text line-clamp-1">
//                             {product.name}
//                           </span>
//                           <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
//                             {sku}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="text-right shrink-0 pl-2 sm:pl-3">
//                         <span className="text-xs sm:text-sm font-bold text-gray-900">
//                           TK {Number(price).toLocaleString()}
//                         </span>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>

//               <div className="border-t border-gray-100 mt-1 p-2 bg-gray-50/50">
//                 <Link
//                   to={`/search?query=${encodeURIComponent(searchTerm)}${targetCategoryId ? `&category_id=${targetCategoryId}` : ""}`}
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









// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/modules/Product/ProductSearch.tsx

// import { useRef, useEffect, useState, useMemo } from "react";
// import { Search } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import { useGetCategoriesQuery } from "@/redux/services/homepage/homePage.api";

// interface ProductSearchProps {
//   searchOpen: boolean;
//   setSearchOpen: (open: boolean) => void;
// }

// export default function ProductSearch({ searchOpen, setSearchOpen }: ProductSearchProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
  
//   const location = useLocation();

//   // 1. ক্যাটাগরি ডাটা ফেচ করা
//   const { data: categoriesData } = useGetCategoriesQuery();
//   const categories = categoriesData?.data || [];

//   // 2. ইউআরএল থেকে ডায়নামিকালি Category ID বের করা
//   const currentCategoryId = useMemo<number | undefined>(() => {
//     const path = location.pathname.toLowerCase();

//     if (path === "/" || path === "") return undefined;

//     const matchedCategory = categories.find((cat: any) => {
//       const slugMatch = cat.slug && path.includes(cat.slug.toLowerCase());
//       const nameMatch = cat.name && path.includes(cat.name.toLowerCase());
//       return slugMatch || nameMatch;
//     });

//     return matchedCategory ? Number(matchedCategory.id) : undefined;
//   }, [location.pathname, categories]);

//   // 3. ব্যাকএন্ডে টাইপ-সেফ কোয়েরি প্যারামস পাঠানো
//   const { data, isLoading } = useGetProductsQuery(
//     { 
//       search: searchTerm.trim(), 
//       ...(currentCategoryId !== undefined && { category_id: currentCategoryId }), 
//       per_page: 10 
//     },
//     { skip: searchTerm.trim().length < 1 }
//   );

//   // ড্রপডাউন এর বাইরে ক্লিক করলে তা বন্ধ করার জন্য
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//         setSearchOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [setSearchOpen]);

//   const searchResults = (data?.data || []).slice(0, 10);
//   const hasResults = searchResults.length > 0;

//   const handleIconClick = () => {
//     if (!searchOpen) {
//       setSearchOpen(true);
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   };

//   return (
//     <div ref={containerRef} className="relative z-999999 flex justify-end">
//       {/* 🎯 সার্চ বার কন্টেইনার (মোবাইলে Cart/Wishlist বাটনের সাথে আইকন ও বর্ডার সেইম করা হয়েছে) */}
//       <div 
//         onClick={handleIconClick}
//         className={`
//           flex items-center rounded-full border border-[#00416A]/30 bg-transparent h-8 sm:h-10 shadow-sm 
//           transition-all duration-300 cursor-pointer focus-within:border-[#00416A]
//           ${
//             searchOpen 
//               ? "w-28 sm:w-36 md:w-44 px-2 sm:px-3 border-[#00416A]" 
//               : "w-8 sm:w-10 justify-center px-0 hover:border-[#a5abaf] hover:bg-gray-200/60"
//           }
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
//             setTimeout(() => {
//               if (searchTerm.trim().length === 0) {
//                 setSearchOpen(false);
//                 setIsOpen(false);
//               }
//             }, 200);
//           }}
//           placeholder={currentCategoryId ? "Search in page..." : "Search..."}
//           className={`
//             bg-transparent text-[11px] sm:text-xs text-slate-700 outline-none placeholder:text-slate-400 transition-all duration-300
//             ${searchOpen ? "w-full opacity-100 px-1" : "w-0 opacity-0 pointer-events-none"}
//           `}
//         />
//         <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00416A] shrink-0" />
//       </div>

//       {/* 🎯 Dropdown Panel (Small ডিভাইসে -right-12 দিয়ে সেন্টারে এলাইন করা হয়েছে এবং Large/Medium-এ আগের পজিশনে রয়েছে) */}
//       {isOpen && searchTerm.trim().length > 0 && searchOpen && (
//         <div className="absolute top-full -right-12 sm:right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-2 flex flex-col z-100 w-72.5 sm:w-80 md:w-96 text-left animate-in fade-in slide-in-from-top-2 duration-200">
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
//                           className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
//                         />
//                         <div className="flex flex-col min-w-0">
//                           <span className="text-xs sm:text-sm font-semibold home-black-text line-clamp-1">
//                             {product.name}
//                           </span>
//                           <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
//                             {sku}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="text-right shrink-0 pl-2 sm:pl-3">
//                         <span className="text-xs sm:text-sm font-bold text-gray-900">
//                           TK {Number(price).toLocaleString()}
//                         </span>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>

//               <div className="border-t border-gray-100 mt-1 p-2 bg-gray-50/50">
//                 <Link
//                   to={`/search?query=${encodeURIComponent(searchTerm)}${currentCategoryId ? `&category_id=${currentCategoryId}` : ""}`}
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







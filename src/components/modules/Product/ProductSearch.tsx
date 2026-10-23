import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product } from "@/types/product.type";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();

  // 2. ইউআরএল থেকে ডায়নামিকালি Category ID বের করা
  const currentCategoryId = useMemo<number | undefined>(() => {
    const path = location.pathname.toLowerCase();

    if (path === "/" || path === "") return undefined;

    if (path.startsWith("/decor")) return 1;
    if (path.startsWith("/electronics")) return 2;

    return undefined;
  }, [location.pathname]);

  // 3. ব্যাকএন্ডে টাইপ-সেফ কোয়েরি প্যারামস পাঠানো
  const { data, isLoading } = useGetProductsQuery(
    {
      search: searchTerm.trim(),
      ...(currentCategoryId !== undefined && {
        category_id: currentCategoryId,
      }),
    },
    {
      skip: searchTerm.trim().length < 1,
    },
  );

  // ড্রপডাউন এর বাইরে ক্লিক করলে শুধুমাত্র ড্রপডাউন বন্ধ করার জন্য
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = (data?.data.products || []).slice(0, 10);
  const hasResults = searchResults.length > 0;

  const targetCategoryId = currentCategoryId;

  const searchUrl = `/search?query=${encodeURIComponent(searchTerm.trim())}${targetCategoryId !== undefined
    ? `&category_id=${targetCategoryId}`
    : ""
    }`;
  return (
    <div ref={containerRef} className="relative z-50 flex justify-end">
      {/* 🎯 সর্বদাই ওপেন ও প্রসারিত সার্চ বার কন্টেইনার */}
      <div
        className="flex items-center rounded-full border border-[#00416A]/30 bg-transparent h-8 sm:h-10 px-2 sm:px-3 shadow-sm transition-all duration-300 w-36 sm:w-44 md:w-44 focus-within:border-[#00416A]"
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
            if (searchTerm.trim().length > 0) setIsOpen(true);
          }}
          placeholder={currentCategoryId ? "Search in page..." : "Search..."}
          className="w-full bg-transparent text-[11px] sm:text-xs text-slate-700 outline-none placeholder:text-slate-400 px-1"
        />
        <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00416A] shrink-0" />
      </div>

      {/* 🎯 ড্রপডাউন প্যানেল */}
      {isOpen && searchTerm.trim().length > 0 && (
        <div className="absolute top-full -right-12 sm:right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-2 flex flex-col z-50 w-72.5 sm:w-80 md:w-96 text-left animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="py-6 text-center text-sm text-gray-400">
              Searching...
            </div>
          ) : hasResults ? (
            <>
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {searchResults.map((product: Product) => {
                  const firstVariant = product.variant;
                  const firstImage = firstVariant?.images?.[0];

                  const imageUrl = product.thumbnail || firstImage || "https://via.placeholder.com/150";
                  const price = firstVariant?.price || 0;
                  const sku = firstVariant?.sku || `PD-00${product.id}`;

                  const productUrl =
                    product.category === "Electronics"
                      ? `/electronics/${product.slug}`
                      : `/products/${product.slug}`;

                  return (
                    <Link
                      key={product.id}
                      to={productUrl}
                      onClick={() => {
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-semibold home-black-text line-clamp-1">
                            {product.name}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 truncate">
                            {sku}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2 sm:pl-3">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          TK {Number(price).toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

            
              <div className="border-t border-gray-100 mt-1 p-2 bg-gray-50/50">
                <Link
                  to={searchUrl}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-gray-50 group"
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
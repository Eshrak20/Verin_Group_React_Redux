import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product } from "@/types/product.type";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface ProductSearchProps {
  variant?: "desktop" | "mobile";
}

export default function ProductSearch({ variant = "desktop" }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();

  const currentCategoryId = useMemo<number | undefined>(() => {
    const path = location.pathname.toLowerCase();

    if (path === "/" || path === "") return undefined;
    if (path.startsWith("/decor")) return 1;
    if (path.startsWith("/electronics")) return 2;

    return undefined;
  }, [location.pathname]);

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

  const searchUrl = `/search?query=${encodeURIComponent(searchTerm.trim())}${
    targetCategoryId !== undefined ? `&category_id=${targetCategoryId}` : ""
  }`;

  const isMobile = variant === "mobile";

  return (
    <div
      ref={containerRef}
      className={`relative z-50 flex ${isMobile ? "w-full" : "justify-end"}`}
    >
      {/* 🎯 Search Bar Container */}
      <div
        className={
          isMobile
            ? "flex h-11 w-full items-center rounded-full border border-gray-200/90 bg-white px-4 shadow-2xs transition-all duration-300 focus-within:border-[#00416A]/50"
            : "flex h-8 w-36 items-center rounded-full border border-[#00416A]/30 bg-transparent px-2 shadow-sm transition-all duration-300 focus-within:border-[#00416A] sm:h-10 sm:w-44 sm:px-3"
        }
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
          placeholder={
            isMobile
              ? "Search products..."
              : currentCategoryId
                ? "Search in page..."
                : "Search..."
          }
          className={
            isMobile
              ? "w-full bg-transparent pr-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              : "w-full bg-transparent px-1 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 sm:text-xs"
          }
        />
        <Search
          className={
            isMobile
              ? "h-4 w-4 shrink-0 text-slate-400"
              : "h-3.5 w-3.5 shrink-0 text-[#00416A] sm:h-4 sm:w-4"
          }
        />
      </div>

      {/* 🎯 Dropdown Panel */}
      {isOpen && searchTerm.trim().length > 0 && (
        <div
          className={
            isMobile
              ? "absolute top-full left-0 right-0 z-50 mt-2 flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
              : "absolute top-full -right-12 z-50 mt-2 flex w-72.5 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 sm:right-0 sm:w-80 md:w-96"
          }
        >
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

                  const imageUrl =
                    product.thumbnail || firstImage || "https://via.placeholder.com/150";
                  const price = firstVariant?.price || 0;
                  const sku = firstVariant?.sku || `PD-00${product.id}`;

                  const productUrl =
                    product.category === "Electronics"
                      ? `/electronics/products/${product.slug}`
                      : `/products/${product.slug}`;

                  return (
                    <Link
                      key={product.id}
                      to={productUrl}
                      onClick={() => {
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className="group flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-10 w-10 shrink-0 rounded-xl border border-gray-100 bg-gray-50 object-cover sm:h-11 sm:w-11"
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="line-clamp-1 text-xs font-semibold home-black-text sm:text-sm">
                            {product.name}
                          </span>
                          <span className="mt-0.5 truncate text-[9px] uppercase tracking-wider text-gray-400 sm:text-[10px]">
                            {sku}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2 text-right sm:pl-3">
                        <span className="text-xs font-bold text-gray-900 sm:text-sm">
                          TK {Number(price).toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-1 border-t border-gray-100 bg-gray-50/50 p-2">
                <Link
                  to={searchUrl}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="group flex items-center justify-between rounded-xl p-2 text-xs font-semibold text-[#00416A] transition-colors hover:bg-gray-50"
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
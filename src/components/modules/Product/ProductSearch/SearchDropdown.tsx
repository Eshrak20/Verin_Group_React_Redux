/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/Product/SearchDropdown.tsx

import { Link } from "react-router-dom";
import SearchResultItem from "./SearchResultItem";

interface SearchDropdownProps {
  isOpen: boolean;
  searchTerm: string;
  searchOpen: boolean;
  isLoading: boolean;
  searchResults: any[];
  hasResults: boolean;
  targetCategoryId?: number | string; // 👈 এখানে string যুক্ত করে দিন
  setIsOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
}

export default function SearchDropdown({
  isOpen,
  searchTerm,
  searchOpen,
  isLoading,
  searchResults,
  hasResults,
  targetCategoryId,
  setIsOpen,
  setSearchOpen,
  setSearchTerm,
}: SearchDropdownProps) {
  if (!isOpen || searchTerm.trim().length <= 0 || !searchOpen) return null;

  return (
    <div className="absolute top-full -right-12 sm:right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mt-2 flex flex-col z-100 w-72.5 sm:w-80 md:w-96 text-left animate-in fade-in slide-in-from-top-2 duration-200">
      {isLoading ? (
        <div className="py-6 text-center text-sm text-gray-400">
          Searching...
        </div>
      ) : hasResults ? (
        <>
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {searchResults.map((product: any) => (
              <SearchResultItem
                key={product.id}
                product={product}
                setIsOpen={setIsOpen}
                setSearchOpen={setSearchOpen}
                setSearchTerm={setSearchTerm}
              />
            ))}
          </div>

          <div className="border-t border-gray-100 mt-1 p-2 bg-gray-50/50">
            <Link
              to={`/search?query=${encodeURIComponent(searchTerm)}${targetCategoryId ? `&category_id=${targetCategoryId}` : ""}`}
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
  );
}
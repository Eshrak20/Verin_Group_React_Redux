// src/components/modules/Product/SearchInputBar.tsx

import { Search } from "lucide-react";
import type { RefObject } from "react";

interface SearchInputBarProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  setIsOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentCategoryId?: number;
  inputRef: RefObject<HTMLInputElement | null>;
  handleIconCodeClick: () => void;
}

export default function SearchInputBar({
  searchOpen,
  setSearchOpen,
  setIsOpen,
  searchTerm,
  setSearchTerm,
  currentCategoryId,
  inputRef,
  handleIconCodeClick,
}: SearchInputBarProps) {
  return (
    <div 
      onClick={handleIconCodeClick}
      className={`
        flex items-center rounded-full border border-[#00416A]/30 bg-transparent h-8 sm:h-10 shadow-sm 
        transition-all duration-300 cursor-pointer focus-within:border-[#00416A]
        ${
          searchOpen 
            ? "w-28 sm:w-36 md:w-44 px-2 sm:px-3 border-[#00416A]" 
            : "w-8 sm:w-10 justify-center px-0 hover:border-[#a5abaf] hover:bg-gray-200/60"
        }
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
          bg-transparent text-[11px] sm:text-xs text-slate-700 outline-none placeholder:text-slate-400 transition-all duration-300
          ${searchOpen ? "w-full opacity-100 px-1" : "w-0 opacity-0 pointer-events-none"}
        `}
      />
      <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00416A] shrink-0" />
    </div>
  );
}
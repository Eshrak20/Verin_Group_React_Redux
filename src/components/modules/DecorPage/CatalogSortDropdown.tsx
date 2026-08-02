


import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { SORT_OPTIONS, type SortOption } from "@/hooks/useProductCatalog";

interface CatalogSortDropdownProps {
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  isSortOpen: boolean;
  setIsSortOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function CatalogSortDropdown({
  sortBy,
  setSortBy,
  isSortOpen,
  setIsSortOpen,
  dropdownRef,
}: CatalogSortDropdownProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="
          flex items-center justify-between gap-2.5
          w-full sm:w-auto min-w-42.5
          bg-white dark:bg-slate-800
          border border-gray-200 dark:border-gray-700
          hover:border-gray-400 dark:hover:border-gray-500
          text-gray-800 dark:text-gray-200
          py-2 px-4
          rounded-full
          text-xs sm:text-sm font-medium
          shadow-sm hover:shadow
          transition-all duration-200
          cursor-pointer
        "
      >
        <span className="flex items-center gap-2 truncate">
          <SlidersHorizontal size={14} className="text-gray-500" />
          <span>{sortBy}</span>
        </span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform duration-200 ${
            isSortOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isSortOpen && (
        <div className="absolute right-0 top-full mt-2 w-full sm:w-52 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl py-1.5 z-30 transition-all duration-200">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSortBy(option);
                setIsSortOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm text-left font-medium transition-colors
                ${
                  sortBy === option
                    ? "text-[#00416A] dark:text-blue-400 bg-gray-50 dark:bg-slate-700/50"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/30"
                }
              `}
            >
              <span>{option}</span>
              {sortBy === option && (
                <Check size={14} className="text-[#00416A] dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
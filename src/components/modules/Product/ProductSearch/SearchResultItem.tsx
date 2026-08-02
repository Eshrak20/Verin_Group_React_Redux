/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/Product/SearchResultItem.tsx

import { Link } from "react-router-dom";

interface SearchResultItemProps {
  product: any;
  setIsOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
}

export default function SearchResultItem({
  product,
  setIsOpen,
  setSearchOpen,
  setSearchTerm,
}: SearchResultItemProps) {
  const firstVariant = product.variants?.[0];
  const firstImage = firstVariant?.images?.[0]?.image_url;
  
  const imageUrl = product.thumbnail || firstImage || "https://via.placeholder.com/150";
  const price = firstVariant?.price || product.price || 0;
  const sku = firstVariant?.sku || `PD-00${product.id}`;

  return (
    <Link
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
}
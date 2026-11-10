import type { Product } from "@/types/product.type";
import React from "react";
import { Link } from "react-router";

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(price);

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const variant = product.variant;

  const originalPrice = Number(variant?.price ?? 0);
  const salePrice = Number(variant?.sale_price ?? 0);

  const hasDiscount =
    salePrice > 0 &&
    originalPrice > 0 &&
    salePrice < originalPrice;

  const displayPrice = hasDiscount ? salePrice : originalPrice;
  const savingsAmount = hasDiscount
    ? originalPrice - salePrice
    : 0;

  const imageUrl =
    variant?.images?.find(
      (image) => typeof image === "string" && image.trim() !== "",
    ) ?? "/placeholder.png";

  return (
    <Link
      to={`/electronics/products/${product.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-lg border cursor-pointer border-gray-100 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg"
    >
      {/* Full Container Image Section */}
      <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-[#f4f5f7]">
        {hasDiscount && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-elec py-1.5 text-center text-xs font-semibold text-white shadow-sm">
            Save ৳{" "}
            <span className="text-yellow-400 text-[14px] font-bold">
              {formatPrice(savingsAmount)}
            </span>{" "}
            Today! ⚡
          </div>
        )}

        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/placeholder.png";
          }}
        />
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col justify-between p-4 bg-white">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-800">
          {product.name}
        </h3>

        {/* Price & Discount */}
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          {displayPrice > 0 ? (
            <span className="text-lg font-bold text-elec">
              ৳{formatPrice(displayPrice)}
            </span>
          ) : (
            <span className="text-sm text-gray-500">
              Price unavailable
            </span>
          )}

          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ৳{formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
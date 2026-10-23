
import type { ProductDetailsVariant } from "@/types/product.type";
import {
    Barcode,
    Check,
    Copy,
    Info,
    MessageCircle,
    PackageCheck,
    PackageX,
    Truck,
} from "lucide-react";
import { useState } from "react";

interface ElecProdDetInfoProps {
  name: string;
  variants: ProductDetailsVariant[];
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(price);

const getPrice = (price: string | number | undefined | null) =>
  Number(price ?? 0);

export default function ElecProdDetInfo({
  name,
  variants,
}: ElecProdDetInfoProps) {
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Support variants arriving asynchronously from the API.
  const activeVariant =
    variants.find((variant) => variant.sku === selectedSku) ??
    variants[0];

  const originalPrice = getPrice(activeVariant?.price);
  const salePrice = getPrice(activeVariant?.sale_price);

  const hasDiscount =
    salePrice > 0 && salePrice < originalPrice;

  const displayPrice = hasDiscount ? salePrice : originalPrice;

  // The backend returns status as 1 or 0 and stock as a number.
  const variantWithStock = activeVariant as
    | (ProductDetailsVariant & {
        stock?: number;
        status?: number | boolean;
      })
    | undefined;

  const stock = Number(variantWithStock?.stock ?? 0);
  const isActive =
    variantWithStock?.status === undefined ||
    variantWithStock.status === 1 ||
    variantWithStock.status === true;

  const inStock = isActive && stock > 0;

  const handleCopySku = async () => {
    if (!activeVariant?.sku) return;

    try {
      await navigator.clipboard.writeText(activeVariant.sku);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const phoneNumber = "8801805734585";

    const message = [
      `I'm interested in this product: ${name}`,
      `SKU: ${activeVariant?.sku ?? "N/A"}`,
      `Price: ৳${formatPrice(displayPrice)}`,
      activeVariant?.attributes
        ?.map((attribute) => `${attribute.name}: ${attribute.value}`)
        .join(", "),
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      {/* Product title and selected price */}
      <div>
        <h1 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl lg:text-3xl">
          {name}
        </h1>

        <div className="mt-3 flex flex-wrap items-baseline gap-2 sm:gap-3">
          <span className="text-2xl font-extrabold text-elec sm:text-3xl">
            ৳{formatPrice(displayPrice)}
          </span>

          {hasDiscount && (
            <>
              <span className="text-base text-gray-400 line-through">
                ৳{formatPrice(originalPrice)}
              </span>

              <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                Save ৳{formatPrice(originalPrice - salePrice)}
              </span>
            </>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Select your preferred configuration below.
        </p>
      </div>

      {/* Variant selection */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-gray-900 sm:text-base">
            Available Configurations
          </h2>

          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {variants.length} {variants.length === 1 ? "option" : "options"}
          </span>
        </div>

        {variants.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {variants.map((variant) => {
              const isSelected = variant.sku === activeVariant?.sku;

              const variantPrice = getPrice(variant.price);
              const variantSalePrice = getPrice(variant.sale_price);

              const variantHasDiscount =
                variantSalePrice > 0 &&
                variantSalePrice < variantPrice;

              const variantDisplayPrice = variantHasDiscount
                ? variantSalePrice
                : variantPrice;

              const variantStockInfo = variant as ProductDetailsVariant & {
                stock?: number;
                status?: number | boolean;
              };

              const variantStock = Number(variantStockInfo.stock ?? 0);

              const variantIsActive =
                variantStockInfo.status === undefined ||
                variantStockInfo.status === 1 ||
                variantStockInfo.status === true;

              const variantInStock =
                variantIsActive && variantStock > 0;

              return (
                <button
                  key={variant.sku}
                  type="button"
                  onClick={() => {
                    setSelectedSku(variant.sku);
                    setCopied(false);
                  }}
                  aria-pressed={isSelected}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-elec bg-elec/5 ring-1 ring-elec"
                      : "border-gray-200 bg-white hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Selection indicator */}
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-elec bg-elec text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      {/* Attribute options */}
                      <div className="flex flex-wrap gap-2">
                        {variant.attributes?.map((attribute) => (
                          <span
                            key={`${attribute.id}-${attribute.value_id}`}
                            className={`rounded-md px-2.5 py-1 text-xs font-semibold sm:text-sm ${
                              isSelected
                                ? "bg-white text-gray-900 ring-1 ring-elec/20"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span className="text-gray-500">
                              {attribute.name}:
                            </span>{" "}
                            {attribute.value}
                          </span>
                        ))}
                      </div>

                      {/* SKU and availability */}
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Barcode className="h-3.5 w-3.5" />
                          {variant.sku}
                        </span>

                        <span
                          className={`flex items-center gap-1 text-xs font-semibold ${
                            variantInStock
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          {variantInStock ? (
                            <PackageCheck className="h-3.5 w-3.5" />
                          ) : (
                            <PackageX className="h-3.5 w-3.5" />
                          )}

                          {variantInStock
                            ? `${variantStock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>

                    {/* Price per configuration */}
                    <div className="shrink-0 text-right">
                      <p
                        className={`text-base font-extrabold sm:text-lg ${
                          isSelected ? "text-elec" : "text-gray-900"
                        }`}
                      >
                        ৳{formatPrice(variantDisplayPrice)}
                      </p>

                      {variantHasDiscount && (
                        <p className="text-xs text-gray-400 line-through">
                          ৳{formatPrice(variantPrice)}
                        </p>
                      )}

                      {isSelected && (
                        <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wide text-elec">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
            No configurations are currently available.
          </p>
        )}
      </section>

      {/* Selected variant status */}
      {activeVariant && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3.5">
            <Info className="h-5 w-5 shrink-0 text-elec" />

            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400">STATUS</p>
              <p
                className={`text-sm font-bold ${
                  inStock ? "text-green-700" : "text-red-600"
                }`}
              >
                {inStock ? "In Stock" : "Unavailable"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySku}
            disabled={!activeVariant.sku}
            className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-200 p-3.5 text-left transition-colors hover:border-elec disabled:cursor-not-allowed"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Barcode className="h-5 w-5 shrink-0 text-elec" />

              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400">SKU</p>
                <p className="truncate text-sm font-bold text-gray-800">
                  {activeVariant.sku || "N/A"}
                </p>
              </div>
            </div>

            {copied ? (
              <Check className="h-4 w-4 shrink-0 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-elec" />
            )}
          </button>
        </div>
      )}

      {/* Purchase actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          disabled={!inStock}
          className="rounded-xl border border-gray-300 px-3 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to Wishlist
        </button>

        <button
          type="button"
          disabled={!inStock}
          className="rounded-xl border border-elec px-3 py-3 text-sm font-semibold text-elec transition-colors hover:bg-elec/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add To Cart
        </button>

        <button
          type="button"
          disabled={!inStock}
          className="rounded-xl bg-elec px-3 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-elec/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>

      {/* WhatsApp */}
      <button
        type="button"
        onClick={handleWhatsAppRedirect}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50"
      >
        <MessageCircle className="h-5 w-5" />
        Ask About This Product on WhatsApp
      </button>

      <p className="flex items-center justify-center gap-2 text-center text-xs text-gray-500">
        <Truck className="h-4 w-4" />
        Contact us for delivery and availability details.
      </p>
    </div>
  );
}

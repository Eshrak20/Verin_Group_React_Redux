import type { ProductDetailsVariant } from "@/types/product.type";
import {
  Barcode,
  Check,
  Copy,
  Info,
  MessageCircle,
  Truck
} from "lucide-react";
import { useMemo, useState } from "react";

export interface DeliveryChargeInfo {
  id?: number;
  name?: string;
  description?: string | null;
  inside_dhaka_charge?: number | string;
  outside_dhaka_charge?: number | string;
}

interface ElecProdDetInfoProps {
  name: string;
  variants: ProductDetailsVariant[];
  deliveryCharge?: DeliveryChargeInfo | null;
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
  deliveryCharge,
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

  // Stock status logic
  const inStock = isActive && stock > 0;

  let stockStatusText = "Out of Stock";
  let stockStatusColor = "text-red-600";

  if (isActive && stock > 5) {
    stockStatusText = "In Stock";
    stockStatusColor = "text-green-700";
  } else if (isActive && stock > 0 && stock <= 9) {
    stockStatusText = `Limited Stock`;
    stockStatusColor = "text-amber-600";
  }

  // Delivery Charge Logic
  const insideCharge = Number(deliveryCharge?.inside_dhaka_charge ?? 0);
  const outsideCharge = Number(deliveryCharge?.outside_dhaka_charge ?? 0);

  const isFreeDelivery =
    deliveryCharge !== undefined &&
    deliveryCharge !== null &&
    insideCharge === 0 &&
    outsideCharge === 0;

  // RAM size, Color এবং Internal Storage সবসময় দেখাবে (কমন হলেও বাদ যাবে না)
  const alwaysShowAttributes = ["ram size", "color", "internal storage"];

  // ফিল্টার লজিক
  const filteredVariantsAttributes = useMemo(() => {
    if (!variants || variants.length <= 1) return variants;

    const attributeKeys = variants[0]?.attributes?.map(attr => attr.name) ?? [];
    const commonAttributeNames = new Set<string>();

    attributeKeys.forEach(attrName => {
      const lowerAttrName = attrName.toLowerCase();
      if (alwaysShowAttributes.some(item => lowerAttrName.includes(item))) {
        return;
      }

      const firstValue = variants[0]?.attributes?.find(attr => attr.name === attrName)?.value;
      const isAllSame = variants.every(variant => {
        const val = variant.attributes?.find(attr => attr.name === attrName)?.value;
        return val === firstValue;
      });

      if (isAllSame) {
        commonAttributeNames.add(attrName);
      }
    });

    return variants.map(variant => ({
      ...variant,
      attributes: variant.attributes?.filter(attr => !commonAttributeNames.has(attr.name))
    }));
  }, [alwaysShowAttributes, variants]);

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

  // স্ক্রিনশটের ফরম্যাট অনুযায়ী WhatsApp মেসেজ হ্যান্ডলার
  const handleWhatsAppRedirect = () => {
    const phoneNumber = "8801805734585";
    const currentUrl = window.location.href;

    const message = [
      `Hello, I am interested in this product.`,
      ``,
      `Product Name: ${name}`,
      `Price: TK ${formatPrice(displayPrice)}.00`,
      `Product URL: ${currentUrl}`,
      ``,
      `Please provide more details.`,
    ].join("\n");

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

        {filteredVariantsAttributes.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredVariantsAttributes.map((variant) => {
              const isSelected = variant.sku === activeVariant?.sku;

              const variantPrice = getPrice(variant.price);
              const variantSalePrice = getPrice(variant.sale_price);

              const variantHasDiscount =
                variantSalePrice > 0 &&
                variantSalePrice < variantPrice;

              const variantDisplayPrice = variantHasDiscount
                ? variantSalePrice
                : variantPrice;

              return (
                <button
                  key={variant.sku}
                  type="button"
                  onClick={() => {
                    setSelectedSku(variant.sku);
                    setCopied(false);
                  }}
                  aria-pressed={isSelected}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${isSelected
                      ? "border-elec bg-elec/5 ring-1 ring-elec"
                      : "border-gray-200 bg-white hover:border-gray-400"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Selection indicator */}
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected
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
                            className={`rounded-md px-2.5 py-1 text-xs font-semibold sm:text-sm ${isSelected
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

                      {/* SKU */}
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Barcode className="h-3.5 w-3.5" />
                          {variant.sku}
                        </span>
                      </div>
                    </div>

                    {/* Price per configuration */}
                    <div className="shrink-0 text-right">
                      <p
                        className={`text-base font-extrabold sm:text-lg ${isSelected ? "text-elec" : "text-gray-900"
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
              <p className={`text-sm font-bold ${stockStatusColor}`}>
                {stockStatusText}
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

      {/* Delivery Charges Section */}
      {deliveryCharge && (
        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-elec" />
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Delivery Charge
              </span>
            </div>

            {isFreeDelivery && (
              <span className="rounded-full bg-green-100 px-3.5 py-1 text-sm font-extrabold text-green-700 border border-green-200">
                Free Delivery
              </span>
            )}
          </div>

          {!isFreeDelivery && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-3 border border-gray-200/90 shadow-2xs">
                <span className="text-gray-500 block text-xs font-medium">Inside Dhaka</span>
                <span className="text-lg sm:text-xl font-extrabold text-gray-900">
                  ৳{formatPrice(insideCharge)}
                </span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-gray-200/90 shadow-2xs">
                <span className="text-gray-500 block text-xs font-medium">Outside Dhaka</span>
                <span className="text-lg sm:text-xl font-extrabold text-gray-900">
                  ৳{formatPrice(outsideCharge)}
                </span>
              </div>
            </div>
          )}
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
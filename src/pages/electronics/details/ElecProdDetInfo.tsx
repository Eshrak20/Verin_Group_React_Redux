import type { ProductDetailsVariant } from "@/types/product.type";
import { Barcode, Check, Copy, Info, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ElecProdDetInfoProps {
    name: string;
    variants: ProductDetailsVariant[];
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(price);

export default function ElecProdDetInfo({ name, variants }: ElecProdDetInfoProps) {
    const [copied, setCopied] = useState(false);
    const activeVariant = variants[0];

    const originalPrice = Number(activeVariant?.price ?? 0);
    const salePrice = Number(activeVariant?.sale_price ?? 0);
    const displayPrice = salePrice > 0 ? salePrice : originalPrice;

    // Copy SKU handler
    const handleCopySku = () => {
        if (activeVariant?.sku) {
            navigator.clipboard.writeText(activeVariant.sku);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // WhatsApp Redirect handler (+880 18 0573 4585)
    const handleWhatsAppRedirect = () => {
        const phoneNumber = "8801805734585";
        const textMessage = encodeURIComponent(
            `I'm interested in this product: ${name}`
        );
        window.open(`https://wa.me/${phoneNumber}?text=${textMessage}`, "_blank");
    };

    return (
        <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            {/* Title & Price */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{name}</h1>
                <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-elec">
                        ৳{formatPrice(displayPrice)}
                    </span>
                    {salePrice > 0 && originalPrice > salePrice && (
                        <span className="text-base text-gray-400 line-through">
                            ৳{formatPrice(originalPrice)}
                        </span>
                    )}
                </div>
            </div>

            {/* Variants / Attributes Section */}
            <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4">
                {activeVariant?.attributes?.map((attr) => (
                    <div key={attr.id} className="flex items-center gap-3 text-sm">
                        <span className="font-semibold text-gray-700 min-w-20">{attr.name} :</span>
                        <span className="rounded-lg bg-gray-900 px-3 py-1.5 font-medium text-white shadow-sm">
                            {attr.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Status & SKU Grid (Full Width Side-by-Side) */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Status Box */}
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3.5 bg-white shadow-xs">
                    <Info className="h-5 w-5 text-elec shrink-0" />
                    <div className="text-xs">
                        <p className="text-gray-400 font-medium">STATUS</p>
                        <p className="font-bold text-gray-800 text-sm">In Stock</p>
                    </div>
                </div>

                {/* Copyable SKU Box */}
                <button
                    type="button"
                    onClick={handleCopySku}
                    className="flex items-center justify-between rounded-xl border border-gray-200 p-3.5 bg-white hover:border-elec transition-all cursor-pointer group shadow-xs text-left"
                >
                    <div className="flex items-center gap-3 text-xs truncate">
                        <Barcode className="h-5 w-5 text-elec shrink-0" />
                        <div className="truncate">
                            <p className="text-gray-400 font-medium">SKU</p>
                            <p className="font-bold text-gray-800 text-sm truncate">{activeVariant?.sku ?? "N/A"}</p>
                        </div>
                    </div>
                    {copied ? (
                        <Check className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                        <Copy className="h-4 w-4 text-gray-400 group-hover:text-elec shrink-0" />
                    )}
                </button>
            </div>

            {/* Main Cart & Purchase Buttons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button type="button" className="rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    Add to Wishlist
                </button>
                <button type="button" className="rounded-xl border border-elec py-3 font-semibold text-elec hover:bg-elec/5 transition-colors cursor-pointer">
                    Add To Cart
                </button>
                <button type="button" className="rounded-xl bg-elec py-3 font-semibold text-white hover:bg-elec/90 transition-colors cursor-pointer shadow-sm">
                    Buy Now
                </button>
            </div>

            {/* WhatsApp Action Button Only */}
            <button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 py-3 font-semibold text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
            >
                <MessageCircle className="h-5 w-5 fill-green-500 text-green-500" />
                Via WhatsApp
            </button>
        </div>
    );
}
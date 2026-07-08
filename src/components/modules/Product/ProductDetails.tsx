
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product, ProductVariant } from "@/types/product.type";
import AlsoLike from "./AlsoLike";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();

  const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
  const products: Product[] = response?.data || [];

  const product = products.find((item) => item.slug === slug);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      setSelectedVariant(defaultVariant);
      setSelectedImage(0);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="text-sm font-medium text-gray-400 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
      </div>
    );
  }

  const currentVariant = selectedVariant || product.variants?.[0];

  const price = Number(currentVariant?.price ?? 0);
  const salePrice = Number(currentVariant?.sale_price ?? 0);
  const hasDiscount = salePrice > 0 && salePrice < price;

  const discountPercent = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const productImages: string[] = currentVariant?.images && currentVariant.images.length > 0
    ? currentVariant.images.map((img) => img.image_url)
    : [product.thumbnail || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"];

  const whatsappNumber = "8801XXXXXXXXX";
  const whatsappMessage = encodeURIComponent(
    `Hello, I want to order this product:\n\nName: ${product.name}\nSKU: ${currentVariant?.sku || "N/A"}\nPrice: TK ${(hasDiscount ? salePrice : price).toLocaleString()}.00`
  );

  return (
    <section className="min-h-screen bg-[#FAF9F6] pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">

        {/* BACK TO CATALOG */}
        <div className="mb-10">
          <Link to="/decor" className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-gray-900 uppercase flex items-center gap-1.5">
            ← BACK TO CATALOG
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT - IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative rounded-[2rem] overflow-hidden bg-white">

              {/* Badges */}
              <div className="absolute top-5 left-5 z-10 flex flex-col gap-1">
                {product.is_featured === "1" && (
                  <span className="bg-[#FF5A00] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider uppercase">
                    HOT SELL
                  </span>
                )}
                <span className="bg-[#555E63] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider uppercase">
                  NEW
                </span>
                {discountPercent > 0 && (
                  <span className="bg-[#FF9900] text-black text-[9px] font-extrabold px-2.5 py-1 rounded-xs tracking-wider">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              <img
                src={productImages[selectedImage] || product.thumbnail || ""}
                alt={product.name}
                className="w-full h-auto block object-cover aspect-square rounded-[2rem]"
              />
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-3 px-1">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-xl overflow-hidden bg-white p-0.5 border transition-all ${selectedImage === index ? "border-gray-900 scale-95" : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - INFO SECTION */}
          <div className="space-y-6 pt-2">

            {/* Category & SKU Line */}
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase font-mono">
              <span>{product.category?.name || "MINECRAFT"}</span>
              <span>•</span>
              <span>{currentVariant?.sku || "PSG-TL10"}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-5xl font-serif text-[#111111] leading-tight font-normal">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-bold text-gray-900 font-sans">
                TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-300 line-through font-sans">
                  TK {price.toLocaleString()}.00
                </span>
              )}
            </div>

            {/* Description (Rich Text rendered directly here like screenshot) */}


            <div className="space-y-4 max-w-xl">
              {product.short_description && (
                <div
                  className="
                         text-gray-600 text-sm leading-relaxed font-sans
                            [&_p]:my-1.5 [&_p]:text-gray-600
                            [&_ul]:my-3 [&_ul]:space-y-2.5 [&_ul]:pl-0 [&_ul]:list-none
                            [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:text-gray-500 [&_ul_li]:text-sm [&_ul_li]:leading-snug
                            [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-1.75
                            [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:rounded-full
                            [&_ul_li]:before:bg-stone-400
                            [&_strong]:text-gray-900 [&_strong]:font-bold
                            [&_em]:italic
                          "
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {product.description && (
                <div
                  className="
                    text-gray-600 text-sm leading-relaxed font-sans
                    [&_p]:my-1.5 [&_p]:text-gray-600
                    [&_ul]:my-3 [&_ul]:space-y-2.5 [&_ul]:pl-0 [&_ul]:list-none
                    [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:text-gray-500 [&_ul_li]:text-sm [&_ul_li]:leading-snug
                    [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-1.75
                    [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:rounded-full
                    [&_ul_li]:before:bg-stone-400
                    [&_strong]:text-gray-900 [&_strong]:font-bold
                    [&_em]:italic
                    [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
                    [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
                    [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
                  "
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>


            {/* Status and Direct Order Line */}
            <div className="flex items-center gap-5 pt-2 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-[#0D9444]">
                <span className="w-4 h-4 rounded-full bg-[#E8F7EE] flex items-center justify-center text-[10px]">✓</span>
                <span>In Stock</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 font-normal">
                <span>🏷️</span>
                <span>Direct Order</span>
              </div>
            </div>

            {/* Variant Options Selector (Shows only if multiple variants exist) */}
            {product.variants && product.variants.length > 1 && (
              <div className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setSelectedImage(0);
                      }}
                      className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${currentVariant?.id === v.id
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                        }`}
                    >
                      Option {idx + 1} ({v.sku})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buy Button */}
            <div className="pt-4 max-w-sm">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3.5 px-6 rounded-full font-bold tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all uppercase"
              >
                <ShoppingCart size={13} className="fill-white" />
                Buy Now On Whatsapp
              </a>
              <p className="text-[8px] font-mono tracking-widest text-gray-400 text-center mt-2.5 uppercase">
                Clicking this will open a prefilled whatsapp chat to process your order.
              </p>
            </div>

          </div>
        </div>

      </div>


      <AlsoLike
        subCategoryId={product.sub_category_id}
        currentSlug={product.slug}
      />

    </section>
  );
}



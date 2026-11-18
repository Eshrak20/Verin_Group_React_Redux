import { useGetElecProductDetailsQuery } from "@/redux/services/electronics/electronics.api";
import { useState } from "react";
import { useParams } from "react-router";
import ElecProdDetGallery from "./ElecProdDetGallery";
import ElecProdDetInfo from "./ElecProdDetInfo";
import ElecProdDetSpec from "./ElecProdDetSpec";

export default function ElecProductDetails() {
    const slug = useParams<{ slug: string }>().slug;
    const { data: response, isLoading } = useGetElecProductDetailsQuery(slug as string);
    const [selectedSku, setSelectedSku] = useState<string | null>(null);

    const product = response?.data;

    if (isLoading) {
        return <div className="mx-auto max-w-6xl px-4 py-12 text-center text-gray-500">Loading product details...</div>;
    }

    if (!product) {
        return <div className="mx-auto max-w-6xl px-4 py-12 text-center text-red-500">Product not found.</div>;
    }

    const variants = product.variants ?? [];
    const activeVariant =
        variants.find((variant) => variant.sku === selectedSku) ?? variants[0];

    const variantImages = activeVariant?.images ?? [];

    return (
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 lg:px-0">
            {/* Top Product Section */}
            <div className="mb-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                {/* Sticky Image Gallery Section */}
                <div className="sticky top-6">
                    <ElecProdDetGallery
                        key={activeVariant?.sku ?? "default"}
                        images={variantImages}
                        productName={product.name}
                    />
                </div>

                {/* Product Information Section */}
                <ElecProdDetInfo
                    productId={product.id}
                    category={product?.category?.name}
                    slug={product.slug}
                    name={product.name}
                    variants={variants}
                    selectedSku={activeVariant?.sku ?? null}
                    onSelectSku={setSelectedSku}
                    deliveryCharge={product?.delivery_charge}
                />
            </div>

            {/* Specifications & Warranty Section */}
            <ElecProdDetSpec descriptionHtml={product.description ?? ""} />
        </div>
    );
}
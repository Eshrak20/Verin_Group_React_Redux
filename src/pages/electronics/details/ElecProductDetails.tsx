import { useGetElecProductDetailsQuery } from "@/redux/services/electronics/electronics.api";
import { PageLoader } from "@/routes";
import { motion } from "framer-motion";
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
        return <PageLoader />;
    }

    if (!product) {
        return <div className="mx-auto max-w-6xl px-4 py-12 text-center text-red-500">Product not found.</div>;
    }

    const variants = product.variants ?? [];
    const activeVariant =
        variants.find((variant) => variant.sku === selectedSku) ?? variants[0];

    const variantImages = activeVariant?.images ?? [];

    return (
        <motion.div
            key={slug}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 lg:px-0"
        >
            {/* Top Product Section */}
            <div className="mb-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                {/* Sticky Image Gallery Section */}
                <motion.div
                    key={`left-${slug}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="lg:sticky lg:top-28"
                >
                    <ElecProdDetGallery
                        key={activeVariant?.sku ?? "default"}
                        images={variantImages}
                        productName={product.name}
                    />
                </motion.div>

                {/* Product Information Section */}
                <motion.div
                    key={`right-${slug}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
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
                </motion.div>
            </div>

            {/* Specifications & Warranty Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            >
                <ElecProdDetSpec descriptionHtml={product.description ?? ""} />
            </motion.div>
        </motion.div>
    );
}
import { useGetElecProductDetailsQuery } from "@/redux/services/electronics/electronics.api";
import { useParams } from "react-router";
import ElecProdDetGallery from "./ElecProdDetGallery";
import ElecProdDetInfo from "./ElecProdDetInfo";
import ElecProdDetSpec from "./ElecProdDetSpec";

export default function ElecProductDetails() {
    const slug = useParams<{ slug: string }>().slug;
    const { data: response, isLoading } = useGetElecProductDetailsQuery(slug as string);

    const product = response?.data;

    if (isLoading) {
        return <div className="mx-auto max-w-6xl px-4 py-12 text-center text-gray-500">Loading product details...</div>;
    }

    if (!product) {
        return <div className="mx-auto max-w-6xl px-4 py-12 text-center text-red-500">Product not found.</div>;
    }

    // Extract images from first variant
    const variantImages = product.variants?.[0]?.images ?? [];

    return (
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 lg:px-0">
            {/* Top Product Section */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 mb-10">
                {/* Sticky Image Gallery Section */}
                <div className="sticky top-6">
                    <ElecProdDetGallery images={variantImages} productName={product.name} />
                </div>

                {/* Product Information Section */}
                <ElecProdDetInfo productId={product.id} name={product.name} variants={product.variants ?? []} deliveryCharge={product?.delivery_charge} />
            </div>

            {/* Specifications & Warranty Section */}
            <ElecProdDetSpec descriptionHtml={product.description ?? ""} />
        </div>
    );
}
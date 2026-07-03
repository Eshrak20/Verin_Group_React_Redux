import Banner from "@/components/modules/DecorPage/Banner";
import FeaturedPieces from "@/components/modules/DecorPage/FeaturedPieces";
import ProductCatalog from "@/components/modules/DecorPage/ProductCatalog";

export default function DecorPage() {
    return (
        <div className="bg-[#f5f5f5]">
            <Banner />
            <FeaturedPieces />
            <ProductCatalog />
        </div>
    );
}
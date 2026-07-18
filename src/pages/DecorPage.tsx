import Banner from "@/components/modules/DecorPage/Banner";
import FeaturedPieces from "@/components/modules/DecorPage/FeaturedPieces";
import ProductCatalog from "@/components/modules/DecorPage/ProductCatalog";

export default function DecorPage() {
    return (
        <div className="">
            <Banner />
            <FeaturedPieces />
            <ProductCatalog />
        </div>
    );
}
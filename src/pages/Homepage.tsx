import Banner from "@/components/modules/HomePage/Banner";
import DecorFeaturedProducts from "@/components/modules/HomePage/DecorFeaturedProducts";
import ElectronicsFeaturedProducts from "@/components/modules/HomePage/ElectronicsFeaturedProducts";
import Logistics from "@/components/modules/HomePage/Logistics";
import OurBlogs from "@/components/modules/HomePage/OurBlogs";
import ShopByCategory from "@/components/modules/HomePage/ShopByCategory";


export default function Homepage() {
    return (
        <div>
            <div className="w-full bg-home px-4 lg:px-0">
                <Banner />
                <ShopByCategory />
                <DecorFeaturedProducts />
                <ElectronicsFeaturedProducts />
                <Logistics />
                <OurBlogs />
            </div>
        </div>
    );
}
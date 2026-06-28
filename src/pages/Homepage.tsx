import Banner from "@/components/modules/HomePage/Banner";
import DecorFeaturedProducts from "@/components/modules/HomePage/DecorFeaturedProducts";
import LaptopFeaturedProducts from "@/components/modules/HomePage/LaptopFeaturedProducts";
import Logistics from "@/components/modules/HomePage/Logistics";
import OurBlogs from "@/components/modules/HomePage/OurBlogs";
import ShopByCategory from "@/components/modules/HomePage/ShopByCategory";


export default function Homepage() {
    return (
        <div>
            <div
                className="absolute inset-0 -z-10 opacity-90"
                style={{
                    backgroundImage: "url('/bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "top center",
                    backgroundRepeat: "no-repeat",
                }}
            />

            <div className="w-full px-12">
                <Banner />
                <ShopByCategory />
                <DecorFeaturedProducts />
                <LaptopFeaturedProducts />
                <Logistics />
                <OurBlogs />
            </div>
        </div>
    );
}
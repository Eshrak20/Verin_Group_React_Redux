import Banner from "@/components/modules/HomePage/Banner";
import DecorFeaturedProducts from "@/components/modules/HomePage/DecorFeaturedProducts/DecorFeaturedProducts";
import ElectronicsFeaturedProducts from "@/components/modules/HomePage/ElectronicsFeaturedProducts/ElectronicsFeaturedProducts";
import OurBlogs from "@/components/modules/HomePage/Blogs/OurBlogs";
import ShopByCategory from "@/components/modules/HomePage/ShopByCategory/ShopByCategory";
import Clients from "@/components/modules/HomePage/OurClients/Clients";


export default function Homepage() {
    return (
        <div>
            <div className="w-full bg-home px-4 lg:px-0">
                <Banner />
                <ShopByCategory />
                <DecorFeaturedProducts />
                <ElectronicsFeaturedProducts />
                <Clients />
                <OurBlogs />
            </div>
        </div>
    );
}
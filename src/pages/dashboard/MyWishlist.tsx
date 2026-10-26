import { useAppSelector } from "@/redux/hooks";
import { useGetWishlistQuery } from "@/redux/services/wishlist/wishlist.api";
import { Eye, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("en-BD", {
        maximumFractionDigits: 0,
    }).format(Number(price));

interface GuestWishlistItem {
    id: number;
    name: string;
    slug: string;
    thumbnail: string | null;
    price: number;
    sale_price: number;
}

export default function MyWishlist() {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    // 🎯 Lazy initial state দিয়ে লোকাল স্টোরেজ থেকে পুরো প্রোডাক্ট অবজেক্টগুলো রিড করা
    const [guestWishlist, setGuestWishlist] = useState<GuestWishlistItem[]>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("guest_wishlist") || "[]");
        }
        return [];
    });

    // Logged-in ইউজারের জন্য RTK Query API কল
    const { data: response, isLoading } = useGetWishlistQuery(
        { page: 1, per_page: 20 },
        { skip: !isAuthenticated }
    );

    // গেস্ট ইউজারের উইশলিস্ট থেকে আইটেম রিমুভ করার হ্যান্ডলার
    const handleRemoveGuestItem = (productId: number) => {
        const updatedList = guestWishlist.filter((item) => item.id !== productId);
        setGuestWishlist(updatedList);
        localStorage.setItem("guest_wishlist", JSON.stringify(updatedList));
        toast.success("Product removed from wishlist");
    };

    if (isAuthenticated && isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
                Loading wishlist...
            </div>
        );
    }

    const savedItems = isAuthenticated ? response?.data?.items ?? [] : [];

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-0">
            {/* Page Title */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    My Wishlist
                </h1>
            </div>

            {/* 🎯 Logged In Wishlist Grid */}
            {isAuthenticated && savedItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {savedItems.map((item) => {
                        const product = item.product;
                        const primaryVariant = product.variants?.[0];
                        const price = Number(primaryVariant?.price ?? 0);
                        const salePrice = Number(primaryVariant?.sale_price ?? 0);
                        const hasDiscount = salePrice > 0 && salePrice < price;
                        const displayPrice = hasDiscount ? salePrice : price;
                        const imageUrl = primaryVariant?.thumbnail || product.thumbnail || "/placeholder.png";
                        const productUrl =
                            product.category_id === 2
                                ? `/electronics/${product.slug}`
                                : `/products/${product.slug}`;

                        return (
                            <div
                                key={item.id}
                                className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                {/* Image & Overlay Action Buttons */}
                                <div className="relative w-full h-60 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                                    <Link to={productUrl} className="h-full w-full flex items-center justify-center">
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </Link>

                                    {/* Top-Right Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveGuestItem(item.id)}
                                        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-all hover:bg-black hover:scale-110 shadow-md"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    {/* Floating Action Buttons */}
                                    <div className="absolute right-3 bottom-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Link
                                            to={productUrl}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-primary hover:scale-110 transition-all"
                                            title="Quick View"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => toast.success("Added to cart!")}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-primary hover:scale-110 transition-all"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Buy Now Button */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Link
                                            to={productUrl}
                                            className="px-4 py-1.5 bg-white text-gray-900 font-semibold text-xs rounded-full shadow-md hover:bg-gray-100 hover:scale-105 transition-all"
                                        >
                                            Buy Now
                                        </Link>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col flex-1 justify-between">
                                    <div>
                                        <Link
                                            to={productUrl}
                                            className="font-semibold text-gray-800 text-sm line-clamp-1 hover:text-primary transition-colors"
                                        >
                                            {product.name}
                                        </Link>

                                        <div className="mt-1.5 flex items-baseline gap-2">
                                            <span className="text-base font-extrabold text-gray-900">
                                                ৳{formatPrice(displayPrice)}
                                            </span>
                                            {hasDiscount && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ৳{formatPrice(price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 🎯 Guest Mode Wishlist Grid */}
            {!isAuthenticated && guestWishlist.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {guestWishlist.map((item) => {
                        const hasDiscount = item.sale_price > 0 && item.sale_price < item.price;
                        const displayPrice = hasDiscount ? item.sale_price : item.price;
                        const imageUrl = item.thumbnail || "/placeholder.png";
                        const productUrl = `/products/${item.slug}`;

                        return (
                            <div
                                key={item.id}
                                className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                {/* Image & Overlay Action Buttons */}
                                <div className="relative w-full h-60 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                                    <Link to={productUrl} className="h-full w-full flex items-center justify-center">
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </Link>

                                    {/* Top-Right Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveGuestItem(item.id)}
                                        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-all hover:bg-black hover:scale-110 shadow-md"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    {/* Floating Action Buttons */}
                                    <div className="absolute right-3 bottom-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Link
                                            to={productUrl}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-primary hover:scale-110 transition-all"
                                            title="Quick View"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => toast.success("Added to cart!")}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-primary hover:scale-110 transition-all"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Buy Now Button */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Link
                                            to={productUrl}
                                            className="px-4 py-1.5 bg-white text-gray-900 font-semibold text-xs rounded-full shadow-md hover:bg-gray-100 hover:scale-105 transition-all whitespace-nowrap"
                                        >
                                            Buy Now
                                        </Link>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col flex-1 justify-between">
                                    <div>
                                        <Link
                                            to={productUrl}
                                            className="font-semibold text-gray-800 text-sm line-clamp-1 hover:text-primary transition-colors"
                                        >
                                            {item.name}
                                        </Link>

                                        <div className="mt-1.5 flex items-baseline gap-2">
                                            <span className="text-base font-extrabold text-gray-900">
                                                ৳{formatPrice(displayPrice)}
                                            </span>
                                            {hasDiscount && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ৳{formatPrice(item.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {((isAuthenticated && savedItems.length === 0) || (!isAuthenticated && guestWishlist.length === 0)) && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-2xs mt-4">
                    <p className="text-gray-500 text-base font-medium mb-4">Your wishlist is empty.</p>
                    <Link
                        to="/electronics"
                        className="inline-block px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl text-sm hover:bg-gray-800 transition-colors"
                    >
                        Explore Products
                    </Link>
                </div>
            )}
        </div>
    );
}
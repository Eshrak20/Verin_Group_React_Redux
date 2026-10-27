import type { ProductDetailsVariant } from "@/types/product.type";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CartItem {
    id: number;
    name: string;
    category?: string;
    slug?: string;
    sku?: string;
    stock: number;
    price: number;
    sale_price: number;
    thumbnail?: string | null;
    quantity: number;
    attributes?: Array<{ name: string; value: string }>;
}

interface AddToCartActionButtonProps {
    productId: number;
    name: string;
    category?: string;
    slug?: string;
    activeVariant: ProductDetailsVariant;
    originalPrice: number;
    salePrice: number;
    thumbnail?: string | null;
    inStock: boolean;
}

export default function AddToCartActionButton({
    productId,
    name,
    category,
    slug,
    activeVariant,
    originalPrice,
    salePrice,
    thumbnail,
    inStock,
}: AddToCartActionButtonProps) {

    // console.log(activeVariant.sku);

    const navigate = useNavigate();
    const location = useLocation()
    const isElectronicsPage = location.pathname.startsWith("/electronics")

    const handleAddToCart = (isBuyNow: boolean = false) => {
        if (!inStock) {
            toast.error("Product is out of stock.");
            return;
        }

        const cartItem: CartItem = {
            id: productId,
            name,
            category,
            slug: slug || `product-${productId}`,
            sku: activeVariant?.sku || "N/A",
            stock: Number(activeVariant?.stock ?? 0),
            price: originalPrice,
            sale_price: salePrice,
            thumbnail,
            quantity: 1,
            attributes: activeVariant?.attributes || [],
        };

        const existingCart: CartItem[] = JSON.parse(localStorage.getItem("guest_cart") || "[]");

        // ভেরিয়েন্ট বা আইডি মিলিয়ে কার্টে অলরেডি আছে কি না চেক করা
        const existingIndex = existingCart.findIndex(
            (item) => item.id === productId && item.sku === cartItem.sku
        );

        if (existingIndex > -1) {
            existingCart[existingIndex].quantity += 1;
        } else {
            existingCart.push(cartItem);
        }

        localStorage.setItem("guest_cart", JSON.stringify(existingCart));

        // কার্ট আপডেট ইভেন্ট ট্রিগার করা যদি প্রয়োজন হয়
        window.dispatchEvent(new Event("storage"));

        if (isBuyNow) {
            toast.success("Proceeding to checkout...");
            navigate("/checkout"); // অথবা আপনার কার্ট/চেকআউট রুট
        } else {
            toast.success("Product added to cart successfully!");
        }
    };

    return (
        <>
            <button
                type="button"
                disabled={!inStock}
                onClick={() => handleAddToCart(false)}
                className={`${isElectronicsPage ? "border-elec text-elec hover:bg-elec/5" : "border-primary text-primary hover:bg-primary/5"} rounded-xl border  px-3 py-3 text-sm font-semibold  transition-colors  disabled:cursor-not-allowed disabled:opacity-50`}
            >
                Add To Cart
            </button>

            <button
                type="button"
                disabled={!inStock}
                onClick={() => handleAddToCart(true)}
                className={`${isElectronicsPage ? "bg-elec hover:bg-elec/90" : "bg-primary hover:bg-primary/90"} rounded-xl  px-3 py-3 text-sm font-semibold text-white shadow-sm transition-colors  disabled:cursor-not-allowed disabled:opacity-50`}
            >
                Buy Now
            </button>
        </>
    );
}
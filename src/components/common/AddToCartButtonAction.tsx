import type { ProductDeliveryCharge, ProductDetailsVariant } from "@/types/product.type";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CartItem {
    id: number;
    name: string;
    category?: string;
    slug?: string;
    sku?: string;
    stock: number;
    deliveryCharge?: ProductDeliveryCharge
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
    deliveryCharge?: ProductDeliveryCharge
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
    deliveryCharge
}: AddToCartActionButtonProps) {

    
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
            deliveryCharge,
            price: originalPrice,
            sale_price: salePrice,
            thumbnail,
            quantity: 1,
            attributes: activeVariant?.attributes || [],
        };

        const existingCart: CartItem[] = JSON.parse(localStorage.getItem("guest_cart") || "[]");

        const existingIndex = existingCart.findIndex(
            (item) => item.id === productId && item.sku === cartItem.sku
        );

        if (existingIndex > -1) {
            existingCart[existingIndex].quantity += 1;
        } else {
            existingCart.push(cartItem);
        }

        localStorage.setItem("guest_cart", JSON.stringify(existingCart));

        window.dispatchEvent(new Event("storage"));

        if (isBuyNow) {
            toast.success("Proceeding to checkout...");
            navigate("/checkout");
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
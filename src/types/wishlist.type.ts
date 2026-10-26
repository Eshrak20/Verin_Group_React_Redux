// Product Variant Type
export interface ProductWishlistVariant {
    id: number;
    product_id: number;
    sku: string;
    price: string;
    sale_price: string;
    thumbnail: string | null;
    status: number | boolean;
    stock: number;
    created_at: string;
    updated_at: string;
    inventories?: Array<{
        id: number;
        branch_id: number;
        product_variant_id: number;
        stock: number;
        reserved_stock: number;
        low_stock_alert: number;
        created_at: string;
        updated_at: string;
    }>;
}

// Delivery Charge Type
export interface DeliveryCharge {
    id: number;
    name: string;
    inside_dhaka_charge: number;
    outside_dhaka_charge: number;
    description: string | null;
    status: boolean;
    created_at: string;
    updated_at: string;
}

// Product Details Type (GET /saved-products এর ভেতরের প্রোডাক্ট অবজেক্ট)
export interface WishlistProduct {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    description: string;
    thumbnail: string | null;
    is_featured: boolean;
    status: boolean;
    category_id: number;
    sub_category_id: number;
    brand_id: number;
    delivery_charge_id: number;
    delivery_charge: DeliveryCharge;
    variants?: ProductWishlistVariant[];
    created_at: string;
    updated_at: string;
}

// GET /saved-products Item Type
export interface WishlistItem {
    id: number;
    saved_at: string;
    product: WishlistProduct;
}

// Pagination Type
export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more_pages: boolean;
}

// POST /saved-products Response Data Type
export interface AddToWishlistData {
    id: number;
    product_id: number;
    saved_at: string;
    is_saved: boolean;
}

// GET /saved-products Response Data Type
export interface GetWishlistData {
    items: WishlistItem[];
    pagination: PaginationMeta;
}

// 🎯 Main Unified Wishlist Response Type (Both for POST and GET)
export interface WishlistResponse {
    success: boolean;
    message: string;
    code: number;
    data: AddToWishlistData | GetWishlistData;
}
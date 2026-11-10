export interface SavedProductDeliveryCharge {
    id: number;
    name: string;
    inside_dhaka_charge: number;
    outside_dhaka_charge: number;
}

export interface SavedProductItem {
    saved_product_id: number;
    product_id: number;
    name: string;
    slug: string;
    image: string | null;
    category_name: string;
    subcategory_name: string;
    brand_name: string | null;
    sku: string;
    price: number;
    sale_price: number;
    available_stock: number;
    in_stock: boolean;
    delivery_charge: SavedProductDeliveryCharge;
    is_featured: boolean;
}

export interface WishlistPagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface SavedProductsApiResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        products: SavedProductItem[];
        total_wishlist: number;
        pagination: WishlistPagination;
    };
}

export interface AddToWishlistResponse {
    success: boolean,
    message: string,
    code: number,
    data: {
        product_id: number,
        is_saved: boolean
    }
}
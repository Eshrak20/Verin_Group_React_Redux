export interface ProductListRequest {
    category_id: number;
    sub_category_id?: number | null;
    brand_id?: number | null;
    is_featured?: boolean | null;
    in_stock?: boolean | null;
    price_min?: number | null;
    price_max?: number | null;
    attributes?: Record<string, string[]>;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
}


export interface ProductListResponse {
    success: boolean;
    message: string;
    data: {
        filters: ProductFilter[];
        price: {
            min: number;
            max: number;
        };
        products: ProductListItem[];
        meta: ProductPagination;
    };
}

export interface ProductFilter {
    id: number;
    name: string;
    options: string[];
}

export interface ProductListItem {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    is_featured: boolean;
    status: boolean;
    stock: number;
    category: string;
    sub_category: string;
    brand: string;
    variant: ProductListVariant;
}

export interface ProductListVariant {
    sku: string;
    price: number;
    sale_price: number;
    images: string[];
}

export interface ProductPagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

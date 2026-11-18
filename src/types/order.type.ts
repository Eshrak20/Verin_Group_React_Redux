export interface CartItem {
  id: number;
  name: string;
  category: string;
  slug?: string;
  variantId: number;
  sku?: string;
  price: number;
  sale_price: number;
  thumbnail: string | null;
  quantity: number;
  stock: number;
  deliveryCharge?: {
    inside_dhaka_charge?: number;
    outside_dhaka_charge?: number;
  } | null;
  attributes?: Array<{ name: string; value: string }>;
}


export interface OrderItemRequest {
    product_variant_id: number;
    quantity: number;
}

// Order Request Payload Type
export interface CreateOrderRequest {
    customer_name: string;
    phone: string;
    email?: string;
    delivery_address: string;
    district: string;
    area: string;
    delivery_zone: "inside_dhaka" | "outside_dhaka";
    customer_note?: string;
    payment_method: "cod" | "online";
    payment_provider?: string;
    transaction_id?: string;
    items: OrderItemRequest[];
}

export interface OrderResponseItem {
    product_name: string;
    sku: string;
    unit_price: string;
    quantity: number;
    line_total: string;
}

export interface CreateOrderData {
    order_number: string;
    order_status: string;
    payment_method: string;
    payment_status: string;
    subtotal: string;
    delivery_charge: string;
    discount_amount: string;
    total_amount: string;
    payment_redirect_url?: string;
    items: OrderResponseItem[];
}

// Order Response Type (API Wrapper)
export interface CreateOrderResponse {
    success: boolean;
    message: string;
    code?: number;
    data: CreateOrderData;
}


export interface OrderItem {
    product_variant_id?: number;
    product_name: string;
    sku: string;
    unit_price: string;
    quantity: number;
    line_total: string;
}

export interface OrderListItem {
    order_number: string;
    order_status: string;
    payment_method: string;
    payment_status: string;
    subtotal: string;
    delivery_charge: string;
    discount_amount: string;
    total_amount: string;
    items_count: number;
    created_at: string;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more_pages: boolean;
}

export interface OrderListApiResponse {
    success: boolean;
    message: string;
    data: {
        orders: OrderListItem[];
        pagination: PaginationMeta;
    };
}

export interface OrderDetailsData {
    order_number: string;
    customer_name: string;
    phone: string;
    email: string;
    delivery_address: string;
    district: string;
    area: string;
    delivery_zone: string | null;
    customer_note: string | null;
    order_status: string;
    payment_method: string;
    payment_provider?: string;
    payment_status: string;
    subtotal: string;
    delivery_charge: string;
    discount_amount: string;
    total_amount: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
}

export interface OrderDetailsApiResponse {
    success: boolean;
    message: string;
    data: OrderDetailsData;
}
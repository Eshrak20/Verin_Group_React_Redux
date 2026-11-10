import OrderSummary from "@/components/common/OrderSummary";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface CartItem {
  id: number;
  name: string;
  category: string;
  slug?: string;
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

export default function MyCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  useEffect(() => {
    const loadCart = () => {
      const storedCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      setCartItems(storedCart);
      setSelectedItemIds(storedCart.map((item: CartItem) => item.id));
    };

    loadCart();

    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // Select All Toggle
  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItemIds(cartItems.map((item) => item.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  // Individual Item Select Toggle
  const handleToggleSelectItem = (id: number) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  const { selectedSubtotal, selectedTotalQuantity, selectedShippingFee } = useMemo(() => {
    let subtotal = 0;
    let totalQty = 0;
    let shipping = 0;

    cartItems.forEach((item) => {
      if (selectedItemIds.includes(item.id)) {
        const effectivePrice = item.sale_price > 0 && item.sale_price < item.price ? item.sale_price : item.price;
        subtotal += effectivePrice * item.quantity;
        totalQty += item.quantity;

        const itemShipping = item.deliveryCharge?.inside_dhaka_charge ?? 150;
        shipping += Number(itemShipping);
      }
    });

    return {
      selectedSubtotal: subtotal,
      selectedTotalQuantity: totalQty,
      selectedShippingFee: shipping,
    };
  }, [cartItems, selectedItemIds]);

  const handleUpdateQuantity = (index: number, delta: number) => {
    const updatedCart = [...cartItems];
    const currentItem = updatedCart[index];
    const newQty = currentItem.quantity + delta;

    if (newQty > currentItem.stock) {
      toast.error(`Sorry, only ${currentItem.stock} items available in stock.`);
      return;
    }

    if (newQty > 0) {
      updatedCart[index].quantity = newQty;
      setCartItems(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleRemoveItem = (item: CartItem, index: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to remove "${item.name}" from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl",
        title: "text-xl font-bold text-foreground",
        htmlContainer: "text-sm text-muted-foreground mt-2",
        actions: "flex items-center justify-center gap-3 mt-6 w-full",
        confirmButton: "rounded-lg bg-destructive px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-destructive/90",
        cancelButton: "rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storage"));
        setSelectedItemIds((prev) => prev.filter((id) => id !== item.id));
        toast.success("Item removed from cart");
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Clear entire cart?",
      text: "Are you sure you want to remove all items from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear cart!",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl",
        title: "text-xl font-bold text-foreground",
        htmlContainer: "text-sm text-muted-foreground mt-2",
        actions: "flex items-center justify-center gap-3 mt-6 w-full",
        confirmButton: "rounded-lg bg-destructive px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-destructive/90",
        cancelButton: "rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems([]);
        setSelectedItemIds([]);
        localStorage.removeItem("guest_cart");
        window.dispatchEvent(new Event("storage"));
        toast.success("Cart cleared successfully.");
      }
    });
  };

  const allowedAttributes = ["ram size", "color", "internal storage", "storage"];
  const getFilteredAttributes = (attributes?: Array<{ name: string; value: string }>) => {
    if (!attributes || attributes.length === 0) return [];
    return attributes.filter((attr) => {
      const lowerAttrName = attr.name.toLowerCase();
      return allowedAttributes.some((allowed) => lowerAttrName.includes(allowed));
    });
  };

  const handleProceedToCheckout = () => {
    if (selectedItemIds.length === 0) {
      toast.error("Please select at least one item to proceed to checkout.");
      return;
    }
    const selectedItems = cartItems.filter((item) => selectedItemIds.includes(item.id));
    navigate("/checkout", { state: { selectedItems, selectedItemIds } });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-0 min-h-[70vh] space-y-6">
      {/* Top Continue Shopping Link & Clear Cart */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Shopping Cart
        </h1>
        <div className="flex items-center gap-4">
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
          <Link
            to="/electronics"
            className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>

      {cartItems.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="size-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        /* Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items List */}
          <div className="space-y-4 lg:col-span-2">
            {/* Select All Bar */}
            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3">
              <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="size-4 rounded border-border accent-primary focus:ring-primary cursor-pointer"
                />
                <span>SELECT ALL ({cartItems.length} ITEM(S))</span>
              </label>
            </div>

            {/* Items Loop */}
            <div className="space-y-3">
              {cartItems.map((item, index) => {
                const hasDiscount = item.sale_price > 0 && item.sale_price < item.price;
                const displayPrice = hasDiscount ? item.sale_price : item.price;
                const itemTotal = displayPrice * item.quantity;
                const filteredAttributes = getFilteredAttributes(item.attributes);
                const isSelected = selectedItemIds.includes(item.id);

                const productUrl =
                  item.category === "Electronics"
                    ? `/electronics/products/${item.slug}`
                    : `/products/${item.slug}`;

                return (
                  <div
                    key={`${item.id}-${item.sku || index}`}
                    className={`relative flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between transition-colors ${isSelected ? "border-primary/60 bg-primary/5" : "border-border/75"
                      }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectItem(item.id)}
                        className="size-4 shrink-0 rounded border-border accent-primary focus:ring-primary cursor-pointer"
                      />

                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1">
                        <img
                          src={item.thumbnail || "/placeholder.png"}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <Link to={productUrl} className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-primary">
                          {item.name}
                        </Link>
                        {item.sku && item.sku !== "N/A" && (
                          <p className="text-xs text-gray-400 mt-0.5 font-mono">SKU: {item.sku}</p>
                        )}

                        {/* Filtered Attributes */}
                        {filteredAttributes.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {filteredAttributes.map((attr, attrIdx) => (
                              <span key={attrIdx} className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                                <span className="text-gray-400">{attr.name}:</span> {attr.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Quantity & Delete */}
                    <div className="flex items-center justify-between border-t border-border/50 pt-3 sm:flex-col sm:items-end sm:gap-2 sm:border-t-0 sm:pt-0">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-primary sm:text-base">
                          ৳{formatPrice(itemTotal)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item, index)}
                          className="flex size-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-lg border border-border bg-background shadow-2xs">
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={() => handleUpdateQuantity(index, -1)}
                          className="p-1.5 hover:bg-muted text-gray-600 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-xs font-semibold tabular-nums text-foreground">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(index, 1)}
                          className="p-1.5 hover:bg-muted text-gray-600 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
              Need help? Contact our support 24/7
            </div>
          </div>

          {/* Right: Order Summary (Reusable Component) */}
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={selectedSubtotal}
              totalItemsCount={selectedTotalQuantity}
              shippingFee={selectedShippingFee}
              onActionClick={handleProceedToCheckout}
              actionButtonText="PROCEED TO CHECKOUT"
              isActionDisabled={selectedItemIds.length === 0}
            />
          </div>
        </div>
      )}
    </div>
  );
}
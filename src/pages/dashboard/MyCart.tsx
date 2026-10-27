import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

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
  stock: number; // 🎯 স্টক ইনফরমেশন যুক্ত করা হলো
  attributes?: Array<{ name: string; value: string }>;
}

const formatPrice = (price: number | string) =>
  new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(Number(price));

export default function MyCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // লোকালস্টোরেজ থেকে কার্ট আইটেম লোড করা
  useEffect(() => {
    const loadCart = () => {
      const storedCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      setCartItems(storedCart);
    };

    loadCart();

    // উইন্ডো স্টোরেজ ইভেন্ট লিসেনার যাতে অন্য ট্যাব বা কম্পোনেন্ট থেকে আপডেট হলে এখানে রিফ্লেক্ট করে
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // 🎯 কোয়ান্টিটি আপডেট হ্যান্ডলার (স্টক লিমিটেড চেকসহ)
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

  // নির্দিষ্ট আইটেম কার্ট থেকে রিমুভ করা
  const handleRemoveItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
    toast.success("Item removed from cart");
  };

  // 🎯 শুধুমাত্র এই অ্যাট্রিবিউটগুলোই স্ক্রিনে দেখাবে, বাকিগুলো ফিল্টার হয়ে বাদ যাবে
  const allowedAttributes = ["ram size", "color", "internal storage", "storage"];

  const getFilteredAttributes = (attributes?: Array<{ name: string; value: string }>) => {
    if (!attributes || attributes.length === 0) return [];

    return attributes.filter((attr) => {
      const lowerAttrName = attr.name.toLowerCase();
      return allowedAttributes.some((allowed) => lowerAttrName.includes(allowed));
    });
  };

  // সাবটোটাল ক্যালকুলেশন
  const subtotal = cartItems.reduce((acc, item) => {
    const effectivePrice = item.sale_price > 0 && item.sale_price < item.price ? item.sale_price : item.price;
    return acc + effectivePrice * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-0 min-h-[70vh]">
      {/* Top Continue Shopping Link */}
      <div className="flex justify-end mb-6">
        <Link
          to="/electronics"
          className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
        >
          ← Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/electronics"
            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        /* Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Shopping Cart</h1>
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>
              <span className="text-xs text-gray-400">You have {totalItems} item in your cart</span>
            </div>

            {/* Table Header for Desktop */}
            <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items Loop */}
            <div className="divide-y divide-gray-100">
              {cartItems.map((item, index) => {
                const hasDiscount = item.sale_price > 0 && item.sale_price < item.price;
                const displayPrice = hasDiscount ? item.sale_price : item.price;
                const itemTotal = displayPrice * item.quantity;
                const filteredAttributes = getFilteredAttributes(item.attributes);

                const productUrl =
                  item.category === "Electronics"
                    ? `/electronics/${item.slug}`
                    : `/products/${item.slug}`;

                return (
                  <div key={`${item.id}-${item.sku || index}`} className="py-4 sm:grid sm:grid-cols-12 sm:items-center gap-4 flex flex-col">
                    {/* Product Info */}
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1">
                        <img
                          src={item.thumbnail || "/placeholder.png"}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link to={productUrl} className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-primary">
                          {item.name}
                        </Link>
                        {item.sku && (
                          <p className="text-xs text-gray-400 mt-0.5 font-mono">SKU: {item.sku}</p>
                        )}

                        {/* Filtered Attributes Display */}
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

                    {/* Price */}
                    <div className="col-span-2 text-left sm:text-center">
                      <span className="sm:hidden text-xs text-gray-400 mr-2">Price:</span>
                      <span className="text-sm font-bold text-gray-900">৳{formatPrice(displayPrice)}</span>
                      {hasDiscount && (
                        <span className="block text-xs text-gray-400 line-through">৳{formatPrice(item.price)}</span>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-2 flex items-center justify-start sm:justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(index, -1)}
                          className="p-1.5 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(index, 1)}
                          className="p-1.5 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Total & Delete */}
                    <div className="col-span-2 flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <span className="sm:hidden text-xs text-gray-400 mr-2">Total:</span>
                        <span className="text-sm font-extrabold text-primary">৳{formatPrice(itemTotal)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
              Need help? Contact our support 24/7
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">৳{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="text-xs text-gray-400">Calculated at checkout</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-primary">৳{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">VAT included where applicable</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  toast.success("Proceeding to checkout...");
                  navigate("/checkout");
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-4 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <div className="mt-6 space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Safe and Secure Checkout
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Original & Guaranteed Products
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
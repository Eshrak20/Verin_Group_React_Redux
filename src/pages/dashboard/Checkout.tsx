import OrderSummary from "@/components/common/OrderSummary";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useGetMyProfileQuery, useUpdateProfileMutation } from "@/redux/auth.api";
import { useAppSelector } from "@/redux/hooks";
import { useCreateOrderMutation } from "@/redux/services/order.api";
import { PageLoader } from "@/routes";
import type { CartItem } from "@/types/order.type";
import { Truck } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

const TRANSACTION_ID_LENGTHS: Record<string, number> = {
    bkash: 10,
    nagad: 8,
};

const validateTransactionId = (provider: string, rawTxnId: string): string | null => {
    const txnId = rawTxnId.trim();
    const expectedLength = TRANSACTION_ID_LENGTHS[provider];

    if (!txnId) {
        return "Transaction ID is required for online payment.";
    }

    if (expectedLength && txnId.length !== expectedLength) {
        const providerLabel = provider === "bkash" ? "bKash" : "Nagad";
        return `${providerLabel} Transaction ID must be ${expectedLength} characters long.`;
    }

    return null;
};

export const Checkout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedItemIds: number[] = location.state?.selectedItemIds ?? [];

    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    const [cartItems] = useState<CartItem[]>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("guest_cart") || "[]");
        }
        return [];
    });

    const { data: profileResponse, isLoading: isLoadingProfile } = useGetMyProfileQuery(undefined, {
        skip: !isAuthenticated,
    });

    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
    const [updateProfile] = useUpdateProfileMutation();

    const userData = profileResponse?.data?.user;
    const userProfile = userData?.profile;

    const selectedItems = cartItems.filter((item) => selectedItemIds.includes(item.id));

    const subtotal = selectedItems.reduce((acc, item) => {
        const effectivePrice = item.sale_price > 0 && item.sale_price < item.price ? item.sale_price : item.price;
        return acc + effectivePrice * item.quantity;
    }, 0);

    const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

    const insideDhakaFee = 150;
    const outsideDhakaFee = 200;

    const [formData, setFormData] = useState({
        customer_name: "",
        email: "",
        phone: "",
        delivery_address: "",
        district: "Dhaka",
        area: "",
        delivery_zone: "inside_dhaka",
        payment_method: "cod" as "cod" | "online",
        payment_provider: "bkash",
        transaction_id: "",
        customer_note: "",
    });

    const [transactionIdError, setTransactionIdError] = useState<string | null>(null);
    const [isAutofilled, setIsAutofilled] = useState(false);

    if (userData && !isAutofilled) {
        setFormData((prev) => ({
            ...prev,
            customer_name: userData.name || "",
            email: userData.email || "",
            phone: userProfile?.phone || "",
            delivery_address: userProfile?.address_line_1 || userProfile?.address_line_2 || "",
            district: userProfile?.state || "Dhaka",
            area: userProfile?.city || "",
        }));
        setIsAutofilled(true);
    }

    // Inside Dhaka এবং Outside Dhaka-এর জন্য quantity সহ মোট ডেলিভারি চার্জ
    const { totalInsideDhakaFee, totalOutsideDhakaFee } = useMemo(() => {
        return selectedItems.reduce(
            (acc, item) => {
                const insideCharge = Number(item.deliveryCharge?.inside_dhaka_charge ?? insideDhakaFee);
                const outsideCharge = Number(item.deliveryCharge?.outside_dhaka_charge ?? outsideDhakaFee);

                return {
                    totalInsideDhakaFee: acc.totalInsideDhakaFee + insideCharge * item.quantity,
                    totalOutsideDhakaFee: acc.totalOutsideDhakaFee + outsideCharge * item.quantity,
                };
            },
            { totalInsideDhakaFee: 0, totalOutsideDhakaFee: 0 }
        );
    }, [selectedItems]);

    const selectedShippingFee =
        formData.delivery_zone === "inside_dhaka" ? totalInsideDhakaFee : totalOutsideDhakaFee;

    const isFreeDelivery = selectedShippingFee === 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "transaction_id" && formData.payment_method === "online") {
            setTransactionIdError(validateTransactionId(formData.payment_provider, value));
        }
    };

    const handleProviderChange = (provider: string) => {
        setFormData((prev) => ({ ...prev, payment_provider: provider }));
        if (formData.payment_method === "online" && formData.transaction_id.trim()) {
            setTransactionIdError(validateTransactionId(provider, formData.transaction_id));
        } else {
            setTransactionIdError(null);
        }
    };

    const handlePlaceOrder = async () => {
        if (!formData.customer_name || !formData.phone || !formData.delivery_address) {
            toast.error("Please fill in all required fields (Name, Phone, Address).");
            return;
        }

        if (formData.payment_method === "online") {
            const txnError = validateTransactionId(formData.payment_provider, formData.transaction_id);
            if (txnError) {
                setTransactionIdError(txnError);
                toast.error(txnError);
                return;
            }
        }

        if (selectedItemIds.length === 0) {
            toast.error("No items selected for checkout.");
            navigate("/my-cart");
            return;
        }

        try {
            if (isAuthenticated && userData) {
                const isPhoneMissing = !userProfile?.phone && formData.phone;
                const isAddressMissing = !userProfile?.address_line_1 && formData.delivery_address;

                if (isPhoneMissing || isAddressMissing) {
                    await updateProfile({
                        name: formData.customer_name,
                        phone: formData.phone,
                        address_line_1: formData.delivery_address,
                        city: formData.area,
                        state: formData.district,
                    } as Parameters<typeof updateProfile>[0]).unwrap();
                }
            }

            const orderPayload = {
                customer_name: formData.customer_name,
                phone: formData.phone,
                email: formData.email || undefined,
                delivery_address: formData.delivery_address,
                district: formData.district,
                area: formData.area || "Mohammadpur",
                delivery_zone: formData.delivery_zone as "inside_dhaka" | "outside_dhaka",
                customer_note: formData.customer_note || undefined,
                payment_method: formData.payment_method,
                payment_provider: formData.payment_method === "online" ? formData.payment_provider : undefined,
                transaction_id: formData.payment_method === "online" ? formData.transaction_id.trim() : undefined,
                items: selectedItems.map((item) => ({
                    product_variant_id: item.variantId,
                    quantity: item.quantity,
                })),
            };
            const response = await createOrder(orderPayload).unwrap();

            const remainingCart = cartItems.filter((item) => !selectedItemIds.includes(item.id));
            localStorage.setItem("guest_cart", JSON.stringify(remainingCart));
            window.dispatchEvent(new Event("storage"));

            toast.success(response.message || "Order successfully placed!");

            if (!isAuthenticated) {
                navigate("/");
            } else {
                navigate(`/my-orders/${response.data?.order_number ?? ""}`);
            }
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    if (isAuthenticated && isLoadingProfile) {
        return <PageLoader />;
    }

    if (selectedItems.length === 0) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-16 text-center">
                <h2 className="text-xl font-bold text-foreground">No items selected for checkout</h2>
                <p className="mt-2 text-sm text-muted-foreground">Please select items from your cart before checking out.</p>
                <button
                    type="button"
                    onClick={() => navigate("/my-cart")}
                    className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground cursor-pointer"
                >
                    Return to Cart
                </button>
            </div>
        );
    }

    const expectedTxnLength = TRANSACTION_ID_LENGTHS[formData.payment_provider];

    return (
        <div className="mx-auto max-w-7xl px-4 pt-2 pb-8 sm:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-6">Checkout</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Billing Details Form */}
                <div className="lg:col-span-2 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
                    <h2 className="text-lg font-bold text-foreground border-b border-border/60 pb-3">
                        Billing Details
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Your Name *</label>
                            <input
                                type="text"
                                name="customer_name"
                                required
                                placeholder="Enter your full name"
                                value={formData.customer_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Mobile Number *</label>
                            <input
                                type="text"
                                name="phone"
                                required
                                placeholder="01814935430"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Area / City *</label>
                            <input
                                type="text"
                                name="area"
                                required
                                placeholder="Mohammadpur"
                                value={formData.area}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Delivery Address *</label>
                        <textarea
                            name="delivery_address"
                            required
                            rows={3}
                            placeholder="House 12, Road 5, Dhaka"
                            value={formData.delivery_address}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Delivery Zone Section with Shadcn RadioGroup */}
                    {isFreeDelivery ? (
                        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4 text-green-800">
                            <Truck className="size-5 shrink-0 text-green-600" />
                            <div>
                                <p className="text-sm font-bold">Free Delivery Included</p>
                                <p className="text-xs text-muted-foreground">
                                    You are eligible for free delivery on this order. No delivery charges will apply.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-2">Select Delivery Zone *</label>
                            <RadioGroup
                                value={formData.delivery_zone}
                                onValueChange={(value) => setFormData((p) => ({ ...p, delivery_zone: value }))}
                                className="grid gap-3 sm:grid-cols-2"
                            >
                                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 text-sm ${formData.delivery_zone === "inside_dhaka" ? "border-primary bg-primary/5 font-semibold" : "border-border"}`}>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="inside_dhaka" className="border-primary text-primary" />
                                        <span>Inside Dhaka City</span>
                                    </div>
                                    <span className="font-bold text-primary">
                                        ৳{totalInsideDhakaFee}
                                    </span>
                                </label>

                                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 text-sm ${formData.delivery_zone === "outside_dhaka" ? "border-primary bg-primary/5 font-semibold" : "border-border"}`}>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="outside_dhaka" className="border-primary text-primary" />
                                        <span>Outside Dhaka City</span>
                                    </div>
                                    <span className="font-bold text-primary">
                                        ৳{totalOutsideDhakaFee}
                                    </span>
                                </label>
                            </RadioGroup>
                        </div>
                    )}

                    {/* Payment Method with Shadcn RadioGroup */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground mb-2">Select Payment Method *</label>
                        <RadioGroup
                            value={formData.payment_method}
                            onValueChange={(value) => {
                                const method = value as "cod" | "online";
                                setFormData((p) => ({ ...p, payment_method: method }));
                                if (method === "cod") {
                                    setTransactionIdError(null);
                                }
                            }}
                            className="grid gap-3 sm:grid-cols-2"
                        >
                            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm ${formData.payment_method === "cod" ? "border-primary bg-primary/5 font-semibold" : "border-border"}`}>
                                <RadioGroupItem value="cod" className="border-primary text-primary" />
                                <span>Cash On Delivery (COD)</span>
                            </label>

                            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm ${formData.payment_method === "online" ? "border-primary bg-primary/5 font-semibold" : "border-border"}`}>
                                <RadioGroupItem value="online" className="border-primary text-primary" />
                                <span>Online Payment</span>
                            </label>
                        </RadioGroup>
                    </div>

                    {formData.payment_method === "online" && (
                        <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-border/70 p-4 bg-muted/20">
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1">Payment Provider *</label>
                                <Select
                                    value={formData.payment_provider}
                                    onValueChange={handleProviderChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bkash">bKash</SelectItem>
                                        <SelectItem value="nagad">Nagad</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1">
                                    Transaction ID * {expectedTxnLength ? `(${expectedTxnLength} chars)` : ""}
                                </label>
                                <input
                                    type="text"
                                    name="transaction_id"
                                    required
                                    maxLength={expectedTxnLength}
                                    placeholder={expectedTxnLength === 10 ? "e.g. 8A7B6C5D4E" : "e.g. 7A6B5C4D"}
                                    value={formData.transaction_id}
                                    onChange={handleChange}
                                    aria-invalid={Boolean(transactionIdError)}
                                    className={`w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${transactionIdError
                                        ? "border-destructive focus:ring-destructive"
                                        : "border-border focus:ring-primary"
                                        }`}
                                />
                                {transactionIdError && (
                                    <p className="mt-1 text-xs font-medium text-destructive">
                                        {transactionIdError}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Additional Note (optional)</label>
                        <textarea
                            name="customer_note"
                            rows={2}
                            placeholder="Please call before delivery"
                            value={formData.customer_note}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <OrderSummary
                        subtotal={subtotal}
                        totalItemsCount={totalQuantity}
                        shippingFee={selectedShippingFee}
                        onActionClick={handlePlaceOrder}
                        actionButtonText={isCreatingOrder ? "PLACING ORDER..." : "PLACE ORDER"}
                        isActionDisabled={isCreatingOrder}
                    />
                </div>
            </div>
        </div>
    );
};

export default Checkout;
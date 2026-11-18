import { formatPrice } from "@/lib/utils";
import React from "react";

interface OrderSummaryProps {
    subtotal: number;
    totalItemsCount: number;
    shippingFee: number; // ডাইনামিক ডেলিভারি চার্জ প্রপস
    onActionClick: () => void;
    actionButtonText: string;
    isActionDisabled?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    subtotal,
    totalItemsCount,
    shippingFee,
    onActionClick,
    actionButtonText,
    isActionDisabled = false,
}) => {
    const actualShippingFee = subtotal > 0 ? shippingFee : 0;
    const isFreeDelivery = subtotal > 0 && actualShippingFee === 0;
    const total = subtotal > 0 ? subtotal + actualShippingFee : 0;

    return (
        <div className="sticky top-20 space-y-4 rounded-xl border border-border/70 bg-card p-5 shadow-xs">
            <h3 className="text-sm font-bold text-foreground sm:text-base border-b border-border/60 pb-3">
                Order Summary
            </h3>

            <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
                    <span className="font-semibold text-foreground">৳{formatPrice(subtotal)}</span>
                </div>
                
                {/* ডাইনামিক ডেলিভারি চার্জ শো করার সেকশন */}
                <div className="flex justify-between items-center text-muted-foreground">
                    <span>Shipping Fee</span>
                    {isFreeDelivery ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400">
                            Free Delivery
                        </span>
                    ) : (
                        <span className="font-semibold text-foreground">
                            ৳{formatPrice(actualShippingFee)}
                        </span>
                    )}
                </div>
            </div>

            <div className="border-t border-border/60 pt-3 flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary text-base sm:text-lg">৳{formatPrice(total)}</span>
            </div>

            <button
                type="button"
                disabled={isActionDisabled || totalItemsCount === 0}
                onClick={onActionClick}
                className="w-full rounded-lg bg-primary py-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm cursor-pointer"
            >
                {actionButtonText} {totalItemsCount > 0 && `(${totalItemsCount})`}
            </button>
        </div>
    );
};

export default OrderSummary;
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrderStatusBadgeClass } from "@/lib/utils";
import { useGetOrderDetailsQuery } from "@/redux/services/order.api";
import { PageLoader } from "@/routes";
import {
    ArrowLeft,
    CreditCard,
    MapPin,
    Package,
    User,
} from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router";

export const OrderDetails: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();

  const { data: orderResponse, isLoading } = useGetOrderDetailsQuery(
    orderNumber ?? "",
    { skip: !orderNumber }
  );

  const order = orderResponse?.data;

  if (isLoading) return <PageLoader />;

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-foreground">Order not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The order you are looking for does not exist.
        </p>
        <Button
          onClick={() => navigate("/my-orders")}
          className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground cursor-pointer"
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-3 pb-8 sm:px-0">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/my-orders")}
        className="mb-6 -ml-4 flex items-center gap-2 text-sm cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        Back to Orders
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Order #{order.order_number}
            </h1>
            <Badge
              variant="outline"
              className={`capitalize px-3.5 py-1 rounded-full font-medium ${getOrderStatusBadgeClass(
                order.order_status
              )}`}
            >
              {order.order_status}
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Payment:</span>
          <Badge
            variant="outline"
            className={`capitalize px-3.5 py-1 rounded-full font-medium ${getOrderStatusBadgeClass(
              order.payment_status
            )}`}
          >
            {order.payment_status}
          </Badge>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
        
        {/* LEFT COLUMN: Items & Summary */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          
          {/* Items Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3 text-lg font-bold text-foreground">
              <Package className="size-5 text-primary" />
              Order Items ({order.items.length})
            </h2>

            <div className="divide-y divide-border/60">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.product_name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      SKU: {item.sku}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Qty: {item.quantity} × ৳{item.unit_price}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-foreground">
                    ৳{item.line_total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 border-b border-border/60 pb-3 text-lg font-bold text-foreground">
              Payment Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">
                  ৳{order.subtotal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span className="font-semibold text-foreground">
                  ৳{order.delivery_charge}
                </span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-৳{order.discount_amount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <span className="text-foreground">Total Amount</span>
                <span className="text-primary">৳{order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Info (Grouped) */}
        {/* এখানে ৩টি আলাদা ডিভের বদলে ১টি কার্ডের ভেতরে সেকশন করা হয়েছে, 
            যাতে নিচে বড় ফাঁকা জায়গা তৈরি না হয় এবং লেআউট ব্যালেন্সড থাকে */}
        <aside className="rounded-2xl border border-border bg-card shadow-sm lg:col-span-1">
          
          {/* Customer Section */}
          <div className="p-6 border-b border-border/60">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
              <User className="size-4 text-primary" />
              Customer Information
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Full Name</dt>
                <dd className="font-semibold text-foreground">
                  {order.customer_name}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Phone Number</dt>
                <dd className="font-semibold text-foreground">{order.phone}</dd>
              </div>
              {order.email && (
                <div>
                  <dt className="text-xs text-muted-foreground">Email Address</dt>
                  <dd className="break-all font-semibold text-foreground">
                    {order.email}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Delivery Section */}
          <div className="p-6 border-b border-border/60">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
              <MapPin className="size-4 text-primary" />
              Delivery Information
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Delivery Address</dt>
                <dd className="font-semibold text-foreground">
                  {order.delivery_address}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Area</dt>
                  <dd className="font-semibold text-foreground">{order.area}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">District</dt>
                  <dd className="font-semibold text-foreground">
                    {order.district}
                  </dd>
                </div>
              </div>
              {order.customer_note && (
                <div>
                  <dt className="text-xs text-muted-foreground">Customer Note</dt>
                  <dd className="italic text-foreground">{order.customer_note}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Payment Section */}
          <div className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
              <CreditCard className="size-4 text-primary" />
              Payment Information
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Method</dt>
                <dd className="font-semibold uppercase text-foreground">
                  {order.payment_method}
                </dd>
              </div>
              {order.payment_provider && (
                <div>
                  <dt className="text-xs text-muted-foreground">Provider</dt>
                  <dd className="font-semibold uppercase text-foreground">
                    {order.payment_provider}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
        
      </div>
    </div>
  );
};

export default OrderDetails;
import CommonPagination from "@/components/common/CommonPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrderStatusBadgeClass } from "@/lib/utils";
import { useGetOrdersQuery } from "@/redux/services/order.api";
import { PageLoader } from "@/routes";
import { ChevronRight, Package, ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export const MyOrders: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const perPage = 10;

    const { data: ordersResponse, isLoading } = useGetOrdersQuery({ page, per_page: perPage });

    const ordersData = ordersResponse?.data;
    const orders = ordersData?.orders ?? [];
    const pagination = ordersData?.pagination;

    if (isLoading) {
        return <PageLoader />;
    }

    if (orders.length === 0) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <ShoppingBag className="size-8" />
                </div>
                <h2 className="text-xl font-bold text-foreground">No orders found</h2>
                <p className="mt-2 text-sm text-muted-foreground">You haven't placed any orders yet.</p>
                <Button
                    onClick={() => navigate("/")}
                    className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground cursor-pointer"
                >
                    Start Shopping
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 pt-3 pb-8 sm:px-0">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">My Orders</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage and track your order history</p>
                </div>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.order_number}
                        className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/50"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Package className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{order.order_number}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={`capitalize px-3 py-1 rounded-full font-medium ${getOrderStatusBadgeClass(order.order_status)}`}>
                                    Status: <span className="font-bold ml-1">{order.order_status}</span>
                                </Badge>
                                <Badge variant="outline" className={`capitalize px-3 py-1 rounded-full font-medium ${getOrderStatusBadgeClass(order.payment_status)}`}>
                                    Payment: <span className="font-bold ml-1">{order.payment_status}</span>
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Items Count</span>
                                    <span className="font-semibold text-foreground">{order.items_count} Item(s)</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Payment Method</span>
                                    <span className="font-semibold text-foreground uppercase">{order.payment_method}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Total Amount</span>
                                    <span className="font-bold text-primary">৳{order.total_amount}</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/my-orders/${order.order_number}`)}
                                className="flex items-center gap-1 cursor-pointer self-end sm:self-auto"
                            >
                                View Details
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {pagination && pagination.last_page > 1 && (
                <CommonPagination
                    pagination={{
                        current_page: pagination.current_page,
                        last_page: pagination.last_page,
                    }}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            )}
        </div>
    );
};

export default MyOrders;
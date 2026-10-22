import { LayoutDashboard, UserRound } from "lucide-react";

export const dashboardRoutes = [
        {
            label: "Overview",
            to: "/dashboard",
            icon: LayoutDashboard,
            isActive: location.pathname === "/dashboard",
        },
        {
            label: "My profile",
            to: "/dashboard/my-profile",
            icon: UserRound,
            isActive: location.pathname === "/dashboard/my-profile",
        },
        // {
        //     label: "My Wishlist",
        //     to: "/dashboard/my-wishlist",
        //     icon: Bookmark,
        //     isActive: location.pathname === "/dashboard/my-wishlist",
        // },
    ];
/* eslint-disable react-refresh/only-export-components */
// src/routes/index.tsx
import AuthLayout from "@/components/layout/AuthLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlobalErrorPage from "@/components/layout/GlobalErrorPage";
import { ForgotPassword } from "@/pages/authentication/ForgotPassword";
import ResetPassword from "@/pages/authentication/ResetPassword";
import VerifyOtp from "@/pages/authentication/VerifyOtp";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import MyProfile from "@/pages/dashboard/MyProfile";
import MyWishlist from "@/pages/dashboard/MyWishlist";
import ElecProductDetails from "@/pages/electronics/details/ElecProductDetails";
import Homepage from "@/pages/Homepage"; // হোমপেজ সরাসরি থাকবে (Fast LCP)
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

// 🎯 বাকি পেজগুলো Lazy Loading করা হলো
const DecorPage = lazy(() => import("@/pages/DecorPage"));
const ClothingPage = lazy(() => import("@/pages/ClothingPage"));
const LogisticsPage = lazy(() => import("@/pages/LogisticsPage"));
const ElectronicsPage = lazy(() => import("@/pages/electronics/ElectronicsPage"));
const ElecHome = lazy(() => import("@/pages/electronics/home/ElecHome"));
const ProductDetailsPage = lazy(() => import("@/pages/ProductDetailsPage"));
const Login = lazy(() => import("@/pages/authentication/Login"));
const Register = lazy(() => import("@/pages/authentication/Register"));
const ContactUs = lazy(() => import("@/pages/ContactUs"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const FurniturePage = lazy(() => import("@/pages/FurniturePage"));
const BooksPage = lazy(() => import("@/pages/BooksPage"));
const GamingPage = lazy(() => import("@/pages/GamingPage"));
const KitchenPage = lazy(() => import("@/pages/KitchenPage"));
const BlogDetailsPage = lazy(() => import("@/pages/BlogDetailsPage"));
const BlogsPage = lazy(() => import("@/pages/BlogsPage"));
const TestimonialsPage = lazy(() => import("@/pages/TestimonialsPage"));
const DecorFeaturedProductsPage = lazy(() => import("@/components/modules/DecorPage/DecorFeaturedProductsPage"));
const ClientsPage = lazy(() => import("@/pages/ClientsPage"));
const ShippingPage = lazy(() => import("@/pages/ShippingPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const ReturnRefundPage = lazy(() => import("@/pages/ReturnRefundPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const FaqPage = lazy(() => import("@/pages/FaqPage"));

// হালকা লোডিং ফলব্যাক
const PageLoader = () => (
    <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
    </div>
);

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        errorElement: <GlobalErrorPage />,
        children: [
            {
                index: true,
                Component: Homepage
            },
            {
                path: "decor",
                element: <Suspense fallback={<PageLoader />}><DecorPage /></Suspense>
            },
            {
                path: "clothings",
                element: <Suspense fallback={<PageLoader />}><ClothingPage /></Suspense>
            },
            {
                path: "logistics",
                element: <Suspense fallback={<PageLoader />}><LogisticsPage /></Suspense>
            },
            {
                path: "/electronics",
                element:
                    <Suspense fallback={<PageLoader />}>
                        <ElectronicsPage />,
                    </Suspense>,
                children: [
                    {
                        index: true,
                        Component: ElecHome
                    }
                ]
            },
            {
                path: "/electronics/:slug",
                element: <Suspense fallback={<PageLoader />}><ElecProductDetails /></Suspense>,
            },
            {
                path: "/products/:slug",
                element: <Suspense fallback={<PageLoader />}><ProductDetailsPage /></Suspense>,
            },
            {
                path: "privacy-policy",
                element: <Suspense fallback={<PageLoader />}><PrivacyPolicyPage /></Suspense>
            },
            {
                path: "contact",
                element: <Suspense fallback={<PageLoader />}><ContactUs /></Suspense>
            },
            {
                path: "furniture",
                element: <Suspense fallback={<PageLoader />}><FurniturePage /></Suspense>
            },
            {
                path: "books",
                element: <Suspense fallback={<PageLoader />}><BooksPage /></Suspense>
            },
            {
                path: "gaming",
                element: <Suspense fallback={<PageLoader />}><GamingPage /></Suspense>
            },
            {
                path: "kitchen",
                element: <Suspense fallback={<PageLoader />}><KitchenPage /></Suspense>
            },
            {
                path: "search",
                element: <Suspense fallback={<PageLoader />}><SearchPage /></Suspense>
            },
            {
                path: "/blogs",
                element: <Suspense fallback={<PageLoader />}><BlogsPage /></Suspense>
            },
            {
                path: "/blogs/:id",
                element: <Suspense fallback={<PageLoader />}><BlogDetailsPage /></Suspense>
            },
            {
                path: "testimonials",
                element: <Suspense fallback={<PageLoader />}><TestimonialsPage /></Suspense>
            },
            {
                path: "/decor-featured-products",
                element: <Suspense fallback={<PageLoader />}><DecorFeaturedProductsPage /></Suspense>
            },
            {
                path: "clients",
                element: <Suspense fallback={<PageLoader />}><ClientsPage /></Suspense>
            },
            {
                path: "shipping",
                element: <Suspense fallback={<PageLoader />}><ShippingPage /></Suspense>
            },
            {
                path: "return-refund",
                element: <Suspense fallback={<PageLoader />}><ReturnRefundPage /></Suspense>
            },
            {
                path: "terms",
                element: <Suspense fallback={<PageLoader />}><TermsPage /></Suspense>
            },
            {
                path: "faq",
                element: <Suspense fallback={<PageLoader />}><FaqPage /></Suspense>
            }
        ]
    },
    {
        Component: PublicOnlyRoute,
        children: [
            {
                Component: AuthLayout,
                children: [
                    {
                        path: "login",
                        Component: Login,
                    },
                    {
                        path: "forgot-password",
                        Component: ForgotPassword,
                    },
                    {
                        path: "reset-password",
                        Component: ResetPassword,
                    },
                    {
                        path: "register",
                        Component: Register,
                    },
                    {
                        path: "register/verify-email",
                        Component: VerifyOtp,
                    },
                ],
            },
        ],
    },


    {
        Component: ProtectedRoute,
        children: [
            {
                Component: DashboardLayout,
                children: [
                    {
                        path: "dashboard",
                        Component: DashboardHome,
                    },
                    {
                        path: "dashboard/my-profile",
                        Component: MyProfile,
                    },
                    {
                        path: "/dashboard/my-wishlist",
                        Component: MyWishlist,
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <GlobalErrorPage />,
    },
]);
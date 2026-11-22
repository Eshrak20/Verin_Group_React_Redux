/* eslint-disable react-refresh/only-export-components */
// src/routes/index.tsx
import AuthLayout from "@/components/layout/AuthLayout";
import GlobalErrorPage from "@/components/layout/GlobalErrorPage";
import { ForgotPassword } from "@/pages/authentication/ForgotPassword";
import ResetPassword from "@/pages/authentication/ResetPassword";
import VerifyOtp from "@/pages/authentication/VerifyOtp";
import Checkout from "@/pages/dashboard/Checkout";
import MyCart from "@/pages/dashboard/MyCart";
import MyOrders from "@/pages/dashboard/MyOrders";
import MyProfile from "@/pages/dashboard/MyProfile";
import MyWishlist from "@/pages/dashboard/MyWishlist";
import OrderDetails from "@/pages/dashboard/OrderDetails";
import ElecProductDetails from "@/pages/electronics/details/ElecProductDetails";
import ProductListMain from "@/pages/electronics/product-list/ProductListMain";
import Homepage from "@/pages/Homepage";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import PublicOnlyRoute from "./PublicOnlyRoute";

const DecorPage = lazy(() => import("@/pages/DecorPage"));
const ClothingPage = lazy(() => import("@/pages/ClothingPage"));
const ElectronicsPage = lazy(() => import("@/pages/electronics/ElectronicsPage"));
const ElecHome = lazy(() => import("@/pages/electronics/home/ElecHome"));
const ProductDetailsPage = lazy(() => import("@/pages/ProductDetailsPage"));
const Login = lazy(() => import("@/pages/authentication/Login"));
const Register = lazy(() => import("@/pages/authentication/Register"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
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

export const PageLoader = () => (
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
                path: "/electronics/:subCategorySlug",
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProductListMain />
                    </Suspense>
                ),
            },
            // {
            //     path: "/electronics/:subCategory/:brand",
            //     element: <Suspense fallback={<PageLoader />}><ProductListMain /></Suspense>,
            // },
            {
                path: "/electronics/products/:slug",
                element: <Suspense fallback={<PageLoader />}><ElecProductDetails /></Suspense>,
            },
            {
                path: "/electronics/products/:slug",
                element: <Suspense fallback={<PageLoader />}><ElecProductDetails /></Suspense>,
            },
            {
                path: "/products/:slug",
                element: <Suspense fallback={<PageLoader />}><ProductDetailsPage /></Suspense>,
            },
            {
                path: "/my-wishlist",
                element: <Suspense fallback={<PageLoader />}><MyWishlist /></Suspense>,
            },
            {
                path: "/my-cart",
                element: <Suspense fallback={<PageLoader />}><MyCart /></Suspense>,
            },
            {
                path: "/my-profile",
                element: <Suspense fallback={<PageLoader />}><MyProfile /></Suspense>,
            },
            {
                path: "/my-orders",
                element: <Suspense fallback={<PageLoader />}><MyOrders /></Suspense>,
            },
            {
                path: "/my-orders/:orderNumber",
                element: <Suspense fallback={<PageLoader />}><OrderDetails /></Suspense>,
            },
            {
                path: "/checkout",
                element: <Suspense fallback={<PageLoader />}><Checkout /></Suspense>,
            },
            {
                path: "privacy-policy",
                element: <Suspense fallback={<PageLoader />}><PrivacyPolicyPage /></Suspense>
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
        path: "*",
        element: <GlobalErrorPage />,
    },
]);
/* eslint-disable react-refresh/only-export-components */
// src/routes/index.tsx
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import Homepage from "@/pages/Homepage"; // হোমপেজ সরাসরি থাকবে (Fast LCP)
import GlobalErrorPage from "@/components/layout/GlobalErrorPage";

// 🎯 বাকি পেজগুলো Lazy Loading করা হলো
const DecorPage = lazy(() => import("@/pages/DecorPage"));
const ClothingPage = lazy(() => import("@/pages/ClothingPage"));
const LogisticsPage = lazy(() => import("@/pages/LogisticsPage"));
const ElectronicsPage = lazy(() => import("@/pages/ElectronicsPage"));
const ProductDetailsPage = lazy(() => import("@/pages/ProductDetailsPage"));
// const Login = lazy(() => import("@/pages/Login"));
// const Signup = lazy(() => import("@/pages/SignUp"));
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
                element: <Suspense fallback={<PageLoader />}><ElectronicsPage /></Suspense>
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
    // {
    //     path: "/login",
    //     element: <Suspense fallback={<PageLoader />}><Login /></Suspense>
    // },
    // {
    //     path: "/signup",
    //     element: <Suspense fallback={<PageLoader />}><Signup /></Suspense>
    // },
    {
        path: "*",
        element: <GlobalErrorPage />,
    },
]);















// import { createBrowserRouter } from "react-router";
// import App from "../App";
// import Homepage from "@/pages/Homepage";
// import GlobalErrorPage from "@/components/layout/GlobalErrorPage";
// import DecorPage from "@/pages/DecorPage";
// import LogisticsPage from "@/pages/LogisticsPage";
// import ProductDetailsPage from "@/pages/ProductDetailsPage";
// import Login from "@/pages/Login";
// import Signup from "@/pages/SignUp";
// import ContactUs from "@/pages/ContactUs";
// import ClothingPage from "@/pages/ClothingPage";
// import ElectronicsPage from "@/pages/ElectronicsPage";
// import SearchPage from "@/pages/SearchPage";
// import FurniturePage from "@/pages/FurniturePage";
// import BooksPage from "@/pages/BooksPage";
// import GamingPage from "@/pages/GamingPage";
// import KitchenPage from "@/pages/KitchenPage";
// import BlogDetailsPage from "@/pages/BlogDetailsPage";
// import BlogsPage from "@/pages/BlogsPage";
// import TestimonialsPage from "@/pages/TestimonialsPage";
// import DecorFeaturedProductsPage from "@/components/modules/DecorPage/DecorFeaturedProductsPage";
// import ClientsPage from "@/pages/ClientsPage";
// import ShippingPage from "@/pages/ShippingPage";
// import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
// import ReturnRefundPage from "@/pages/ReturnRefundPage";
// import TermsPage from "@/pages/TermsPage";
// import FaqPage from "@/pages/FaqPage";



// export const router = createBrowserRouter([
//     {
//         path: "/",
//         Component: App,
//         errorElement: <GlobalErrorPage />,
//         children: [
//             {
//                 index: true,
//                 Component: Homepage
//             },
//             {
//                 path: "decor",
//                 Component: DecorPage
//             },
//             {
//                 path: "clothings",
//                 Component: ClothingPage
//             },
//             {
//                 path: "logistics",
//                 Component: LogisticsPage
//             },
//             {
//                 path: "/electronics",
//                 Component: ElectronicsPage
//             },
//             {
//                 path: "/products/:slug",
//                 Component: ProductDetailsPage,
//             },
//             {
//                 path: "privacy-policy",
//                 Component: PrivacyPolicyPage
//             },
//             {
//                 path: "contact",
//                 Component: ContactUs
//             },
//             {
//                 path: "furniture",
//                 Component: FurniturePage
//             },
//             {
//                 path: "books",
//                 Component: BooksPage
//             },
//             {
//                 path: "gaming",
//                 Component: GamingPage
//             },
//             {
//                 path: "kitchen",
//                 Component: KitchenPage
//             },
//             {
//                 path: "search",
//                 Component: SearchPage
//             },
//             {
//                 path: "/blogs",
//                 Component: BlogsPage
//             },
//             {
//                 path: "/blogs/:id",
//                 Component: BlogDetailsPage
//             },
//             {
//                 path: "testimonials",
//                 Component: TestimonialsPage
//             },
//             {
//                 path: "/decor-featured-products",
//                 Component: DecorFeaturedProductsPage
//             },
//             {
//                 path: "clients",
//                 Component: ClientsPage
//             },
//             {
//                 path: "shipping",
//                 Component: ShippingPage
//             },
//             {
//                 path: "privacy-policy",
//                 Component: PrivacyPolicyPage
//             },
//             {
//                 path: "return-refund",
//                 Component: ReturnRefundPage
//             },
//             {
//                 path: "terms",
//                 Component: TermsPage
//             },
//             {
//                 path: "faq",
//                 Component: FaqPage
//             },
//             // {
//             //     path: "faq",
//             //     Component: FAQ
//             // }
//         ]
//     },
//     {
//         path: "/login",
//         Component: Login
//     },
//     {
//         path: "/signup",
//         Component: Signup
//     },
//     {
//         path: "*",
//         element: <GlobalErrorPage />,
//     },

// ])
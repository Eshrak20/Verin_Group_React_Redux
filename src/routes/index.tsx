
import { createBrowserRouter } from "react-router";
import App from "../App";
import Homepage from "@/pages/Homepage";
import GlobalErrorPage from "@/components/layout/GlobalErrorPage";
import DecorPage from "@/pages/DecorPage";
import LogisticsPage from "@/pages/LogisticsPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Login from "@/pages/Login";
import Signup from "@/pages/SignUp";
import ContactUs from "@/pages/ContactUs";
import ClothingPage from "@/pages/ClothingPage";
import ElectronicsPage from "@/pages/ElectronicsPage";
import SearchPage from "@/pages/SearchPage";
import FurniturePage from "@/pages/FurniturePage";
import BooksPage from "@/pages/BooksPage";
import GamingPage from "@/pages/GamingPage";
import KitchenPage from "@/pages/KitchenPage";
import BlogDetailsPage from "@/pages/BlogDetailsPage";



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
                Component: DecorPage
            },
            {
                path: "clothing",
                Component: ClothingPage
            },
            {
                path: "logistics",
                Component: LogisticsPage
            },
            {
                path: "/electronics",
                Component: ElectronicsPage
            },
            {
                path: "/products/:slug",
                Component: ProductDetailsPage,
            },
            {
                path: "privacy-policy",
                Component: PrivacyPolicy
            },
            {
                path: "contact",
                Component: ContactUs
            },
            {
                path: "furniture",
                Component: FurniturePage
            },
            {
                path: "books",
                Component: BooksPage
            },
            {
                path: "gaming",
                Component: GamingPage
            },
            {
                path: "kitchen",
                Component: KitchenPage
            },
            {
                path: "search",
                Component: SearchPage
            },
            {
                path: "/blogs/:id",
                Component: BlogDetailsPage
            }
            // {
            //     path: "faq",
            //     Component: FAQ
            // }
        ]
    },
    {
        path: "/login",
        Component: Login
    },
    {
        path: "/signup",
        Component: Signup
    },
    {
        path: "*",
        element: <GlobalErrorPage />,
    },

])
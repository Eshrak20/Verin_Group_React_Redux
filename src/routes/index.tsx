
import { createBrowserRouter } from "react-router";
import App from "../App";
import Homepage from "@/pages/Homepage";
import GlobalErrorPage from "@/components/layout/GlobalErrorPage";
import DecorPage from "@/pages/DecorPage";
import LogisticsPage from "@/pages/LogisticsPage";
import LaptopsPage from "@/pages/LaptopsPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";



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
                path: "logistics",
                Component: LogisticsPage
            },
            {
                path: "laptops",
                Component: LaptopsPage
            },
            {
                path: "/products/:slug",
                Component: ProductDetailsPage,
            }
            // {
            //     path: "contact",
            //     Component: ContactUs
            // },
            // {
            //     path: "faq",
            //     Component: FAQ
            // }
        ]
    },
    // {
    //     path: "/login",
    //     Component: Login
    // },
    // {
    //     path: "/register",
    //     Component: Register
    // },
    {
        path: "*",
        element: <GlobalErrorPage />,
    },

])
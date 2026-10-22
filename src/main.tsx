import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";

import AuthInitializer from "./lib/authInitializer";
import { store } from "./redux/store";
import { router } from "./routes";
import { ActiveCategoryProvider } from "./utils/ActiveCategoryContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <HelmetProvider>
        <ActiveCategoryProvider>
          <Provider store={store}>
            <AuthInitializer />
            <RouterProvider router={router} />
            <Toaster richColors position="top-center" closeButton />
          </Provider>
        </ActiveCategoryProvider>
      </HelmetProvider>
    </TooltipProvider>
  </StrictMode>,
);
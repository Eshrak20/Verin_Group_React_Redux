import type { ReactNode } from "react";
import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

// 🎯 Footer Lazy Import
const Footer = lazy(() => import("./Footer"));

interface IProps {
  children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
  const { pathname } = useLocation();
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/decor")) {
      document.title = "Verin Group - Decor";
    } else if (pathname.startsWith("/electronics")) {
      document.title = "Verin Group - Electronics";
    } else if (pathname.startsWith("/clothing")) {
      document.title = "Verin Group - Clothing";
    } else if (pathname.startsWith("/blogs")) {
      document.title = "Verin Group - Blogs";
    } else {
      document.title = "Verin Group";
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowFooter(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const timer = setTimeout(() => {
      setShowFooter(true);
    }, 8000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-home">
      <div>
        <Navbar />
      </div>

      <div className="grow pt-22 max-w-6xl mx-auto w-full min-h-[calc(100vh-80px)]">
        {children}
      </div>

      {showFooter && (
        <Suspense fallback={<div className="h-20 bg-transparent" />}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}
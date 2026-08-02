import type { ReactNode } from "react";
import { useEffect, useState, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";


const Footer = lazy(() => import("./Footer"));

interface IProps {
  children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
  const { pathname } = useLocation();
  const [showFooter, setShowFooter] = useState(false);

  // ১. ডাইনামিক টাইটেল সেট করার জন্য
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
    if (showFooter) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowFooter(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const timer = setTimeout(() => {
      setShowFooter(true);
      window.removeEventListener("scroll", handleScroll);
    }, 85000); 

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [showFooter]); 

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









// import type { ReactNode } from "react";
// import { useEffect, useState, lazy, Suspense } from "react";
// import { useLocation } from "react-router-dom";
// import Navbar from "./Navbar";

// // 🎯 Footer Lazy Import
// const Footer = lazy(() => import("./Footer"));

// interface IProps {
//   children: ReactNode;
// }

// export default function CommonLayout({ children }: IProps) {
//   const { pathname } = useLocation();
//   const [showFooter, setShowFooter] = useState(false);

//   useEffect(() => {
//     if (pathname.startsWith("/decor")) {
//       document.title = "Verin Group - Decor";
//     } else if (pathname.startsWith("/electronics")) {
//       document.title = "Verin Group - Electronics";
//     } else if (pathname.startsWith("/clothing")) {
//       document.title = "Verin Group - Clothing";
//     } else if (pathname.startsWith("/blogs")) {
//       document.title = "Verin Group - Blogs";
//     } else {
//       document.title = "Verin Group";
//     }
//   }, [pathname]);

//   // 🎯 আসল ট্রিক: ইউজার অন্তত ৫০px স্ক্রোল করলে তবেই ফুটার লোড হবে
//   useEffect(() => {
//     const handleScroll = () => {
//       // ব্রাউজারের অটো-ট্রিগার আটকানোর জন্য window.scrollY > 50 চেক
//       if (window.scrollY > 50) {
//         setShowFooter(true);
//         window.removeEventListener("scroll", handleScroll);
//       }
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });

//     // ইউজার একদমই স্ক্রোল না করলে ৮ সেকেন্ড পর লোড হবে
//     const timer = setTimeout(() => {
//       setShowFooter(true);
//     }, 8000);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       clearTimeout(timer);
//     };
//   }, [pathname]);

//   return (
//     <div className="relative min-h-screen flex flex-col bg-home">
//       <div>
//         <Navbar />
//       </div>

//       <div className="grow pt-22 max-w-6xl mx-auto w-full min-h-[calc(100vh-80px)]">
//         {children}
//       </div>

//       {/* 🎯 showFooter true না হলে DOM-এ ফুটার আসবেই না */}
//       {showFooter && (
//         <Suspense fallback={<div className="h-20 bg-transparent" />}>
//           <Footer />
//         </Suspense>
//       )}
//     </div>
//   );
// }









// import type { ReactNode } from "react";
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// interface IProps {
//   children: ReactNode;
// }

// export default function CommonLayout({ children }: IProps) {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     if (pathname.startsWith("/decor")) {
//       document.title = "Verin Group - Decor";
//     } else if (pathname.startsWith("/electronics")) {
//       document.title = "Verin Group - Electronics";
//     } else if (pathname.startsWith("/clothing")) {
//       document.title = "Verin Group - Clothing";
//     } else if (pathname.startsWith("/blogs")) {
//       document.title = "Verin Group - Blogs";
//     } else {
//       document.title = "Verin Group";
//     }
//   }, [pathname]);

//   return (
//     <div className="relative min-h-screen flex flex-col bg-home">
//       <div>
//         <Navbar />
//       </div>
      
//       {/* 🎯 min-h-[calc(100vh-80px)] দিয়ে নিশ্চিত করা হচ্ছে ফুটার পেজ লোডের সময় সবসময় স্ক্রিনের বাইরে থাকবে */}
//       <div className="grow pt-22 max-w-6xl mx-auto w-full min-h-[calc(100vh-80px)]">
//         {children}
//       </div>

//       <Footer />
//     </div>
//   );
// }









// import type { ReactNode } from "react";
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// interface IProps {
//   children: ReactNode;
// }

// export default function CommonLayout({ children }: IProps) {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     if (pathname.startsWith("/decor")) {
//       document.title = "Verin Group - Decor";
//     } else if (pathname.startsWith("/electronics")) {
//       document.title = "Verin Group - Electronics";
//     } else if (pathname.startsWith("/clothing")) {
//       document.title = "Verin Group - Clothing";
//     } else if (pathname.startsWith("/blogs")) {
//       document.title = "Verin Group - Blogs";
//     } else {
//       document.title = "Verin Group";
//     }
//   }, [pathname]);



//   return (
//     <div className="relative min-h-screen flex flex-col bg-home">
//       <div>
//         <Navbar />
//       </div>
//       <div className="grow pt-22 max-w-6xl mx-auto w-full">
//         {children}
//       </div>
//       <Footer />
//     </div>
//   );
// }
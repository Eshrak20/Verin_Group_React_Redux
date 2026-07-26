import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface IProps {
  children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/decor")) {
      document.title = "Verin Group - Decor";
    } else if (pathname.startsWith("/laptops") || pathname.startsWith("/electronics")) {
      document.title = "Verin Group - Electronics";
    } else if (pathname.startsWith("/clothing")) {
      document.title = "Verin Group - Clothing";
    } else if (pathname.startsWith("/blogs")) {
      document.title = "Verin Group - Blogs";
    } else {
      document.title = "Verin Group";
    }
  }, [pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-home">
      <div>
        <Navbar />
      </div>
      <div className="grow pt-22 max-w-6xl mx-auto w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
}











// import type { ReactNode } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";




// interface IProps {
//     children: ReactNode
//     // children: ReactElement
// }


// export default function CommonLayout({ children }: IProps) {
//     return (
//         <div className="relative min-h-screen flex flex-col bg-home">
//             <div>
//                 <Navbar />
//             </div>
//             <div className="grow pt-22 max-w-6xl mx-auto w-full">
//                 {children}
//             </div>

//             <Footer /> 
//         </div>
//     );
// }
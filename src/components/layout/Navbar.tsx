/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingCart, LayoutGrid, User, Menu, X, LogIn, LogOut } from "lucide-react";
import { deleteCookie, getCookie } from "@/utils/cookies";
import type { FakeUser } from "@/types/user.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
import { useActiveCategory } from "@/utils/ActiveCategoryContext";

// 🎯 ProductSearch কম্পোনেন্ট
import ProductSearch from "@/components/modules/Product/ProductSearch";

interface NavLink {
  label: string;
  path: string;
}

const navLinks: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "Decor", path: "/decor" },
  { label: "Clothing", path: "/clothing" },
  { label: "Electronics", path: "/electronics" },
];

export default function Navbar() {
  const location = useLocation();
  const [pillStyle, setPillStyle] = useState({ width: 0, translateX: 0 });
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FakeUser | null>(null);
  const { data } = useGetFooterSettingsQuery();
  const { activeCategory } = useActiveCategory();

  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null); // 🎯 মোবাইল মেনু ও টগল বাটন ট্র্যাক করার জন্য Ref

  const getCompanyKey = (pathname: string) => {
    if (pathname.startsWith("/decor") || pathname.startsWith("/products")) {
      return "verin-decor";
    }
    if (pathname.startsWith("/electronics")) {
      return "verin-electronics";
    }
    if (pathname.startsWith("/clothing")) {
      return "verin-clothing";
    }
    return "verin-group";
  };

  const companyKey = getCompanyKey(location.pathname);

  // 🎯 ডাইনামিক লোগো ইউআরএল তৈরি করার লজিক
  const getLogoPath = (pathname: string) => {
    if (pathname.startsWith("/decor")) return "/decor";
    if (pathname.startsWith("/electronics")) return "/electronics";
    if (pathname.startsWith("/clothing")) return "/clothing";

    if (activeCategory) {
      const cat = activeCategory.toLowerCase();
      if (cat.includes("decor")) return "/decor";
      if (cat.includes("electronics")) return "/electronics";
      if (cat.includes("clothing")) return "/clothing";
    }

    return "/";
  };

  const logoPath = getLogoPath(location.pathname);

  const navbar = data?.success
    ? data.data.find((f) => f.company_key === companyKey)
    : undefined;

  const logoUrl = navbar?.image_url
    ? navbar.image_url
    : navbar?.logo
      ? `https://v.veringroup.com/storage/${navbar.logo}`
      : null;

  const companyName = navbar?.company_name || "Verin Group";

  useEffect(() => {
    const savedUser = getCookie("auth_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user data from cookie", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // পেজ রুট চেঞ্জ হলে মোবাইল মেনু বন্ধ হয়ে যাবে
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // 🎯 মোবাইল মেনুর বাইরে ক্লিক করলে মেনু বন্ধ করার লজিক
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (dropdownOpen) setDropdownOpen(false);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dropdownOpen, mobileMenuOpen]);

  useEffect(() => {
    const activeIndex = navLinks.findIndex((link) => {
      if (link.path === "/") return location.pathname === "/";
      if (location.pathname.startsWith(link.path)) return true;
      if (location.pathname.startsWith("/products") && activeCategory) {
        return link.label.toLowerCase() === activeCategory.toLowerCase();
      }
      return false;
    });

    if (activeIndex !== -1) {
      updatePill(activeIndex);
    } else {
      setPillStyle({ width: 0, translateX: 0 });
    }
  }, [location.pathname, activeCategory]);

  const updatePill = (index: number) => {
    const navEl = navRef.current;
    const linkEl = linkRefs.current[index];
    if (!navEl || !linkEl) return;
    const navRect = navEl.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    setPillStyle({
      width: linkRect.width,
      translateX: linkRect.left - navRect.left,
    });
  };

  const handleLogout = () => {
    deleteCookie("auth_user");
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50">
      <div>
        <div className="flex items-center justify-between bg-white border-b-2 border-gray-200/70 h-14 shadow-lg shadow-black/5 backdrop-blur-md">
          {/* Main Container */}
          <div className="max-w-6xl mx-auto flex w-full items-center justify-between px-4 sm:px-4 lg:px-0">
            
            {/* 1. Left Section: Dynamic Logo & Link */}
            <div className="relative min-w-0 shrink-0 z-10 max-w-[50%] sm:max-w-none">
              <Link to={logoPath} className="flex items-center gap-1.5 sm:gap-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={companyName}
                    className="h-6 sm:h-7 w-auto object-contain"
                  />
                ) : null}
                <span className="text-base sm:text-xl font-bold home-black-text truncate sm:whitespace-nowrap">
                  {companyName}
                </span>
              </Link>
            </div>

            {/* 2. Middle Section: Desktop Nav Links */}
            <div className="absolute inset-x-0 flex justify-center pointer-events-none transition-all duration-300">
              <div
                ref={navRef}
                className={`
                  relative hidden items-center gap-1 rounded-full p-1 lg:flex pointer-events-auto
                  transition-all duration-300
                  ${searchOpen ? "-translate-x-12 xl:-translate-x-16" : "translate-x-0"}
                `}
              >
                <span
                  className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-[#262626] home-black-text transition-all duration-300 dark:bg-white"
                  style={{
                    width: pillStyle.width,
                    transform: `translateX(${pillStyle.translateX}px)`,
                  }}
                />
                {navLinks.map((link, index) => {
                  const isActive =
                    link.path === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(link.path) ||
                        (location.pathname.startsWith("/products") &&
                          activeCategory &&
                          link.label.toLowerCase() === activeCategory.toLowerCase());
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      ref={(el) => {
                        linkRefs.current[index] = el;
                      }}
                      className={`
                        relative z-10 block rounded-full px-3.5 py-2
                        text-xs font-bold uppercase tracking-wide
                        transition-colors duration-300 xl:px-4 xl:text-[13px]
                        ${
                          isActive
                            ? "text-white dark:text-[#00416A]"
                            : "home-black-text hover:bg-gray-200/60"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 3. Right Section: Actions */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:ml-auto z-10">
              {/* ProductSearch */}
              <div className="flex items-center">
                <ProductSearch
                  searchOpen={searchOpen}
                  setSearchOpen={setSearchOpen}
                />
              </div>

              {/* Wishlist */}
              <button
                aria-label="Wishlist"
                className="
                  relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full
                  border border-[#00416A]/30 bg-transparent text-[#00416A]
                  transition-all duration-300 hover:border-[#a5abaf]
                  hover:bg-gray-200/60 
                "
              >
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-[#262626] text-[8px] sm:text-[9px] font-bold text-white">
                  2
                </span>
              </button>

              {/* Cart */}
              <button
                aria-label="Shopping cart"
                className="
                  relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full
                  border border-[#00416A]/30 bg-transparent text-[#00416A]
                  transition-all duration-300 hover:border-[#a5abaf]
                  hover:bg-gray-200/60 
                "
              >
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-[#262626] text-[8px] sm:text-[9px] font-bold text-white">
                  3
                </span>
              </button>

              {/* Desktop User Profile / Dropdown */}
              <div className="hidden lg:block">
                {user ? (
                  <DropdownMenu
                    open={dropdownOpen}
                    onOpenChange={setDropdownOpen}
                    modal={false}
                  >
                    <DropdownMenuTrigger asChild>
                      <button className="focus:outline-none cursor-pointer hover:scale-105 transition-transform duration-200">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-10 w-10 rounded-full border-2 border-[#00416A] object-cover pointer-events-none"
                        />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      sideOffset={12}
                      className="w-56 rounded-2xl border border-stone-100 bg-white shadow-xl py-2 px-0 z-9999"
                    >
                      <div className="px-5 py-3">
                        <p className="font-bold text-stone-800 text-sm">
                          {user.name}
                        </p>
                        <p className="text-blue-500 text-xs font-semibold mt-0.5">
                          {user.role}
                        </p>
                      </div>
                      <DropdownMenuSeparator className="bg-stone-100" />
                      <div className="py-1 px-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
                        >
                          <LayoutGrid size={15} className="text-stone-400" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
                        >
                          <User size={15} className="text-stone-400" />
                          Profile
                        </Link>
                      </div>
                      <DropdownMenuSeparator className="bg-stone-100" />
                      <div className="px-4 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-24 py-1.5 bg-[#E30613] hover:bg-red-700 hover:cursor-pointer text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-sm"
                        >
                          Logout
                        </button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to="/login"
                    className="
                      flex h-10 px-5 shrink-0 items-center justify-center rounded-full
                      border border-[#00416A]/30 bg-transparent home-black-text text-sm font-semibold
                      transition-all duration-300 hover:border-[#00416A]
                      hover:bg-[#00416A] hover:text-white
                    "
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* 🎯 Mobile Menu Container (Button & Dropdown Wrap with Ref) */}
              <div ref={mobileMenuRef} className="relative lg:hidden">
                <button
                  aria-label="Toggle mobile menu"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="
                    relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center
                    rounded-full bg-[#00416A]/10 text-[#00416A]
                    transition-all duration-300 hover:bg-[#00416A]/15
                    shrink-0
                  "
                >
                  {mobileMenuOpen ? (
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>

                {/* 🎯 Mobile Dropdown Navigation Menu */}
                {mobileMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    {/* 1. Category Nav Links */}
                    <div className="flex flex-col space-y-0.5">
                      {navLinks.map((link) => {
                        const isActive =
                          link.path === "/"
                            ? location.pathname === "/"
                            : location.pathname.startsWith(link.path) ||
                              (location.pathname.startsWith("/products") &&
                                activeCategory &&
                                link.label.toLowerCase() === activeCategory.toLowerCase());

                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`
                              px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors
                              ${
                                isActive
                                  ? "bg-[#00416A] text-white"
                                  : "text-slate-700 hover:bg-gray-100"
                              }
                            `}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>

                    {/* 2. Separate Line / Divider */}
                    <div className="my-1.5 border-t border-gray-200/80" />

                    {/* 3. User / Login Section Below Divider */}
                    {user ? (
                      <div className="flex flex-col space-y-0.5">
                        <div className="px-3 py-1.5 flex items-center gap-2">
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-7 w-7 rounded-full border border-[#00416A] object-cover"
                          />
                          <div className="truncate">
                            <p className="font-bold text-stone-800 text-xs truncate">
                              {user.name}
                            </p>
                            <p className="text-blue-500 text-[10px] font-semibold">
                              {user.role}
                            </p>
                          </div>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
                        >
                          <LayoutGrid size={14} className="text-stone-400" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
                        >
                          <User size={14} className="text-stone-400" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                        >
                          <LogOut size={14} />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#00416A] hover:bg-gray-100 transition-colors"
                      >
                        <LogIn size={14} />
                        Login
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}










// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable react-hooks/immutability */
// import { useState, useRef, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Heart, ShoppingCart, LayoutGrid, User, Menu, X, LogIn, LogOut } from "lucide-react";
// import { deleteCookie, getCookie } from "@/utils/cookies";
// import type { FakeUser } from "@/types/user.type";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";

// // 🎯 ProductSearch কম্পোনেন্ট
// import ProductSearch from "@/components/modules/Product/ProductSearch";

// interface NavLink {
//   label: string;
//   path: string;
// }

// const navLinks: NavLink[] = [
//   { label: "Home", path: "/" },
//   { label: "Decor", path: "/decor" },
//   { label: "Clothing", path: "/clothing" },
//   { label: "Electronics", path: "/electronics" },
// ];

// export default function Navbar() {
//   const location = useLocation();
//   const [pillStyle, setPillStyle] = useState({ width: 0, translateX: 0 });
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [user, setUser] = useState<FakeUser | null>(null);
//   const { data } = useGetFooterSettingsQuery();
//   const { activeCategory } = useActiveCategory();

//   const navRef = useRef<HTMLDivElement>(null);
//   const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

//   const getCompanyKey = (pathname: string) => {
//     if (pathname.startsWith("/decor") || pathname.startsWith("/products")) {
//       return "verin-decor";
//     }
//     if (pathname.startsWith("/electronics")) {
//       return "verin-electronics";
//     }
//     if (pathname.startsWith("/clothing")) {
//       return "verin-clothing";
//     }
//     return "verin-group";
//   };

//   const companyKey = getCompanyKey(location.pathname);

//   // 🎯 ডাইনামিক লোগো ইউআরএল তৈরি করার লজিক
//   const getLogoPath = (pathname: string) => {
//     if (pathname.startsWith("/decor")) return "/decor";
//     if (pathname.startsWith("/electronics")) return "/electronics";
//     if (pathname.startsWith("/clothing")) return "/clothing";

//     if (activeCategory) {
//       const cat = activeCategory.toLowerCase();
//       if (cat.includes("decor")) return "/decor";
//       if (cat.includes("electronics")) return "/electronics";
//       if (cat.includes("clothing")) return "/clothing";
//     }

//     return "/";
//   };

//   const logoPath = getLogoPath(location.pathname);

//   const navbar = data?.success
//     ? data.data.find((f) => f.company_key === companyKey)
//     : undefined;

//   const logoUrl = navbar?.image_url
//     ? navbar.image_url
//     : navbar?.logo
//       ? `https://v.veringroup.com/storage/${navbar.logo}`
//       : null;

//   const companyName = navbar?.company_name || "Verin Group";

//   useEffect(() => {
//     const savedUser = getCookie("auth_user");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (e) {
//         console.error("Failed to parse user data from cookie", e);
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   }, [location.pathname]);

//   // পেজ রুট চেঞ্জ হলে মোবাইল মেনু বন্ধ হয়ে যাবে
//   useEffect(() => {
//     setMobileMenuOpen(false);
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (dropdownOpen) setDropdownOpen(false);
//       if (mobileMenuOpen) setMobileMenuOpen(false);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [dropdownOpen, mobileMenuOpen]);

//   useEffect(() => {
//     const activeIndex = navLinks.findIndex((link) => {
//       if (link.path === "/") return location.pathname === "/";
//       if (location.pathname.startsWith(link.path)) return true;
//       if (location.pathname.startsWith("/products") && activeCategory) {
//         return link.label.toLowerCase() === activeCategory.toLowerCase();
//       }
//       return false;
//     });

//     if (activeIndex !== -1) {
//       updatePill(activeIndex);
//     } else {
//       setPillStyle({ width: 0, translateX: 0 });
//     }
//   }, [location.pathname, activeCategory]);

//   const updatePill = (index: number) => {
//     const navEl = navRef.current;
//     const linkEl = linkRefs.current[index];
//     if (!navEl || !linkEl) return;
//     const navRect = navEl.getBoundingClientRect();
//     const linkRect = linkEl.getBoundingClientRect();
//     setPillStyle({
//       width: linkRect.width,
//       translateX: linkRect.left - navRect.left,
//     });
//   };

//   const handleLogout = () => {
//     deleteCookie("auth_user");
//     setUser(null);
//     window.location.reload();
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 w-full z-50">
//       <div>
//         <div className="flex items-center justify-between bg-white border-b-2 border-gray-200/70 h-14 shadow-lg shadow-black/5 backdrop-blur-md">
//           {/* Main Container */}
//           <div className="max-w-6xl mx-auto flex w-full items-center justify-between px-3 sm:px-4">
            
//             {/* 1. Left Section: Dynamic Logo & Link */}
//             <div className="relative min-w-0 shrink-0 z-10 max-w-[50%] sm:max-w-none">
//               <Link to={logoPath} className="flex items-center gap-1.5 sm:gap-3">
//                 {logoUrl ? (
//                   <img
//                     src={logoUrl}
//                     alt={companyName}
//                     className="h-6 sm:h-7 w-auto object-contain"
//                   />
//                 ) : null}
//                 <span className="text-base sm:text-xl font-bold home-black-text truncate sm:whitespace-nowrap">
//                   {companyName}
//                 </span>
//               </Link>
//             </div>

//             {/* 2. Middle Section: Desktop Nav Links */}
//             <div className="absolute inset-x-0 flex justify-center pointer-events-none transition-all duration-300">
//               <div
//                 ref={navRef}
//                 className={`
//                   relative hidden items-center gap-1 rounded-full p-1 lg:flex pointer-events-auto
//                   transition-all duration-300
//                   ${searchOpen ? "-translate-x-12 xl:-translate-x-16" : "translate-x-0"}
//                 `}
//               >
//                 <span
//                   className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-[#262626] home-black-text transition-all duration-300 dark:bg-white"
//                   style={{
//                     width: pillStyle.width,
//                     transform: `translateX(${pillStyle.translateX}px)`,
//                   }}
//                 />
//                 {navLinks.map((link, index) => {
//                   const isActive =
//                     link.path === "/"
//                       ? location.pathname === "/"
//                       : location.pathname.startsWith(link.path) ||
//                         (location.pathname.startsWith("/products") &&
//                           activeCategory &&
//                           link.label.toLowerCase() === activeCategory.toLowerCase());
//                   return (
//                     <Link
//                       key={link.path}
//                       to={link.path}
//                       ref={(el) => {
//                         linkRefs.current[index] = el;
//                       }}
//                       className={`
//                         relative z-10 block rounded-full px-3.5 py-2
//                         text-xs font-bold uppercase tracking-wide
//                         transition-colors duration-300 xl:px-4 xl:text-[13px]
//                         ${
//                           isActive
//                             ? "text-white dark:text-[#00416A]"
//                             : "home-black-text hover:bg-gray-200/60"
//                         }
//                       `}
//                     >
//                       {link.label}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* 3. Right Section: Actions */}
//             <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:ml-auto z-10">
//               {/* ProductSearch */}
//               <div className="flex items-center">
//                 <ProductSearch
//                   searchOpen={searchOpen}
//                   setSearchOpen={setSearchOpen}
//                 />
//               </div>

//               {/* Wishlist */}
//               <button
//                 aria-label="Wishlist"
//                 className="
//                   relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full
//                   border border-[#00416A]/30 bg-transparent text-[#00416A]
//                   transition-all duration-300 hover:border-[#a5abaf]
//                   hover:bg-gray-200/60 
//                 "
//               >
//                 <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                 <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-[#262626] text-[8px] sm:text-[9px] font-bold text-white">
//                   2
//                 </span>
//               </button>

//               {/* Cart */}
//               <button
//                 aria-label="Shopping cart"
//                 className="
//                   relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full
//                   border border-[#00416A]/30 bg-transparent text-[#00416A]
//                   transition-all duration-300 hover:border-[#a5abaf]
//                   hover:bg-gray-200/60 
//                 "
//               >
//                 <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                 <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-[#262626] text-[8px] sm:text-[9px] font-bold text-white">
//                   3
//                 </span>
//               </button>

//               {/* Desktop User Profile / Dropdown (hidden in mobile if you want, but kept intact) */}
//               <div className="hidden lg:block">
//                 {user ? (
//                   <DropdownMenu
//                     open={dropdownOpen}
//                     onOpenChange={setDropdownOpen}
//                     modal={false}
//                   >
//                     <DropdownMenuTrigger asChild>
//                       <button className="focus:outline-none cursor-pointer hover:scale-105 transition-transform duration-200">
//                         <img
//                           src={user.image}
//                           alt={user.name}
//                           className="h-10 w-10 rounded-full border-2 border-[#00416A] object-cover pointer-events-none"
//                         />
//                       </button>
//                     </DropdownMenuTrigger>

//                     <DropdownMenuContent
//                       align="end"
//                       sideOffset={12}
//                       className="w-56 rounded-2xl border border-stone-100 bg-white shadow-xl py-2 px-0 z-9999"
//                     >
//                       <div className="px-5 py-3">
//                         <p className="font-bold text-stone-800 text-sm">
//                           {user.name}
//                         </p>
//                         <p className="text-blue-500 text-xs font-semibold mt-0.5">
//                           {user.role}
//                         </p>
//                       </div>
//                       <DropdownMenuSeparator className="bg-stone-100" />
//                       <div className="py-1 px-2">
//                         <Link
//                           to="/dashboard"
//                           className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                         >
//                           <LayoutGrid size={15} className="text-stone-400" />
//                           Dashboard
//                         </Link>
//                         <Link
//                           to="/profile"
//                           className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                         >
//                           <User size={15} className="text-stone-400" />
//                           Profile
//                         </Link>
//                       </div>
//                       <DropdownMenuSeparator className="bg-stone-100" />
//                       <div className="px-4 py-2">
//                         <button
//                           onClick={handleLogout}
//                           className="w-24 py-1.5 bg-[#E30613] hover:bg-red-700 hover:cursor-pointer text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-sm"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className="
//                       flex h-10 px-5 shrink-0 items-center justify-center rounded-full
//                       border border-[#00416A]/30 bg-transparent home-black-text text-sm font-semibold
//                       transition-all duration-300 hover:border-[#00416A]
//                       hover:bg-[#00416A] hover:text-white
//                     "
//                   >
//                     Login
//                   </Link>
//                 )}
//               </div>

//               {/* 🎯 Mobile Menu Toggle Button */}
//               <button
//                 aria-label="Toggle mobile menu"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="
//                   relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center
//                   rounded-full bg-[#00416A]/10 text-[#00416A]
//                   transition-all duration-300 hover:bg-[#00416A]/15
//                   lg:hidden shrink-0
//                 "
//               >
//                 {mobileMenuOpen ? (
//                   <X className="w-4 h-4 sm:w-5 sm:h-5" />
//                 ) : (
//                   <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* 🎯 Mobile Dropdown Navigation Menu */}
//         {mobileMenuOpen && (
//           <div className="lg:hidden absolute top-full right-3 mt-1.5 w-52 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
//             {/* 1. Category Nav Links */}
//             <div className="flex flex-col space-y-0.5">
//               {navLinks.map((link) => {
//                 const isActive =
//                   link.path === "/"
//                     ? location.pathname === "/"
//                     : location.pathname.startsWith(link.path) ||
//                       (location.pathname.startsWith("/products") &&
//                         activeCategory &&
//                         link.label.toLowerCase() === activeCategory.toLowerCase());

//                 return (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     onClick={() => setMobileMenuOpen(false)}
//                     className={`
//                       px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors
//                       ${
//                         isActive
//                           ? "bg-[#00416A] text-white"
//                           : "text-slate-700 hover:bg-gray-100"
//                       }
//                     `}
//                   >
//                     {link.label}
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* 2. Separate Line / Divider */}
//             <div className="my-1.5 border-t border-gray-200/80" />

//             {/* 3. User / Login Section Below Divider */}
//             {user ? (
//               <div className="flex flex-col space-y-0.5">
//                 <div className="px-3 py-1.5 flex items-center gap-2">
//                   <img
//                     src={user.image}
//                     alt={user.name}
//                     className="h-7 w-7 rounded-full border border-[#00416A] object-cover"
//                   />
//                   <div className="truncate">
//                     <p className="font-bold text-stone-800 text-xs truncate">
//                       {user.name}
//                     </p>
//                     <p className="text-blue-500 text-[10px] font-semibold">
//                       {user.role}
//                     </p>
//                   </div>
//                 </div>
//                 <Link
//                   to="/dashboard"
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
//                 >
//                   <LayoutGrid size={14} className="text-stone-400" />
//                   Dashboard
//                 </Link>
//                 <Link
//                   to="/profile"
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
//                 >
//                   <User size={14} className="text-stone-400" />
//                   Profile
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
//                 >
//                   <LogOut size={14} />
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#00416A] hover:bg-gray-100 transition-colors"
//               >
//                 <LogIn size={14} />
//                 Login
//               </Link>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }







// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable react-hooks/immutability */
// import { useState, useRef, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Heart, ShoppingCart, LayoutGrid, User } from "lucide-react";
// import { deleteCookie, getCookie } from "@/utils/cookies";
// import type { FakeUser } from "@/types/user.type";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";

// // 🎯 ProductSearch কম্পোনেন্টটি ইম্পোর্ট করা হলো
// import ProductSearch from "@/components/modules/Product/ProductSearch";

// interface NavLink {
//   label: string;
//   path: string;
// }

// const navLinks: NavLink[] = [
//   { label: "Home", path: "/" },
//   { label: "Decor", path: "/decor" },
//   { label: "Clothing", path: "/clothing" },
//   { label: "Electronics", path: "/electronics" },
// ];

// export default function Navbar() {
//   const location = useLocation();
//   const [pillStyle, setPillStyle] = useState({ width: 0, translateX: 0 });
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [user, setUser] = useState<FakeUser | null>(null);
//   const { data } = useGetFooterSettingsQuery();
//   const { activeCategory } = useActiveCategory();

//   const navRef = useRef<HTMLDivElement>(null);
//   const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

//   const getCompanyKey = (pathname: string) => {
//     if (pathname.startsWith("/decor") || pathname.startsWith("/products")) {
//       return "verin-decor";
//     }
//     if (pathname.startsWith("/electronics")) {
//       return "verin-electronics";
//     }
//     if (pathname.startsWith("/clothing")) {
//       return "verin-clothing";
//     }
//     return "verin-group";
//   };

//   const companyKey = getCompanyKey(location.pathname);

//   // 🎯 ডাইনামিক লোগো ইউআরএল তৈরি করার লজিক (Product Details পেজের activeCategory সাপোর্ট সহ)
//   const getLogoPath = (pathname: string) => {
//     // ১. প্রথমে ইউআরএল পাথ চেক করবে
//     if (pathname.startsWith("/decor")) return "/decor";
//     if (pathname.startsWith("/electronics")) return "/electronics";
//     if (pathname.startsWith("/clothing")) return "/clothing";

//     // ২. প্রোডাক্ট ডিটেইলস পেজে থাকলে (বা ইউআরএল /products হলে) activeCategory দিয়ে চিহ্নিত করবে
//     if (activeCategory) {
//       const cat = activeCategory.toLowerCase();
//       if (cat.includes("decor")) return "/decor";
//       if (cat.includes("electronics")) return "/electronics";
//       if (cat.includes("clothing")) return "/clothing";
//     }

//     return "/"; // ডিফল্ট হোমপেজ
//   };

//   const logoPath = getLogoPath(location.pathname);

//   const navbar = data?.success
//     ? data.data.find((f) => f.company_key === companyKey)
//     : undefined;

//   const logoUrl = navbar?.image_url
//     ? navbar.image_url
//     : navbar?.logo
//       ? `https://v.veringroup.com/storage/${navbar.logo}`
//       : null;

//   const companyName = navbar?.company_name || "Verin Group";

//   useEffect(() => {
//     const savedUser = getCookie("auth_user");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (e) {
//         console.error("Failed to parse user data from cookie", e);
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (dropdownOpen) setDropdownOpen(false);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [dropdownOpen]);

//   useEffect(() => {
//     const activeIndex = navLinks.findIndex((link) => {
//       if (link.path === "/") return location.pathname === "/";
//       if (location.pathname.startsWith(link.path)) return true;
//       if (location.pathname.startsWith("/products") && activeCategory) {
//         return link.label.toLowerCase() === activeCategory.toLowerCase();
//       }
//       return false;
//     });

//     if (activeIndex !== -1) {
//       updatePill(activeIndex);
//     } else {
//       setPillStyle({ width: 0, translateX: 0 });
//     }
//   }, [location.pathname, activeCategory]);

//   const updatePill = (index: number) => {
//     const navEl = navRef.current;
//     const linkEl = linkRefs.current[index];
//     if (!navEl || !linkEl) return;
//     const navRect = navEl.getBoundingClientRect();
//     const linkRect = linkEl.getBoundingClientRect();
//     setPillStyle({
//       width: linkRect.width,
//       translateX: linkRect.left - navRect.left,
//     });
//   };

//   const handleLogout = () => {
//     deleteCookie("auth_user");
//     setUser(null);
//     window.location.reload();
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 w-full z-50">
//       <div>
//         <div className="flex items-center justify-between bg-white border-b-2 border-gray-200/70 h-14 shadow-lg shadow-black/5 backdrop-blur-md">
//           {/* Main Container */}
//           <div className="max-w-6xl mx-auto flex w-full items-center justify-between px-4">
            
//             {/* 1. Left Section: Dynamic Logo & Link */}
//             <div className="relative min-w-0 shrink-0 z-10">
//               {/* 🎯 dynamic logoPath ব্যবহার করা হয়েছে */}
//               <Link to={logoPath} className="flex items-center gap-3">
//                 {logoUrl ? (
//                   <img
//                     src={logoUrl}
//                     alt={companyName}
//                     className="h-7 w-auto object-contain"
//                   />
//                 ) : null}
//                 <span className="text-xl font-bold home-black-text whitespace-nowrap">
//                   {companyName}
//                 </span>
//               </Link>
//             </div>

//             {/* 2. Middle Section: Desktop Nav Links */}
//             <div className="absolute inset-x-0 flex justify-center pointer-events-none transition-all duration-300">
//               <div
//                 ref={navRef}
//                 className={`
//                   relative hidden items-center gap-1 rounded-full p-1 lg:flex pointer-events-auto
//                   transition-all duration-300
//                   ${searchOpen ? "-translate-x-12 xl:-translate-x-16" : "translate-x-0"}
//                 `}
//               >
//                 <span
//                   className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-[#262626] home-black-text transition-all duration-300 dark:bg-white"
//                   style={{
//                     width: pillStyle.width,
//                     transform: `translateX(${pillStyle.translateX}px)`,
//                   }}
//                 />
//                 {navLinks.map((link, index) => {
//                   const isActive =
//                     link.path === "/"
//                       ? location.pathname === "/"
//                       : location.pathname.startsWith(link.path) ||
//                         (location.pathname.startsWith("/products") &&
//                           activeCategory &&
//                           link.label.toLowerCase() === activeCategory.toLowerCase());
//                   return (
//                     <Link
//                       key={link.path}
//                       to={link.path}
//                       ref={(el) => {
//                         linkRefs.current[index] = el;
//                       }}
//                       className={`
//                         relative z-10 block rounded-full px-3.5 py-2
//                         text-xs font-bold uppercase tracking-wide
//                         transition-colors duration-300 xl:px-4 xl:text-[13px]
//                         ${
//                           isActive
//                             ? "text-white dark:text-[#00416A]"
//                             : "home-black-text hover:bg-gray-200/60"
//                         }
//                       `}
//                     >
//                       {link.label}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* 3. Right Section: Actions */}
//             <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-auto z-10">
//               {/* ProductSearch */}
//               <div className="hidden md:flex items-center">
//                 <ProductSearch
//                   searchOpen={searchOpen}
//                   setSearchOpen={setSearchOpen}
//                 />
//               </div>

//               {/* Wishlist */}
//               <button
//                 aria-label="Wishlist"
//                 className="
//                   relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full
//                   border border-[#00416A]/30 bg-transparent text-[#00416A]
//                   transition-all duration-300 hover:border-[#a5abaf]
//                   hover:bg-gray-200/60 
//                 "
//               >
//                 <Heart size={16} />
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#262626] text-[9px] font-bold text-white">
//                   2
//                 </span>
//               </button>

//               {/* Cart */}
//               <button
//                 aria-label="Shopping cart"
//                 className="
//                   relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full
//                   border border-[#00416A]/30 bg-transparent text-[#00416A]
//                   transition-all duration-300 hover:border-[#a5abaf]
//                   hover:bg-gray-200/60 
//                 "
//               >
//                 <ShoppingCart size={16} />
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#262626] text-[9px] font-bold text-white">
//                   3
//                 </span>
//               </button>

//               {/* User Profile / Dropdown */}
//               {user ? (
//                 <DropdownMenu
//                   open={dropdownOpen}
//                   onOpenChange={setDropdownOpen}
//                   modal={false}
//                 >
//                   <DropdownMenuTrigger asChild>
//                     <button className="focus:outline-none cursor-pointer hover:scale-105 transition-transform duration-200">
//                       <img
//                         src={user.image}
//                         alt={user.name}
//                         className="h-10 w-10 rounded-full border-2 border-[#00416A] object-cover pointer-events-none"
//                       />
//                     </button>
//                   </DropdownMenuTrigger>

//                   <DropdownMenuContent
//                     align="end"
//                     sideOffset={12}
//                     className="w-56 rounded-2xl border border-stone-100 bg-white shadow-xl py-2 px-0 z-9999"
//                   >
//                     <div className="px-5 py-3">
//                       <p className="font-bold text-stone-800 text-sm">
//                         {user.name}
//                       </p>
//                       <p className="text-blue-500 text-xs font-semibold mt-0.5">
//                         {user.role}
//                       </p>
//                     </div>
//                     <DropdownMenuSeparator className="bg-stone-100" />
//                     <div className="py-1 px-2">
//                       <Link
//                         to="/dashboard"
//                         className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                       >
//                         <LayoutGrid size={15} className="text-stone-400" />
//                         Dashboard
//                       </Link>
//                       <Link
//                         to="/profile"
//                         className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                       >
//                         <User size={15} className="text-stone-400" />
//                         Profile
//                       </Link>
//                     </div>
//                     <DropdownMenuSeparator className="bg-stone-100" />
//                     <div className="px-4 py-2">
//                       <button
//                         onClick={handleLogout}
//                         className="w-24 py-1.5 bg-[#E30613] hover:bg-red-700 hover:cursor-pointer text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-sm"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="
//                     flex h-10 px-5 shrink-0 items-center justify-center rounded-full
//                     border border-[#00416A]/30 bg-transparent home-black-text text-sm font-semibold
//                     transition-all duration-300 hover:border-[#00416A]
//                     hover:bg-[#00416A] hover:text-white
//                   "
//                 >
//                   Login
//                 </Link>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 aria-label="Toggle mobile menu"
//                 className="
//                   relative flex h-10 w-10 items-center justify-center
//                   rounded-full bg-[#00416A]/10 text-[#00416A]
//                   transition-all duration-300 hover:bg-[#00416A]/15
//                   lg:hidden
//                 "
//               >
//                 <svg
//                   width="18"
//                   height="18"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M4 5h16M4 12h16M4 19h16" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }












// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable react-hooks/immutability */
// import { useState, useRef, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Heart, ShoppingCart, LayoutGrid, User } from "lucide-react";
// import { deleteCookie, getCookie } from "@/utils/cookies";
// import type { FakeUser } from "@/types/user.type";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";

// // 🎯 ProductSearch কম্পোনেন্টটি ইম্পোর্ট করা হলো
// import ProductSearch from "@/components/modules/Product/ProductSearch";

// interface NavLink {
//   label: string;
//   path: string;
// }

// const navLinks: NavLink[] = [
//   { label: "Home", path: "/" },
//   { label: "Decor", path: "/decor" },
//   { label: "Clothing", path: "/clothing" },
//   { label: "Electronics", path: "/electronics" },
// ];

// export default function Navbar() {
//   const location = useLocation();
//   const [pillStyle, setPillStyle] = useState({ width: 0, translateX: 0 });
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [user, setUser] = useState<FakeUser | null>(null);
//   const { data } = useGetFooterSettingsQuery();
//   const { activeCategory } = useActiveCategory();

//   const navRef = useRef<HTMLDivElement>(null);
//   const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

//   const getCompanyKey = (pathname: string) => {
//     if (pathname.startsWith("/decor") || pathname.startsWith("/products")) {
//       return "verin-decor";
//     }
//     if (pathname.startsWith("/electronics")) {
//       return "verin-electronics";
//     }
//     if (pathname.startsWith("/clothing")) {
//       return "verin-clothing";
//     }
//     return "verin-group";
//   };

//   const companyKey = getCompanyKey(location.pathname);

//   // 🎯 ডাইনামিক লোগো ইউআরএল তৈরি করার লজিক
//   const getLogoPath = (pathname: string) => {
//     if (pathname.startsWith("/decor")) return "/decor";
//     if (pathname.startsWith("/electronics")) return "/electronics";
//     if (pathname.startsWith("/clothing")) return "/clothing";
//     return "/"; // ডিফল্ট হোমপেজ
//   };

//   const logoPath = getLogoPath(location.pathname);

//   const navbar = data?.success
//     ? data.data.find((f) => f.company_key === companyKey)
//     : undefined;

//   const logoUrl = navbar?.image_url
//     ? navbar.image_url
//     : navbar?.logo
//       ? `https://v.veringroup.com/storage/${navbar.logo}`
//       : null;

//   const companyName = navbar?.company_name || "Verin Group";

//   useEffect(() => {
//     const savedUser = getCookie("auth_user");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (e) {
//         console.error("Failed to parse user data from cookie", e);
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (dropdownOpen) setDropdownOpen(false);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [dropdownOpen]);

//   useEffect(() => {
//     const activeIndex = navLinks.findIndex((link) => {
//       if (link.path === "/") return location.pathname === "/";
//       if (location.pathname.startsWith(link.path)) return true;
//       if (location.pathname.startsWith("/products") && activeCategory) {
//         return link.label.toLowerCase() === activeCategory.toLowerCase();
//       }
//       return false;
//     });

//     if (activeIndex !== -1) {
//       updatePill(activeIndex);
//     } else {
//       setPillStyle({ width: 0, translateX: 0 });
//     }
//   }, [location.pathname, activeCategory]);

//   const updatePill = (index: number) => {
//     const navEl = navRef.current;
//     const linkEl = linkRefs.current[index];
//     if (!navEl || !linkEl) return;
//     const navRect = navEl.getBoundingClientRect();
//     const linkRect = linkEl.getBoundingClientRect();
//     setPillStyle({
//       width: linkRect.width,
//       translateX: linkRect.left - navRect.left,
//     });
//   };

//   const handleLogout = () => {
//     deleteCookie("auth_user");
//     setUser(null);
//     window.location.reload();
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 w-full z-50">
//       <div>
//         <div className="flex items-center justify-between bg-white border-b-2 border-gray-200/70 h-14 shadow-lg shadow-black/5 backdrop-blur-md">
//           {/* Main Container */}
//           <div className="max-w-6xl mx-auto flex w-full items-center justify-between px-4">
            
//             {/* 1. Left Section: Dynamic Logo & Link */}
//             <div className="relative min-w-0 shrink-0 z-10">
//               {/* 🎯 dynamic logoPath ব্যবহার করা হয়েছে */}
//               <Link to={logoPath} className="flex items-center gap-3">
//                 {logoUrl ? (
//                   <img
//                     src={logoUrl}
//                     alt={companyName}
//                     className="h-7 w-auto object-contain"
//                   />
//                 ) : null}
//                 <span className="text-xl font-bold home-black-text whitespace-nowrap">
//                   {companyName}
//                 </span>
//               </Link>
//             </div>

//             {/* 2. Middle Section: Desktop Nav Links */}
//             <div className="absolute inset-x-0 flex justify-center pointer-events-none transition-all duration-300">
//               <div
//                 ref={navRef}
//                 className={`
//                   relative hidden items-center gap-1 rounded-full p-1 lg:flex pointer-events-auto
//                   transition-all duration-300
//                   ${searchOpen ? "-translate-x-12 xl:-translate-x-16" : "translate-x-0"}
//                 `}
//               >
//                 <span
//                   className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-[#262626] home-black-text transition-all duration-300 dark:bg-white"
//                   style={{
//                     width: pillStyle.width,
//                     transform: `translateX(${pillStyle.translateX}px)`,
//                   }}
//                 />
//                 {navLinks.map((link, index) => {
//                   const isActive =
//                     link.path === "/"
//                       ? location.pathname === "/"
//                       : location.pathname.startsWith(link.path) ||
//                         (location.pathname.startsWith("/products") &&
//                           activeCategory &&
//                           link.label.toLowerCase() === activeCategory.toLowerCase());
//                   return (
//                     <Link
//                       key={link.path}
//                       to={link.path}
//                       ref={(el) => {
//                         linkRefs.current[index] = el;
//                       }}
//                       className={`
//                         relative z-10 block rounded-full px-3.5 py-2
//                         text-xs font-bold uppercase tracking-wide
//                         transition-colors duration-300 xl:px-4 xl:text-[13px]
//                         ${
//                           isActive
//                             ? "text-white dark:text-[#00416A]"
//                             : "home-black-text hover:bg-gray-200/60"
//                         }
//                       `}
//                     >
//                       {link.label}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* 3. Right Section: Actions */}
//             <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-auto z-10">
//               {/* ProductSearch */}
//               <div className="hidden md:flex items-center">
//                 <ProductSearch
//                   searchOpen={searchOpen}
//                   setSearchOpen={setSearchOpen}
//                 />
//               </div>

//               {/* Wishlist */}
//               <button
//                 aria-label="Wishlist"
//                 className="
//                   relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full
//                   border border-[#00416A]/30 bg-transparent text-[#00416A]
//                   transition-all duration-300 hover:border-[#a5abaf]
//                   hover:bg-gray-200/60 
//                 "
//               >
//                 <Heart size={16} />
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#262626] text-[9px] font-bold text-white">
//                   2
//                 </span>
//               </button>

//               {/* Cart */}
//               <button
//                 aria-label="Shopping cart"
//                 className="
//                   relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full
//                   border border-[#00416A]/30 bg-transparent text-[#00416A]
//                   transition-all duration-300 hover:border-[#a5abaf]
//                   hover:bg-gray-200/60 
//                 "
//               >
//                 <ShoppingCart size={16} />
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#262626] text-[9px] font-bold text-white">
//                   3
//                 </span>
//               </button>

//               {/* User Profile / Dropdown */}
//               {user ? (
//                 <DropdownMenu
//                   open={dropdownOpen}
//                   onOpenChange={setDropdownOpen}
//                   modal={false}
//                 >
//                   <DropdownMenuTrigger asChild>
//                     <button className="focus:outline-none cursor-pointer hover:scale-105 transition-transform duration-200">
//                       <img
//                         src={user.image}
//                         alt={user.name}
//                         className="h-10 w-10 rounded-full border-2 border-[#00416A] object-cover pointer-events-none"
//                       />
//                     </button>
//                   </DropdownMenuTrigger>

//                   <DropdownMenuContent
//                     align="end"
//                     sideOffset={12}
//                     className="w-56 rounded-2xl border border-stone-100 bg-white shadow-xl py-2 px-0 z-9999"
//                   >
//                     <div className="px-5 py-3">
//                       <p className="font-bold text-stone-800 text-sm">
//                         {user.name}
//                       </p>
//                       <p className="text-blue-500 text-xs font-semibold mt-0.5">
//                         {user.role}
//                       </p>
//                     </div>
//                     <DropdownMenuSeparator className="bg-stone-100" />
//                     <div className="py-1 px-2">
//                       <Link
//                         to="/dashboard"
//                         className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                       >
//                         <LayoutGrid size={15} className="text-stone-400" />
//                         Dashboard
//                       </Link>
//                       <Link
//                         to="/profile"
//                         className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                       >
//                         <User size={15} className="text-stone-400" />
//                         Profile
//                       </Link>
//                     </div>
//                     <DropdownMenuSeparator className="bg-stone-100" />
//                     <div className="px-4 py-2">
//                       <button
//                         onClick={handleLogout}
//                         className="w-24 py-1.5 bg-[#E30613] hover:bg-red-700 hover:cursor-pointer text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-sm"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="
//                     flex h-10 px-5 shrink-0 items-center justify-center rounded-full
//                     border border-[#00416A]/30 bg-transparent home-black-text text-sm font-semibold
//                     transition-all duration-300 hover:border-[#00416A]
//                     hover:bg-[#00416A] hover:text-white
//                   "
//                 >
//                   Login
//                 </Link>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 aria-label="Toggle mobile menu"
//                 className="
//                   relative flex h-10 w-10 items-center justify-center
//                   rounded-full bg-[#00416A]/10 text-[#00416A]
//                   transition-all duration-300 hover:bg-[#00416A]/15
//                   lg:hidden
//                 "
//               >
//                 <svg
//                   width="18"
//                   height="18"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M4 5h16M4 12h16M4 19h16" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }











// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable react-hooks/immutability */
// import { useState, useRef, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Heart, ShoppingCart, LayoutGrid, User } from "lucide-react";
// import { deleteCookie, getCookie } from "@/utils/cookies";
// import type { FakeUser } from "@/types/user.type";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";

// // 🎯 ProductSearch কম্পোনেন্টটি ইম্পোর্ট করা হলো
// import ProductSearch from "@/components/modules/Product/ProductSearch";

// interface NavLink {
//   label: string;
//   path: string;
// }

// const navLinks: NavLink[] = [
//   { label: "Home", path: "/" },
//   { label: "Decor", path: "/decor" },
//   { label: "Clothing", path: "/clothing" },
//   { label: "Electronics", path: "/electronics" },
// ];

// export default function Navbar() {
//   const location = useLocation();
//   const [pillStyle, setPillStyle] = useState({ width: 0, translateX: 0 });
//   const [searchOpen, setSearchOpen] = useState(false); // 🎯 এই স্টেটটিই ProductSearch কে কন্ট্রোল করবে
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [user, setUser] = useState<FakeUser | null>(null);
//   const { data } = useGetFooterSettingsQuery();
//   const { activeCategory } = useActiveCategory();

//   const navRef = useRef<HTMLDivElement>(null);
//   const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  
//   // const companyKey = 
//   // location.pathname.startsWith("/decor") || location.pathname.startsWith("/products")
//   //   ? "verin-decor"
//   //   : location.pathname.startsWith("/electronics")
//   //     ? "verin-electronics"
//   //     : "verin-group";

//   const getCompanyKey = (pathname: string) => {
//   if (pathname.startsWith("/decor") || pathname.startsWith("/products")) {
//     return "verin-decor";
//   }
//   if (pathname.startsWith("/electronics")) {
//     return "verin-electronics";
//   }
//   if (pathname.startsWith("/clothing")) {
//     return "verin-clothing";
//   }
//   return "verin-group";
// };


// const companyKey = getCompanyKey(location.pathname);



//   const navbar = data?.success
//     ? data.data.find((f) => f.company_key === companyKey)
//     : undefined;

//   const logoUrl = navbar?.image_url
//     ? navbar.image_url
//     : navbar?.logo
//       ? `https://v.veringroup.com/storage/${navbar.logo}`
//       : null;

//   const companyName = navbar?.company_name || "Verin Group";

//   useEffect(() => {
//     const savedUser = getCookie("auth_user");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (e) {
//         console.error("Failed to parse user data from cookie", e);
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (dropdownOpen) setDropdownOpen(false);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [dropdownOpen]);

//   useEffect(() => {
//     const activeIndex = navLinks.findIndex((link) => {
//       if (link.path === "/") return location.pathname === "/";
//       if (location.pathname.startsWith(link.path)) return true;
//       if (location.pathname.startsWith("/products") && activeCategory) {
//         return link.label.toLowerCase() === activeCategory.toLowerCase();
//       }
//       return false;
//     });
    
//     if (activeIndex !== -1) {
//       updatePill(activeIndex);
//     } else {
//       setPillStyle({ width: 0, translateX: 0 }); 
//     }
//   }, [location.pathname, activeCategory]);

//   const updatePill = (index: number) => {
//     const navEl = navRef.current;
//     const linkEl = linkRefs.current[index];
//     if (!navEl || !linkEl) return;
//     const navRect = navEl.getBoundingClientRect();
//     const linkRect = linkEl.getBoundingClientRect();
//     setPillStyle({
//       width: linkRect.width,
//       translateX: linkRect.left - navRect.left,
//     });
//   };

//   const handleLogout = () => {
//     deleteCookie("auth_user");
//     setUser(null);
//     window.location.reload();
//   };

//   return (
//     // <nav className="fixed left-0 w-full right-0 z-50 overflow-x-hidden">
//     //   <div>
//     //     <div className="flex items-center justify-between bg-white border-b-2 border-gray-200/70 h-14 shadow-lg shadow-black/5 backdrop-blur-md">
//     <nav className="fixed top-0 left-0 right-0 w-full z-50">
//     <div>
//       {/* 🎯 এখানেও overflow-x-hidden বা overflow-hidden রাখা যাবে না */}
//       <div className="flex items-center justify-between bg-white border-b-2 border-gray-200/70 h-14 shadow-lg shadow-black/5 backdrop-blur-md">
          
//           {/* Main Container */}
//           <div className="max-w-6xl mx-auto flex w-full items-center justify-between px-4">
            
//             {/* 1. Left Section: Logo */}
//             <div className="relative min-w-0 shrink-0 z-10">
//               <Link to="/" className="flex items-center gap-3">
//                 {logoUrl ? (
//                   <img
//                     src={logoUrl}
//                     alt={companyName}
//                     className="h-7 w-auto object-contain"
//                   />
//                 ) : null}
//                 <span className="text-xl font-bold home-black-text whitespace-nowrap">
//                   {companyName}
//                 </span>
//               </Link>
//             </div>

//             {/* 2. Middle Section: Desktop Nav Links (সার্চ ওপেন হলে বামে সরে যাবে) */}
//             <div className="absolute inset-x-0 flex justify-center pointer-events-none transition-all duration-300">
//               <div
//                 ref={navRef}
//                 className={`
//                   relative hidden items-center gap-1 rounded-full p-1 lg:flex pointer-events-auto
//                   transition-all duration-300
//                   ${searchOpen ? "-translate-x-12 xl:-translate-x-16" : "translate-x-0"}
//                 `}
//               >
//                 <span
//                   className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-[#262626] home-black-text transition-all duration-300 dark:bg-white"
//                   style={{
//                     width: pillStyle.width,
//                     transform: `translateX(${pillStyle.translateX}px)`,
//                   }}
//                 />
//                 {navLinks.map((link, index) => {
//                   const isActive =
//                     link.path === "/"
//                       ? location.pathname === "/"
//                       : location.pathname.startsWith(link.path) ||
//                         (location.pathname.startsWith("/products") &&
//                           activeCategory &&
//                           link.label.toLowerCase() === activeCategory.toLowerCase());
//                   return (
//                     <Link
//                       key={link.path}
//                       to={link.path}
//                       ref={(el) => { linkRefs.current[index] = el; }}
//                       className={`
//                         relative z-10 block rounded-full px-3.5 py-2
//                         text-xs font-bold uppercase tracking-wide
//                         transition-colors duration-300 xl:px-4 xl:text-[13px]
//                         ${isActive
//                           ? "text-white dark:text-[#00416A]"
//                           : "home-black-text hover:bg-gray-200/60"
//                         }
//                       `}
//                     >
//                       {link.label}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* 3. Right Section: Actions */}
//             <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-auto z-10">

//               {/* 🎯 ইম্পোর্টেড ProductSearch কম্পোনেন্ট এখানে কল করা হলো */}
//               <div className="hidden md:flex items-center">
//                 <ProductSearch searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
//               </div>

//               {/* Wishlist */}
//               <button
//                 aria-label="Wishlist"
//                 className="
//                   relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full
//                   border border-[#00416A]/30 bg-transparent text-[#00416A]
//                   transition-all duration-300 hover:border-[#a5abaf]
//                   hover:bg-gray-200/60 
//                 "
//               >
//                 <Heart size={16} />
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#262626] text-[9px] font-bold text-white">
//                   2
//                 </span>
//               </button>

//               {/* Cart */}
//               <button
//                 aria-label="Shopping cart"
//                 className="
//                   relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full
//                   border border-[#00416A]/30 bg-transparent text-[#00416A]
//                   transition-all duration-300 hover:border-[#a5abaf]
//                   hover:bg-gray-200/60 
//                 "
//               >
//                 <ShoppingCart size={16} />
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#262626] text-[9px] font-bold text-white">
//                   3
//                 </span>
//               </button>

//               {/* User Profile / Dropdown */}
//               {user ? (
//                 <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
//                   <DropdownMenuTrigger asChild>
//                     <button className="focus:outline-none cursor-pointer hover:scale-105 transition-transform duration-200">
//                       <img
//                         src={user.image}
//                         alt={user.name}
//                         className="h-10 w-10 rounded-full border-2 border-[#00416A] object-cover pointer-events-none"
//                       />
//                     </button>
//                   </DropdownMenuTrigger>

//                   <DropdownMenuContent
//                     align="end"
//                     sideOffset={12}
//                     className="w-56 rounded-2xl border border-stone-100 bg-white shadow-xl py-2 px-0 z-9999"
//                   >
//                     <div className="px-5 py-3">
//                       <p className="font-bold text-stone-800 text-sm">{user.name}</p>
//                       <p className="text-blue-500 text-xs font-semibold mt-0.5">{user.role}</p>
//                     </div>
//                     <DropdownMenuSeparator className="bg-stone-100" />
//                     <div className="py-1 px-2">
//                       <Link
//                         to="/dashboard"
//                         className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                       >
//                         <LayoutGrid size={15} className="text-stone-400" />
//                         Dashboard
//                       </Link>
//                       <Link
//                         to="/profile"
//                         className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                       >
//                         <User size={15} className="text-stone-400" />
//                         Profile
//                       </Link>
//                     </div>
//                     <DropdownMenuSeparator className="bg-stone-100" />
//                     <div className="px-4 py-2">
//                       <button
//                         onClick={handleLogout}
//                         className="w-24 py-1.5 bg-[#E30613] hover:bg-red-700 hover:cursor-pointer text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-sm"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="
//                     flex h-10 px-5 shrink-0 items-center justify-center rounded-full
//                     border border-[#00416A]/30 bg-transparent home-black-text text-sm font-semibold
//                     transition-all duration-300 hover:border-[#00416A]
//                     hover:bg-[#00416A] hover:text-white
//                   "
//                 >
//                   Login
//                 </Link>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 aria-label="Toggle mobile menu"
//                 className="
//                   relative flex h-10 w-10 items-center justify-center
//                   rounded-full bg-[#00416A]/10 text-[#00416A]
//                   transition-all duration-300 hover:bg-[#00416A]/15
//                   lg:hidden
//                 "
//               >
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M4 5h16M4 12h16M4 19h16" />
//                 </svg>
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }











// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable react-hooks/immutability */
// import { useState, useRef, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Heart, ShoppingCart, LayoutGrid, User } from "lucide-react";
// import { deleteCookie, getCookie } from "@/utils/cookies";
// import type { FakeUser } from "@/types/user.type";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";
// import ProductSearch from "../modules/Product/ProductSearch";

// interface NavLink {
//   label: string;
//   path: string;
// }

// const navLinks: NavLink[] = [
//   { label: "Home", path: "/" },
//   { label: "Decor", path: "/decor" },
//   { label: "Clothing", path: "/clothing" },
//   { label: "Electronics", path: "/electronics" },
// ];

// export default function Navbar() {
//   const location = useLocation();
//   const [pillStyle, setPillStyle] = useState({ width: 0, translateX: 0 });
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [user, setUser] = useState<FakeUser | null>(null);
//   const { data } = useGetFooterSettingsQuery();
//   const { activeCategory } = useActiveCategory();

//   const navRef = useRef<HTMLDivElement>(null);
//   const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  
//   const companyKey = 
//   location.pathname.startsWith("/decor") || location.pathname.startsWith("/products")
//     ? "verin-decor"
//     : location.pathname.startsWith("/laptops")
//       ? "verin-electronics"
//       : "verin-group";

//   const navbar = data?.success
//     ? data.data.find((f) => f.company_key === companyKey)
//     : undefined;

//   const logoUrl = navbar?.image_url
//     ? navbar.image_url
//     : navbar?.logo
//       ? `https://v.veringroup.com/storage/${navbar.logo}`
//       : null;

//   const companyName = navbar?.company_name || "Verin Group";

//   useEffect(() => {
//     const savedUser = getCookie("auth_user");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (e) {
//         console.error("Failed to parse user data from cookie", e);
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (dropdownOpen) setDropdownOpen(false);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [dropdownOpen]);

//   useEffect(() => {
//     const activeIndex = navLinks.findIndex((link) => {
//       if (link.path === "/") return location.pathname === "/";
//       if (location.pathname.startsWith(link.path)) return true;
//       if (location.pathname.startsWith("/products") && activeCategory) {
//         return link.label.toLowerCase() === activeCategory.toLowerCase();
//       }
//       return false;
//     });
    
//     if (activeIndex !== -1) {
//       updatePill(activeIndex);
//     } else {
//       setPillStyle({ width: 0, translateX: 0 }); 
//     }
//   }, [location.pathname, activeCategory]);

//   const updatePill = (index: number) => {
//     const navEl = navRef.current;
//     const linkEl = linkRefs.current[index];
//     if (!navEl || !linkEl) return;
//     const navRect = navEl.getBoundingClientRect();
//     const linkRect = linkEl.getBoundingClientRect();
//     setPillStyle({
//       width: linkRect.width,
//       translateX: linkRect.left - navRect.left,
//     });
//   };

//   const handleLogout = () => {
//     deleteCookie("auth_user");
//     setUser(null);
//     window.location.reload();
//   };

//   return (
//     // 🎯 FIX: 'overflow-x-hidden' সরানো হয়েছে ড্রপডাউন দৃশ্যমান করার জন্য
//     <nav className="fixed left-0 w-full right-0 z-50">
//       <div>
//         <div className="flex items-center justify-between bg-white border-b-2 border-gray-200/70 h-14 shadow-lg shadow-black/5 backdrop-blur-md">
          
//           <div className="max-w-6xl mx-auto flex w-full items-center justify-between gap-4 px-4">
//             {/* Logo */}
//             <div className="relative min-w-0 shrink-0">
//               <Link to="/" className="flex items-center gap-3">
//                 {logoUrl ? (
//                   <img
//                     src={logoUrl}
//                     alt={companyName}
//                     className="h-7 w-auto object-contain"
//                   />
//                 ) : null}
//                 <span className="text-xl font-bold home-black-text whitespace-nowrap">
//                   {companyName}
//                 </span>
//               </Link>
//             </div>

//             {/* Desktop Nav Links */}
//             <div
//               ref={navRef}
//               className="relative hidden items-center gap-1 rounded-full p-1 lg:flex shrink-0"
//             >
//               <span
//                 className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-[#262626] home-black-text transition-all duration-300 dark:bg-white"
//                 style={{
//                   width: pillStyle.width,
//                   transform: `translateX(${pillStyle.translateX}px)`,
//                 }}
//               />
//               {navLinks.map((link, index) => {
//                 const isActive =
//                   link.path === "/"
//                     ? location.pathname === "/"
//                     : location.pathname.startsWith(link.path) ||
//                       (location.pathname.startsWith("/products") &&
//                         activeCategory &&
//                         link.label.toLowerCase() === activeCategory.toLowerCase());
//                 return (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     ref={(el) => { linkRefs.current[index] = el; }}
//                     className={`
//                       relative z-10 block rounded-full px-3.5 py-2
//                       text-xs font-bold uppercase tracking-wide
//                       transition-colors duration-300 xl:px-4 xl:text-[13px]
//                       ${isActive
//                         ? "text-white dark:text-[#00416A]"
//                         : "home-black-text hover:bg-gray-200/60"
//                       }
//                     `}
//                   >
//                     {link.label}
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* 🎯 Search Input Component Container */}
//             {/* <div className="flex-1 max-w-xs md:max-w-sm hidden md:block relative">
//               <ProductSearch />
//             </div> */}
//             <div className="hidden md:block relative ml-auto">
//   <ProductSearch />
// </div>

//             {/* Right Actions */}
//             <div className="flex shrink-0 items-center gap-2 sm:gap-3">
//               {/* Wishlist */}
//               <button
//                 aria-label="Wishlist"
//                 className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00416A]/30 bg-transparent text-[#00416A] transition-all duration-300 hover:border-[#00416A] hover:bg-[#00416A] hover:text-white dark:border-gray-400 dark:text-white dark:hover:bg-white dark:hover:text-[#00416A]"
//               >
//                 <Heart size={16} />
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#262626] text-[9px] font-bold text-white dark:bg-white dark:text-[#00416A]">
//                   2
//                 </span>
//               </button>

//               {/* Cart */}
//               <button
//                 aria-label="Shopping cart"
//                 className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00416A]/30 bg-transparent text-[#00416A] transition-all duration-300 hover:border-[#00416A] hover:bg-[#00416A] hover:text-white dark:border-gray-400 dark:text-white dark:hover:bg-white dark:hover:text-[#00416A]"
//               >
//                 <ShoppingCart size={16} />
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#262626] text-[9px] font-bold text-white dark:bg-white dark:text-[#00416A]">
//                   3
//                 </span>
//               </button>

//               {/* User Profile / Dropdown */}
//               {user ? (
//                 <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
//                   <DropdownMenuTrigger asChild>
//                     <button className="focus:outline-none cursor-pointer hover:scale-105 transition-transform duration-200">
//                       <img
//                         src={user.image}
//                         alt={user.name}
//                         className="h-10 w-10 rounded-full border-2 border-[#00416A] object-cover pointer-events-none"
//                       />
//                     </button>
//                   </DropdownMenuTrigger>

//                   <DropdownMenuContent
//                     align="end"
//                     sideOffset={12}
//                     className="w-56 rounded-2xl border border-stone-100 bg-white shadow-xl py-2 px-0 z-9999"
//                   >
//                     <div className="px-5 py-3">
//                       <p className="font-bold text-stone-800 text-sm">{user.name}</p>
//                       <p className="text-blue-500 text-xs font-semibold mt-0.5">{user.role}</p>
//                     </div>

//                     <DropdownMenuSeparator className="bg-stone-100" />

//                     <div className="py-1 px-2">
//                       <Link
//                         to="/dashboard"
//                         className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                       >
//                         <LayoutGrid size={15} className="text-stone-400" />
//                         Dashboard
//                       </Link>
//                       <Link
//                         to="/profile"
//                         className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                       >
//                         <User size={15} className="text-stone-400" />
//                         Profile
//                       </Link>
//                     </div>

//                     <DropdownMenuSeparator className="bg-stone-100" />

//                     <div className="px-4 py-2">
//                       <button
//                         onClick={handleLogout}
//                         className="w-24 py-1.5 bg-[#E30613] hover:bg-red-700 hover:cursor-pointer text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-sm"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="flex h-10 px-5 shrink-0 items-center justify-center rounded-full border border-[#00416A]/30 bg-transparent home-black-text text-sm font-semibold transition-all duration-300 hover:border-[#00416A] hover:bg-[#00416A] hover:text-white"
//                 >
//                   Login
//                 </Link>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 aria-label="Toggle mobile menu"
//                 className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#00416A]/10 text-[#00416A] transition-all duration-300 hover:bg-[#00416A]/15 dark:border dark:border-gray-400 dark:bg-transparent dark:text-white dark:hover:bg-white dark:hover:text-[#00416A] lg:hidden"
//               >
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M4 5h16M4 12h16M4 19h16" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }








// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable react-hooks/immutability */
// import { useState, useRef, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Search, Heart, ShoppingCart, LayoutGrid, User } from "lucide-react";
// import { deleteCookie, getCookie } from "@/utils/cookies";
// import type { FakeUser } from "@/types/user.type";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
// import { useActiveCategory } from "@/utils/ActiveCategoryContext";

// interface NavLink {
//   label: string;
//   path: string;
// }

// const navLinks: NavLink[] = [
//   { label: "Home", path: "/" },
//   { label: "Decor", path: "/decor" },
//   { label: "Clothing", path: "/clothing" },
//   { label: "Electronics", path: "/electronics" },
// ];

// export default function Navbar() {
//   const location = useLocation();
//   const [pillStyle, setPillStyle] = useState({ width: 0, translateX: 0 });
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [user, setUser] = useState<FakeUser | null>(null);
//   const { data } = useGetFooterSettingsQuery();
//   const { activeCategory } = useActiveCategory();

//   const navRef = useRef<HTMLDivElement>(null);
//   const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
//   const searchRef = useRef<HTMLInputElement>(null);
  
//   const companyKey = 
//   location.pathname.startsWith("/decor") || location.pathname.startsWith("/products")
//     ? "verin-decor"
//     : location.pathname.startsWith("/laptops")
//       ? "verin-electronics"
//       : "verin-group";

//   const navbar = data?.success
//     ? data.data.find((f) => f.company_key === companyKey)
//     : undefined;

//   const logoUrl = navbar?.image_url
//     ? navbar.image_url
//     : navbar?.logo
//       ? `https://v.veringroup.com/storage/${navbar.logo}`
//       : null;

//   const companyName = navbar?.company_name || "Verin Group";

//   useEffect(() => {
//     const savedUser = getCookie("auth_user");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (e) {
//         console.error("Failed to parse user data from cookie", e);
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (dropdownOpen) setDropdownOpen(false);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [dropdownOpen]);

//   useEffect(() => {
//     const activeIndex = navLinks.findIndex((link) => {
//       if (link.path === "/") return location.pathname === "/";
      
//       // মেইন পাথ ম্যাচিং
//       if (location.pathname.startsWith(link.path)) return true;

//       // প্রোডাক্ট ডিটেইলস পেজের ডাইনামিক ম্যাচিং (Context Value দিয়ে)
//       if (location.pathname.startsWith("/products") && activeCategory) {
//         return link.label.toLowerCase() === activeCategory.toLowerCase();
//       }

//       return false;
//     });
    
//     if (activeIndex !== -1) {
//       updatePill(activeIndex);
//     } else {
//       setPillStyle({ width: 0, translateX: 0 }); 
//     }
//   }, [location.pathname, activeCategory]);


//   useEffect(() => {
//     if (searchOpen) searchRef.current?.focus();
//   }, [searchOpen]);

//   const updatePill = (index: number) => {
//     const navEl = navRef.current;
//     const linkEl = linkRefs.current[index];
//     if (!navEl || !linkEl) return;
//     const navRect = navEl.getBoundingClientRect();
//     const linkRect = linkEl.getBoundingClientRect();
//     setPillStyle({
//       width: linkRect.width,
//       translateX: linkRect.left - navRect.left,
//     });
//   };

//   const handleLogout = () => {
//     deleteCookie("auth_user");
//     setUser(null);
//     window.location.reload();
//   };

//   return (
//     <nav className="fixed left-0  w-full right-0 z-50  overflow-x-hidden">
//       <div className="">
//         <div className="flex  items-center justify-between bg-white  border-b-2 border-gray-200/70 h-14  shadow-lg shadow-black/5 backdrop-blur-md">
          
//           <div className="max-w-6xl mx-auto flex w-full items-center justify-between">
//             {/* Logo */}
//           <div className="relative min-w-0 shrink-0">
//             <Link to="/" className="flex items-center gap-3">
//               {logoUrl ? (
//                 <img
//                   src={logoUrl}
//                   alt={companyName}
//                   className="h-7 w-auto object-contain"
//                 />
//               ) : null}
//               <span className="text-xl font-bold home-black-text whitespace-nowrap">
//                 {companyName}
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Nav Links */}
//           <div
//             ref={navRef}
//             className="relative hidden items-center gap-1 rounded-full p-1 lg:flex"
//           >
//             <span
//               className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-[#262626] home-black-text transition-all duration-300 dark:bg-white"
//               style={{
//                 width: pillStyle.width,
//                 transform: `translateX(${pillStyle.translateX}px)`,
//               }}
//             />
//             {navLinks.map((link, index) => {
//               const isActive =
//                 link.path === "/"
//                   ? location.pathname === "/"
//                   : location.pathname.startsWith(link.path) ||
//                     (location.pathname.startsWith("/products") &&
//                       activeCategory &&
//                       link.label.toLowerCase() === activeCategory.toLowerCase());
//               return (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   ref={(el) => { linkRefs.current[index] = el; }}
//                   className={`
//                     relative z-10 block rounded-full px-3.5 py-2
//                     text-xs font-bold uppercase tracking-wide
//                     transition-colors duration-300 xl:px-4 xl:text-[13px]
//                     ${isActive
//                       ? "text-white dark:text-[#00416A]"
//                       : "home-black-text hover:bg-gray-200/60"
//                     }
//                   `}
//                 >
//                   {link.label}
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Right Actions */}
//           <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-5">

//             {/* Search Bar */}
//             <div className="relative hidden items-center md:flex">
//               <div
//                 className={`
//                   flex items-center gap-2 rounded-full border
//                   border-[#00416A]/30 bg-transparent
//                   transition-all duration-300
//                   dark:border-gray-400
//                   ${searchOpen ? "w-44 px-4" : "w-10 justify-center px-0"}
//                   h-10
//                 `}
//               >
//                 <button
//                   onClick={() => setSearchOpen(!searchOpen)}
//                   aria-label="Toggle search"
//                   className="shrink-0 text-[#00416A] dark:text-white"
//                 >
//                   <Search size={16} />
//                 </button>
//                 <input
//                   ref={searchRef}
//                   type="text"
//                   placeholder="Search..."
//                   className={`
//                     bg-transparent text-xs text-slate-700 outline-none
//                     placeholder:text-slate-400
//                     dark:text-white dark:placeholder:text-gray-400
//                     transition-all duration-300
//                     ${searchOpen ? "w-full opacity-100" : "w-0 opacity-0"}
//                   `}
//                   onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
//                 />
//               </div>
//             </div>

//             {/* Wishlist */}
//             <button
//               aria-label="Wishlist"
//               className="
//                 relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full
//                 border border-[#00416A]/30 bg-transparent text-[#00416A]
//                 transition-all duration-300 hover:border-[#00416A]
//                 hover:bg-[#00416A] hover:text-white
//                 dark:border-gray-400 dark:text-white
//                 dark:hover:bg-white dark:hover:text-[#00416A]
//               "
//             >
//               <Heart size={16} />
//               <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#262626] text-[9px] font-bold text-white dark:bg-white dark:text-[#00416A]">
//                 2
//               </span>
//             </button>

//             {/* Cart */}
//             <button
//               aria-label="Shopping cart"
//               className="
//                 relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full
//                 border border-[#00416A]/30 bg-transparent text-[#00416A]
//                 transition-all duration-300 hover:border-[#00416A]
//                 hover:bg-[#00416A] hover:text-white
//                 dark:border-gray-400 dark:text-white
//                 dark:hover:bg-white dark:hover:text-[#00416A]
//               "
//             >
//               <ShoppingCart size={16} />
//               <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#262626] text-[9px] font-bold text-white dark:bg-white dark:text-[#00416A]">
//                 3
//               </span>
//             </button>

//             {/* User Profile / Dropdown */}
//             {user ? (
//               <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
//                 <DropdownMenuTrigger asChild>
//                   <button className="focus:outline-none cursor-pointer hover:scale-105 transition-transform duration-200">
//                     <img
//                       src={user.image}
//                       alt={user.name}
//                       className="h-10 w-10 rounded-full border-2 border-[#00416A] object-cover pointer-events-none"
//                     />
//                   </button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent
//                   align="end"
//                   sideOffset={12}
//                   className="w-56 rounded-2xl border border-stone-100 bg-white shadow-xl py-2 px-0 z-9999"
//                 >
//                   {/* User info */}
//                   <div className="px-5 py-3">
//                     <p className="font-bold text-stone-800 text-sm">{user.name}</p>
//                     <p className="text-blue-500 text-xs font-semibold mt-0.5">{user.role}</p>
//                   </div>

//                   <DropdownMenuSeparator className="bg-stone-100" />

//                   {/* Menu items */}
//                   <div className="py-1 px-2">
//                     <Link
//                       to="/dashboard"
//                       className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                     >
//                       <LayoutGrid size={15} className="text-stone-400" />
//                       Dashboard
//                     </Link>
//                     <Link
//                       to="/profile"
//                       className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg font-medium transition-colors"
//                     >
//                       <User size={15} className="text-stone-400" />
//                       Profile
//                     </Link>
//                   </div>

//                   <DropdownMenuSeparator className="bg-stone-100" />

//                   {/* Logout */}
//                   <div className="px-4 py-2">
//                     <button
//                       onClick={handleLogout}
//                       className="w-24 py-1.5 bg-[#E30613] hover:bg-red-700 hover:cursor-pointer text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-sm"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <Link
//                 to="/login"
//                 className="
//                   flex h-10 px-5 shrink-0 items-center justify-center rounded-full
//                   border border-[#00416A]/30 bg-transparent home-black-text text-sm font-semibold
//                   transition-all duration-300 hover:border-[#00416A]
//                   hover:bg-[#00416A] hover:text-white
//                 "
//               >
//                 Login
//               </Link>
//             )}


//             {/* Mobile Menu Button */}
//             <button
//               aria-label="Toggle mobile menu"
//               className="
//                 relative flex h-10 w-10 items-center justify-center
//                 rounded-full bg-[#00416A]/10 text-[#00416A]
//                 transition-all duration-300 hover:bg-[#00416A]/15
//                 dark:border dark:border-gray-400 dark:bg-transparent dark:text-white
//                 dark:hover:bg-white dark:hover:text-[#00416A]
//                 lg:hidden
//               "
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M4 5h16M4 12h16M4 19h16" />
//               </svg>
//             </button>
//           </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }








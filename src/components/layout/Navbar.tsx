/* eslint-disable react-hooks/immutability */
// src/components/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Decor", path: "/decor" },
  { label: "Logistics", path: "/logistics" },
  { label: "Laptops", path: "/laptops" },
];

export default function Navbar() {
  const location = useLocation();
  // const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pillStyle, setPillStyle] = useState({ width: 0, translateX: 0 });
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const activeIndex = navLinks.findIndex((link) => link.path === location.pathname);
    if (activeIndex !== -1) updatePill(activeIndex);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

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

  // const toggleTheme = () => {
  //   setIsDark(!isDark);
  //   document.documentElement.classList.toggle("dark");
  // };

  return (
    <nav className="fixed  left-0 right-0 top-4 z-50 w-full overflow-x-hidden px-3 md:px-0">
      <div
        className="mx-auto px-0 transition-all duration-500 "
        style={{
          maxWidth: "1400px",
          width: scrolled ? "75%" : "85%",
        }}
      >
        <div
          className={`
            flex max-w-full items-center justify-between rounded-full
            border px-5 backdrop-blur-md transition-all duration-500
            ${scrolled
              ? "h-14 border-gray-300/70 bg-white/60 shadow-lg shadow-black/5 dark:border-gray-400 dark:bg-slate-950/80"
              : "h-16 border-gray-300/50 bg-white shadow-none dark:border-gray-400/80 dark:bg-slate-950/50"
            }
          `}
        >
          {/* Logo */}
          <div className="relative min-w-0 shrink-0">
            <Link to="/">
              <img
                src="/logo.png"
                alt="Logo"
                className={`w-auto object-contain transition-all duration-500 hover:scale-105 ${
                  scrolled ? "h-8" : "h-10"
                }`}
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div
            ref={navRef}
            className="relative hidden items-center gap-1 rounded-full p-1 lg:flex"
          >
            <span
              className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-[#00416A] transition-all duration-300 dark:bg-white"
              style={{
                width: pillStyle.width,
                transform: `translateX(${pillStyle.translateX}px)`,
              }}
            />
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  ref={(el) => { linkRefs.current[index] = el; }}
                  className={`
                    relative z-10 block rounded-full px-3.5 py-2
                    text-xs font-bold uppercase tracking-wide
                    transition-colors duration-300 xl:px-4 xl:text-[13px]
                    ${isActive
                      ? "text-white dark:text-[#00416A]"
                      : "text-slate-700 hover:bg-gray-200/60 dark:text-white dark:hover:text-[#00416A]"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-5">

            {/* Search Bar */}
            <div className="relative hidden items-center md:flex">
              <div
                className={`
                  flex items-center gap-2 rounded-full border
                  border-[#00416A]/30 bg-transparent
                  transition-all duration-300
                  dark:border-gray-400
                  ${searchOpen ? "w-44 px-4" : "w-10 justify-center px-0"}
                  h-10
                `}
              >
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Toggle search"
                  className="shrink-0 text-[#00416A] dark:text-white"
                >
                  <Search size={16} />
                </button>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search..."
                  className={`
                    bg-transparent text-xs text-slate-700 outline-none
                    placeholder:text-slate-400
                    dark:text-white dark:placeholder:text-gray-400
                    transition-all duration-300
                    ${searchOpen ? "w-full opacity-100" : "w-0 opacity-0"}
                  `}
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            </div>

            {/* Wishlist */}
            <button
              aria-label="Wishlist"
              className="
                relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                border border-[#00416A]/30 bg-transparent text-[#00416A]
                transition-all duration-300 hover:border-[#00416A]
                hover:bg-[#00416A] hover:text-white
                dark:border-gray-400 dark:text-white
                dark:hover:bg-white dark:hover:text-[#00416A]
              "
            >
              <Heart size={16} />
              {/* Badge */}
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#00416A] text-[9px] font-bold text-white dark:bg-white dark:text-[#00416A]">
                2
              </span>
            </button>

            {/* Cart */}
            <button
              aria-label="Shopping cart"
              className="
                relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                border border-[#00416A]/30 bg-transparent text-[#00416A]
                transition-all duration-300 hover:border-[#00416A]
                hover:bg-[#00416A] hover:text-white
                dark:border-gray-400 dark:text-white
                dark:hover:bg-white dark:hover:text-[#00416A]
              "
            >
              <ShoppingCart size={16} />
              {/* Badge */}
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#00416A] text-[9px] font-bold text-white dark:bg-white dark:text-[#00416A]">
                3
              </span>
            </button>

            {/* Profile */}
            <button
              aria-label="Profile"
              className="
                flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                border border-[#00416A]/30 bg-transparent text-[#00416A]
                transition-all duration-300 hover:border-[#00416A]
                hover:bg-[#00416A] hover:text-white
                dark:border-gray-400 dark:text-white
                dark:hover:bg-white dark:hover:text-[#00416A]
              "
            >
              <User size={16} />
            </button>

            {/* Dark Mode Toggle */}
            {/* <button
              onClick={toggleTheme}
              aria-label="Toggle dark and light mode"
              className="
                flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                border border-[#00416A]/30 bg-transparent text-[#00416A]
                transition-all duration-300 hover:border-[#00416A]
                hover:bg-[#00416A] hover:text-white
                dark:border-gray-400 dark:text-white
                dark:hover:bg-white dark:hover:text-[#00416A]
              "
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button> */}



            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle mobile menu"
              className="
                relative flex h-10 w-10 items-center justify-center
                rounded-full bg-[#00416A]/10 text-[#00416A]
                transition-all duration-300 hover:bg-[#00416A]/15
                dark:border dark:border-gray-400 dark:bg-transparent dark:text-white
                dark:hover:bg-white dark:hover:text-[#00416A]
                lg:hidden
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 5h16M4 12h16M4 19h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}








// /* eslint-disable react-hooks/immutability */
// // src/components/Navbar.tsx
// import { useState, useRef, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Moon, Sun, Phone } from "lucide-react";

// const navLinks = [
//   { label: "Home", path: "/" },
//   { label: "Decor", path: "/about" },
//   { label: "Logistics", path: "/logistics" },
//   { label: "Laptops", path: "/laptops" },
// //   { label: "Contact", path: "/contact" },
// //   { label: "Blogs", path: "/blogs" },
// ];

// export default function Navbar() {
//   const location = useLocation();
//   const [isDark, setIsDark] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [pillStyle, setPillStyle] = useState({ width: 0, translateX: 0 });
//   const navRef = useRef<HTMLDivElement>(null);
//   const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const activeIndex = navLinks.findIndex(
//       (link) => link.path === location.pathname
//     );
//     if (activeIndex !== -1) updatePill(activeIndex);
//   }, [location.pathname]);

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

//   const toggleTheme = () => {
//     setIsDark(!isDark);
//     document.documentElement.classList.toggle("dark");
//   };

//   return (
//     <nav className="fixed left-0 right-0 top-4 z-50 w-full overflow-x-hidden px-3 md:px-0">
//       <div
//         className="mx-auto px-0 transition-all duration-500"
//         style={{
//           maxWidth: "1400px",
//           width: scrolled ? "75%" : "85%",
//         }}
//       >
//         <div
//           className={`
//             flex max-w-full items-center justify-between rounded-full
//             border px-5 backdrop-blur-md transition-all duration-500
//             ${scrolled
//               ? "h-14 border-gray-300/70 bg-white/60 shadow-lg shadow-black/5 dark:border-gray-400 dark:bg-slate-950/80"
//               : "h-16 border-gray-300/50 bg-white/20 shadow-none dark:border-gray-400/80 dark:bg-slate-950/50"
//             }
//           `}
//         >
//           {/* Logo */}
//           <div className="relative min-w-0 shrink-0">
//             <Link to="/">
//               <img
//                 src="/logo.png"
//                 alt="Logo"
//                 className={`w-auto object-contain transition-all duration-500 hover:scale-105 ${
//                   scrolled ? "h-8" : "h-10"
//                 }`}
//               />
//             </Link>
//           </div>

//           {/* Desktop Nav Links */}
//           <div
//             ref={navRef}
//             className="relative hidden items-center gap-1 rounded-full p-1 lg:flex"
//           >
//             <span
//               className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-[#00416A] transition-all duration-300 dark:bg-white"
//               style={{
//                 width: pillStyle.width,
//                 transform: `translateX(${pillStyle.translateX}px)`,
//               }}
//             />

//             {navLinks.map((link, index) => {
//               const isActive = location.pathname === link.path;
//               return (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   ref={(el) => {
//                     linkRefs.current[index] = el;
//                 }}
//                   className={`
//                     relative z-10 block rounded-full px-3.5 py-2
//                     text-xs font-bold uppercase tracking-wide
//                     transition-colors duration-300 xl:px-4 xl:text-[13px]
//                     ${isActive
//                       ? "text-white dark:text-[#00416A]"
//                       : "text-slate-700 hover:bg-gray-200/60 dark:text-white dark:hover:text-[#00416A]"
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
//             {/* Dark Mode Toggle */}
//             <button
//               onClick={toggleTheme}
//               aria-label="Toggle dark and light mode"
//               className="
//                 flex h-10 w-10 shrink-0 items-center justify-center rounded-full
//                 border border-[#00416A]/30 bg-transparent text-[#00416A]
//                 transition-all duration-300 hover:border-[#00416A]
//                 hover:bg-[#00416A] hover:text-white
//                 dark:border-gray-400 dark:text-white
//                 dark:hover:bg-white dark:hover:text-[#00416A]
//               "
//             >
//               {isDark ? <Sun size={18} /> : <Moon size={18} />}
//             </button>

//             {/* Book a Call Button */}
//             <button
//               className="
//                 hidden h-10 items-center gap-1.5 rounded-full
//                 border border-[#00416A]/40 bg-transparent px-4
//                 font-bold text-[#00416A] text-xs uppercase tracking-wider
//                 transition-all duration-300
//                 hover:border-[#00416A] hover:bg-[#00416A] hover:text-white
//                 dark:border-gray-400 dark:bg-[#00416A] dark:text-white
//                 dark:hover:bg-transparent dark:hover:text-white
//                 md:flex
//               "
//             >
//               <Phone size={14} />
//               Book a Call
//             </button>

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
//         </div>
//       </div>
//     </nav>
//   );
// }
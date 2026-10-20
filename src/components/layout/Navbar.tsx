/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  useGetCategoriesQuery,
  useGetFooterSettingsQuery,
} from "@/redux/services/homepage/homePage.api";
import { logout } from "@/redux/slices/auth.slice";
import type { RootState } from "@/redux/store";
import { useActiveCategory } from "@/utils/ActiveCategoryContext";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import ProductSearch from "@/components/modules/Product/ProductSearch";
import { Heart, LogOut, Package, Settings, ShoppingBag, User } from "lucide-react";

import { removeAuthCookies } from "@/lib/authCookie";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useLogoutMutation } from "@/redux/auth.api";
import type { PillStyle } from "@/types/navbar.type";
import { checkIsActive, getCompanyKey, getLogoPath, navLinks } from "@/utils/navbar.utils";
import { toast } from "sonner";
import { DesktopNav } from "../modules/Navbar/DesktopNav";
import { MobileNav } from "../modules/Navbar/MobileNav";
import { NavLogo } from "../modules/Navbar/NavLogo";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const currentCategoryId = searchParams.get("category_id");
  const currentCompanyParam = searchParams.get("company");

  // Redux Auth State
  const { isAuthenticated, user} = useSelector((state: RootState) => state.auth || { isAuthenticated: false, user: null, token: null });

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const [pillStyle, setPillStyle] = useState<PillStyle>({ width: 0, translateX: 0 });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { data } = useGetFooterSettingsQuery();
  const { activeCategory } = useActiveCategory();

  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Helper bindings
  const isLinkActive = (link: (typeof navLinks)[0]) =>
    checkIsActive(
      link,
      location.pathname,
      currentCompanyParam,
      currentCategoryId,
      activeCategory,
      categories
    );

  const companyKey = getCompanyKey(location.pathname, currentCompanyParam);
  const logoPath = getLogoPath(location.pathname, currentCompanyParam, activeCategory);

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
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (dropdownOpen) setDropdownOpen(false);
      if (mobileMenuOpen) setMobileMenuOpen(false);
      if (userMenuOpen) setUserMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dropdownOpen, mobileMenuOpen, userMenuOpen]);

  useEffect(() => {
    const activeIndex = navLinks.findIndex((link) => isLinkActive(link));

    if (activeIndex !== -1) {
      updatePill(activeIndex);
    } else {
      setPillStyle({ width: 0, translateX: 0 });
    }
  }, [
    location.pathname,
    activeCategory,
    currentCategoryId,
    currentCompanyParam,
    categories,
  ]);

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

  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      toast.success("Logged out successfully");
    } catch (error) {
      // যদি টোকেন ইতিমধ্যে এক্সপায়ার হয়ে থাকে বা সার্ভার থেকে আনঅথেন্টিকেটেড দেয়, তবুও ক্লায়েন্ট সাইড ক্লিন করে দেবো
      console.error(getApiErrorMessage(error, "Logout API request failed."));
    } finally {
      removeAuthCookies();
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  const userName = user?.name || user?.email || "User";

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50">
      <div>
        <div className="flex items-center bg-white border-b-2 border-gray-200/70 h-16 shadow-lg shadow-black/5 backdrop-blur-md">
          {/* Main Container */}
          <div className="max-w-6xl mx-auto flex w-full items-center justify-between px-4 sm:px-6 lg:px-0 gap-4">
            {/* Left Section: Logo & Navlinks */}
            <div className="flex items-center gap-6 lg:gap-14 shrink-0">
              <NavLogo
                logoPath={logoPath}
                logoUrl={logoUrl}
                companyName={companyName}
              />

              {/* Desktop Navigation */}
              <DesktopNav
                navLinks={navLinks}
                pillStyle={pillStyle}
                navRef={navRef}
                linkRefs={linkRefs}
                checkIsActive={isLinkActive}
              />
            </div>

            {/* Right Section: Search, Wishlist, Cart & Auth Buttons */}
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-1.75 z-10 pl-2">
              {/* Search Bar */}
              <div className="hidden md:flex items-center">
                <ProductSearch />
              </div>

              {/* Wishlist Icon Button */}
              <Link
                to="/my-wishlist"
                aria-label="Wishlist"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <Heart className="h-4 w-4" />
              </Link>

              {/* Cart Icon Button */}
              <Link
                to="/cart"
                aria-label="Cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
              </Link>

              {/* Conditional Auth Section: Avatar/User Icon with Dropdown */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:opacity-95 transition-all focus:outline-none cursor-pointer"
                    aria-label="User menu"
                  >
                    {user?.profile?.avatar ? (
                      <img
                        src={user.profile.avatar}
                        alt={userName}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </button>

                  {/* User Sub-menu Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-gray-100 shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                      </div>

                      {/* Menu Links */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="h-4 w-4 text-gray-500" />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="h-4 w-4 text-gray-500" />
                          My Orders
                        </Link>
                      </div>

                      {/* Logout Action */}
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 text-red-500" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Login Button */}
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>

                  {/* Register Button */}
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Register
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <MobileNav
                navLinks={navLinks}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                mobileMenuRef={mobileMenuRef}
                checkIsActive={isLinkActive}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
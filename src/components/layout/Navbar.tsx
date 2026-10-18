/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  useGetCategoriesQuery,
  useGetFooterSettingsQuery,
} from "@/redux/services/homepage/homePage.api";
import { useActiveCategory } from "@/utils/ActiveCategoryContext";
import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import ProductSearch from "@/components/modules/Product/ProductSearch";

// import { navLinks, checkIsActive, getCompanyKey, getLogoPath } from "@/navbar.utils";
import type { PillStyle } from "@/types/navbar.type";
import { checkIsActive, getCompanyKey, getLogoPath, navLinks } from "@/utils/navbar.utils";
import { DesktopNav } from "../modules/Navbar/DesktopNav";
import { MobileNav } from "../modules/Navbar/MobileNav";
import { NavLogo } from "../modules/Navbar/NavLogo";

export default function Navbar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("category_id");
  const currentCompanyParam = searchParams.get("company");

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const [pillStyle, setPillStyle] = useState<PillStyle>({ width: 0, translateX: 0 });
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data } = useGetFooterSettingsQuery();
  const { activeCategory } = useActiveCategory();

  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
  }, [location.pathname]);

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

  

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50">
      <div>
        <div className="flex items-center justify-between bg-white border-b-2 border-gray-200/70 h-14 shadow-lg shadow-black/5 backdrop-blur-md">
          {/* Main Container */}
          <div className="max-w-6xl mx-auto flex w-full items-center justify-between px-4 sm:px-4 lg:px-0">
            {/* 1. Left Section: Logo */}
            <NavLogo
              logoPath={logoPath}
              logoUrl={logoUrl}
              companyName={companyName}
            />

            {/* 2. Middle Section: Desktop Navigation */}
            <DesktopNav
              navLinks={navLinks}
              searchOpen={searchOpen}
              pillStyle={pillStyle}
              navRef={navRef}
              linkRefs={linkRefs}
              checkIsActive={isLinkActive}
            />

            {/* 3. Right Section: Search & Mobile Navigation */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:ml-auto z-10">
              <div className="flex items-center">
                <ProductSearch
                  searchOpen={searchOpen}
                  setSearchOpen={setSearchOpen}
                />
              </div>

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













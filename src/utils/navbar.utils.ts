/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NavLink } from "@/types/navbar.type";


export const navLinks: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "Decor", path: "/decor" },
  { label: "Electronics", path: "/electronics" },
  { label: "Clothing", path: "/clothings" }
];

export const checkIsActive = (
  link: NavLink,
  locationPathname: string,
  currentCompanyParam: string | null,
  currentCategoryId: string | null,
  activeCategory: string | null,
  categories: any[]
): boolean => {
  if (currentCompanyParam) {
    if (currentCompanyParam === "verin-decor" && link.path === "/decor") return true;
    if (currentCompanyParam === "verin-electronics" && link.path === "/electronics") return true;
    if (currentCompanyParam === "verin-clothing" && link.path === "/clothings") return true;
    if (currentCompanyParam === "verin-group" && link.path === "/") return true;
  }

  // ২. হোম পেজ
  if (link.path === "/") {
    return locationPathname === "/";
  }

  if (locationPathname === "/search" && currentCategoryId) {
    const matchedCategory = categories.find(
      (cat: any) => cat.name?.toLowerCase() === link.label.toLowerCase()
    );

    if (matchedCategory && Number(currentCategoryId) === Number(matchedCategory.id)) {
      return true;
    }
  }

  if (locationPathname.startsWith(link.path)) {
    return true;
  }

  if (
    locationPathname.startsWith("/products") &&
    activeCategory &&
    link.label.toLowerCase() === activeCategory.toLowerCase()
  ) {
    return true;
  }

  return false;
};

export const getCompanyKey = (pathname: string, currentCompanyParam: string | null) => {
  if (currentCompanyParam) {
    return currentCompanyParam;
  }
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

export const getLogoPath = (
  pathname: string,
  currentCompanyParam: string | null,
  activeCategory: string | null
) => {
  if (currentCompanyParam) {
    if (currentCompanyParam === "verin-decor") return "/decor";
    if (currentCompanyParam === "verin-electronics") return "/electronics";
    if (currentCompanyParam === "verin-clothing") return "/clothing";
    if (currentCompanyParam === "verin-group") return "/";
  }

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
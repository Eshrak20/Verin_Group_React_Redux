/* eslint-disable @typescript-eslint/no-explicit-any */
import type { 
  CustomerServiceLink, 
 
  FooterResponse, 
  FooterLink, 
  FooterSetting
} from "@/types/footer.type";

export const customerServiceLinks: CustomerServiceLink[] = [
  { label: "Shipping", path: "/shipping", pageType: "shipping" },
  { label: "Return & Refund", path: "/return-refund", pageType: "return-refund" },
  { label: "Privacy Policy", path: "/privacy-policy", pageType: "privacy-policy" },
  { label: "Terms & Conditions", path: "/terms", pageType: "terms-conditions" },
  { label: "Orders FAQs", path: "/faq", pageType: "orders-faqs" },
];

export const getCompanyKey = (pathname: string, companyFromQuery: string | null): string => {
  if (companyFromQuery) return companyFromQuery;

  if (pathname.startsWith("/decor") || pathname.startsWith("/products")) {
    return "verin-decor";
  }
  if (pathname.startsWith("/electronics")) {
    return "verin-electronics";
  }
  return "verin-group";
};

export const getFooterBackground = (companyKey: string): string => {
  return companyKey === "verin-electronics" ? "bg-[#FFFFFF]" : "bg-[#FFFFFF]";
};

export const parseFooterData = (
  footerData: FooterResponse | undefined,
  companyKey: string
) => {
  
  const footer: FooterSetting | undefined = footerData?.success
    ? footerData.data?.find((f) => f.company_key === companyKey)
    : undefined;

  const logoUrl = footer?.image_url
    ? footer.image_url
    : footer?.logo
    ? `https://v.veringroup.com/storage/${footer.logo}`
    : null;

  const companyName = footer?.company_name || "YourBrand";
  const description = footer?.description || "";
  const copyrightText = footer?.copyright_text || "© 2026 All rights reserved.";
  const phone = footer?.contact_info?.phone || "";
  const email = footer?.contact_info?.email || "";
  const address = footer?.contact_info?.address || "";

  const socialLinks =
    footer?.social_links?.filter((s:any) => String(s.is_active) === "1") || [];

  const footerLinks: FooterLink[] =
    footer?.links
      ?.slice()
      .sort((a:any, b:any) => Number(a.sort_order) - Number(b.sort_order)) || [];

  return {
    logoUrl,
    companyName,
    description,
    copyrightText,
    phone,
    email,
    address,
    socialLinks,
    footerLinks,
  };
};
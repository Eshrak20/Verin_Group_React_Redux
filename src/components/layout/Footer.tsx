// src/components/Footer.tsx
import { Link, useLocation } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
import { getSocialIcon } from "@/utils/getSocialIcon";



const informationLinks = [
  { label: "About Us", path: "/about" },
  { label: "Blogs", path: "/blogs" },
  { label: "Shop", path: "/shop" },
  { label: "Contact us", path: "/contact" },
  { label: "My Account", path: "/account" },
];

const customerServiceLinks = [
  { label: "Shipping", path: "/shipping" },
  { label: "Return & Refund", path: "/return-refund" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Orders FAQs", path: "/faq" },
];

// export default function Footer() {
export default function Footer() {
  const { pathname } = useLocation();
  const { data } = useGetFooterSettingsQuery();

  const pageKey = pathname.startsWith("/decor")
    ? "1"
    : pathname.startsWith("/laptops")
      ? "2"
      : "0";

  const footerBg = pathname.startsWith("/decor")
    ? "bg-[#1a1a2e]"   
    : pathname.startsWith("/laptops")
      ? "bg-[#0f3460]"  
      : "bg-white/40";

  const footer = data?.success
    ? data.data.find((f) => f.page_key === pageKey)
    : undefined;

  const logoUrl = footer
    ? `https://v.veringroup.com/storage/${footer.logo}`
    : null;

  const companyName = footer?.company_name || "YourBrand";
  const description = footer?.description || "";
  const copyrightText = footer?.copyright_text || "© 2026 Maven Zone. All Rights Reserved.";
  const phone = footer?.contact_info?.phone || "";
  const email = footer?.contact_info?.email || "";
  const address = footer?.contact_info?.address || "";

  const socialLinks =
    footer?.social_links?.filter((s) => s.is_active === "1") || [];

  const footerLinks =
    footer?.links?.slice().sort((a, b) => Number(a.sort_order) - Number(b.sort_order)) || [];

  return (
    <footer className={`${footerBg} text-white`}>
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 w-fit">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span style="color:#f97316;font-size:22px;font-weight:800;">${companyName}</span>`;
                    }
                  }}
                />
              ) : (
                <span style={{ color: "#f97316", fontSize: "22px", fontWeight: 800 }}>
                  {companyName}
                </span>
              )}
            </Link>

            <p className="text-sm text-white leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col gap-2.5">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm hover:text-orange-400 transition-colors duration-200"
                >
                  <Mail size={15} className="text-orange-400 shrink-0" />
                  {email}
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm hover:text-orange-400 transition-colors duration-200"
                >
                  <Phone size={15} className="text-orange-400 shrink-0" />
                  {phone}
                </a>
              )}
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-orange-400 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">
                    {address}
                  </span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.platform}
                    className="
                      w-9 h-9 rounded-full border border-white
                      flex items-center justify-center
                      hover:text-white hover:border-orange-400
                      hover:bg-orange-400/10 transition-all duration-200
                    "
                  >
                    {getSocialIcon(s.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Col 2 — Information (API links দিয়ে replace) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-base">Information</h3>
            <ul className="flex flex-col gap-2.5">
              {(footerLinks.length > 0 ? footerLinks : informationLinks.map((l, i) => ({ id: i, title: l.label, url: l.path, open_new_tab: "0" }))).map((link) => (
                <li key={link.id ?? link.title}>
                  {"url" in link && link.url.startsWith("http") ? (
                    <a
                      href={link.url}
                      target={link.open_new_tab === "1" ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="text-sm hover:text-orange-400 transition-colors duration-200"
                    >
                      {link.title}
                    </a>
                  ) : (
                    <Link
                      to={link.url}
                      className="text-sm hover:text-orange-400 transition-colors duration-200"
                    >
                      {link.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Customer Services (static, API তে নেই) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-base">Customer Services</h3>
            <ul className="flex flex-col gap-2.5">
              {customerServiceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter (static, API তে নেই) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-base">Newsletter</h3>
            <p className="text-sm leading-relaxed">
              Sign up for our newsletter and get 10% off your first purchase
            </p>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Enter your e-mail..."
                className="
                  flex-1 bg-[#1a2535] border border-gray-600
                  text-sm text-gray-300 placeholder-gray-500
                  px-4 py-2 rounded-l-lg outline-none
                  focus:border-orange-400 transition-colors duration-200
                "
              />
              <button className="
                bg-orange-500 hover:bg-orange-600
                text-white px-4 py-2.75 rounded-r-lg
                transition-colors duration-200
                flex items-center justify-center shrink-0
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-white">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}








import { Link, useLocation } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
import { getSocialIcon } from "@/utils/getSocialIcon";

const customerServiceLinks = [
  { label: "Shipping", path: "/shipping" },
  { label: "Return & Refund", path: "/return-refund" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Orders FAQs", path: "/faq" },
];

export default function Footer() {
  const { pathname } = useLocation();
  const { data } = useGetFooterSettingsQuery();


  const companyKey = pathname.startsWith("/decor")
    ? "verin-decor"
    : pathname.startsWith("/laptops")
      ? "verin-electronics"
      : "verin-group";

  const footerBg = pathname.startsWith("/decor")
    ? "bg-[#1a1a2e]"
    : pathname.startsWith("/laptops")
      ? "bg-[#0f3460]"
      : "bg-[#FFFFFF]";



  const footer = data?.success
    ? data.data.find((f) => f.company_key === companyKey)
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
    footer?.social_links?.filter((s) => s.is_active === "1") || [];

  const footerLinks =
    footer?.links
      ?.slice()
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order)) || [];

  return (
    <footer className={`${footerBg} ${pathname === "/" ? "home-black-text" : "text-white"}`}>
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
                      parent.innerHTML = `<span style="color:#262626;font-size:22px;font-weight:800;">${companyName}</span>`;
                    }
                  }}
                />
              ) : (
                <span style={{ color: "#262626", fontSize: "22px", fontWeight: 800 }}>
                  {companyName}
                </span>
              )}
            </Link>
            <div>
              <h1 className="home-black-text font-bold text-2xl">{companyName}</h1>
            </div>

            <div
              className="text-sm home-black-text leading-relaxed [&_p]:mb-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <div className="flex flex-col gap-2.5">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm home-black-text transition-colors duration-200"
                >
                  <Mail size={15} className="home-black-text shrink-0" />
                  {email}
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm home-black-text transition-colors duration-200"
                >
                  <Phone size={15} className="home-black-text shrink-0" />
                  {phone}
                </a>
              )}
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="home-black-text shrink-0 mt-0.5 " />
                  <span className="text-sm home-black-text leading-relaxed">
                    {address}
                  </span>
                </div>
              )}
            </div>

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
                      w-10 h-10 rounded-full bg-white border border-[#262626] flex items-center justify-center text-gray-700 shadow-[0_8px_25px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-300
                      "
                  >
                    {getSocialIcon(s.platform)}
                  </a>
                ))}
              </div>
            )}

          </div>

          {/* Col 2 — Information */}
          <div className="flex flex-col gap-4">
            <h3 className="home-black-text font-bold text-base">Information</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target={link.open_new_tab === "1" ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="text-sm text-gray-700 hover:home-black-text  transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Customer Services */}
          <div className="flex flex-col gap-4">
            <h3 className="home-black-text font-bold text-base">Customer Services</h3>
            <ul className="flex flex-col gap-2.5">
              {customerServiceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="home-black-text font-bold text-base">Newsletter</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Sign up for our newsletter and get 10% off your first purchase
            </p>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Enter your e-mail..."
                className="
                  flex-1 bg-white/5 border border-gray-600
                  text-sm text-gray-700 placeholder-gray-500
                  px-4 py-1.75 rounded-l-lg outline-none
                  focus:border-black transition-colors duration-200
                "
              />
              <button className="
                bg-[#262626]
                text-white px-4 py-2.5 rounded-r-lg
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
          <p className="text-center text-sm text-gray-500">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}






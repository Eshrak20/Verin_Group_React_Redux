import { Link, useLocation } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
import { getSocialIcon } from "@/utils/getSocialIcon";
import { motion } from "framer-motion";

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

  const companyKey =
    pathname.startsWith("/decor") || pathname.startsWith("/products")
      ? "verin-decor"
      : pathname.startsWith("/laptops")
        ? "verin-electronics"
        : "verin-group";

  const footerBg =
    pathname.startsWith("/decor") || pathname.startsWith("/products")
      ? "bg-[#FFFFFF]"
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
    <footer className={`${footerBg} ${pathname === "/" ? "home-black-text" : "text-white"} overflow-hidden`}>
      <div className="py-12 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Col 1 — Brand */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.0, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <Link to="/" className="flex items-center gap-2 w-fit">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="h-7 sm:h-9 lg:h-12 w-auto object-contain"
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
                <span className="text-lg sm:text-xl lg:text-[22px] font-extrabold home-black-text">
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
                    className="w-10 h-10 rounded-full bg-white border border-[#262626] flex items-center justify-center text-gray-700 shadow-[0_8px_25px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-300"
                  >
                    {getSocialIcon(s.platform)}
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Col 2 — Information */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <h3 className="home-black-text font-bold text-base">Information</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target={link.open_new_tab === "1" ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Col 3 — Customer Services */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
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
          </motion.div>

         {/* Col 4 — We Accept */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            // মূল কন্টেইনারের gap কমিয়ে gap-2 করা হলো, যাতে ইমেজগুলোর মাঝের ফাঁকা জায়গা কমে।
            className="flex flex-col gap-1"
          >
            {/* টাইটেলের নিচে কিছুটা ব্যবধান রাখার জন্য mb-1.5 যোগ করা হলো। */}
            <h4 className="home-black-text font-bold text-base mb-1.5">We Accept</h4>
            
            <div className="w-full max-w-60">
              <img
                src="/assets/we_accept2.png"
                alt="We Accept Payment Methods"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
            
            <div className="w-full max-w-60">
              <img
                src="/assets/we_accept3.png"
                alt="We Accept Payment Methods"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="border-t border-gray-700/50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-center text-sm text-gray-500">
            {copyrightText}
          </p>
        </div>
      </motion.div>
    </footer>
  );
}








// import { Link, useLocation } from "react-router-dom";
// import { Mail, Phone, MapPin } from "lucide-react";
// import { useGetFooterSettingsQuery } from "@/redux/services/homepage/homePage.api";
// import { getSocialIcon } from "@/utils/getSocialIcon";

// const customerServiceLinks = [
//   { label: "Shipping", path: "/shipping" },
//   { label: "Return & Refund", path: "/return-refund" },
//   { label: "Privacy Policy", path: "/privacy-policy" },
//   { label: "Terms & Conditions", path: "/terms" },
//   { label: "Orders FAQs", path: "/faq" },
// ];

// export default function Footer() {
//   const { pathname } = useLocation();
//   const { data } = useGetFooterSettingsQuery();

//   const companyKey =
//     pathname.startsWith("/decor") || pathname.startsWith("/products")
//       ? "verin-decor"
//       : pathname.startsWith("/laptops")
//         ? "verin-electronics"
//         : "verin-group";

//   const footerBg =
//     pathname.startsWith("/decor") || pathname.startsWith("/products")
//       ? "bg-[#FFFFFF]"
//       : pathname.startsWith("/laptops")
//         ? "bg-[#0f3460]"
//         : "bg-[#FFFFFF]";

//   const footer = data?.success
//     ? data.data.find((f) => f.company_key === companyKey)
//     : undefined;

//   const logoUrl = footer?.image_url
//     ? footer.image_url
//     : footer?.logo
//       ? `https://v.veringroup.com/storage/${footer.logo}`
//       : null;

//   const companyName = footer?.company_name || "YourBrand";
//   const description = footer?.description || "";
//   const copyrightText = footer?.copyright_text || "© 2026 All rights reserved.";
//   const phone = footer?.contact_info?.phone || "";
//   const email = footer?.contact_info?.email || "";
//   const address = footer?.contact_info?.address || "";

//   const socialLinks =
//     footer?.social_links?.filter((s) => s.is_active === "1") || [];

//   const footerLinks =
//     footer?.links
//       ?.slice()
//       .sort((a, b) => Number(a.sort_order) - Number(b.sort_order)) || [];

//   return (
//     <footer className={`${footerBg} ${pathname === "/" ? "home-black-text" : "text-white"}`}>
//       <div className="py-12 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-0">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

//           {/* Col 1 — Brand */}
//           <div className="flex flex-col gap-4">
//             <Link to="/" className="flex items-center gap-2 w-fit">
//               {logoUrl ? (
//                 <img
//                   src={logoUrl}
//                   alt={companyName}
//                   className="h-7 sm:h-9 lg:h-12 w-auto object-contain"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.style.display = "none";
//                     const parent = target.parentElement;
//                     if (parent) {
//                       parent.innerHTML = `<span style="color:#262626;font-size:22px;font-weight:800;">${companyName}</span>`;
//                     }
//                   }}
//                 />
//               ) : (
//                 <span className="text-lg sm:text-xl lg:text-[22px] font-extrabold home-black-text">
//                   {companyName}
//                 </span>
//               )}
//             </Link>
//             <div>
//               <h1 className="home-black-text font-bold text-2xl">{companyName}</h1>
//             </div>

//             <div
//               className="text-sm home-black-text leading-relaxed [&_p]:mb-0"
//               dangerouslySetInnerHTML={{ __html: description }}
//             />

//             <div className="flex flex-col gap-2.5">
//               {email && (
//                 <a
//                   href={`mailto:${email}`}
//                   className="flex items-center gap-2 text-sm home-black-text transition-colors duration-200"
//                 >
//                   <Mail size={15} className="home-black-text shrink-0" />
//                   {email}
//                 </a>
//               )}
//               {phone && (
//                 <a
//                   href={`tel:${phone.replace(/\s/g, "")}`}
//                   className="flex items-center gap-2 text-sm home-black-text transition-colors duration-200"
//                 >
//                   <Phone size={15} className="home-black-text shrink-0" />
//                   {phone}
//                 </a>
//               )}
//               {address && (
//                 <div className="flex items-start gap-2">
//                   <MapPin size={15} className="home-black-text shrink-0 mt-0.5 " />
//                   <span className="text-sm home-black-text leading-relaxed">
//                     {address}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {socialLinks.length > 0 && (
//               <div className="flex items-center gap-2 mt-1">
//                 {socialLinks.map((s) => (
//                   <a
//                     key={s.id}
//                     href={s.url}
//                     target="_blank"
//                     rel="noreferrer"
//                     aria-label={s.platform}
//                     className="w-10 h-10 rounded-full bg-white border border-[#262626] flex items-center justify-center text-gray-700 shadow-[0_8px_25px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-300"
//                   >
//                     {getSocialIcon(s.platform)}
//                   </a>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Col 2 — Information */}
//           <div className="flex flex-col gap-4">
//             <h3 className="home-black-text font-bold text-base">Information</h3>
//             <ul className="flex flex-col gap-2.5">
//               {footerLinks.map((link) => (
//                 <li key={link.id}>
//                   <a
//                     href={link.url}
//                     target={link.open_new_tab === "1" ? "_blank" : "_self"}
//                     rel="noreferrer"
//                     className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
//                   >
//                     {link.title}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Col 3 — Customer Services */}
//           <div className="flex flex-col gap-4">
//             <h3 className="home-black-text font-bold text-base">Customer Services</h3>
//             <ul className="flex flex-col gap-2.5">
//               {customerServiceLinks.map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Col 4 — We Accept */}
//           <div className="flex flex-col gap-4">
//             <h4 className="home-black-text font-bold text-base">We Accept</h4>
//             <div className="w-full max-w-60">
//               <img
//                 src="/assets/we_accept2.png"
//                 alt="We Accept Payment Methods"
//                 className="w-full h-auto object-contain rounded-lg"
//               />
//             </div>
//             <div className="w-full max-w-60">
//               <img
//                 src="/assets/we_accept3.png"
//                 alt="We Accept Payment Methods"
//                 className="w-full h-auto object-contain rounded-lg"
//               />
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-gray-700/50">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
//           <p className="text-center text-sm text-gray-500">
//             {copyrightText}
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }

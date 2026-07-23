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
    <footer className={`${footerBg} ${pathname === "/" ? "home-black-text" : "text-white"}`}>
      <div className="py-12 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
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
                    className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
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

          {/* Col 4 — We Accept */}
          <div className="flex flex-col gap-4">
            <h4 className="home-black-text font-bold text-base">We Accept</h4>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
                <img alt="americanExpress" className="h-8 w-auto object-contain" src="/assets/americanExpress.jpg" />
              </div>
              <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
                <img alt="Visa" className="h-6 w-auto object-contain" src="data:image/svg+xml,%3csvg%20width='48'%20height='28'%20viewBox='0%200%2048%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20fill='white'/%3e%3cpath%20d='M31.1006%209.41219C30.3641%209.13631%2029.581%208.99654%2028.7918%209.00007C26.2493%209.00007%2024.459%2010.3183%2024.4486%2012.2024C24.4277%2013.5925%2025.7307%2014.3652%2026.707%2014.8289C27.7034%2015.3026%2028.0412%2015.6117%2028.0412%2016.034C28.0308%2016.6826%2027.236%2016.9815%2026.4951%2016.9815C25.6587%2017.0041%2024.8293%2016.8272%2024.0794%2016.4664L23.7406%2016.3118L23.3801%2018.4847C24.2954%2018.8298%2025.2693%2019.0046%2026.251%2018.9999C28.9524%2018.9999%2030.7106%2017.7019%2030.7314%2015.6945C30.7419%2014.5966%2030.0539%2013.7521%2028.5703%2013.0579C27.6695%2012.6154%2027.1188%2012.3165%2027.1188%2011.863C27.1292%2011.4508%2027.5852%2011.0286%2028.6015%2011.0286C29.2614%2011.0098%2029.9171%2011.1366%2030.5195%2011.3993L30.7523%2011.5024L31.0997%209.41219H31.1006Z'%20fill='%2300579F'/%3e%3cpath%20d='M34.5258%2015.4267C34.7377%2014.871%2035.5534%2012.7184%2035.5534%2012.7184C35.543%2012.7387%2035.7653%2012.1517%2035.8921%2011.7894L36.072%2012.6238C36.072%2012.6238%2036.5593%2014.9412%2036.6652%2015.4251L34.5258%2015.4267ZM37.7033%209.17737H35.7115C35.4269%209.14395%2035.139%209.20513%2034.8947%209.35095C34.6504%209.49676%2034.4641%209.71863%2034.366%209.98049L30.5439%2018.8571H33.2454L33.7857%2017.4054H37.0909C37.1647%2017.7432%2037.3984%2018.8571%2037.3984%2018.8571H39.7819L37.7041%209.17567L37.7033%209.17737Z'%20fill='%2300579F'/%3e%3cpath%20d='M17.046%209.17578L14.527%2015.7765L14.2516%2014.4379C13.6229%2012.7039%2012.3536%2011.2591%2010.6902%2010.3843L12.9999%2018.8496H15.7222L19.7692%209.18001L17.046%209.17578Z'%20fill='%2300579F'/%3e%3cpath%20d='M12.1842%209.17587H8.04256L8%209.37182C9.39136%209.64965%2010.6905%2010.2577%2011.7816%2011.1417C12.8728%2012.0258%2013.7222%2013.1584%2014.2542%2014.4389L13.3534%209.99C13.2985%209.7376%2013.1486%209.51424%2012.9332%209.36365C12.7177%209.21306%2012.4522%209.14608%2012.1886%209.17587H12.1842Z'%20fill='%23FAA61A'/%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20stroke='%23EBF0F5'/%3e%3c/svg%3e" />
              </div>
              <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
                <img alt="Mastercard" className="h-6 w-auto object-contain" src="data:image/svg+xml,%3csvg%20width='48'%20height='28'%20viewBox='0%200%2048%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20fill='white'/%3e%3cpath%20d='M27.9151%207.71094H20.7151V20.2887H27.9151V7.71094Z'%20fill='%23FF5F00'/%3e%3cpath%20d='M21.1714%2014C21.1714%2011.4444%2022.4057%209.17778%2024.3029%207.71111C22.9086%206.64444%2021.1486%206%2019.2286%206C14.68%206%2011%209.57778%2011%2014C11%2018.4222%2014.68%2022%2019.2286%2022C21.1486%2022%2022.9086%2021.3556%2024.3029%2020.2889C22.4057%2018.8444%2021.1714%2016.5556%2021.1714%2014Z'%20fill='%23EB001B'/%3e%3cpath%20d='M37.6276%2014C37.6276%2018.4222%2033.9476%2022%2029.399%2022C27.479%2022%2025.719%2021.3556%2024.3247%2020.2889C26.2447%2018.8222%2027.4561%2016.5556%2027.4561%2014C27.4561%2011.4444%2026.2218%209.17778%2024.3247%207.71111C25.719%206.64444%2027.479%206%2029.399%206C33.9476%206%2037.6276%209.6%2037.6276%2014Z'%20fill='%23F79E1B'/%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20stroke='%23EBF0F5'/%3e%3c/svg%3e" />
              </div>
              <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
                <img alt="bKash" className="h-8 w-auto object-contain" src="/assets/bkash.jpg" />
              </div>
              <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
                <img alt="Rocket" className="h-8 w-auto object-contain" src="/assets/dbbl.jpg" />
              </div>
              <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
                <img alt="Upay" className="h-8 w-auto object-contain" src="/assets/upay.jpg" />
              </div>
              <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
                <img alt="Nagad" className="h-8 w-auto object-contain" src="/assets/nogod.jpg" />
              </div>
              <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
                <img alt="Trust Axiata" className="h-8 w-auto object-contain" src="/assets/trustAxiata.jpg" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-center text-sm text-gray-500">
            {copyrightText}
          </p>
        </div>
      </div>
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
//       <div className="py-12 max-w-6xl mx-auto w-full">
//         <div className="grid grid-cols-4 gap-8">

//           {/* Col 1 — Brand */}
//           <div className="flex flex-col gap-4">
//             <Link to="/" className="flex items-center gap-2 w-fit">
//               {logoUrl ? (
//                 <img
//                   src={logoUrl}
//                   alt={companyName}
//                   className="h-12 w-auto object-contain"
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
//                 <span style={{ color: "#262626", fontSize: "22px", fontWeight: 800 }}>
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
//             <div className="grid grid-cols-3 gap-2">
//               <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
//                 <img alt="americanExpress" className="h-8 w-auto object-contain" src="/assets/americanExpress.jpg" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
//                 <img alt="Visa" className="h-6 w-auto object-contain" src="data:image/svg+xml,%3csvg%20width='48'%20height='28'%20viewBox='0%200%2048%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20fill='white'/%3e%3cpath%20d='M31.1006%209.41219C30.3641%209.13631%2029.581%208.99654%2028.7918%209.00007C26.2493%209.00007%2024.459%2010.3183%2024.4486%2012.2024C24.4277%2013.5925%2025.7307%2014.3652%2026.707%2014.8289C27.7034%2015.3026%2028.0412%2015.6117%2028.0412%2016.034C28.0308%2016.6826%2027.236%2016.9815%2026.4951%2016.9815C25.6587%2017.0041%2024.8293%2016.8272%2024.0794%2016.4664L23.7406%2016.3118L23.3801%2018.4847C24.2954%2018.8298%2025.2693%2019.0046%2026.251%2018.9999C28.9524%2018.9999%2030.7106%2017.7019%2030.7314%2015.6945C30.7419%2014.5966%2030.0539%2013.7521%2028.5703%2013.0579C27.6695%2012.6154%2027.1188%2012.3165%2027.1188%2011.863C27.1292%2011.4508%2027.5852%2011.0286%2028.6015%2011.0286C29.2614%2011.0098%2029.9171%2011.1366%2030.5195%2011.3993L30.7523%2011.5024L31.0997%209.41219H31.1006Z'%20fill='%2300579F'/%3e%3cpath%20d='M34.5258%2015.4267C34.7377%2014.871%2035.5534%2012.7184%2035.5534%2012.7184C35.543%2012.7387%2035.7653%2012.1517%2035.8921%2011.7894L36.072%2012.6238C36.072%2012.6238%2036.5593%2014.9412%2036.6652%2015.4251L34.5258%2015.4267ZM37.7033%209.17737H35.7115C35.4269%209.14395%2035.139%209.20513%2034.8947%209.35095C34.6504%209.49676%2034.4641%209.71863%2034.366%209.98049L30.5439%2018.8571H33.2454L33.7857%2017.4054H37.0909C37.1647%2017.7432%2037.3984%2018.8571%2037.3984%2018.8571H39.7819L37.7041%209.17567L37.7033%209.17737Z'%20fill='%2300579F'/%3e%3cpath%20d='M17.046%209.17578L14.527%2015.7765L14.2516%2014.4379C13.6229%2012.7039%2012.3536%2011.2591%2010.6902%2010.3843L12.9999%2018.8496H15.7222L19.7692%209.18001L17.046%209.17578Z'%20fill='%2300579F'/%3e%3cpath%20d='M12.1842%209.17587H8.04256L8%209.37182C9.39136%209.64965%2010.6905%2010.2577%2011.7816%2011.1417C12.8728%2012.0258%2013.7222%2013.1584%2014.2542%2014.4389L13.3534%209.99C13.2985%209.7376%2013.1486%209.51424%2012.9332%209.36365C12.7177%209.21306%2012.4522%209.14608%2012.1886%209.17587H12.1842Z'%20fill='%23FAA61A'/%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20stroke='%23EBF0F5'/%3e%3c/svg%3e" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
//                 <img alt="Mastercard" className="h-6 w-auto object-contain" src="data:image/svg+xml,%3csvg%20width='48'%20height='28'%20viewBox='0%200%2048%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20fill='white'/%3e%3cpath%20d='M27.9151%207.71094H20.7151V20.2887H27.9151V7.71094Z'%20fill='%23FF5F00'/%3e%3cpath%20d='M21.1714%2014C21.1714%2011.4444%2022.4057%209.17778%2024.3029%207.71111C22.9086%206.64444%2021.1486%206%2019.2286%206C14.68%206%2011%209.57778%2011%2014C11%2018.4222%2014.68%2022%2019.2286%2022C21.1486%2022%2022.9086%2021.3556%2024.3029%2020.2889C22.4057%2018.8444%2021.1714%2016.5556%2021.1714%2014Z'%20fill='%23EB001B'/%3e%3cpath%20d='M37.6276%2014C37.6276%2018.4222%2033.9476%2022%2029.399%2022C27.479%2022%2025.719%2021.3556%2024.3247%2020.2889C26.2447%2018.8222%2027.4561%2016.5556%2027.4561%2014C27.4561%2011.4444%2026.2218%209.17778%2024.3247%207.71111C25.719%206.64444%2027.479%206%2029.399%206C33.9476%206%2037.6276%209.6%2037.6276%2014Z'%20fill='%23F79E1B'/%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20stroke='%23EBF0F5'/%3e%3c/svg%3e" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
//                 <img alt="bKash" className="h-8 w-auto object-contain" src="/assets/bkash.jpg" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
//                 <img alt="Rocket" className="h-8 w-auto object-contain" src="/assets/dbbl.jpg" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
//                 <img alt="Upay" className="h-8 w-auto object-contain" src="/assets/upay.jpg" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
//                 <img alt="Nagad" className="h-8 w-auto object-contain" src="/assets/nogod.jpg" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center bg-white rounded-sm h-10">
//                 <img alt="Trust Axiata" className="h-8 w-auto object-contain" src="/assets/trustAxiata.jpg" />
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-gray-700/50">
//         <div className="max-w-6xl mx-auto px-6 py-4">
//           <p className="text-center text-sm text-gray-500">
//             {copyrightText}
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }








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
//       <div className="py-12 max-w-6xl mx-auto w-full">
//         <div className="grid grid-cols-4 gap-8">

//           {/* Col 1 — Brand */}
//           <div className="flex flex-col gap-4">
//             <Link to="/" className="flex items-center gap-2 w-fit">
//               {logoUrl ? (
//                 <img
//                   src={logoUrl}
//                   alt={companyName}
//                   className="h-12 w-auto object-contain"
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
//                 <span style={{ color: "#262626", fontSize: "22px", fontWeight: 800 }}>
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

//           {/* Col 4 — We Accept (Newsletter এর পরিবর্তে) */}
//           <div className="flex flex-col gap-4">
//             <h4 className="home-black-text font-bold text-base">We Accept</h4>
//             <div className="grid grid-cols-3 gap-2">
//               <div className="border border-gray-200 dark:border-slate-800 py-2 flex items-center justify-center bg-white dark:bg-slate-900 rounded-sm">
//                 <img alt="Payment Method" className=" w-auto object-contain" src="data:image/svg+xml,%3csvg%20width='48'%20height='28'%20viewBox='0%200%2048%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20fill='white'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M15%205H32.5116V23H15V5Z'%20fill='%232F6EB7'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M21.3713%2020.1502V13.7002H32.5106V15.5002L31.2459%2016.9002L32.5106%2018.3502V20.1502H30.4676L29.3488%2018.9002L28.2786%2020.1502H21.3713Z'%20fill='white'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M22.1023%2019.4499V14.3999H26.2369V15.5499H23.4643V16.3499H26.1883V17.4999H23.4643V18.2499H26.2369V19.4499H22.1023Z'%20fill='%232F6EB7'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M26.2361%2019.4499L28.5223%2016.8999L26.2361%2014.3999H27.9872L29.3979%2015.9999L30.8085%2014.3999H32.5111V14.4499L30.2735%2016.8999L32.5111%2019.3499V19.4499H30.8085L29.3979%2017.7999L27.9386%2019.4499H26.2361Z'%20fill='%232F6EB7'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M21.8596%207.9502H24.5836L25.5078%2010.1502V7.9502H28.8642L29.3993%209.6002L29.983%207.9502H32.5124V14.4002H19.0869L21.8596%207.9502Z'%20fill='white'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M22.3945%208.6499L20.2056%2013.6999H21.7135L22.1026%2012.6999H24.3402L24.7294%2013.6999H26.2373L24.097%208.6499H22.3945ZM22.5891%2011.5499L23.2215%209.94992L23.8538%2011.5499H22.5891Z'%20fill='%232F6EB7'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M26.2361%2013.6999V8.6499H28.3277L29.4465%2011.7499L30.5167%208.6499H32.5111V13.6999H31.2463V10.2499L29.9816%2013.6999H28.8142L27.5495%2010.2499V13.6999H26.2361Z'%20fill='%232F6EB7'/%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20stroke='%23EBF0F5'/%3e%3c/svg%3e" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-2 flex items-center justify-center bg-white dark:bg-slate-900 rounded-sm">
//                 <img alt="Payment Method" className="h-5 w-auto object-contain" src="data:image/svg+xml,%3csvg%20width='48'%20height='28'%20viewBox='0%200%2048%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20fill='white'/%3e%3cpath%20d='M31.1006%209.41219C30.3641%209.13631%2029.581%208.99654%2028.7918%209.00007C26.2493%209.00007%2024.459%2010.3183%2024.4486%2012.2024C24.4277%2013.5925%2025.7307%2014.3652%2026.707%2014.8289C27.7034%2015.3026%2028.0412%2015.6117%2028.0412%2016.034C28.0308%2016.6826%2027.236%2016.9815%2026.4951%2016.9815C25.6587%2017.0041%2024.8293%2016.8272%2024.0794%2016.4664L23.7406%2016.3118L23.3801%2018.4847C24.2954%2018.8298%2025.2693%2019.0046%2026.251%2018.9999C28.9524%2018.9999%2030.7106%2017.7019%2030.7314%2015.6945C30.7419%2014.5966%2030.0539%2013.7521%2028.5703%2013.0579C27.6695%2012.6154%2027.1188%2012.3165%2027.1188%2011.863C27.1292%2011.4508%2027.5852%2011.0286%2028.6015%2011.0286C29.2614%2011.0098%2029.9171%2011.1366%2030.5195%2011.3993L30.7523%2011.5024L31.0997%209.41219H31.1006Z'%20fill='%2300579F'/%3e%3cpath%20d='M34.5258%2015.4267C34.7377%2014.871%2035.5534%2012.7184%2035.5534%2012.7184C35.543%2012.7387%2035.7653%2012.1517%2035.8921%2011.7894L36.072%2012.6238C36.072%2012.6238%2036.5593%2014.9412%2036.6652%2015.4251L34.5258%2015.4267ZM37.7033%209.17737H35.7115C35.4269%209.14395%2035.139%209.20513%2034.8947%209.35095C34.6504%209.49676%2034.4641%209.71863%2034.366%209.98049L30.5439%2018.8571H33.2454L33.7857%2017.4054H37.0909C37.1647%2017.7432%2037.3984%2018.8571%2037.3984%2018.8571H39.7819L37.7041%209.17567L37.7033%209.17737Z'%20fill='%2300579F'/%3e%3cpath%20d='M17.046%209.17578L14.527%2015.7765L14.2516%2014.4379C13.6229%2012.7039%2012.3536%2011.2591%2010.6902%2010.3843L12.9999%2018.8496H15.7222L19.7692%209.18001L17.046%209.17578Z'%20fill='%2300579F'/%3e%3cpath%20d='M12.1842%209.17587H8.04256L8%209.37182C9.39136%209.64965%2010.6905%2010.2577%2011.7816%2011.1417C12.8728%2012.0258%2013.7222%2013.1584%2014.2542%2014.4389L13.3534%209.99C13.2985%209.7376%2013.1486%209.51424%2012.9332%209.36365C12.7177%209.21306%2012.4522%209.14608%2012.1886%209.17587H12.1842Z'%20fill='%23FAA61A'/%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20stroke='%23EBF0F5'/%3e%3c/svg%3e" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-2 flex items-center justify-center bg-white dark:bg-slate-900 rounded-sm">
//                 <img alt="Payment Method" className="h-5 w-auto object-contain" src="data:image/svg+xml,%3csvg%20width='48'%20height='28'%20viewBox='0%200%2048%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20fill='white'/%3e%3cpath%20d='M27.9151%207.71094H20.7151V20.2887H27.9151V7.71094Z'%20fill='%23FF5F00'/%3e%3cpath%20d='M21.1714%2014C21.1714%2011.4444%2022.4057%209.17778%2024.3029%207.71111C22.9086%206.64444%2021.1486%206%2019.2286%206C14.68%206%2011%209.57778%2011%2014C11%2018.4222%2014.68%2022%2019.2286%2022C21.1486%2022%2022.9086%2021.3556%2024.3029%2020.2889C22.4057%2018.8444%2021.1714%2016.5556%2021.1714%2014Z'%20fill='%23EB001B'/%3e%3cpath%20d='M37.6276%2014C37.6276%2018.4222%2033.9476%2022%2029.399%2022C27.479%2022%2025.719%2021.3556%2024.3247%2020.2889C26.2447%2018.8222%2027.4561%2016.5556%2027.4561%2014C27.4561%2011.4444%2026.2218%209.17778%2024.3247%207.71111C25.719%206.64444%2027.479%206%2029.399%206C33.9476%206%2037.6276%209.6%2037.6276%2014Z'%20fill='%23F79E1B'/%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='27'%20rx='3.5'%20stroke='%23EBF0F5'/%3e%3c/svg%3e" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-2 flex items-center justify-center bg-white dark:bg-slate-900 rounded-sm">
//                 <img alt="Payment Method" className="h-5 w-auto object-contain" src="/assets/bkash.jpg" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-2 flex items-center justify-center bg-white dark:bg-slate-900 rounded-sm">
//                 <img alt="Payment Method" className="h-5 w-auto object-contain" src="/assets/dbbl.jpg" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-2 flex items-center justify-center bg-white dark:bg-slate-900 rounded-sm">
//                 <img alt="Payment Method" className="h-5 w-auto object-contain" src="/assets/upay.jpg" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-2 flex items-center justify-center bg-white dark:bg-slate-900 rounded-sm">
//                 <img alt="Payment Method" className="h-5 w-auto object-contain" src="/assets/nogod.jpg" />
//               </div>
//               <div className="border border-gray-200 dark:border-slate-800 p-2 flex items-center justify-center bg-white dark:bg-slate-900 rounded-sm">
//                 <img alt="Payment Method" className="h-5 w-auto object-contain" src="/assets/trustAxiata.jpg" />
//               </div>
              
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-gray-700/50">
//         <div className="max-w-6xl mx-auto px-6 py-4">
//           <p className="text-center text-sm text-gray-500">
//             {copyrightText}
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }











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


//   // const companyKey = pathname.startsWith("/decor")
//   //   ? "verin-decor"
//   //   : pathname.startsWith("/laptops")
//   //     ? "verin-electronics"
//   //     : "verin-group";
//   const companyKey =
//     pathname.startsWith("/decor") || pathname.startsWith("/products")
//       ? "verin-decor"
//       : pathname.startsWith("/laptops")
//         ? "verin-electronics"
//         : "verin-group";


//   // const footerBg = pathname.startsWith("/decor")
//   //   ? "bg-[#FFFFFF]"
//   //   : pathname.startsWith("/laptops")
//   //     ? "bg-[#0f3460]"
//   //     : "bg-[#FFFFFF]";

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
//       <div className="py-12 max-w-6xl mx-auto w-full">
//         <div className="grid grid-cols-4 gap-8">

//           {/* Col 1 — Brand */}
//           <div className="flex flex-col gap-4">
//             <Link to="/" className="flex items-center gap-2 w-fit">
//               {logoUrl ? (
//                 <img
//                   src={logoUrl}
//                   alt={companyName}
//                   className="h-12 w-auto object-contain"
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
//                 <span style={{ color: "#262626", fontSize: "22px", fontWeight: 800 }}>
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
//                     className="
//                       w-10 h-10 rounded-full bg-white border border-[#262626] flex items-center justify-center text-gray-700 shadow-[0_8px_25px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-300
//                       "
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
//                     className="text-sm text-gray-700 hover:home-black-text  transition-colors duration-200"
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

//           {/* Col 4 — Newsletter */}
//           <div className="flex flex-col gap-4">
//             <h3 className="home-black-text font-bold text-base">Newsletter</h3>
//             <p className="text-sm text-gray-700 leading-relaxed">
//               Sign up for our newsletter and get 10% off your first purchase
//             </p>
//             <div className="flex items-center">
//               <input
//                 type="email"
//                 placeholder="Enter your e-mail..."
//                 className="
//                   flex-1 bg-white/5 border border-gray-600
//                   text-sm text-gray-700 placeholder-gray-500
//                   px-4 py-1.75 rounded-l-lg outline-none
//                   focus:border-black transition-colors duration-200
//                 "
//               />
//               <button className="
//                 bg-[#262626]
//                 text-white px-4 py-2.5 rounded-r-lg
//                 transition-colors duration-200
//                 flex items-center justify-center shrink-0
//               ">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M5 12h14M12 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-gray-700/50">
//         <div className="max-w-6xl mx-auto px-6 py-4">
//           <p className="text-center text-sm text-gray-500">
//             {copyrightText}
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }






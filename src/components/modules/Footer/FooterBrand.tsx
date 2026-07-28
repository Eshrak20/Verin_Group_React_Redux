import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { getSocialIcon } from "@/utils/getSocialIcon";
import type { FooterBrandProps } from "@/types/footer.type";


export function FooterBrand({
  logoUrl,
  companyName,
  description,
  email,
  phone,
  address,
  socialLinks,
}: FooterBrandProps) {
  return (
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
  );
}
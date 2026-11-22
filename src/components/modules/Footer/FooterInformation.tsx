import type { FooterInformationProps } from "@/types/footer.type";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const resolveFooterLink = (url?: string): { href: string; isInternal: boolean } => {
  const raw = (url || "").trim();
  if (!raw) {
    return { href: "/", isInternal: true };
  }

  try {
    const parsed = new URL(raw, window.location.origin);
    const currentOrigin = window.location.origin;

    const isSameSite =
      parsed.origin === currentOrigin ||
      parsed.hostname === "veringroup.com" ||
      parsed.hostname === "www.veringroup.com";

    if (isSameSite) {
      const internalPath = `${parsed.pathname || "/"}${parsed.search || ""}${parsed.hash || ""}`;
      return { href: internalPath, isInternal: true };
    }

    return { href: parsed.toString(), isInternal: false };
  } catch {
    const cleaned = `/${raw.replace(/^\/+/, "")}`;
    return { href: cleaned, isInternal: true };
  }
};

export function FooterInformation({ links }: FooterInformationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <h3 className="home-black-text font-bold text-base">Information</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => {
          const { href, isInternal } = resolveFooterLink(link.url);

          return (
            <li key={link.id}>
              {isInternal ? (
                <Link
                  to={href}
                  className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
                >
                  {link.title}
                </Link>
              ) : (
                <a
                  href={href}
                  target={String(link.open_new_tab) === "1" ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
                >
                  {link.title}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
import type { FooterInformationProps } from "@/types/footer.type";
import { motion } from "framer-motion";


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
        {links.map((link) => (
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
  );
}
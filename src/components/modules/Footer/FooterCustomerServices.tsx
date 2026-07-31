import { motion } from "framer-motion";
import { CustomerServiceLinkItem } from "./CustomerServiceLinkItem";
import type { FooterCustomerServicesProps } from "@/types/footer.type";


export function FooterCustomerServices({
  customerServiceLinks,
  footerPagesData,
  companyKey,
}: FooterCustomerServicesProps) {
  return (
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
          <CustomerServiceLinkItem
            key={link.path}
            link={link}
            footerPagesData={footerPagesData}
            companyKey={companyKey}
          />
        ))}
      </ul>
    </motion.div>
  );
}
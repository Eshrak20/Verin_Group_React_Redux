import { motion } from "framer-motion";
import { useLocation, useSearchParams } from "react-router-dom";

import {
  useGetFooterPagesByCompanyQuery,
  useGetFooterSettingsQuery,
} from "@/redux/services/footer/footer.api";
import {
  customerServiceLinks,
  getCompanyKey,
  getFooterBackground,
  parseFooterData,
} from "@/utils/footer.utils";
import { FooterBrand } from "../modules/Footer/FooterBrand";
import { FooterCustomerServices } from "../modules/Footer/FooterCustomerServices";
import { FooterInformation } from "../modules/Footer/FooterInformation";
import { FooterPayments } from "../modules/Footer/FooterPayments";

export default function Footer() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  // 🎯 সরাসরি API কল (কারণ CommonLayout একে আটকে রাখছে)
  const { data: footerSettingsData } = useGetFooterSettingsQuery();
  const companyFromQuery = searchParams.get("company");

  const companyKey = getCompanyKey(pathname, companyFromQuery);
  const { data: footerPagesData } = useGetFooterPagesByCompanyQuery(companyKey);
  const footerBg = getFooterBackground(companyKey);

  const {
    logoUrl,
    companyName,
    description,
    copyrightText,
    phone,
    email,
    address,
    socialLinks,
    footerLinks,
  } = parseFooterData(footerSettingsData, companyKey);

  return (
    <footer
      className={`${footerBg} ${
        pathname === "/" ? "home-black-text" : "text-white"
      } overflow-hidden`}
    >
      <div className="py-12 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FooterBrand
            logoUrl={logoUrl}
            companyName={companyName}
            description={description}
            email={email}
            phone={phone}
            address={address}
            socialLinks={socialLinks}
          />

          <FooterInformation links={footerLinks} />

          <FooterCustomerServices
            customerServiceLinks={customerServiceLinks}
            footerPagesData={footerPagesData}
            companyKey={companyKey}
          />

          <FooterPayments />
        </div>
      </div>

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
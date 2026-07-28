import { Link } from "react-router-dom";
import type { CustomerServiceLink as ICustomerServiceLink, FooterPagesResponse } from "@/types/footer.type";

interface CustomerServiceLinkItemProps {
  link: ICustomerServiceLink;
  footerPagesData?: FooterPagesResponse;
  companyKey: string;
}

export function CustomerServiceLinkItem({
  link,
  footerPagesData,
  companyKey,
}: CustomerServiceLinkItemProps) {
  const matchedPage = footerPagesData?.data?.find(
    (p) => p.page_type === link.pageType
  );

  return (
    <li>
      <Link
        to={`${link.path}?company=${companyKey}`}
        className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
      >
        {matchedPage?.title || link.label}
      </Link>
    </li>
  );
}
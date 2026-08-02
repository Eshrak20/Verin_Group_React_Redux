import { Link } from "react-router-dom";
import type {
  CustomerServiceLink as ICustomerServiceLink,
  FooterPagesResponse,
} from "@/types/footer.type";

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
    (p) => p.page_type === link.pageType && Number(p.is_published) === 1
  );

  
  const isValidPageForCompany = () => {
    if (!matchedPage) return false;

    const contentText = (matchedPage.content || "").toLowerCase();
    const titleText = (matchedPage.title || "").toLowerCase();
    const textToCheck = `${contentText} ${titleText}`;

  
    const allBrands = [
      { key: "verin-group", keywords: ["verin group"] },
      { key: "verin-decor", keywords: ["verin decor"] },
      { key: "verin-clothing", keywords: ["verin clothing"] },
      { key: "verin-electronics", keywords: ["verin electronics"] },
    ];

   
    const hasOtherBrandName = allBrands.some(
      (brand) =>
        brand.key !== companyKey &&
        brand.keywords.some((kw) => textToCheck.includes(kw))
    );

    return !hasOtherBrandName;
  };

  const isDataValid = isValidPageForCompany();
  const cleanContent = matchedPage?.content?.replace(/<[^>]*>/g, "").trim();
  const hasPageData = Boolean(isDataValid && matchedPage && cleanContent && cleanContent.length > 0);

  const finalPageData = hasPageData ? matchedPage : null;

  return (
    <li>
      <Link
        to={`${link.path}?company=${companyKey}`}
        
        state={{
          pageData: finalPageData,
          notFound: !hasPageData,
        }}
        className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
      >
        {finalPageData?.title || link.label}
      </Link>
    </li>
  );
}










// import { Link } from "react-router-dom";
// import type { CustomerServiceLink as ICustomerServiceLink, FooterPagesResponse } from "@/types/footer.type";

// interface CustomerServiceLinkItemProps {
//   link: ICustomerServiceLink;
//   footerPagesData?: FooterPagesResponse;
//   companyKey: string;
// }

// export function CustomerServiceLinkItem({
//   link,
//   footerPagesData,
//   companyKey,
// }: CustomerServiceLinkItemProps) {
//   // ডাটাবেজের পেজ খুঁজে দেখা এবং সেটি পাবলিশড কিনা নিশ্চিত হওয়া
//   const matchedPage = footerPagesData?.data?.find(
//     (p) => p.page_type === link.pageType && p.is_published === 1
//   );

//   const hasPageData = Boolean(matchedPage && matchedPage.content?.trim());

//   return (
//     <li>
//       <Link
//         to={`${link.path}?company=${companyKey}`}
//         // state পাস করে দিচ্ছি যাতে সার্ভিস পেজ বুঝতে পারে ডাটা আছে কি নেই
//         state={{
//           pageData: hasPageData ? matchedPage : null,
//           notFound: !hasPageData,
//         }}
//         className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
//       >
//         {matchedPage?.title || link.label}
//       </Link>
//     </li>
//   );
// }









// // import { Link } from "react-router-dom";
// // import type { CustomerServiceLink as ICustomerServiceLink, FooterPagesResponse } from "@/types/footer.type";

// // interface CustomerServiceLinkItemProps {
// //   link: ICustomerServiceLink;
// //   footerPagesData?: FooterPagesResponse;
// //   companyKey: string;
// // }

// // export function CustomerServiceLinkItem({
// //   link,
// //   footerPagesData,
// //   companyKey,
// // }: CustomerServiceLinkItemProps) {
// //   const matchedPage = footerPagesData?.data?.find(
// //     (p) => p.page_type === link.pageType
// //   );

// //   return (
// //     <li>
// //       <Link
// //         to={`${link.path}?company=${companyKey}`}
// //         className="text-sm text-gray-700 hover:home-black-text transition-colors duration-200"
// //       >
// //         {matchedPage?.title || link.label}
// //       </Link>
// //     </li>
// //   );
// // }
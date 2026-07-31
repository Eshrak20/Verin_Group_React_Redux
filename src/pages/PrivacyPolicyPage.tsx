/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetFooterPagesByCompanyQuery } from "@/redux/services/footer/footer.api";
import { useLocation, useSearchParams } from "react-router-dom";

// HTML Entity decoding function
const decodeHtml = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export default function PrivacyPolicyPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const companyKey = searchParams.get("company") || "verin-group";

  // 1. Fetch data for current company
  const { data, isLoading } = useGetFooterPagesByCompanyQuery(companyKey);

  // 2. Find published privacy policy page from API
  const apiPageData = data?.data?.find(
    (p: any) => p.page_type === "privacy-policy" && Number(p.is_published) === 1
  );

  // 3. Fallback resolution: passed location state > API data > null
  const pageData = location.state?.pageData ?? apiPageData ?? null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-16 px-4">
        <p className="text-gray-500">Loading privacy policy...</p>
      </div>
    );
  }

  const rawShortDesc = pageData?.short_description
    ? decodeHtml(pageData.short_description)
    : "";
  const rawContent = pageData?.content ? decodeHtml(pageData.content) : "";

  return (
    <div className="min-h-screen bg-gray-50/30 py-12 px-4 sm:px-6">
      {/* Centered White Card Box */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 mb-12">
        
        {/* Title Section */}
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-center text-black mb-4">
          {pageData?.title || "Privacy Policy"}
        </h1>

        <hr className="border-gray-200 mb-8 max-w-xl mx-auto" />

        {/* Short Description */}
        {rawShortDesc && (
          <div className="text-center text-gray-600 mb-10 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            <div dangerouslySetInnerHTML={{ __html: rawShortDesc }} />
          </div>
        )}

        {/* Main Content / Empty State matching screenshot 2 */}
        {rawContent ? (
          <div
            className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed space-y-6 pb-6
              [&_h2]:text-base [&_h2]:sm:text-lg [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-8 [&_h2]:mb-4
              [&_h3]:text-black [&_h3]:font-bold
              [&_p]:mb-4 [&_p]:text-gray-600
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-8 [&_ul]:space-y-3
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-8 [&_ol]:space-y-3
              [&_li]:text-gray-600 [&_li::marker]:text-gray-400"
            dangerouslySetInnerHTML={{ __html: rawContent }}
          />
        ) : (
          <p className="text-center text-gray-500 my-8">
            No privacy policy available for{" "}
            <span className="capitalize font-medium">
              {companyKey.replace("-", " ")}
            </span>.
          </p>
        )}
      </div>
    </div>
  );
}









// import { useGetFooterPagesByCompanyQuery } from "@/redux/services/footer/footer.api";
// import { useSearchParams } from "react-router-dom";

// export default function PrivacyPolicyPage() {
//   const [searchParams] = useSearchParams();
//   const companyKey = searchParams.get("company") || "verin-group";

//   const { data, isLoading } = useGetFooterPagesByCompanyQuery(companyKey);

//   // ১. নির্দিষ্ট page_type এবং published পেজটি খুঁজে বের করা
//   const rawPageData = data?.data?.find(
//     (p) => p.page_type === "privacy-policy" && Number(p.is_published) === 1
//   );

//   // 🎯 ২. STRICT BRAND VALIDATION (ব্যাকএন্ড যে ভুল ব্র্যান্ডের ডাটাই পাঠাক না কেন)
//   const isValidBrandData = () => {
//     if (!rawPageData) return false;

//     // কোম্পানির কি যদি 'verin-group' হয় কিন্তু রেসপন্সে অন্য কোনো নির্দিষ্ট ব্র্যান্ডের নাম চলে আসে
//     const contentText = (rawPageData.content || "").toLowerCase();
//     const titleText = (rawPageData.title || "").toLowerCase();

//     // verin-group-এ থাকলে অন্য সুনির্দিষ্ট ব্র্যান্ডের (যেমন decor, clothing, electronics) কন্টেন্ট ব্লক করা
//     if (companyKey === "verin-group") {
//       const isDecorData = contentText.includes("verin decor") || titleText.includes("decor");
//       const isClothingData = contentText.includes("verin clothing") || titleText.includes("clothing");
//       const isElectronicsData = contentText.includes("verin electronics") || titleText.includes("electronics");

//       if (isDecorData || isClothingData || isElectronicsData) {
//         return false; // mismatched dataset, block it
//       }
//     }

//     return true;
//   };

//   const pageData = isValidBrandData() ? rawPageData : null;

//   const cleanContent = pageData?.content?.replace(/<[^>]*>/g, "").trim();
//   const hasValidContent = Boolean(pageData && cleanContent && cleanContent.length > 0);

//   if (isLoading) {
//     return (
//       <div className="max-w-4xl mx-auto py-16 px-4 text-center">
//         <p className="text-gray-500">Loading privacy policy...</p>
//       </div>
//     );
//   }

//   // 🎯 ৩. ব্যাকএন্ড ভুল ডাটা দিলে বা ডাটা না থাকলে "No Content Available" দেখাবে
//   if (!hasValidContent || !pageData) {
//     return (
//       <div className="max-w-4xl mx-auto py-20 px-4 text-center min-h-[45vh] flex flex-col justify-center items-center">
//         <h1 className="text-3xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
//         <p className="text-gray-500 text-base max-w-md">
//           No privacy policy is currently available for{" "}
//           <span className="capitalize font-semibold text-gray-800">
//             {companyKey.replace("-", " ")}
//           </span>.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-900">
//         {pageData.title || "Privacy Policy"}
//       </h1>

//       {pageData.short_description && (
//         <p className="text-lg text-gray-600 mb-8 border-l-4 border-black pl-4">
//           {pageData.short_description}
//         </p>
//       )}

//       <div
//         className="prose max-w-none text-gray-700 leading-relaxed [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2"
//         dangerouslySetInnerHTML={{ __html: pageData.content }}
//       />
//     </div>
//   );
// }









// import { useGetFooterPagesByCompanyQuery } from "@/redux/services/footer/footer.api";
// import { useSearchParams } from "react-router-dom";


// export default function PrivacyPolicyPage() {
//   const [searchParams] = useSearchParams();
//   const companyKey = searchParams.get("company") || "verin-group";

//   const { data, isLoading } = useGetFooterPagesByCompanyQuery(companyKey);

//   const pageData = data?.data?.find((p) => p.page_type === "privacy-policy");

//   if (isLoading) {
//     return (
//       <div className="max-w-4xl mx-auto py-16 px-4 text-center">
//         <p className="text-gray-500">Loading privacy policy...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-900">
//         {pageData?.title || "Privacy Policy"}
//       </h1>

//       {pageData?.short_description && (
//         <p className="text-lg text-gray-600 mb-8 border-l-4 border-black pl-4">
//           {pageData.short_description}
//         </p>
//       )}

//       {pageData?.content ? (
//         <div
//           className="prose max-w-none text-gray-700 leading-relaxed [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2"
//           dangerouslySetInnerHTML={{ __html: pageData.content }}
//         />
//       ) : (
//         <p className="text-gray-500">No content available for this page.</p>
//       )}
//     </div>
//   );
// }
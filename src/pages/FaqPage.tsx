import { useGetFooterPagesByCompanyQuery } from "@/redux/services/footer/footer.api";
import { useSearchParams } from "react-router-dom";


const decodeHtml = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export default function FaqPage() {
  const [searchParams] = useSearchParams();
  const companyKey = searchParams.get("company") || "verin-group";

  const { data, isLoading } = useGetFooterPagesByCompanyQuery(companyKey);

  const pageData = data?.data?.find((p) => p.page_type === "orders-faqs");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-16 px-4">
        <p className="text-gray-500">Loading FAQs...</p>
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
          {pageData?.title || "Orders FAQs"}
        </h1>

        <hr className="border-gray-200 mb-8 max-w-xl mx-auto" />

        {/* Short Description */}
        {rawShortDesc && (
          <div className="text-center text-gray-600 mb-10 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            <div dangerouslySetInnerHTML={{ __html: rawShortDesc }} />
          </div>
        )}

        {/* Main Content */}
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
            No content available for this page.
          </p>
        )}
      </div>
    </div>
  );
}
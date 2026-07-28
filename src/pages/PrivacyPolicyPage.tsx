import { useGetFooterPagesByCompanyQuery } from "@/redux/services/footer/footer.api";
import { useSearchParams } from "react-router-dom";


export default function PrivacyPolicyPage() {
  const [searchParams] = useSearchParams();
  const companyKey = searchParams.get("company") || "verin-group";

  const { data, isLoading } = useGetFooterPagesByCompanyQuery(companyKey);

  const pageData = data?.data?.find((p) => p.page_type === "privacy-policy");

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <p className="text-gray-500">Loading privacy policy...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        {pageData?.title || "Privacy Policy"}
      </h1>

      {pageData?.short_description && (
        <p className="text-lg text-gray-600 mb-8 border-l-4 border-black pl-4">
          {pageData.short_description}
        </p>
      )}

      {pageData?.content ? (
        <div
          className="prose max-w-none text-gray-700 leading-relaxed [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      ) : (
        <p className="text-gray-500">No content available for this page.</p>
      )}
    </div>
  );
}
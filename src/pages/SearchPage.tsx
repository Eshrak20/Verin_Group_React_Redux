/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/SearchPage.tsx
import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  // সার্চ কোয়েরি দিয়ে ডেটা ফেচ করা হচ্ছে
  const { data, isLoading } = useGetProductsQuery(
    { search: query, per_page: 100 },
    { skip: !query.trim() }
  );

  const allProducts = data?.data || [];

  // ক্লায়েন্ট সাইড ফিল্টারিং (সার্চ ড্রপডাউনের মতো সেম লজিক)
  const filteredProducts = allProducts.filter((product: any) => {
    const productName = product.name?.toLowerCase() || "";
    return productName.includes(query.toLowerCase());
  });

  if (isLoading) {
    return <div className="text-center py-20 font-semibold">Loading results...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Search Results for: <span className="text-blue-600">"{query}"</span>
      </h1>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => {
            const firstVariant = product.variants?.[0];
            const imageUrl = product.thumbnail || firstVariant?.images?.[0]?.image_url || "https://via.placeholder.com/150";
            const price = firstVariant?.price || 0;

            return (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-xl bg-gray-50 mb-4"
                  />
                  <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 min-h-11">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {firstVariant?.sku || `PD-00${product.id}`}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    TK {Number(price).toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                    View Details
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
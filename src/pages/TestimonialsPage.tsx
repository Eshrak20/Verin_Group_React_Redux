import { useGetReviewsQuery } from "@/redux/services/homepage/homePage.api";


interface ApiReview {
  id: number;
  client_name: string;
  client_position: string | null;
  client_image: string;
  rating: string;
  review: string;
  item: string;
  is_active: string;
  sort_order: string;
  created_at: string;
  updated_at: string;
  image_url: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#FBBF24" : "#E5E7EB"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ src, name }: { src: string; name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<span class="text-base font-bold text-blue-600 dark:text-blue-300">${initials}</span>`;
          }
        }}
      />
    </div>
  );
}

function cleanReviewText(htmlString: string) {
  if (!htmlString) return "";
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, "text/html").body.textContent || "";
}

export default function TestimonialsPage() {
  const { data, isLoading, isError } = useGetReviewsQuery({});

  const reviewsList: ApiReview[] = data?.data ?? [];

  // শুধুমাত্র active রিভিউগুলো শর্ট অর্ডার অথবা নতুন ডেট অনুযায়ী ফিল্টার করা
  const activeReviews = [...reviewsList]
    .filter((item) => item.is_active === "1")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Client Testimonials
        </h1>
        <div className="w-16 h-1 bg-[#262626] dark:bg-white mx-auto mt-3 mb-4 rounded-full" />
        <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Read what our valued customers have to say about their experiences with our products and services.
        </p>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-48 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse p-6 flex flex-col justify-between"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-12">
          <p className="text-red-500 font-medium">
            Failed to load testimonials. Please try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && activeReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No testimonials found at the moment.
          </p>
        </div>
      )}

      {/* All Testimonials Grid */}
      {!isLoading && !isError && activeReviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeReviews.map((t) => {
            const formattedDate = new Date(t.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <div
                key={t.id}
                className="
                  bg-white dark:bg-slate-800
                  border border-gray-200 dark:border-slate-700
                  rounded-2xl p-6 flex flex-col gap-4
                  shadow-sm hover:shadow-md transition-shadow duration-300
                "
              >
                {/* Top — Avatar + Name & Date */}
                <div className="flex items-center gap-4">
                  <Avatar src={t.image_url} name={t.client_name} />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {t.client_name}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                  "{cleanReviewText(t.review)}"
                </p>

                {/* Bottom — Stars + Category Badge */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/50">
                  <StarRating rating={Number(t.rating) || 5} />
                  {t.item && (
                    <span className="text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-600">
                      {t.item}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
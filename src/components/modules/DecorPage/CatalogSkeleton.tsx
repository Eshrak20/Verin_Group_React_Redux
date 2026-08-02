// src/components/modules/DecorPage/CatalogSkeleton.tsx

export default function CatalogSkeleton({
  containerRef,
}: {
  containerRef: (node?: Element | null) => void;
}) {
  return (
    <section
      ref={containerRef}
      id="catalog-section"
      className="py-6 sm:py-10 scroll-mt-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8">
        <div>
          <div className="h-8 w-44 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 animate-pulse"
          >
            <div className="aspect-square w-full rounded-2xl bg-gray-200 dark:bg-slate-700 mb-4" />
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
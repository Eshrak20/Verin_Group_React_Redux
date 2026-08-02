// src/components/modules/HomePage/BlogSkeleton.tsx

interface BlogSkeletonProps {
  containerRef: (node?: Element | null) => void;
}

export default function BlogSkeleton({ containerRef }: BlogSkeletonProps) {
  return (
    <section ref={containerRef} className="py-8 sm:py-10 lg:py-12 max-w-6xl mx-auto w-full px-4">
      <div className="text-center mb-6">
        <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse" />
        <div className="w-12 h-0.5 bg-gray-300 mx-auto mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-72 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}
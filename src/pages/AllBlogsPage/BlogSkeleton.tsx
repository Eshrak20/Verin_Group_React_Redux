// src/components/modules/Blog/BlogSkeleton.tsx
export default function BlogSkeleton() {
  return (
    <div className="min-h-screen py-8 px-4 lg:px-0 max-w-7xl mx-auto">
      <div className="mb-6 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-3 animate-pulse" />
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-2 animate-pulse" />
        <div className="h-4 w-full max-w-xl bg-gray-200 dark:bg-slate-700 rounded mt-2 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-72 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse border border-gray-200/50 dark:border-slate-700"
          />
        ))}
      </div>
    </div>
  );
}
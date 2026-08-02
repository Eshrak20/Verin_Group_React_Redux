// src/components/modules/Blog/BlogSkeleton.tsx
export default function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl p-8 space-y-4 animate-pulse border border-gray-200/50 dark:border-slate-700">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/4 rounded animate-pulse" />
            <div className="h-8 bg-gray-200 dark:bg-slate-700 w-3/4 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/3 rounded animate-pulse" />
            <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="lg:col-span-1 space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
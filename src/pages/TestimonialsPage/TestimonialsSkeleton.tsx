// src/components/modules/Testimonials/TestimonialsSkeleton.tsx
export default function TestimonialsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div
          key={n}
          className="h-60 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse p-6 flex flex-col gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
            </div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mt-2" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-full mt-auto" />
        </div>
      ))}
    </div>
  );
}
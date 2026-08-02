// src/components/modules/HomePage/CategorySkeleton.tsx

export default function CategorySkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden mx-auto justify-center">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="flex flex-col items-center min-w-45 sm:min-w-55 lg:min-w-69 w-45 sm:w-55 lg:w-69"
        >
          <div className="w-full aspect-square rounded-2xl bg-gray-200 animate-pulse" />
          <div className="mt-3 h-3 w-20 rounded bg-gray-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
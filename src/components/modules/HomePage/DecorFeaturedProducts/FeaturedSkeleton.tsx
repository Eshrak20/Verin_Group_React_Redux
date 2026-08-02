

interface FeaturedSkeletonProps {
  visibleCount: number;
}

export default function FeaturedSkeleton({ visibleCount }: FeaturedSkeletonProps) {
  return (
    <div className="py-2">
      <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-4 sm:mb-6">
        Decor Featured Products
      </h2>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: visibleCount }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 aspect-square rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
          />
        ))}
      </div>
    </div>
  );
}
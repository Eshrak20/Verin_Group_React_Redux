export default function FeaturedSkeleton({ containerRef }: { containerRef: (node?: Element | null) => void }) {
  return (
    <section ref={containerRef} className="py-10 sm:py-12 lg:py-16">
      <div className="flex flex-row items-end justify-between mb-6 sm:mb-8 lg:mb-10 gap-4">
        <div>
          <div className="h-7 sm:h-9 w-40 sm:w-52 bg-stone-200 rounded animate-pulse" />
          <div className="h-4 w-32 sm:w-36 bg-stone-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[2.2rem] p-4 border border-stone-100 animate-pulse"
          >
            <div className="aspect-4/5 w-full rounded-[1.8rem] bg-stone-200" />
            <div className="mt-5 px-1 space-y-3">
              <div className="h-3 bg-stone-200 rounded w-1/2" />
              <div className="h-5 bg-stone-200 rounded w-3/4" />
              <div className="h-4 bg-stone-200 rounded w-1/3" />
              <div className="h-10 bg-stone-200 rounded-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
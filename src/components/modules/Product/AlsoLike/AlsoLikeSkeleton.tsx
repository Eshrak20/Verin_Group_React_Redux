// src/components/modules/ProductDetails/AlsoLikeSkeleton.tsx

export default function AlsoLikeSkeleton() {
  return (
    <section className="bg-[#FAF9F6] py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif text-stone-900 mb-10">
          You may also like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
}
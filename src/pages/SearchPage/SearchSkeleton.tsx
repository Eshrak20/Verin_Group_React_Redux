// src/components/modules/Search/SearchSkeleton.tsx
export default function SearchSkeleton() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-center font-semibold text-gray-500 animate-pulse">
        Loading results...
      </div>
    </div>
  );
}
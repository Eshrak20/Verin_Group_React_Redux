// src/components/modules/Clients/ClientsSkeleton.tsx
export default function ClientsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
        <div
          key={n}
          className="aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"
        />
      ))}
    </div>
  );
}
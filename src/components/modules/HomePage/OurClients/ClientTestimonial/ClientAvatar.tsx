// src/components/modules/Home/ClientAvatar.tsx

export default function ClientAvatar({ src, name }: { src: string; name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
      <img
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<span class="text-sm font-bold text-blue-600 dark:text-blue-300">${initials}</span>`;
          }
        }}
      />
    </div>
  );
}
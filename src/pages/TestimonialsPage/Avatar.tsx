// src/components/modules/Testimonials/Avatar.tsx
export default function Avatar({ src, name }: { src: string; name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            const existingInitials = parent.querySelector('.avatar-initials');
            if(!existingInitials) {
                const span = document.createElement('span');
                span.className = "avatar-initials text-base font-bold text-blue-600 dark:text-blue-300";
                span.textContent = initials;
                parent.appendChild(span);
            }
          }
        }}
      />
    </div>
  );
}
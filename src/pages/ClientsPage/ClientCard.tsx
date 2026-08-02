/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";

interface ClientCardProps {
  client: any;
  index: number;
}

export default function ClientCard({ client, index }: ClientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        group bg-white dark:bg-slate-800 
        border border-gray-200 dark:border-slate-700 
        rounded-2xl p-4 flex flex-col items-center justify-center gap-3 
        shadow-sm hover:shadow-md transition-all duration-300
        hover:border-blue-400
      "
    >
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden p-2">
        <img
          src={client.image_url}
          alt={client.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="text-xs font-semibold text-gray-400 dark:text-gray-500 text-center px-1">${client.name}</span>`;
            }
          }}
        />
      </div>
      <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center truncate w-full">
        {client.name}
      </p>
    </motion.div>
  );
}
// src/components/modules/Blog/BlogNotFound.tsx
import { motion } from "framer-motion";

interface BlogNotFoundProps {
  isBangla: boolean;
  onBackHome: () => void;
}

export default function BlogNotFound({ isBangla, onBackHome }: BlogNotFoundProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-[#fbf5f8] dark:bg-slate-900">
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-lg font-bold text-gray-700 dark:text-gray-200"
      >
        {isBangla ? "ব্লগ পাওয়া যায়নি" : "Blog Not Found"}
      </motion.h2>
      <button
        onClick={onBackHome}
        className="px-4 py-2 bg-[#262626] text-white rounded-xl text-xs hover:cursor-pointer hover:bg-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
      >
        {isBangla ? "হোমে ফিরে যান" : "Back Home"}
      </button>
    </div>
  );
}
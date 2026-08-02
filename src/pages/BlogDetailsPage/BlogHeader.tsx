// src/components/modules/Blog/BlogHeader.tsx
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BlogHeaderProps {
  isBangla: boolean;
  setIsBangla: (value: boolean) => void;
  onBack: () => void;
}

export default function BlogHeader({ isBangla, setIsBangla, onBack }: BlogHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex justify-between items-center mb-6 pt-6"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 hover:cursor-pointer text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-all duration-300 hover:-translate-x-1 group"
      >
        <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
        {isBangla ? "ফিরে যান" : "Go Back"}
      </button>

      <div className="flex bg-white dark:bg-slate-800 rounded-full p-1 border dark:border-slate-700 shadow-sm">
        <button
          onClick={() => setIsBangla(true)}
          className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-300 ease-in-out transform ${
            isBangla
              ? "bg-[#262626] text-white shadow-md scale-105"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          বাংলা
        </button>
        <button
          onClick={() => setIsBangla(false)}
          className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-300 ease-in-out transform ${
            !isBangla
              ? "bg-[#262626] text-white shadow-md scale-105"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          English
        </button>
      </div>
    </motion.div>
  );
}
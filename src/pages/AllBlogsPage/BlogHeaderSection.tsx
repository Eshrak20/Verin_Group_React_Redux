// src/components/modules/Blog/BlogHeaderSection.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BlogHeaderSectionProps {
  isBangla: boolean;
  setIsBangla: (val: boolean) => void;
}

export default function BlogHeaderSection({
  isBangla,
  setIsBangla,
}: BlogHeaderSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-6"
    >
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
        <Link to="/" className="text-blue-600 hover:underline transition-colors duration-200">
          Home
        </Link>
        <span>»</span>
        <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded transition-colors duration-300">
          {isBangla ? "সব ব্লগ পেজ" : "Welcome to all blogs page"}
        </span>
      </div>

      {/* Title & Language Toggle in Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
          {isBangla ? "সকল ব্লগ" : "All blogs"}
        </h1>

        {/* Language Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-full p-1 w-fit border dark:border-slate-700 shadow-sm transition-colors duration-300">
          <button
            onClick={() => setIsBangla(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 transform ${
              isBangla
                ? "bg-[#262626] text-white shadow-md scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => setIsBangla(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 transform ${
              !isBangla
                ? "bg-[#262626] text-white shadow-md scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Subtitle / Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-3xl leading-relaxed transition-all duration-300">
        {isBangla
          ? "আমাদের সাম্প্রতিক চিন্তা, গল্প এবং টিপস এক্সপ্লোর করুন। আপনার নতুন কিছু শেখা ও জানার আগ্রহকে বাড়াতে ট্রেন্ড, টিউটোরিয়াল এবং বিশেষজ্ঞ পরামর্শের সাথে যুক্ত থাকুন।"
          : "Explore our latest insights, stories, and tips on. Stay updated with trends, tutorials, and expert advice to fuel your curiosity and growth."}
      </p>

      {/* Divider Line */}
      <hr className="mt-6 border-gray-200 dark:border-slate-700 transition-colors duration-300" />
    </motion.div>
  );
}
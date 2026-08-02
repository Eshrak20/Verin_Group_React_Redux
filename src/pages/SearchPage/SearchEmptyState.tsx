// src/components/modules/Search/SearchEmptyState.tsx
import { motion } from "framer-motion";

export default function SearchEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center py-16 text-gray-500 dark:text-gray-400"
    >
      No products found matching your search.
    </motion.div>
  );
}
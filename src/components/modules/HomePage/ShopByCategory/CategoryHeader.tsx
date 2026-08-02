// src/components/modules/HomePage/CategoryHeader.tsx

import { motion } from "framer-motion";

export default function CategoryHeader() {
  return (
    <motion.div 
      className="text-center mb-6 sm:mb-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text">
        Shop By Category
      </h2>
      <motion.p 
        className="text-xs sm:text-sm home-black-text mt-1"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Explore our curated collections.
      </motion.p>
    </motion.div>
  );
}
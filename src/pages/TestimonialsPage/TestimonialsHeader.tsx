// src/components/modules/Testimonials/TestimonialsHeader.tsx
import { motion } from "framer-motion";

export default function TestimonialsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center mb-12"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
        Client Testimonials
      </h1>
      <div className="w-16 h-1 bg-[#262626] dark:bg-white mx-auto mt-3 mb-4 rounded-full" />
      <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Read what our valued customers have to say about their experiences with our products and services.
      </p>
    </motion.div>
  );
}
// src/components/modules/Clients/ClientsHeader.tsx
import { motion } from "framer-motion";

export default function ClientsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-12"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
        Our Valued Clients
      </h1>
      <div className="w-16 h-1 bg-[#262626] dark:bg-white mx-auto mt-3 mb-4 rounded-full" />
      <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        We are proud to work with an amazing group of brands and organizations.
      </p>
    </motion.div>
  );
}
// src/components/modules/Home/ClientTestimonialCard.tsx

import { motion } from "framer-motion";
import ClientAvatar from "./ClientAvatar";
import ClientStarRating from "./ClientStarRating";
import { cleanReviewText, type ApiReview } from "@/utils/client.utils";

interface ClientTestimonialCardProps {
  review: ApiReview;
  index: number;
}

export default function ClientTestimonialCard({
  review: t,
  index,
}: ClientTestimonialCardProps) {
  const formattedDate = new Date(t.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      key={t.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="
        bg-white dark:bg-slate-800
        border border-gray-200 dark:border-slate-700
        rounded-2xl p-4 flex flex-col gap-3
        hover:shadow-md transition-shadow duration-300
      "
    >
      {/* Top — Avatar + Name */}
      <div className="flex items-center gap-3">
        <ClientAvatar src={t.image_url} name={t.client_name} />
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {t.client_name}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Review */}
      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
        {cleanReviewText(t.review)}
      </p>

      {/* Bottom — Stars + Category Badge */}
      <div className="flex items-center justify-between mt-1">
        <ClientStarRating rating={Number(t.rating) || 5} />
        <span className="text-[10px] font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-slate-600">
          {t.item}
        </span>
      </div>
    </motion.div>
  );
}
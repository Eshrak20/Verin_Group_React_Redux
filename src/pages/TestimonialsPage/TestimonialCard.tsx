// src/components/modules/Testimonials/TestimonialCard.tsx
import { motion } from "framer-motion";
import Avatar from "./Avatar";
import StarRating from "./StarRating";
import { type ApiReview } from "@/hooks/useTestimonials";

function cleanReviewText(htmlString: string) {
  if (!htmlString) return "";
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, "text/html").body.textContent || "";
}

interface TestimonialCardProps {
  testimonial: ApiReview;
  index: number;
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const formattedDate = new Date(testimonial.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
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
        rounded-2xl p-6 flex flex-col gap-4
        shadow-sm hover:shadow-md transition-shadow duration-300
        h-full
      "
    >
      <div className="flex items-center gap-4">
        <Avatar src={testimonial.image_url} name={testimonial.client_name} />
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {testimonial.client_name}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {formattedDate}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
        "{cleanReviewText(testimonial.review)}"
      </p>

      <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-slate-700/50">
        <StarRating rating={Number(testimonial.rating) || 5} />
        {testimonial.item && (
          <span className="text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-600">
            {testimonial.item}
          </span>
        )}
      </div>
    </motion.div>
  );
}
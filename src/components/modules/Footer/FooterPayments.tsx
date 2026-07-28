import { motion } from "framer-motion";

export function FooterPayments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-1"
    >
      <h4 className="home-black-text font-bold text-base mb-1.5">We Accept</h4>

      <div className="w-full max-w-60">
        <img
          src="/assets/we_accept2.png"
          alt="We Accept Payment Methods"
          className="w-full h-auto object-contain rounded-lg"
        />
      </div>

      <div className="w-full max-w-60">
        <img
          src="/assets/we_accept3.png"
          alt="We Accept Payment Methods"
          className="w-full h-auto object-contain rounded-lg"
        />
      </div>
    </motion.div>
  );
}
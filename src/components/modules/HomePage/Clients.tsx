import { motion } from "framer-motion";
import ClientTestimonials from "./ClientTestimonials";
import OurClients from "./OurClients";

export default function Clients() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex justify-center">
        {/* 🎯 Header with Scroll-Triggered Fade-In Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-2xl sm:text-3xl lg:text-4xl home-black-text pt-3 sm:pt-4 lg:pt-5 font-bold text-center"
        >
          Our Clients
        </motion.h1>
      </div>

      <OurClients />

      <div className="border-t border-gray-200 dark:border-gray-700 mx-3 sm:mx-6 lg:mx-6" />

      <ClientTestimonials />
    </div>
  );
}









// import ClientTestimonials from "./ClientTestimonials";
// import OurClients from "./OurClients";

// export default function Clients() {
//   return (
//     <div className="max-w-6xl mx-auto w-full ">
//       <div className="flex justify-center">
//         <h1 className="text-2xl sm:text-3xl lg:text-4xl home-black-text pt-3 sm:pt-4 lg:pt-5 font-bold text-center">
//           Our Clients
//         </h1>
//       </div>
//       <OurClients />
//       <div className="border-t border-gray-200 dark:border-gray-700 mx-3 sm:mx-6 lg:mx-6" />
 
//       <ClientTestimonials />
//     </div>
//   );
// }



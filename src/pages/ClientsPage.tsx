
import { useGetClientQuery } from "@/redux/services/homepage/homePage.api";
import { motion } from "framer-motion";

interface Client {
  id: number;
  name: string;
  logo: string;
  is_active: number | string;
  sort_order: number | string;
  created_at: string;
  updated_at: string;
  image_url: string;
}

export default function ClientsPage() {
  const { data, isLoading, isError } = useGetClientQuery({});

  const rawClients: Client[] = data?.data ?? [];

  // Active ক্লায়েন্ট ফিল্টার এবং Sort করা
  const clients = rawClients
    .filter((client) => Number(client.is_active) === 1)
    .sort((a, b) => Number(a.sort_order) - Number(b.sort_order));

  return (
    <div className="min-h-screen py-12 px-4 lg:px-0 max-w-7xl mx-auto">
      {/* Page Header Animation */}
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

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
            <div
              key={n}
              className="aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-12">
          <p className="text-red-500 font-medium">
            Failed to load clients. Please try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && clients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No clients found at the moment.
          </p>
        </div>
      )}

      {/* Clients Grid */}
      {!isLoading && !isError && clients.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.05, // FeaturedPieces-এর মতো ১টির পর ১টি স্মুথ স্ট্যাগার এনিমেশন
                ease: [0.16, 1, 0.3, 1], // অতি স্মুথ বেজিয়ার কার্ভ
              }}
              className="
                group bg-white dark:bg-slate-800 
                border border-gray-200 dark:border-slate-700 
                rounded-2xl p-4 flex flex-col items-center justify-center gap-3 
                shadow-sm hover:shadow-md transition-all duration-300
                hover:border-blue-400
              "
            >
              <div className="w-full aspect-square flex items-center justify-center overflow-hidden p-2">
                <img
                  src={client.image_url}
                  alt={client.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-xs font-semibold text-gray-400 dark:text-gray-500 text-center px-1">${client.name}</span>`;
                    }
                  }}
                />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center truncate w-full">
                {client.name}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}







// import { useGetClientQuery } from "@/redux/services/homepage/homePage.api"; 

// interface Client {
//   id: number;
//   name: string;
//   logo: string;
//   is_active: number | string;
//   sort_order: number | string;
//   created_at: string;
//   updated_at: string;
//   image_url: string;
// }

// export default function ClientsPage() {
//   const { data, isLoading, isError } = useGetClientQuery({});

//   const rawClients: Client[] = data?.data ?? [];

//   // Active ক্লায়েন্ট ফিল্টার এবং Sort করা
//   const clients = rawClients
//     .filter((client) => Number(client.is_active) === 1)
//     .sort((a, b) => Number(a.sort_order) - Number(b.sort_order));

//   return (
//     <div className="min-h-screen py-12 px-4  lg:px-0 max-w-7xl mx-auto">
//       {/* Page Header */}
//       <div className="text-center mb-12">
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
//           Our Valued Clients
//         </h1>
//         <div className="w-16 h-1 bg-[#262626] dark:bg-white mx-auto mt-3 mb-4 rounded-full" />
//         <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//           We are proud to work with an amazing group of brands and organizations.
//         </p>
//       </div>

//       {/* Loading Skeleton */}
//       {isLoading && (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
//           {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
//             <div
//               key={n}
//               className="aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"
//             />
//           ))}
//         </div>
//       )}

//       {/* Error State */}
//       {isError && (
//         <div className="text-center py-12">
//           <p className="text-red-500 font-medium">
//             Failed to load clients. Please try again later.
//           </p>
//         </div>
//       )}

//       {/* Empty State */}
//       {!isLoading && !isError && clients.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500 dark:text-gray-400">
//             No clients found at the moment.
//           </p>
//         </div>
//       )}

//       {/* Clients Grid */}
//       {!isLoading && !isError && clients.length > 0 && (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
//           {clients.map((client) => (
//             <div
//               key={client.id}
//               className="
//                 group bg-white dark:bg-slate-800 
//                 border border-gray-200 dark:border-slate-700 
//                 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 
//                 shadow-sm hover:shadow-md transition-all duration-300
//                 hover:border-blue-400
//               "
//             >
//               <div className="w-full aspect-square flex items-center justify-center overflow-hidden p-2">
//                 <img
//                   src={client.image_url}
//                   alt={client.name}
//                   className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.style.display = "none";
//                     const parent = target.parentElement;
//                     if (parent) {
//                       parent.innerHTML = `<span class="text-xs font-semibold text-gray-400 dark:text-gray-500 text-center px-1">${client.name}</span>`;
//                     }
//                   }}
//                 />
//               </div>
//               <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center truncate w-full">
//                 {client.name}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
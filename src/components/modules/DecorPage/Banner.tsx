import { motion } from "framer-motion"; // 🎯 Framer Motion Import

export default function Banner() {
  return (
    <div className="w-full py-4 sm:py-6 lg:py-8">
      {/* Main Banner Container */}
      <div className="bg-[#dfd9cf] text-stone-900 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] grid lg:grid-cols-12 overflow-hidden relative">
        
        {/* LEFT COLUMN: Main Typography & CTA */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-between gap-6 sm:gap-8 lg:gap-12 lg:min-h-125">
          <div className="space-y-4 sm:space-y-6">
            
            {/* 🎯 Elegant Serif Heading Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl sm:text-4xl lg:text-[3.5rem] font-serif tracking-tight leading-[1.15] text-stone-900 max-w-2xl"
            >
              Curated pop culture <br className="hidden sm:inline" />
              <span className="font-serif italic">&</span> novelty decor for <br className="hidden sm:inline" />
              modern living.
            </motion.h1>
            
            {/* 🎯 Subtitle Description Animation */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="max-w-md text-stone-600/90 text-sm sm:text-base leading-relaxed"
            >
              Discover unique showpieces from your favorite pop culture
              universes. Anime, games, and novelty items crafted for fans.
            </motion.p>
          </div>

          {/* 🎯 Outline Button Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <button className="border border-stone-900 rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-xs font-bold tracking-widest uppercase hover:bg-stone-900 hover:text-[#dfd9cf] transition-all duration-300 cursor-pointer">
              Explore All
            </button>
          </motion.div>
        </div>

        {/* MIDDLE VERTICAL DIVIDER (Only visible on large screens) */}
        <div className="hidden lg:block w-px bg-stone-400/40 my-10 col-span-1 justify-self-center"></div>

        {/* RIGHT COLUMN: Hand-written Lined Note */}
        <div className="lg:col-span-4 p-6 sm:p-10 lg:py-14 lg:pr-14 lg:pl-0 flex flex-col border-t lg:border-t-0 border-stone-400/30">
          
          {/* Note Header: Customer Text & Badge */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <span className="text-xl sm:text-2xl font-serif italic text-stone-500/80 tracking-wide">
              Dear customer...
            </span>
            {/* Collection Badge */}
            <span className="bg-[#525345] text-[9px] sm:text-[10px] tracking-widest font-extrabold uppercase text-[#dfd9cf] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full shadow-xs shrink-0">
              Collection 2026
            </span>
          </div>

          {/* Lined Postcard Section */}
          <div className="flex-1 flex flex-col justify-start text-stone-500/70 font-serif italic text-lg sm:text-xl">
            {[
              "Thank you ! Your",
              "support and love",
              "means everything to",
              "our business. We truly",
              "appreciate you and hope",
              "you love it"
            ].map((line, index) => (
              <div 
                key={index} 
                className="border-b border-stone-400/40 py-2 sm:py-2.5 flex items-end min-h-10 sm:min-h-11.5"
                style={{ fontFamily: "'Caveat', 'Dancing Script', cursive, serif" }}
              >
                <span className="pl-1 tracking-wide text-xl sm:text-[1.35rem] leading-none text-stone-500/80">
                  {line}
                </span>
              </div>
            ))}
            {/* Final empty line to match the image precisely */}
            <div className="border-b border-stone-400/40 py-2 sm:py-2.5 min-h-10 sm:min-h-11.5"></div>
          </div>

        </div>

      </div>
    </div>
  );
}










// export default function Banner() {
//   return (
//     <div className="w-full py-4 sm:py-6 lg:py-8">
//       {/* Main Banner Container */}
//       <div className="bg-[#dfd9cf] text-stone-900 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] grid lg:grid-cols-12 overflow-hidden relative">
        
//         {/* LEFT COLUMN: Main Typography & CTA */}
//         <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-between gap-6 sm:gap-8 lg:gap-12 lg:min-h-125">
//           <div className="space-y-4 sm:space-y-6">
//             {/* Elegant Serif Heading */}
//             <h1 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-serif tracking-tight leading-[1.15] text-stone-900 max-w-2xl">
//               Curated pop culture <br className="hidden sm:inline" />
//               <span className="font-serif italic">&</span> novelty decor for <br className="hidden sm:inline" />
//               modern living.
//             </h1>
            
//             {/* Subtitle description */}
//             <p className="max-w-md text-stone-600/90 text-sm sm:text-base leading-relaxed">
//               Discover unique showpieces from your favorite pop culture
//               universes. Anime, games, and novelty items crafted for fans.
//             </p>
//           </div>

//           {/* Outline Button */}
//           <div>
//             <button className="border border-stone-900 rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-xs font-bold tracking-widest uppercase hover:bg-stone-900 hover:text-[#dfd9cf] transition-all duration-300 cursor-pointer">
//               Explore All
//             </button>
//           </div>
//         </div>

//         {/* MIDDLE VERTICAL DIVIDER (Only visible on large screens) */}
//         <div className="hidden lg:block w-px bg-stone-400/40 my-10 col-span-1 justify-self-center"></div>

//         {/* RIGHT COLUMN: Hand-written Lined Note */}
//         <div className="lg:col-span-4 p-6 sm:p-10 lg:py-14 lg:pr-14 lg:pl-0 flex flex-col border-t lg:border-t-0 border-stone-400/30">
          
//           {/* Note Header: Customer Text & Badge */}
//           <div className="flex items-center justify-between mb-4 gap-2">
//             <span className="text-xl sm:text-2xl font-serif italic text-stone-500/80 tracking-wide">
//               Dear customer...
//             </span>
//             {/* Collection Badge */}
//             <span className="bg-[#525345] text-[9px] sm:text-[10px] tracking-widest font-extrabold uppercase text-[#dfd9cf] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full shadow-xs shrink-0">
//               Collection 2026
//             </span>
//           </div>

//           {/* Lined Postcard Section */}
//           <div className="flex-1 flex flex-col justify-start text-stone-500/70 font-serif italic text-lg sm:text-xl">
//             {[
//               "Thank you ! Your",
//               "support and love",
//               "means everything to",
//               "our business. We truly",
//               "appreciate you and hope",
//               "you love it"
//             ].map((line, index) => (
//               <div 
//                 key={index} 
//                 className="border-b border-stone-400/40 py-2 sm:py-2.5 flex items-end min-h-10 sm:min-h-11.5"
//                 style={{ fontFamily: "'Caveat', 'Dancing Script', cursive, serif" }}
//               >
//                 <span className="pl-1 tracking-wide text-xl sm:text-[1.35rem] leading-none text-stone-500/80">
//                   {line}
//                 </span>
//               </div>
//             ))}
//             {/* Final empty line to match the image precisely */}
//             <div className="border-b border-stone-400/40 py-2 sm:py-2.5 min-h-10 sm:min-h-11.5"></div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MessageCircle, Send, Globe, Award, Headphones
} from "lucide-react";
// react-icons থেকে সোশ্যাল আইকন ইমপোর্ট করা হলো
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

interface Blog {
  id: number;
  image: string;
  categoryBn: string;
  categoryEn: string;
  titleBn: string;
  titleEn: string;
  excerptBn: string;
  excerptEn: string;
  dateBn: string;
  dateEn: string;
  path: string;
}

const blogs: Blog[] = [
  {
    id: 1,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847868/blog6_snmspo.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "CPU বনাম GPU আর্কিটেকচার: সিকোয়েন্শিয়াল বনাম প্যারালাল এক্সিকিউশন",
    titleEn: "CPU vs GPU Architecture: Sequential Logic vs Parallel Execution",
    excerptBn: "একটি ব্লগ পোস্টে বিস্তারিত জানুন কীভাবে CPU এবং GPU একে অপরের থেকে আলাদা এবং কোন কাজে কোনটি বেশি কার্যকর।",
    excerptEn: "Learn in detail how CPU and GPU differ from each other and which is more effective for which tasks.",
    dateBn: "জুলাই ১, ২০২৪",
    dateEn: "July 1, 2024",
    path: "/blogs/1",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog1_z95qzk.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
    titleEn: "Why TypeScript is a Game-Changer for Developers",
    excerptBn: "TypeScript হল JavaScript এর একটি সুপারসেট যা স্ট্যাটিক টাইপিং যোগ করে এবং কোডের মান উন্নত করে।",
    excerptEn: "TypeScript is a superset of JavaScript that adds static typing and significantly improves code quality.",
    dateBn: "জুলাই ২, ২০২৪",
    dateEn: "July 2, 2024",
    path: "/blogs/2",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog4_bczxvg.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
    titleEn: "Why TypeScript is a Game-Changer for Developers",
    excerptBn: "TypeScript হল একটি প্রোগ্রামিং ল্যাঙ্গুয়েজ যা JavaScript এর উপর ভিত্তি করে তৈরি।",
    excerptEn: "TypeScript is a programming language built on top of JavaScript that provides many benefits in large projects.",
    dateBn: "জুলাই ২, ২০২৪",
    dateEn: "July 2, 2024",
    path: "/blogs/3",
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog2_pblwwx.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
    titleEn: "Why TypeScript is a Game-Changer for Developers",
    excerptBn: "TypeScript ব্যবহার করে আপনি কোড লেখার সময় অনেক ভুল আগেই ধরতে পারবেন।",
    excerptEn: "Using TypeScript, you can catch many mistakes while writing code that could have caused runtime problems.",
    dateBn: "জুলাই ২, ২০২৪",
    dateEn: "July 2, 2024",
    path: "/blogs/4",
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847869/blog3_rmvs5h.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
    titleEn: "Why TypeScript is a Game-Changer for Developers",
    excerptBn: "আধুনিক ওয়েব ডেভেলপমেন্টে TypeScript এর ভূমিকা দিন দিন আরও গুরুত্বপূর্ণ হয়ে উঠছে।",
    excerptEn: "The role of TypeScript in modern web development is becoming increasingly important day by day.",
    dateBn: "জুলাই ২, ২০২৪",
    dateEn: "July 2, 2024",
    path: "/blogs/5",
  },
  {
    id: 6,
    image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847868/blog5_bkqlqm.jpg",
    categoryBn: "টিউটোরিয়াল",
    categoryEn: "Tutorial",
    titleBn: "কেন TypeScript ডেভেলপারদের জন্য একটি গেম-চেঞ্জার",
    titleEn: "Why TypeScript is a Game-Changer for Developers",
    excerptBn: "TypeScript শিখলে আপনি React, Node.js সহ অনেক ফ্রেমওয়ার্কে আরও দক্ষতার সাথে কাজ করতে পারবেন।",
    excerptEn: "Learning TypeScript will allow you to work more efficiently with React, Node.js and many other frameworks.",
    dateBn: "জুলাই ২, ২০২৪",
    dateEn: "July 2, 2024",
    path: "/blogs/6",
  },
];

export default function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBangla, setIsBangla] = useState(true);

  const currentBlog = blogs.find((b) => b.id === Number(id));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!currentBlog) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-[#fbf5f8]">
        <h2 className="text-lg font-bold text-gray-700">Blog Not Found</h2>
        <button onClick={() => navigate("/")} className="px-4 py-2 bg-[#262626] text-white rounded-xl text-xs">
          Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* ল্যাঙ্গুয়েজ টগল ও ব্যাক বাটন অ্যাকশন */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:cursor-pointer text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> {isBangla ? "ফিরে যান" : "Go Back"}
          </button>

          <div className="flex bg-white  dark:bg-slate-800 rounded-full p-1 border dark:border-slate-700 shadow-sm">
            <button
              onClick={() => setIsBangla(true)}
              className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-200 ${
                isBangla ? "bg-[#262626] text-white shadow-sm" : "text-gray-500"
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setIsBangla(false)}
              className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-200 ${
                !isBangla ? "bg-[#262626] text-white shadow-sm" : "text-gray-500"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* ================= বামের মেইন ব্লগ কন্টেন্ট কার্ড ================= */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-6 md:p-8 shadow-sm space-y-5">
            
            <div className="text-[11px] text-gray-400 font-medium">
              Home &gt; Blog &gt; <span className="text-gray-600 dark:text-gray-300">{isBangla ? currentBlog.categoryBn : currentBlog.categoryEn}</span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-snug">
              {isBangla ? currentBlog.titleBn : currentBlog.titleEn}
            </h1>

            <div className="text-[11px] text-gray-400 font-medium pb-2 flex flex-wrap gap-2">
              <span>By Admin • </span>
              <span>{isBangla ? currentBlog.dateBn : currentBlog.dateEn}</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {isBangla ? currentBlog.excerptBn : currentBlog.excerptEn}
            </p>

            <div className="rounded-xl overflow-hidden aspect-video border dark:border-slate-700 bg-gray-50 dark:bg-slate-950">
              <img
                src={currentBlog.image}
                alt="Blog Cover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-5 leading-relaxed pt-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                {isBangla ? "The Harsh Reality — মূল সমস্যা এবং কেন আমরা আটকে যাই" : "The Harsh Reality — Why Most People Struggle"}
              </h3>
              
              <h4 className="font-bold text-slate-800 dark:text-slate-200">
                1. Tutorial Hell Syndrome (টিউটোরিয়াল হেল)
              </h4>
              <p>
                {isBangla 
                  ? "অনেক বিগিনার কোডার প্রথম প্রথম একটির পর একটি টিউটোরিয়াল দেখে যান। একে বলা হয় 'Tutorial Hell'। ভিডিও দেখার সময় মনে হয় সব বুঝতে পারছি, কিন্তু যখনই নিজে কোড এডিটর খুলে কোড লিখতে বসা হয়, তখনই আর মাথায় কিছু কাজ করে না।"
                  : "Many beginner coders get trapped into watching one tutorial after another. This is known as 'Tutorial Hell'. While watching, everything makes perfect sense, but the moment you open a blank code editor, your mind goes completely blank."
                }
              </p>

              <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-lg border-l-4 border-[#262626] space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">How to Break It:</p>
                <p>
                  {isBangla
                    ? "একটি ছোট প্রজেক্ট সিলেক্ট করুন। শুধুমাত্র ভিডিও টিউটোরিয়াল কপি না করে নিজে থেকে লজিক বিল্ড করার চেষ্টা করুন এবং ডকুমেন্টেশন ব্যবহার করা শিখুন।"
                    : "Select a very small project. Instead of blindly copying code videos, try building logic on your own and learn to read official documentations."
                  }
                </p>
              </div>

              <h4 className="font-bold text-slate-800 dark:text-slate-200">
                2. Imposter Syndrome (নিজেকে কম যোগ্য ভাবা)
              </h4>
              <p>
                {isBangla
                  ? "কোডিং কমিউনিটিতে অন্যদের সাকসেস প্রোফাইল বা বড় কোনো প্রজেক্ট দেখে বিগিনাররা প্রায়ই ভাবেন যে 'কোডিং হয়তো আমার জন্য নয়'। এই ভয় বা দ্বিধাদ্বন্দ্ব কাটিয়ে ওঠার জন্য প্রতিদিন নিয়মিত প্র্যাকটিস করা ও নিজের ছোট ছোট ইম্প্রুভমেন্ট ট্রাক করা প্রয়োজন।"
                  : "Looking at other developers' success stories or massive setups, beginners often doubt themselves. Overcoming this requires continuous small efforts and documenting your daily programming steps."
                }
              </p>
            </div>

          </div>

          {/* ================= ডানের উইজেট সাইডবার ================= */}
          <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
            
            {/* ১. শেয়ার বক্স উইজেট */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                Share This Post
              </h4>
              <div className="flex items-center gap-2">
                {/* React Icons ব্যবহার করে সোশ্যাল বাটন */}
                <button className="p-1.5 rounded bg-blue-600 text-white hover:opacity-90 transition-opacity"><FaFacebookF size={13} /></button>
                <button className="p-1.5 rounded bg-sky-400 text-white hover:opacity-90 transition-opacity"><FaTwitter size={13} /></button>
                <button className="p-1.5 rounded bg-blue-700 text-white hover:opacity-90 transition-opacity"><FaLinkedinIn size={13} /></button>
                
                {/* Lucide Icons */}
                <button className="p-1.5 rounded bg-emerald-500 text-white hover:opacity-90 transition-opacity"><MessageCircle size={13} /></button>
                <button className="p-1.5 rounded bg-teal-500 text-white hover:opacity-90 transition-opacity"><Send size={13} /></button>
              </div>
            </div>

            {/* ২. কোর্স প্রমোশন অ্যাড ব্যানার */}
            <div className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border border-transparent rounded-xl p-5 shadow-md text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-2 bg-white/10 rounded-full animate-bounce">
                  <Award size={20} className="text-yellow-300" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase bg-black/30 px-2.5 py-0.5 rounded-full tracking-widest">Verin Dev Academy</span>
                <h5 className="text-xs sm:text-sm font-black leading-snug">
                  {isBangla ? "আমাদের নেক্সট লেভেল ফুল-স্ট্যাক কমপ্লিট ডেভেলপমেন্ট ব্যাচ" : "Become a Certified Full-Stack Web Developer"}
                </h5>
              </div>
              <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-black rounded-lg transition-transform active:scale-95 shadow-sm">
                {isBangla ? "কোর্সে এনরোল করুন" : "Enroll Now"}
              </button>
            </div>

            {/* ৩. স্ট্যাটিস্টিকস উইজেট */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm text-[11px] space-y-3 text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400"><Globe size={13} /></div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-xs">5800+</p>
                  <p className="text-[10px] text-gray-400">Global Job Placements</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-pink-50 dark:bg-slate-700 text-pink-600 dark:text-pink-400"><Award size={13} /></div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-xs">2000+</p>
                  <p className="text-[10px] text-gray-400">Remote Job Placements</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400"><Headphones size={13} /></div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-xs">24/7</p>
                  <p className="text-[10px] text-gray-400">Personal Coding Support</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
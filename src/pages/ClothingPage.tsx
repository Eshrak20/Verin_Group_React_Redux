import { Clock, Heart, Star } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa6";

export default function ClothingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F172A] px-4 py-24">
      {/* Main Card */}
      <div className="relative w-full max-w-4xl bg-linear-to-b from-[#1E293B]/60 to-[#0F172A]/80 border border-slate-800/50 rounded-[2.5rem] shadow-2xl shadow-black/40 p-8 md:p-16 flex flex-col items-center text-center backdrop-blur-xl overflow-hidden">
        
        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-8">
          <Clock size={12} className="text-slate-400 animate-pulse" />
          Coming Soon
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-sans tracking-tight text-white mb-4 font-normal">
          We are <br className="sm:hidden" />
          <span className="bg-linear-to-r from-amber-200 via-orange-300 to-rose-300 bg-clip-text text-transparent font-medium">
            launching soon
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-slate-400 max-w-md leading-relaxed font-light mb-12">
          Our new website is under construction. <br />
          Follow us to stay in the loop.
        </p>

        {/* Divider with Star */}
        <div className="flex items-center gap-4 w-40 mb-12">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-slate-700" />
          <Star size={14} className="text-slate-600 fill-slate-600" />
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-slate-700" />
        </div>

        {/* Social Media Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-slate-800/40 border border-slate-700/40 hover:border-blue-500/50 hover:bg-slate-800/70 text-slate-300 px-6 py-4 rounded-2xl transition-all duration-300 group shadow-md"
          >
            <div className="flex items-center gap-3">
              <FaFacebookF size={16} className="text-blue-500" />
              <span className="text-sm font-semibold tracking-wide">Facebook</span>
            </div>
            <span className="text-xs text-slate-500 group-hover:translate-x-0.5 transition-transform">🡥</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-slate-800/40 border border-slate-700/40 hover:border-pink-500/50 hover:bg-slate-800/70 text-slate-300 px-6 py-4 rounded-2xl transition-all duration-300 group shadow-md"
          >
            <div className="flex items-center gap-3">
              <FaInstagram size={18} className="text-pink-500" />
              <span className="text-sm font-semibold tracking-wide">Instagram</span>
            </div>
            <span className="text-xs text-slate-500 group-hover:translate-x-0.5 transition-transform">🡥</span>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-slate-800/40 border border-slate-700/40 hover:border-red-500/50 hover:bg-slate-800/70 text-slate-300 px-6 py-4 rounded-2xl transition-all duration-300 group shadow-md"
          >
            <div className="flex items-center gap-3">
              <FaYoutube size={18} className="text-red-500" />
              <span className="text-sm font-semibold tracking-wide">YouTube</span>
            </div>
            <span className="text-xs text-slate-500 group-hover:translate-x-0.5 transition-transform">🡥</span>
          </a>
        </div>

        {/* Follow Us Divider */}
        <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-8">
          <div className="w-8 h-px bg-slate-800" />
          <span>Follow Us</span>
          <Heart size={10} className="text-slate-500 fill-slate-500" />
          <div className="w-8 h-px bg-slate-800" />
        </div>

        {/* Copyright Badge */}
        <div className="bg-slate-800/30 border border-slate-800/50 text-[10px] text-slate-500 tracking-wider px-4 py-1.5 rounded-full font-mono">
          © 2026 Verin Group
        </div>

      </div>
    </div>
  );
}
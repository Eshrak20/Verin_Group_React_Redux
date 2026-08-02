// src/components/modules/Blog/BlogShareWidget.tsx
import { Send } from "lucide-react";
import { 
  FaFacebookF, 
  FaLinkedinIn, 
  FaInstagram, 
  FaWhatsapp, 
  FaRegCopy, 
  FaCheck 
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

interface BlogShareWidgetProps {
  isBangla: boolean;
  title: string;
  shareUrl: string;
  copied: boolean;
  handleCopyLink: () => void;
}

export default function BlogShareWidget({ 
  isBangla, 
  title, 
  shareUrl, 
  copied, 
  handleCopyLink 
}: BlogShareWidgetProps) {
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
        {isBangla ? "পোস্টটি শেয়ার করুন" : "Share This Post"}
      </h4>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Facebook */}
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            window.open(facebookShareUrl, "facebook-share-dialog", "width=800,height=600");
          }}
          className="p-1.5 rounded bg-blue-600 text-white hover:opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm"
          title="Share on Facebook"
        >
          <FaFacebookF size={13} />
        </a>

        {/* X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-black text-white hover:opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm"
          title="Share on X"
        >
          <FaXTwitter size={13} />
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            window.open(linkedinShareUrl, "linkedin-share-dialog", "width=600,height=600");
          }}
          className="p-1.5 rounded bg-[#0A66C2] text-white hover:opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm"
          title="Share on LinkedIn"
        >
          <FaLinkedinIn size={13} />
        </a>

        {/* Instagram */}
        <button
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({ title: title, text: title, url: shareUrl });
              } catch (error) {
                console.log("Sharing cancelled", error);
              }
            } else {
              handleCopyLink();
              alert(isBangla ? "লিংক কপি হয়েছে! এবার ইনস্টাগ্রামে শেয়ার করুন।" : "Link copied! You can now share it on Instagram.");
            }
          }}
          className="p-1.5 rounded bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white hover:opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm cursor-pointer"
          title="Share on Instagram"
        >
          <FaInstagram size={13} />
        </button>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-[#25D366] text-white hover:opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm"
          title="Share on WhatsApp"
        >
          <FaWhatsapp size={14} />
        </a>

        {/* Telegram */}
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-teal-500 text-white hover:opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm"
          title="Share on Telegram"
        >
          <Send size={13} />
        </a>

        {/* Direct Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={`p-1.5 rounded text-white hover:opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm cursor-pointer ${
            copied ? "bg-emerald-600" : "bg-gray-700 dark:bg-slate-600"
          }`}
          title={copied ? "Copied!" : "Copy Link"}
        >
          {copied ? <FaCheck size={13} /> : <FaRegCopy size={13} />}
        </button>
      </div>
    </motion.div>
  );
}
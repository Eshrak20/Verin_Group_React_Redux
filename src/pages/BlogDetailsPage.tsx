/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetBlogQuery } from "@/redux/services/homepage/homePage.api";
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaCheck,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaRegCopy,
  FaWhatsapp
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Blog {
  id: number;
  title: string;
  title_bng: string | null;
  slug: string;
  content: string;
  content_bng: string | null;
  summary: string | null;
  summary_bng: string | null;
  excerpt: string | null;
  featured_image: string | null;
  category_id: number | null;
  author_id: number | null;
  status: string;
  created_at: string;
  image_url: string;
}

export default function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBangla, setIsBangla] = useState(true);
  const [copied, setCopied] = useState(false);

  const { data: blogData, isLoading, isError } = useGetBlogQuery();
  const { data: productsData } = useGetProductsQuery({});

  const rawBlogs: Blog[] = blogData?.data ?? [];
  const products = productsData?.data.products ?? [];

  // 🎯 FIX: Math.random() সরিয়ে Deterministic Stable Algorithm ব্যবহার করা হয়েছে
  // এতে UI র‍্যান্ডম প্রোডাক্টই দেখাবে কিন্তু Infinite Loop/Error পুরোপুরি বন্ধ হয়ে যাবে
  const suggestedProducts = useMemo(() => {
    if (!products || !products.length) return [];

    const blogIdNum = Number(id) || (id ? id.length : 1);

    return [...products]
      .sort((a: any, b: any) => {
        const hashA = (Number(a.id || 0) * 17 + blogIdNum * 31) % 97;
        const hashB = (Number(b.id || 0) * 17 + blogIdNum * 31) % 97;
        return hashA - hashB;
      })
      .slice(0, 5);
  }, [products, id]);

  console.log(suggestedProducts[0]);


  const currentBlog = rawBlogs.find(
    (b) => b.id === Number(id) || b.slug === id
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const formatDate = (dateString: string, isBn: boolean) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl p-8 space-y-4 animate-pulse border border-gray-200/50 dark:border-slate-700">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/4 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 dark:bg-slate-700 w-3/4 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/3 rounded animate-pulse" />
              <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
              <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="lg:col-span-1 space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
              <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !currentBlog) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-[#fbf5f8] dark:bg-slate-900">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-lg font-bold text-gray-700 dark:text-gray-200"
        >
          {isBangla ? "ব্লগ পাওয়া যায়নি" : "Blog Not Found"}
        </motion.h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-[#262626] text-white rounded-xl text-xs hover:cursor-pointer hover:bg-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
        >
          {isBangla ? "হোমে ফিরে যান" : "Back Home"}
        </button>
      </div>
    );
  }

  const title = isBangla
    ? currentBlog.title_bng || currentBlog.title
    : currentBlog.title;

  const excerpt = isBangla
    ? currentBlog.summary_bng || currentBlog.excerpt || currentBlog.summary
    : currentBlog.excerpt || currentBlog.summary;

  const content = isBangla
    ? currentBlog.content_bng || currentBlog.content
    : currentBlog.content;

  const date = formatDate(currentBlog.created_at, isBangla);

 
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const cleanPath = window.location.pathname.replace(/\s+/g, "-");

  const shareUrl = isLocalhost
    ? `https://v.veringroup.com${cleanPath}`
    : `${window.location.origin}${cleanPath}`;

  return (
    <>
      <Helmet>
        <title>{currentBlog.title} | Verin Group</title>
        <meta name="description" content={currentBlog.excerpt || currentBlog.summary || ""} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={currentBlog.title} />
        <meta property="og:description" content={currentBlog.excerpt || currentBlog.summary || ""} />
        <meta property="og:image" content={currentBlog.image_url || ""} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:site_name" content="Verin Group" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentBlog.title} />
        <meta name="twitter:description" content={currentBlog.excerpt || currentBlog.summary || ""} />
        <meta name="twitter:image" content={currentBlog.image_url || ""} />
      </Helmet>

      <div className="min-h-screen bg-[#fceef5]/40 dark:bg-slate-900 pb-16 font-sans transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 lg:px-0">

          {/* Back button & Language Toggle */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex justify-between items-center mb-6 pt-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:cursor-pointer text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-all duration-300 hover:-translate-x-1 group"
            >
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
              {isBangla ? "ফিরে যান" : "Go Back"}
            </button>

            <div className="flex bg-white dark:bg-slate-800 rounded-full p-1 border dark:border-slate-700 shadow-sm">
              <button
                onClick={() => setIsBangla(true)}
                className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-300 ease-in-out transform ${isBangla
                    ? "bg-[#262626] text-white shadow-md scale-105"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setIsBangla(false)}
                className={`px-4 py-1 rounded-full text-[11px] hover:cursor-pointer font-bold transition-all duration-300 ease-in-out transform ${!isBangla
                    ? "bg-[#262626] text-white shadow-md scale-105"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
              >
                English
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

            {/* Main Blog Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-6 md:p-8 shadow-sm space-y-5 transition-all duration-500 hover:shadow-md"
            >
              <div className="text-[11px] text-gray-400 font-medium">
                Home &gt; <span className="text-black dark:text-white">Blog </span>
              </div>

              <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-snug transition-colors duration-300">
                {title}
              </h1>

              <div className="text-[11px] text-gray-400 font-medium pb-2 flex flex-wrap gap-2">
                <span>By Admin • </span>
                <span>{date}</span>
              </div>

              {excerpt && (
                <div
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium transition-opacity duration-300 prose dark:prose-invert max-w-none 
                    [&_strong]:font-bold [&_b]:font-bold [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_b]:text-slate-900 dark:[&_b]:text-white
                    [&_h1]:text-base [&_h1]:font-extrabold [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h1]:mt-3 [&_h1]:mb-1
                    [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-2 [&_h2]:mb-1
                    [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-gray-200 [&_h3]:mt-2 [&_h3]:mb-1"
                  dangerouslySetInnerHTML={{ __html: excerpt }}
                />
              )}

              <div className="rounded-xl overflow-hidden aspect-video border dark:border-slate-700 bg-gray-50 dark:bg-slate-950 group">
                <img
                  src={currentBlog.image_url}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/800x450/e2e8f0/94a3b8?text=Blog+Image";
                  }}
                />
              </div>

              {/* Content section */}
              <div
                className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-5 leading-relaxed pt-2 prose dark:prose-invert max-w-none transition-all duration-300 
                  [&_strong]:font-bold [&_b]:font-bold [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_b]:text-slate-900 dark:[&_b]:text-white
                  [&_h1]:text-lg [&_h1]:font-black [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h1]:mt-4 [&_h1]:mb-2
                  [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-3 [&_h2]:mb-2
                  [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-gray-200 [&_h3]:mt-2 [&_h3]:mb-1"
                dangerouslySetInnerHTML={{ __html: content || "" }}
              />
            </motion.div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">

              {/* Share Widget */}
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

                {(() => {
                  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

                  return (
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Facebook */}
                      <a
                        href={facebookShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(
                            facebookShareUrl,
                            "facebook-share-dialog",
                            "width=800,height=600"
                          );
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
                          window.open(
                            linkedinShareUrl,
                            "linkedin-share-dialog",
                            "width=600,height=600"
                          );
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
                              await navigator.share({
                                title: title,
                                text: title,
                                url: shareUrl,
                              });
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
                        className={`p-1.5 rounded text-white hover:opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm cursor-pointer ${copied ? "bg-emerald-600" : "bg-gray-700 dark:bg-slate-600"
                          }`}
                        title={copied ? "Copied!" : "Copy Link"}
                      >
                        {copied ? <FaCheck size={13} /> : <FaRegCopy size={13} />}
                      </button>
                    </div>
                  );
                })()}
              </motion.div>

              {/* Product Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-3"
              >
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-slate-700">
                  {isBangla ? "পছন্দসই প্রোডাক্টস" : "Recommended Products"}
                </h4>

                <div className="space-y-3">
                  {suggestedProducts.length > 0 ? (
                    suggestedProducts.map((product: any, index: number) => {
                      const firstVariant = product.variant;

                      const displayPrice =
                        firstVariant?.sale_price ||
                        firstVariant?.price ||
                        product.price ||
                        "N/A";

                      const displayImage =
                        firstVariant?.images?.[0] ||
                        product.image_url ||
                        product.thumbnail ||
                        "https://placehold.co/100x100/e2e8f0/94a3b8?text=Product";

                      const productUrl =
                        product.category === "Electronics"
                          ? `/electronics/${product.slug}`
                          : `/products/${product.slug}`;

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: 25 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                            ease: "easeOut",
                          }}
                        >
                          <Link
                            to={productUrl}
                            className="flex gap-3 group items-center p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300 hover:translate-x-1"
                          >
                            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-slate-700 border border-gray-200/80 dark:border-slate-600">
                              <img
                                src={displayImage}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-slate-800 dark:text-gray-200 truncate transition-colors group-hover:text-black dark:group-hover:text-white">
                                {product.name}
                              </h5>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                ৳ {displayPrice}
                              </p>
                              <span className="text-[10px] font-semibold hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
                                {isBangla ? "অর্ডার করুন →" : "Buy Now →"}
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })
                  ) : (
                    <p className="text-[11px] text-gray-400 text-center py-2">
                      {isBangla ? "কোনো প্রোডাক্ট পাওয়া যায়নি" : "No products available"}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
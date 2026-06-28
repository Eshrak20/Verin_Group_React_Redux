// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const informationLinks = [
    { label: "About Us", path: "/about" },
    { label: "Blogs", path: "/blogs" },
    { label: "Shop", path: "/shop" },
    { label: "Contact us", path: "/contact" },
    { label: "My Account", path: "/account" },
];

const customerServiceLinks = [
    { label: "Shipping", path: "/shipping" },
    { label: "Return & Refund", path: "/return-refund" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Orders FAQs", path: "/faq" },
];

const socialLinks = [
    {
        label: "Facebook",
        href: "https://facebook.com",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        ),
    },
    {
        label: "Twitter",
        href: "https://twitter.com",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M2 3h6l14 18h-6z" />
            </svg>
        ),
    },
    {
        label: "Instagram",
        href: "https://instagram.com",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
];

export default function Footer() {
    return (
        <footer className="bg-white/40 text-white">
            {/* Main Footer */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-4 gap-8">

                    {/* Col 1 — Brand */}
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="flex items-center gap-2 w-fit">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-12 w-auto object-contain"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = `<span style="color:#f97316;font-size:22px;font-weight:800;">YourBrand</span>`;
                                    }
                                }}
                            />
                        </Link>

                        <p className="text-sm text-white leading-relaxed">
                            We provide all kinds of TECH, GROCERIES and HOME ACCESSORIES.
                        </p>

                        <div className="flex flex-col gap-2.5">
                            <a
                                href="mailto:mavenzoneofficial@gmail.com"
                                className="flex items-center gap-2 text-sm  hover:text-orange-400 transition-colors duration-200"
                            >
                                <Mail size={15} className="text-orange-400 shrink-0" />
                                mavenzoneofficial@gmail.com
                            </a>
                            <a
                                href="tel:01601674566"
                                className="flex items-center gap-2 text-sm  hover:text-orange-400 transition-colors duration-200"
                            >
                                <Phone size={15} className="text-orange-400 shrink-0" />
                                01601674566
                            </a>
                            <div className="flex items-start gap-2">
                                <MapPin size={15} className="text-orange-400 shrink-0 mt-0.5" />
                                <span className="text-sm  leading-relaxed">
                                    Dhanmondi 3 Happy arcade Shopping mall ( near dhaka city college ) 2nd floor Mirpur road dhaka 1205
                                </span>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-2 mt-1">
                            {socialLinks.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={s.label}
                                    className="
                    w-9 h-9 rounded-full border border-white
                    flex items-center justify-center
                     hover:text-white hover:border-orange-400
                    hover:bg-orange-400/10 transition-all duration-200
                  "
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 — Information */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white font-bold text-base">Information</h3>
                        <ul className="flex flex-col gap-2.5">
                            {informationLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm  hover:text-orange-400 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Customer Services */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white font-bold text-base">Customer Services</h3>
                        <ul className="flex flex-col gap-2.5">
                            {customerServiceLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm  hover:text-orange-400 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Newsletter */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white font-bold text-base">Newsletter</h3>
                        <p className="text-sm  leading-relaxed">
                            Sign up for our newsletter and get 10% off your first purchase
                        </p>
                        <div className="flex items-center">
                            <input
                                type="email"
                                placeholder="Enter your e-mail..."
                                className="
                  flex-1 bg-[#1a2535] border border-gray-600
                  text-sm text-gray-300 placeholder-gray-500
                  px-4 py-2 rounded-l-lg outline-none
                  focus:border-orange-400 transition-colors duration-200
                "
                            />
                            <button className="
                bg-orange-500 hover:bg-orange-600
                text-white px-4 py-2.75 rounded-r-lg
                transition-colors duration-200
                flex items-center justify-center shrink-0
              ">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700/50">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <p className="text-center text-sm text-white">
                        © 2026 Maven Zone. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
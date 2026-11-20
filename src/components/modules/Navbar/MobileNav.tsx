import type { MobileNavProps } from "@/types/navbar.type";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export function MobileNav({
  navLinks,
  mobileMenuOpen,
  setMobileMenuOpen,
  mobileMenuRef,
  checkIsActive,
}: MobileNavProps) {
  return (
    <div ref={mobileMenuRef} className="relative lg:hidden">
      <button
        type="button"
        aria-label="Toggle mobile menu"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#00416A]/10 text-[#00416A] transition-all duration-300 hover:bg-[#00416A]/15 sm:h-10 sm:w-10"
      >
        {mobileMenuOpen ? (
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </button>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-200/80 bg-white/95 p-2 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-0.5">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#00416A] text-white"
                      : "text-slate-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
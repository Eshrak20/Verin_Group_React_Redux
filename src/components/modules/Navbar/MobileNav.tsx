import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import type { MobileNavProps } from "@/types/navbar.type";


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
        aria-label="Toggle mobile menu"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="
          relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center
          rounded-full bg-[#00416A]/10 text-[#00416A]
          transition-all duration-300 hover:bg-[#00416A]/15
          shrink-0
        "
      >
        {mobileMenuOpen ? (
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-52 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="flex flex-col space-y-0.5">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors
                    ${
                      isActive
                        ? "bg-[#00416A] text-white"
                        : "text-slate-700 hover:bg-gray-100"
                    }
                  `}
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
import type { MobileNavProps } from "@/types/navbar.type";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

interface ExtendedMobileNavProps extends MobileNavProps {
  isAuthenticated?: boolean;
}

export function MobileNav({
  navLinks,
  mobileMenuOpen,
  setMobileMenuOpen,
  mobileMenuRef,
  checkIsActive,
  isAuthenticated = false,
}: ExtendedMobileNavProps) {
  return (
    <div ref={mobileMenuRef} className="relative z-40 lg:hidden">
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
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-gray-200/80 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-0.5">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${isActive
                      ? "bg-[#00416A] text-white"
                      : "text-slate-700 hover:bg-gray-100"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Logged-out users: Login & Register buttons below navLinks */}
          {!isAuthenticated && (
            <div className="mt-2 flex flex-col gap-1.5 border-t border-gray-100 pt-2 px-1 pb-0.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-primary/90"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
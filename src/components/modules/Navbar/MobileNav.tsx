import type { MobileNavProps } from "@/types/navbar.type";
import { LogOut, Menu, Package, Settings, X } from "lucide-react";
import { Link } from "react-router-dom";

interface ExtendedMobileNavProps extends MobileNavProps {
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string | null;
  onLogout?: () => void;
}

export function MobileNav({
  navLinks,
  mobileMenuOpen,
  setMobileMenuOpen,
  mobileMenuRef,
  checkIsActive,
  isAuthenticated = false,
  userName = "User",
  userEmail,
  onLogout,
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
        <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-gray-200/80 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Always show Module Nav Links */}
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

          {/* Auth Section */}
          <div className="mt-2 border-t border-gray-100 pt-2">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-left">
                  <p className="text-[11px] font-medium text-gray-400">Signed in as</p>
                  <p className="truncate text-xs font-bold text-gray-900">{userName}</p>
                  {userEmail && (
                    <p className="truncate text-[11px] text-gray-500">{userEmail}</p>
                  )}
                </div>

                <Link
                  to="/my-profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-gray-100"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-500" />
                  My Profile
                </Link>

                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-gray-100"
                >
                  <Package className="h-3.5 w-3.5 text-slate-500" />
                  My Orders
                </Link>

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-3.5 w-3.5 text-red-500" />
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 px-1 py-1">
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
        </div>
      )}
    </div>
  );
}
import type { NavLogoProps } from "@/types/navbar.type";
import { Link } from "react-router-dom";

export function NavLogo({ logoPath, logoUrl, companyName }: NavLogoProps) {
  return (
    <div className="relative z-10 min-w-0 shrink-0 w-auto lg:w-[208.02px]">
      <Link to={logoPath} className="flex items-center gap-1.5 sm:gap-3">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            className="h-6 sm:h-7 w-auto object-contain shrink-0"
          />
        ) : null}
        <span className="text-base sm:text-xl font-bold home-black-text truncate sm:whitespace-nowrap">
          {companyName}
        </span>
      </Link>
    </div>
  );
}
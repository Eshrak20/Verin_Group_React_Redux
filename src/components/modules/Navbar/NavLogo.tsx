import type { NavLogoProps } from "@/types/navbar.type";
import { Link } from "react-router-dom";


export function NavLogo({ logoPath, logoUrl, companyName }: NavLogoProps) {
  return (
    <div className="relative min-w-0 shrink-0 z-10 max-w-[50%] sm:max-w-none">
      <Link to={logoPath} className="flex items-center gap-1.5 sm:gap-3">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            className="h-6 sm:h-7 w-auto object-contain"
          />
        ) : null}
        <span className="text-base sm:text-xl font-bold home-black-text truncate sm:whitespace-nowrap">
          {companyName}
        </span>
      </Link>
    </div>
  );
}
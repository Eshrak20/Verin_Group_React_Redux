import type { DesktopNavProps } from "@/types/navbar.type";
import { Link } from "react-router-dom";


export function DesktopNav({
  navLinks,
  searchOpen,
  pillStyle,
  navRef,
  linkRefs,
  checkIsActive,
}: DesktopNavProps) {
  return (
    <div className="absolute inset-x-0 flex justify-center pointer-events-none transition-all duration-300">
      <div
        ref={navRef}
        className={`
          relative hidden items-center gap-1 rounded-full p-1 lg:flex pointer-events-auto
          transition-all duration-300
          ${searchOpen ? "-translate-x-12 xl:-translate-x-16" : "translate-x-0"}
        `}
      >
        <span
          className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-[#262626] home-black-text transition-all duration-300 dark:bg-white"
          style={{
            width: pillStyle.width,
            transform: `translateX(${pillStyle.translateX}px)`,
          }}
        />
        {navLinks.map((link, index) => {
          const isActive = checkIsActive(link);
          return (
            <Link
              key={link.path}
              to={link.path}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              className={`
                relative z-10 block rounded-full px-3.5 py-2
                text-xs font-bold uppercase tracking-wide
                transition-colors duration-300 xl:px-4 xl:text-[13px]
                ${
                  isActive
                    ? "text-white dark:text-[#00416A]"
                    : "home-black-text hover:bg-gray-200/60"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
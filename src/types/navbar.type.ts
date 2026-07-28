export interface NavLink {
  label: string;
  path: string;
}

export interface PillStyle {
  width: number;
  translateX: number;
}

export interface NavLogoProps {
  logoPath: string;
  logoUrl: string | null;
  companyName: string;
}

export interface DesktopNavProps {
  navLinks: NavLink[];
  searchOpen: boolean;
  pillStyle: PillStyle;
  navRef: React.RefObject<HTMLDivElement | null>;
  linkRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>;
  checkIsActive: (link: NavLink) => boolean;
}

export interface MobileNavProps {
  navLinks: NavLink[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuRef: React.RefObject<HTMLDivElement | null>;
  checkIsActive: (link: NavLink) => boolean;
}
interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  sort_order: string;
  is_active: string;
}


interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
}

export interface FooterSetting {
  id: number;
  company_key: string;  
  logo: string | null;
  image_url: string | null;
  company_name: string;
  description: string;
  copyright_text: string;
  show_social_links: string;
  is_active: string;
  social_links: SocialLink[];
  links: FooterLink[];
  contact_info: ContactInfo;
}

export interface FooterResponse {
  success: boolean;
  data: FooterSetting[];
}



export interface FooterLinkItem {
  id: number;
  title: string;
  url: string;
  sort_order: number | string;
}


export interface FooterSettingItem {
  id: number;
  company_key: string;
  company_name: string;
  logo?: string;
  image_url?: string;
  description?: string;
  copyright_text?: string;
  contact_info?: ContactInfo;
  social_links?: SocialLink[];
  links?: FooterLinkItem[];
}

export interface CustomerServiceLink {
  label: string;
  path: string;
  pageType: string;
}


export interface FooterLink {
  id: string | number;
  url: string;
  title: string;
  open_new_tab: string;
  sort_order?: string | number;
}

export interface CustomerServiceLink {
  label: string;
  path: string;
  pageType: string;
}

export interface FooterPage {
  page_type: string;
  title: string;
}

export interface FooterPagesResponse {
  data?: FooterPage[];
}

// Sub-component Props Types
export interface FooterBrandProps {
  logoUrl: string | null;
  companyName: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: SocialLink[];
}

export interface FooterInformationProps {
  links: FooterLink[];
}

export interface FooterCustomerServicesProps {
  customerServiceLinks: CustomerServiceLink[];
  footerPagesData?: FooterPagesResponse;
  companyKey: string;
}
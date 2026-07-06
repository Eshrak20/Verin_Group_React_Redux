interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  sort_order: string;
  is_active: string;
}

interface FooterLink {
  id: number;
  title: string;
  url: string;
  open_new_tab: string;
  sort_order: string;
}

interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
}

interface FooterSetting {
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
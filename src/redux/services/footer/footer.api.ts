import { baseApi } from "@/redux/baseApi";
import type { FooterResponse } from "@/types/footer.type";

// ==========================================
// Types Definition
// ==========================================

export interface FooterPage {
  id: number;
  footer_setting_id: number;
  page_type: "orders-faqs" | "privacy-policy" | "return-refund" | "shipping" | "terms-conditions" | string;
  title: string;
  short_description: string;
  content: string;
  is_published: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface FooterPagesResponse {
  success: boolean;
  company: string;
  data: FooterPage[];
}

// ==========================================
// Footer API Endpoints
// ==========================================

export const footerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // General Footer Settings API
    getFooterSettings: builder.query<FooterResponse, void>({
      query: () => "/footer",
      providesTags: ["Footer"],
    }),

    // Dynamic Footer Pages API by Company Key (verin-group | verin-decor | verin-electronics)
    getFooterPagesByCompany: builder.query<FooterPagesResponse, string>({
      query: (companyKey) => `/footer/${companyKey}/pages`,
      providesTags: (_result, _error, companyKey) => [
        { type: "FooterPages", id: companyKey },
      ],
    }),
  }),
});

// ==========================================
// Export Hooks
// ==========================================

export const { 
  useGetFooterSettingsQuery, 
  useGetFooterPagesByCompanyQuery 
} = footerApi;
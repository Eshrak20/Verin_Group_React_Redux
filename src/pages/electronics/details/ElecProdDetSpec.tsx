import {
  //  Share2, ShieldCheck,
  Truck
} from "lucide-react";

interface ElecProdDetSpecProps {
  descriptionHtml: string;
}

export default function ElecProdDetSpec({ descriptionHtml }: ElecProdDetSpecProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Specifications / Main RichText Content */}
      <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="mb-4 text-xl font-bold text-gray-900 border-b pb-3">
          Specification
        </h2>

        {/* Render RichText HTML Table Safely */}
        <div
          className="prose max-w-none text-sm text-gray-700 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-3 [&_th]:border [&_th]:border-gray-200 [&_th]:p-3 [&_tr:nth-child(even)]:bg-gray-50/50"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      </div>

      {/* Right Sidebar: Warranty & Delivery Info */}
      <div className="flex flex-col gap-4">
        {/* Warranty Section */}
        {/* <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-base mb-2">
            <ShieldCheck className="h-5 w-5 text-elec" />
            Warranty
          </div>
          <p className="text-sm font-semibold text-gray-800">
            10 Days Replacement & 2 Years Service Warranty
          </p>
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
            This product includes standard seller warranty covering service & support.
          </p>
        </div> */}

        {/* Delivery Info */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-base mb-2">
            <Truck className="h-5 w-5 text-elec" />
            Delivery
          </div>
          <p className="text-sm font-medium text-gray-700">Standard Delivery (48-72 H)</p>
        </div>

        {/* Social Share */}
        {/* <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-base mb-3">
            <Share2 className="h-5 w-5 text-elec" />
            Social Share
          </div>
          <div className="flex gap-2">
            {["Facebook", "Twitter", "WhatsApp", "LinkedIn"].map((platform) => (
              <button
                key={platform}
                type="button"
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-elec hover:text-white transition-colors cursor-pointer"
              >
                {platform}
              </button>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
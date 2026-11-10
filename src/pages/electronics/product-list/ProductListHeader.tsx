import { Check, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router";

import type { BrandItem } from "@/types/electronics/brand.type";
import type { ElecSubCategory } from "@/types/electronics/sub-category.type";

interface ProductListHeaderProps {
    subCategory: ElecSubCategory;
    brands: BrandItem[];
    selectedBrand: number | null;
    onBrandChange: (brandId: number | null) => void;
    isBrandLoading: boolean;
}

const ProductListHeader = ({
    subCategory,
    brands,
    selectedBrand,
    onBrandChange,
    isBrandLoading,
}: ProductListHeaderProps) => {
    return (
        <div className="space-y-5">
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <Link
                    to="/"
                    className="transition-colors hover:text-elec"
                >
                    Home
                </Link>

                <ChevronRight className="h-4 w-4" />

                <Link
                    to="/electronics"
                    className="transition-colors hover:text-elec"
                >
                    Electronics
                </Link>

                <ChevronRight className="h-4 w-4" />

                <span className="font-medium text-gray-800">
                    {subCategory.name}
                </span>
            </nav>

            {/* Heading */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {subCategory.name}
                </h1>

                <p className="text-sm text-gray-500">
                    Explore our collection of {subCategory.name.toLowerCase()} products.
                </p>
            </div>

            {/* Shop By Brand */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                        Shop by Brand
                    </h2>

                    {selectedBrand !== null && (
                        <button
                            type="button"
                            onClick={() => onBrandChange(null)}
                            className="text-sm font-medium text-elec transition-colors hover:underline"
                        >
                            Clear selection
                        </button>
                    )}
                </div>

                {isBrandLoading ? (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading brands...
                    </div>
                ) : brands.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {brands.map((brand) => {
                            const isSelected = selectedBrand === brand.id;

                            return (
                                <button
                                    key={brand.id}
                                    type="button"
                                    onClick={() =>
                                        onBrandChange(isSelected ? null : brand.id)
                                    }
                                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${isSelected
                                            ? "border-elec bg-elec text-white shadow-sm"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-elec hover:text-elec"
                                        }`}
                                >
                                    {brand.name}

                                    {isSelected && (
                                        <Check className="h-4 w-4" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <p className="py-4 text-sm text-gray-500">
                        No brands available for this subcategory.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductListHeader;
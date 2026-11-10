import { Button } from "@/components/ui/button";
import type { ProductFilter } from "@/types/electronics/product-list.type";
import {
    RotateCcw,
    SlidersHorizontal,
    X,
} from "lucide-react";
import { useState } from "react";
import PriceRangeSlider from "./PriceRangeSlider";

interface ProductListFilterProps {
    filters?: ProductFilter[];
    price?: {
        min: number;
        max: number;
    };
    isLoading?: boolean;
    priceRange: {
        min: number | null;
        max: number | null;
    };
    selectedAttributes: Record<string, string[]>;
    onPriceChange: (min: string, max: string) => void;
    onAttributeChange: (
        filterId: number,
        option: string,
        checked: boolean,
    ) => void;
    onClearFilters: () => void;
}

const ProductListFilter = ({
    filters = [],
    price,
    isLoading = false,
    priceRange,
    selectedAttributes,
    onPriceChange,
    onAttributeChange,
    onClearFilters,
}: ProductListFilterProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const hasActiveAttributes = Object.values(selectedAttributes).some(
        (options) => options.length > 0,
    );

    const hasActivePrice =
        priceRange.min !== null || priceRange.max !== null;

    const hasActiveFilters = hasActiveAttributes || hasActivePrice;

    const activeFilterCount =
        Object.values(selectedAttributes).reduce(
            (total, options) => total + options.length,
            0,
        ) + (hasActivePrice ? 1 : 0);

    const handleClearFilters = () => {
        onClearFilters();
    };

    const filterContent = (
        <div className="space-y-5">
            {/* Filter Header */}
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex min-w-0 items-center gap-2">
                    <SlidersHorizontal className="size-4 shrink-0 text-elec" />

                    <h2 className="text-sm font-semibold text-foreground">
                        Filters
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-elec transition-colors hover:bg-elec/10 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
                >
                    <RotateCcw className="size-3.5" />
                    Clear filters
                </button>
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
                <div
                    role="status"
                    aria-label="Loading filters"
                    className="animate-pulse space-y-5"
                >
                    <div className="space-y-3 border-b border-border/60 pb-5">
                        <div className="h-3 w-20 rounded bg-muted" />
                        <div className="h-2 w-full rounded-full bg-muted" />

                        <div className="flex justify-between">
                            <div className="h-6 w-16 rounded-md bg-muted" />
                            <div className="h-6 w-16 rounded-md bg-muted" />
                        </div>
                    </div>

                    {[0, 1, 2].map((group) => (
                        <div
                            key={group}
                            className="space-y-3 border-b border-border/60 pb-5"
                        >
                            <div className="h-3 w-20 rounded bg-muted" />

                            {[0, 1, 2].map((option) => (
                                <div
                                    key={option}
                                    className="flex items-center gap-2.5"
                                >
                                    <div className="size-4 rounded border border-border bg-muted" />

                                    <div
                                        className={`h-3 rounded bg-muted ${option === 1 ? "w-24" : "w-16"
                                            }`}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Price Range */}
                    {price && (
                        <div className="border-b border-border/60 pb-5">
                            <PriceRangeSlider
                                key={`${price.min}:${price.max}:${priceRange.min ?? ""}:${priceRange.max ?? ""}`}
                                min={price.min}
                                max={price.max}
                                currentMin={priceRange.min !== null ? String(priceRange.min) : undefined}
                                currentMax={priceRange.max !== null ? String(priceRange.max) : undefined}
                                onPriceChange={onPriceChange}
                            />
                        </div>
                    )}

                    {/* Dynamic Attribute Filters */}
                    {filters.map((filter) => {
                        const filterId = String(filter.id);

                        const selectedOptions =
                            selectedAttributes[filterId] ?? [];

                        return (
                            <div
                                key={filter.id}
                                className="space-y-2 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
                            >
                                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                                    {filter.name}
                                </h3>

                                <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                                    {filter.options.map((option) => {
                                        const checked =
                                            selectedOptions.includes(option);

                                        return (
                                            <label
                                                key={option}
                                                className="flex cursor-pointer items-center gap-2.5 text-xs text-foreground/80 hover:text-foreground"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={(event) =>
                                                        onAttributeChange(
                                                            filter.id,
                                                            option,
                                                            event.target.checked,
                                                        )
                                                    }
                                                    className="size-4 shrink-0 cursor-pointer rounded border-border accent-elec focus:ring-elec/20"
                                                />

                                                <span className="truncate">
                                                    {option}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {filters.length === 0 && !price && (
                        <p className="text-xs leading-5 text-muted-foreground">
                            No filters available for this category.
                        </p>
                    )}
                </>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="mb-4 lg:hidden">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMobileOpen(true)}
                    className="w-full justify-center gap-2"
                >
                    <SlidersHorizontal className="size-4" />
                    Filters

                    {activeFilterCount > 0 && (
                        <span className="rounded-full bg-elec px-2 py-0.5 text-xs text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </div>

            <aside
                aria-label="Product filters"
                className="hidden rounded-xl border border-border/70 bg-card p-4 lg:block"
            >
                {filterContent}
            </aside>

            {/* Mobile Filter Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setMobileOpen(false)}
                        className="absolute inset-0 bg-black/50"
                    />

                    <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-background p-5 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-foreground">
                                Product Filters
                            </h2>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close filters"
                            >
                                <X className="size-5" />
                            </Button>
                        </div>

                        {filterContent}

                        <Button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="mt-6 w-full bg-elec text-white hover:bg-elec/90"
                        >
                            Show Results
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductListFilter;
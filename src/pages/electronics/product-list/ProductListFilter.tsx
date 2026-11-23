import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import type { ProductFilter } from "@/types/electronics/product-list.type";
import {
    RotateCcw,
    SlidersHorizontal,
} from "lucide-react";
import { useRef, useState } from "react";
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

    // Direct DOM refs for 60fps smooth swipe without React re-renders
    const sheetRef = useRef<HTMLDivElement | null>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const currentDeltaXRef = useRef<number>(0);
    const isHorizontalSwipeRef = useRef<boolean | null>(null);

    const resetSheetStyle = () => {
        const el = sheetRef.current;
        if (!el) return;
        el.style.transform = "";
        el.style.transition = "";
        el.style.animation = "";
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        if (!touch) return;
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        currentDeltaXRef.current = 0;
        isHorizontalSwipeRef.current = null;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!touchStartRef.current || !sheetRef.current) return;
        const touch = e.touches[0];
        if (!touch) return;

        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (isHorizontalSwipeRef.current === null) {
            if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                isHorizontalSwipeRef.current =
                    Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0;
            }
        }

        if (isHorizontalSwipeRef.current && deltaX >= 0) {
            currentDeltaXRef.current = deltaX;
            const el = sheetRef.current;
            el.style.animation = "none";
            el.style.transition = "none";
            el.style.transform = `translate3d(${deltaX}px, 0, 0)`;
        }
    };

    const handleTouchEnd = () => {
        const el = sheetRef.current;
        const swipedDistance = currentDeltaXRef.current;
        const wasHorizontal = isHorizontalSwipeRef.current;

        touchStartRef.current = null;
        isHorizontalSwipeRef.current = null;
        currentDeltaXRef.current = 0;

        if (!el || !wasHorizontal) return;

        if (swipedDistance > 75) {
            // Smoothly finish sliding out to the right, then close without double animation
            el.style.transition = "transform 180ms cubic-bezier(0.32, 0.72, 0, 1)";
            el.style.transform = "translate3d(100%, 0, 0)";
            window.setTimeout(() => {
                setMobileOpen(false);
            }, 170);
        } else {
            // Snap back smoothly if swipe was too short
            el.style.transition = "transform 200ms cubic-bezier(0.32, 0.72, 0, 1)";
            el.style.transform = "translate3d(0, 0, 0)";
            window.setTimeout(() => {
                resetSheetStyle();
            }, 200);
        }
    };

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
                    onClick={onClearFilters}
                    disabled={!hasActiveFilters}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-elec transition-colors hover:bg-elec/10 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
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
                                        className={`h-3 rounded bg-muted ${
                                            option === 1 ? "w-24" : "w-16"
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
                        <div
                            onTouchStart={(e) => e.stopPropagation()}
                            className="border-b border-border/60 pb-5"
                        >
                            <PriceRangeSlider
                                key={`${price.min}:${price.max}:${priceRange.min ?? ""}:${priceRange.max ?? ""}`}
                                min={price.min}
                                max={price.max}
                                currentMin={
                                    priceRange.min !== null
                                        ? String(priceRange.min)
                                        : undefined
                                }
                                currentMax={
                                    priceRange.max !== null
                                        ? String(priceRange.max)
                                        : undefined
                                }
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
            {/* Mobile Filter Trigger & Sliding Sheet (Sidebar Drawer) */}
            <div className="lg:hidden">
                <Sheet
                    open={mobileOpen}
                    onOpenChange={(open) => {
                        if (open) resetSheetStyle();
                        setMobileOpen(open);
                    }}
                >
                    <SheetTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full cursor-pointer -mt-3 -mb-3 justify-center gap-2 rounded-xl border-border/80 bg-card shadow-2xs"
                        >
                            <SlidersHorizontal className="size-4 text-elec" />
                            <span>Filters</span>

                            {activeFilterCount > 0 && (
                                <span className="rounded-full bg-elec px-2 py-0.5 text-xs font-semibold text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        ref={sheetRef}
                        side="right"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="flex w-[85vw] max-w-sm flex-col p-0 touch-pan-y will-change-transform"
                    >
                        <SheetHeader className="border-b border-border/60 px-5 -ppy-4 text-left">
                            <SheetTitle className="text-base font-bold text-foreground">
                                Product Filters
                            </SheetTitle>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto px-5 pb-5">
                            {filterContent}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sticky Sidebar (Unchanged) */}
            <aside
                aria-label="Product filters"
                className="hidden rounded-xl border border-border/70 bg-card p-4 lg:block"
            >
                {filterContent}
            </aside>
        </>
    );
};

export default ProductListFilter;
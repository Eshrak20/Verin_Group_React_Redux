import CommonPagination from "@/components/common/CommonPagination";
import { ProductCard } from "@/components/common/ProductCard";
import { PageLoader } from "@/routes";
import type { Product } from "@/types/product.type";
import { PackageSearch } from "lucide-react";

interface ProductListGridProps {
    products: Product[];
    isLoading: boolean;
    isFetching?: boolean;
    isError: boolean;
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

const ProductListGrid = ({
    products,
    isLoading,
    isFetching = false,
    isError,
    currentPage,
    lastPage,
    onPageChange,
}: ProductListGridProps) => {
    // Loading
    if (isLoading) {
        return <PageLoader />;
    }

    // Error
    if (isError) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
                <PackageSearch className="size-9 text-destructive" />

                <h3 className="mt-3 text-base font-semibold text-foreground">
                    Unable to load products
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    Something went wrong while fetching products. Please try again.
                </p>
            </div>
        );
    }

    // Empty state
    if (products.length === 0) {
        return (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-elec/10">
                    <PackageSearch className="size-8 text-elec" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No Products Found
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    We couldn't find any products matching your selected filters.
                    Try changing your filters to see more products.
                </p>
            </div>
        );
    }

    return (
        <section
            aria-label="Product listing"
            aria-busy={isFetching}
            className="relative min-w-0"
        >
            {/* Fetching indicator */}
            {isFetching && !isLoading && (
                <div className="absolute right-2 top-2 z-10 size-5 animate-spin rounded-full border-2 border-elec border-t-transparent" />
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="mt-8 flex justify-center">
                    <CommonPagination
                        pagination={{
                            current_page: currentPage,
                            last_page: lastPage,
                        }}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </section>
    );
};

export default ProductListGrid;

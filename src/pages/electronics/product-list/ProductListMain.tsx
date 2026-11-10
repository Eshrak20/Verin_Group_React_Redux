import {
    useGetElecBrandQuery,
    useGetElecProductListQuery,
    useGetElecSubCategoryQuery,
} from "@/redux/services/electronics/electronics.api";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router";
import ProductListFilter from "./ProductListFilter";
import ProductListGrid from "./ProductListGrid";
import ProductListHeader from "./ProductListHeader";

const ProductListMain = () => {
    const { subCategorySlug } = useParams<{
        subCategorySlug: string;
    }>();

    const [searchParams, setSearchParams] = useSearchParams();

    // Pagination
    const requestedPage = Number(searchParams.get("page"));

    const page =
        Number.isInteger(requestedPage) && requestedPage > 0
            ? requestedPage
            : 1;

    // Brand filter
    const requestedBrand = Number(searchParams.get("brand_id"));

    const selectedBrand =
        Number.isInteger(requestedBrand) && requestedBrand > 0
            ? requestedBrand
            : null;

    // Subcategory
    const {
        data: subCategoryResponse,
        isLoading: isSubCategoryLoading,
    } = useGetElecSubCategoryQuery();

    const subCategory = useMemo(
        () =>
            subCategoryResponse?.data?.find(
                (item) => item.slug === subCategorySlug,
            ),
        [subCategoryResponse, subCategorySlug],
    );

    const subCategoryId = subCategory?.id;

    // Stable filter request
    const filterRequest = useMemo(
        () => ({
            category_id: 2,
            sub_category_id: subCategoryId,
            brand_id: null,
            is_featured: null,
            in_stock: null,
            price_min: null,
            price_max: null,
            attributes: {},
            page: 1,
            per_page: 20,
            sort_by: "created_at",
            sort_order: "desc" as const,
        }),
        [subCategoryId],
    );

    // Stable filter data
    const {
        currentData: filterResponse,
        isLoading: isFilterLoading,
    } = useGetElecProductListQuery(filterRequest, {
        skip: !subCategoryId,
    });

    const availablePrice = filterResponse?.data?.price;

    // Price filters
    const priceRange = useMemo(() => {
        const min = Number(searchParams.get("price_min"));
        const max = Number(searchParams.get("price_max"));

        return {
            min:
                searchParams.has("price_min") &&
                    Number.isFinite(min) &&
                    min >= 0
                    ? min
                    : null,
            max:
                searchParams.has("price_max") &&
                    Number.isFinite(max) &&
                    max >= 0
                    ? max
                    : null,
        };
    }, [searchParams]);

    // Dynamic attribute filters
    const selectedAttributes = useMemo(() => {
        const attributes: Record<string, string[]> = {};

        searchParams.forEach((value, key) => {
            if (key.startsWith("attr_")) {
                const filterId = key.replace("attr_", "");

                if (filterId) {
                    attributes[filterId] = value
                        .split(",")
                        .filter(Boolean);
                }
            }
        });

        return attributes;
    }, [searchParams]);

    // Brands
    const {
        data: brandResponse,
        isLoading: isBrandLoading,
    } = useGetElecBrandQuery();

    const brands = useMemo(
        () =>
            brandResponse?.data?.filter(
                (brand) =>
                    brand.sub_category_id === subCategoryId &&
                    brand.status === 1,
            ) ?? [],
        [brandResponse, subCategoryId],
    );

    // Product request
    const productRequest = useMemo(
        () => ({
            ...filterRequest,
            brand_id: selectedBrand,
            price_min:
                priceRange.min !== null
                    ? priceRange.min
                    : (availablePrice?.min ?? null),
            price_max:
                priceRange.max !== null
                    ? priceRange.max
                    : (availablePrice?.max ?? null),
            attributes: selectedAttributes,
            page,
        }),
        [
            filterRequest,
            selectedBrand,
            priceRange,
            availablePrice,
            selectedAttributes,
            page,
        ],
    );

    // Products
    const {
        data: productResponse,
        isLoading: isProductLoading,
        isFetching: isProductFetching,
        isError: isProductError,
    } = useGetElecProductListQuery(productRequest, {
        skip: !subCategoryId || !availablePrice,
    });

    // URL update helper
    const updateSearchParams = (
        callback: (params: URLSearchParams) => void,
    ) => {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams);

            callback(nextParams);

            return nextParams;
        });
    };

    // Brand selection
    const handleBrandChange = (brandId: number | null) => {
        updateSearchParams((params) => {
            params.set("page", "1");

            if (brandId !== null) {
                params.set("brand_id", String(brandId));
            } else {
                params.delete("brand_id");
            }
        });
    };

    // Price filter
    const handlePriceChange = (min: string, max: string) => {
        updateSearchParams((params) => {
            params.set("page", "1");

            const defaultMin = availablePrice?.min ?? 0;
            const defaultMax = availablePrice?.max ?? 1000000;

            const currentMin = min ? Number(min) : defaultMin;
            const currentMax = max ? Number(max) : defaultMax;

            if (min || max) {
                params.set("price_min", String(currentMin));
                params.set("price_max", String(currentMax));
            } else {
                params.delete("price_min");
                params.delete("price_max");
            }
        });
    };

    // Attribute filter
    const handleAttributeChange = (
        filterId: number,
        option: string,
        checked: boolean,
    ) => {
        updateSearchParams((params) => {
            params.set("page", "1");

            const key = `attr_${filterId}`;

            const currentOptions =
                params.get(key)?.split(",").filter(Boolean) ?? [];

            const updatedOptions = checked
                ? currentOptions.includes(option)
                    ? currentOptions
                    : [...currentOptions, option]
                : currentOptions.filter((item) => item !== option);

            if (updatedOptions.length > 0) {
                params.set(key, updatedOptions.join(","));
            } else {
                params.delete(key);
            }
        });
    };

    // Clear all filters
    const handleClearFilters = () => {
        updateSearchParams((params) => {
            const filterKeys = [...params.keys()].filter(
                (key) =>
                    key === "brand_id" ||
                    key === "price_min" ||
                    key === "price_max" ||
                    key.startsWith("attr_"),
            );

            filterKeys.forEach((key) => params.delete(key));

            params.set("page", "1");
        });
    };

    // Pagination
    const handlePageChange = (nextPage: number) => {
        updateSearchParams((params) => {
            params.set("page", String(nextPage));
        });
    };

    // Loading
    if (isSubCategoryLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-elec border-t-transparent" />
            </div>
        );
    }

    // Subcategory not found
    if (!subCategory) {
        return (
            <div className="flex min-h-100 flex-col items-center justify-center px-4 text-center">
                <h2 className="text-xl font-semibold text-elec">
                    Subcategory not found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    The requested product category could not be found.
                </p>
            </div>
        );
    }

    const products = productResponse?.data?.products ?? [];
    const filters = filterResponse?.data?.filters ?? [];
    const pagination = productResponse?.data?.meta;

    return (
        <section className="px-4 pb-6 pt-0 sm:px-6 lg:px-0">
            <ProductListHeader
                subCategory={subCategory}
                brands={brands}
                selectedBrand={selectedBrand}
                onBrandChange={handleBrandChange}
                isBrandLoading={isBrandLoading}
            />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:min-h-[calc(100vh+5rem)] lg:grid-cols-[260px_minmax(0,1fr)]">
                {/* Sticky Filter */}
                <aside className="hidden self-start lg:sticky lg:top-20 lg:block">
                    <div className="max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-xl">
                        <ProductListFilter
                            filters={filters}
                            price={availablePrice}
                            isLoading={isFilterLoading}
                            priceRange={priceRange}
                            selectedAttributes={selectedAttributes}
                            onPriceChange={handlePriceChange}
                            onAttributeChange={handleAttributeChange}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                </aside>

                {/* Sticky Product Grid */}
                <div className="min-w-0 self-start lg:sticky lg:top-20">
                    <ProductListGrid
                        products={products}
                        isLoading={isProductLoading}
                        isFetching={isProductFetching}
                        isError={isProductError}
                        currentPage={pagination?.current_page ?? page}
                        lastPage={pagination?.last_page ?? 1}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </section>
    );
};

export default ProductListMain;

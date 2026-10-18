import { useGetElecSubCategoryQuery } from "@/redux/services/electronics/electronics.api";
import type { ElecSubCategory } from "@/types/electronics/sub-category.type";
import { useState } from "react";
import { Outlet } from "react-router";
import ElecSubCatNavbar from "./ElecSubCatNavbar";

export default function ElectronicsPage() {
  const { data: subCategoryData, isLoading: subCategoryLoading, isError } =
    useGetElecSubCategoryQuery();

  const [, setSelectedSubCategory] =
    useState<ElecSubCategory | null>(null);

  const elecSubCategories: ElecSubCategory[] = (
    subCategoryData?.data ?? []
  ).filter(
    (subCategory: ElecSubCategory) =>
      subCategory.category?.name?.toLowerCase() === "electronics" &&
      subCategory.status === 1,
  );

  if (subCategoryLoading) {
    return <div className="px-4 py-8">Loading electronics...</div>;
  }

  if (isError) {
    return (
      <div className="px-4 py-8 text-destructive">
        Failed to load electronics categories. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full -mt-8">
      <ElecSubCatNavbar
        subCategories={elecSubCategories}
        onSubCategorySelect={setSelectedSubCategory}
      />

      <Outlet />
    </div>
  );
}
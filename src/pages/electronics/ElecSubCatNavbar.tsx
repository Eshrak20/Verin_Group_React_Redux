
import type { ElecSubCategory } from "@/types/electronics/sub-category.type";
import { useState } from "react";

interface ElecSubCatNavbarProps {
	subCategories: ElecSubCategory[];
	onSubCategorySelect?: (subCategory: ElecSubCategory | null) => void;
}

export default function ElecSubCatNavbar({
	subCategories,
	onSubCategorySelect,
}: ElecSubCatNavbarProps) {
	const [activeSubCategory, setActiveSubCategory] =
		useState<number | null>(null);

	const handleSelect = (subCategory: ElecSubCategory | null) => {
		setActiveSubCategory(subCategory?.id ?? null);
		onSubCategorySelect?.(subCategory);
	};

	return (
		<nav
			aria-label="Electronics subcategories"
			className="w-full text-white"
		>
			<div className="mx-auto max-w-7xl mt-3 px-3 sm:px-5 lg:px-0">
				<div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
					<button
						type="button"
						onClick={() => handleSelect(null)}
						aria-pressed={activeSubCategory === null}
						className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
							activeSubCategory === null
								? "bg-elec text-white"
								: "text-elec bg-elec/10 hover:bg-white/15"
						}`}
					>
						All Products
					</button>

					{subCategories.map((subCategory) => (
						<button
							key={subCategory.id}
							type="button"
							onClick={() => handleSelect(subCategory)}
							aria-pressed={activeSubCategory === subCategory.id}
							className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
								activeSubCategory === subCategory.id
									? "bg-elec text-white"
									: "bg-elec/10 text-elec hover:bg-white/15"
							}`}
						>
							{subCategory.name}
						</button>
					))}
				</div>
			</div>
		</nav>
	);
}

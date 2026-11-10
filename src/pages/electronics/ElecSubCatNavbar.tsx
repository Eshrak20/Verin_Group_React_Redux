import type { ElecSubCategory } from "@/types/electronics/sub-category.type";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

interface ElecSubCatNavbarProps {
	subCategories: ElecSubCategory[];
	onSubCategorySelect?: (subCategory: ElecSubCategory) => void;
}

export default function ElecSubCatNavbar({
	subCategories,
	onSubCategorySelect,
}: ElecSubCatNavbarProps) {
	const navigate = useNavigate();
	const { subCategorySlug } = useParams();

	const activeSubCategory = useMemo(
		() =>
			subCategories.find(
				(item) => item.slug === subCategorySlug,
			),
		[subCategories, subCategorySlug],
	);

	const handleSelect = (subCategory: ElecSubCategory) => {
		navigate(`/electronics/${subCategory.slug}`);
		onSubCategorySelect?.(subCategory);
	};

	return (
		<nav
			aria-label="Electronics subcategories"
			className="w-full text-white"
		>
			<div className="mx-auto mt-3 max-w-7xl px-3 sm:px-5 lg:px-0">
				<div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
					{subCategories.map((subCategory) => (
						<button
							key={subCategory.id}
							type="button"
							onClick={() => handleSelect(subCategory)}
							aria-pressed={
								activeSubCategory?.id === subCategory.id
							}
							className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${activeSubCategory?.id === subCategory.id
									? "bg-elec text-white"
									: "bg-elec/10 text-elec hover:bg-elec/20"
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
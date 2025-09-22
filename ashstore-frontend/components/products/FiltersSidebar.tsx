"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/helpers/formatPrice";
import { RootState } from "@/redux/store";
import { setFilters } from "@/redux/productSlice";

const CATEGORY_OPTIONS = [
	"Men",
	"Women",
	"Accessories",
	"Men's Accessories",
	"Women's Accessories",
	"Sale",
];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_OPTIONS = [
	{ id: "Black", label: "Black", className: "bg-black border" },
	{ id: "White", label: "White", className: "bg-white border" },
	{ id: "Green", label: "Green", className: "bg-green-600" },
	{ id: "Blue", label: "Blue", className: "bg-blue-500" },
	{ id: "Red", label: "Red", className: "bg-rose-600" },
];

type Props = {
	min?: number;
	max?: number;
	step?: number;
};

export default function FiltersSidebar({
	min = 0,
	max = 100000,
	step = 1,
}: Props) {
	const dispatch = useDispatch();
	const filters = useSelector((state: RootState) => state.product.filters);

	// Initialize local state from Redux filters
	const [selectedCategories, setSelectedCategories] = useState<string[]>(
		Array.isArray(filters.category)
			? filters.category
			: filters.category
			? [filters.category]
			: []
	);

	const [selectedSizes, setSelectedSizes] = useState<string[]>(
		filters.size ? [filters.size] : []
	);

	const [selectedColor, setSelectedColor] = useState<string | null>(
		filters.color || null
	);

	const [priceMin, setPriceMin] = useState<number>(
		filters.minPrice ? Number(filters.minPrice) : min
	);

	const [priceMax, setPriceMax] = useState<number>(
		filters.maxPrice ? Number(filters.maxPrice) : max
	);

	// Track if filters have changed from their initial values
	const [hasChanges, setHasChanges] = useState(false);

	// Check if filters have changed
	useEffect(() => {
		const initialCategories = Array.isArray(filters.category)
			? filters.category
			: filters.category
			? [filters.category]
			: [];

		const initialSizes = filters.size ? [filters.size] : [];
		const initialColor = filters.color || null;
		const initialMinPrice = filters.minPrice ? Number(filters.minPrice) : min;
		const initialMaxPrice = filters.maxPrice ? Number(filters.maxPrice) : max;

		const categoriesChanged =
			selectedCategories.length !== initialCategories.length ||
			selectedCategories.some((cat, i) => cat !== initialCategories[i]);

		const sizesChanged =
			selectedSizes.length !== initialSizes.length ||
			selectedSizes.some((size, i) => size !== initialSizes[i]);

		const colorChanged = selectedColor !== initialColor;
		const minPriceChanged = priceMin !== initialMinPrice;
		const maxPriceChanged = priceMax !== initialMaxPrice;

		setHasChanges(
			categoriesChanged ||
				sizesChanged ||
				colorChanged ||
				minPriceChanged ||
				maxPriceChanged
		);
	}, [
		selectedCategories,
		selectedSizes,
		selectedColor,
		priceMin,
		priceMax,
		filters,
		min,
	]);

	function toggleCategory(cat: string) {
		setSelectedCategories((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
		);
	}

	function toggleSize(sz: string) {
		setSelectedSizes((prev) =>
			prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
		);
	}

	function applyFilters() {
		const filterUpdates: any = {};

		// Handle Sale category specially
		if (selectedCategories.includes("Sale")) {
			filterUpdates.onSale = "true";
			// Remove Sale from categories for the category filter
			const otherCategories = selectedCategories.filter(
				(cat) => cat !== "Sale"
			);
			if (otherCategories.length > 0) {
				filterUpdates.category = otherCategories.join(",");
			} else {
				filterUpdates.category = undefined;
			}
		} else {
			// Regular category handling
			if (selectedCategories.length > 0) {
				filterUpdates.category = selectedCategories.join(",");
			} else {
				filterUpdates.category = undefined;
			}
			filterUpdates.onSale = undefined;
		}

		if (selectedCategories.includes("Accessories")) {
			filterUpdates.category = ["Men's Accessories", "Women's Accessories"];
		}

		if (selectedSizes.length > 0) {
			filterUpdates.size = selectedSizes.join(",");
		} else {
			filterUpdates.size = undefined;
		}

		if (selectedColor) {
			filterUpdates.color = selectedColor;
		} else {
			filterUpdates.color = undefined;
		}

		if (priceMin !== min) {
			filterUpdates.sortOrder = "asc";
			filterUpdates.minPrice = priceMin.toString();
		} else {
			filterUpdates.minPrice = undefined;
		}

		if (priceMax !== max) {
			filterUpdates.sortOrder = "desc";
			filterUpdates.maxPrice = priceMax.toString();
		} else {
			filterUpdates.maxPrice = undefined;
		}

		dispatch(setFilters(filterUpdates) as any);
		setHasChanges(false);
	}

	function clearFilters() {
		setSelectedCategories([]);
		setSelectedSizes([]);
		setSelectedColor(null);
		setPriceMin(min);
		setPriceMax(max);

		// Immediately clear filters in Redux
		dispatch(
			setFilters({
				category: undefined,
				size: undefined,
				color: undefined,
				minPrice: undefined,
				maxPrice: undefined,
				onSale: undefined,
			}) as any
		);

		setHasChanges(false);
	}

	// Helpers for rendering slider background
	const minPercent = ((priceMin - min) / (max - min)) * 100;
	const maxPercent = ((priceMax - min) / (max - min)) * 100;

	// Ensure thumbs don't cross
	function onMinChange(v: number) {
		const newVal = Math.min(v, priceMax - step);
		setPriceMin(newVal);
	}

	function onMaxChange(v: number) {
		const newVal = Math.max(v, priceMin + step);
		setPriceMax(newVal);
	}

	return (
		<aside className="w-full max-w-[300px] shrink-0 bg-background rounded-md border border-muted p-2">
			<div className="px-3 pt-3 pb-2">
				<h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
					Filters
				</h3>
			</div>

			{/* Category - checkbox list (multi-select) */}
			<div className="px-3 py-2">
				<Label
					htmlFor="categories"
					className="text-base font-medium text-foreground block pb-2"
				>
					Category
				</Label>

				<div
					id="categories"
					role="list"
					className="flex flex-col gap-2 h-36 md:h-full overflow-auto pr-2"
				>
					{CATEGORY_OPTIONS.map((cat) => {
						const checked = selectedCategories.includes(cat);
						return (
							<label
								key={cat}
								className="inline-flex items-center gap-3 select-none cursor-pointer"
							>
								<Checkbox
									checked={checked}
									onCheckedChange={() => toggleCategory(cat)}
									id={`cat-${cat}`}
								/>
								<span className="text-sm text-foreground">{cat}</span>
							</label>
						);
					})}
				</div>
			</div>

			<Separator className="my-2" />

			{/* Price Range - interactive twin-range */}
			<div className="px-3 py-3">
				<p className="text-base font-medium text-foreground pb-2">
					Price Range
				</p>

				<div className="px-1">
					<div className="relative h-10" aria-hidden>
						{/* Visual track */}
						<div
							className="absolute inset-0 top-4 h-1 rounded bg-[color:var(--muted-track,#e6e6e6)]"
							style={{ backgroundColor: "transparent" }}
						/>
						{/* active track (between thumbs) */}
						<div
							className="absolute top-4 h-1 rounded bg-foreground dark:bg-foreground"
							style={{
								left: `${minPercent}%`,
								right: `${100 - maxPercent}%`,
							}}
						/>

						{/* Min thumb */}
						<input
							aria-label="Minimum price"
							type="range"
							min={min}
							max={max}
							step={step}
							value={priceMin}
							onChange={(e) => onMinChange(Number(e.target.value))}
							className="absolute inset-x-0 top-0 -left-1 h-9 w-full appearance-none bg-transparent pointer-events-none "
							style={{ pointerEvents: "auto" }}
						/>

						{/* Max thumb */}
						<input
							aria-label="Maximum price"
							type="range"
							min={min}
							max={max}
							step={step}
							value={priceMax}
							onChange={(e) => onMaxChange(Number(e.target.value))}
							className="absolute inset-x-0 top-0 left-1 h-9 w-full appearance-none bg-transparent pointer-events-none "
							style={{ pointerEvents: "auto" }}
						/>

						{/* Thumbs (visual markers) */}
						<div
							className="absolute -top-1 flex flex-col items-center gap-1"
							style={{ left: `calc(${minPercent}% - 8px)` }}
						>
							<span className="text-xs text-foreground">
								{formatPrice(priceMin)}
							</span>
						</div>
						<div
							className="absolute -top-1 flex flex-col items-center gap-1"
							style={{ left: `calc(${maxPercent}% - 8px)` }}
						>
							<span className="text-xs text-foreground">
								{formatPrice(priceMax)}
							</span>
						</div>
					</div>

					<div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
						<span>{formatPrice(min)}</span>
						<span>{formatPrice(max)}</span>
					</div>
				</div>
			</div>

			<Separator />

			{/* Size - button group (multi-select) */}
			<div className="px-3 py-3">
				<Label className="text-base font-medium text-foreground block pb-2">
					Size
				</Label>

				<div className="flex flex-wrap gap-2">
					{SIZE_OPTIONS.map((sz) => {
						const active = selectedSizes.includes(sz);
						return (
							<Button
								key={sz}
								size="sm"
								variant={active ? "default" : "outline"}
								onClick={() => toggleSize(sz)}
								aria-pressed={active}
								className={`rounded-md px-3 py-2 text-sm ${
									active ? "bg-foreground text-background" : ""
								}`}
							>
								{sz}
							</Button>
						);
					})}
				</div>
			</div>

			<Separator />

			{/* Colors - swatch buttons */}
			<div className="px-3 py-3">
				<Label className="text-base font-medium text-foreground block pb-2">
					Color
				</Label>

				<div className="flex items-center gap-2">
					{COLOR_OPTIONS.map((c) => {
						const active = selectedColor === c.id;
						return (
							<button
								key={c.id}
								type="button"
								aria-pressed={active}
								aria-label={c.label}
								onClick={() => setSelectedColor(active ? null : c.id)}
								className={`h-6 w-6 rounded-full ring-offset-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
									active ? "ring-2 ring-foreground" : "ring-1 ring-transparent"
								} flex items-center justify-center`}
							>
								<span
									className={`${c.className} h-6 w-6 rounded-full block`}
									aria-hidden
								/>
							</button>
						);
					})}
				</div>
			</div>

			{/* <Separator className="mx-3 mb-4" /> */}

			{/* Actions - Only show if there are changes */}
			{hasChanges && (
				<div className="px-3 py-3">
					<div className="flex gap-3">
						<Button variant="ghost" onClick={clearFilters} className="flex-1">
							Clear
						</Button>
						<Button variant="default" onClick={applyFilters} className="flex-1">
							Apply
						</Button>
					</div>
				</div>
			)}
		</aside>
	);
}

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export type FilterState = {
	categories: string[];
	sizes: string[];
	color?: string | null;
	priceMin?: number;
	priceMax?: number;
};

const CATEGORY_OPTIONS = [
	"Men",
	"Women",
	"Accessories",
	"Men's Accessories",
	"Women's Accessories",
	"New Arrivals",
	"Sale",
];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_OPTIONS = [
	{ id: "black", label: "Black", className: "bg-[#141414]" },
	{ id: "white", label: "White", className: "bg-white border" },
	{ id: "green", label: "Green", className: "bg-emerald-600" },
	{ id: "blue", label: "Blue", className: "bg-sky-600" },
	{ id: "red", label: "Red", className: "bg-rose-600" },
];

type Props = {
	onChange?: (state: FilterState) => void;
	initial?: Partial<FilterState>;
	min?: number;
	max?: number;
	step?: number;
};

export default function FiltersSidebar({
	onChange,
	initial = {},
	min = 0,
	max = 500,
	step = 1,
}: Props) {
	const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
		initial.categories ?? []
	);
	const [selectedSizes, setSelectedSizes] = React.useState<string[]>(
		initial.sizes ?? []
	);
	const [selectedColor, setSelectedColor] = React.useState<string | null>(
		(initial.color as string) ?? null
	);

	// price
	const [priceMin, setPriceMin] = React.useState<number>(
		initial.priceMin ?? min
	);
	const [priceMax, setPriceMax] = React.useState<number>(
		initial.priceMax ?? max
	);

	// debounce onChange for performance (especially for slider)
	React.useEffect(() => {
		const t = setTimeout(() => {
			onChange?.({
				categories: selectedCategories,
				sizes: selectedSizes,
				color: selectedColor,
				priceMin,
				priceMax,
			});
		}, 120);
		return () => clearTimeout(t);
	}, [
		selectedCategories,
		selectedSizes,
		selectedColor,
		priceMin,
		priceMax,
		onChange,
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

	function clearFilters() {
		setSelectedCategories([]);
		setSelectedSizes([]);
		setSelectedColor(null);
		setPriceMin(min);
		setPriceMax(max);
	}

	// Helpers for rendering slider background
	const minPercent = ((priceMin - min) / (max - min)) * 100;
	const maxPercent = ((priceMax - min) / (max - min)) * 100;
	// const sliderTrackBackground = `linear-gradient(90deg, theme(colors.muted) 0%, theme(colors.muted) ${minPercent}%, var(--tw-ring-color, rgb(20 20 20 / 1)) ${minPercent}%, var(--tw-ring-color, rgb(20 20 20 / 1)) ${maxPercent}%, theme(colors.muted) ${maxPercent}%, theme(colors.muted) 100%)`;

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
		<aside className="w-full max-w-[300px]  shrink-0 bg-background rounded-md border border-muted p-2">
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

			<Separator className="mx-3 my-2" />

			{/* Price Range - interactive twin-range */}
			<div className="px-3 py-3">
				<p className="text-base font-medium text-foreground pb-2">
					Price Range
				</p>

				<div className="px-1">
					<div
						className="relative h-10"
						aria-hidden
						// Use a CSS variable fallback for the muted color; we style inline for cross-tailwind control
						style={{
							// compute a nicer-looking track using hard-coded colors that match semantic tokens
							background: undefined,
						}}
					>
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
							// style the thumb by pseudo classes in global css, or inline with filter -- we'll use simple visible thumb wrapper below
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
							className="absolute inset-x-0 top-0 left-1  h-9 w-full appearance-none bg-transparent pointer-events-none "
							style={{ pointerEvents: "auto" }}
						/>

						{/* Thumbs (visual markers) */}
						<div
							className="absolute -top-1 flex flex-col items-center gap-1"
							style={{ left: `calc(${minPercent}% - 8px)` }}
						>
							<span className="text-xs text-foreground">${priceMin}</span>
							{/* <span className="h-3 w-3 rounded-full bg-foreground" /> */}
						</div>
						<div
							className="absolute -top-1 flex flex-col items-center gap-1"
							style={{ left: `calc(${maxPercent}% - 8px)` }}
						>
							<span className="text-xs text-foreground">${priceMax}</span>
							{/* <span className="h-3 w-3 rounded-full bg-foreground" /> */}
						</div>
					</div>

					<div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
						<span>${min}</span>
						<span>${max}</span>
					</div>
				</div>
			</div>

			<Separator className="mx-3" />

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

			<Separator className="mx-3" />

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

			<Separator className="mx-3 mb-4" />

			{/* Actions */}
			{/* if change in inital state then show buttons */}
			{initial && (
				<div className="px-3 py-3">
					<div className="flex gap-3">
						<Button variant="ghost" onClick={clearFilters} className="flex-1">
							Clear
						</Button>
						<Button
							variant="default"
							onClick={() =>
								onChange?.({
									categories: selectedCategories,
									sizes: selectedSizes,
									color: selectedColor,
									priceMin,
									priceMax,
								})
							}
							className="flex-1"
						>
							Apply
						</Button>
					</div>
				</div>
			)}
		</aside>
	);
}

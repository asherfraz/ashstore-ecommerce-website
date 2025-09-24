// "use client";

// import * as React from "react";
// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import FiltersSidebar from "@/components/products/FiltersSidebar";
// import ProductGrid from "@/components/products/ProductGrid";
// import Pagination from "@/components/common/Pagination";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Search, SlidersHorizontal, X } from "lucide-react";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { setFilters } from "@/redux/productSlice";
// import { fetchProducts } from "@/redux/productThunks";

// export default function MarketplacePage() {
// 	const router = useRouter();
// 	const searchParams = useSearchParams();
// 	const dispatch = useDispatch();
// 	const productState = useSelector((state: RootState) => state.product);

// 	// Initialize filters from URL query parameters
// 	useEffect(() => {
// 		const params: any = {};

// 		// Get all query parameters
// 		if (searchParams) {
// 			for (const [key, value] of searchParams.entries()) {
// 				// Handle array parameters (like category)
// 				if (key === "category" && value.includes(",")) {
// 					params[key] = value.split(",");
// 				}
// 				// Handle boolean parameters
// 				else if (
// 					key === "onSale" ||
// 					key === "onFeatured" ||
// 					key === "isActive"
// 				) {
// 					params[key] = value === "true";
// 				}
// 				// Handle number parameters
// 				else if (
// 					["page", "minPrice", "maxPrice", "minRating", "maxRating"].includes(
// 						key
// 					)
// 				) {
// 					params[key] = Number(value);
// 				}
// 				// Handle string parameters
// 				else {
// 					params[key] = value;
// 				}
// 			}

// 			// Set initial filters from URL
// 			if (Object.keys(params).length > 0) {
// 				dispatch(setFilters(params) as any);

// 				// Fetch products with URL parameters
// 				dispatch(fetchProducts({ ...params, limit: params.limit || 6 }) as any);

// 				// Set sortBy from URL if available
// 				if (params.sortBy) {
// 					if (params.sortBy === "price") setSortBy("price");
// 					else if (params.sortBy === "averageRating") setSortBy("popularity");
// 					else if (params.sortBy === "createdAt") setSortBy("newest");
// 				}
// 			} else {
// 				// Default fetch if no URL parameters
// 				dispatch(fetchProducts({ page: 1, limit: 6 }) as any);
// 			}
// 		}
// 	}, [searchParams, dispatch]);

// 	// Update URL when filters change
// 	useEffect(() => {
// 		const params = new URLSearchParams();

// 		// Add all filters to URL parameters
// 		Object.entries(productState.filters).forEach(([key, value]) => {
// 			if (value !== undefined && value !== "" && value !== null) {
// 				if (Array.isArray(value)) {
// 					params.set(key, value.join(","));
// 				} else {
// 					params.set(key, value.toString());
// 				}
// 			}
// 		});

// 		// Add pagination to URL
// 		params.set("page", productState.page.toString());
// 		// hide products limit for now
// 		// params.set("limit", productState.limit.toString());

// 		// Update URL without page refresh
// 		router.push(`?${params.toString()}`, { scroll: false });
// 	}, [productState.filters, productState.page, productState.limit, router]);

// 	const [searchTerm, setSearchTerm] = React.useState("");
// 	const [sortBy, setSortBy] = React.useState("newest");

// 	// Handle search filtering
// 	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const value = e.target.value;
// 		setSearchTerm(value);

// 		// Update filters with search term
// 		dispatch(setFilters({ search: value }) as any);
// 	};

// 	// Handle page change
// 	const handlePageChange = (page: number) => {
// 		// Update filters with the new page first
// 		dispatch(setFilters({ page }) as any);
// 		// Then fetch products with the updated filters
// 		dispatch(fetchProducts({ ...productState.filters, page, limit: 6 }) as any);
// 	};

// 	// Handle sorting
// 	const handleSortChange = (value: string) => {
// 		setSortBy(value);

// 		let sortParams = {};
// 		switch (value) {
// 			case "price":
// 				sortParams = { sortBy: "price", sortOrder: "asc" };
// 				break;
// 			case "popularity":
// 				sortParams = { sortBy: "averageRating", sortOrder: "desc" };
// 				break;
// 			case "newest":
// 				sortParams = { sortBy: "createdAt", sortOrder: "desc" };
// 				break;
// 			default:
// 				sortParams = { sortBy: "createdAt", sortOrder: "desc" };
// 		}

// 		dispatch(setFilters(sortParams) as any);
// 		dispatch(
// 			fetchProducts({
// 				...productState.filters,
// 				...sortParams,
// 				page: 1,
// 				limit: 6,
// 			}) as any
// 		);
// 	};

// 	return (
// 		<div className="flex justify-center px-6 py-5">
// 			<div className="flex w-full max-w-[1280px] gap-6">
// 				{/* Left: Filters (desktop) */}
// 				<div className="hidden md:block">
// 					<FiltersSidebar />
// 				</div>

// 				{/* Right: Main content */}
// 				<main className="flex flex-1 flex-col">
// 					{/* Mobile: Filters button (opens dialog) */}
// 					<div className="md:hidden px-4 pb-3">
// 						<Dialog>
// 							<DialogTrigger asChild>
// 								<Button
// 									variant="outline"
// 									className="w-full flex items-center gap-2"
// 								>
// 									<SlidersHorizontal className="h-4 w-4" /> Filters
// 								</Button>
// 							</DialogTrigger>

// 							<DialogContent className="sm:max-w-md w-full">
// 								<div className="overflow-auto">
// 									<FiltersSidebar />
// 								</div>
// 							</DialogContent>
// 						</Dialog>
// 					</div>

// 					{/* Search */}
// 					<div className="px-4 py-3">
// 						<Label htmlFor="search" className="sr-only">
// 							Search products
// 						</Label>
// 						<div className="flex w-full items-center gap-2 rounded-lg bg-muted px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
// 							<Search
// 								className="h-4 w-4 text-muted-foreground"
// 								aria-hidden="true"
// 							/>

// 							<Input
// 								id="search"
// 								value={searchTerm}
// 								onChange={handleSearch}
// 								placeholder="Search for products"
// 								aria-label="Search products"
// 								className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
// 							/>

// 							{searchTerm && (
// 								<Button
// 									type="button"
// 									variant="ghost"
// 									size="icon"
// 									onClick={() => {
// 										setSearchTerm("");
// 										dispatch(setFilters({ search: "" }) as any);
// 									}}
// 									aria-label="Clear search"
// 									className="h-6 w-6 rounded-full hover:bg-muted-foreground/10"
// 								>
// 									<X className="h-4 w-4 text-muted-foreground" />
// 								</Button>
// 							)}
// 						</div>
// 					</div>

// 					{/* Sorting */}
// 					<div className="border-b border-muted px-4 pb-2">
// 						<Tabs
// 							value={sortBy}
// 							onValueChange={handleSortChange}
// 							className="w-full"
// 						>
// 							<TabsList className="flex w-full justify-start gap-4 overflow-x-auto rounded-none border-b border-muted bg-transparent p-0">
// 								<TabsTrigger
// 									value="price"
// 									className="rounded-md border-b-4 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground  data-[state=active]:dark:bg-primary data-[state=active]:border-foreground data-[state=active]:text-foreground"
// 								>
// 									Price
// 								</TabsTrigger>
// 								<TabsTrigger
// 									value="newest"
// 									className="rounded-md border-b-4 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground  data-[state=active]:dark:bg-primary data-[state=active]:border-foreground data-[state=active]:text-foreground"
// 								>
// 									Newest
// 								</TabsTrigger>
// 								<TabsTrigger
// 									value="popularity"
// 									className="rounded-md border-b-4 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground  data-[state=active]:dark:bg-primary data-[state=active]:border-foreground data-[state=active]:text-foreground"
// 								>
// 									Popularity
// 								</TabsTrigger>
// 							</TabsList>
// 						</Tabs>
// 					</div>

// 					{/* Product grid */}
// 					<ProductGrid products={productState.products} />

// 					{/* Pagination */}
// 					<div className="flex items-center justify-center p-4 gap-2">
// 						<Pagination
// 							totalPages={productState.totalPages}
// 							currentPage={productState.page}
// 							onPageChange={handlePageChange}
// 							siblingCount={1}
// 							boundaryCount={1}
// 						/>
// 					</div>
// 				</main>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FiltersSidebar from "@/components/products/FiltersSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/common/Pagination";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setFilters } from "@/redux/productSlice";
import { fetchProducts } from "@/redux/productThunks";

export default function MarketplacePage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const dispatch = useDispatch();
	const productState = useSelector((state: RootState) => state.product);

	// Get marketplace pagination data
	const marketplacePagination = productState.marketplacePagination;

	// Initialize filters from URL query parameters
	useEffect(() => {
		const params: any = {};

		// Get all query parameters
		if (searchParams) {
			for (const [key, value] of searchParams.entries()) {
				// Handle array parameters (like category)
				if (key === "category" && value.includes(",")) {
					params[key] = value.split(",");
				}
				// Handle boolean parameters
				else if (
					key === "onSale" ||
					key === "onFeatured" ||
					key === "isActive"
				) {
					params[key] = value === "true";
				}
				// Handle number parameters
				else if (
					["page", "minPrice", "maxPrice", "minRating", "maxRating"].includes(
						key
					)
				) {
					params[key] = Number(value);
				}
				// Handle string parameters
				else {
					params[key] = value;
				}
			}

			// Set initial filters from URL
			if (Object.keys(params).length > 0) {
				dispatch(setFilters(params) as any);

				// Fetch products with URL parameters
				dispatch(fetchProducts({ ...params, limit: params.limit || 6 }) as any);

				// Set sortBy from URL if available
				if (params.sortBy) {
					if (params.sortBy === "price") setSortBy("price");
					else if (params.sortBy === "averageRating") setSortBy("popularity");
					else if (params.sortBy === "createdAt") setSortBy("newest");
				}
			} else {
				// Default fetch if no URL parameters
				dispatch(fetchProducts({ page: 1, limit: 6 }) as any);
			}
		}
	}, [searchParams, dispatch]);

	// Update URL when filters change
	useEffect(() => {
		const params = new URLSearchParams();

		// Add all filters to URL parameters
		Object.entries(productState.filters).forEach(([key, value]) => {
			if (value !== undefined && value !== "" && value !== null) {
				if (Array.isArray(value)) {
					params.set(key, value.join(","));
				} else {
					params.set(key, value.toString());
				}
			}
		});

		// Add pagination to URL using marketplace pagination data
		params.set("page", marketplacePagination.page.toString());
		// hide products limit for now
		// params.set("limit", marketplacePagination.limit.toString());

		// Update URL without page refresh
		router.push(`?${params.toString()}`, { scroll: false });
	}, [
		productState.filters,
		marketplacePagination.page,
		marketplacePagination.limit,
		router,
	]);

	const [searchTerm, setSearchTerm] = React.useState("");
	const [sortBy, setSortBy] = React.useState("newest");

	// Handle search filtering
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);

		// Update filters with search term
		dispatch(setFilters({ search: value }) as any);
	};

	// Handle page change
	const handlePageChange = (page: number) => {
		// Update filters with the new page first
		dispatch(setFilters({ page }) as any);
		// Then fetch products with the updated filters
		dispatch(
			fetchProducts({
				...productState.filters,
				page,
				limit: 6,
			}) as any
		);
	};

	// Handle sorting
	const handleSortChange = (value: string) => {
		setSortBy(value);

		let sortParams = {};
		switch (value) {
			case "price":
				sortParams = { sortBy: "price", sortOrder: "asc" };
				break;
			case "popularity":
				sortParams = { sortBy: "averageRating", sortOrder: "desc" };
				break;
			case "newest":
				sortParams = { sortBy: "createdAt", sortOrder: "desc" };
				break;
			default:
				sortParams = { sortBy: "createdAt", sortOrder: "desc" };
		}

		dispatch(setFilters(sortParams) as any);
		dispatch(
			fetchProducts({
				...productState.filters,
				...sortParams,
				page: 1,
				limit: 6,
			}) as any
		);
	};

	return (
		<div className="flex justify-center px-6 py-5">
			<div className="flex w-full max-w-[1280px] gap-6">
				{/* Left: Filters (desktop) */}
				<div className="hidden md:block">
					<FiltersSidebar />
				</div>

				{/* Right: Main content */}
				<main className="flex flex-1 flex-col">
					{/* Mobile: Filters button (opens dialog) */}
					<div className="md:hidden px-4 pb-3">
						<Dialog>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									className="w-full flex items-center gap-2"
								>
									<SlidersHorizontal className="h-4 w-4" /> Filters
								</Button>
							</DialogTrigger>

							<DialogContent className="sm:max-w-md w-full">
								<div className="overflow-auto">
									<FiltersSidebar />
								</div>
							</DialogContent>
						</Dialog>
					</div>

					{/* Search */}
					<div className="px-4 py-3">
						<Label htmlFor="search" className="sr-only">
							Search products
						</Label>
						<div className="flex w-full items-center gap-2 rounded-lg bg-muted px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
							<Search
								className="h-4 w-4 text-muted-foreground"
								aria-hidden="true"
							/>

							<Input
								id="search"
								value={searchTerm}
								onChange={handleSearch}
								placeholder="Search for products"
								aria-label="Search products"
								className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
							/>

							{searchTerm && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => {
										setSearchTerm("");
										dispatch(setFilters({ search: "" }) as any);
									}}
									aria-label="Clear search"
									className="h-6 w-6 rounded-full hover:bg-muted-foreground/10"
								>
									<X className="h-4 w-4 text-muted-foreground" />
								</Button>
							)}
						</div>
					</div>

					{/* Sorting */}
					<div className="border-b border-muted px-4 pb-2">
						<Tabs
							value={sortBy}
							onValueChange={handleSortChange}
							className="w-full"
						>
							<TabsList className="flex w-full justify-start gap-4 overflow-x-auto rounded-none border-b border-muted bg-transparent p-0">
								<TabsTrigger
									value="price"
									className="rounded-md border-b-4 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground  data-[state=active]:dark:bg-primary data-[state=active]:border-foreground data-[state=active]:text-foreground"
								>
									Price
								</TabsTrigger>
								<TabsTrigger
									value="newest"
									className="rounded-md border-b-4 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground  data-[state=active]:dark:bg-primary data-[state=active]:border-foreground data-[state=active]:text-foreground"
								>
									Newest
								</TabsTrigger>
								<TabsTrigger
									value="popularity"
									className="rounded-md border-b-4 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground  data-[state=active]:dark:bg-primary data-[state=active]:border-foreground data-[state=active]:text-foreground"
								>
									Popularity
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					{/* Product grid */}
					<ProductGrid products={productState.products} />

					{/* Pagination */}
					<div className="flex items-center justify-center p-4 gap-2">
						<Pagination
							totalPages={marketplacePagination.totalPages}
							currentPage={marketplacePagination.page}
							onPageChange={handlePageChange}
							siblingCount={1}
							boundaryCount={1}
						/>
					</div>
				</main>
			</div>
		</div>
	);
}

"use client";

import * as React from "react";
import { useState } from "react";
import FiltersSidebar from "@/components/products/FiltersSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/common/Pagination";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const demoProducts = [
	{
		id: "1",
		title: "Classic Blue Denim Jacket",
		price: "$79.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuD-Nfxezyvb2l1TW8T0U4tPpiXg4ntHnmrnxcCYZglwdxr3bXsSc7jwOR9lsS3wLAITO8izoAv-WPl7WTBrmULOmS9v-szQY-RNajWA1pTv2fD1kd-btydN_oR7JhQwgzXU4syXc7SzJC2SezkKLQwVAt6B7iXkkg7htb0h3pOGExAVQaK3R3rK6cD4IaOCsdVavTwkixaMClUHkQ3koYYhoNsi0A32w-pId2lVhMvDzDAfLQM7yDDz_vslgXr0v-LxR3Tc5hHz770",
		category: "Jackets",
	},
	{
		id: "2",
		title: "Summer Breeze Linen Shirt",
		price: "$49.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCHFhC2w9vyNTwxxkoDBI7z59SCIyz4zpMchSp-LMPDptruk1Lgf5ZvwBG-9wBQpBGHv1NIa9gDK5E2Bx9S7wmejXc_UY-iiZK_9DIx_XES0YTAUsVTKdg072l2pUTg9ZBiLBaEqpDuO-1IgkLfQ1AbmPLjul1Yfmz4eVosSIeGuE8MbbD9Iigi5_0_8LKxW74CdEDd8HIVR5q_Ih0DNzyRrQapq1soFd63XLQu31HDNjKDu1OGVMXlf_5lNuygE3Wzh0efJIxpbUA",
		category: "Shirts",
	},
	{
		id: "3",
		title: "Urban Edge Cargo Pants",
		price: "$69.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBXDy-zqb4PK3argMcQf9lkxkcdy0hIwkrDpniLBTcLJWWhzSBpxWhDT0cUKun9qLRqR4ZHokVtXFXud5X6Snfehv3tWM1gLaPEVANpQ8JQqNV44SzFCc16-V0OR_vs2DbsqO86qscTObMhM0-AY1UQDQmw1Xd2gnuWLuhEGIOqb_gwHTatWl08KQzFr6SH7DnsWrwFpaoXjB5G8ERlbwfsbxXeBMmZuvbnJhSsnjha8TvFkvkOMHFMRbQu3Hd4KjMelqkVYa7Cadk",
		category: "Pants",
	},
	{
		id: "4",
		title: "Sunset Hues Tie-Dye Tee",
		price: "$39.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCvhCwGpTux2TGOdfc4KqAtQWkn2brSJa6c8tZbSTvSKNKENizJpJrbJStEftOY2JmkDLhg0NEgXsUyYGLh1Yyc4hCBFUiwWIGBDNlUB1DY_x-o2yFEBKxKjLWtPrssuOPhG3C_2OliGeGC2U76sxh96aGqZ9SSPOSIJi0Kh0UbtlKstS3omaq5QABNNKwk6FBJqSprKsLrbHOSCcFVVJvJvqGEaH35wdpbhBN3MAUnk_Vttzr3_rCxkIBCeX_5PIJZFaXpj6NNTwo",
		category: "T-Shirts",
	},
	{
		id: "5",
		title: "Midnight Black Skinny Jeans",
		price: "$59.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCQNFXcLjpwADkuhIxgC84YtOGfYdziaHH2EXKax0yf6vRls7z1SSgTM9uAaP6XNz4JT1UV_HHXEjc_GW5O9EQt7NHLekTWM-iJf3QW6ZST-Hneo1riuiX4lHSKYj8H2SR5CLr5p471kAuje_h4pav3H0JsVdE0VjuneMTKOV4M44Oax-iX3vCD58k8gCTn-zPqjrPoKzHeJqv7q-uvPaoaDrqY0aSaIqhYenUpoIhLYdIeRi8-RxehSxTBRkYWuotkKLsuUe0Bdq0",
		category: "Jeans",
	},
	{
		id: "6",
		title: "Forest Green Corduroy Overalls",
		price: "$89.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBjKb8b5-Q3KzpbvYOV8bwejcho6dv3UyZYm4rlz5NYS5BVaikNVGjgUiYWabCs-aOXnlSf8peE3IJhMxunjyOotzt03hoX2OLcWMuvPF7OS3cPRUdCk0OGzGKzjq0KWDwpAUIZ-r7BfaRboCrg2PDEM2DMh_o5R36ODAUpf4jGM_FJLmn1DF6j6lunQTqJrxzQa_shxb-kGliwK1FS1tXoG8Jn85WTrSPy58GCQe1Xmoudg6OqUVYpFlZeNS28baoEp96zf4iRmVE",
		category: "Overalls",
	},
	{
		id: "7",
		title: "Cozy Knit Pullover",
		price: "$64.99",
		image: "https://via.placeholder.com/300x400?text=Pullover",
		category: "Sweaters",
	},
	{
		id: "8",
		title: "Vintage Washed Hoodie",
		price: "$54.99",
		image: "https://via.placeholder.com/300x400?text=Hoodie",
		category: "Hoodies",
	},
	{
		id: "9",
		title: "Retro Bomber Jacket",
		price: "$99.99",
		image: "https://via.placeholder.com/300x400?text=Bomber+Jacket",
		category: "Jackets",
	},
	{
		id: "10",
		title: "Slim Fit Chinos",
		price: "$45.99",
		image: "https://via.placeholder.com/300x400?text=Chinos",
		category: "Pants",
	},
	{
		id: "11",
		title: "Basic White Tee",
		price: "$19.99",
		image: "https://via.placeholder.com/300x400?text=White+Tee",
		category: "T-Shirts",
	},
	{
		id: "12",
		title: "Plaid Flannel Shirt",
		price: "$44.99",
		image: "https://via.placeholder.com/300x400?text=Flannel+Shirt",
		category: "Shirts",
	},
	{
		id: "13",
		title: "Leather Biker Jacket",
		price: "$149.99",
		image: "https://via.placeholder.com/300x400?text=Biker+Jacket",
		category: "Jackets",
	},
	{
		id: "14",
		title: "Athletic Fit Joggers",
		price: "$34.99",
		image: "https://via.placeholder.com/300x400?text=Joggers",
		category: "Pants",
	},
	{
		id: "15",
		title: "Graphic Print Tee",
		price: "$29.99",
		image: "https://via.placeholder.com/300x400?text=Graphic+Tee",
		category: "T-Shirts",
	},
	{
		id: "16",
		title: "Camel Wool Overcoat",
		price: "$159.99",
		image: "https://via.placeholder.com/300x400?text=Overcoat",
		category: "Coats",
	},
	{
		id: "17",
		title: "Denim Shirt Dress",
		price: "$69.99",
		image: "https://via.placeholder.com/300x400?text=Shirt+Dress",
		category: "Dresses",
	},
	{
		id: "18",
		title: "Beige Cotton Blazer",
		price: "$89.99",
		image: "https://via.placeholder.com/300x400?text=Blazer",
		category: "Blazers",
	},
	{
		id: "19",
		title: "Striped Polo Shirt",
		price: "$34.50",
		image: "https://via.placeholder.com/300x400?text=Polo+Shirt",
		category: "Shirts",
	},
	{
		id: "20",
		title: "High-Waist Mom Jeans",
		price: "$64.50",
		image: "https://via.placeholder.com/300x400?text=Mom+Jeans",
		category: "Jeans",
	},
];

export default function MarketplacePage() {
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 6; // show 6 products per page
	// const pageSize = 10; // show 10 products per page

	const totalPages = Math.ceil(demoProducts.length / pageSize);

	// slice products for current page
	const paginatedProducts = demoProducts.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const [searchTerm, setSearchTerm] = React.useState("");
	const [sortBy, setSortBy] = React.useState("popularity");

	// TODO: Implement search filtering
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		// optionally trigger filtering here
	};

	// TODO: Sort by Price
	// TODO: Sort by Popularity
	// TODO: Sort by Newest

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
									onClick={() => setSearchTerm("")}
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
						<Tabs value={sortBy} onValueChange={setSortBy} className="w-full">
							<TabsList className="flex w-full justify-start gap-4 overflow-x-auto rounded-none border-b border-muted bg-transparent p-0">
								<TabsTrigger
									value="price"
									className="rounded-md border-b-4 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground  data-[state=active]:dark:bg-primary data-[state=active]:border-foreground data-[state=active]:text-foreground"
								>
									Price
								</TabsTrigger>
								<TabsTrigger
									value="popularity"
									className="rounded-md border-b-4 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground  data-[state=active]:dark:bg-primary data-[state=active]:border-foreground data-[state=active]:text-foreground"
								>
									Popularity
								</TabsTrigger>
								<TabsTrigger
									value="newest"
									className="rounded-md border-b-4 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground  data-[state=active]:dark:bg-primary data-[state=active]:border-foreground data-[state=active]:text-foreground"
								>
									Newest
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					{/* Product grid */}
					<ProductGrid products={paginatedProducts} />

					{/* Pagination */}
					<div className="flex items-center justify-center p-4 gap-2">
						<Pagination
							totalPages={totalPages}
							currentPage={currentPage}
							onPageChange={(p) => setCurrentPage(p)}
							siblingCount={1}
							boundaryCount={1}
						/>
					</div>
				</main>
			</div>
		</div>
	);
}

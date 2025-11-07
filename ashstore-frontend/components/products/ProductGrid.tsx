// "use client";

// import * as React from "react";
// import ProductCard from "./ProductCard";
// import { Button } from "@/components/ui/button";
// import { AiOutlineProduct } from "react-icons/ai";
// import Link from "next/link";
// import { BackendResponse, IProduct } from "@/types/types";
// import { useDispatch, useSelector } from "react-redux";
// import { setFilters } from "@/redux/productSlice";
// import { addToWishlist, removeFromWishlist } from "@/redux/userSlice";
// import { addToCart } from "@/redux/cartSlice";
// import { RootState } from "@/redux/store";
// import toast from "react-hot-toast";
// import { addToWishlistApi, removeFromWishlistApi } from "@/api/userApis"; // Added removeFromWishlistApi import

// type Props = {
// 	products: IProduct[];
// };

// export default function ProductGrid({ products }: Props) {
// 	const dispatch = useDispatch();
// 	const wishlist = useSelector(
// 		(state: RootState) => state.user.user?.wishlist || []
// 	);
// 	const isAuthenticated = useSelector(
// 		(state: RootState) => state.user.isAuthenticated
// 	);

// 	if (!products || products.length === 0) {
// 		return <NoProducts />;
// 	}

// 	async function handleToggleWishlist(productId: string) {
// 		if (!isAuthenticated) {
// 			toast.error("Please log in to use wishlist");
// 			return;
// 		}

// 		const isCurrentlyInWishlist = wishlist.includes(productId);

// 		try {
// 			let response: BackendResponse;

// 			if (isCurrentlyInWishlist) {
// 				response = await removeFromWishlistApi(productId);
// 				if (response?.data?.success) {
// 					dispatch(removeFromWishlist(productId));
// 					toast.success("Removed from wishlist");
// 				}
// 			} else {
// 				response = await addToWishlistApi(productId);
// 				console.log("Response: ", response);
// 				if (response?.data?.success) {
// 					dispatch(addToWishlist(productId));
// 					toast.success("Added to wishlist");
// 				} else {
// 					toast.error(
// 						response?.response?.data?.message ||
// 							"Product fetching failed. Please try again."
// 					);
// 				}
// 			}
// 		} catch (error: any) {
// 			console.error("Wishlist error:", error);
// 			toast.error(
// 				error.response?.data?.message ||
// 					"An unexpected error occurred. Please try again."
// 			);
// 		}
// 	}

// 	function handleAddToCart(product: IProduct) {
// 		dispatch(addToCart(product));
// 		toast.success(`Added "${product.title}" to cart!`);
// 	}

// 	return (
// 		<div className="p-4">
// 			<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,280px))] justify-center gap-3 p-4">
// 				{products.map((product) => (
// 					<ProductCard
// 						key={product._id}
// 						product={product}
// 						onAddToCart={() => handleAddToCart(product)}
// 						onToggleWishlist={() => handleToggleWishlist(product._id)}
// 						isWishlisted={wishlist.includes(product._id)}
// 					/>
// 				))}
// 			</div>
// 		</div>
// 	);
// }

// function NoProducts() {
// 	const dispatch = useDispatch();

// 	function clearFilters() {
// 		dispatch(
// 			setFilters({
// 				category: undefined,
// 				size: undefined,
// 				color: undefined,
// 				minPrice: undefined,
// 				maxPrice: undefined,
// 				onSale: undefined,
// 				sortBy: undefined,
// 				sortOrder: undefined,
// 				search: undefined,
// 			}) as any
// 		);
// 	}
// 	return (
// 		<div className="flex w-full flex-col items-center justify-center gap-4 py-20 text-center">
// 			<div className="rounded-full bg-muted p-4">
// 				<AiOutlineProduct className="h-6 w-6 text-muted-foreground" />
// 			</div>

// 			<h3 className="text-lg font-semibold text-foreground">
// 				No products found
// 			</h3>
// 			<p className="max-w-lg text-sm text-muted-foreground">
// 				We couldn&apos;t find any products that match your filters. Try clearing
// 				or adjusting your filters, or search for another item.
// 			</p>

// 			<div className="mt-2 flex gap-2">
// 				<Button variant="outline" onClick={clearFilters}>
// 					Clear filters
// 				</Button>
// 				<Button asChild>
// 					<Link href="/">Go to homepage</Link>
// 				</Button>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import * as React from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { AiOutlineProduct } from "react-icons/ai";
import Link from "next/link";
import { IProduct } from "@/types/types";
import { useDispatch } from "react-redux";
import { setFilters } from "@/redux/productSlice";

type Props = {
	products: IProduct[];
};

export default function ProductGrid({ products }: Props) {
	if (!products || products.length === 0) {
		return <NoProducts />;
	}

	return (
		<div className="p-4">
			<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,280px))] justify-center gap-3 p-4">
				{products.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
}

function NoProducts() {
	const dispatch = useDispatch();

	function clearFilters() {
		dispatch(
			setFilters({
				category: undefined,
				size: undefined,
				color: undefined,
				minPrice: undefined,
				maxPrice: undefined,
				onSale: undefined,
				sortBy: undefined,
				sortOrder: undefined,
				search: undefined,
			}) as any
		);
	}
	return (
		<div className="flex w-full flex-col items-center justify-center gap-4 py-20 text-center">
			<div className="rounded-full bg-muted p-4">
				<AiOutlineProduct className="h-6 w-6 text-muted-foreground" />
			</div>

			<h3 className="text-lg font-semibold text-foreground">
				No products found
			</h3>
			<p className="max-w-lg text-sm text-muted-foreground">
				We couldn&apos;t find any products that match your filters. Try clearing
				or adjusting your filters, or search for another item.
			</p>

			<div className="mt-2 flex gap-2">
				<Button variant="outline" onClick={clearFilters}>
					Clear filters
				</Button>
				<Button asChild>
					<Link href="/">Go to homepage</Link>
				</Button>
			</div>
		</div>
	);
}

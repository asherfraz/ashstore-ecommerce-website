"use client";

import * as React from "react";
import ProductCard, { Product } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { AiOutlineProduct } from "react-icons/ai";
import Link from "next/link";

type Props = {
	products: Product[];
};

export default function ProductGrid({ products }: Props) {
	const [wishlist, setWishlist] = React.useState<string[]>([]);
	const [cart, setCart] = React.useState<string[]>([]);

	if (!products || products.length === 0) {
		return <NoProducts />;
	}

	function handleToggleWishlist(productId: string) {
		setWishlist(
			(prev) =>
				prev.includes(productId)
					? prev.filter((id) => id !== productId) // remove
					: [...prev, productId] // add
		);
	}

	function handleAddToCart(productId: string) {
		setCart((prev) => [...prev, productId]);
		console.log("Cart:", [...cart, productId]);
		alert(`Product ${productId} added to cart`);
		// 🔹 Later you can hook this to global state, API, or cart page
	}

	// TODO: Implement Wishlist functionality
	// TODO: Implement Add to Cart functionality
	return (
		<div className="p-4">
			{/* <div
				className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4"
			> */}
			<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,280px))]  justify-center gap-3 p-4">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						onAddToCart={handleAddToCart}
						onToggleWishlist={handleToggleWishlist}
						isWishlisted={wishlist.includes(product.id)}
					/>
				))}
			</div>
		</div>
	);
}

function NoProducts() {
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
				<Button variant="outline" onClick={() => window.location.reload()}>
					Clear filters
				</Button>
				<Button asChild>
					<Link href="/">Go to homepage</Link>
				</Button>
			</div>
		</div>
	);
}

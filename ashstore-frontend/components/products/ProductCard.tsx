"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MdAddShoppingCart } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

export interface Product {
	id: string;
	title: string;
	price: string;
	image: string;
	category?: string;
}

type Props = {
	product: Product;
	onAddToCart?: (productId: string) => void;
	onToggleWishlist?: (productId: string) => void;
	isWishlisted?: boolean;
};

export default function ProductCard({
	product,
	onAddToCart,
	onToggleWishlist,
	isWishlisted = false,
}: Props) {
	return (
		<article className="w-full">
			{/* Wrap with Link, prevent navigation on button clicks */}
			<Link
				href={`/product/${product.id}`}
				className="group block no-underline"
				aria-label={`View details for ${product.title}`}
			>
				<Card className="flex flex-col overflow-hidden bg-background hover:shadow-md transition-shadow duration-150 py-0">
					{/* Image */}
					<div className="relative w-full aspect-[3/4]">
						<Image
							src={product.image}
							alt={product.title}
							fill
							sizes="(max-width: 640px) 100vw, 33vw"
							className="rounded-lg object-cover object-center hover:scale-90 transition-transform duration-150 ease-in-out"
							priority={false}
						/>

						{/* Wishlist button */}
						<div className="absolute top-2 right-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onToggleWishlist?.(product.id);
								}}
								aria-label={
									isWishlisted
										? `Remove ${product.title} from wishlist`
										: `Add ${product.title} to wishlist`
								}
								className="rounded-full  bg-background/70 backdrop-blur-sm hover:bg-background/90"
								title={
									isWishlisted ? "Remove from wishlist" : "Add to wishlist"
								}
							>
								{isWishlisted ? (
									<FaHeart className="h-5 w-5 text-red-500" />
								) : (
									<FaRegHeart className="h-5 w-5 text-foreground" />
								)}
							</Button>
						</div>
					</div>

					{/* Content */}
					<CardContent className="px-3 py-2">
						{/* Category */}
						{product.category && (
							<p className="text-xs font-medium text-muted-foreground uppercase">
								{product.category}
							</p>
						)}

						{/* Title */}
						<h3
							className="mt-1 text-lg font-semibold text-foreground leading-tight line-clamp-2"
							title={product.title}
						>
							{product.title}
						</h3>

						{/* Price + Add to cart */}
						<div className="mt-2 flex items-center justify-between gap-3">
							<div className="flex items-baseline gap-2">
								<span className="text-base font-bold text-foreground">
									{product.price}
								</span>
							</div>

							{/* Cart button */}
							<div className="hover:scale-110 flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon"
									aria-label={`Add ${product.title} to cart`}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										onAddToCart?.(product.id);
									}}
									className="rounded-full p-2"
									title="Add to cart"
								>
									<MdAddShoppingCart className="h-4 w-4 text-foreground" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</Link>
		</article>
	);
}

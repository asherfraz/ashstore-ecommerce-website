"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MdAddShoppingCart } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { IProduct, BackendResponse } from "@/types/types";
import formatPrice from "@/helpers/formatPrice";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/redux/userSlice";
import { addToCart } from "@/redux/cartSlice";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { addToWishlistApi, removeFromWishlistApi } from "@/api/userApis";

type Props = {
	product: IProduct;
};

export default function ProductCard({ product }: Props) {
	const dispatch = useDispatch();
	const wishlist = useSelector(
		(state: RootState) => state.user.user?.wishlist || []
	);
	const isAuthenticated = useSelector(
		(state: RootState) => state.user.isAuthenticated
	);

	const isWishlisted = wishlist.includes(product._id);

	async function handleToggleWishlist(productId: string) {
		if (!isAuthenticated) {
			toast.error("Please log in to use wishlist");
			return;
		}

		try {
			let response: BackendResponse;

			if (isWishlisted) {
				response = await removeFromWishlistApi(productId);
				if (response?.data?.success) {
					dispatch(removeFromWishlist(productId));
					toast.success("Removed from wishlist");
				}
			} else {
				response = await addToWishlistApi(productId);
				if (response?.data?.success) {
					dispatch(addToWishlist(productId));
					toast.success("Added to wishlist");
				} else {
					toast.error(
						response?.response?.data?.message ||
							"Product fetching failed. Please try again."
					);
				}
			}
		} catch (error: any) {
			console.error("Wishlist error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		}
	}

	function handleAddToCart() {
		dispatch(addToCart(product));
		toast.success(`Added "${product.title}" to cart!`);
	}

	return (
		<article className="w-full">
			{/* Wrap with Link, prevent navigation on button clicks */}
			<Link
				href={`/product/${product._id}/${product.slug}`}
				className="group block no-underline"
				aria-label={`View details for ${product.title}`}
			>
				<Card className="flex flex-col overflow-hidden bg-background hover:shadow-md transition-shadow duration-150 py-0">
					{/* Image */}
					<div className="relative w-full aspect-[3/4]">
						<Image
							src={product.images ? product.images[0] : "/public/htlogo.png"}
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
									handleToggleWishlist(product._id);
								}}
								aria-label={
									isWishlisted
										? `Remove ${product.title} from wishlist`
										: `Add ${product.title} to wishlist`
								}
								className="rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90"
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
					<CardContent className="px-3 py-1">
						{/* Category */}
						<div className="flex justify-between items-center gap-1">
							{product.category && (
								<p className="text-xs font-medium text-muted-foreground uppercase">
									{Array.isArray(product.category) ? (
										product.category.slice(0, 2).map((category, index, arr) => (
											<span key={index}>
												{category}
												{index < arr.length - 1 && ", "}
											</span>
										))
									) : (
										<span>{product.category}</span>
									)}
								</p>
							)}
							{product.onSale && (
								<Badge
									variant={"default"}
									about="Sales discount"
									className="text-xs font-medium h-4 px-1.5"
								>
									{product.discount}% Sale
								</Badge>
							)}
						</div>

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
									{product.onSale ? (
										<span>
											<span className="text-xs font-bold text-muted-foreground line-through">
												{formatPrice(product.basePrice)}
											</span>{" "}
											{formatPrice(product.salePrice)}
										</span>
									) : (
										<span>{formatPrice(product.basePrice)}</span>
									)}
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
										handleAddToCart();
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

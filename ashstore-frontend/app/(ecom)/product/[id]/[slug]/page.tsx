"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { ProductMainSection } from "@/components/products/ProductMainSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import CTA_Newsletter from "@/components/common/CTA_Newsletter";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BackendResponse, IProduct, IProductReview } from "@/types/types";
import toast from "react-hot-toast";
import {
	addProductReview,
	addReviewReply,
	getProductById,
} from "@/api/productApis";
import { useDispatch } from "react-redux";
import { updateProduct } from "@/redux/productSlice";

// Types
interface Variant {
	color: string;
}

export default function ProductDetailPage() {
	const productId = useParams().id;
	const dispatch = useDispatch();
	const [product, setProduct] = useState<IProduct | null>(null);
	const reduxProducts = useSelector((state: RootState) => state.product);
	const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
	const [reviews, setReviews] = useState<IProductReview[]>([]);
	const [newReview, setNewReview] = useState<string>("");
	const [newRating, setNewRating] = useState<number>(0);
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [replyMessage, setReplyMessage] = useState<string>("");

	// NEW: show only a few reviews initially and support "Load more"
	const [visibleCount, setVisibleCount] = useState<number>(5);
	const [sortBy, setSortBy] = useState<"latest" | "rating">("latest");
	const STEP = 5;

	useEffect(() => {
		const filterProduct = reduxProducts.products.find(
			(product) => product._id === productId
		);

		const fetchProductById = async () => {
			try {
				const response = (await getProductById(
					productId as string
				)) as BackendResponse;

				if (response?.data?.success) {
					const productData = response.data.product;
					setProduct(productData);
					setReviews(productData.reviews || []);

					setRelatedProducts(productData?.relatedProducts as any);
				} else {
					toast.error(
						response?.response?.data?.message ||
							"Product fetching failed. Please try again."
					);
				}
			} catch (error: any) {
				console.error("Product fetching error:", error);
				toast.error(
					error.response?.data?.message ||
						"An unexpected error occurred. Please try again."
				);
			}
		};

		// if product is in redux state
		if (filterProduct) {
			setProduct(filterProduct);
			setReviews(filterProduct.reviews || []);
			setRelatedProducts(filterProduct?.relatedProducts as any);
		} else {
			// else call api
			fetchProductById();
		}
	}, [productId, reduxProducts.products]);

	// When user posts a new review
	const handlePostReview = async () => {
		if (!newReview.trim() || newRating === 0) {
			toast.error("Please add a rating and review text");
			return;
		}

		try {
			const response = (await addProductReview(productId as string, {
				rating: newRating,
				comment: newReview,
			})) as BackendResponse;

			if (response?.data?.success) {
				// Update the product with the new review
				const updatedProduct = response.data.product;
				setProduct(updatedProduct);
				setReviews(updatedProduct.reviews || []);
				setNewReview("");
				setNewRating(0);

				// Update the current product in Redux store
				dispatch(updateProduct(updatedProduct) as any);

				toast.success("Review added successfully!");
			} else {
				toast.error(
					response?.response?.data?.message ||
						"Failed to add review. Please try again."
				);
			}
		} catch (error: any) {
			console.error("Review posting error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		}
	};

	const handlePostReply = async (reviewId: string) => {
		if (!replyMessage.trim()) {
			toast.error("Please write a reply");
			return;
		}

		try {
			const response = (await addReviewReply(
				productId as string,
				reviewId as string,
				replyMessage
			)) as BackendResponse;

			if (response?.data?.success) {
				toast.success("Reply added successfully!");

				// Update the product with the new reply
				const updatedProduct = response.data.product;
				setProduct(updatedProduct);
				setReviews(updatedProduct.reviews || []);
				setReplyingTo(null);
				setReplyMessage("");

				// Update the current product in Redux store
				dispatch(updateProduct(updatedProduct));
			} else {
				toast.error(
					response?.response?.data?.message ||
						"Failed to add reply. Please try again."
				);
			}
		} catch (error: any) {
			console.error("Reply posting error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		}
	};

	// Prepare sorted list (do not mutate original reviews)
	const sortedReviews = (() => {
		const copy = [...reviews];
		if (sortBy === "rating") {
			// sort by rating desc, then by createdAt desc (newer first)
			return copy.sort((a, b) => {
				if (b.rating !== a.rating) return b.rating - a.rating;
				return (
					new Date(b.createdAt || 0).getTime() -
					new Date(a.createdAt || 0).getTime()
				);
			});
		}
		// sortBy === "latest" -> sort by createdAt descending
		return copy.sort(
			(a, b) =>
				new Date(b.createdAt || 0).getTime() -
				new Date(a.createdAt || 0).getTime()
		);
	})();

	// Slice the visible reviews
	const visibleReviews = sortedReviews.slice(0, visibleCount);

	// If sort changes, reset visibleCount to default STEP
	useEffect(() => {
		setVisibleCount(STEP);
	}, [sortBy]);

	// Helper function to get unique values and counts
	const getUniqueValuesWithCount = (array: Variant[], key: keyof Variant) => {
		const countMap = array.reduce((acc, item) => {
			const value = item[key];
			acc[value] = acc[value] ? acc[value] + 1 : 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.keys(countMap).map((key) => ({
			value: key,
			count: countMap[key],
		}));
	};

	// Calculate rating distribution
	const calculateRatingDistribution = () => {
		const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

		reviews.forEach((review) => {
			if (review.rating >= 1 && review.rating <= 5) {
				distribution[review.rating as keyof typeof distribution]++;
			}
		});

		// Convert to percentages
		const total = reviews.length;
		return Object.keys(distribution).map((rating) => ({
			stars: parseInt(rating),
			percent:
				total > 0
					? Math.round(
							(distribution[rating as keyof typeof distribution] / total) * 100
					  )
					: 0,
		}));
	};

	const ratingDistribution = calculateRatingDistribution();

	// Helper function to get user display name
	const getUserDisplayName = (userId: any) => {
		if (typeof userId === "object" && userId !== null) {
			return (
				userId.name || `User ${userId._id?.substring(0, 6)}` || "Unknown User"
			);
		}
		return `User ${userId?.substring(0, 6)}` || "Unknown User";
	};

	// Helper function to get user avatar
	const getUserAvatar = (userId: any) => {
		if (typeof userId === "object" && userId !== null) {
			return userId.avatar;
		}
		return undefined;
	};

	return (
		product && (
			<div className="container mx-auto px-4 py-8 space-y-12">
				{/* Breadcrumb */}
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/marketplace">Marketplace</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{product.title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				{/* 1. Product main section */}
				<div className="lg:col-span-1">
					<ProductMainSection product={product} />
				</div>

				<Separator />

				{/* 2. Product Description / Specification */}
				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-6">
						Product Specifications
					</h2>
					<Card>
						<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
							<div className="sm:col-span-2 mb-2">
								<span className="font-medium text-foreground">
									Product Description:
								</span>{" "}
								{product.description}
							</div>
							<div>
								<span className="font-medium text-foreground">
									Available Colors:{" "}
								</span>
								{Array.isArray(product.variants) ? (
									(() => {
										// Get unique colors and count their occurrences
										const uniqueColors = getUniqueValuesWithCount(
											product.variants,
											"color"
										);

										// Check if all colors are the same
										if (uniqueColors.length === 1) {
											return <span>{uniqueColors[0].value}</span>;
										}

										return uniqueColors.map((color, index, arr) => (
											<span key={index}>
												{color.value} {color.count > 1 && `(${color.count})`}
												{index < arr.length - 1 && ", "}
											</span>
										));
									})()
								) : (
									<span>{product.variants?.[0]?.color}</span>
								)}
							</div>

							<div>
								<span className="font-medium text-foreground">
									Available Sizes:
								</span>{" "}
								{Array.isArray(product.variants) ? (
									product.variants.map((variant, index, arr) => (
										<span key={index}>
											{variant.size}
											{index < arr.length - 1 && ", "}
										</span>
									))
								) : (
									<span>{product.variants?.[0]?.size}</span>
								)}
							</div>

							<div className="sm:col-span-2">
								<span className="font-medium text-foreground">
									Key Features:
								</span>
								<ul className="list-disc pl-5 mt-1 space-y-1">
									{product.keyFeatures.map((feature, idx) => (
										<li key={idx}>{feature}</li>
									))}
								</ul>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* 3. Reviews Stats */}
				<section>
					<Card>
						<CardContent>
							<div className="flex items-center gap-6">
								<div className="text-center">
									<p className="text-4xl font-bold">{reviews.length}</p>
									<div className="flex justify-center text-yellow-500">
										{Array.from({
											length: Math.round(product.averageRating || 0),
										}).map((_, i) => (
											<Star key={i} className="w-5 h-5 fill-current" />
										))}
										{Array.from({
											length: 5 - Math.round(product.averageRating || 0),
										}).map((_, i) => (
											<Star key={i} className="w-5 h-5" />
										))}
									</div>
									<p className="text-sm text-muted-foreground">
										{reviews.length} reviews
									</p>
								</div>
								<div className="flex-1 space-y-2">
									{ratingDistribution.map(({ stars, percent }) => (
										<div key={stars} className="flex items-center gap-2">
											<span className="w-8 text-sm">{stars}</span>
											<Progress value={percent} className="flex-1 h-2" />
											<span className="w-10 text-sm text-muted-foreground">
												{percent}%
											</span>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* 4. Customer Reviews */}
				<section className="mt-16">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold text-foreground mb-6">
							Customer Reviews
						</h2>

						{/* Sort controls: Latest | Top rated */}
						<div className="flex gap-2 mb-6">
							<Button
								variant={sortBy === "latest" ? "default" : "ghost"}
								size="sm"
								onClick={() => setSortBy("latest")}
								aria-pressed={sortBy === "latest"}
							>
								Latest
							</Button>
							<Button
								variant={sortBy === "rating" ? "default" : "ghost"}
								size="sm"
								onClick={() => setSortBy("rating")}
								aria-pressed={sortBy === "rating"}
							>
								Top rated
							</Button>
						</div>
					</div>

					{/* Post Review */}
					<div className="mb-6 space-y-3">
						<div className="flex gap-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									size={24}
									onClick={() => setNewRating(star)}
									className={`cursor-pointer ${
										star <= newRating
											? "text-yellow-500 fill-current"
											: "text-gray-300"
									}`}
									role="button"
									aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
								/>
							))}
						</div>
						<Textarea
							placeholder="Write your review..."
							value={newReview}
							onChange={(e) => setNewReview(e.target.value)}
							aria-label="Write your review"
						/>
						<Button onClick={handlePostReview}>Post Review</Button>
					</div>

					<div className="space-y-6">
						{visibleReviews.map((review) => (
							<Card key={review._id}>
								<CardHeader className="flex flex-row items-center gap-4">
									<Avatar>
										<AvatarImage src={getUserAvatar(review.userId)} />
										<AvatarFallback>
											{getUserDisplayName(review.userId)
												.charAt(0)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle className="text-base font-medium">
											{getUserDisplayName(review.userId)}
										</CardTitle>
										<p className="text-xs text-muted-foreground">
											{review.createdAt
												? new Date(review.createdAt).toLocaleString()
												: "Unknown date"}
										</p>
										<div className="flex items-center gap-1 text-yellow-500 mt-1">
											{Array.from({ length: review.rating }).map((_, i) => (
												<Star key={i} size={16} fill="currentColor" />
											))}
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-3">
										{review.comment}
									</p>
									<div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
										<Button
											variant="ghost"
											size="sm"
											className="flex items-center gap-1"
										>
											<ThumbsUp size={16} /> {review.likes}
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="flex items-center gap-1"
										>
											<ThumbsDown size={16} /> {review.dislikes}
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												setReplyingTo(
													replyingTo === review._id ? null : review._id
												)
											}
										>
											Reply
										</Button>
									</div>

									{/* Reply Input */}
									{replyingTo === review._id && (
										<div className="space-y-2 mb-3">
											<Textarea
												placeholder="Write a reply..."
												value={replyMessage}
												onChange={(e) => setReplyMessage(e.target.value)}
												aria-label={`Reply to review`}
											/>
											<Button
												size="sm"
												onClick={() => handlePostReply(review._id!)}
											>
												Post Reply
											</Button>
										</div>
									)}

									{/* Replies */}
									{review.replies && review.replies.length > 0 && (
										<div className="space-y-2 pl-6 border-l">
											{review.replies.map((reply) => (
												<div
													key={reply._id || Math.random()}
													className="flex gap-2 items-start"
												>
													<Avatar className="w-6 h-6">
														<AvatarImage src={getUserAvatar(reply.userId)} />
														<AvatarFallback>
															{getUserDisplayName(reply.userId)
																.charAt(0)
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className="text-sm font-medium">
															{getUserDisplayName(reply.userId)}
														</p>
														<p className="text-xs text-muted-foreground">
															{reply.createdAt
																? new Date(reply.createdAt).toLocaleString()
																: "Unknown date"}
														</p>
														<p className="text-sm text-muted-foreground">
															{reply.comment}
														</p>
													</div>
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>

					{/* Load more reviews button (show step-by-step) */}
					{sortedReviews.length > visibleCount && (
						<div className="flex justify-center mt-4">
							<Button
								onClick={() =>
									setVisibleCount((v) =>
										Math.min(v + STEP, sortedReviews.length)
									)
								}
							>
								Load more reviews (
								{Math.min(visibleCount + STEP, sortedReviews.length) -
									visibleCount}
								)
							</Button>
						</div>
					)}
					{/* If there are no reviews */}
					{sortedReviews.length === 0 && (
						<p className="text-sm text-muted-foreground mt-2">
							No reviews yet — be the first to review this product.
						</p>
					)}
				</section>

				<Separator />

				{/* 5. Related Products */}
				{relatedProducts.length > 0 && (
					<section>
						<h2 className="text-2xl font-semibold mb-4">Related Products</h2>
						<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,280px))] justify-center gap-3 p-4">
							{relatedProducts.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>
					</section>
				)}

				{/* Newsletter */}
				<section className="my-4 md:my-8">
					<CTA_Newsletter />
				</section>
			</div>
		)
	);
}

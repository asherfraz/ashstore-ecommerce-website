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

// Types
interface RelatedProduct {
	id: string;
	title: string;
	price: string;
	image: string;
	category: string;
	keyFeatures: string[];
}

interface Reply {
	id: number;
	name: string;
	avatar: string;
	time: string;
	comment: string;
}

interface Review {
	id: number;
	name: string;
	avatar: string;
	rating: number;
	time: string;
	comment: string;
	likes: number;
	dislikes: number;
	replies: Reply[];
}

// Mock data
const relatedProducts: RelatedProduct[] = [
	{
		id: "1",
		title: "Classic Blue Denim Jacket",
		price: "$79.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuD-Nfxezyvb2l1TW8T0U4tPpiXg4ntHnmrnxcCYZglwdxr3bXsSc7jwOR9lsS3wLAITO8izoAv-WPl7WTBrmULOmS9v-szQY-RNajWA1pTv2fD1kd-btydN_oR7JhQwgzXU4syXc7SzJC2SezkKLQwVAt6B7iXkkg7htb0h3pOGExAVQaK3R3rK6cD4IaOCsdVavTwkixaMClUHkQ3koYYhoNsi0A32w-pId2lVhMvDzDAfLQM7yDDz_vslgXr0v-LxR3Tc5hHz770",
		category: "Jackets",
		keyFeatures: [
			"Classic denim style",
			"Durable cotton fabric",
			"Timeless design",
		],
	},
	{
		id: "2",
		title: "Summer Breeze Linen Shirt",
		price: "$49.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCHFhC2w9vyNTwxxkoDBI7z59SCIyz4zpMchSp-LMPDptruk1Lgf5ZvwBG-9wBQpBGHv1NIa9gDK5E2Bx9S7wmejXc_UY-iiZK_9DIx_XES0YTAUsVTKdg072l2pUTg9ZBiLBaEqpDuO-1IgkLfQ1AbmPLjul1Yfmz4eVosSIeGuE8MbbD9Iigi5_0_8LKxW74CdEDd8HIVR5q_Ih0DNzyRrQapq1soFd63XLQu31HDNjKDu1OGVMXlf_5lNuygE3Wzh0efJIxpbUA",
		category: "Shirts",
		keyFeatures: [
			"Lightweight and breathable fabric",
			"Relaxed fit for all-day comfort",
			"Available in multiple colors",
		],
	},
	{
		id: "3",
		title: "Urban Edge Cargo Pants",
		price: "$69.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBXDy-zqb4PK3argMcQf9lkxkcdy0hIwkrDpniLBTcLJWWhzSBpxWhDT0cUKun9qLRqR4ZHokVtXFXud5X6Snfehv3tWM1gLaPEVANpQ8JQqNV44SzFCc16-V0OR_vs2DbsqO86qscTObMhM0-AY1UQDQmw1Xd2gnuWLuhEGIOqb_gwHTatWl08KQzFr6SH7DnsWrwFpaoXjB5G8ERlbwfsbxXeBMmZuvbnJhSsnjha8TvFkvkOMHFMRbQu3Hd4KjMelqkVYa7Cadk",
		category: "Pants",
		keyFeatures: [
			"Durable and versatile design",
			"Multiple pockets for storage",
			"Adjustable waistband",
		],
	},
	{
		id: "4",
		title: "Sunset Hues Tie-Dye Tee",
		price: "$39.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCvhCwGpTux2TGOdfc4KqAtQWkn2brSJa6c8tZbSTvSKNKENizJpJrbJStEftOY2JmkDLhg0NEgXsUyYGLh1Yyc4hCBFUiwWIGBDNlUB1DY_x-o2yFEBKxKjLWtPrssuOPhG3C_2OliGeGC2U76sxh96aGqZ9SSPOSIJi0Kh0UbtlKstS3omaq5QABNNKwk6FBJqSprKsLrbHOSCcFVVJvJvqGEaH35wdpbhBN3MAUnk_Vttzr3_rCxkIBCeX_5PIJZFaXpj6NNTwo",
		category: "T-Shirts",
		keyFeatures: [
			"Unique tie-dye pattern",
			"Soft and comfortable fabric",
			"Unisex design",
		],
	},
];

const reviewsData: Review[] = [
	{
		id: 1,
		name: "Owen Bennett",
		avatar: "https://i.pravatar.cc/100?img=12",
		rating: 5,
		time: "2 months ago",
		comment:
			"Excellent jacket! The fit is perfect, and the material feels very high-quality. I've received many compliments on it.",
		likes: 5,
		dislikes: 1,
		replies: [],
	},
	{
		id: 2,
		name: "Noah Carter",
		avatar: "https://i.pravatar.cc/100?img=15",
		rating: 4,
		time: "3 months ago",
		comment:
			"Great jacket, but the color is slightly different from what I expected. Still a good purchase overall.",
		likes: 3,
		dislikes: 0,
		replies: [],
	},
];

export default function ProductDetailPage() {
	const [reviews, setReviews] = useState<Review[]>(reviewsData);
	const [newReview, setNewReview] = useState<string>("");
	const [newRating, setNewRating] = useState<number>(0);
	const [replyingTo, setReplyingTo] = useState<number | null>(null);
	const [replyMessage, setReplyMessage] = useState<string>("");

	// NEW: show only a few reviews initially and support "Load more"
	const [visibleCount, setVisibleCount] = useState<number>(5);
	const [sortBy, setSortBy] = useState<"latest" | "rating">("latest");
	const STEP = 5;

	// When user posts a new review, ensure visibleCount keeps it visible (if sorting by latest).
	const handlePostReview = () => {
		if (!newReview.trim() || newRating === 0) return;
		const newRev: Review = {
			id: Date.now(),
			name: "You",
			avatar: "",
			rating: newRating,
			time: "Just now",
			comment: newReview,
			likes: 0,
			dislikes: 0,
			replies: [],
		};
		setReviews((prev) => [newRev, ...prev]);
		setNewReview("");
		setNewRating(0);

		// Make sure the newly added review appears
		if (sortBy === "latest") {
			setVisibleCount((v) => Math.max(v, 1)); // keep at least 1, but user likely has default 5
		}
	};

	const handlePostReply = (reviewId: number) => {
		if (!replyMessage.trim()) return;
		setReviews((prev) =>
			prev.map((review) =>
				review.id === reviewId
					? {
							...review,
							replies: [
								...review.replies,
								{
									id: Date.now(),
									name: "You",
									avatar: "",
									time: "Just now",
									comment: replyMessage,
								},
							],
					  }
					: review
			)
		);
		setReplyingTo(null);
		setReplyMessage("");
	};

	// Prepare sorted list (do not mutate original reviews)
	const sortedReviews = (() => {
		const copy = [...reviews];
		if (sortBy === "rating") {
			// sort by rating desc, then by id desc (newer first)
			return copy.sort((a, b) => {
				if (b.rating !== a.rating) return b.rating - a.rating;
				return b.id - a.id;
			});
		}
		// sortBy === "latest" -> assume array order is newest-first (code prepends new reviews)
		// but to be safe, also sort by id descending (newer items have larger id for Date.now())
		return copy.sort((a, b) => b.id - a.id);
	})();

	// Slice the visible reviews
	const visibleReviews = sortedReviews.slice(0, visibleCount);

	// If sort changes, reset visibleCount to default STEP
	useEffect(() => {
		setVisibleCount(STEP);
	}, [sortBy]);

	return (
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
						<BreadcrumbPage>Classic White Shirt</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* 1. Product main section */}
			<div className="lg:col-span-1">
				<ProductMainSection />
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
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
							necessitatibus ipsam ea blanditiis quod vel quas nisi minima velit
							sapiente.
						</div>
						<div>
							<span className="font-medium text-foreground">Fabric:</span> 100%
							Cotton
						</div>
						<div>
							<span className="font-medium text-foreground">Color:</span> White
						</div>
						<div>
							<span className="font-medium text-foreground">
								Available Sizes:
							</span>{" "}
							S, M, L, XL
						</div>
						<div>
							<span className="font-medium text-foreground">Fit:</span> Regular
						</div>
						<div>
							<span className="font-medium text-foreground">Length:</span> 72cm
						</div>
						<div>
							<span className="font-medium text-foreground">Chest Width:</span>{" "}
							54cm
						</div>

						<div className="sm:col-span-2">
							<span className="font-medium text-foreground">Key Features:</span>
							<ul className="list-disc pl-5 mt-1 space-y-1">
								{relatedProducts[0].keyFeatures.map((feature, idx) => (
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
					{/* <CardHeader>
						<CardTitle>Reviews</CardTitle>
					</CardHeader> */}
					<CardContent>
						<div className="flex items-center gap-6">
							<div className="text-center">
								<p className="text-4xl font-bold">4.5</p>
								<div className="flex justify-center text-yellow-500">
									{Array.from({ length: 4 }).map((_, i) => (
										<Star key={i} className="w-5 h-5 fill-current" />
									))}
									<Star className="w-5 h-5" />
								</div>
								<p className="text-sm text-muted-foreground">120 reviews</p>
							</div>
							<div className="flex-1 space-y-2">
								{[
									{ stars: 5, percent: 40 },
									{ stars: 4, percent: 30 },
									{ stars: 3, percent: 15 },
									{ stars: 2, percent: 10 },
									{ stars: 1, percent: 5 },
								].map(({ stars, percent }) => (
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
						<Card key={review.id}>
							<CardHeader className="flex flex-row items-center gap-4">
								<Avatar>
									{review.avatar ? (
										<AvatarImage src={review.avatar} />
									) : (
										<AvatarFallback>
											{review.name.charAt(0).toUpperCase()}
										</AvatarFallback>
									)}
								</Avatar>
								<div>
									<CardTitle className="text-base font-medium">
										{review.name}
									</CardTitle>
									<p className="text-xs text-muted-foreground">{review.time}</p>
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
											setReplyingTo(replyingTo === review.id ? null : review.id)
										}
									>
										Reply
									</Button>
								</div>

								{/* Reply Input */}
								{replyingTo === review.id && (
									<div className="space-y-2 mb-3">
										<Textarea
											placeholder="Write a reply..."
											value={replyMessage}
											onChange={(e) => setReplyMessage(e.target.value)}
											aria-label={`Reply to ${review.name}`}
										/>
										<Button
											size="sm"
											onClick={() => handlePostReply(review.id)}
										>
											Post Reply
										</Button>
									</div>
								)}

								{/* Replies */}
								<div className="space-y-2 pl-6 border-l">
									{review.replies.map((reply) => (
										<div key={reply.id} className="flex gap-2 items-start">
											<Avatar className="w-6 h-6">
												{reply.avatar ? (
													<AvatarImage src={reply.avatar} />
												) : (
													<AvatarFallback>
														{reply.name.charAt(0).toUpperCase()}
													</AvatarFallback>
												)}
											</Avatar>
											<div>
												<p className="text-sm font-medium">{reply.name}</p>
												<p className="text-xs text-muted-foreground">
													{reply.time}
												</p>
												<p className="text-sm text-muted-foreground">
													{reply.comment}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Load more reviews button (show step-by-step) */}
				{sortedReviews.length > visibleCount && (
					<div className="flex justify-center mt-4">
						<Button
							onClick={() =>
								setVisibleCount((v) => Math.min(v + STEP, sortedReviews.length))
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
			<section>
				<h2 className="text-2xl font-semibold mb-4">Related Products</h2>
				<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,280px))] justify-center gap-3 p-4">
					{relatedProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							// onAddToCart={handleAddToCart}
							// onToggleWishlist={handleToggleWishlist}
							// isWishlisted={wishlist.includes(product.id)}
						/>
					))}
				</div>
			</section>

			{/* Newsletter */}
			<section className="my-4 md:my-8">
				<CTA_Newsletter />
			</section>
		</div>
	);
}

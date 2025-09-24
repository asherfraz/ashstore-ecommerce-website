"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, HeartOff, Minus, Plus, ShoppingCart } from "lucide-react";
import formatPrice from "@/helpers/formatPrice";
import { IProduct } from "@/types/types";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import { addToWishlist, removeFromWishlist } from "@/redux/userSlice";
import { addToCart } from "@/redux/cartSlice";
import { addToWishlistApi, removeFromWishlistApi } from "@/api/userApis";

interface Props {
	product: IProduct;
}

type ColorType = [string, number];

export function ProductMainSection({ product }: Props) {
	const dispatch = useDispatch();

	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedColor, setSelectedColor] = useState<ColorType | undefined>();
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [loadingWishlist, setLoadingWishlist] = useState(false);

	const wishlist = useSelector(
		(state: RootState) => state.user.user?.wishlist || []
	);
	const isAuthenticated = useSelector(
		(state: RootState) => state.user.isAuthenticated
	);

	const [isWishlisted, setIsWishlisted] = useState(false);

	// const isWishlisted = wishlist.some((item) => item === product._id);
	useEffect(() => {
		setIsWishlisted(wishlist.some((item) => item === product._id));
	}, [loadingWishlist, wishlist, product._id]);

	useEffect(() => {
		setQuantity(1);
	}, [selectedColor, selectedSize]);

	const colors = product?.variants.map((variant) => variant.color);
	const sizes = product?.variants.map((variant) => variant.size);

	// Wishlist Toggle
	async function handleToggleWishlist() {
		if (!isAuthenticated) {
			toast.error("Please login to use wishlist.");
			return;
		}

		try {
			setLoadingWishlist(true);
			let response;

			if (isWishlisted) {
				response = await removeFromWishlistApi(product._id);
				if (response?.data?.success) {
					dispatch(removeFromWishlist(product._id));
					toast.success("Removed from wishlist");
				}
			} else {
				response = await addToWishlistApi(product._id);
				if (response?.data?.success) {
					dispatch(addToWishlist(product._id));
					toast.success("Added to wishlist");
				}
			}
		} catch (error: any) {
			console.error(error);
			toast.error("Something went wrong!");
		} finally {
			setLoadingWishlist(false);
		}
	}

	// Find selected variant based on color & size
	const getMatchingVariant = () => {
		return product.variants.find(
			(variant) =>
				variant.color === selectedColor?.[0] && variant.size === selectedSize
		);
	};

	// Handle "+" button click
	const handleIncreaseQuantity = () => {
		const matchingVariant = getMatchingVariant();

		if (!matchingVariant) {
			toast.error("Please select color and size");
			return;
		}

		if (quantity >= matchingVariant.stock) {
			toast.error(`Only ${matchingVariant.stock} in stock`);
			return;
		}

		setQuantity((q) => q + 1);
	};

	// Check if "+" button should be disabled
	const isIncreaseDisabled = () => {
		const matchingVariant = getMatchingVariant();
		return matchingVariant ? quantity >= matchingVariant.stock : false;
	};

	//  Add to Cart
	const handleAddToCart = () => {
		if (!selectedColor || !selectedSize) {
			toast.error("Please select color and size");
			return;
		}

		// Find the specific product variant based on selected color and size
		const matchingVariant = product.variants.find(
			(variant) =>
				variant.color === selectedColor[0] && variant.size === selectedSize
		);

		if (!matchingVariant) {
			toast.error("Selected combination is not available.");
			return;
		}

		const cartItem = {
			...product,
			// price: matchingVariant.price,
			quantity,
			color: selectedColor[0],
			size: selectedSize,
			variantId: matchingVariant._id, // if needed
		};

		console.log("Cart Prodcut : ", cartItem);

		dispatch(addToCart(cartItem as any));
		toast.success(`Added "${product.title}" to cart!`);
	};

	return (
		product && (
			<section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left: Product Images */}
				<div className="flex flex-col items-center">
					<Card className="w-full aspect-[3/2] relative overflow-hidden">
						<Image
							src={product?.images[selectedImage]}
							alt="Product image"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover object-center"
							priority
						/>
					</Card>

					{/* Thumbnails */}
					<div className="grid grid-cols-4 gap-2 mt-4 w-full">
						{product?.images.map((img, idx) => (
							<button
								key={idx}
								onClick={() => setSelectedImage(idx)}
								className={`relative aspect-video overflow-hidden rounded-md border ${
									selectedImage === idx ? "border-foreground" : "border-muted"
								}`}
								aria-label={`Thumbnail ${idx + 1}`}
							>
								<Image
									src={img}
									alt={`Thumbnail ${idx + 1}`}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									className="object-cover"
								/>
							</button>
						))}
					</div>
				</div>

				{/* Right: Product Info */}
				<div className="flex flex-col gap-6">
					{/* Basic Info */}
					<div>
						<span className="text-muted-foreground font-medium">
							{product?.brand}
						</span>
						<h1 className="text-2xl font-bold">{product?.title}</h1>
						<div className="text-xs font-medium text-muted-foreground uppercase">
							{Array.isArray(product?.category)
								? product?.category.join(", ")
								: product?.category}
						</div>
						<p className="text-muted-foreground mt-2">{product?.description}</p>

						<p className="mt-2 text-sm text-muted-foreground font-medium">
							Product Serial: {product?.psr}
						</p>

						<p className="text-xl font-bold mt-4">
							{product?.onSale ? (
								<>
									<span className="text-muted-foreground line-through">
										{formatPrice(product?.basePrice)}
									</span>{" "}
									<span className="md:text-3xl font-bold">
										{formatPrice(product?.salePrice)}
									</span>
								</>
							) : (
								<span>{formatPrice(product?.basePrice)}</span>
							)}
						</p>
					</div>

					{/* Color Options */}
					{colors.length > 0 && (
						<div className="space-y-2">
							<p className="text-sm font-medium">Color</p>
							<div className="flex gap-2 flex-wrap">
								{colors.map((color, index) => (
									<Button
										key={index}
										variant={
											selectedColor &&
											selectedColor[0] === color &&
											selectedColor[1] === index
												? "default"
												: "outline"
										}
										size="sm"
										onClick={() => setSelectedColor([color, index])}
									>
										{color}
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Sizes */}
					{sizes.length > 0 && (
						<div className="space-y-2">
							<p className="text-sm font-medium">Sizes</p>
							<div className="flex gap-2 flex-wrap">
								{sizes.map((size, index) => (
									<Button
										key={index}
										variant={selectedSize === size ? "default" : "outline"}
										size="sm"
										onClick={() => setSelectedSize(size)}
									>
										{size}
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Quantity */}
					<div className="space-y-2">
						<p className="text-sm font-medium">Quantity</p>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								aria-label="Decrease"
								onClick={() => setQuantity((q) => Math.max(1, q - 1))}
								disabled={quantity <= 1}
							>
								<Minus className="h-4 w-4" />
							</Button>
							<span className="text-lg font-medium w-6 text-center">
								{quantity}
							</span>
							<Button
								variant="outline"
								size="icon"
								aria-label="Increase"
								// onClick={() => setQuantity((q) => q + 1)}
								onClick={handleIncreaseQuantity}
								disabled={isIncreaseDisabled()}
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-wrap gap-4 mt-4">
						<Button
							className="flex items-center gap-2"
							onClick={handleAddToCart}
						>
							<ShoppingCart className="w-4 h-4" />
							Add to Cart
						</Button>
						<Button
							variant="outline"
							className="flex items-center gap-2"
							onClick={handleToggleWishlist}
							disabled={loadingWishlist}
						>
							{isWishlisted ? (
								<>
									<HeartOff className="w-4 h-4 text-red-500" />
									Remove from Wishlist
								</>
							) : (
								<>
									<Heart className="w-4 h-4" />
									Add to Wishlist
								</>
							)}
						</Button>
					</div>
				</div>
				{/* End Right Section */}
			</section>
		)
	);
}

// <span className="text-muted-foreground font-medium">Brand Name</span>;

// const thumbnails = [
// 	"https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?auto=format&fit=crop&w=400&q=80",
// 	"https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=400&q=80",
// 	"https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?auto=format&fit=crop&w=400&q=80",
// 	"https://images.unsplash.com/photo-1528148343865-51218c4a13e6?auto=format&fit=crop&w=400&q=80",
// ];

{
	/* Key Features */
}
{
	/* <div>
    <h3 className="text-lg font-semibold mb-2">Key Features</h3>
    <ul className="list-disc list-inside text-muted-foreground space-y-1">
        <li>Industry-leading noise cancellation</li>
        <li>30-hour battery life</li>
        <li>Touch sensor controls</li>
        <li>Speak-to-chat technology</li>
    </ul>
</div> */
}

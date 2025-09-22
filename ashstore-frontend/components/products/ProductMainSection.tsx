"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import formatPrice from "@/helpers/formatPrice";
import { IProduct } from "@/types/types";

interface Props {
	product: IProduct;
}

export function ProductMainSection({ product }: Props) {
	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedColor, setSelectedColor] = useState("");
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [quantity, setQuantity] = useState(1);

	const colors = product?.variants.map((variant) => variant.color);

	const sizes = product?.variants.map((variant) => variant.size);

	return (
		product && (
			<section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left: Product Images */}
				<div className="flex flex-col items-center">
					<Card className="w-full aspect-[3/2] relative overflow-hidden">
						<Image
							src={`${product?.images[selectedImage]}`}
							alt="Product image"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover  object-center"
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
					<div>
						<span className="text-muted-foreground font-medium">
							{product?.brand}
						</span>
						<h1 className="text-2xl font-bold">{product?.title}</h1>
						<span className="text-xs text-muted-foreground font-medium">
							{product?.category && (
								<p className="text-xs font-medium text-muted-foreground uppercase">
									{Array.isArray(product?.category) ? (
										product?.category.map((category, index, arr) => (
											<span key={index}>
												{category}
												{index < arr.length - 1 && ", "}
											</span>
										))
									) : (
										<span>{product?.category}</span>
									)}
								</p>
							)}
						</span>

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

					<div className="flex flex-wrap shrink-2 justify-start items-center gap-8">
						{/* Color Options */}
						<div className="space-y-2">
							<p className="text-sm font-medium">Color</p>
							<div className="flex gap-2">
								{Array.isArray(colors) ? (
									colors.map((color, index) => (
										<Button
											key={index}
											variant={selectedColor === color ? "default" : "outline"}
											size="sm"
											onClick={() => setSelectedColor(color)}
											aria-pressed={selectedColor === color}
										>
											{color}
										</Button>
									))
								) : (
									<Button
										variant={selectedColor === colors ? "default" : "outline"}
										size="sm"
										onClick={() => setSelectedColor(colors)}
										aria-pressed={selectedColor === colors}
									>
										{colors}
									</Button>
								)}
							</div>
						</div>

						{/* Sizes */}
						<div className="space-y-2">
							<p className="text-sm font-medium">Sizes</p>
							<div className="flex gap-2">
								{Array.isArray(sizes) ? (
									sizes.map((size, index) => (
										<Button
											key={index}
											variant={selectedSize === size ? "default" : "outline"}
											size="sm"
											onClick={() => setSelectedSize(size)}
											aria-pressed={selectedSize === size}
										>
											{size}
										</Button>
									))
								) : (
									<Button
										variant={selectedSize === sizes ? "default" : "outline"}
										size="sm"
										onClick={() => setSelectedSize(sizes)}
										aria-pressed={selectedSize === sizes}
									>
										{sizes}
									</Button>
								)}
							</div>
						</div>
					</div>

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
								onClick={() => setQuantity((q) => q + 1)}
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Actions */}
					<div className="flex flex-wrap gap-4 mt-4">
						<Button className="flex items-center gap-2">
							<ShoppingCart className="w-4 h-4" />
							Add to Cart
						</Button>
						<Button
							variant="outline"
							className="flex items-center gap-2"
							aria-label="Add to Wishlist"
						>
							<Heart className="w-4 h-4" />
							Wishlist
						</Button>
					</div>
				</div>
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

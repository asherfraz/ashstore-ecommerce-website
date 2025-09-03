"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

export function ProductMainSection() {
	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedColor, setSelectedColor] = useState("black");
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [quantity, setQuantity] = useState(1);

	const productImages = [
		"https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?auto=format&fit=crop&w=400&q=80",
		"https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=400&q=80",
		"https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?auto=format&fit=crop&w=400&q=80",
		"https://images.unsplash.com/photo-1528148343865-51218c4a13e6?auto=format&fit=crop&w=400&q=80",
	];

	const colors = [
		{ name: "black", className: "bg-black" },
		{ name: "gray", className: "bg-gray-500" },
		{ name: "blue", className: "bg-blue-500" },
	];

	const sizes = ["XS", "S", "M", "L", "XL"];

	return (
		<section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			{/* Left: Product Images */}
			<div className="flex flex-col items-center">
				<Card className="w-full aspect-[3/2] relative overflow-hidden">
					<Image
						src={productImages[selectedImage]}
						alt="Product image"
						fill
						className="object-cover"
						priority
					/>
				</Card>

				{/* Thumbnails */}
				<div className="grid grid-cols-4 gap-2 mt-4 w-full">
					{productImages.map((img, idx) => (
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
								className="object-cover"
							/>
						</button>
					))}
				</div>
			</div>

			{/* Right: Product Info */}
			<div className="flex flex-col gap-6">
				<div>
					<span className="text-muted-foreground font-medium">Brand Name</span>
					<h1 className="text-2xl font-bold">Premium Cotton T-Shirt</h1>
					<span className="text-xs text-muted-foreground font-medium">
						Category
					</span>
					<p className="text-muted-foreground mt-2">
						Comfortable everyday wear - Lorem ipsum dolor sit amet consectetur
						adipisicing elit. Deleniti non itaque cupiditate assumenda
						necessitatibus quia a eaque? Recusandae aliquid at odit cumque
						asperiores rerum debitis facilis quae quam, repellat voluptate
						quibusdam.
					</p>
					<p className="text-xl font-bold mt-4">PKR 2900.99</p>
				</div>

				<div className="flex flex-wrap shrink-2 justify-start items-center gap-8">
					{/* Color Options */}
					<div className="space-y-2">
						<p className="text-sm font-medium">Color</p>
						<div className="flex gap-2">
							{colors.map((color) => (
								<button
									key={color.name}
									onClick={() => setSelectedColor(color.name)}
									aria-label={color.name}
									className={`w-8 h-8 rounded-full border-2 ${
										selectedColor === color.name
											? "border-foreground"
											: "border-muted-foreground"
									} ${color.className}`}
								/>
							))}
						</div>
					</div>

					{/* Sizes */}
					<div className="space-y-2">
						<p className="text-sm font-medium">Sizes</p>
						<div className="flex gap-2">
							{sizes.map((size) => (
								<Button
									key={size}
									variant={selectedSize === size ? "default" : "outline"}
									size="sm"
									onClick={() => setSelectedSize(size)}
									aria-pressed={selectedSize === size}
								>
									{size}
								</Button>
							))}
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

/**
 * CartProduct Component
 *
 * This component renders a cart item with different layouts for mobile and desktop.
 * It handles product attribute changes (size, color, quantity) and removal.
 *
 * Backend Integration Points:
 * 1. onUpdate callback - sends updated cart item to backend
 * 2. onRemove callback - sends remove request to backend
 * 3. CartItem type - should match your backend cart item schema
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * CartItem Type Definition
 *
 * Backend Integration:
 * - Ensure this matches your backend cart item schema
 * - Add/remove fields as needed for your API
 * - Consider adding fields like: stock, discount, variants, etc.
 */
export type CartItem = {
	id: string; // Backend: Primary key or cart item ID
	brand: string; // Backend: Product brand from product table
	category: string; // Backend: Product category from product table
	title: string; // Backend: Product title/name from product table
	serial: string; // Backend: Product SKU or serial number
	price: number; // Backend: Current price (consider discounts)
	image: string; // Backend: Product image URL
	size: string; // Backend: Selected size variant
	color: string; // Backend: Selected color variant
	quantity: number; // Backend: Quantity in cart
	availableSizes: string[]; // Backend: Available size options for this product
	availableColors: string[]; // Backend: Available color options for this product

	// TODO: Consider adding these fields for backend integration:
	// stock?: number;             // Available stock for selected variant
	// originalPrice?: number;     // Original price before discounts
	// discount?: number;          // Discount percentage
	// weight?: number;            // For shipping calculations
	// variantId?: string;         // Backend variant ID for size/color combination
};

/**
 * Component Props
 *
 * Backend Integration:
 * - item: Cart item data from your backend API
 * - onUpdate: Callback to update cart item in backend (PUT/PATCH request)
 * - onRemove: Callback to remove cart item from backend (DELETE request)
 */
type Props = {
	item: CartItem;
	onUpdate: (updated: CartItem) => void; // Backend: API call to update cart item
	onRemove?: (id: string) => void; // Backend: API call to remove cart item
};

/**
 * CartProduct Component
 *
 * Backend Integration Notes:
 * - This component manages local state and calls backend via props
 * - Consider debouncing onUpdate calls to avoid excessive API requests
 * - Add loading states for better UX during API calls
 * - Add error handling for failed API requests
 */
export default function CartProduct({ item, onUpdate, onRemove }: Props) {
	// Current product state (synced with backend)
	const [selectedSize, setSelectedSize] = React.useState(item.size);
	const [selectedColor, setSelectedColor] = React.useState(item.color);
	const [quantity, setQuantity] = React.useState(item.quantity);

	// Dialog state for mobile edit modal
	const [dialogOpen, setDialogOpen] = React.useState(false);

	// Temporary state for dialog (only applied when user saves)
	// This prevents unnecessary API calls while user is still editing
	const [tempSize, setTempSize] = React.useState(item.size);
	const [tempColor, setTempColor] = React.useState(item.color);
	const [tempQuantity, setTempQuantity] = React.useState(item.quantity);

	// Create a stable reference to the onUpdate callback
	const onUpdateRef = React.useRef(onUpdate);
	React.useEffect(() => {
		onUpdateRef.current = onUpdate;
	}, [onUpdate]);

	// Memoized update function to prevent unnecessary calls
	const updateItem = React.useCallback(() => {
		onUpdateRef.current({
			...item,
			size: selectedSize,
			color: selectedColor,
			quantity,
		});
	}, [item, selectedSize, selectedColor, quantity]);

	/**
	 * Backend Integration: Update cart item
	 *
	 * This effect triggers whenever the user changes size, color, or quantity.
	 * It calls the onUpdate callback which should make an API request to update
	 * the cart item in your backend.
	 *
	 * Consider:
	 * - Adding debouncing to prevent excessive API calls
	 * - Adding loading state during API request
	 * - Adding error handling for failed requests
	 * - Optimistic updates with rollback on failure
	 */
	React.useEffect(() => {
		// Only call onUpdate if the values have actually changed from the initial item
		if (
			selectedSize !== item.size ||
			selectedColor !== item.color ||
			quantity !== item.quantity
		) {
			updateItem();
		}

		// TODO: Add debouncing for backend API calls
		// Example:
		// const timeoutId = setTimeout(() => {
		//   updateItem();
		// }, 500);
		// return () => clearTimeout(timeoutId);
	}, [
		selectedSize,
		selectedColor,
		quantity,
		updateItem,
		item.size,
		item.color,
		item.quantity,
	]);

	/**
	 * Handle saving changes from mobile edit dialog
	 *
	 * Backend Integration:
	 * This function applies the temporary changes and triggers the onUpdate callback.
	 * Consider adding validation before saving (e.g., stock availability).
	 */
	const handleSaveChanges = () => {
		// TODO: Add validation before saving
		// Example: Check if selected variant is in stock
		// if (!isVariantAvailable(tempSize, tempColor, tempQuantity)) {
		//   showError("Selected variant is not available");
		//   return;
		// }

		setSelectedSize(tempSize);
		setSelectedColor(tempColor);
		setQuantity(tempQuantity);
		setDialogOpen(false);
	};

	/**
	 * Handle canceling changes from mobile edit dialog
	 *
	 * Reverts temporary state to current saved state
	 */
	const handleCancelChanges = () => {
		setTempSize(selectedSize);
		setTempColor(selectedColor);
		setTempQuantity(quantity);
		setDialogOpen(false);
	};

	/**
	 * Sync temporary state when dialog opens
	 *
	 * Ensures the dialog shows current values when opened
	 */
	React.useEffect(() => {
		if (dialogOpen) {
			setTempSize(selectedSize);
			setTempColor(selectedColor);
			setTempQuantity(quantity);
		}
	}, [dialogOpen, selectedSize, selectedColor, quantity]);

	return (
		<Card className="rounded-lg border border-border bg-card overflow-hidden py-0">
			{/* Mobile Layout (Minimalist) */}
			<div className="block sm:hidden">
				<CardContent className="p-3">
					<div className="flex gap-3">
						{/* Mobile Image */}
						<div className="flex items-center justify-center flex-shrink-0">
							<Link
								href={`/product/${item.id}`}
								className="relative block  w-20 h-20 overflow-hidden rounded-md"
							>
								<Image
									src={item.image}
									alt={item.title}
									fill
									sizes="size-[120px]"
									className="object-cover"
									priority={false}
								/>
							</Link>
						</div>

						{/* Mobile Content */}
						<div className="flex-1 min-w-0">
							{/* Title */}
							<Link
								href={`/product/${item.id}`}
								className="text-sm font-medium text-foreground hover:underline line-clamp-2 leading-tight"
							>
								{item.title}
							</Link>

							{/* Price and Brand */}
							<div className="flex flex-col items-start justify-between mt-1">
								<p className="text-xs text-muted-foreground">
									Serial:{" "}
									<span className=" whitespace-nowrap">{item.serial}</span>
								</p>
								<p className="mt-1 text-sm font-bold text-foreground">
									${item.price.toFixed(2)}
								</p>
							</div>

							{/* Selected attributes */}
							<div className="flex flex-col items-start  mt-1 text-xs text-muted-foreground">
								<span>Size: {selectedSize}</span>
								<span>Color: {selectedColor}</span>
								<span>Quantity: {quantity}</span>
							</div>
						</div>

						<div className="flex flex-col items-center justify-between ml-3 pl-3 border-l border-border">
							{/* Mobile Edit Options */}
							<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="text-xs px-2 py-1 h-auto flex items-center gap-1"
									>
										<Edit3 className="h-3 w-3" />
										Edit
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>Edit Product Options</DialogTitle>
									</DialogHeader>

									<div className="space-y-6 py-4">
										{/* Product Info */}
										<div className="flex gap-3">
											<div className="relative w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
												<Image
													src={item.image}
													alt={item.title}
													fill
													sizes="64px"
													className="object-cover"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="font-medium text-sm line-clamp-2 leading-tight">
													{item.title}
												</h4>
												<p className="text-xs text-muted-foreground mt-1">
													{item.brand} • ${item.price.toFixed(2)}
												</p>
											</div>
										</div>

										<Separator />

										{/* Size Selection */}
										<div className="space-y-3">
											<Label className="text-sm font-medium">Size</Label>
											<div className="flex flex-wrap gap-2">
												{item.availableSizes.map((size) => (
													<Button
														key={size}
														variant={tempSize === size ? "default" : "outline"}
														size="sm"
														className="px-3 py-1 text-xs h-auto"
														onClick={() => setTempSize(size)}
													>
														{size}
													</Button>
												))}
											</div>
										</div>

										{/* Color Selection */}
										<div className="space-y-3">
											<Label className="text-sm font-medium">Color</Label>
											<div className="flex flex-wrap gap-2">
												{item.availableColors.map((color) => (
													<Button
														key={color}
														variant={
															tempColor === color ? "default" : "outline"
														}
														size="sm"
														className="px-3 py-1 text-xs h-auto"
														onClick={() => setTempColor(color)}
													>
														{color}
													</Button>
												))}
											</div>
										</div>

										{/* Quantity Selection */}
										<div className="space-y-3">
											<Label className="text-sm font-medium">Quantity</Label>
											<div className="flex items-center gap-3">
												<Button
													variant="outline"
													size="icon"
													onClick={() =>
														setTempQuantity((q) => Math.max(1, q - 1))
													}
													disabled={tempQuantity <= 1}
													className="h-8 w-8"
												>
													<Minus className="h-4 w-4" />
												</Button>
												<span className="text-base font-medium w-8 text-center">
													{tempQuantity}
												</span>
												<Button
													variant="outline"
													size="icon"
													onClick={() => setTempQuantity((q) => q + 1)}
													className="h-8 w-8"
												>
													<Plus className="h-4 w-4" />
												</Button>
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex gap-2 pt-4">
											<Button
												variant="outline"
												size="sm"
												onClick={handleCancelChanges}
												className="flex-1"
											>
												Cancel
											</Button>
											<Button
												size="sm"
												onClick={handleSaveChanges}
												className="flex-1"
											>
												Save Changes
											</Button>
										</div>
									</div>
								</DialogContent>
							</Dialog>

							{/* Mobile Remove Button */}
							{onRemove && (
								<Button
									variant="ghost"
									size="sm"
									aria-label="Remove item"
									onClick={() => onRemove(item.id)}
									className="text-destructive hover:text-destructive h-8 w-8 p-0"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</div>

			{/* Desktop/Tablet Layout */}
			<div className="hidden sm:block">
				<CardContent className="flex gap-4 p-4">
					{/* Desktop Image */}
					<div className="w-24 md:w-32 lg:w-36 flex items-center justify-center flex-shrink-0">
						<Link
							href={`/product/${item.id}`}
							className="relative block w-full aspect-square overflow-hidden rounded-lg"
						>
							<Image
								src={item.image}
								alt={item.title}
								fill
								sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 144px"
								className="object-cover transition-transform duration-200 hover:scale-105"
								priority={false}
							/>
						</Link>
					</div>

					{/* Desktop Product Details */}
					<div className="flex-1 min-w-0">
						{/* Brand / Category */}
						<p className="text-sm text-muted-foreground mb-1">
							{item.brand} • {item.category}
						</p>

						{/* Title */}
						<Link
							href={`/product/${item.id}`}
							className="text-foreground font-semibold text-lg hover:underline line-clamp-2 leading-tight"
						>
							{item.title}
						</Link>

						{/* Serial */}
						<p className="text-xs text-muted-foreground mt-1">
							Serial: {item.serial}
						</p>

						{/* Price */}
						<p className="text-foreground font-bold text-xl mt-2">
							${item.price.toFixed(2)}
						</p>

						{/* Attributes */}
						<div className="flex flex-wrap gap-4 mt-4">
							{/* Sizes */}
							<div className="space-y-2">
								<span className="text-sm font-medium text-foreground">
									Size:
								</span>
								<div className="flex gap-1">
									{item.availableSizes.map((size) => (
										<Button
											key={size}
											variant={selectedSize === size ? "default" : "outline"}
											size="sm"
											className="px-3 py-1 text-xs h-auto"
											onClick={() => setSelectedSize(size)}
											aria-pressed={selectedSize === size}
										>
											{size}
										</Button>
									))}
								</div>
							</div>

							{/* Colors */}
							<div className="space-y-2">
								<span className="text-sm font-medium text-foreground">
									Color:
								</span>
								<div className="flex gap-1">
									{item.availableColors.map((color) => (
										<Button
											key={color}
											variant={selectedColor === color ? "default" : "outline"}
											size="sm"
											className="px-3 py-1 text-xs h-auto"
											onClick={() => setSelectedColor(color)}
											aria-pressed={selectedColor === color}
										>
											{color}
										</Button>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Desktop Quantity + Actions */}
					<div className="flex flex-col items-end justify-between space-y-4">
						{/* Quantity Controls */}
						<div className="space-y-2">
							<p className=" text-sm font-medium text-muted-foreground text-center">
								Quantity
							</p>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="icon"
									aria-label="Decrease quantity"
									onClick={() => setQuantity((q) => Math.max(1, q - 1))}
									disabled={quantity <= 1}
									className="h-8 w-8"
								>
									<Minus className="h-4 w-4" />
								</Button>
								<span className="text-lg font-medium w-8 text-center">
									{quantity}
								</span>
								<Button
									variant="outline"
									size="icon"
									aria-label="Increase quantity"
									onClick={() => setQuantity((q) => q + 1)}
									className="h-8 w-8"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Remove Button */}
						{onRemove && (
							<Button
								variant="ghost"
								size="icon"
								aria-label="Remove item"
								onClick={() => onRemove(item.id)}
								className="text-destructive hover:text-destructive hover:bg-destructive/10"
							>
								<Trash2 className="h-5 w-5" />
							</Button>
						)}
					</div>
				</CardContent>
			</div>
		</Card>
	);
}

"use client";

import * as React from "react";
import CartProduct, { CartItem } from "@/components/cart/CartProduct";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IoReturnDownBack } from "react-icons/io5";
import { Tag, Truck, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { AiOutlineProduct } from "react-icons/ai";
import { useRouter } from "next/navigation";

const initialCart: CartItem[] = [
	{
		id: "1",
		brand: "Nike",
		category: "Shoes",
		title: "Air Max 270",
		serial: "NK-AM270-BLK-42",
		price: 149.99,
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCYfLnNtUK3niGDaqyXt2bBpGPm8lfkcRALHWgn38KiiqHHimvEjf20nXyWhLxLJ-hyrC3yka2F8uFbiBrqDc4eII2ONRzAjyx851fBoZqZV74SOsLrq2VIQahgVJndX1LR5cADBKaPdusZX9p4xhg2qSDgJi5pwmj62bmyrd9eqeY1OU_BehGgDEYBhJGNVwltNQ44Mskl5wJedTVwGMQMsqNEim5N-OQ9k1EbP8OxiTLohkJJ65Bk0BvlsrNXcCNwHZgiZjp2JU4",
		size: "42",
		color: "Black",
		quantity: 1,
		availableSizes: ["40", "41", "42", "43", "44"],
		availableColors: ["Black", "White", "Red"],
	},
	{
		id: "2",
		brand: "Adidas",
		category: "T-Shirts",
		title: "Adidas Originals Tee",
		serial: "AD-ORIG-TS-WHT-M",
		price: 34.99,
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBZ15DvJNMcLKUAzSEe91NbM92Q_SYL5Pj0NdlhkodojRWwP_eiZQ-ez6eUHTz2_j4nLayr0YrEgUGx45Lce9BBALsiWcXMDfMJW_2c9wokpf_llMvjebfIJtqEDyJ03_cuJmc2JyBKHJ6gR7i9lSsunZ00qn-09H9WhVsguvJIGoY7QgIaCgjpoVA0GSsbGT_ll9sUzQZCDOzktW3dCOGvDSvOlJsUBPgn_dLI4JfQhB9WDRAND0ua49jYLrAFb8FAFMNE52Fb2LQ",
		size: "M",
		color: "White",
		quantity: 2,
		availableSizes: ["S", "M", "L", "XL"],
		availableColors: ["White", "Black", "Blue"],
	},
	{
		id: "3",
		brand: "Adidas",
		category: "T-Shirts",
		title: "Adidas Originals Tee",
		serial: "AD-ORIG-TS-WHT-M",
		price: 34.99,
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBZ15DvJNMcLKUAzSEe91NbM92Q_SYL5Pj0NdlhkodojRWwP_eiZQ-ez6eUHTz2_j4nLayr0YrEgUGx45Lce9BBALsiWcXMDfMJW_2c9wokpf_llMvjebfIJtqEDyJ03_cuJmc2JyBKHJ6gR7i9lSsunZ00qn-09H9WhVsguvJIGoY7QgIaCgjpoVA0GSsbGT_ll9sUzQZCDOzktW3dCOGvDSvOlJsUBPgn_dLI4JfQhB9WDRAND0ua49jYLrAFb8FAFMNE52Fb2LQ",
		size: "M",
		color: "White",
		quantity: 2,
		availableSizes: ["S", "M", "L", "XL"],
		availableColors: ["White", "Black", "Blue"],
	},
];

export default function CartPage() {
	const router = useRouter();
	const [cart, setCart] = React.useState<CartItem[]>(initialCart);
	const [coupon, setCoupon] = React.useState("");
	const [discount, setDiscount] = React.useState(0);

	const handleUpdateItem = (updated: CartItem) => {
		setCart((prev) =>
			prev.map((item) => (item.id === updated.id ? updated : item))
		);
	};

	const handleRemoveItem = (id: string) => {
		setCart((prev) => prev.filter((item) => item.id !== id));
	};

	const handleApplyCoupon = () => {
		if (coupon.toLowerCase() === "save10") {
			setDiscount(0.1);
		} else {
			setDiscount(0);
			alert("Invalid coupon code");
		}
	};

	// Totals
	const subtotal = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const discountAmount = subtotal * discount;
	const gst = subtotal * 0.07; // 7% GST
	const shipping = subtotal > 100 ? 0 : 5.99;
	const total = subtotal - discountAmount + gst + shipping;

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Cart Items */}
					<div className="flex-1 space-y-6">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold text-foreground">
								Shopping Cart
							</h1>
							<p className="text-muted-foreground">
								{cart.length} {cart.length === 1 ? "item" : "items"} in your
								cart
							</p>
						</div>

						<div className="space-y-4">
							{cart.length > 0 ? (
								cart.map((item) => (
									<CartProduct
										key={item.id}
										item={item}
										onUpdate={handleUpdateItem}
										onRemove={handleRemoveItem}
									/>
								))
							) : (
								<Card className="border-dashed border-2 border-muted">
									<CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
										<div className="rounded-full bg-muted p-4">
											<AiOutlineProduct className="h-8 w-8 text-muted-foreground" />
										</div>
										<div className="space-y-2">
											<h3 className="text-xl font-semibold text-foreground">
												Your cart is empty
											</h3>
											<p className="max-w-md text-sm text-muted-foreground">
												Looks like you haven't added any items to your cart yet.
												Start shopping to fill it up!
											</p>
										</div>
										<Button asChild className="mt-4">
											<Link href="/marketplace">Start Shopping</Link>
										</Button>
									</CardContent>
								</Card>
							)}
						</div>

						{/* Continue Shopping */}
						{cart.length > 0 && (
							<div className="flex justify-center pt-6">
								<Button variant="ghost" asChild className="text-base">
									<Link href="/marketplace" className="flex items-center gap-2">
										<IoReturnDownBack className="h-4 w-4" />
										Continue Shopping
									</Link>
								</Button>
							</div>
						)}
					</div>

					{/* Summary */}
					<div className="w-full lg:w-96 sticky top-4 h-fit">
						{/* Free Shipping Notice */}
						{subtotal > 0 && subtotal < 100 && (
							<Card className="mt-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-400 py-2">
								<CardContent className="p-4">
									<div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
										<Truck className="h-4 w-4" />
										<p className="text-sm font-medium">
											Add ${(100 - subtotal).toFixed(2)} more for free shipping!
										</p>
									</div>
								</CardContent>
							</Card>
						)}
						<Card className="mt-2 border border-border bg-card shadow-sm">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-xl">
									<ShoppingBag className="h-5 w-5" />
									Order Summary
								</CardTitle>
							</CardHeader>

							<CardContent className="space-y-4">
								{/* Order Details */}
								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-sm text-muted-foreground">
											Subtotal ({cart.length} items)
										</span>
										<span className="font-medium">${subtotal.toFixed(2)}</span>
									</div>

									{discount > 0 && (
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground flex items-center gap-1">
												Discount
											</span>
											<span className="font-medium text-green-600">
												-${discountAmount.toFixed(2)}
											</span>
										</div>
									)}

									<div className="flex justify-between items-center">
										<span className="text-sm text-muted-foreground">
											Estimated GST
										</span>
										<span className="font-medium">${gst.toFixed(2)}</span>
									</div>

									<div className="flex justify-between items-center">
										<span className="text-sm text-muted-foreground flex items-center gap-1">
											Shipping
										</span>
										<div className="text-right">
											{shipping === 0 ? (
												<Badge variant="secondary" className="text-xs">
													Free
												</Badge>
											) : (
												<span className="font-medium">
													${shipping.toFixed(2)}
												</span>
											)}
										</div>
									</div>
								</div>

								<Separator />

								{/* Coupon Section */}
								<div className="space-y-2">
									<label className="text-sm font-medium text-foreground">
										Promo Code
									</label>
									<div className="flex gap-2">
										<Input
											type="text"
											placeholder="Enter coupon code"
											value={coupon}
											onChange={(e) => setCoupon(e.target.value)}
											className="flex-1"
										/>
										<Button
											onClick={handleApplyCoupon}
											variant="outline"
											size="sm"
											className="px-4"
										>
											Apply
										</Button>
									</div>
									{discount > 0 && (
										<p className="text-xs text-green-600 flex items-center gap-1">
											<Tag className="h-3 w-3" />
											Coupon applied successfully!
										</p>
									)}
								</div>

								<Separator />

								{/* Total */}
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="text-lg font-semibold text-foreground">
											Total
										</span>
										<span className="text-lg font-bold text-foreground">
											${total.toFixed(2)}
										</span>
									</div>
									<p className="text-xs text-muted-foreground">
										Shipping & taxes calculated at checkout
									</p>
								</div>

								{/* Checkout Button */}
								<Button
									className="w-full mt-6 h-11"
									size="lg"
									disabled={cart.length === 0}
									onClick={() => router.push("/cart/checkout")}
								>
									Proceed to Checkout
								</Button>

								{/* Security Notice */}
								<div className="text-center pt-2">
									<p className="text-xs text-muted-foreground">
										🔒 Secure checkout guaranteed
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckoutStepper } from "./CheckoutStepper";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";
import Lottie from "lottie-react";
import OrderSummaryAnimation from "@/public/animations/loading_animation.json";
import { IoReceiptOutline, IoTrashOutline } from "react-icons/io5";
import Image from "next/image";

interface OrderItem {
	id: string;
	name: string;
	quantity: number;
	size: string;
	color: string;
	price: number;
	image: string;
}

interface OrderSummaryData {
	items: OrderItem[];
	subtotal: number;
	shipping: number;
	taxes: number;
	discount: number;
	total: number;
}

interface OrderSummaryProps {
	onNext: (data: OrderSummaryData) => void;
	onBack: () => void;
	initialData?: Partial<OrderSummaryData>;
}

// Mock data - replace with actual cart data
const mockOrderData: OrderSummaryData = {
	items: [
		{
			id: "1",
			name: "Classic Cotton T-Shirt",
			quantity: 1,
			size: "M",
			color: "Navy",
			price: 25.0,
			image:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuBJct15NjtC7GnuWGs31P-GjM3RU_c0tx3XdHW8aD9vvdsIGOIk_19CS3cYwAp0BScO6LFBxIYngHfCrxvhdR6FmbvJMVM2LQcQ7BywhHcnTGKIHc1pLSaqxTcLYErqJr0m_IMWqWfJGaAp5_pYz1jj1ysA83xNL19_XymW1A618p67DDfRPi4y9AKXPIiL6npfsj1rJ-N7tlvIV8MWPAYj3TtjXNFcKcOd3n0WTn8cVfdCVX94oneNd08N1A86HL_6SEVEKydktCA",
		},
		{
			id: "2",
			name: "Slim Fit Jeans",
			quantity: 1,
			size: "32",
			color: "Black",
			price: 60.0,
			image:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuAF3kKwNGqjIXDFNLTi6gIRt4pnbLAUBlR06daToQo8vH8vvsw6DKTVqKYu5ZsFaA7BQKWwrs_bhDE5NKx_FMkfm5a-lpGujIls5BGXi51oV4kzl-YRJ_wcBtHnzZlWrY_HK2UJ6cVnkCUMdVE0cCuNq0ew_vtXNyvMb8gimT39ffu1RbL9G8t_Bvo9q_lNpeZYZ_HBwVtk248NtTTpJhUaM1bJmawl-wGlmZvYl8xhTGMpRF_sqzvHULs2UXj7xQYGQTPvw45vzOg",
		},
		{
			id: "3",
			name: "Canvas Sneakers",
			quantity: 1,
			size: "9",
			color: "White",
			price: 45.0,
			image:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuA5GUDimNc__gaofXApd5GInHgTIf7PSZ9RPw9B--3fulyet8mMWkd6VIwVlPcdhHzsH9oQEJxUJ6xiKwlci7D4n6lUYOGGEcTq1dMBBLrOqtdvqZVJBAiOiYcpeS1z-KbmAlfgyLt7lid0lqhNs7GEJljlEPbPDVJYmaAfCKpXnyU3lxeC3q22ukWdZCW_3SdIj5qCWE9wWa07BFGXRrptZZt2IhBesRSPVhwC5Ni4kKaHVBt8KvD6dlazThuJqRZ-S34beTSzBJ8",
		},
	],
	subtotal: 130.0,
	shipping: 5.0,
	taxes: 10.0,
	discount: 10.0,
	total: 135.0,
};

export function OrderSummary({
	onNext,
	onBack,
	initialData,
}: OrderSummaryProps) {
	// State for managing order items and calculations
	const [orderItems, setOrderItems] = useState<OrderItem[]>(
		mockOrderData.items
	);
	const [orderData, setOrderData] = useState<OrderSummaryData>(() => {
		const mergedData = { ...mockOrderData, ...initialData };
		return mergedData;
	});

	// Calculate totals whenever items change
	useEffect(() => {
		const subtotal = orderItems.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		);
		const shipping = orderItems.length > 0 ? 5.0 : 0; // Free shipping if no items
		const taxes = subtotal * 0.08; // 8% tax rate
		const discount = subtotal > 100 ? 10.0 : 0; // $10 discount for orders over $100
		const total = subtotal + shipping + taxes - discount;

		setOrderData((prev) => ({
			...prev,
			items: orderItems,
			subtotal,
			shipping,
			taxes,
			discount,
			total,
		}));
	}, [orderItems]);

	const handleRemoveItem = (itemId: string) => {
		setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
	};

	const handleSubmit = () => {
		onNext(orderData);
	};

	const formatPrice = (price: number) => {
		return `$${price.toFixed(2)}`;
	};

	return (
		<div className="px-4 sm:px-8 lg:px-16 xl:px-40 max-w-full flex flex-col lg:flex-row gap-8 justify-center py-5">
			<div className="layout-content-container flex flex-col w-full max-w-lg py-5 flex-1">
				{/* Breadcrumb */}
				<Breadcrumb className="px-4">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/marketplace">Marketplace</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Checkout</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				{/* Checkout Stepper */}
				<CheckoutStepper
					currentStep={3}
					totalSteps={4}
					stepTitles={[
						"Shipping Info",
						"Shipping & Payment",
						"Order Summary",
						"Review & Place Order",
					]}
				/>

				{/* Order Summary Title */}
				<div className="flex flex-wrap justify-between gap-3 px-4 py-4">
					<h1 className="text-foreground tracking-tight text-2xl sm:text-3xl font-bold leading-tight min-w-72">
						Order Summary
					</h1>
				</div>

				{/* Items Section */}
				<div className="space-y-4">
					<div className="flex justify-between items-center px-4 pb-2 pt-4">
						<h3 className="text-foreground text-lg font-bold leading-tight tracking-tight">
							Items
						</h3>
						<p className="text-muted-foreground text-sm">
							{orderItems.length} {orderItems.length === 1 ? "item" : "items"}
						</p>
					</div>

					{orderItems.length === 0 ? (
						<div className="text-center py-8 px-4">
							<p className="text-muted-foreground text-base">
								No items in your order
							</p>
							<Button variant="outline" onClick={onBack} className="mt-4">
								Back to Payment
							</Button>
						</div>
					) : (
						<div className="space-y-3">
							{orderItems.map((item) => (
								<div
									key={item.id}
									className="flex gap-4 bg-card border border-border rounded-lg px-4 py-3 mx-4 group"
								>
									<div className="flex items-start gap-4 flex-1">
										<div className="relative bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[70px] overflow-hidden">
											<Image
												src={item.image}
												alt={item.name}
												fill
												className="object-cover"
												sizes="70px"
											/>
										</div>
										<div className="flex flex-1 flex-col justify-center">
											<p className="text-foreground text-base font-medium leading-normal">
												{item.name}
											</p>
											<p className="text-muted-foreground text-sm font-normal leading-normal">
												Quantity: {item.quantity}
											</p>
											<p className="text-muted-foreground text-sm font-normal leading-normal">
												Size: {item.size}, Color: {item.color}
											</p>
										</div>
									</div>
									<div className="shrink-0 flex items-center gap-3">
										<p className="text-foreground text-base font-semibold leading-normal">
											{formatPrice(item.price * item.quantity)}
										</p>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemoveItem(item.id)}
											className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<IoTrashOutline className="h-4 w-4" />
											<span className="sr-only">Remove item</span>
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Cost Breakdown Section */}
				<div className="mt-6">
					<h3 className="text-foreground text-lg font-bold leading-tight tracking-tight px-4 pb-2 pt-4">
						Cost Breakdown
					</h3>

					<div className="bg-card border border-border rounded-lg mx-4 p-4 space-y-3">
						<div className="flex justify-between gap-x-6 py-2">
							<p className="text-muted-foreground text-sm font-normal leading-normal">
								Subtotal
							</p>
							<p className="text-foreground text-sm font-normal leading-normal text-right">
								{formatPrice(orderData.subtotal)}
							</p>
						</div>

						<div className="flex justify-between gap-x-6 py-2">
							<p className="text-muted-foreground text-sm font-normal leading-normal">
								Shipping
							</p>
							<p className="text-foreground text-sm font-normal leading-normal text-right">
								{formatPrice(orderData.shipping)}
							</p>
						</div>

						<div className="flex justify-between gap-x-6 py-2">
							<p className="text-muted-foreground text-sm font-normal leading-normal">
								Taxes
							</p>
							<p className="text-foreground text-sm font-normal leading-normal text-right">
								{formatPrice(orderData.taxes)}
							</p>
						</div>

						<div className="flex justify-between gap-x-6 py-2">
							<p className="text-muted-foreground text-sm font-normal leading-normal">
								Discount
							</p>
							<p className="text-green-600 dark:text-green-400 text-sm font-normal leading-normal text-right">
								-{formatPrice(orderData.discount)}
							</p>
						</div>

						<div className="border-t border-border pt-3 mt-3">
							<div className="flex justify-between gap-x-6 py-2">
								<p className="text-foreground text-base font-bold leading-normal">
									Total
								</p>
								<p className="text-foreground text-base font-bold leading-normal text-right">
									{formatPrice(orderData.total)}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Navigation Buttons */}
				<div className="flex gap-4 px-4 py-6 mt-4">
					<Button
						type="button"
						variant="outline"
						size="lg"
						onClick={onBack}
						className="flex-1 h-12 lg:h-14 font-bold"
					>
						Back to Payment
					</Button>
					<Button
						type="button"
						size="lg"
						onClick={handleSubmit}
						disabled={orderItems.length === 0}
						className="flex-1 h-12 lg:h-14 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Continue to Review
					</Button>
				</div>
			</div>

			{/* Lottie Animation Section */}
			<div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative">
				<div className="w-full max-w-lg sticky top-20 self-start">
					<div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm border border-border/20 shadow-xl min-h-[600px] flex flex-col justify-center">
						<div className="aspect-square p-8 max-h-[500px]">
							<Lottie
								animationData={OrderSummaryAnimation}
								loop
								className="w-full h-full object-contain"
								style={{
									filter: "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))",
								}}
							/>
						</div>
						{/* Decorative gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
					</div>

					{/* Optional: Add a subtitle for context */}
					<div className="text-center mt-6 px-4">
						<p className="text-muted-foreground text-sm font-medium">
							<IoReceiptOutline className="inline mr-1" />
							Order Summary & Review
						</p>
						<p className="text-xs text-muted-foreground/70 mt-1">
							Please review your order before continuing
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

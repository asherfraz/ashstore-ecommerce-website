"use client";

import React, { useState } from "react";
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
import { IoLockClosedOutline } from "react-icons/io5";
import { OrderProcessingOverlay } from "../common";

interface ReviewOrderItem {
	id: string;
	name: string;
	quantity: number;
	size: string;
	color?: string;
	price: number;
}

interface ShippingAddress {
	fullName: string;
	country: string;
	addressLine: string;
}

interface ShippingMethod {
	name: string;
	estimatedDelivery: string;
	cost: number;
}

interface PaymentMethod {
	type: string;
	lastFourDigits: string;
	cardType?: string;
}

interface ReviewPlaceOrderData {
	shippingAddress: ShippingAddress;
	shippingMethod: ShippingMethod;
	paymentMethod: PaymentMethod;
	items: ReviewOrderItem[];
	subtotal: number;
	shipping: number;
	taxes: number;
	total: number;
}

interface ReviewPlaceOrderProps {
	onPlaceOrder: (data: ReviewPlaceOrderData) => void;
	onCancel: () => void;
	initialData?: Partial<ReviewPlaceOrderData>;
}

// Mock data - replace with actual data from previous steps
const mockReviewData: ReviewPlaceOrderData = {
	shippingAddress: {
		fullName: "Sophia Carter",
		country: "United States",
		addressLine: "123 Maple Street, Apt 4B, Anytown, CA 91234",
	},
	shippingMethod: {
		name: "Standard Shipping",
		estimatedDelivery: "Mon, Oct 23",
		cost: 5.99,
	},
	paymentMethod: {
		type: "MasterCard",
		lastFourDigits: "4242",
		cardType: "mastercard",
	},
	items: [
		{
			id: "1",
			name: "Classic Cotton T-Shirt",
			quantity: 1,
			size: "M",
			price: 25.0,
		},
		{
			id: "2",
			name: "Slim Fit Jeans",
			quantity: 1,
			size: "32",
			price: 60.0,
		},
		{
			id: "3",
			name: "Leather Sneakers",
			quantity: 1,
			size: "9",
			price: 80.0,
		},
	],
	subtotal: 165.0,
	shipping: 5.99,
	taxes: 12.5,
	total: 183.49,
};

export function ReviewPlaceOrder({
	onPlaceOrder,
	onCancel,
	initialData,
}: ReviewPlaceOrderProps) {
	const reviewData = { ...mockReviewData, ...initialData };
	const [isProcessing, setIsProcessing] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);

	const handlePlaceOrder = () => {
		setIsProcessing(true);

		// Simulate order processing
		setTimeout(() => {
			setIsProcessing(false);
			setShowSuccess(true);
			setShowConfetti(true);

			// Hide confetti after 2 seconds
			setTimeout(() => {
				setShowConfetti(false);
			}, 2000);

			// Call the onPlaceOrder callback after animation
			setTimeout(() => {
				onPlaceOrder(reviewData);
			}, 3000);
		}, 2000);
	};

	const handleOverlayClick = () => {
		if (showSuccess && !showConfetti) {
			onPlaceOrder(reviewData);
			setIsProcessing(false);
			setShowSuccess(false);
			setShowConfetti(false);
		}
	};

	const formatPrice = (price: number) => {
		return `$${price.toFixed(2)}`;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-4 sm:px-8 lg:px-16 xl:px-40 max-w-full flex flex-1 justify-center py-8 relative">
			{/* Main Content */}
			<div
				className={`layout-content-container flex flex-col max-w-full w-[600px] py-6 flex-1 transition-all duration-300 ${
					isProcessing || showSuccess ? "blur-sm" : ""
				}`}
			>
				{/* Breadcrumb */}
				<Breadcrumb className="px-4 mb-4">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								href="/marketplace"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Marketplace
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink
								href="/cart"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Cart
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className="text-foreground font-medium">
								Checkout
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				{/* Checkout Stepper */}
				<div className="mb-8">
					<CheckoutStepper
						currentStep={4}
						totalSteps={4}
						stepTitles={[
							"Shipping Info",
							"Shipping & Payment",
							"Order Summary",
							"Review & Place Order",
						]}
					/>
				</div>

				{/* Page Title */}
				<div className="text-center mb-8 px-6">
					<h1 className="text-foreground tracking-tight text-3xl sm:text-4xl font-bold leading-tight mb-2">
						Review & Place Order
					</h1>
					<p className="text-muted-foreground text-lg">
						Please review your order details before confirming
					</p>
				</div>

				{/* Main Content Card */}
				<div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg mx-4 sm:mx-6 overflow-hidden">
					{/* Shipping Address */}
					<div className="p-6 border-b border-border/50">
						<h3 className="text-foreground text-lg font-bold leading-tight tracking-tight mb-4 flex items-center gap-2">
							<div className="w-2 h-2 bg-primary rounded-full"></div>
							Shipping Address
						</h3>
						<div className="bg-background/80 border border-border/30 rounded-xl p-5">
							<div className="flex flex-1 flex-col justify-center">
								<p className="text-foreground text-base font-semibold leading-normal mb-1">
									{reviewData.shippingAddress.fullName}
								</p>
								<p className="text-muted-foreground text-sm font-medium leading-normal mb-1">
									{reviewData.shippingAddress.country}
								</p>
								<p className="text-muted-foreground text-sm font-normal leading-relaxed">
									{reviewData.shippingAddress.addressLine}
								</p>
							</div>
						</div>
					</div>

					{/* Shipping Method */}
					<div className="p-6 border-b border-border/50">
						<h3 className="text-foreground text-lg font-bold leading-tight tracking-tight mb-4 flex items-center gap-2">
							<div className="w-2 h-2 bg-primary rounded-full"></div>
							Shipping Method
						</h3>
						<div className="flex items-center gap-4 bg-background/80 border border-border/30 rounded-xl p-5 justify-between">
							<div className="flex flex-col justify-center">
								<p className="text-foreground text-base font-semibold leading-normal line-clamp-1 mb-1">
									{reviewData.shippingMethod.name}
								</p>
								<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
									Arrives by {reviewData.shippingMethod.estimatedDelivery}
								</p>
							</div>
							<div className="shrink-0">
								<p className="text-foreground text-base font-bold leading-normal">
									{formatPrice(reviewData.shippingMethod.cost)}
								</p>
							</div>
						</div>
					</div>

					{/* Payment Method */}
					<div className="p-6 border-b border-border/50">
						<h3 className="text-foreground text-lg font-bold leading-tight tracking-tight mb-4 flex items-center gap-2">
							<div className="w-2 h-2 bg-primary rounded-full"></div>
							Payment Method
						</h3>
						<div className="flex items-center gap-4 bg-background/80 border border-border/30 rounded-xl p-5">
							<div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 aspect-video bg-contain h-8 w-16 px-3 shrink-0 rounded-lg flex items-center justify-center">
								<span className="text-xs font-bold text-primary">
									{reviewData.paymentMethod.cardType?.toUpperCase() || "CARD"}
								</span>
							</div>
							<p className="text-foreground text-base font-medium leading-normal flex-1 truncate">
								{reviewData.paymentMethod.type} ••••{" "}
								{reviewData.paymentMethod.lastFourDigits}
							</p>
						</div>
					</div>

					{/* Order Summary */}
					<div className="p-6">
						<h3 className="text-foreground text-lg font-bold leading-tight tracking-tight mb-4 flex items-center gap-2">
							<div className="w-2 h-2 bg-primary rounded-full"></div>
							Order Summary
						</h3>

						{/* Order Items */}
						<div className="space-y-0 mb-6">
							{reviewData.items.map((item, index) => (
								<div
									key={item.id}
									className={`flex items-center gap-4 bg-background/40 border-border/30 px-5 min-h-[72px] py-3 justify-between transition-colors hover:bg-background/60 ${
										index === 0
											? "border-t border-x rounded-t-xl"
											: index === reviewData.items.length - 1
											? "border-b border-x rounded-b-xl"
											: "border-x border-b"
									}`}
								>
									<div className="flex flex-col justify-center">
										<p className="text-foreground text-base font-semibold leading-normal line-clamp-1 mb-1">
											{item.name} × {item.quantity}
										</p>
										<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
											Size: {item.size}
											{item.color && `, Color: ${item.color}`}
										</p>
									</div>
									<div className="shrink-0">
										<p className="text-foreground text-base font-bold leading-normal">
											{formatPrice(item.price * item.quantity)}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Cost Breakdown */}
						<div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-5 space-y-0">
							<div className="flex items-center gap-4 px-0 min-h-12 justify-between border-b border-border/30 pb-3 mb-3">
								<p className="text-muted-foreground text-base font-medium leading-normal flex-1 truncate">
									Shipping
								</p>
								<div className="shrink-0">
									<p className="text-foreground text-base font-bold leading-normal">
										{formatPrice(reviewData.shipping)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4 px-0 min-h-12 justify-between border-b border-border/30 pb-3 mb-3">
								<p className="text-muted-foreground text-base font-medium leading-normal flex-1 truncate">
									Estimated Tax
								</p>
								<div className="shrink-0">
									<p className="text-foreground text-base font-semibold leading-normal">
										{formatPrice(reviewData.taxes)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4 px-0 min-h-14 justify-between pt-2">
								<p className="text-foreground text-lg font-bold leading-normal flex-1 truncate">
									Total
								</p>
								<div className="shrink-0">
									<p className="text-primary text-2xl font-bold leading-normal">
										{formatPrice(reviewData.total)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4 px-6 py-8 mt-6">
					<Button
						type="button"
						variant="outline"
						size="lg"
						onClick={onCancel}
						className="flex-1 h-14 font-bold text-base border-2 hover:bg-muted/50 transition-all duration-200"
					>
						Cancel Order
					</Button>
					<Button
						type="button"
						size="lg"
						onClick={handlePlaceOrder}
						disabled={isProcessing || showSuccess}
						className="flex-1 h-14 font-bold gap-3 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
					>
						<IoLockClosedOutline className="h-5 w-5" />
						<span className="truncate">
							{isProcessing ? "Processing..." : "Place Order Securely"}
						</span>
					</Button>
				</div>
			</div>

			{/* Order Processing Overlay */}
			<OrderProcessingOverlay
				isProcessing={isProcessing}
				showSuccess={showSuccess}
				showConfetti={showConfetti}
				onOverlayClick={handleOverlayClick}
			/>
		</div>
	);
}

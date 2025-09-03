"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OrderProcessingOverlay } from "@/components/common";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface OrderItem {
	id: string;
	name: string;
	size: string;
	image: string;
}

interface OrderDetails {
	orderNumber: string;
	orderDate: string;
	total: string;
	paymentMethod: string;
	shippingAddress: string;
	estimatedDelivery: string;
	items: OrderItem[];
}

// Mock order data
const mockOrderData: OrderDetails = {
	orderNumber: "#123456789",
	orderDate: "July 26, 2024",
	total: "$125.00",
	paymentMethod: "Credit Card",
	shippingAddress: "123 Maple Street, Anytown, CA 91234",
	estimatedDelivery: "July 30, 2024",
	items: [
		{
			id: "1",
			name: "Classic White T-Shirt",
			size: "Size M",
			image:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuAT_o7nyTIg0ysrv7TXxGarNq9rzgCkEg-UbwEB2wCFVFGpbftN73jbymBF4P-kOmrGC15nbnBGD4rKXQLyJLtFT1VdZ4w8NRPEXNXIvaDOwFuA_I3gvLLSNpoW_hfbr1zwM3YxLCm8ywj1N8c8AwBVoOqBBPKSzT4-K-_TRJTY3XCeX4nJ5H6wC8q3Z3cIocFDZZWXmWhSR-VF2zEGYjRqEUx682J15bDodMC-EzpVmdveq4K0NBaehBo3PkBKUkEj0Q8Vvi7uqno",
		},
		{
			id: "2",
			name: "Blue Denim Jeans",
			size: "Size 8",
			image:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuDFfnvTulUKFbbRZ-yMeeHzctEL7vXIpVL15P_Fm4_FBb5EURsoF1sD-qlR5d-iF6SYXBb7YfDwS0RT6H__Jd8dukmuXi4mBnyzhaipaiJWLvMPwD1_7WJM_YUzdNZ0434n2IYCkOlYPMvDFA2iNPlipv4VgqA8je0vunrN4wD9oRMMlgta7swPXYeWGcIGOunZjMaebtqwo3dTTqsug1Z2Eg-lGmbILoAPXhtoPLqX8hYGoFV1Seq8VeT_PdnACs_1YUqfBqbKekQ",
		},
		{
			id: "3",
			name: "Black Baseball Cap",
			size: "One Size",
			image:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuDTH1TiGtZ4BlI2qfvUQC34lC4wnRmfoCx8lBS_Meoe9sxXqQ7N-nFPkENRl9N174vrR_gIAWAKb-xe2HMxMGOG2s-To8wlV44QoQwxpmPxdG3CI_4552OuqysJCZ8EXO98pTBIsH_zrPGkZe_OXWJCQ30FrC5xiZIuxWdF4Bd96BX6l6EfW2bY8vKOz_Zp4K1WaoDtp32Gb-ZOIRHKnsJgBh4AFhiIeK8hV_ci5qPNrjjlscXInOb6K6NikYhuKssz9912nrECMy4",
		},
	],
};

// interface OrderConfirmationPageProps {
// 	params: {
// 		orderId: string;
// 	};
// }

// export default function OrderConfirmationPage({
// 	params,
// }: OrderConfirmationPageProps) {
export default function OrderConfirmationPage() {
	const router = useRouter();
	const { orderId } = useParams();

	const [showCelebration, setShowCelebration] = useState(true);
	const [showConfetti, setShowConfetti] = useState(true);
	const [orderData, setOrderData] = useState<OrderDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Fetch order data based on orderId
		const fetchOrderData = async () => {
			try {
				setIsLoading(true);
				// Replace with actual API call
				// const response = await fetch(`/api/orders/${orderId}`);
				// const data = await response.json();

				// For now, simulate API call with mock data
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Update mock data with the actual orderId
				const fetchedOrderData = {
					...mockOrderData,
					orderNumber: `#${orderId}`,
				};

				setOrderData(fetchedOrderData);
			} catch (err) {
				setError("Failed to load order details. Please try again.");
				console.error("Error fetching order:", err);
			} finally {
				setIsLoading(false);
			}
		};

		if (orderId) {
			fetchOrderData();
		}
	}, [orderId]);

	useEffect(() => {
		// Only show celebration if order data is loaded successfully
		if (!isLoading && orderData && !error) {
			// Show confetti for 3 seconds on page load
			const confettiTimer = setTimeout(() => {
				setShowConfetti(false);
			}, 3000);

			// Hide the entire celebration overlay after 5 seconds
			const celebrationTimer = setTimeout(() => {
				setShowCelebration(false);
			}, 5000);

			return () => {
				clearTimeout(confettiTimer);
				clearTimeout(celebrationTimer);
			};
		}
	}, [isLoading, orderData, error]);

	const handleOverlayClick = () => {
		if (!showConfetti) {
			setShowCelebration(false);
		}
	};

	const handleViewMyOrders = () => {
		// Navigate to user's orders page
		router.push("/account/orders");
	};

	const handleContinueShopping = () => {
		// Navigate back to marketplace
		router.push("/marketplace");
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-foreground text-lg font-medium">
						Loading order details...
					</p>
					<p className="text-muted-foreground text-sm">Order ID: {orderId}</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !orderData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-4">
					<div className="text-destructive text-6xl mb-4">⚠️</div>
					<h2 className="text-foreground text-2xl font-bold mb-2">
						Order Not Found
					</h2>
					<p className="text-muted-foreground mb-6">
						{error || `We couldn't find an order with ID: ${orderId}`}
					</p>
					<div className="flex gap-4 justify-center">
						<Button onClick={handleViewMyOrders} variant="outline">
							View My Orders
						</Button>
						<Button onClick={handleContinueShopping}>Continue Shopping</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
			{/* Main Content */}
			<div
				className={`px-4 sm:px-8 lg:px-16 xl:px-40 flex flex-1 justify-center py-8 transition-all duration-300 ${
					showCelebration ? "blur-sm" : ""
				}`}
			>
				<div className="layout-content-container flex flex-col max-w-4xl flex-1">
					{/* Header Section */}
					<div className="text-center mb-8">
						<h2 className="text-foreground tracking-tight text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight px-4 pb-3 pt-5">
							Thank You, Your Order is Confirmed!
						</h2>
						<p className="text-foreground text-base font-normal leading-normal pb-3 pt-1 px-4 max-w-2xl mx-auto">
							Your order has been successfully placed. You will receive an email
							confirmation shortly with all the details.
						</p>
					</div>

					{/* Main Content Card */}
					<div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg mx-4 overflow-hidden">
						{/* Order Summary Section */}
						<div className="p-6 border-b border-border/50">
							<h3 className="text-foreground text-lg font-bold leading-tight tracking-tight mb-6 flex items-center gap-2">
								<div className="w-2 h-2 bg-primary rounded-full"></div>
								Order Summary
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-[minmax(150px,20%)_1fr] gap-x-6 gap-y-1">
								<div className="col-span-full sm:col-span-2 grid grid-cols-subgrid border-t border-border/30 py-4">
									<p className="text-muted-foreground text-sm font-medium leading-normal">
										Order Number
									</p>
									<p className="text-foreground text-sm font-semibold leading-normal">
										{orderData.orderNumber}
									</p>
								</div>
								<div className="col-span-full sm:col-span-2 grid grid-cols-subgrid border-t border-border/30 py-4">
									<p className="text-muted-foreground text-sm font-medium leading-normal">
										Order Date
									</p>
									<p className="text-foreground text-sm font-normal leading-normal">
										{orderData.orderDate}
									</p>
								</div>
								<div className="col-span-full sm:col-span-2 grid grid-cols-subgrid border-t border-border/30 py-4">
									<p className="text-muted-foreground text-sm font-medium leading-normal">
										Total
									</p>
									<p className="text-primary text-base font-bold leading-normal">
										{orderData.total}
									</p>
								</div>
								<div className="col-span-full sm:col-span-2 grid grid-cols-subgrid border-t border-border/30 py-4">
									<p className="text-muted-foreground text-sm font-medium leading-normal">
										Payment Method
									</p>
									<p className="text-foreground text-sm font-normal leading-normal">
										{orderData.paymentMethod}
									</p>
								</div>
							</div>
						</div>

						{/* Shipping Information Section */}
						<div className="p-6 border-b border-border/50">
							<h3 className="text-foreground text-lg font-bold leading-tight tracking-tight mb-6 flex items-center gap-2">
								<div className="w-2 h-2 bg-primary rounded-full"></div>
								Shipping Information
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-[minmax(150px,20%)_1fr] gap-x-6 gap-y-1">
								<div className="col-span-full sm:col-span-2 grid grid-cols-subgrid border-t border-border/30 py-4">
									<p className="text-muted-foreground text-sm font-medium leading-normal">
										Shipping Address
									</p>
									<p className="text-foreground text-sm font-normal leading-normal">
										{orderData.shippingAddress}
									</p>
								</div>
								<div className="col-span-full sm:col-span-2 grid grid-cols-subgrid border-t border-border/30 py-4">
									<p className="text-muted-foreground text-sm font-medium leading-normal">
										Estimated Delivery
									</p>
									<p className="text-foreground text-sm font-normal leading-normal">
										{orderData.estimatedDelivery}
									</p>
								</div>
							</div>
						</div>

						{/* Items Ordered Section */}
						<div className="p-6">
							<h3 className="text-foreground text-lg font-bold leading-tight tracking-tight mb-6 flex items-center gap-2">
								<div className="w-2 h-2 bg-primary rounded-full"></div>
								Items Ordered
							</h3>
							<div className="space-y-3">
								{orderData.items.map((item) => (
									<div
										key={item.id}
										className="flex items-center gap-4 bg-background/40 border border-border/30 rounded-xl px-4 min-h-[72px] py-3 hover:bg-background/60 transition-colors"
									>
										<div className="relative bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14 overflow-hidden">
											<Image
												src={item.image}
												alt={item.name}
												fill
												className="object-cover"
												sizes="56px"
											/>
										</div>
										<div className="flex flex-col justify-center flex-1">
											<p className="text-foreground text-base font-medium leading-normal line-clamp-1">
												{item.name}
											</p>
											<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
												{item.size}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-center mt-8">
						<div className="flex flex-1 gap-4 flex-wrap px-4 py-3 max-w-md justify-center">
							<Button
								onClick={handleViewMyOrders}
								className="flex-1 min-w-[120px] h-12 font-bold text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
							>
								View My Orders
							</Button>
							<Button
								variant="outline"
								onClick={handleContinueShopping}
								className="flex-1 min-w-[120px] h-12 font-bold text-base border-2 hover:bg-muted/50 transition-all duration-200"
							>
								Continue Shopping
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Order Processing Overlay */}
			<OrderProcessingOverlay
				isProcessing={false}
				showSuccess={showCelebration}
				showConfetti={showConfetti}
				onOverlayClick={handleOverlayClick}
			/>
		</div>
	);
}

"use client";

import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import Lottie from "lottie-react";
import ConfettiAnimation from "@/public/animations/Confetti_Animation.json";
import LoadingAnimation from "@/public/animations/loading_animation.json";

interface OrderProcessingOverlayProps {
	isProcessing: boolean;
	showSuccess: boolean;
	showConfetti: boolean;
	onOverlayClick: () => void;
}

export function OrderProcessingOverlay({
	isProcessing,
	showSuccess,
	showConfetti,
	onOverlayClick,
}: OrderProcessingOverlayProps) {
	if (!isProcessing && !showSuccess) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
			onClick={onOverlayClick}
		>
			<div className="relative">
				{/* Processing State - Truck Animation */}
				{isProcessing && (
					<div className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 text-center">
						<div className="w-48 h-48 mx-auto mb-6">
							<Lottie
								animationData={LoadingAnimation}
								loop
								className="w-full h-full"
							/>
						</div>
						<h3 className="text-foreground text-xl font-bold mb-2">
							Processing Your Order
						</h3>
						<p className="text-muted-foreground text-sm">
							Please wait while we process your payment and prepare your
							order...
						</p>
						<div className="flex justify-center mt-4">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
						</div>
					</div>
				)}

				{/* Success State */}
				{showSuccess && (
					<div className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 text-center">
						<div className="w-16 h-16 mx-auto mb-4 text-green-500">
							<IoCheckmarkCircle className="w-full h-full" />
						</div>
						<h3 className="text-foreground text-xl font-bold mb-2">
							Order Placed Successfully!
						</h3>
						<p className="text-muted-foreground text-sm mb-4">
							Your order has been confirmed and you will receive a confirmation
							email shortly.
						</p>
						<p className="text-xs text-muted-foreground">
							{showConfetti
								? "Celebrating your purchase!"
								: "Click anywhere to continue"}
						</p>
					</div>
				)}

				{/* Confetti Animation */}
				{showConfetti && (
					<div className="fixed inset-0 pointer-events-none z-10">
						<Lottie
							animationData={ConfettiAnimation}
							loop={false}
							className="w-full h-full"
						/>
					</div>
				)}
			</div>
		</div>
	);
}

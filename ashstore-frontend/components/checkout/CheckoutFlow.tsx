"use client";

import React, { useState } from "react";
import { ShippingInformation } from "./ShippingInformation";
import { ShippingPayment } from "./ShippingPayment";
import { OrderSummary } from "./OrderSummary";
import { ReviewPlaceOrder } from "./ReviewPlaceOrder";

// Types for all form data
interface ShippingFormData {
	fullName: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	stateProvince: string;
	postalCode: string;
	phoneNumber: string;
}

interface PaymentFormData {
	shippingMethod: "standard" | "express";
	cardNumber: string;
	expirationDate: string;
	cvv: string;
	paymentMethod: "card" | "easypaisa" | "jazzcash";
	phoneNumber: string;
	transactionId: string;
}

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

interface CheckoutData {
	shipping: ShippingFormData | null;
	payment: PaymentFormData | null;
	orderSummary: OrderSummaryData | null;
}

export function CheckoutFlow() {
	const [currentStep, setCurrentStep] = useState(1);
	const [checkoutData, setCheckoutData] = useState<CheckoutData>({
		shipping: null,
		payment: null,
		orderSummary: null,
	});

	const handleShippingNext = (data: ShippingFormData) => {
		setCheckoutData((prev) => ({
			...prev,
			shipping: data,
		}));
		setCurrentStep(2);
	};

	const handlePaymentNext = (data: PaymentFormData) => {
		setCheckoutData((prev) => ({
			...prev,
			payment: data,
		}));
		setCurrentStep(3);
	};

	const handleOrderSummaryNext = (data: OrderSummaryData) => {
		setCheckoutData((prev) => ({
			...prev,
			orderSummary: data,
		}));
		setCurrentStep(4);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handlePlaceOrder = (data: any) => {
		// Handle the final order placement
		console.log("Order placed:", { ...checkoutData, review: data });
		// You can add order submission logic here
		alert("Order placed successfully!");
	};

	const handleCancelOrder = () => {
		// Reset to step 1 or redirect to cart
		setCurrentStep(1);
		setCheckoutData({
			shipping: null,
			payment: null,
			orderSummary: null,
		});
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const renderCurrentStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<ShippingInformation
						onNext={handleShippingNext}
						initialData={checkoutData.shipping || undefined}
					/>
				);
			case 2:
				return (
					<ShippingPayment
						onNext={handlePaymentNext}
						onBack={handleBack}
						initialData={checkoutData.payment || undefined}
					/>
				);
			case 3:
				return (
					<OrderSummary
						onNext={handleOrderSummaryNext}
						onBack={handleBack}
						initialData={checkoutData.orderSummary || undefined}
					/>
				);
			case 4:
				return (
					<ReviewPlaceOrder
						onPlaceOrder={handlePlaceOrder}
						onCancel={handleCancelOrder}
						initialData={{
							shippingAddress: checkoutData.shipping
								? {
										fullName: checkoutData.shipping.fullName,
										country: "Pakistan",
										addressLine: `${checkoutData.shipping.addressLine1}${
											checkoutData.shipping.addressLine2
												? ", " + checkoutData.shipping.addressLine2
												: ""
										}, ${checkoutData.shipping.city}, ${
											checkoutData.shipping.stateProvince
										} ${checkoutData.shipping.postalCode}`,
								  }
								: undefined,
							shippingMethod: checkoutData.payment
								? {
										name:
											checkoutData.payment.shippingMethod === "express"
												? "Express Shipping"
												: "Standard Shipping",
										estimatedDelivery:
											checkoutData.payment.shippingMethod === "express"
												? "Fri, Oct 20"
												: "Mon, Oct 23",
										cost:
											checkoutData.payment.shippingMethod === "express"
												? 12.99
												: 5.99,
								  }
								: undefined,
							paymentMethod: checkoutData.payment
								? {
										type:
											checkoutData.payment.paymentMethod === "card"
												? "MasterCard"
												: checkoutData.payment.paymentMethod === "easypaisa"
												? "EasyPaisa"
												: "JazzCash",
										lastFourDigits:
											checkoutData.payment.paymentMethod === "card"
												? checkoutData.payment.cardNumber.slice(-4)
												: checkoutData.payment.phoneNumber.slice(-4),
										cardType: checkoutData.payment.paymentMethod,
								  }
								: undefined,
							items: checkoutData.orderSummary?.items,
							subtotal: checkoutData.orderSummary?.subtotal,
							shipping: checkoutData.orderSummary?.shipping,
							taxes: checkoutData.orderSummary?.taxes,
							total: checkoutData.orderSummary?.total,
						}}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-background">{renderCurrentStep()}</div>
	);
}

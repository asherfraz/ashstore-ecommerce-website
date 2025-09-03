"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import ShippingPaymentAnimation from "@/public/animations/ShipPayment_animation.json";
import { IoLockClosed } from "react-icons/io5";

interface PaymentFormData {
	shippingMethod: "standard" | "express";
	cardNumber: string;
	expirationDate: string;
	cvv: string;
	paymentMethod: "card" | "easypaisa" | "jazzcash";
	phoneNumber: string;
	transactionId: string;
}

interface ShippingPaymentProps {
	onNext: (data: PaymentFormData) => void;
	onBack: () => void;
	initialData?: Partial<PaymentFormData>;
}

export function ShippingPayment({
	onNext,
	onBack,
	initialData,
}: ShippingPaymentProps) {
	const [formData, setFormData] = useState<PaymentFormData>({
		shippingMethod: initialData?.shippingMethod || "standard",
		cardNumber: initialData?.cardNumber || "",
		expirationDate: initialData?.expirationDate || "",
		cvv: initialData?.cvv || "",
		paymentMethod: initialData?.paymentMethod || "card",
		phoneNumber: initialData?.phoneNumber || "",
		transactionId: initialData?.transactionId || "",
	});

	const handleInputChange =
		(field: keyof PaymentFormData) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));
		};

	const handleShippingMethodChange = (method: "standard" | "express") => {
		setFormData((prev) => ({
			...prev,
			shippingMethod: method,
		}));
	};

	const handlePaymentMethodChange = (
		method: "card" | "easypaisa" | "jazzcash"
	) => {
		setFormData((prev) => ({
			...prev,
			paymentMethod: method,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onNext(formData);
	};

	const isFormValid = () => {
		if (formData.paymentMethod === "card") {
			return formData.cardNumber && formData.expirationDate && formData.cvv;
		} else if (
			formData.paymentMethod === "easypaisa" ||
			formData.paymentMethod === "jazzcash"
		) {
			return formData.phoneNumber && formData.transactionId;
		}
		return true;
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
					currentStep={2}
					totalSteps={4}
					stepTitles={[
						"Shipping Info",
						"Shipping & Payment",
						"Order Summary",
						"Review & Place Order",
					]}
				/>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Shipping Section */}
					<div>
						<h2 className="text-foreground text-xl font-bold leading-tight tracking-tight px-4 pb-3 pt-5">
							Shipping
						</h2>

						<div className="flex flex-col gap-3 px-4">
							{/* Standard Shipping */}
							<label className="flex items-center gap-4 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/50 transition-colors">
								<input
									type="radio"
									name="shipping"
									checked={formData.shippingMethod === "standard"}
									onChange={() => handleShippingMethodChange("standard")}
									className="h-5 w-5 text-primary focus:ring-primary border-border"
								/>
								<div className="flex grow flex-col">
									<p className="text-foreground text-sm font-medium leading-normal">
										Standard
									</p>
									<p className="text-muted-foreground text-sm font-normal leading-normal">
										Delivery in 5-7 business days
									</p>
								</div>
							</label>

							{/* Express Shipping */}
							<label className="flex items-center gap-4 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/50 transition-colors">
								<input
									type="radio"
									name="shipping"
									checked={formData.shippingMethod === "express"}
									onChange={() => handleShippingMethodChange("express")}
									className="h-5 w-5 text-primary focus:ring-primary border-border"
								/>
								<div className="flex grow flex-col">
									<p className="text-foreground text-sm font-medium leading-normal">
										Express
									</p>
									<p className="text-muted-foreground text-sm font-normal leading-normal">
										Delivery in 2-3 business days
									</p>
								</div>
							</label>
						</div>
					</div>

					{/* Payment Section */}
					<div>
						<h2 className="text-foreground text-xl font-bold leading-tight tracking-tight px-4 pb-3 pt-5">
							Payment
						</h2>

						{/* Payment Method Forms */}
						{formData.paymentMethod === "card" && (
							<>
								{/* Card Number */}
								<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
									<div className="flex flex-col min-w-0 flex-1 space-y-2">
										<Label
											htmlFor="cardNumber"
											className="text-foreground text-base font-medium"
										>
											Card Number
										</Label>
										<Input
											id="cardNumber"
											type="text"
											placeholder="Enter card number"
											value={formData.cardNumber}
											onChange={handleInputChange("cardNumber")}
											className="h-12 lg:h-14"
											maxLength={19}
											required
										/>
									</div>
								</div>

								{/* Expiration Date and CVV */}
								<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
									<div className="flex flex-col min-w-0 flex-1 space-y-2">
										<Label
											htmlFor="expirationDate"
											className="text-foreground text-base font-medium"
										>
											Expiration Date
										</Label>
										<Input
											id="expirationDate"
											type="text"
											placeholder="MM/YY"
											value={formData.expirationDate}
											onChange={handleInputChange("expirationDate")}
											className="h-12 lg:h-14"
											maxLength={5}
											required
										/>
									</div>
									<div className="flex flex-col min-w-0 flex-1 space-y-2">
										<Label
											htmlFor="cvv"
											className="text-foreground text-base font-medium"
										>
											CVV
										</Label>
										<Input
											id="cvv"
											type="text"
											placeholder="CVV"
											value={formData.cvv}
											onChange={handleInputChange("cvv")}
											className="h-12 lg:h-14"
											maxLength={4}
											required
										/>
									</div>
								</div>
							</>
						)}

						{/* Easypaisa Payment Form */}
						{formData.paymentMethod === "easypaisa" && (
							<>
								<div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mx-4 mb-4">
									<h3 className="text-green-800 dark:text-green-400 font-medium text-sm mb-2">
										Easypaisa Payment Instructions
									</h3>
									<ol className="text-green-700 dark:text-green-300 text-xs space-y-1">
										<li>1. Dial *786# from your mobile phone</li>
										<li>2. Send money to: 03XX-XXXXXXX</li>
										<li>3. Enter the total amount</li>
										<li>4. Complete the transaction</li>
										<li>5. Enter your phone number and transaction ID below</li>
									</ol>
								</div>

								{/* Phone Number */}
								<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
									<div className="flex flex-col min-w-0 flex-1 space-y-2">
										<Label
											htmlFor="easypaisaPhone"
											className="text-foreground text-base font-medium"
										>
											Your Phone Number
										</Label>
										<Input
											id="easypaisaPhone"
											type="tel"
											placeholder="03XX-XXXXXXX"
											value={formData.phoneNumber}
											onChange={handleInputChange("phoneNumber")}
											className="h-12 lg:h-14"
											maxLength={12}
											required
										/>
									</div>
								</div>

								{/* Transaction ID */}
								<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
									<div className="flex flex-col min-w-0 flex-1 space-y-2">
										<Label
											htmlFor="easypaisaTransaction"
											className="text-foreground text-base font-medium"
										>
											Transaction ID
										</Label>
										<Input
											id="easypaisaTransaction"
											type="text"
											placeholder="Enter transaction ID from SMS"
											value={formData.transactionId}
											onChange={handleInputChange("transactionId")}
											className="h-12 lg:h-14"
											required
										/>
									</div>
								</div>
							</>
						)}

						{/* JazzCash Payment Form */}
						{formData.paymentMethod === "jazzcash" && (
							<>
								<div className="bg-purple-50 dark:bg-[#FCB900]/20 border border-purple-200 dark:border-red-800 rounded-lg p-4 mx-4 mb-4">
									<h3 className="text-red-800 dark:text-red-400 font-medium text-sm mb-2">
										JazzCash Payment Instructions
									</h3>
									<ol className="text-red-700 dark:text-red-300 text-xs space-y-1">
										<li>1. Dial *786# from your Jazz/Warid number</li>
										<li>2. Send money to: 03XX-XXXXXXX</li>
										<li>3. Enter the total amount</li>
										<li>4. Complete the transaction</li>
										<li>5. Enter your phone number and transaction ID below</li>
									</ol>
								</div>

								{/* Phone Number */}
								<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
									<div className="flex flex-col min-w-0 flex-1 space-y-2">
										<Label
											htmlFor="jazzcashPhone"
											className="text-foreground text-base font-medium"
										>
											Your Jazz/Warid Number
										</Label>
										<Input
											id="jazzcashPhone"
											type="tel"
											placeholder="03XX-XXXXXXX"
											value={formData.phoneNumber}
											onChange={handleInputChange("phoneNumber")}
											className="h-12 lg:h-14"
											maxLength={12}
											required
										/>
									</div>
								</div>

								{/* Transaction ID */}
								<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
									<div className="flex flex-col min-w-0 flex-1 space-y-2">
										<Label
											htmlFor="jazzcashTransaction"
											className="text-foreground text-base font-medium"
										>
											Transaction ID
										</Label>
										<Input
											id="jazzcashTransaction"
											type="text"
											placeholder="Enter transaction ID from SMS"
											value={formData.transactionId}
											onChange={handleInputChange("transactionId")}
											className="h-12 lg:h-14"
											required
										/>
									</div>
								</div>
							</>
						)}

						{/* Alternative Payment Methods */}
						<p className="text-muted-foreground text-sm font-normal leading-normal pb-3 pt-4 px-4">
							Choose your payment method
						</p>

						<div className="flex justify-stretch px-4 py-3">
							<div className="flex flex-1 gap-3 flex-wrap justify-start">
								<Button
									type="button"
									variant={
										formData.paymentMethod === "card" ? "default" : "outline"
									}
									size="sm"
									onClick={() => handlePaymentMethodChange("card")}
									className="min-w-[84px]"
								>
									Credit Card
								</Button>
								<Button
									type="button"
									variant={
										formData.paymentMethod === "easypaisa"
											? "default"
											: "outline"
									}
									size="sm"
									onClick={() => handlePaymentMethodChange("easypaisa")}
									className="min-w-[84px]"
								>
									Easypaisa
								</Button>
								<Button
									type="button"
									variant={
										formData.paymentMethod === "jazzcash"
											? "default"
											: "outline"
									}
									size="sm"
									onClick={() => handlePaymentMethodChange("jazzcash")}
									className="min-w-[84px]"
								>
									JazzCash
								</Button>
							</div>
						</div>
					</div>

					{/* Navigation Buttons */}
					<div className="flex gap-4 px-4 py-3">
						<Button
							type="button"
							variant="outline"
							size="lg"
							onClick={onBack}
							className="flex-1 h-12 lg:h-14 font-bold"
						>
							Back to Shipping Info
						</Button>
						<Button
							type="submit"
							size="lg"
							className="flex-1 h-12 lg:h-14 font-bold"
							disabled={!isFormValid()}
						>
							Continue to Order Summary
						</Button>
					</div>
				</form>
			</div>

			{/* Lottie Animation Section */}
			<div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative">
				<div className="w-full max-w-lg sticky top-20 self-start">
					<div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm border border-border/20 shadow-xl min-h-[600px] flex flex-col justify-center">
						<div className="aspect-square p-8 max-h-[500px]">
							<Lottie
								animationData={ShippingPaymentAnimation}
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
							<IoLockClosed className="inline mr-1" />
							Secure Payment Processing
						</p>
						<p className="text-xs text-muted-foreground/70 mt-1">
							Your payment information is encrypted and secure
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

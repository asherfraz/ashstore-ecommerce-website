"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckoutStepper } from "./CheckoutStepper";
import ShippingInfoAnimation from "@/public/animations/Forgot_Password_Animation.json";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";
import Lottie from "lottie-react";
import { IoLockClosed } from "react-icons/io5";

interface ShippingFormData {
	fullName: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	stateProvince: string;
	postalCode: string;
	phoneNumber: string;
}

interface ShippingInformationProps {
	onNext: (data: ShippingFormData) => void;
	initialData?: Partial<ShippingFormData>;
}

export function ShippingInformation({
	onNext,
	initialData,
}: ShippingInformationProps) {
	const [formData, setFormData] = useState<ShippingFormData>({
		fullName: initialData?.fullName || "",
		addressLine1: initialData?.addressLine1 || "",
		addressLine2: initialData?.addressLine2 || "",
		city: initialData?.city || "",
		stateProvince: initialData?.stateProvince || "",
		postalCode: initialData?.postalCode || "",
		phoneNumber: initialData?.phoneNumber || "",
	});

	const handleInputChange =
		(field: keyof ShippingFormData) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));
		};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onNext(formData);
	};

	const isFormValid =
		formData.fullName &&
		formData.addressLine1 &&
		formData.city &&
		formData.stateProvince &&
		formData.postalCode &&
		formData.phoneNumber;

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
					currentStep={1}
					totalSteps={4}
					stepTitles={[
						"Shipping Info",
						"Shipping & Payment",
						"Order Summary",
						"Review & Place Order",
					]}
				/>

				<h2 className="text-foreground tracking-tight text-2xl sm:text-3xl font-bold leading-tight px-4 text-left pb-3 pt-5">
					Shipping Information
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Full Name */}
					<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
						<div className="flex flex-col min-w-0 flex-1 space-y-2">
							<Label
								htmlFor="fullName"
								className="text-foreground text-base font-medium"
							>
								Full Name *
							</Label>
							<Input
								id="fullName"
								type="text"
								placeholder="Enter your full name"
								value={formData.fullName}
								onChange={handleInputChange("fullName")}
								className="h-12 lg:h-14"
								required
							/>
						</div>
					</div>

					{/* Address Line 1 */}
					<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
						<div className="flex flex-col min-w-0 flex-1 space-y-2">
							<Label
								htmlFor="addressLine1"
								className="text-foreground text-base font-medium"
							>
								Address Line 1 *
							</Label>
							<Input
								id="addressLine1"
								type="text"
								placeholder="Street address, P.O. box, or company name"
								value={formData.addressLine1}
								onChange={handleInputChange("addressLine1")}
								className="h-12 lg:h-14"
								required
							/>
						</div>
					</div>

					{/* Address Line 2 */}
					<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
						<div className="flex flex-col min-w-0 flex-1 space-y-2">
							<Label
								htmlFor="addressLine2"
								className="text-foreground text-base font-medium"
							>
								Address Line 2 (Optional)
							</Label>
							<Input
								id="addressLine2"
								type="text"
								placeholder="Apartment, suite, unit, building, floor, etc."
								value={formData.addressLine2}
								onChange={handleInputChange("addressLine2")}
								className="h-12 lg:h-14"
							/>
						</div>
					</div>

					{/* City and State/Province */}
					<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
						<div className="flex flex-col min-w-0 flex-1 space-y-2">
							<Label
								htmlFor="city"
								className="text-foreground text-base font-medium"
							>
								City *
							</Label>
							<Input
								id="city"
								type="text"
								placeholder="Enter your city"
								value={formData.city}
								onChange={handleInputChange("city")}
								className="h-12 lg:h-14"
								required
							/>
						</div>
						<div className="flex flex-col min-w-0 flex-1 space-y-2">
							<Label
								htmlFor="stateProvince"
								className="text-foreground text-base font-medium"
							>
								State/Province
							</Label>
							<Input
								id="stateProvince"
								type="text"
								placeholder="Enter your state/province"
								value={formData.stateProvince}
								onChange={handleInputChange("stateProvince")}
								className="h-12 lg:h-14"
							/>
						</div>
					</div>

					{/* Postal Code and Phone Number */}
					<div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
						<div className="flex flex-col min-w-0 flex-1 space-y-2">
							<Label
								htmlFor="postalCode"
								className="text-foreground text-base font-medium"
							>
								Postal Code
							</Label>
							<Input
								id="postalCode"
								type="text"
								placeholder="Enter your postal code"
								value={formData.postalCode}
								onChange={handleInputChange("postalCode")}
								className="h-12 lg:h-14"
							/>
						</div>
						<div className="flex flex-col min-w-0 flex-1 space-y-2">
							<Label
								htmlFor="phoneNumber"
								className="text-foreground text-base font-medium"
							>
								Phone Number *
							</Label>
							<Input
								id="phoneNumber"
								type="tel"
								placeholder="Enter your phone number"
								value={formData.phoneNumber}
								onChange={handleInputChange("phoneNumber")}
								className="h-12 lg:h-14"
								required
							/>
						</div>
					</div>

					{/* Submit Button */}
					<div className="flex px-4 py-3">
						<Button
							type="submit"
							size="lg"
							className="flex w-full h-12 lg:h-14 font-bold"
							disabled={!isFormValid}
						>
							Continue to Shipping Method
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
								animationData={ShippingInfoAnimation}
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
							Secure Shipping Information
						</p>
						<p className="text-xs text-muted-foreground/70 mt-1">
							Your data is encrypted and protected
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

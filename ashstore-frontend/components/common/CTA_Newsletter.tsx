"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import Landing_Section from "../LandingPage_1/Landing_Section";
import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { newsletterHandlerForGuest } from "@/api/userApis";
import { BackendResponse } from "@/types/types";
import { updateUser } from "@/redux/userSlice";
import toast from "react-hot-toast";

export default function CTA_Newsletter() {
	const dispatch = useDispatch();
	const { user } = useAuth();
	const [userEmail, setUserEmail] = useState(user?.email || "");
	const [isLoading, setIsLoading] = useState(false);

	const handleNewsletterMarketingEmail = async () => {
		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!userEmail || !emailRegex.test(userEmail)) {
			toast.error("Please enter a valid email address");
			return;
		}

		setIsLoading(true);

		try {
			const response = (await newsletterHandlerForGuest({
				email: userEmail,
				subscribedState: !user ? true : !user?.newsletterSubscribed,
			})) as BackendResponse;

			if (response?.data?.success) {
				// Update user in Redux store if the subscribed email matches the logged-in user
				if (user && user.email === userEmail) {
					dispatch(
						updateUser({
							...user,
							newsletterSubscribed: response?.data?.isSubscribed,
						})
					);
				}
				toast.success(
					response.data.message || "Subscribed to newsletter successfully!"
				);
			} else {
				toast.error(
					response?.response?.data?.message ||
						"Failed to subscribe to newsletter. Please try again."
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Newsletter Subscription Error:", error.message);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleNewsletterMarketingEmail();
		}
	};

	return (
		<Landing_Section>
			<div className="flex flex-col items-center gap-4">
				<h2 className="px-4 text-4xl font-extrabold tracking-tight text-foreground">
					Stay in the Loop
				</h2>
				<p className="text-center text-muted-foreground max-w-xl">
					Sign up for our newsletter to receive exclusive offers and updates on
					new arrivals.
				</p>
				<div className="flex w-full max-w-md items-center gap-2">
					<Input
						placeholder="Enter your email"
						type="email"
						aria-label="Email address"
						value={userEmail}
						onChange={(e) => setUserEmail(e.target.value)}
						onKeyPress={handleKeyPress}
						disabled={isLoading}
					/>
					<Button
						onClick={handleNewsletterMarketingEmail}
						disabled={isLoading || !userEmail}
					>
						{isLoading ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Subscribing...
							</>
						) : (
							<>
								<Mail className="mr-2 h-4 w-4" /> Subscribe
							</>
						)}
					</Button>
				</div>
			</div>
		</Landing_Section>
	);
}

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { resendAccountVerificationEmail, verifyAccount } from "@/api/userApis";
import { BackendResponse } from "@/types/types";
import { useDispatch } from "react-redux";

const VerifyAccountPage: React.FC = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { token, userId } = useParams(); // Get token and userId from URL params
	const [isVerifying, setIsVerifying] = useState(true);
	const [isResending, setIsResending] = useState(false);
	const [verificationStatus, setVerificationStatus] = useState<
		"pending" | "success" | "error"
	>("pending");

	useEffect(() => {
		// Automatically verify account when component mounts
		const verifyAccountToken = async () => {
			if (!token) {
				setVerificationStatus("error");
				setIsVerifying(false);
				toast.error("Invalid verification link");
				return;
			}

			try {
				const response = (await verifyAccount(
					token as string
				)) as BackendResponse;

				if (response?.data?.success) {
					setVerificationStatus("success");
					toast.success(
						response.data.message || "Account verified successfully!"
					);

					// Update user state if needed
					if (response.data.user) {
						dispatch({
							type: "user/setUser",
							payload: response.data.user,
						});
					}

					// Redirect after a short delay
					setTimeout(() => {
						if (
							response.data.user?.userType === "admin" &&
							response.data.user?.isAdmin
						) {
							router.push("/admin/dashboard");
						} else {
							router.push("/auth/login");
						}
					}, 2000);
				} else {
					setVerificationStatus("error");
					toast.error(
						response?.response?.data?.message ||
							"Account verification failed. Please try again."
					);
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				setVerificationStatus("error");
				console.error("Account verification error:", error);
				toast.error(
					error.response?.data?.message ||
						"An unexpected error occurred. Please try again."
				);
			} finally {
				setIsVerifying(false);
			}
		};
		verifyAccountToken();
		console.log("Tokens: ", { userId, token });
	}, [token, dispatch, router]);

	const handleResendVerification = async () => {
		setIsResending(true);
		try {
			// We need the user's email, which might be stored or we need to get it from somewhere
			// For this example, I'll assume we need to call an API that uses the token to resend
			const response = (await resendAccountVerificationEmail(
				userId as string,
				token as string
			)) as BackendResponse;

			if (response?.data?.success) {
				toast.success(
					response.data.message || "Verification email sent successfully!"
				);
			} else {
				toast.error(
					response?.response?.data?.message ||
						"Failed to resend verification email. Please try again."
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Resend verification error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		} finally {
			setIsResending(false);
		}
	};

	return (
		<div className="flex flex-1 justify-center px-6 py-10">
			<div className="flex w-full max-w-md flex-col py-5 items-center">
				{verificationStatus === "pending" && isVerifying && (
					<>
						<h2 className="px-4 pt-5 pb-3 text-center text-3xl font-bold leading-tight text-foreground">
							Verifying Your Account
						</h2>
						<p className="px-4 pt-1 pb-3 text-center text-base text-muted-foreground">
							Please wait while we verify your account...
						</p>
						<div className="flex justify-center py-6">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
						</div>
					</>
				)}

				{verificationStatus === "success" && (
					<>
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
							<svg
								className="w-10 h-10 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
						</div>
						<h2 className="px-4 pt-5 pb-3 text-center text-3xl font-bold leading-tight text-foreground">
							Account Verified!
						</h2>
						<p className="px-4 pt-1 pb-3 text-center text-base text-muted-foreground">
							Your account has been successfully verified. Redirecting you to
							the dashboard...
						</p>
					</>
				)}

				{verificationStatus === "error" && (
					<>
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
							<svg
								className="w-10 h-10 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</div>
						<h2 className="px-4 pt-5 pb-3 text-center text-3xl font-bold leading-tight text-foreground">
							Verification Failed
						</h2>
						<p className="px-4 pt-1 pb-3 text-center text-base text-muted-foreground">
							Your account could not be verified. The link may have expired or
							is invalid.
						</p>

						<div className="flex justify-center px-4 py-3">
							<Button
								onClick={handleResendVerification}
								disabled={isResending}
								className="w-full max-w-xs bg-primary text-primary-foreground"
							>
								{isResending ? "Sending..." : "Resend Verification Email"}
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default VerifyAccountPage;

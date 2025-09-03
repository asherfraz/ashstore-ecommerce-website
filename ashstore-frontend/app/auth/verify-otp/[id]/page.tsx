"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { InputOTPControlled } from "@/components/common/InputOTPControlled";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
	generateTwoFactorAuthOTP,
	verifyTwoFactorAuthOTP,
} from "@/api/userApis";
import { BackendResponse } from "@/types/types";
import { useDispatch } from "react-redux";

const Verify2FACodePage: React.FC = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const userId = useParams().id;
	const [isSending, setIsSending] = React.useState(false);
	const [isReSending, setIsReSending] = React.useState(false);
	const [otpValue, setOTPValue] = React.useState("");

	const handleChange = (newValue: string) => {
		// Only allow numeric values
		if (/^\d*$/.test(newValue)) {
			setOTPValue(newValue);
		}
	};

	const handleVerify = async () => {
		setIsSending(true);
		// Add your verification logic here
		console.log("Verifying OTP code... => ", otpValue);
		if (otpValue.length !== 6) {
			toast.error("Please enter a valid 6-digit code");
			return;
		}
		try {
			// Cast values to RegisterPayload to satisfy the API
			const response = (await verifyTwoFactorAuthOTP(
				`${userId}`,
				otpValue
			)) as BackendResponse;

			if (response?.data?.success) {
				toast.success(response.data.message || "OTP Verified Successfully!");
				dispatch({
					type: "user/setUser",
					payload: response.data.user,
				});
				if (
					response.data.user.userType === "admin" &&
					response.data.user.isAdmin
				) {
					router.push("/admin/dashboard");
				} else {
					router.push("/marketplace");
				}
			} else {
				toast.error(
					response?.response?.data?.message ||
						"OTP verification failed. Please try again."
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("OTP verification error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		} finally {
			setIsSending(false);
		}
	};

	const handleReSendOTP = async () => {
		setIsReSending(true);
		// Add your verification logic here
		console.log("Resending OTP code...");
		try {
			// Cast values to RegisterPayload to satisfy the API
			const response = (await generateTwoFactorAuthOTP(
				`${userId}`
			)) as BackendResponse;

			if (response?.data?.success) {
				toast.success(response.data.message || "OTP Re-send Successfully!");
			} else {
				toast.error(
					response?.response?.data?.message ||
						"OTP sending failed. Please try again."
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("OTP sending error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		} finally {
			setIsReSending(false);
		}
	};

	return (
		<div className="flex flex-1 justify-center px-6 py-10">
			<div className="flex w-full max-w-md flex-col py-5">
				<h2 className="px-4 pt-5 pb-3 text-center text-3xl font-bold leading-tight text-foreground">
					Enter your code
				</h2>
				<p className="px-4 pt-1 pb-3 text-center text-base text-muted-foreground">
					We sent a code to your email. Please enter it below to continue.
				</p>

				{/* OTP Inputs */}
				<div className="flex justify-center px-4 py-3">
					<InputOTPControlled value={otpValue} onChange={handleChange} />
				</div>

				{/* Didn't receive code */}
				<Button
					variant={"link"}
					onClick={handleReSendOTP}
					className="px-4 pt-1 pb-3 text-center text-sm text-muted-foreground underline cursor-pointer"
				>
					{isReSending ? "Resending..." : "Didn't receive the code?"}
				</Button>

				{/* Verify Button */}
				<div className="flex justify-center px-4 py-3">
					<Button
						className="w-full max-w-xs bg-primary text-primary-foreground"
						onClick={handleVerify}
					>
						{isSending ? "Verifying..." : "Verify"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Verify2FACodePage;

"use client";

import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordSchema } from "@/schemas/user.validations";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { ResetPassword } from "@/api/userApis";
import { BackendResponse } from "@/types/types";
import toast from "react-hot-toast";

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: FC = () => {
	const router = useRouter();
	const token = useParams().token;

	const form = useForm<ResetPasswordValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		form.handleSubmit((values: ResetPasswordValues) => onSubmit(values, e))();
	};

	const onSubmit = async (values: ResetPasswordValues, e?: React.FormEvent) => {
		if (e) {
			e.preventDefault();
		}
		if (!token) {
			toast.error("Invalid token or expired. Please try again.");
			return;
		}
		// console.log("Token: ", token);
		// console.log(values);
		try {
			// Cast values to RegisterPayload to satisfy the API
			const response = (await ResetPassword(
				token as string,
				values as ResetPasswordValues
			)) as BackendResponse;
			if (response?.data?.success) {
				toast.success(
					response.data.message || "Reset password sent successfully!"
				);
				// if user successfully login the reset the form
				form.reset();
				// Redirect to login page after successful sending
				router.push("/auth/login");
			} else {
				toast.error(
					response?.response?.data?.message ||
						"Failed to send reset password. Please try again."
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Reset password error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		}
	};

	return (
		<div className="flex flex-1 justify-center px-6 py-10">
			<div className="flex w-full max-w-md flex-col py-5">
				{/* Heading */}
				<h2 className="px-4 pt-5 pb-3 text-center text-3xl font-bold leading-tight text-foreground">
					Change Password
				</h2>
				<p className="px-4 pt-1 pb-3 text-center text-base text-muted-foreground">
					Enter your new password below to update your account.
				</p>

				<Form {...form}>
					<form onSubmit={handleFormSubmit} className="space-y-6">
						{/* New Password Field */}
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Password"
											className="h-12 text-base"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Password Field */}
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Password"
											className="h-12 text-base"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Login Button */}
						<Button
							type="submit"
							disabled={form.formState.isSubmitting}
							className="w-full h-10 font-semibold text-sm"
						>
							{form.formState.isSubmitting ? "Updating..." : "Update Password"}
						</Button>
					</form>
				</Form>

				{/* Back to Login */}
				<p className="px-4 pt-1 pb-3 text-center text-sm text-muted-foreground underline cursor-pointer">
					Back to Login
				</p>
			</div>
		</div>
	);
};

export default ResetPasswordPage;

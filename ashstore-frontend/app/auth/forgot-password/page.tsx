"use client";

import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { forgotPasswordSchema } from "@/schemas/user.validations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { BackendResponse } from "@/types/types";
import { resetPasswordEmail } from "@/api/userApis";
import toast from "react-hot-toast";

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: FC = () => {
	const router = useRouter();

	const form = useForm<ForgotPasswordValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			identifier: "",
		},
	});

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		form.handleSubmit((values: ForgotPasswordValues) => onSubmit(values, e))();
	};

	const onSubmit = async (
		values: ForgotPasswordValues,
		e?: React.FormEvent
	) => {
		if (e) {
			e.preventDefault();
		}
		// console.log(values);
		try {
			const payload: { username?: string; email?: string } = {};

			// if identifier looks like an email, send it as email
			if (values.identifier.includes("@")) {
				payload.email = values.identifier;
			} else {
				payload.username = values.identifier;
			}

			// Cast values to RegisterPayload to satisfy the API
			const response = (await resetPasswordEmail(
				payload as ForgotPasswordValues
			)) as BackendResponse;

			if (response?.data?.success) {
				toast.success(
					response.data.message || "Reset password email sent successfully!"
				);
				// if user successfully login the reset the form
				form.reset();

				// Redirect to login page after successful email sending
				router.push("/auth/login");
			} else {
				toast.error(
					response?.response?.data?.message ||
						"Failed to send reset password email. Please try again."
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Forgot password error:", error);
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
					Forgot Your Password?
				</h2>
				<p className="px-4 pt-1 pb-3 text-center text-base text-muted-foreground">
					Enter your email address and we&apos;ll send you a link to reset your
					password.
				</p>

				<Form {...form}>
					<form onSubmit={handleFormSubmit} className="space-y-6">
						{/* Email Field */}
						<FormField
							control={form.control}
							// field input will be username or email
							name="identifier"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email or Username</FormLabel>
									<FormControl>
										<Input
											placeholder="Email or Username"
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
							{form.formState.isSubmitting
								? "Sending reset link to email..."
								: "Reset Password"}
						</Button>
					</form>
				</Form>

				{/* Back to Login */}
				<Link
					href="/auth/login"
					className="mt-4 px-4 pt-1 pb-3 text-center text-sm text-muted-foreground underline cursor-pointer"
				>
					Back to Login
				</Link>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;

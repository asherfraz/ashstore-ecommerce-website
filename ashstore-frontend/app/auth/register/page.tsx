"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import Lottie from "lottie-react";
import registerIllustration from "@/public/animations/Login_animation.json";
import { register } from "@/api/userApis";
import toast from "react-hot-toast";
import { BackendResponse, IUser } from "@/types/types";
import { useDispatch } from "react-redux";
import { registerSchema } from "@/schemas/user.validations";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const form = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: "",
			userType: "buyer",
		},
	});
	const dispatch = useDispatch();
	const router = useRouter();

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		form.handleSubmit((values: RegisterValues) => onSubmit(values, e))();
	};

	const onSubmit = async (values: RegisterValues, e?: React.FormEvent) => {
		if (e) {
			e.preventDefault();
		}

		try {
			// Cast values to RegisterPayload to satisfy the API
			const response = (await register(
				values as RegisterValues
			)) as BackendResponse;

			if (response?.data?.success) {
				dispatch({
					type: "user/setUser",
					payload: response.data.user,
				});

				// if 2FA is enabled
				if (response.data.user.twoFactorEnabled) {
					router.push("/auth/verify-2fa-code");
				} else if (
					response.data.user.userType === "admin" &&
					response.data.user.isAdmin
				) {
					router.push("/admin/dashboard");
				} else {
					router.push("/marketplace");
				}
				toast.success(response.data.message || "Registration successful!");
				// if user successfully login the reset the form
				form.reset();
			} else {
				toast.error(
					response?.response?.data?.message ||
						"Registration failed. Please try again."
				);
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Registration error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		}
	};

	return (
		<div className="flex flex-col-reverse lg:flex-row min-h-screen">
			{/* Left Form Section */}
			<div className="flex  w-full lg:w-1/2 items-center justify-center bg-background px-6 py-10">
				<div className="w-full max-w-md">
					<h2 className="text-3xl font-bold leading-tight text-foreground">
						Create an account
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Join us today! Fill in your details below.
					</p>

					<Form {...form}>
						<form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
							{/* First & Last Name */}
							<div className="flex flex-col gap-4 sm:flex-row">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input
													placeholder="First Name"
													className="h-12"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Last Name"
													className="h-12"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Username */}
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="Username"
												className="h-12"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="Email"
												className="h-12"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Password"
												className="h-12"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* User Type */}
							<FormField
								control={form.control}
								name="userType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>User Type</FormLabel>
										<FormControl>
											<ToggleGroup
												type="single"
												variant="outline"
												className="w-full"
												value={field.value}
												onValueChange={field.onChange}
											>
												<ToggleGroupItem className="flex-1" value="buyer">
													Buyer
												</ToggleGroupItem>
												<ToggleGroupItem className="flex-1" value="seller">
													Seller
												</ToggleGroupItem>
											</ToggleGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Actions */}
							<div className="space-y-4">
								<Button
									type="submit"
									disabled={form.formState.isSubmitting}
									className="w-full h-12"
								>
									{form.formState.isSubmitting
										? "Creating..."
										: "Create Account"}
								</Button>
								{/* Google Login Button */}
								<div>
									<GoogleLoginButton />
								</div>
							</div>

							{/* Terms */}
							<p className="mt-4 text-center text-xs text-muted-foreground">
								By creating an account, you agree to our{" "}
								<Link href="/terms" className="underline">
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link href="/privacy" className="underline">
									Privacy Policy
								</Link>
								.
							</p>

							{/* Login Link */}
							<p className="mt-2 text-center text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link href="/auth/login" className="cursor-pointer underline">
									Log in
								</Link>
							</p>
						</form>
					</Form>
				</div>
			</div>

			{/* Right Illustration */}
			<div className="w-full lg:w-1/2 relative h-64 lg:h-auto flex items-center justify-center rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
				<div className="w-full aspect-[4/3] max-w-md lg:max-w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
					<Lottie
						animationData={registerIllustration}
						loop
						className="w-full h-full bg-cover bg-center"
					/>
				</div>
			</div>
		</div>
	);
}

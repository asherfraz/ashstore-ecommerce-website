"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import loginIllustration from "@/public/animations/Login_animation.json";
import { BackendResponse, IUser } from "@/types/types";
import toast from "react-hot-toast";
import { login } from "@/api/userApis";
import { useDispatch } from "react-redux";
import { loginSchema } from "@/schemas/user.validations";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const dispatch = useDispatch();

	const form = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			// identifier: "ash3rdev",
			password: "Password@123",
			identifier: "asherfraz",
			// password: "Asherfraz@123",
		},
	});

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		form.handleSubmit((values: LoginValues) => onSubmit(values, e))();
	};

	const onSubmit = async (values: LoginValues, e?: React.FormEvent) => {
		if (e) {
			e.preventDefault();
		}
		// console.log(values);
		try {
			const payload: Partial<IUser> = {
				password: values.password,
			};

			// if identifier looks like an email, send it as email
			if (values.identifier.includes("@")) {
				payload.email = values.identifier;
			} else {
				payload.username = values.identifier;
			}

			// Cast values to RegisterPayload to satisfy the API
			const response = (await login(payload as LoginValues)) as BackendResponse;

			if (response?.data?.success) {
				// if 2FA is enabled
				if (response.data?.userId) {
					router.push(`/auth/verify-otp/${response.data?.userId}`);
				} else if (
					response.data.user.userType === "admin" &&
					response.data.user.isAdmin
				) {
					// You might want to redirect here after successful login
					dispatch({
						type: "user/setUser",
						payload: response.data.user,
					});
					router.push("/admin/dashboard");
				} else {
					// You might want to redirect here after successful login
					dispatch({
						type: "user/setUser",
						payload: response.data.user,
					});
					router.push("/marketplace");
				}

				toast.success(response.data.message || "Login successful!");

				// if user successfully login the reset the form
				form.reset();
			} else {
				toast.error(
					response?.response?.data?.message || "Login failed. Please try again."
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Login error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		}
	};

	return (
		<section className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
			{/* Left Illustration Section */}
			<div className="w-full lg:w-1/2 relative h-64 lg:h-auto flex items-center justify-center rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
				<div className="w-full aspect-[4/3] max-w-md lg:max-w-full rounded-xl overflow-hidden ">
					<Lottie
						animationData={loginIllustration}
						loop
						className="w-full h-full bg-cover bg-center"
					/>
				</div>
			</div>

			{/* Right Form Section */}
			<div className="w-full lg:w-1/2 flex flex-col justify-center p-6 max-w-xl mx-auto">
				<h2 className="text-3xl font-bold mb-8">Login to your account</h2>

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

						{/* Password Field */}
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
							{form.formState.isSubmitting ? "Logging in..." : "Login"}
						</Button>

						{/* Google Login */}
						<div>
							<GoogleLoginButton />
						</div>
					</form>
				</Form>

				{/* Links */}
				<div className="mt-6 text-sm text-muted-foreground text-center space-y-2">
					<Link href="/auth/forgot-password" className="underline">
						Forgot Password?
					</Link>
					<br />
					<Link href="/auth/register" className="underline">
						Don’t have an account?{" "}
						<span className="text-foreground font-semibold">
							Create an account
						</span>
					</Link>
				</div>
			</div>
		</section>
	);
}

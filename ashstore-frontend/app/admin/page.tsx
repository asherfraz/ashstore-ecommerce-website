"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
	email: z.string().min(1, "Email  is required"),
	password: z.string().min(1, "Password is required"),
});

export default function AdminPage() {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		router.push("/admin/dashboard");
	}

	return (
		<section className="flex flex-row min-h-screen bg-background text-foreground">
			{/* Form Section */}
			<div className="w-full lg:w-1/2 flex flex-col justify-center p-6 max-w-xl mx-auto">
				<h2 className="text-3xl font-bold mb-8">Admin Login</h2>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Email Field */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email </FormLabel>
									<FormControl>
										<Input
											placeholder="Email "
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
						<Button type="submit" className="w-full h-10 font-semibold text-sm">
							Login
						</Button>
					</form>
				</Form>

				{/* Links */}
				<div className="mt-6 text-sm text-muted-foreground text-center space-y-2">
					<Link href="/admin/forgot-password" className="underline">
						Forgot Password?
					</Link>
				</div>
			</div>
		</section>
	);
}

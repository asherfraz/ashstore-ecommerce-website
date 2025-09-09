"use client";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BadgeCheckIcon, Edit, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
	userHasNoPass,
	changeUserPassword,
	enableTwoFactorAuth,
} from "@/api/userApis";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BackendResponse } from "@/types/types";
import { changePasswordSchema } from "@/schemas/user.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import { updateUser } from "@/redux/userSlice";

// Define the type based on the schema
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const UserPasswordChange = () => {
	const { user } = useAuth();
	const dispatch = useDispatch();
	const [isEditMode, setIsEditMode] = useState(true);
	const [hasBlankPassword, setHasBlankPassword] = useState<boolean>(false);
	const [isTwoFactorLoading, setIsTwoFactorLoading] = useState(false);
	const [localTwoFactorStatus, setLocalTwoFactorStatus] = useState(
		user?.twoFactorEnabled
	);

	// Update local state when user prop changes
	useEffect(() => {
		setLocalTwoFactorStatus(user?.twoFactorEnabled);
	}, [user?.twoFactorEnabled]);

	const form = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			oldPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		const checkUserHasBlankPassword = async () => {
			if (!user?._id) return;

			try {
				const response = (await userHasNoPass(
					user._id as string
				)) as BackendResponse;

				if (response?.data?.hasNoPassword) {
					setHasBlankPassword(response?.data?.hasNoPassword);
				} else {
					setHasBlankPassword(false);
				}
			} catch (error) {
				console.error("Error checking password status:", error);
				setHasBlankPassword(false);
			}
		};

		checkUserHasBlankPassword();
	}, [user]);

	const onSubmit = async (data: ChangePasswordFormValues) => {
		if (!user?._id) return;

		try {
			const response = (await changeUserPassword(
				user._id as string,
				data
			)) as BackendResponse;

			if (response?.data?.success) {
				toast.success("Password changed successfully!");
				form.reset();
				setIsEditMode(true);
			} else {
				toast.error(
					response?.response?.data?.message || "Failed to change password"
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Error changing password:", error);
			toast.error(error.response?.data?.message || "Something went wrong!");
		} finally {
		}
	};

	const handleCancel = () => {
		form.reset();
		setIsEditMode(true);
	};

	//  function to handle 2FA toggle
	const handleToggleTwoFactor = async () => {
		if (!user?._id) return;

		// Optimistically update the UI
		setLocalTwoFactorStatus(!localTwoFactorStatus);
		setIsTwoFactorLoading(true);

		try {
			const response = (await enableTwoFactorAuth(user._id)) as BackendResponse;

			if (response?.data?.success) {
				toast.success(response?.data?.message);
				// Update the local state with the actual response if needed
				dispatch(
					updateUser({
						...user,
						twoFactorEnabled: response?.data?.twoFactorEnabled,
					})
				);
			} else {
				// Revert the UI if the API call failed
				setLocalTwoFactorStatus(user?.twoFactorEnabled);
				toast.error(
					response?.response?.data?.message ||
						"Failed to toggle two-factor authentication"
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			// Revert the UI if the API call failed
			setLocalTwoFactorStatus(user?.twoFactorEnabled);
			console.error("Error toggling two-factor authentication:", error);
			toast.error(error.response?.data?.message || "Something went wrong!");
		} finally {
			setIsTwoFactorLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Change Password</CardTitle>
				<Button
					variant="outline"
					onClick={() => setIsEditMode(!isEditMode)}
					className={!isEditMode ? "hidden" : "flex items-center gap-2"}
				>
					<Edit className="h-4 w-4" />
					<span>Change Password</span>
				</Button>
			</CardHeader>
			<CardContent>
				{/* Change Password Fields */}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{!hasBlankPassword && (
							<FormField
								control={form.control}
								name="oldPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Current Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your current password"
												disabled={isEditMode}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter new password"
												disabled={isEditMode}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Confirm new password"
												disabled={isEditMode}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{!isEditMode && (
							<CardFooter className="flex justify-end gap-4 px-0 pt-6">
								<Button
									type="button"
									variant="outline"
									onClick={handleCancel}
									disabled={form.formState.isSubmitting}
								>
									<X className="mr-2 h-4 w-4" />
									Cancel
								</Button>
								<Button type="submit" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting ? (
										"Saving..."
									) : (
										<>
											<Save className="mr-2 h-4 w-4" />
											Save Changes
										</>
									)}
								</Button>
							</CardFooter>
						)}
					</form>
				</Form>

				<Separator className="my-8" />

				{/* Enable or  Disable Two Factor Authentication */}
				<div className="bg-card rounded-2xl border">
					<div className="flex items-center gap-4 px-4 min-h-16 py-2 justify-between">
						<div className="flex flex-col justify-center">
							<div className="flex justify-start items-center gap-2">
								<p className="text-foreground text-base font-medium leading-normal line-clamp-1">
									Two-Factor Authentication
								</p>
								{localTwoFactorStatus ? (
									<Badge
										variant="secondary"
										className="bg-green-500 text-white dark:bg-green-600"
									>
										<BadgeCheckIcon className="h-3 w-3 mr-1" />
										Enabled
									</Badge>
								) : (
									<Badge
										variant="secondary"
										className="bg-gray-500 text-white dark:bg-gray-600"
									>
										<BadgeCheckIcon className="h-3 w-3 mr-1" />
										Disabled
									</Badge>
								)}
							</div>
							<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
								{localTwoFactorStatus
									? "Two-factor authentication is currently enabled for your account."
									: "Enable two-factor authentication for enhanced security."}
							</p>
						</div>
						<div className="shrink-0">
							<Button
								variant="outline"
								size="sm"
								onClick={handleToggleTwoFactor}
								disabled={isTwoFactorLoading}
								className="min-w-[80px]"
							>
								{isTwoFactorLoading ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
										{localTwoFactorStatus ? "Disabling..." : "Enabling..."}
									</>
								) : localTwoFactorStatus ? (
									"Disable"
								) : (
									"Enable"
								)}
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { newsletterHandlerForGuest } from "@/api/userApis";
import { BackendResponse } from "@/types/types";
import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { updateUser } from "@/redux/userSlice";

export default function UserSettingsPage() {
	const router = useRouter();
	const dispatch = useDispatch();
	const { user } = useAuth();
	const [marketingEmails, setMarketingEmails] = useState(
		user?.newsletterSubscribed || false
	);
	const [orderUpdates, setOrderUpdates] = useState(false);
	const [inventoryAlerts, setInventoryAlerts] = useState(false);
	// const [smsNotifications, setSmsNotifications] = useState(false);

	const handleNewsletterMarketingEmail = async () => {
		setMarketingEmails(!marketingEmails);
		// toast.success("Newsletter changed!");

		if (!user?.email) return;

		try {
			// Cast values to RegisterPayload to satisfy the API
			const response = (await newsletterHandlerForGuest({
				email: user?.email,
				subscribedState: !marketingEmails,
			})) as BackendResponse;

			console.log("Response: ", response.data);

			if (response?.data?.success) {
				dispatch(
					updateUser({
						...user,
						newsletterSubscribed: response?.data?.isSubscribed,
					})
				);
				toast.success(response.data.message || "Newsletter Subscribed!");
			} else {
				toast.error(
					response?.response?.data?.message ||
						"Newsletter Subscription Failed. Please try again."
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Newsletter Subscription Error:", error.message);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		}
	};

	return (
		<div className="layout-content-container flex flex-col max-w-full flex-1">
			{/* Header */}
			<div className="flex flex-wrap justify-between gap-3 p-4">
				<h1 className="text-foreground text-3xl font-bold leading-tight min-w-72">
					Settings
				</h1>
			</div>

			{/* Email Notifications Section */}
			<h2 className="text-foreground text-xl font-bold leading-tight tracking-tight px-4 pb-3 pt-5">
				Email Notifications
			</h2>

			<div className="bg-card rounded-2xl">
				<div className="flex items-center gap-4  px-4 min-h-16 py-2 justify-between">
					<div className="flex flex-col justify-center">
						<p className="text-foreground text-base font-medium leading-normal line-clamp-1">
							Newsletter & Marketing Emails
						</p>
						<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
							Receive updates on new products, promotions, and sales.
						</p>
					</div>
					<div className="shrink-0">
						<Switch
							id="newsletter-and-marketing-emails"
							checked={marketingEmails}
							onCheckedChange={handleNewsletterMarketingEmail}
							aria-label="Toggle newsletter and marketing emails"
						/>
					</div>
				</div>

				<div className="flex items-center gap-4 px-4 min-h-16 py-2 justify-between">
					<div className="flex flex-col justify-center">
						<p className="text-foreground text-base font-medium leading-normal line-clamp-1">
							Order Updates
						</p>
						<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
							Get notified when your order status changes.
						</p>
					</div>
					<div className="shrink-0">
						<Switch
							disabled
							id="order-updates"
							checked={orderUpdates}
							onCheckedChange={setOrderUpdates}
							aria-label="Toggle order updates"
						/>
					</div>
				</div>

				<div className="flex items-center gap-4  px-4 min-h-16 py-2 justify-between">
					<div className="flex flex-col justify-center">
						<p className="text-foreground text-base font-medium leading-normal line-clamp-1">
							Inventory Alerts
						</p>
						<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
							Receive alerts about low stock or restocks of your favorite items.
						</p>
					</div>
					<div className="shrink-0">
						<Switch
							disabled
							id="inventory-alerts"
							checked={inventoryAlerts}
							onCheckedChange={setInventoryAlerts}
							aria-label="Toggle inventory alerts"
						/>
					</div>
				</div>
			</div>

			{/* Communication Preferences Section */}
			<h2 className="text-foreground text-xl font-bold leading-tight tracking-tight px-4 pb-3 pt-5">
				Communication Preferences
			</h2>

			<div className="bg-card rounded-2xl">
				{/*  comment for later use */}
				{/* <div className="flex items-center gap-4 px-4 min-h-16 py-2 justify-between">
					<div className="flex flex-col justify-center">
						<p className="text-foreground text-base font-medium leading-normal line-clamp-1">
							SMS Notifications
						</p>
						<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
							Allow AshStore to send you SMS messages for order updates and
							promotions.
						</p>
					</div>
					<div className="shrink-0">
						<Switch
							id="sms-notifications"
							checked={smsNotifications}
							onCheckedChange={setSmsNotifications}
							aria-label="Toggle SMS notifications"
						/>
					</div>
				</div> */}

				<div className="flex items-center gap-4 px-4 min-h-16 py-2 justify-between">
					<div className="flex flex-col justify-center">
						<p className="text-foreground text-base font-medium leading-normal line-clamp-1">
							Language Preference
						</p>
						<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
							Choose your preferred language for all communications.
						</p>
					</div>
					<Badge className="shrink-0" variant={"outline"}>
						<p className="text-foreground text-base font-normal leading-normal">
							English
						</p>
					</Badge>
				</div>
			</div>

			{/* Account Management Section */}
			<h2 className="text-foreground text-xl font-bold leading-tight tracking-tight px-4 pb-3 pt-5">
				Account Management
			</h2>

			<div className="bg-card rounded-2xl">
				<div className="flex items-center gap-4 px-4 min-h-16 py-2 justify-between">
					<div className="flex flex-col justify-center">
						<p className="text-foreground text-base font-medium leading-normal line-clamp-1">
							Personal Information
						</p>
						<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
							Manage your personal information, including name, contact details,
							and address.
						</p>
					</div>
					<div className="shrink-0">
						<Button
							variant="outline"
							size="sm"
							onClick={() => router.push("/user/account/profile")}
						>
							Edit
						</Button>
					</div>
				</div>

				<div className="flex items-center gap-4 px-4 min-h-16 py-2 justify-between">
					<div className="flex flex-col justify-center">
						<p className="text-foreground text-base font-medium leading-normal line-clamp-1">
							Security Settings
						</p>
						<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
							Update your password or enable two-factor authentication for
							enhanced security.
						</p>
					</div>
					<div className="shrink-0">
						<Button
							variant="outline"
							size="sm"
							onClick={() => router.push("/user/account/change-password")}
						>
							Edit
						</Button>
					</div>
				</div>

				<div className="flex items-center gap-4 px-4 min-h-16 py-2 justify-between">
					<div className="flex flex-col justify-center">
						<p className="text-foreground text-base font-medium leading-normal line-clamp-1">
							Close Account
						</p>
						<p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
							Close your AshStore account and remove all associated data.
						</p>
					</div>
					<div className="shrink-0">
						<Button
							variant="destructive"
							size="sm"
							onClick={() => router.push("/user/account/delete")}
						>
							Close
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

"use client";

import * as React from "react";
import {
	LayoutDashboard,
	Package,
	Users,
	ShoppingBag,
	Megaphone,
	Settings,
	HelpCircle,
	Percent,
	User,
	NotebookText,
	Info,
} from "lucide-react";
import { NavMain } from "@/components/user-dashboard/nav-main";
import { NavSecondary } from "@/components/user-dashboard/nav-secondary";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import tlogo from "@/public/tlogo.png";

// Sidebar data
const data = {
	user: {
		name: "Asher Fraz",
		email: "asherfraz@gmail.com",
		avatar: "/avatars/Asherfraz.jpg",
	},
	navMain: [
		{
			title: "Overview",
			url: "/user/dashboard",
			icon: LayoutDashboard,
			isActive: false,
		},
		{
			title: "Products",
			url: "/user/dashboard/wishlist",
			icon: Package,
			isActive: true,
			items: [{ title: "Wishlist", url: "/user/dashboard/wishlist" }],
		},
		{
			title: "Orders",
			url: "/user/dashboard/orders",
			icon: ShoppingBag,
			items: [{ title: "Orders History", url: "/user/dashboard/orders" }],
		},
		{
			title: "Journals",
			url: "/user/dashboard/journals",
			icon: NotebookText,
			items: [{ title: "Journals", url: "/user/dashboard/journals" }],
		},
		// {
		// 	title: "Discounts & Coupons",
		// 	url: "/user/discounts",
		// 	icon: Percent,
		// 	isActive: true,
		// 	items: [{ title: "All Discounts", url: "/user/discounts" }],
		// },
		// {
		// 	title: "Marketing",
		// 	url: "/user/promotions",
		// 	icon: Megaphone,
		// 	isActive: true,
		// 	items: [
		// 		{ title: "Create Campaign", url: "/user/promotions/create" },
		// 	],
		// },
	],
	navSecondary: [
		{
			title: "Account & Profile",
			url: "/user/account/profile",
			icon: User,
			isActive: true,
			items: [
				{ title: "Profile", url: "/user/account/profile" },
				{ title: "Change Password", url: "/user/account/change-password" },
				{ title: "Address info", url: "/user/account/address-info" },
				{ title: "Payment Method", url: "/user/account/payment-methods" },
				{ title: "Delete Account", url: "/user/account/delete" },
			],
		},
		{ title: "Settings", url: "/user/settings", icon: Settings },
		{ title: "Get Help", url: "/help-support", icon: Info },
		{ title: "FAQ's", url: "/faqs", icon: HelpCircle },
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link
								href="/user/dashboard"
								className="flex justify-start items-end"
							>
								<Image
									src={tlogo}
									width={32}
									height={32}
									sizes="xs"
									priority
									className="object-contain"
									alt="AshStore Logo"
								/>
								<span className="text-base font-semibold">
									Welcome to AshStore!
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={data.navMain} />
				<hr className="mt-6 mb-2" />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>

			{/* <SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter> */}
		</Sidebar>
	);
}

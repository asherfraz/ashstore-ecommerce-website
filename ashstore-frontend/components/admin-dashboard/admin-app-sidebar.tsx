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
} from "lucide-react";
import { NavMain } from "@/components/admin-dashboard/nav-main";
import { NavSecondary } from "@/components/admin-dashboard/nav-secondary";
import { NavUser } from "@/components/admin-dashboard/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
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
			title: "Dashboard",
			url: "/admin/dashboard",
			icon: LayoutDashboard,
			isActive: false,
		},
		{
			title: "Products",
			url: "/admin/products",
			icon: Package,
			isActive: true,
			items: [
				{ title: "All Products", url: "/admin/products" }, // main inventory list with filters
				{ title: "Add New Product", url: "/admin/products/create" }, // create form
				{ title: "Manage Inventory", url: "/admin/products/inventory" }, // stock adjustments, restock alerts
				{ title: "Product Categories", url: "/admin/products/categories" }, // manage categories & tags
				{ title: "Product History", url: "/admin/products/history" }, // past changes, versions, archives
			],
		},
		{
			title: "Customers",
			url: "/admin/customers",
			icon: Users,
			isActive: true,
			items: [
				{ title: "All Customers", url: "/admin/customers" }, // list view with filters
				{ title: "Customer Segments", url: "/admin/customers/stats" }, // group by behavior, demographics, etc.
				{ title: "View Customers", url: "/admin/customers/view" }, // profile & order history
				{ title: "Manage Customer", url: "/admin/customers/manage" }, // toggle active/inactive
				{ title: "Delete Customer", url: "/admin/customers/delete" }, // account removal
			],
		},
		{
			title: "Orders",
			url: "/admin/orders",
			icon: ShoppingBag,
			isActive: true,
			items: [
				{ title: "All Orders", url: "/admin/orders" }, // main order list with search & filters
				{ title: "Pending Orders", url: "/admin/orders/pending" }, // awaiting confirmation or processing
				{ title: "Shipped Orders", url: "/admin/orders/shipped" }, // dispatched to customers
				{ title: "Returned / Cancelled", url: "/admin/orders/returns" }, // refunds & returns
				{ title: "Order History", url: "/admin/orders/history" }, // full audit trail & past records
			],
		},
		{
			title: "Discounts & Coupons",
			url: "/admin/discounts",
			icon: Percent,
			isActive: true,
			items: [
				{ title: "All Discounts", url: "/admin/discounts" },
				{ title: "Create Discount", url: "/admin/discounts/create" },
				{ title: "Coupon Codes", url: "/admin/discounts/coupons" },
				{ title: "Usage Reports", url: "/admin/discounts/reports" },
			],
		},
		{
			title: "Marketing",
			url: "/admin/promotions",
			icon: Megaphone,
			isActive: true,
			items: [
				{ title: "Create Campaign", url: "/admin/promotions/create" }, // start a new marketing push
				{ title: "Email Campaigns", url: "/admin/promotions/email" }, // newsletters & targeted offers
				{ title: "Social Media Campaigns", url: "/admin/promotions/social" }, // Facebook, Instagram ads
				{ title: "Ongoing Campaigns", url: "/admin/promotions/ongoing" }, // currently running
				{ title: "Campaign Analytics", url: "/admin/promotions/analytics" }, // performance tracking & insights
			],
		},
	],
	navSecondary: [
		{
			title: "Account & Profile",
			url: "/admin/account/profile",
			icon: User,
			items: [
				{ title: "Profile", url: "/admin/account/profile" },
				{ title: "Account Settings", url: "/admin/account/settings" },
			],
		},
		{ title: "Settings", url: "/admin/settings", icon: Settings },
		{ title: "Get Help", url: "/admin/help", icon: HelpCircle },
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
							<Link href="/admin/dashboard">
								<Image
									src={tlogo}
									width={32}
									height={32}
									priority
									className="object-contain"
									alt="AshStore Logo"
								/>
								<span className="text-base font-semibold">AshStore</span>
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

			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}

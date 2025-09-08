"use client";

import { AppSidebar } from "@/components/user-dashboard/app-sidebar";
import { SiteHeader } from "@/components/user-dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import ProtectedByAuth from "@/components/auth/ProtectedByAuth";

export default function UserDashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<ProtectedByAuth>
			<div className="flex min-h-screen bg-background text-foreground">
				<SidebarProvider
					style={
						{
							"--sidebar-width": "calc(var(--spacing) * 72)",
							"--header-height": "calc(var(--spacing) * 12)",
						} as React.CSSProperties
					}
				>
					{/* Sidebar */}
					<AppSidebar
						variant="inset"
						className="relative h-full w-64 shrink-0 border-r border-border bg-muted/30"
					/>

					{/* Main content area */}
					<SidebarInset className="flex flex-1 flex-col">
						<SiteHeader />

						<main className="flex flex-1 flex-col">
							<div className="@container/main flex flex-1 flex-col gap-2 p-4 md:p-6">
								{children}
							</div>
						</main>
					</SidebarInset>
				</SidebarProvider>
			</div>
		</ProtectedByAuth>
	);
}

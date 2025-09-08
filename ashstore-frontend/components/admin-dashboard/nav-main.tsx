"use client";

import { usePathname } from "next/navigation";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: { title: string; url: string }[];
	}[];
}) {
	const pathname = usePathname();

	const isActive = (url: string) =>
		pathname === url || pathname.startsWith(url + "/");

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				{/* Quick Create Promotion */}
				{/* <SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip="Quick Create Promotion"
							className="bg-primary text-secondary dark:text-foreground hover:bg-primary/90"
						>
							<IconCirclePlusFilled />
							<span>Create Promotion</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu> */}

				{/* <SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
						<SidebarMenuButton tooltip={item.title}>
							{item.icon && <item.icon />}
							<span>{item.title}</span>
						</SidebarMenuButton>
						</SidebarMenuItem>
					))}
					</SidebarMenu> */}

				{/* Main Navigation */}
				<SidebarMenu>
					{items.map((item) => {
						const active = isActive(item.url);
						return (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={item.isActive}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton
											tooltip={item.title}
											className={`duration-200 ease-in-out ${
												active
													? "bg-primary text-secondary dark:text-foreground"
													: "hover:bg-muted"
											}`}
										>
											{item.icon && <item.icon />}
											<Link href={item.url} className="flex items-center gap-2">
												<span>{item.title}</span>
											</Link>
											{item.items && (
												<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
											)}
										</SidebarMenuButton>
									</CollapsibleTrigger>

									{item.items && (
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items.map((sub) => {
													const subActive = isActive(sub.url);
													return (
														<SidebarMenuSubItem key={sub.title}>
															<SidebarMenuSubButton
																asChild
																className={`${
																	subActive
																		? "bg-primary/80 text-secondary dark:text-foreground"
																		: "hover:bg-muted"
																}`}
															>
																<Link href={sub.url}>{sub.title}</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									)}
								</SidebarMenuItem>
							</Collapsible>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

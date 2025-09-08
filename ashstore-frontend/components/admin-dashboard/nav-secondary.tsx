"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

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

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavItem = {
	title: string;
	url: string;
	icon: LucideIcon;
	isActive?: true;
	items?: {
		title: string;
		url: string;
	}[];
};

interface NavSecondaryProps
	extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
	items: NavItem[];
}

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
	const pathname = usePathname();

	const isActiveURL = (url: string) =>
		pathname === url || pathname.startsWith(url + "/");

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => {
						const active = isActiveURL(item.url);
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
											<Link
												href={item.url}
												className="flex items-center gap-2 w-full"
											>
												{item.icon && <item.icon className="shrink-0" />}
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
													const subActive = isActiveURL(sub.url);
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

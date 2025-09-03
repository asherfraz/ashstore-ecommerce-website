"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";

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
} from "../collapsible";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: Icon;
		items?: { title: string; url: string }[];
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const pathname = usePathname();

	const isActive = (url: string) =>
		pathname === url || pathname.startsWith(url + "/");

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				{/* <SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild>
								<a href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu> */}
				<SidebarMenu>
					{items.map((item) => {
						const active = isActive(item.url);
						return (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={active}
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

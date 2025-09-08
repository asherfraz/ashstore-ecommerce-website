import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { useDispatch } from "react-redux";

type roles = "buyer" | "seller" | "both";

export function SiteHeader() {
	const disptach = useDispatch();
	const { userRole } = useAuth();

	const handleUserRole = (role: roles, loc: string) => {
		disptach({
			type: "user/setUserRole",
			payload: role,
		});
		redirect(loc);
	};

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<h1 className="text-base font-medium">
					{userRole === "buyer" || userRole === "both"
						? "User"
						: userRole === "seller"
						? "Seller"
						: null}{" "}
					Dashboard
				</h1>
				<div className="ml-auto flex items-center gap-2">
					{userRole === "both" || userRole === "buyer" ? (
						<Button
							variant="ghost"
							asChild
							size="sm"
							className="flex"
							onClick={() => {
								handleUserRole("seller", "/seller/dashboard");
							}}
						>
							<span>Switch to Seller Account</span>
						</Button>
					) : userRole === "seller" ? (
						<Button
							variant="ghost"
							asChild
							size="sm"
							className="flex"
							onClick={() => {
								handleUserRole("buyer", "/user/dashboard");
							}}
						>
							<span>Switch to Buyer Account</span>
						</Button>
					) : null}

					{/* <Separator
						orientation="vertical"
						className="mx-2 data-[orientation=vertical]:h-4"
					/> */}
					{/* Github Profile Button */}
					{/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
						<Link
							href="https://github.com/asherfraz"
							// href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
							rel="noopener noreferrer"
							target="_blank"
							className="dark:text-foreground"
						>
							GitHub
						</Link>
					</Button> */}
				</div>
			</div>
		</header>
	);
}

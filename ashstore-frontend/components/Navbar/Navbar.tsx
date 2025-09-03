"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "../common/ThemeToggle";
import SearchBarInput from "../common/SearchBarInput";
import { Button } from "../ui/button";

import { ChevronRightCircle, ShoppingCartIcon } from "lucide-react";
import { MdMenu, MdMenuOpen } from "react-icons/md";
import { LuLogIn } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa6";

import {
	IconDotsVertical,
	IconLogout,
	IconNotification,
	IconUserCircle,
} from "@tabler/icons-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { Label } from "../ui/label";
import { BackendResponse } from "@/types/types";
import { logout } from "@/api/userApis";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";

type NavbarProps = {
	isLoggedIn?: boolean;
	isAdmin?: boolean;
};

export default function Navbar({
	isLoggedIn = false,
	isAdmin = false,
}: NavbarProps) {
	const router = useRouter();
	const dispatch = useDispatch();
	const [menuOpen, setMenuOpen] = useState(false);

	const { user } = useSelector((state: RootState) => state.user);

	const handleLogOut = async () => {
		// Perform logout logic here
		try {
			const response = (await logout()) as BackendResponse;
			if (response.data.success) {
				// dispatch clear user from redux store
				dispatch({
					type: "user/clearUser",
				});
				// show success toast
				toast.success("Logged out successfully!");
			} else {
				toast.error(response?.response?.data?.message || "Logout failed");
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Error Logging out User!");
		}
	};

	//  Admin Navbar
	if (isAdmin) {
		return (
			<header className="border-none border-border bg-background text-foreground/70 dark:text-foreground/70">
				<div className="container mx-auto flex flex-wrap p-5 items-center justify-between">
					{/* Logo */}
					<Link href="/admin" className="flex items-center mb-4 md:mb-0">
						<Image
							src="/htlogo.png"
							alt="AshStore Admin Logo"
							width={150}
							height={150}
							className="object-contain object-center bg-background dark:bg-white p-2 rounded"
							priority
						/>
					</Link>

					{/* Right side */}
					<div className="flex items-center gap-4">
						{/* Theme toggle */}
						<div className="flex items-center gap-2">
							<span className="hidden md:block">Theme:</span>
							<ThemeToggle />
						</div>

						{isLoggedIn ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="flex items-center space-x-2 cursor-pointer">
										<Avatar className="h-8 w-8 rounded-lg grayscale">
											<AvatarImage src={user?.avatar} alt="Admin profile" />
											<AvatarFallback className="rounded-lg">AD</AvatarFallback>
										</Avatar>
										<div className="hidden md:grid text-left text-sm leading-tight">
											<span className="truncate font-bold">{user?.name}</span>
											<span className="text-muted-foreground truncate text-xs">
												{user?.email}
											</span>
										</div>
										<IconDotsVertical className="hidden md:block ml-auto size-4" />
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="min-w-56 rounded-lg"
									align="end"
								>
									<DropdownMenuLabel className="p-0 font-normal">
										<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
											<Avatar className="h-8 w-8 rounded-lg">
												<AvatarImage
													src={user?.avatar}
													alt={`"${user?.name}" profile`}
												/>
												<AvatarFallback className="rounded-lg">
													{user?.name?.charAt(0) || "GT"}
												</AvatarFallback>
											</Avatar>
											<div className="grid text-left text-sm leading-tight">
												<span className="truncate font-medium">
													{user?.name}
												</span>
												<span className="text-muted-foreground truncate text-xs">
													{user?.email}
												</span>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem
											onClick={() => router.push("/admin/account/profile")}
										>
											<IconUserCircle /> Account
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => router.push("/admin/settings")}
										>
											<IconNotification /> Notifications
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="hover:bg-red-400 hover:text-background dark:hover:bg-red-400 dark:hover:text-background"
										onClick={handleLogOut}
									>
										<IconLogout /> Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button
								className="bg-background text-foreground border-2 border-foreground hover:text-background dark:bg-background dark:text-foreground"
								onClick={() => router.push("/admin/login")}
							>
								Login <LuLogIn className="w-4 h-4 ml-1 animate-pulse" />
							</Button>
						)}
					</div>
				</div>
			</header>
		);
	}

	// Default Navbar for non-admin users
	return (
		<header className="border-none border-border bg-background text-foreground/70 dark:text-foreground/70">
			<div className="container mx-auto flex items-center justify-between p-5">
				{/* Logo */}
				<Link href="/" className="flex items-center">
					<Image
						src="/htlogo.png"
						alt="AshStore Brand Logo"
						width={150}
						height={150}
						className="object-contain object-center bg-background dark:bg-white p-2 rounded"
						priority
					/>
				</Link>

				{/* Desktop Actions */}
				<div className="hidden md:flex items-center gap-3">
					{/* Desktop Nav */}
					<nav className="hidden md:flex  items-center gap-6">
						<Link href="/marketplace" className="hover:text-foreground">
							Shop
						</Link>
						<Link href="/new-arrivals" className="hover:text-foreground">
							New Arrivals
						</Link>
						<Link href="/sale" className="hover:text-foreground">
							Sale
						</Link>
						<ThemeToggle />
						{isLoggedIn && <SearchBarInput />}
					</nav>
					<hr className=" w-px h-6 bg-border hidden md:block" />
					{!isLoggedIn ? (
						<>
							<Button
								className="bg-foreground text-background dark:bg-background dark:text-foreground border-2 dark:border-foreground"
								onClick={() => router.push("/auth/register")}
							>
								Register
								<ChevronRightCircle className="w-4 h-4 ml-1 animate-pulse" />
							</Button>
							<Button
								className="bg-background text-foreground hover:bg-foreground hover:text-background dark:bg-background dark:text-foreground border-2 border-foreground"
								onClick={() => router.push("/auth/login")}
							>
								Login
								<LuLogIn className="w-4 h-4 ml-1 animate-pulse" />
							</Button>
						</>
					) : (
						<>
							<Link
								href="/wishlist"
								className="p-2 border-2 border-foreground rounded hover:bg-black/10 dark:hover:bg-white/20"
							>
								<FaRegHeart />
							</Link>
							<Link
								href="/cart"
								className="p-2 border-2 border-foreground rounded hover:bg-black/10 dark:hover:bg-white/20"
							>
								<ShoppingCartIcon className="w-4 h-4" />
							</Link>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="flex items-center space-x-2 cursor-pointer">
										<Avatar className="h-10 w-10 rounded-lg grayscale">
											<AvatarImage
												src={user?.avatar}
												alt={`${user?.name} profile`}
											/>
											<AvatarFallback className="text-xl rounded-lg">
												{user?.name?.charAt(0) || "GT"}
											</AvatarFallback>
										</Avatar>
										{/* <div className="hidden md:grid text-left text-sm leading-tight">
											<span className="truncate font-bold">
												{user.name}
											</span>
											<span className="text-muted-foreground truncate text-xs">
												{user.email}
											</span>
										</div> */}
										{/* <IconDotsVertical className="ml-auto size-4" /> */}
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="min-w-56 rounded-lg"
									align="end"
								>
									<DropdownMenuLabel className="p-0 font-normal">
										<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
											<Avatar className="h-8 w-8 rounded-lg">
												<AvatarImage src={user?.avatar} alt="Admin" />
												<AvatarFallback className="rounded-lg">
													{user?.name?.charAt(0) || "GT"}
												</AvatarFallback>
											</Avatar>
											<div className="grid text-left text-sm leading-tight">
												<span className="truncate font-medium">
													{user?.name}
												</span>
												<span className="text-muted-foreground truncate text-xs">
													{user?.email}
												</span>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem
											onClick={() => router.push("/admin/account/profile")}
										>
											<IconUserCircle /> Account
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => router.push("/admin/settings")}
										>
											<IconNotification /> Notifications
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										variant="destructive"
										onClick={handleLogOut}
									>
										<IconLogout className="hover:bg-red-400 hover:text-background dark:hover:bg-red-400 dark:hover:text-background" />{" "}
										Log out!
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					)}
				</div>

				{/* Mobile Hamburger */}
				<Button
					className="md:hidden p-2 rounded border border-border bg-transparent"
					onClick={() => setMenuOpen(!menuOpen)}
				>
					{menuOpen ? (
						<MdMenuOpen className="w-6 h-6 text-foreground rotate-180 transition-transform duration-300 ease-in-out" />
					) : (
						<MdMenu className="w-6 h-6 text-foreground" />
					)}
				</Button>
			</div>

			{/* Mobile Menu */}
			{menuOpen && (
				<div className="md:hidden border-t border-border bg-background p-4 space-y-4 px-8">
					<Link href="/marketplace" className="block hover:text-foreground">
						Shop
					</Link>
					<Link href="/new-arrivals" className="block hover:text-foreground">
						New Arrivals
					</Link>
					<Link href="/sale" className="block hover:text-foreground">
						Sale
					</Link>
					<Link href="/wishlist" className="block hover:text-foreground">
						Wishlist
					</Link>
					<Link href="/cart" className="block hover:text-foreground">
						Cart
					</Link>
					<div className="flex justify-start items-center gap-4 mb-4">
						<Label>Theme:</Label>
						<ThemeToggle />
					</div>
					{isLoggedIn && <SearchBarInput />}

					<hr className="my-4 border-border" />

					<div className="flex flex-col gap-2">
						{!isLoggedIn ? (
							<>
								<Button
									className="bg-foreground text-background"
									onClick={() => router.push("/auth/register")}
								>
									Register
									<ChevronRightCircle className="w-4 h-4 ml-1 animate-pulse" />
								</Button>
								<Button
									className="bg-background text-foreground border-2 border-foreground"
									onClick={() => router.push("/auth/login")}
								>
									Login
									<LuLogIn className="w-4 h-4 ml-1 animate-pulse" />
								</Button>
							</>
						) : (
							<div className="flex gap-3">
								{/* <Link
									href="/wishlist"
									className="p-2 border-2 border-foreground rounded"
								>
									<FaRegHeart />
								</Link>
								<Link
									href="/cart"
									className="p-2 border-2 border-foreground rounded"
								>
									<ShoppingCartIcon className="w-4 h-4" />
								</Link> */}
								{/* <Link
									href="/account"
									className="p-2 border-2 border-foreground rounded-full"
								>
									<LuUser className="w-5 h-5" />
								</Link> */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<div className="w-full flex justify-between items-center space-x-2 cursor-pointer">
											<Avatar className="h-8 w-8 rounded-lg grayscale">
												<AvatarImage
													src={user?.avatar}
													alt={`"${user?.name}" profile`}
												/>
												<AvatarFallback className="rounded-lg">
													{user?.name?.charAt(0) || "GT"}
												</AvatarFallback>
											</Avatar>
											<div className="grid text-left text-sm leading-tight">
												<span className="truncate font-bold">{user?.name}</span>
												<span className="text-muted-foreground truncate text-xs">
													{user?.email}
												</span>
											</div>
											<IconDotsVertical className="ml-auto size-4" />
										</div>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="min-w-56 rounded-lg"
										align="end"
									>
										<DropdownMenuLabel className="p-0 font-normal">
											<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
												<Avatar className="h-8 w-8 rounded-lg">
													<AvatarImage
														src={user?.avatar}
														alt={`"${user?.name}" profile`}
													/>
													<AvatarFallback className="rounded-lg">
														{user?.name?.charAt(0) || "GT"}
													</AvatarFallback>
												</Avatar>
												<div className="grid text-left text-sm leading-tight">
													<span className="truncate font-medium">
														{user?.name}
													</span>
													<span className="text-muted-foreground truncate text-xs">
														{user?.email}
													</span>
												</div>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem
												onClick={() => router.push("/admin/account/profile")}
											>
												<IconUserCircle /> Account
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => router.push("/admin/settings")}
											>
												<IconNotification /> Notifications
											</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="hover:bg-red-400 hover:text-background dark:hover:bg-red-400 dark:hover:text-background"
											onClick={handleLogOut}
										>
											<IconLogout /> Log out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	);
}

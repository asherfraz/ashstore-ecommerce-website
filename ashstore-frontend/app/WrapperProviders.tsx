// "use client";

import Footer from "@/components/common/Footer";
import { ThemeProvider } from "next-themes";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { syncAuth } from "@/redux/userSlice";
import useAutoLogin from "@/hooks/useAutoLogin";
import Loading from "./loading";

export default function WrapperProviders({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const dispatch = useDispatch();

	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.user
	);
	//* App load hone par sync karo
	useEffect(() => {
		dispatch(syncAuth());
	}, [dispatch]);

	//* Agar localStorage manually delete ho jaye toh Redux ko update karo
	useEffect(() => {
		const handleStorageChange = () => {
			dispatch(syncAuth());
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [dispatch]);

	const isLoggedIn = isAuthenticated;
	const isAdmin = user?.isAdmin;

	const loading: boolean = useAutoLogin();
	return loading ? (
		<Loading />
	) : (
		// <div className="flex items-center justify-center h-screen">
		// 	<span className="text-xl font-bold">Loading...</span>
		// </div>
		<ThemeProvider attribute="class" defaultTheme="light">
			<div className="flex flex-col min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground">
				{/*  admin logIn */}
				{/* <Navbar isLoggedIn={true} isAdmin={true} /> */}
				{/*  admin logout */}
				{/* <Navbar isLoggedIn={false} isAdmin={true} /> */}
				{/*  user logout */}
				{/* <Navbar isLoggedIn={false} isAdmin={false} /> */}
				{/*  user login */}
				{/* <Navbar isLoggedIn={true} isAdmin={false} /> */}
				<Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />

				{/* main content */}
				<main className="container mx-auto min-h-screen">{children}</main>

				{/* Footer */}
				<Footer />
			</div>
			<div>
				<Toaster
					position="top-right"
					reverseOrder={false}
					toastOptions={{
						duration: 3000,
						style: {
							background: "var(--foreground)",
							color: "var(--background)",
							border: "1px solid var(--border)",
						},
					}}
				/>
			</div>
		</ThemeProvider>
	);
}

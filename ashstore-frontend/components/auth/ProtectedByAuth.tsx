"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ProtectedByAuthProps {
	children: React.ReactNode;
	adminOnly?: boolean;
	redirectUrl?: string;
}

const ProtectedByAuth = ({
	children,
	adminOnly = false,
	redirectUrl = "/auth/login",
}: ProtectedByAuthProps) => {
	const router = useRouter();
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.user
	);

	useEffect(() => {
		// If not authenticated, redirect to login
		if (!isAuthenticated) {
			router.replace(redirectUrl);
			return;
		}

		// If adminOnly is true and user is not an admin, redirect
		if (adminOnly && !user?.isAdmin) {
			router.replace("/");
			return;
		}
	}, [isAuthenticated, user, adminOnly, redirectUrl, router]);

	// Show nothing while checking auth
	if (!isAuthenticated || (adminOnly && !user?.isAdmin)) {
		return null;
	}

	// If authenticated (and admin if required), render children
	return <>{children}</>;
};

export default ProtectedByAuth;

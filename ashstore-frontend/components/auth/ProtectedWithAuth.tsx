"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface WithAuthOptions {
	adminOnly?: boolean;
	redirectUrl?: string;
}

export function ProtectedWithAuth<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	{ adminOnly = false, redirectUrl = "/auth/login" }: WithAuthOptions = {}
) {
	const ComponentWithAuth = (props: P) => {
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

			// If adminOnly is true and user is not an admin, redirect to home page
			if (adminOnly && !user?.isAdmin) {
				router.replace("/");
				return;
			}
		}, [isAuthenticated, user, router]);

		// While checking auth, show nothing
		if (!isAuthenticated || (adminOnly && !user?.isAdmin)) {
			return null;
		}

		// If authenticated, render wrapped component
		return <WrappedComponent {...props} />;
	};

	return ComponentWithAuth;
}

// ✅ Wrap page with auth check
// export default withAuth(ProfilePage,{props});

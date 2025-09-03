"use client";
import store from "@/redux/store";
import ReactLenis from "lenis/react";
import React from "react";
import { Provider } from "react-redux";
import WrapperProviders from "./WrapperProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function HigherWrapper({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ReactLenis root>
			<Provider store={store}>
				<GoogleOAuthProvider
					clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
				>
					<WrapperProviders>{children}</WrapperProviders>
				</GoogleOAuthProvider>
			</Provider>
		</ReactLenis>
	);
}

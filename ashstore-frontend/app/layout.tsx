import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import HigherWrapper from "./HigherWrapper";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
	variable: "--font-roboto-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "AshStore - Premium Clothing E-commerce Website",
	description:
		"Discover the latest trends in fashion with AshStore, your go-to destination for premium clothing and accessories.",
	keywords: ["fashion", "clothing", "e-commerce", "premium"],
	authors: [{ name: "Asher Fraz", url: "https://asherfraz.com" }],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
				<HigherWrapper>{children}</HigherWrapper>
			</body>
		</html>
	);
}

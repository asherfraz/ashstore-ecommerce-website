import { Instagram, InstagramIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { LuLinkedin } from "react-icons/lu";

const CATEGORIES = [
	{ name: "Men", link: "#" },
	{ name: "Women", link: "#" },
	{ name: "Accessories", link: "#" },
	{ name: "Bags", link: "#" },
	{ name: "Shoes", link: "#" },
];

const PAGES = [
	{ name: "Home", link: "/" },
	{ name: "Shop", link: "/shop" },
	{ name: "About", link: "/about" },
	{ name: "Contact", link: "/contact" },
];

const SHOPPING = [
	{ name: "Payment", link: "/payment" },
	{ name: "Delivery options", link: "/delivery" },
	{ name: "Buyer Protection", link: "/protection" },
];

const CUSTOMER_CARE = [
	{ name: "Help Center", link: "/help" },
	{ name: "Returns & refund", link: "/returns" },
	{ name: "Shipping", link: "/shipping" },
	{ name: "Terms & Conditions", link: "/terms" },
	{ name: "Privacy Policy", link: "/privacy" },
	{ name: "FAQs", link: "/faqs" },
];

interface FooterProps {
	isAdmin?: boolean;
}

export default function Footer({ isAdmin = false }: FooterProps) {
	if (isAdmin) {
		return (
			<footer className="text-gray-600 body-font">
				<div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
					<Link
						href="/"
						className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0 sm:border-r-2 sm:border-gray-200"
					>
						<Image
							src="/htlogo.png"
							alt="AshStore Brand Logo"
							width={150}
							height={150}
							loading="lazy"
							className={`object-contain object-center text-background dark:text-foreground p-2 bg-background rounded dark:bg-white `}
						/>
					</Link>
					<div className="w-full flex flex-wrap-reverse grow shrink-2 items-center justify-center sm:justify-end sm:gap-4 gap-2">
						<p className="text-sm text-gray-500 sm:ml-4 sm:pl-4  sm:py-2 sm:mt-0 mt-4">
							© 2025 AshStore — All Rights Reserved.
						</p>
						<nav className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
							<Link href="/marketplace" className="text-gray-500">
								Marketplace
							</Link>
							<Link href="/about" className="ml-3 text-gray-500">
								About us
							</Link>
							<Link href="/contact" className="ml-3 text-gray-500">
								Contact us
							</Link>
						</nav>
					</div>
				</div>
			</footer>
		);
	}

	return (
		<footer className="text-gray-600 body-font">
			<div className="container px-5 py-16 mx-auto flex md:items-center lg:items-start lg:justify-evenly  md:flex-row md:flex-nowrap flex-wrap flex-col">
				<div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
					<Link
						href={"/"}
						className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"
					>
						<Image
							src="/htlogo.png"
							alt="AshStore Brand Logo"
							width={180}
							height={180}
							loading="lazy"
							className={`object-contain object-center text-background dark:text-foreground p-2 bg-background rounded dark:bg-white `}
						/>
						{/* <span className="ml-3 text-xl">AshStore</span> */}
					</Link>
					<p className="mt-2 text-sm text-gray-500">
						Welcome to AshStore, Premium E-commerce store for clothing items
						like men wears, women wears, and accessories related items
					</p>
					<span className="inline-flex sm:ml-auto mt-2 justify-center sm:justify-start">
						<Link href="#" className="text-gray-500">
							<FaFacebook className="w-5 h-5" />
						</Link>
						<Link href="#" className="ml-3 text-gray-500">
							<FaXTwitter className="w-5 h-5" />
						</Link>
						<Link href="#" className="ml-3 text-gray-500">
							<Instagram className="w-5 h-5" />
						</Link>
						<Link href="#" className="ml-3 text-gray-500">
							<LuLinkedin className="w-5 h-5" />
						</Link>
					</span>
				</div>
				<div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
					<div className="lg:w-1/4 md:w-1/2 w-full px-4">
						<h2 className="title-font font-bold text-foreground dark:text-foreground tracking-widest text-sm mb-3">
							CATEGORIES
						</h2>
						<nav className="list-none mb-10">
							<ul>
								{CATEGORIES.map((category, index) => (
									<li key={index}>
										<Link
											href={category.link}
											className="text-gray-600 hover:text-gray-800"
										>
											{category.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
					<div className="lg:w-1/4 md:w-1/2 w-full px-4">
						<h2 className="title-font  font-bold text-foreground dark:text-foreground tracking-widest text-sm mb-3">
							PAGES
						</h2>
						<nav className="list-none mb-10">
							<ul>
								{PAGES.map((page, index) => (
									<li key={index}>
										<Link
											href={page.link}
											className="text-gray-600 hover:text-gray-800"
										>
											{page.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
					<div className="lg:w-1/4 md:w-1/2 w-full px-4">
						<h2 className="title-font font-bold text-foreground dark:text-foreground tracking-widest text-sm mb-3">
							SHOPPING
						</h2>
						<nav className="list-none mb-10">
							<ul>
								{SHOPPING.map((item, index) => (
									<li key={index}>
										<Link
											href={item.link}
											className="text-gray-600 hover:text-gray-800"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
					<div className="lg:w-1/4 md:w-1/2 w-full px-4">
						<h2
							className="title-font  
						font-bold text-foreground dark:text-foreground tracking-widest text-sm mb-3"
						>
							CUSTOMER CARE
						</h2>
						<nav className="list-none mb-10">
							<ul>
								{CUSTOMER_CARE.map((item, index) => (
									<li key={index}>
										<Link
											href={item.link}
											className="text-gray-600 hover:text-gray-800"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
				</div>
			</div>
			<div className="bg-background dark:bg-background">
				<div className="container mx-auto py-4 px-5 flex flex-wrap flex-row justify-center items-center">
					<p className="text-gray-500 text-sm text-center">
						© 2025 AshStore —
						<Link
							href="https://asherfraz.com/"
							rel="noopener noreferrer"
							className="text-gray-600 mr-1"
							target="_blank"
						>
							@asherfraz
						</Link>
					</p>

					<p className="text-gray-500 text-sm text-center ">
						<span className="mr-2">|</span> All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

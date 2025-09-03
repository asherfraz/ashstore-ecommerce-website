"use client";

import React from "react";
import Lottie from "lottie-react";
import notFoundAnimation from "@/public/animations/lonely-404.json";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
	const router = useRouter();

	return (
		<section className="flex flex-col items-center justify-center min-h-screen">
			<div className="flex items-center justify-center mb-4">
				<Lottie
					animationData={notFoundAnimation}
					loop={true}
					className="w-fit md:w-3/4"
				/>
			</div>
			<h1 className="text-4xl text-center font-bold mb-4">
				Oops! Something went wrong.
			</h1>
			<p className="text-lg text-center">
				We're sorry, but it seems like there was an issue loading this page.
				Please try again or return to the homepage.
			</p>
			<br />
			<Button className="mt-4" onClick={() => router.push("/")}>
				Return to Homepage
			</Button>
		</section>
	);
}

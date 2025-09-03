"use client";

import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/public/animations/loading_animation.json";
import { Button } from "@/components/ui/button";
export default function Loading() {
	return (
		<section className="flex flex-col items-center justify-center min-h-screen">
			<div className="flex items-center justify-center mb-4">
				<Lottie
					animationData={loadingAnimation}
					loop={true}
					className="w-fit md:w-3/4"
				/>
			</div>
			<h1 className="text-4xl font-bold mb-4">Loading...</h1>
			<p className="text-lg text-center">
				Please wait while we load the content for you.
			</p>
			<br />
			<Button className="mt-4">Return to Homepage</Button>
		</section>
	);
}

"use client";

import React from "react";
import Lottie from "lottie-react";
import maintenanceAnimation from "@/public/animations/site_under_construction_animation.json";
import { Button } from "@/components/ui/button";

export default function Maintenance() {
	return (
		<section className="flex flex-col items-center justify-center min-h-screen">
			<div className="flex items-center justify-center mb-4">
				<Lottie
					animationData={maintenanceAnimation}
					loop={true}
					className="w-fit md:w-2/5"
				/>
			</div>
			<h1 className="text-4xl text-center font-bold mb-4">Maintenance Mode</h1>
			<p className="text-lg text-center px-4">
				Please wait while we perform maintenance on the site.
			</p>
			<br />
			<Button className="mt-4">Return to Homepage</Button>
		</section>
	);
}

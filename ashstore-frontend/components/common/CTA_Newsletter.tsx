import React from "react";
import { Input } from "../ui/input";
import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import Landing_Section from "../LandingPage_1/Landing_Section";

export default function CTA_Newsletter() {
	return (
		<Landing_Section>
			<div className="flex flex-col items-center gap-4">
				<h2 className="px-4 text-4xl font-extrabold tracking-tight text-foreground">
					Stay in the Loop
				</h2>
				<p className="text-center text-muted-foreground max-w-xl">
					Sign up for our newsletter to receive exclusive offers and updates on
					new arrivals.
				</p>
				<div className="flex w-full max-w-md items-center gap-2">
					<Input
						placeholder="Enter your email"
						type="email"
						aria-label="Email address"
					/>
					<Button>
						<Mail className="mr-2 h-4 w-4" /> Subscribe
					</Button>
				</div>
			</div>
		</Landing_Section>
	);
}

import React from "react";
import { Button } from "../ui/button";

export default function Landing_Hero() {
	return (
		<section
			className="flex min-h-[480px] flex-col items-center justify-center gap-6 rounded-lg bg-cover bg-center p-4 text-center sm:gap-8"
			style={{
				backgroundImage:
					"linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAW5QneSaxkNidQ0O38c7dQKwJdcfnqUZZeck88D7D97_JRIXtshj2HpKuE5jHe463hwtlJvjLrv3ourTtdwXQavmlQBTRkp04qDK1Vh_IA_o_8zzzPbwQ3NiEP5ybPdCi8RgnRl0Q0gd_PDhakLVlhO4j7SNFFWzzPuQyLmKoal_vUZBM7RIdrVes56n1s5KLiiklFVVplJCtkITL88PWPdgpzWv5okcmTcJWKt2H_F2ZzcZOpchYrJr7JaNYdNqs3xopPto5QMMk')",
			}}
		>
			<h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
				Elevate Your Style
			</h1>
			<h2 className="text-sm font-normal text-white sm:text-base">
				Discover the latest trends and timeless classics in fashion.
			</h2>
			<Button
				size="lg"
				variant="default"
				className="bg-foreground text-background"
			>
				Shop Now
			</Button>
		</section>
	);
}

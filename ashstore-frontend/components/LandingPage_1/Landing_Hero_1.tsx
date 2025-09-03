"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Landing_Hero_1() {
	const router = useRouter();

	const plugin = React.useRef(
		Autoplay({ delay: 4000, stopOnInteraction: true })
	);

	const slides = [
		{
			image:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuAW5QneSaxkNidQ0O38c7dQKwJdcfnqUZZeck88D7D97_JRIXtshj2HpKuE5jHe463hwtlJvjLrv3ourTtdwXQavmlQBTRkp04qDK1Vh_IA_o_8zzzPbwQ3NiEP5ybPdCi8RgnRl0Q0gd_PDhakLVlhO4j7SNFFWzzPuQyLmKoal_vUZBM7RIdrVes56n1s5KLiiklFVVplJCtkITL88PWPdgpzWv5okcmTcJWKt2H_F2ZzcZOpchYrJr7JaNYdNqs3xopPto5QMMk",
			title: "Elevate Your Style",
			subtitle: "Discover the latest trends and timeless classics in fashion.",
		},
		{
			image: "https://source.unsplash.com/random/1200x600?fashion",
			title: "Summer Collection",
			subtitle: "Fresh looks to keep you cool and stylish all season.",
		},
		{
			image: "https://source.unsplash.com/random/1200x600?clothes",
			title: "Timeless Classics",
			subtitle: "Wardrobe essentials that never go out of style.",
		},
	];

	return (
		<Carousel
			plugins={[plugin.current]}
			opts={{
				align: "start",
				loop: true,
			}}
			className="w-full h-full min-h-[480px] overflow-hidden"
			onMouseLeave={() => plugin.current.play()}
			onMouseEnter={() => plugin.current.stop()}
		>
			<CarouselContent>
				{slides.map((slide, index) => (
					<CarouselItem key={index}>
						<div
							className="relative flex min-h-[480px] h-[70vh] items-center justify-center rounded-lg bg-cover bg-center"
							style={{ backgroundImage: `url(${slide.image})` }}
						>
							{/* Overlay */}
							<div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 rounded-lg" />

							{/* Foreground content */}
							<div className="relative z-10 flex flex-col items-center justify-center gap-4 p-6 text-center sm:gap-6">
								<h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
									{slide.title}
								</h1>
								<p className="max-w-xl text-sm text-white sm:text-base">
									{slide.subtitle}
								</p>
								<Button
									size="lg"
									variant="default"
									className="bg-foreground text-background hover:opacity-90"
									onClick={() => {
										router.push("/marketplace");
									}}
								>
									Shop Now
								</Button>
							</div>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}

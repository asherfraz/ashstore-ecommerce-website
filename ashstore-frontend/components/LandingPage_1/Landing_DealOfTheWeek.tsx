import React from "react";
import Landing_Section from "./Landing_Section";
import { Card, CardContent } from "../ui/card";

export default function Landing_DealOfTheWeek() {
	return (
		<Landing_Section title="Deal of the Week">
			{/* <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-tight text-foreground">
						Deal of the Week
					</h2> */}
			<Card className="flex flex-col items-stretch rounded-lg xl:flex-row xl:items-start overflow-hidden py-0 ">
				{/* Deal image */}
				<div
					className="aspect-video w-full h-full rounded-lg bg-cover bg-center bg-no-repeat "
					style={{
						backgroundImage: `url(${"https://lh3.googleusercontent.com/aida-public/AB6AXuBPO7Dt6Dmrt98rf92QLHLH2Z09k5GnWowqLWFHYy-OqYBL5b2lRE7GU3Yvb9Pgs1fIk3U58LWEcCRgb-bqUKWZkSujRSncJb0BFBxuZAqK1ipk6VxWrp7jo9kspRpVcEP5mZJ_1QDxP2_vxQUc2afE2_TMehlNFQMzGUxZDdwPQgFThkmCFGA3haOT20WS9fobPLau0O-Kgdd5MN5EjzVsm6U17YVaUDhKjTjPknAjtWwxY20xFKlPI7fFnJl4yBYegLBrXDUr7J8"})`,
					}}
					role="img"
					aria-label="title"
				/>
				{/* Deal content */}
				<CardContent className="h-full flex w-full min-w-fit grow flex-col justify-center gap-2 py-4 xl:px-4">
					<p className="text-2xl font-bold leading-tight tracking-tight text-foreground dark:text-foreground">
						Limited Time Offer: 50% Off All Items!
					</p>
					<div className="flex flex-col gap-1">
						<p className="text-lg text-muted-foreground dark:text-muted-foreground">
							Get 20% off on selected items.
						</p>
						<p className="text-4xl text-muted-foreground">
							Offer ends in:{" "}
							<span className="text-primary dark:text-primary font-extrabold font-mono">
								02d 14h 30m 15s
							</span>
						</p>
					</div>
				</CardContent>
			</Card>
		</Landing_Section>
	);
}

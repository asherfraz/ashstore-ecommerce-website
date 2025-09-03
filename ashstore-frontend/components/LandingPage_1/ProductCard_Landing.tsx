import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

interface ProductCardProps {
	image: string;
	title: string;
	description?: string;
	href?: string;
}

export default function ProductCard({
	image,
	title,
	description,
	href = "#",
}: ProductCardProps) {
	return (
		<Link href={href} className="flex flex-col gap-3 pb-3">
			<div
				className="w-full aspect-[3/4] rounded-lg bg-cover bg-center"
				style={{ backgroundImage: `url(${image})` }}
			/>
			<div>
				<p className="text-foreground text-base font-medium leading-normal">
					{title}
				</p>
				{description && (
					<p className="text-muted-foreground text-sm leading-normal">
						{description}
					</p>
				)}
			</div>
		</Link>
	);
}

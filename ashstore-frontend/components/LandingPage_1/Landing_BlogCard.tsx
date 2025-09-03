import Link from "next/link";

interface BlogCardProps {
	image: string;
	title: string;
	description: string;
	href?: string | undefined;
}

export default function BlogCard({
	image,
	title,
	description,
	href,
}: BlogCardProps) {
	return (
		<Link href={href} className="flex flex-col gap-3 pb-3">
			<div
				// className="w-full aspect-[3/4] rounded-lg bg-cover bg-center"
				className="w-full aspect-[3/2] rounded-lg bg-cover bg-center"
				style={{ backgroundImage: `url(${image})` }}
			/>
			<div>
				<p className="text-foreground text-base font-medium leading-normal">
					{title}
				</p>
				<p className="text-muted-foreground text-sm leading-normal">
					{description}
				</p>
			</div>
		</Link>
	);
}

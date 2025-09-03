import Link from "next/link";

interface CategoryCardProps {
	image: string;
	title: string;
	href?: string | undefined;
}

export default function CategoryCard({
	image,
	title,
	href = "#",
}: CategoryCardProps) {
	return (
		<Link href={href} className="flex flex-col gap-3 pb-3">
			<div
				className="w-full aspect-square rounded-lg bg-cover bg-center"
				style={{ backgroundImage: `url(${image})` }}
			/>
			<p className="text-foreground text-base font-medium leading-normal">
				{title}
			</p>
		</Link>
	);
}

// Landing Page Wrapper

export default function Landing_Section({
	title,
	children,
}: {
	title?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="mt-8">
			{title ? (
				<h2 className="px-4 pb-3 text-[22px] font-bold tracking-tight text-foreground">
					{title}
				</h2>
			) : null}
			<div className="p-4">{children}</div>
		</section>
	);
}

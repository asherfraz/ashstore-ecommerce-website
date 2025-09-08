import { SectionCards } from "@/components/admin-dashboard/section-cards";

export default function AdminSettingsPage() {
	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<h1>Settings </h1>
			<SectionCards />
		</div>
	);
}

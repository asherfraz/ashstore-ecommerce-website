import { ChartAreaInteractive } from "@/components/user-dashboard/chart-area-interactive";
import { DataTable } from "@/components/user-dashboard/data-table";
import { SectionCards } from "@/components/user-dashboard/section-cards";

import data from "../data.json";

export default function AdminDashboardHomePage() {
	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<SectionCards />

			<div className="px-4 lg:px-6">
				<ChartAreaInteractive />
			</div>

			<DataTable data={data} />
		</div>
	);
}

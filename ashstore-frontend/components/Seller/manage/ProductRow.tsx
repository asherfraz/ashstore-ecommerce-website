import { TableCell, TableRow } from "@/components/ui/table";
import { IProduct } from "@/types/types";
import { flexRender } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { ActionCell } from "./ActionCell";

// Memoized Product Row Component
export const ProductRow = memo(
	({
		row,
		products,
		onEdit,
		onView,
		onArchive,
		onDelete,
	}: {
		row: any;
		products: IProduct[];
		onEdit: (product: IProduct) => void;
		onView: (product: IProduct) => void;
		onArchive: (product: IProduct) => void;
		onDelete: (product: IProduct) => void;
	}) => {
		const product = useMemo(() => {
			return products.find((p) => p._id === row.original._id);
		}, [products, row.original._id]);

		if (!product) return null;

		return (
			<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
				{row.getVisibleCells().map((cell: any) => {
					if (cell.column.id === "actions") {
						return (
							<TableCell key={cell.id}>
								<ActionCell
									product={product}
									onEdit={onEdit}
									onView={onView}
									onArchive={onArchive}
									onDelete={onDelete}
								/>
							</TableCell>
						);
					}
					return (
						<TableCell key={cell.id}>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</TableCell>
					);
				})}
			</TableRow>
		);
	}
);
ProductRow.displayName = "ProductRow";

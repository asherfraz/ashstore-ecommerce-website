"use client";

import * as React from "react";
import { memo, useCallback, useMemo } from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { MoreHorizontal } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { IProduct } from "@/types/types";
import formatPrice from "@/helpers/formatPrice";
import { ProductRow } from "./ProductRow";

interface ProductDataTableProps {
	products: IProduct[];
	onEdit: (product: IProduct) => void;
	onView: (product: IProduct) => void;
	onArchive: (product: IProduct) => void;
	onDelete: (product: IProduct) => void;
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	isLoading?: boolean;
}

// Define the table row type
interface TableRow {
	srNo: number;
	title: string;
	brand: string;
	category: string;
	status: string;
	active: boolean;
	onSale: boolean;
	basePrice: number;
	salePrice: number;
	_id: string; // for actions
}

export const ProductDataTable = memo(
	({
		products,
		onEdit,
		onArchive,
		onView,
		onDelete,
		totalPages,
		currentPage,
		onPageChange,
		hasPrevPage,
		hasNextPage,
		isLoading = false,
	}: ProductDataTableProps) => {
		const [sorting, setSorting] = React.useState<SortingState>([]);
		const [columnFilters, setColumnFilters] =
			React.useState<ColumnFiltersState>([]);
		const [columnVisibility, setColumnVisibility] =
			React.useState<VisibilityState>({});
		const [rowSelection, setRowSelection] = React.useState({});

		// Memoized columns definition with proper typing
		const columns: ColumnDef<TableRow>[] = useMemo(
			() => [
				{
					accessorKey: "srNo",
					header: "Sr. No.",
					cell: ({ row }) => <div className="lowercase">{row.index + 1}</div>,
				},
				{
					accessorKey: "title",
					header: "Name",
					cell: ({ row }) => (
						<div className="capitalize">{row.original.title}</div>
					),
				},
				{
					accessorKey: "active",
					header: "Active",
					cell: ({ row }) => (
						<Badge
							variant={row.original.active ? "default" : "secondary"}
							className={
								row.original.active ? "bg-green-500 hover:bg-green-600" : ""
							}
						>
							{row.original.active ? "Yes" : "No"}
						</Badge>
					),
				},
				{
					accessorKey: "brand",
					header: "Brand",
					cell: ({ row }) => (
						<div className="lowercase">{row.original.brand}</div>
					),
				},
				{
					accessorKey: "category",
					header: "Category",
					cell: ({ row }) => {
						// Safely handle category data - it's already processed in tableData
						return <div className="capitalize">{row.original.category}</div>;
					},
				},
				{
					accessorKey: "status",
					header: () => <div className="text-right">Status</div>,
					cell: ({ row }) => {
						return (
							<div className="text-right font-medium">
								{row.original.status}
							</div>
						);
					},
				},
				{
					accessorKey: "onSale",
					header: "Sale",
					cell: ({ row }) => (
						<Badge
							variant={row.original.onSale ? "default" : "secondary"}
							className={
								row.original.onSale ? "bg-green-500 hover:bg-green-600" : ""
							}
						>
							{row.original.onSale ? "Yes" : "No"}
						</Badge>
					),
				},
				{
					accessorKey: "salePrice",
					header: () => <div className="text-right">Price</div>,
					cell: ({ row }) => {
						const basePrice = row.original.basePrice;
						const salePrice = row.original.salePrice;
						const onSale = row.original.onSale;

						// Use sale price if product is on sale and salePrice is valid
						// Otherwise use basePrice
						const displayPrice =
							onSale && salePrice > 0 ? salePrice : basePrice;

						return (
							<div className="text-right font-medium">
								{formatPrice(displayPrice)}
							</div>
						);
					},
				},
				{
					id: "actions",
					enableHiding: false,
					cell: () => null, // Will be handled separately in ProductRow
				},
			],
			[]
		);

		// Memoized table data with safe fallback
		const tableData = useMemo(() => {
			if (!products || !Array.isArray(products)) {
				return [];
			}
			return products.map((product, index) => {
				// Process category safely
				let categoryDisplay = "";
				if (Array.isArray(product.category)) {
					// Take first 2 categories and format them
					categoryDisplay = product.category
						.slice(0, 1)
						.map((cat) => {
							// Ensure category is a string and format it
							if (typeof cat === "string") {
								return cat.toLowerCase();
							}
							return String(cat).toLowerCase();
						})
						.join(", ");
				} else if (product.category) {
					categoryDisplay = String(product.category).toLowerCase();
				}

				// Ensure prices are valid numbers
				const basePrice =
					typeof product.basePrice === "number"
						? product.basePrice
						: typeof product.basePrice === "string"
						? parseFloat(product.basePrice) || 0
						: 0;

				const salePrice =
					typeof product.salePrice === "number"
						? product.salePrice
						: typeof product.salePrice === "string"
						? parseFloat(product.salePrice) || 0
						: 0;

				return {
					srNo: index + 1,
					title: product.title || "",
					brand: product.brand || "",
					category: categoryDisplay,
					active: product.isActive || false,
					status: product.status || "",
					basePrice: basePrice,
					salePrice: salePrice,
					onSale: Boolean(product.onSale), // Ensure boolean value
					_id: product._id || "",
				};
			});
		}, [products]);

		const table = useReactTable({
			data: tableData,
			columns,
			onSortingChange: setSorting,
			onColumnFiltersChange: setColumnFilters,
			getCoreRowModel: getCoreRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			onColumnVisibilityChange: setColumnVisibility,
			onRowSelectionChange: setRowSelection,
			state: {
				sorting,
				columnFilters,
				columnVisibility,
				rowSelection,
			},
		});

		// Memoized callbacks
		const handlePageChange = useCallback(
			(page: number) => {
				onPageChange(page);
			},
			[onPageChange]
		);

		// Safe access to row model
		const rows = table.getRowModel()?.rows;
		const hasRows = rows && rows.length > 0;

		return (
			<div className="w-full">
				<div className="flex items-center py-4">
					<Input
						placeholder="Search products by name..."
						value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("title")?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{hasRows ? (
								rows.map((row) => (
									<ProductRow
										key={row.id}
										row={row}
										products={products}
										onEdit={onEdit}
										onArchive={onArchive}
										onView={onView}
										onDelete={onDelete}
									/>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										{isLoading ? "Loading..." : "No results."}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-between space-x-2 py-4">
					<div className="flex-1 text-sm text-muted-foreground">
						{/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
						{table.getFilteredRowModel().rows.length} row(s) selected. */}
						{table.getFilteredRowModel().rows.length} rows / {totalPages} Pages
					</div>
					<div className="flex items-center space-x-2">
						<Pagination
							totalPages={totalPages}
							currentPage={currentPage}
							onPageChange={handlePageChange}
							siblingCount={1}
							boundaryCount={1}
						/>
					</div>
				</div>
			</div>
		);
	}
);

ProductDataTable.displayName = "ProductDataTable";

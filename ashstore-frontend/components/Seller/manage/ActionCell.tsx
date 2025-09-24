import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IProduct } from "@/types/types";
import { MoreHorizontal } from "lucide-react";
import { memo } from "react";

// Memoized Action Cell Component
export const ActionCell = memo(
	({
		product,
		onEdit,
		onView,
		onArchive,
		onDelete,
	}: {
		product: IProduct;
		onEdit: (product: IProduct) => void;
		onView: (product: IProduct) => void;
		onArchive: (product: IProduct) => void;
		onDelete: (product: IProduct) => void;
	}) => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={() => onView(product)}
					>
						View
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={() => onEdit(product)}
					>
						Edit
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={() => onArchive(product)}
					>
						{product.isActive ? "Archive" : "Unarchive"}
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start text-red-600 hover:text-red-700"
						onClick={() => onDelete(product)}
					>
						Delete
					</Button>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
);
ActionCell.displayName = "ActionCell";

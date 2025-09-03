// // components/pagination/Pagination.tsx
// "use client";

// import * as React from "react";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// type PaginationProps = {
// 	totalPages: number;
// 	currentPage: number;
// 	onPageChange: (page: number) => void;
// 	siblingCount?: number; // how many pages to show around current
// 	boundaryCount?: number; // how many pages to always show at start/end
// 	className?: string;
// };

// const DOTS = "DOTS";

// function createPageRange(start: number, end: number) {
// 	const res: number[] = [];
// 	for (let i = start; i <= end; i++) res.push(i);
// 	return res;
// }

// /**
//  * Returns an array containing page numbers and DOTS markers based on pagination logic.
//  * Example: [1, 2, 'DOTS', 10, 11]
//  */
// function getPaginationRange({
// 	totalPages,
// 	currentPage,
// 	siblingCount,
// 	boundaryCount,
// }: {
// 	totalPages: number;
// 	currentPage: number;
// 	siblingCount: number;
// 	boundaryCount: number;
// }): (number | typeof DOTS)[] {
// 	const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 3; // first/boundary + last/boundary + current + 2 dots

// 	// If the number of pages is small, just return the full range
// 	if (totalPages <= totalPageNumbers) {
// 		return createPageRange(1, totalPages);
// 	}

// 	const leftSiblingIndex = Math.max(
// 		currentPage - siblingCount,
// 		boundaryCount + 2
// 	);
// 	const rightSiblingIndex = Math.min(
// 		currentPage + siblingCount,
// 		totalPages - boundaryCount - 1
// 	);

// 	const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
// 	const shouldShowRightDots =
// 		rightSiblingIndex < totalPages - boundaryCount - 1;

// 	const pages: (number | typeof DOTS)[] = [];

// 	// left boundary
// 	pages.push(...createPageRange(1, boundaryCount));

// 	if (shouldShowLeftDots) {
// 		pages.push(DOTS);
// 	} else {
// 		pages.push(...createPageRange(boundaryCount + 1, leftSiblingIndex - 1));
// 	}

// 	// middle range
// 	pages.push(...createPageRange(leftSiblingIndex, rightSiblingIndex));

// 	if (shouldShowRightDots) {
// 		pages.push(DOTS);
// 	} else {
// 		pages.push(
// 			...createPageRange(rightSiblingIndex + 1, totalPages - boundaryCount)
// 		);
// 	}

// 	// right boundary
// 	pages.push(...createPageRange(totalPages - boundaryCount + 1, totalPages));

// 	return pages;
// }

// export default function Pagination({
// 	totalPages,
// 	currentPage,
// 	onPageChange,
// 	siblingCount = 1,
// 	boundaryCount = 1,
// 	className = "",
// }: PaginationProps) {
// 	const paginationRange = React.useMemo(
// 		() =>
// 			getPaginationRange({
// 				totalPages,
// 				currentPage,
// 				siblingCount,
// 				boundaryCount,
// 			}),
// 		[totalPages, currentPage, siblingCount, boundaryCount]
// 	);

// 	if (totalPages <= 1) return null;

// 	const onPrev = () => onPageChange(Math.max(1, currentPage - 1));
// 	const onNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

// 	return (
// 		<nav
// 			aria-label="Pagination navigation"
// 			className={`inline-flex items-center gap-2 ${className}`}
// 		>
// 			<Button
// 				variant="ghost"
// 				size="icon"
// 				onClick={onPrev}
// 				aria-label="Previous page"
// 				disabled={currentPage === 1}
// 				className="rounded-full p-2"
// 			>
// 				<ChevronLeft className="h-4 w-4 text-foreground" />
// 			</Button>

// 			<div className="hidden sm:inline-flex items-center gap-2">
// 				{paginationRange.map((p, idx) =>
// 					p === DOTS ? (
// 						<span
// 							key={`dots-${idx}`}
// 							className="px-3 py-2 text-sm text-muted-foreground select-none"
// 							aria-hidden
// 						>
// 							&hellip;
// 						</span>
// 					) : (
// 						<Button
// 							key={p}
// 							variant={p === currentPage ? "default" : "ghost"}
// 							size="sm"
// 							onClick={() => onPageChange(Number(p))}
// 							aria-label={
// 								p === currentPage
// 									? `Page ${p}, current page`
// 									: `Go to page ${p}`
// 							}
// 							aria-current={p === currentPage ? "page" : undefined}
// 							className={`h-10 w-10 flex items-center justify-center rounded-full ${
// 								p === currentPage ? "bg-foreground text-background" : ""
// 							}`}
// 						>
// 							<span className="text-sm">{p}</span>
// 						</Button>
// 					)
// 				)}
// 			</div>

// 			{/* compact mobile view: current / total */}
// 			<div className="inline-flex items-center gap-2 sm:hidden text-sm text-muted-foreground px-2">
// 				<span>
// 					{currentPage} / {totalPages}
// 				</span>
// 			</div>

// 			<Button
// 				variant="ghost"
// 				size="icon"
// 				onClick={onNext}
// 				aria-label="Next page"
// 				disabled={currentPage === totalPages}
// 				className="rounded-full p-2"
// 			>
// 				<ChevronRight className="h-4 w-4 text-foreground" />
// 			</Button>
// 		</nav>
// 	);
// }

"use client";

import * as React from "react";
import {
	Pagination as ShadcnPagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationProps = {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
	siblingCount?: number;
	boundaryCount?: number;
	className?: string;
};

const DOTS = "DOTS";

function createPageRange(start: number, end: number) {
	const res: number[] = [];
	for (let i = start; i <= end; i++) res.push(i);
	return res;
}

function getPaginationRange({
	totalPages,
	currentPage,
	siblingCount,
	boundaryCount,
}: {
	totalPages: number;
	currentPage: number;
	siblingCount: number;
	boundaryCount: number;
}): (number | typeof DOTS)[] {
	const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 3;

	if (totalPages <= totalPageNumbers) {
		return createPageRange(1, totalPages);
	}

	const leftSiblingIndex = Math.max(
		currentPage - siblingCount,
		boundaryCount + 2
	);
	const rightSiblingIndex = Math.min(
		currentPage + siblingCount,
		totalPages - boundaryCount - 1
	);

	const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
	const shouldShowRightDots =
		rightSiblingIndex < totalPages - boundaryCount - 1;

	const pages: (number | typeof DOTS)[] = [];

	pages.push(...createPageRange(1, boundaryCount));

	if (shouldShowLeftDots) {
		pages.push(DOTS);
	} else {
		pages.push(...createPageRange(boundaryCount + 1, leftSiblingIndex - 1));
	}

	pages.push(...createPageRange(leftSiblingIndex, rightSiblingIndex));

	if (shouldShowRightDots) {
		pages.push(DOTS);
	} else {
		pages.push(
			...createPageRange(rightSiblingIndex + 1, totalPages - boundaryCount)
		);
	}

	pages.push(...createPageRange(totalPages - boundaryCount + 1, totalPages));

	return pages;
}

export default function Pagination({
	totalPages,
	currentPage,
	onPageChange,
	siblingCount = 1,
	boundaryCount = 1,
	className = "",
}: PaginationProps) {
	const paginationRange = React.useMemo(
		() =>
			getPaginationRange({
				totalPages,
				currentPage,
				siblingCount,
				boundaryCount,
			}),
		[totalPages, currentPage, siblingCount, boundaryCount]
	);

	if (totalPages <= 1) return null;

	return (
		<ShadcnPagination className={className}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => onPageChange(Math.max(1, currentPage - 1))}
						aria-disabled={currentPage === 1}
						className={
							currentPage === 1 ? "pointer-events-none opacity-50" : ""
						}
					/>
				</PaginationItem>

				{paginationRange.map((p, idx) =>
					p === DOTS ? (
						<PaginationItem key={`dots-${idx}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={p}>
							<PaginationLink
								isActive={p === currentPage}
								onClick={() => onPageChange(Number(p))}
								aria-current={p === currentPage ? "page" : undefined}
							>
								{p}
							</PaginationLink>
						</PaginationItem>
					)
				)}

				<PaginationItem>
					<PaginationNext
						onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
						aria-disabled={currentPage === totalPages}
						className={
							currentPage === totalPages ? "pointer-events-none opacity-50" : ""
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</ShadcnPagination>
	);
}

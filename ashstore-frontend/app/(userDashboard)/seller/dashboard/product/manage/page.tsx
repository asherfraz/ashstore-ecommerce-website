// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { ProductDataTable } from "@/components/Seller/manage/ProductDataTable";
// import { IProduct } from "@/types/types";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchSellerProducts } from "@/redux/productThunks";
// import { archiveProduct, deleteProduct } from "@/api/productApis";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import { RootState } from "@/redux/store";
// import toast, { Toast } from "react-hot-toast";

// export default function ManageProductsPage() {
// 	const [loading, setLoading] = useState(true);
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const router = useRouter();
// 	const dispatch = useDispatch();
// 	const { user } = useAuth();

// 	const { sellerProducts, sellerPagination } = useSelector(
// 		(state: RootState) => state.product
// 	);

// 	// Fetch products for a specific page
// 	const fetchPage = useCallback(
// 		async (page: number) => {
// 			try {
// 				toast.error("DEBUG: Fetching BUG");
// 				setLoading(true);
// 				await dispatch(fetchSellerProducts({ page, limit: 10 }) as any);
// 			} catch (error) {
// 				console.error("Error loading products:", error);
// 				toast.error("Failed to load products");
// 			} finally {
// 				setLoading(false);
// 			}
// 		},
// 		[dispatch]
// 	);

// 	// Load initial products
// 	useEffect(() => {
// 		if (user) {
// 			fetchPage(1);
// 		}
// 	}, [user, fetchPage]);

// 	const handleEdit = (product: IProduct) => {
// 		router.push(`/seller/dashboard/product/manage/edit/${product._id}`);
// 	};

// 	const handleView = (product: IProduct) => {
// 		router.push(`/product/${product._id}/${product.slug}`);
// 	};

// 	const handleArchive = (product: IProduct) => {
// 		toast.custom((t: Toast) => (
// 			<div
// 				className={`${
// 					t.visible ? "animate-custom-enter" : "animate-custom-leave"
// 				} max-w-md w-full bg-background shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-yellow-500/50 ring-opacity-5`}
// 			>
// 				<div className="flex-1 w-0 p-4">
// 					<div className="flex items-start">
// 						<div className="flex-shrink-0 pt-0.5">
// 							<img
// 								className="h-full w-12 rounded-lg object-cover object-center"
// 								src={product.images[0]}
// 								alt="Product"
// 							/>
// 						</div>
// 						<div className="ml-3 flex-1">
// 							<p className="text-sm font-medium text-yellow-900 dark:text-yellow-400">
// 								{product.isActive ? "Archive" : "Unarchive"} "{product.title}"?
// 							</p>
// 							<p className="mt-1 text-sm text-gray-500">
// 								This product will be hidden from buyers.
// 							</p>
// 							<p className="mt-1 text-sm text-gray-500">
// 								Details: <br />
// 								Product Serial: {product.psr}
// 							</p>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="flex flex-col items-center justify-center border-l border-gray-200/20">
// 					<button
// 						onClick={async () => {
// 							toast.dismiss(t.id);
// 							try {
// 								await archiveProduct(product._id);
// 								toast.success(
// 									`Product ${product.title} has been ${
// 										product.isActive ? "Archive" : "Unarchive"
// 									} successfully`
// 								);
// 								await dispatch(
// 									fetchSellerProducts({ page: currentPage, limit: 10 }) as any
// 								);
// 							} catch (error: any) {
// 								console.error("Error archiving product:", error);
// 								toast.error(
// 									error.response?.data?.message || "Failed to archive product"
// 								);
// 							}
// 						}}
// 						className="w-full border border-transparent p-3 flex items-center justify-center text-sm font-medium text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 focus:outline-none"
// 					>
// 						Confirm
// 					</button>
// 					<button
// 						onClick={() => toast.dismiss(t.id)}
// 						className="w-full border-t border-transparent p-3 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none"
// 					>
// 						Cancel
// 					</button>
// 				</div>
// 			</div>
// 		));
// 	};

// 	const handleDelete = (product: IProduct) => {
// 		toast.custom((t: Toast) => (
// 			<div
// 				className={`${
// 					t.visible ? "animate-custom-enter" : "animate-custom-leave"
// 				} max-w-md w-full bg-background shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-red-600/50 ring-opacity-5`}
// 			>
// 				<div className="flex-1 w-0 p-4">
// 					<div className="flex items-start">
// 						<div className="flex-shrink-0 pt-0.5">
// 							{/* Optional: Replace with an icon or product image */}
// 							<img
// 								className="h-full w-12 rounded-lg object-cover object-center"
// 								src={product.images[0]}
// 								alt="Product"
// 							/>
// 						</div>
// 						<div className="ml-3 flex-1">
// 							<p className="text-sm font-medium text-gray-900 dark:text-red-800">
// 								Delete "{product.title}"?
// 							</p>
// 							<p className="mt-1 text-sm text-gray-500">
// 								This action cannot be undone.
// 							</p>
// 							<p className="mt-1 text-sm text-gray-500">
// 								Details: <br />
// 								Product Serial: {product.psr}
// 							</p>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="flex flex-col items-center justify-center border-l border-gray-200/20">
// 					<button
// 						onClick={async () => {
// 							toast.dismiss(t.id);
// 							try {
// 								await deleteProduct(product._id);
// 								toast.success("Product deleted successfully");
// 								await dispatch(
// 									fetchSellerProducts({ page: currentPage, limit: 10 }) as any
// 								);
// 							} catch (error: any) {
// 								console.error("Error deleting product:", error);
// 								toast.error(
// 									error.response?.data?.message || "Failed to delete product"
// 								);
// 							}
// 						}}
// 						className="w-full border border-transparent p-3 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-200 focus:outline-none"
// 					>
// 						Confirm
// 					</button>
// 					<button
// 						onClick={() => toast.dismiss(t.id)}
// 						className="w-full border-t border-transparent p-3 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none"
// 					>
// 						Cancel
// 					</button>
// 				</div>
// 			</div>
// 		));
// 	};

// 	const handlePageChange = (page: number) => {
// 		setCurrentPage(page);
// 		fetchPage(page);
// 	};

// 	if (loading && sellerProducts.length === 0) {
// 		return (
// 			<div className="flex items-center justify-center min-h-[400px]">
// 				<div className="text-lg">Loading products...</div>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="w-full p-6">
// 			<div className="flex justify-between items-center mb-6">
// 				<h1 className="text-3xl font-bold">Manage Products</h1>
// 				<button
// 					onClick={() => router.push("/seller/dashboard/product/sell")}
// 					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
// 				>
// 					Add New Product
// 				</button>
// 			</div>

// 			<ProductDataTable
// 				products={sellerProducts}
// 				onEdit={handleEdit}
// 				onView={handleView}
// 				onArchive={handleArchive}
// 				onDelete={handleDelete}
// 				totalPages={sellerPagination.totalPages}
// 				currentPage={sellerPagination.page}
// 				onPageChange={handlePageChange}
// 				hasPrevPage={sellerPagination.hasPrevPage}
// 				hasNextPage={sellerPagination.hasNextPage}
// 				isLoading={loading}
// 			/>
// 		</div>
// 	);
// }

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ProductDataTable } from "@/components/Seller/manage/ProductDataTable";
import { IProduct } from "@/types/types";
import { useSelector, useDispatch } from "react-redux";
import { fetchSellerProducts } from "@/redux/productThunks";
import { archiveProduct, deleteProduct } from "@/api/productApis";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RootState } from "@/redux/store";
import toast, { Toast } from "react-hot-toast";

export default function ManageProductsPage() {
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasFetchedInitial, setHasFetchedInitial] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();
	const { user } = useAuth();

	const { sellerProducts, sellerPagination } = useSelector(
		(state: RootState) => state.product
	);

	// Fetch products for a specific page
	const fetchPage = useCallback(
		async (page: number) => {
			try {
				toast.error("DEBUG: Fetching BUG");
				setLoading(true);
				await dispatch(fetchSellerProducts({ page, limit: 10 }) as any);
			} catch (error) {
				console.error("Error loading products:", error);
				toast.error("Failed to load products");
			} finally {
				setLoading(false);
			}
		},
		[dispatch]
	);

	// Load initial products - only once when user is available
	useEffect(() => {
		if (user && !hasFetchedInitial) {
			fetchPage(1);
			setHasFetchedInitial(true);
		}
	}, [user, hasFetchedInitial, fetchPage]);

	const handleEdit = (product: IProduct) => {
		router.push(`/seller/dashboard/product/manage/edit/${product._id}`);
	};

	const handleView = (product: IProduct) => {
		router.push(`/product/${product._id}/${product.slug}`);
	};

	const handleArchive = (product: IProduct) => {
		toast.custom((t: Toast) => (
			<div
				className={`${
					t.visible ? "animate-custom-enter" : "animate-custom-leave"
				} max-w-md w-full bg-background shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-yellow-500/50 ring-opacity-5`}
			>
				<div className="flex-1 w-0 p-4">
					<div className="flex items-start">
						<div className="flex-shrink-0 pt-0.5">
							<img
								className="h-full w-12 rounded-lg object-cover object-center"
								src={product.images[0]}
								alt="Product"
							/>
						</div>
						<div className="ml-3 flex-1">
							<p className="text-sm font-medium text-yellow-900 dark:text-yellow-400">
								{product.isActive ? "Archive" : "Unarchive"} "{product.title}"?
							</p>
							<p className="mt-1 text-sm text-gray-500">
								This product will be hidden from buyers.
							</p>
							<p className="mt-1 text-sm text-gray-500">
								Details: <br />
								Product Serial: {product.psr}
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center border-l border-gray-200/20">
					<button
						onClick={async () => {
							toast.dismiss(t.id);
							try {
								await archiveProduct(product._id);
								toast.success(
									`Product ${product.title} has been ${
										product.isActive ? "archived" : "unarchived"
									} successfully`
								);
								// Refresh current page after archive
								await dispatch(
									fetchSellerProducts({ page: currentPage, limit: 10 }) as any
								);
							} catch (error: any) {
								console.error("Error archiving product:", error);
								toast.error(
									error.response?.data?.message || "Failed to archive product"
								);
							}
						}}
						className="w-full border border-transparent p-3 flex items-center justify-center text-sm font-medium text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 focus:outline-none"
					>
						Confirm
					</button>
					<button
						onClick={() => toast.dismiss(t.id)}
						className="w-full border-t border-transparent p-3 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none"
					>
						Cancel
					</button>
				</div>
			</div>
		));
	};

	const handleDelete = (product: IProduct) => {
		toast.custom((t: Toast) => (
			<div
				className={`${
					t.visible ? "animate-custom-enter" : "animate-custom-leave"
				} max-w-md w-full bg-background shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-red-600/50 ring-opacity-5`}
			>
				<div className="flex-1 w-0 p-4">
					<div className="flex items-start">
						<div className="flex-shrink-0 pt-0.5">
							<img
								className="h-full w-12 rounded-lg object-cover object-center"
								src={product.images[0]}
								alt="Product"
							/>
						</div>
						<div className="ml-3 flex-1">
							<p className="text-sm font-medium text-gray-900 dark:text-red-800">
								Delete "{product.title}"?
							</p>
							<p className="mt-1 text-sm text-gray-500">
								This action cannot be undone.
							</p>
							<p className="mt-1 text-sm text-gray-500">
								Details: <br />
								Product Serial: {product.psr}
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center border-l border-gray-200/20">
					<button
						onClick={async () => {
							toast.dismiss(t.id);
							try {
								await deleteProduct(product._id);
								toast.success("Product deleted successfully");
								// Refresh current page after delete
								await dispatch(
									fetchSellerProducts({ page: currentPage, limit: 10 }) as any
								);
							} catch (error: any) {
								console.error("Error deleting product:", error);
								toast.error(
									error.response?.data?.message || "Failed to delete product"
								);
							}
						}}
						className="w-full border border-transparent p-3 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-200 focus:outline-none"
					>
						Confirm
					</button>
					<button
						onClick={() => toast.dismiss(t.id)}
						className="w-full border-t border-transparent p-3 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none"
					>
						Cancel
					</button>
				</div>
			</div>
		));
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		fetchPage(page);
	};

	// Show loading only initially
	if (loading && !hasFetchedInitial) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-lg">Loading products...</div>
			</div>
		);
	}

	return (
		<div className="w-full p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Manage Products</h1>
				<button
					onClick={() => router.push("/seller/dashboard/product/sell")}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
				>
					Add New Product
				</button>
			</div>

			<ProductDataTable
				products={sellerProducts}
				onEdit={handleEdit}
				onView={handleView}
				onArchive={handleArchive}
				onDelete={handleDelete}
				totalPages={sellerPagination.totalPages}
				currentPage={sellerPagination.page}
				onPageChange={handlePageChange}
				hasPrevPage={sellerPagination.hasPrevPage}
				hasNextPage={sellerPagination.hasNextPage}
				isLoading={loading}
			/>
		</div>
	);
}

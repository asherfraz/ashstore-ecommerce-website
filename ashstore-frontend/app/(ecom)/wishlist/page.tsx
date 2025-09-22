"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { AiOutlineProduct } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { IProduct } from "@/types/types";
import { addToCart } from "@/redux/cartSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import { clearWishlistApi, getWishlistApi } from "@/api/userApis"; // Import the getWishlistApi function
import { useRouter } from "next/navigation";
import { clearUserWishlist } from "@/redux/userSlice";
import Loading from "@/app/loading";

const WishlistPage = () => {
	const dispatch = useDispatch();
	const router = useRouter();

	const [wishlist, setWishlist] = React.useState<IProduct[]>([]); // State to store the wishlist products
	const [loading, setLoading] = React.useState<boolean>(false); // State for loading
	const [error, setError] = React.useState<string | null>(null); // State for errors

	// Fetch wishlist products from the API on component mount
	React.useEffect(() => {
		const fetchWishlist = async () => {
			setLoading(true);
			try {
				const response = await getWishlistApi(); // Make the API call to fetch the wishlist
				if (response?.data?.success) {
					setWishlist(response.data.wishlist); // Update the state with the fetched wishlist
				}
			} catch (err) {
				setError("Failed to fetch wishlist. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchWishlist();
	}, []); // Empty dependency array ensures this runs once on mount

	// Handle clearing the wishlist
	const handleClearWishlist = async () => {
		try {
			const response = await clearWishlistApi();
			if (response?.data?.success) {
				dispatch(clearUserWishlist());
				toast.success("Wishlist cleared!");
				router.push("/marketplace");
			}
		} catch (error: any) {
			console.error("Clear wishlist error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		}
	};

	// Handle moving all items to the cart
	const handleMoveAllToCart = () => {
		wishlist.forEach((product) => {
			dispatch(addToCart(product));
		});
		toast.success(`Moved ${wishlist.length} items to cart!`);
	};

	// Render loading, error, or the wishlist content
	if (loading) {
		return (
			<Loading />
			// <section className="px-4 md:px-20 flex flex-1 justify-center py-5">
			// 	<div className="flex flex-col max-w-[960px] flex-1 w-full">
			// 		<div className="text-center">Loading...</div>
			// 	</div>
			// </section>
		);
	}

	if (error) {
		return (
			<section className="px-4 md:px-20 flex flex-1 justify-center py-5">
				<div className="flex flex-col max-w-[960px] flex-1 w-full">
					<div className="text-center text-red-500">{error}</div>
				</div>
			</section>
		);
	}

	return (
		<section className="px-4 md:px-20 flex flex-1 justify-center py-5">
			<div className="flex flex-col max-w-[960px] flex-1 w-full">
				{/* Header */}
				<div className="flex flex-wrap justify-between gap-3 p-4">
					<h1 className="text-foreground tracking-tight text-3xl font-bold leading-tight min-w-72">
						My Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
					</h1>
				</div>

				{/* Wishlist Grid */}
				{wishlist && wishlist.length > 0 ? (
					<>
						{/* <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,280px))] justify-center gap-3 p-4"> */}
						<div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,12rem))] justify-center gap-3 p-4">
							{wishlist.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>

						{/* Actions */}
						<div className="flex justify-stretch mt-4">
							<div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
								<Button
									className="bg-primary text-primary-foreground font-bold"
									onClick={handleMoveAllToCart}
								>
									Move All to Cart ({wishlist.length})
								</Button>
								<Button
									variant="secondary"
									className="font-bold"
									onClick={handleClearWishlist}
								>
									Clear Wishlist
								</Button>
							</div>
						</div>
					</>
				) : (
					<div className="flex w-full flex-col items-center justify-center gap-4 py-20 text-center">
						<div className="rounded-full bg-muted p-4">
							<AiOutlineProduct className="h-6 w-6 text-muted-foreground" />
						</div>

						<h3 className="text-lg font-semibold text-foreground">
							Your wishlist is empty.
						</h3>
						<p className="max-w-lg text-sm text-muted-foreground">
							We couldn&apos;t find any products in your wishlist.
						</p>

						<div className="mt-2 flex gap-2">
							<Button asChild>
								<Link href="/marketplace">Go to Shop!</Link>
							</Button>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default WishlistPage;

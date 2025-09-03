"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import ProductCard, { Product } from "@/components/products/ProductCard";
import { AiOutlineProduct } from "react-icons/ai";

// Mock data for wishlist products
const mockWishlist: Product[] = [
	{
		id: "1",
		title: "Cozy Knit Sweater",
		price: "$79.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAnyctGSvV1Ncju0FJjBu7nibN1_E8_1JZzhljebO5X7nktRtCCBrX34HufsD7YUSr0UQFeqC6rDv8ip6FhJD483E9Hg_SG_d2u1Og0tZtKb_KkZQOM8nrHPMHFDpBYPwd82EAmFLxmvh7fjZYRLvx2SjEKTwNaFkxh2PWt6byyQ1hZrvjpCg7hQEkwIXua4a96k51_0n4lkH-_y9o3RWScUPvPf0nMC5hIJWf049j1HOUD5YgurAxI7VdDfPeKsGTawpQVI27WlFE",
		category: "Pants",
	},
	{
		id: "2",
		title: "Classic Denim Jeans",
		price: "$59.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAjrjqww49iRtrTFnnBJRqj1ReLQW2JeB0I6udaOxpGfp_k8wg_C_OzZ096D8QMuR_WbPtgv66aF5nQYtbfwszwSMYe3WEOnJgcPGiiLhb-nJoA5elrYBzaek_aYsYVqfcjbS2XtKvf65xtumpGtdRU8J44C0jk221F4zRzuftebvLc8VcTKUFmDAE1yklbAndavgM89vgi8ST_skg9TkikcP6HYd00I5Hs9R1GFPdpG6o7OdvNLBAVE_stiMsfkXn4A-qDSGprPbo",
		category: "Pants",
	},
	{
		id: "3",
		title: "Leather Ankle Boots",
		price: "$129.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAl1-JCOMsn11QzAd6k3ySO4Un0apCdx1a_De4LgUYMg47qVKCUtYD47WCMvd_NmVT0qHkbRsz_jJaKvQH0bRIeGq8LXkERijpXZHaED7lCMAoC-NM85lhD9a_8nMrwwWXRAS0GOEwqqCuG1026qiwZpiK_PX2AoRP2yPk25sZX73wgmg6iorUk3RS4O47atK6Oy7IVvXR-nudruldzYHNtvlRgXPSlL4kToBnqo_i53xw-lJr8gGcvn7_vnGxiPXgt2AEam8uCQik",
		category: "Pants",
	},
	{
		id: "4",
		title: "Silk Scarf",
		price: "$39.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuATWotcZ5XWjjuRqd2yDEJVho-ENqgDTSB1L_slLns3XRaUQ8GJeGtUJ341cIQ1nsJ12frLZZtYaOWZrCCdbuMcT_xpwgshSVOVRBR1mCq1pjFMw2d6NNsPC8WWwQkJmDPMll2ZzDg_xU4jHoySr3AXcrORVfAngIdM-vhNUHLFYKNZkpGxFDGKXzd-DjfnQjzlqWAyiACRxmcwUPWFo5WlVOK664XZxiHfjbGqm8l1QFOfP0Zsjg_R3-Zk9oBgwyXSuoGmoECE1eM",
		category: "Pants",
	},
	{
		id: "5",
		title: "Cotton T-Shirt",
		price: "$24.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCoS4zYyWgQn33j6zeX-2QmNPMLaWmK2o7iNMzpdpaEoTFiWvzmWPMT-77YLgyfcBzbl02LkuHVf8YiOaCZzXSRLhNCNEhYL-mN-nzqwhWSGwojdk10ffQEjxj48wBgYvzy4n5vo8IZcxlsB4VcXi-oWvQufB2lzYu6jB1OCkSAonfg3Ra-pUnFmo5O6u8cJmr9NFDVJXfgYcD9UZ1BnH9Y-H-o9ekRVcIZZzRQFe9ahqBDVeV6gGFzd5cw8BuiCc-ynL9MBFjmCuc",
		category: "Pants",
	},
	{
		id: "6",
		title: "Tailored Blazer",
		price: "$99.99",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCYsX_9JJLoiS-kvw2elLhOCVeGb0sVy-zneJZj4U4HWBeeAgZQzR8ULmq1M0tQu103_pTgC-znoJaQBQXZGF_dE2j8zgwrY4PxBKsqPyrWytrbABxpwYV55FwZs_e2xOFFWHbW6k3aVyZpmNnqvyShi_9CWGTJGSv1hEklbbL69g2XV-x7y7SE4J20Rtwp_PhUURqlWCwgFoPGlOY1DKusLN4x_BPOhZOLsuHG9qeOZHv0krOQ18HwmcGxvAsGn3dRLr95Z4lL9A4",
		category: "Pants",
	},
];

const WishlistPage = () => {
	const [wishlist, setWishlist] = React.useState<Product[]>(mockWishlist);

	const handleAddToCart = (productId: string) => {
		console.log("Move to cart:", productId);
	};

	const handleToggleWishlist = (productId: string) => {
		setWishlist((prev) => prev.filter((p) => p.id !== productId));
	};

	const handleClearWishlist = () => {
		setWishlist([]);
	};

	return (
		<section className="px-4 md:px-20 flex flex-1 justify-center py-5">
			<div className="flex flex-col max-w-[960px] flex-1 w-full">
				{/* Header */}
				<div className="flex flex-wrap justify-between gap-3 p-4">
					<h1 className="text-foreground tracking-tight text-3xl font-bold leading-tight min-w-72">
						My Wishlist
					</h1>
				</div>

				{/* Wishlist Grid */}
				<div className="grid grid-cols-[repeat(auto-fit,minmax(100px,220px))] justify-center gap-3 p-4">
					{wishlist.length > 0 ? (
						wishlist.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onAddToCart={handleAddToCart}
								onToggleWishlist={handleToggleWishlist}
								isWishlisted
							/>
						))
					) : (
						<div className="flex w-full flex-col items-center justify-center gap-4 py-20 text-center">
							<div className="rounded-full bg-muted p-4">
								<AiOutlineProduct className="h-6 w-6 text-muted-foreground" />
							</div>

							<h3 className="text-lg font-semibold text-foreground">
								Your wishlist is empty.
							</h3>
							<p className="max-w-lg text-sm text-muted-foreground">
								We couldn&lsquo;t find any products in your wishlist.
							</p>

							<div className="mt-2 flex gap-2">
								<Button asChild>
									<a href="/marketplace">Go to Shop!</a>
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Actions */}
				{wishlist.length > 0 && (
					<div className="flex justify-stretch mt-4">
						<div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
							<Button
								className="bg-primary text-primary-foreground font-bold"
								onClick={() => console.log("Move all to cart")}
							>
								Move to Cart
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
				)}
			</div>
		</section>
	);
};

export default WishlistPage;
// export default ProtectedWithAuth(WishlistPage);

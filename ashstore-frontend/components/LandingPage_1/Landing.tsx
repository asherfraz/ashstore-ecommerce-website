import Landing_Section from "./Landing_Section";
import CTA_Newsletter from "../common/CTA_Newsletter";
import Landing_Hero from "./Landing_Hero";
import Landing_DealOfTheWeek from "./Landing_DealOfTheWeek";
import BlogCard from "./Landing_BlogCard";
import CategoryCard from "./Landing_CategoryCard";
import ProductCard from "./ProductCard_Landing";
import Landing_Hero_1 from "./Landing_Hero_1";

export default function LandingPage() {
	return (
		<div className="flex justify-center px-4 sm:px-8 lg:px-8 py-5">
			<div className="flex max-w-full flex-1 flex-col">
				{/* Hero */}
				{/* <Landing_Hero /> */}
				<Landing_Hero_1 />

				{/* Trending Outfits */}
				<Landing_Section title="Trending Outfits">
					<div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuBPO7Dt6Dmrt98rf92QLHLH2Z09k5GnWowqLWFHYy-OqYBL5b2lRE7GU3Yvb9Pgs1fIk3U58LWEcCRgb-bqUKWZkSujRSncJb0BFBxuZAqK1ipk6VxWrp7jo9kspRpVcEP5mZJ_1QDxP2_vxQUc2afE2_TMehlNFQMzGUxZDdwPQgFThkmCFGA3haOT20WS9fobPLau0O-Kgdd5MN5EjzVsm6U17YVaUDhKjTjPknAjtWwxY20xFKlPI7fFnJl4yBYegLBrXDUr7J8"
							title="Men's Collection"
							description="Explore our curated selection of men's fashion."
							href="#"
						/>
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuC0IOpF0EfbRooQI0Kr1dPCrMAjo3Yle9xpsH_MrsbIDzFSuRjcdS17-UMvuz6BTqWq2NDf0aGJR4wiG6x4VwPDQdZns3o3cNuwHownZEsRx5uA5yg4kygdfxjEmzh931HkFRDIv0o-YcqJ68cQaAad74ebPek0jyVDlFspmLPTR7a8FrqYjCSHY1BMvakRv4k9GSwKvJ09RkuaX0X1oyoZAO1PRmZZ1s0x5AbbFpRiTRjZsuIk79L9N1owY1KlpGYsNCszmLsZe0Q"
							title="Women's Collection"
							description="Discover the latest trends in women's clothing."
							href="#"
						/>
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuClEEUa90CAgqwzcx2uPk9pUxnnjXiRzrxwOOp1tubB8oI33kt9ZLLCa9_ldgv9NhrGWFJGmhOF2TrMr0dDPVgia2xJVNRQufKlEzsbDqmNVeXT7-4d4nwHO4pOkNKVF0sgwTKX-bCJ1Hc1YBL_wxJvJwuNwcsrbbfGV94AVzmeZDPldwiYK9-PJ5y9y0LQl-wmV29IQ6Mko0LQc5Knt2G_6vqESesrUNEp8cEiNaVlQDtlALbrkQ13W7d5Dc54w66dseSrzuU_axc"
							title="Accessories"
							description="Complete your look with our stylish accessories."
							href="#"
						/>
					</div>
				</Landing_Section>

				{/* new Arrivals */}
				<Landing_Section title="New Arrivals">
					<div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuBPO7Dt6Dmrt98rf92QLHLH2Z09k5GnWowqLWFHYy-OqYBL5b2lRE7GU3Yvb9Pgs1fIk3U58LWEcCRgb-bqUKWZkSujRSncJb0BFBxuZAqK1ipk6VxWrp7jo9kspRpVcEP5mZJ_1QDxP2_vxQUc2afE2_TMehlNFQMzGUxZDdwPQgFThkmCFGA3haOT20WS9fobPLau0O-Kgdd5MN5EjzVsm6U17YVaUDhKjTjPknAjtWwxY20xFKlPI7fFnJl4yBYegLBrXDUr7J8"
							title="Men's Collection"
							description="Explore our curated selection of men's fashion."
						/>
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuC0IOpF0EfbRooQI0Kr1dPCrMAjo3Yle9xpsH_MrsbIDzFSuRjcdS17-UMvuz6BTqWq2NDf0aGJR4wiG6x4VwPDQdZns3o3cNuwHownZEsRx5uA5yg4kygdfxjEmzh931HkFRDIv0o-YcqJ68cQaAad74ebPek0jyVDlFspmLPTR7a8FrqYjCSHY1BMvakRv4k9GSwKvJ09RkuaX0X1oyoZAO1PRmZZ1s0x5AbbFpRiTRjZsuIk79L9N1owY1KlpGYsNCszmLsZe0Q"
							title="Women's Collection"
							description="Discover the latest trends in women's clothing."
							href="#"
						/>
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuClEEUa90CAgqwzcx2uPk9pUxnnjXiRzrxwOOp1tubB8oI33kt9ZLLCa9_ldgv9NhrGWFJGmhOF2TrMr0dDPVgia2xJVNRQufKlEzsbDqmNVeXT7-4d4nwHO4pOkNKVF0sgwTKX-bCJ1Hc1YBL_wxJvJwuNwcsrbbfGV94AVzmeZDPldwiYK9-PJ5y9y0LQl-wmV29IQ6Mko0LQc5Knt2G_6vqESesrUNEp8cEiNaVlQDtlALbrkQ13W7d5Dc54w66dseSrzuU_axc"
							title="Accessories"
							description="Complete your look with our stylish accessories."
							href="#"
						/>
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuClEEUa90CAgqwzcx2uPk9pUxnnjXiRzrxwOOp1tubB8oI33kt9ZLLCa9_ldgv9NhrGWFJGmhOF2TrMr0dDPVgia2xJVNRQufKlEzsbDqmNVeXT7-4d4nwHO4pOkNKVF0sgwTKX-bCJ1Hc1YBL_wxJvJwuNwcsrbbfGV94AVzmeZDPldwiYK9-PJ5y9y0LQl-wmV29IQ6Mko0LQc5Knt2G_6vqESesrUNEp8cEiNaVlQDtlALbrkQ13W7d5Dc54w66dseSrzuU_axc"
							title="Accessories"
							description="Complete your look with our stylish accessories."
							href="#"
						/>
					</div>
				</Landing_Section>

				{/* Seasonal Collections */}
				<Landing_Section title="Seasonal Collections">
					<div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuBPO7Dt6Dmrt98rf92QLHLH2Z09k5GnWowqLWFHYy-OqYBL5b2lRE7GU3Yvb9Pgs1fIk3U58LWEcCRgb-bqUKWZkSujRSncJb0BFBxuZAqK1ipk6VxWrp7jo9kspRpVcEP5mZJ_1QDxP2_vxQUc2afE2_TMehlNFQMzGUxZDdwPQgFThkmCFGA3haOT20WS9fobPLau0O-Kgdd5MN5EjzVsm6U17YVaUDhKjTjPknAjtWwxY20xFKlPI7fFnJl4yBYegLBrXDUr7J8"
							title="Men's Collection"
							description="Explore our curated selection of men's fashion."
							href="#"
						/>
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuC0IOpF0EfbRooQI0Kr1dPCrMAjo3Yle9xpsH_MrsbIDzFSuRjcdS17-UMvuz6BTqWq2NDf0aGJR4wiG6x4VwPDQdZns3o3cNuwHownZEsRx5uA5yg4kygdfxjEmzh931HkFRDIv0o-YcqJ68cQaAad74ebPek0jyVDlFspmLPTR7a8FrqYjCSHY1BMvakRv4k9GSwKvJ09RkuaX0X1oyoZAO1PRmZZ1s0x5AbbFpRiTRjZsuIk79L9N1owY1KlpGYsNCszmLsZe0Q"
							title="Women's Collection"
							description="Discover the latest trends in women's clothing."
							href="#"
						/>
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuClEEUa90CAgqwzcx2uPk9pUxnnjXiRzrxwOOp1tubB8oI33kt9ZLLCa9_ldgv9NhrGWFJGmhOF2TrMr0dDPVgia2xJVNRQufKlEzsbDqmNVeXT7-4d4nwHO4pOkNKVF0sgwTKX-bCJ1Hc1YBL_wxJvJwuNwcsrbbfGV94AVzmeZDPldwiYK9-PJ5y9y0LQl-wmV29IQ6Mko0LQc5Knt2G_6vqESesrUNEp8cEiNaVlQDtlALbrkQ13W7d5Dc54w66dseSrzuU_axc"
							title="Accessories"
							description="Complete your look with our stylish accessories."
							href="#"
						/>
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuC0IOpF0EfbRooQI0Kr1dPCrMAjo3Yle9xpsH_MrsbIDzFSuRjcdS17-UMvuz6BTqWq2NDf0aGJR4wiG6x4VwPDQdZns3o3cNuwHownZEsRx5uA5yg4kygdfxjEmzh931HkFRDIv0o-YcqJ68cQaAad74ebPek0jyVDlFspmLPTR7a8FrqYjCSHY1BMvakRv4k9GSwKvJ09RkuaX0X1oyoZAO1PRmZZ1s0x5AbbFpRiTRjZsuIk79L9N1owY1KlpGYsNCszmLsZe0Q"
							title="Women's Collection"
							description="Discover the latest trends in women's clothing."
							href="#"
						/>
						<ProductCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuClEEUa90CAgqwzcx2uPk9pUxnnjXiRzrxwOOp1tubB8oI33kt9ZLLCa9_ldgv9NhrGWFJGmhOF2TrMr0dDPVgia2xJVNRQufKlEzsbDqmNVeXT7-4d4nwHO4pOkNKVF0sgwTKX-bCJ1Hc1YBL_wxJvJwuNwcsrbbfGV94AVzmeZDPldwiYK9-PJ5y9y0LQl-wmV29IQ6Mko0LQc5Knt2G_6vqESesrUNEp8cEiNaVlQDtlALbrkQ13W7d5Dc54w66dseSrzuU_axc"
							title="Accessories"
							description="Complete your look with our stylish accessories."
							href="#"
						/>
					</div>
				</Landing_Section>

				{/* shop by category */}
				<Landing_Section title="Shop by Category">
					<div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
						<CategoryCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuBPO7Dt6Dmrt98rf92QLHLH2Z09k5GnWowqLWFHYy-OqYBL5b2lRE7GU3Yvb9Pgs1fIk3U58LWEcCRgb-bqUKWZkSujRSncJb0BFBxuZAqK1ipk6VxWrp7jo9kspRpVcEP5mZJ_1QDxP2_vxQUc2afE2_TMehlNFQMzGUxZDdwPQgFThkmCFGA3haOT20WS9fobPLau0O-Kgdd5MN5EjzVsm6U17YVaUDhKjTjPknAjtWwxY20xFKlPI7fFnJl4yBYegLBrXDUr7J8"
							title="Men's Collection"
							href="#"
						/>
						<CategoryCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuC0IOpF0EfbRooQI0Kr1dPCrMAjo3Yle9xpsH_MrsbIDzFSuRjcdS17-UMvuz6BTqWq2NDf0aGJR4wiG6x4VwPDQdZns3o3cNuwHownZEsRx5uA5yg4kygdfxjEmzh931HkFRDIv0o-YcqJ68cQaAad74ebPek0jyVDlFspmLPTR7a8FrqYjCSHY1BMvakRv4k9GSwKvJ09RkuaX0X1oyoZAO1PRmZZ1s0x5AbbFpRiTRjZsuIk79L9N1owY1KlpGYsNCszmLsZe0Q"
							title="Women's Collection"
							href="#"
						/>
						<CategoryCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuClEEUa90CAgqwzcx2uPk9pUxnnjXiRzrxwOOp1tubB8oI33kt9ZLLCa9_ldgv9NhrGWFJGmhOF2TrMr0dDPVgia2xJVNRQufKlEzsbDqmNVeXT7-4d4nwHO4pOkNKVF0sgwTKX-bCJ1Hc1YBL_wxJvJwuNwcsrbbfGV94AVzmeZDPldwiYK9-PJ5y9y0LQl-wmV29IQ6Mko0LQc5Knt2G_6vqESesrUNEp8cEiNaVlQDtlALbrkQ13W7d5Dc54w66dseSrzuU_axc"
							title="Accessories"
							href="#"
						/>
						<CategoryCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuClEEUa90CAgqwzcx2uPk9pUxnnjXiRzrxwOOp1tubB8oI33kt9ZLLCa9_ldgv9NhrGWFJGmhOF2TrMr0dDPVgia2xJVNRQufKlEzsbDqmNVeXT7-4d4nwHO4pOkNKVF0sgwTKX-bCJ1Hc1YBL_wxJvJwuNwcsrbbfGV94AVzmeZDPldwiYK9-PJ5y9y0LQl-wmV29IQ6Mko0LQc5Knt2G_6vqESesrUNEp8cEiNaVlQDtlALbrkQ13W7d5Dc54w66dseSrzuU_axc"
							title="New Arrivals"
							href="#"
						/>
						<CategoryCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuClEEUa90CAgqwzcx2uPk9pUxnnjXiRzrxwOOp1tubB8oI33kt9ZLLCa9_ldgv9NhrGWFJGmhOF2TrMr0dDPVgia2xJVNRQufKlEzsbDqmNVeXT7-4d4nwHO4pOkNKVF0sgwTKX-bCJ1Hc1YBL_wxJvJwuNwcsrbbfGV94AVzmeZDPldwiYK9-PJ5y9y0LQl-wmV29IQ6Mko0LQc5Knt2G_6vqESesrUNEp8cEiNaVlQDtlALbrkQ13W7d5Dc54w66dseSrzuU_axc"
							title="Sale"
							href="#"
						/>
					</div>
				</Landing_Section>

				{/* Deal of the Week */}
				<Landing_DealOfTheWeek />

				{/* From the Journal */}
				<Landing_Section title="From the Journal">
					<div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
						<BlogCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuBPO7Dt6Dmrt98rf92QLHLH2Z09k5GnWowqLWFHYy-OqYBL5b2lRE7GU3Yvb9Pgs1fIk3U58LWEcCRgb-bqUKWZkSujRSncJb0BFBxuZAqK1ipk6VxWrp7jo9kspRpVcEP5mZJ_1QDxP2_vxQUc2afE2_TMehlNFQMzGUxZDdwPQgFThkmCFGA3haOT20WS9fobPLau0O-Kgdd5MN5EjzVsm6U17YVaUDhKjTjPknAjtWwxY20xFKlPI7fFnJl4yBYegLBrXDUr7J8"
							title="Men's Collection"
							description="Explore our curated selection of men's fashion."
							href="#"
						/>
						<BlogCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuC0IOpF0EfbRooQI0Kr1dPCrMAjo3Yle9xpsH_MrsbIDzFSuRjcdS17-UMvuz6BTqWq2NDf0aGJR4wiG6x4VwPDQdZns3o3cNuwHownZEsRx5uA5yg4kygdfxjEmzh931HkFRDIv0o-YcqJ68cQaAad74ebPek0jyVDlFspmLPTR7a8FrqYjCSHY1BMvakRv4k9GSwKvJ09RkuaX0X1oyoZAO1PRmZZ1s0x5AbbFpRiTRjZsuIk79L9N1owY1KlpGYsNCszmLsZe0Q"
							title="Women's Collection"
							description="Discover the latest trends in women's clothing."
							href="#"
						/>
						<BlogCard
							image="https://lh3.googleusercontent.com/aida-public/AB6AXuClEEUa90CAgqwzcx2uPk9pUxnnjXiRzrxwOOp1tubB8oI33kt9ZLLCa9_ldgv9NhrGWFJGmhOF2TrMr0dDPVgia2xJVNRQufKlEzsbDqmNVeXT7-4d4nwHO4pOkNKVF0sgwTKX-bCJ1Hc1YBL_wxJvJwuNwcsrbbfGV94AVzmeZDPldwiYK9-PJ5y9y0LQl-wmV29IQ6Mko0LQc5Knt2G_6vqESesrUNEp8cEiNaVlQDtlALbrkQ13W7d5Dc54w66dseSrzuU_axc"
							title="Accessories"
							description="Complete your look with our stylish accessories."
							href="#"
						/>
					</div>
				</Landing_Section>

				{/* Newsletter */}
				<div className="my-4 md:my-8">
					<CTA_Newsletter />
				</div>
			</div>
		</div>
	);
}

import { useId, useState, useRef, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setFilters } from "@/redux/productSlice";
import { IProduct } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/redux/productThunks";

export default function SearchBarInputComponent() {
	const id = useId();
	const dispatch = useDispatch();
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Get search results from Redux state
	const { products, filters } = useSelector(
		(state: RootState) => state.product
	);

	// Filter products based on search term
	const searchResults = products.filter(
		(product) =>
			product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.brand.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Handle search input changes with debounce
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);

		if (value.length > 2) {
			setIsOpen(true);
			// Dispatch to update filters and fetch products
			dispatch(setFilters({ search: value }) as any);
			dispatch(fetchProducts({ search: value, limit: 5 }) as any);
		} else {
			setIsOpen(false);
		}
	};

	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Handle product selection
	const handleProductSelect = (product: IProduct) => {
		setSearchTerm(product.title);
		setIsOpen(false);
	};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchTerm.length > 0) {
			dispatch(setFilters({ search: searchTerm }) as any);
			dispatch(fetchProducts({ search: searchTerm, limit: 10 }) as any);
			setIsOpen(false);
		}
	};

	return (
		<div className="*:not-first:mt-2 relative" ref={dropdownRef}>
			<form onSubmit={handleSubmit}>
				<div className="relative w-full md:w-26 hover:w-56 transition-all duration-300 ease-in-out">
					<Input
						ref={inputRef}
						id={id}
						className="peer ps-9 pe-0"
						value={searchTerm}
						onChange={handleSearch}
						onFocus={() => searchTerm.length > 2 && setIsOpen(true)}
						placeholder="Search products..."
						type="search"
					/>
					<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
						<SearchIcon size={16} />
					</div>
				</div>
			</form>

			{/* Dropdown for search results */}
			{isOpen && searchTerm.length > 2 && (
				<div className="absolute w-76 top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto ">
					<div className="w-full p-2">
						{searchResults.length > 0 ? (
							searchResults.map((product) => (
								<div
									key={product._id}
									className="cursor-pointer  p-2 hover:bg-accent rounded-md"
									onClick={() => handleProductSelect(product)}
								>
									<Link
										href={`/product/${product._id}/${product.slug}`}
										className="flex items-center space-x-3 w-full"
									>
										<div className="relative w-10 h-10 flex-shrink-0">
											<Image
												src={product.images[0] || "/placeholder-product.jpg"}
												alt={product.title}
												fill
												className="object-cover rounded"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">
												{product.title}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{product.brand}
											</p>
											<p className="text-sm font-semibold">
												${product.salePrice || product.basePrice}
											</p>
										</div>
									</Link>
								</div>
							))
						) : (
							<div className="p-2 text-sm text-muted-foreground">
								No products found
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

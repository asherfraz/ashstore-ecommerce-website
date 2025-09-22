"use client";

import * as React from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import UploadImageComponent from "./UploadImageComponent";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { Plus, X, DollarSign, Tag, Box, Loader2 } from "lucide-react";
import { createProductSchema } from "@/schemas/product.validation";
import { Checkbox } from "@/components/ui/checkbox";
import { BackendResponse } from "@/types/types";
import { createProduct } from "@/api/productApis";
import toast from "react-hot-toast";

export type CreateProductFormData = z.infer<typeof createProductSchema>;

const PostProductComponent: React.FC = () => {
	const [selectedImage, setSelectedImage] = React.useState(0);
	const [productImages, setProductImages] = React.useState<string[]>([]);
	const [base64Images, setBase64Images] = React.useState<string[]>([]);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		control,
		formState: { errors, isSubmitting },
	} = useForm<CreateProductFormData>({
		resolver: zodResolver(createProductSchema) as any,
		defaultValues: {
			images: [],
			category: [],
			keyFeatures: [{ value: "This is the feature 1." }],
			onSale: false,
			saleTax: 18,
			variants: [{ size: "", color: "" }],
		},
	});

	const {
		fields: featureFields,
		append: appendFeature,
		remove: removeFeature,
	} = useFieldArray({
		control,
		name: "keyFeatures",
	});

	const {
		fields: variantFields,
		append: appendVariant,
		remove: removeVariant,
	} = useFieldArray({
		control,
		name: "variants",
	});

	const [newFeature, setNewFeature] = React.useState("");
	const categories = [
		"Men",
		"Women",
		"Accessories",
		"Men's Accessories",
		"Women's Accessories",
	];
	const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
	const colorOptions = [
		"Black",
		"White",
		"Red",
		"Blue",
		"Green",
		"Yellow",
		"Brown",
		"Gray",
	];

	const watchedValues = watch();
	const onSale = watch("onSale");
	const description = watch("description", "");

	const handleFilesChange = (
		files: FileWithPreview[],
		base64Images: string[]
	) => {
		setBase64Images(base64Images);
		setValue("images", base64Images);
		const previewUrls = files.map((file) => file.preview || "");
		setProductImages(previewUrls);
	};

	// Fixed useEffect to prevent infinite loops
	React.useEffect(() => {
		if (onSale && watchedValues.basePrice) {
			const basePriceNum = parseFloat(watchedValues.basePrice.toString());

			// Only calculate if we have a valid base price
			if (isNaN(basePriceNum)) return;

			// Calculate sale price from discount
			if (
				watchedValues.discount !== undefined &&
				watchedValues.discount !== null
			) {
				const discountNum = parseFloat(watchedValues.discount.toString());
				if (!isNaN(discountNum)) {
					const salePriceValue = (
						basePriceNum *
						(1 - discountNum / 100)
					).toFixed(2);
					setValue("salePrice", parseFloat(salePriceValue), {
						shouldDirty: true,
					});
				}
			}
			// Calculate discount from sale price
			else if (
				watchedValues.salePrice !== undefined &&
				watchedValues.salePrice !== null
			) {
				const salePriceNum = parseFloat(watchedValues.salePrice.toString());
				if (!isNaN(salePriceNum) && basePriceNum > 0) {
					const discountValue = (
						((basePriceNum - salePriceNum) / basePriceNum) *
						100
					).toFixed(2);
					setValue("discount", parseFloat(discountValue), {
						shouldDirty: true,
					});
				}
			}
		}
	}, [
		watchedValues.basePrice,
		watchedValues.salePrice,
		watchedValues.discount,
		onSale,
	]);

	const handleSwitchChange = (checked: boolean) => {
		setValue("onSale", checked);
		if (!checked) {
			setValue("salePrice", undefined);
			setValue("discount", undefined);
		}
	};

	const toggleCategory = (category: string) => {
		const currentCategories = watchedValues.category || [];
		if (currentCategories.includes(category as any)) {
			setValue(
				"category",
				currentCategories.filter((c) => c !== category)
			);
		} else {
			setValue("category", [...currentCategories, category as any]);
		}
	};

	const addFeature = () => {
		if (newFeature.trim() && featureFields.length < 10) {
			appendFeature({ value: newFeature.trim() });
			setNewFeature("");
		}
	};

	const onSubmit = async (data: CreateProductFormData) => {
		// console.log("Form data:", data);

		const transformedData = {
			...data,
			keyFeatures: data.keyFeatures.map((feature) => feature.value),
		};

		try {
			const response = (await createProduct(
				transformedData as any
			)) as BackendResponse;

			if (response?.data?.success) {
				toast.success(response.data.message || "Product creation successful!");
				reset();
			} else {
				toast.error(
					response?.response?.data?.message ||
						"Product creation failed. Please try again."
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Product creation error:", error);
			toast.error(
				error.response?.data?.message ||
					"An unexpected error occurred. Please try again."
			);
		} finally {
			reset();
		}
	};

	return (
		<div className="space-y-6">
			{/* Image Upload Section */}
			<Card className="h-fit">
				<CardHeader className="flex flex-row items-center justify-between py-4">
					<CardTitle>Product Images</CardTitle>
				</CardHeader>
				<CardContent className="p-4 pt-0">
					<div className="flex flex-col-reverse lg:flex-row gap-4">
						<div className="w-full lg:w-1/2 flex flex-col justify-center gap-4">
							<UploadImageComponent onFilesChange={handleFilesChange} />
							{errors.images && (
								<p className="text-destructive text-sm">
									{errors.images.message}
								</p>
							)}
						</div>

						<Separator
							orientation="vertical"
							className="hidden lg:block lg:dark:bg-white/50 mx-2 h-auto"
						/>

						<div className="w-full lg:w-1/2 space-y-3">
							{productImages.length > 0 ? (
								<div>
									<div className="aspect-square w-full relative rounded-lg overflow-hidden">
										<Image
											src={productImages[selectedImage]}
											alt="Product image"
											fill
											className="object-cover"
											priority
										/>
									</div>
									<div className="grid grid-cols-4 gap-2 mt-2">
										{productImages.map((img, idx) => (
											<div
												key={idx}
												className={`aspect-square relative rounded-md overflow-hidden cursor-pointer border-2 ${
													selectedImage === idx
														? "border-primary"
														: "border-transparent"
												}`}
												onClick={() => setSelectedImage(idx)}
											>
												<Image
													src={img}
													alt={`Thumbnail ${idx + 1}`}
													fill
													className="object-cover"
												/>
											</div>
										))}
									</div>
								</div>
							) : (
								<div className="flex flex-col justify-center items-center h-64 text-center text-muted-foreground">
									<p>Upload images to preview here!</p>
									<p className="text-sm mt-1">
										Supported formats: PNG, JPG, JPEG
									</p>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Product Information Section */}
			<Card className="h-fit">
				<CardHeader className="flex flex-row items-center justify-between py-4">
					<CardTitle>Product Information</CardTitle>
				</CardHeader>
				<CardContent className="p-4 pt-0">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Title */}
						<div className="space-y-2">
							<Label htmlFor="title">Product Title *</Label>
							<Input
								id="title"
								{...register("title")}
								placeholder="e.g., Leather Wallet for Men"
								className={errors.title ? "border-destructive" : ""}
							/>
							{errors.title && (
								<p className="text-destructive text-sm">
									{errors.title.message}
								</p>
							)}
						</div>

						{/* Brand */}
						<div className="space-y-2">
							<Label htmlFor="brand">Brand *</Label>
							<Input
								id="brand"
								{...register("brand")}
								placeholder="e.g., AshWear"
								className={errors.brand ? "border-destructive" : ""}
							/>
							{errors.brand && (
								<p className="text-destructive text-sm">
									{errors.brand.message}
								</p>
							)}
						</div>

						{/* Category Selection */}
						<div className="space-y-2">
							<Label>Category *</Label>
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<Badge
										key={category}
										variant={
											watchedValues.category?.includes(category as any)
												? "default"
												: "outline"
										}
										className="cursor-pointer px-3 py-1 transition-all"
										onClick={() => toggleCategory(category)}
									>
										{category}
									</Badge>
								))}
							</div>
							{errors.category && (
								<p className="text-destructive text-sm">
									{errors.category.message}
								</p>
							)}
						</div>

						{/* Description */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label htmlFor="description">Description *</Label>
								<span className="text-xs text-muted-foreground">
									{description.length}/2000
								</span>
							</div>
							<Textarea
								id="description"
								{...register("description")}
								placeholder="Describe your product in detail..."
								rows={4}
								className={errors.description ? "border-destructive" : ""}
							/>
							{errors.description && (
								<p className="text-destructive text-sm">
									{errors.description.message}
								</p>
							)}
						</div>

						{/* Pricing */}
						<div className="space-y-4 p-4 border rounded-lg">
							<h3 className="font-medium flex items-center gap-2">
								<DollarSign className="h-4 w-4" />
								Pricing
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="basePrice">Base Price *</Label>
									<Input
										id="basePrice"
										type="number"
										step="0.01"
										min="0"
										{...register("basePrice", { valueAsNumber: true })}
										placeholder="900"
										className={errors.basePrice ? "border-destructive" : ""}
									/>
									{errors.basePrice && (
										<p className="text-destructive text-sm">
											{errors.basePrice.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="saleTax">Tax (%)</Label>
									<Input
										id="saleTax"
										type="number"
										step="0.1"
										min="0"
										max="100"
										{...register("saleTax", { valueAsNumber: true })}
										placeholder="18"
										className={errors.saleTax ? "border-destructive" : ""}
									/>
									{errors.saleTax && (
										<p className="text-destructive text-sm">
											{errors.saleTax.message}
										</p>
									)}
								</div>
							</div>

							<div className="flex items-center space-x-2 pt-2">
								<Checkbox
									id="onSale"
									checked={onSale}
									onCheckedChange={handleSwitchChange}
								/>
								<Label htmlFor="onSale">
									{onSale ? <span>On Sale</span> : <span>Not On Sale </span>}
								</Label>
							</div>

							{onSale && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
									<div className="space-y-2">
										<Label htmlFor="salePrice">Sale Price</Label>
										<Input
											id="salePrice"
											type="number"
											step="0.01"
											min="0"
											{...register("salePrice", { valueAsNumber: true })}
											placeholder="630"
											className={errors.salePrice ? "border-destructive" : ""}
										/>
										{errors.salePrice && (
											<p className="text-destructive text-sm">
												{errors.salePrice.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="discount">Discount (%)</Label>
										<Input
											id="discount"
											type="number"
											step="0.1"
											min="0"
											max="100"
											{...register("discount", { valueAsNumber: true })}
											placeholder="30"
											className={errors.discount ? "border-destructive" : ""}
										/>
										{errors.discount && (
											<p className="text-destructive text-sm">
												{errors.discount.message}
											</p>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Key Features */}
						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<Tag className="h-4 w-4" />
								Key Features ({featureFields.length}/10)
							</Label>

							{featureFields.map((field, index) => (
								<div key={field.id} className="flex gap-2">
									<Input
										{...register(`keyFeatures.${index}.value` as const)}
										placeholder={`Feature ${index + 1} here...`}
										className={
											errors.keyFeatures?.[index]?.value
												? "border-destructive"
												: ""
										}
									/>
									<Button
										type="button"
										onClick={() => removeFeature(index)}
										variant="outline"
										size="icon"
										disabled={featureFields.length <= 1}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}

							{featureFields.length < 10 && (
								<div className="flex gap-2">
									<Input
										value={newFeature}
										onChange={(e) => setNewFeature(e.target.value)}
										placeholder="Add a new feature"
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addFeature();
											}
										}}
									/>
									<Button
										type="button"
										onClick={addFeature}
										variant="outline"
										className="whitespace-nowrap"
									>
										<Plus className="h-4 w-4 mr-2" />
										Add
									</Button>
								</div>
							)}

							{errors.keyFeatures &&
								typeof errors.keyFeatures.message === "string" && (
									<p className="text-destructive text-sm">
										{errors.keyFeatures.message}
									</p>
								)}
						</div>

						{/* Variants Section */}
						<div className="space-y-4 p-4 border rounded-lg">
							<h3 className="font-medium flex items-center gap-2">
								<Box className="h-4 w-4" />
								Product Variants
							</h3>

							{variantFields.map((field, index) => (
								<div
									key={field.id}
									className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md"
								>
									<div className="w-full space-y-2">
										<Label className="flex items-center gap-1">Size *</Label>
										<div className="relative">
											<Input
												list={`sizeOptions-${index}`}
												{...register(`variants.${index}.size` as const)}
												placeholder="Enter size (max 5 chars)"
												maxLength={5}
												className={
													errors.variants?.[index]?.size
														? "border-destructive"
														: ""
												}
											/>
											<datalist id={`sizeOptions-${index}`}>
												{sizeOptions.map((size) => (
													<option key={size} value={size} />
												))}
											</datalist>
										</div>
										{errors.variants?.[index]?.size && (
											<p className="text-destructive text-sm">
												{errors.variants[index]?.size?.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label className="flex items-center gap-1">Color *</Label>
										<div className="relative">
											<Input
												list={`colorOptions-${index}`}
												{...register(`variants.${index}.color` as const)}
												placeholder="Enter or select color"
												className={
													errors.variants?.[index]?.color
														? "border-destructive"
														: ""
												}
											/>
											<datalist id={`colorOptions-${index}`}>
												{colorOptions.map((color) => (
													<option key={color} value={color} />
												))}
											</datalist>
										</div>
										{errors.variants?.[index]?.color && (
											<p className="text-destructive text-sm">
												{errors.variants[index]?.color?.message}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label>Stock *</Label>
										<Input
											type="number"
											min="0"
											{...register(`variants.${index}.stock` as const, {
												valueAsNumber: true,
											})}
											placeholder="50"
											className={
												errors.variants?.[index]?.stock
													? "border-destructive"
													: ""
											}
										/>
										{errors.variants?.[index]?.stock && (
											<p className="text-destructive text-sm">
												{errors.variants[index]?.stock?.message}
											</p>
										)}
									</div>

									<div className="flex items-end">
										<Button
											type="button"
											onClick={() => removeVariant(index)}
											variant="outline"
											size="icon"
											disabled={variantFields.length <= 1}
											className="h-10"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
							{errors.variants && !errors.variants[0] && (
								<p className="text-destructive text-sm">
									{errors.variants.message}
								</p>
							)}

							<Button
								type="button"
								onClick={() => appendVariant({ size: "", color: "", stock: 1 })}
								variant="outline"
								className="w-full"
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Variant
							</Button>
						</div>

						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								"Save Product Information"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default PostProductComponent;

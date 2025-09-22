import { z } from "zod";

// Define Zod schemas
export const productVariantSchema = z.object({
    size: z
        .string()
        .trim()
        .min(1, "Variant size is required")
        .max(5, "Size must be 5 characters or less")
        .regex(/^[A-Za-z0-9]+$/, "Size must be alphanumeric"),
    color: z
        .string()
        .trim()
        .min(1, "Variant color is required")
        .max(20, "Color must not exceed 20 characters"),
    stock: z.coerce
        .number("Stock must be a number")
        .int("Stock must be an integer")
        .min(0, "Stock cannot be negative")
        .max(9999, "Stock limit exceeded")
        .default(1),
});

export const createProductSchema = z
    .object({
        images: z
            .array(z.string().trim())
            .min(1, "At least one image is required")
            .max(4, "You can upload a maximum of 4 images"),
        title: z
            .string("Product title must be a string")
            .trim()
            .min(1, "Product title is required")
            .max(100, "Title must not exceed 100 characters"),
        brand: z
            .string("Brand must be a string")
            .trim()
            .min(1, "Brand is required")
            .max(50, "Brand name too long"),
        category: z
            .array(
                z.enum([
                    "Men",
                    "Women",
                    "Accessories",
                    "Men's Accessories",
                    "Women's Accessories",
                ])
            )
            .min(1, "At least one category is required")
            .max(3, "You can select up to 3 categories"),
        description: z
            .string("Description must be a string")
            .trim()
            .min(1, "Description is required")
            .max(2000, "Description must not exceed 2000 characters"),
        keyFeatures: z
            .array(
                z.object({
                    value: z
                        .string("Feature must be a string")
                        .trim()
                        .min(1, "Feature cannot be empty")
                        .max(100, "Feature must not exceed 100 characters"),
                })
            )
            .min(1, "At least one key feature is required")
            .max(10, "Maximum of 10 key features allowed"),
        basePrice: z.coerce
            .number("Base price is required")
            .min(0, "Base price cannot be negative")
            .max(100000, "Price exceeds allowed limit"),
        salePrice: z.coerce
            .number("Sale price is required")
            .min(0, "Sale price cannot be negative")
            .max(100000, "Sale price exceeds allowed limit")
            .optional(),
        discount: z.coerce
            .number("Discount is required")
            .min(0, "Discount cannot be negative")
            .max(100, "Discount cannot exceed 100%")
            .optional(),
        onSale: z.boolean().default(false),
        saleTax: z.coerce
            .number("Tax is required")
            .min(0, "Tax cannot be negative")
            .max(100, "Tax must be below 100%")
            .default(18),
        variants: z
            .array(productVariantSchema)
            .min(1, "At least one product variant is required")
            .max(100, "Too many variants"),
    })
    .refine(
        (data) => {
            if (data.onSale && data.salePrice !== undefined) {
                return data.salePrice < data.basePrice;
            }
            return true;
        },
        {
            message: "Sale price must be less than base price",
            path: ["salePrice"],
        }
    );
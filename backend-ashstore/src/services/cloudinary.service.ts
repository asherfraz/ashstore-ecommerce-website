// src/services/cloudinary.service.ts
// import cloudinary from "../config/cloudinary";

// export class CloudinaryService {
//     static async uploadBase64Images(base64Images: string[], folder: string = "AshStore_Products"): Promise<string[]> {
//         const uploadedUrls: string[] = [];

//         for (const base64 of base64Images) {
//             const result = await cloudinary.uploader.upload(base64, {
//                 folder,
//             });

//             uploadedUrls.push(result.secure_url);
//         }

//         return uploadedUrls;
//     }
// }

// src/services/cloudinary.service.ts
import cloudinary from "../config/cloudinary";

export class CloudinaryService {
    static async uploadBase64Images(
        base64Images: string[],
        folder: string = "AshStore_Products"
    ): Promise<string[]> {

        // Add without Error Handling
        //     const uploadPromises = base64Images.map((base64) =>
        //         cloudinary.uploader.upload(base64, { folder })
        //     );

        //     const results = await Promise.all(uploadPromises);
        //     return results.map((result) => result.secure_url);


        // Add Error Handling per Image(robust)
        const uploadPromises = base64Images.map((base64) =>
            cloudinary.uploader.upload(base64, { folder }).catch((err) => {
                console.error("Upload failed:", err);
                return null; // or a placeholder URL
            })
        );

        const results = await Promise.all(uploadPromises);
        // Return URLs for successfully uploaded images
        return results.filter((r) => r !== null).map((r) => r.secure_url);

    }

    static extractPublicIdsFromUrls(urls: string[]): string[] {
        return urls.map((url) => {
            try {
                const urlParts = url.split('/');
                const versionIndex = urlParts.findIndex(part => part.startsWith('v')) + 1;
                const pathParts = urlParts.slice(versionIndex); // Get everything after version

                if (pathParts.length === 0) return '';

                const filename = pathParts.pop() || '';
                const publicId = [...pathParts, filename.split('.')[0]].join('/');

                return publicId;
            } catch (error) {
                console.error('Error extracting public_id from URL:', url, error);
                return '';
            }
        }).filter(publicId => publicId !== '');
    }


    // Method to delete images from Cloudinary
    static async deleteImage(publicId: string): Promise<boolean> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result === 'ok') {
                console.log(`Image with public_id ${publicId} deleted successfully.`);
                return true;
            } else {
                console.error(`Failed to delete image with public_id ${publicId}.`);
                return false;
            }
        } catch (err) {
            console.error("Error deleting image from Cloudinary:", err);
            return false;
        }
    }

    // Method to delete multiple images when products are deleted
    static async deleteImages(publicIds: string[]): Promise<void> {
        const deletionPromises = publicIds.map((publicId) =>
            this.deleteImage(publicId)
        );

        await Promise.all(deletionPromises);
    }



}

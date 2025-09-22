"use client";

import * as React from "react";
import {
	AlertCircleIcon,
	FileIcon,
	ImageIcon,
	Trash2Icon,
	UploadIcon,
	XIcon,
} from "lucide-react";

import {
	FileMetadata,
	formatBytes,
	useFileUpload,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { FileWithPreview } from "@/hooks/use-file-upload";

interface UploadImageComponentProps {
	onFilesChange?: (files: FileWithPreview[], base64Images: string[]) => void;
	initialFiles?: FileMetadata[];
	maxFiles?: number;
	maxSize?: number;
}

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
	const fileType = file.file instanceof File ? file.file.type : file.file.type;

	if (fileType.startsWith("image/")) {
		return <ImageIcon className="size-4 opacity-60" />;
	}
	return <FileIcon className="size-4 opacity-60" />;
};

export default function UploadImageComponent({
	onFilesChange,
	initialFiles = [],
	maxFiles = 4,
	maxSize = 10 * 1024 * 1024,
}: UploadImageComponentProps) {
	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			clearFiles,
			getInputProps,
		},
	] = useFileUpload({
		multiple: true,
		maxFiles,
		maxSize,
		initialFiles,
		accept: "image/png, image/jpg, image/jpeg, image/webp",
	});
	// Convert files to base64 when they change
	React.useEffect(() => {
		const convertFilesToBase64 = async () => {
			const base64Images: string[] = [];

			for (const fileWithPreview of files) {
				if (fileWithPreview.file instanceof File) {
					try {
						const base64 = await convertToBase64(fileWithPreview.file);
						base64Images.push(base64);
					} catch (error) {
						console.error("Error converting file to base64:", error);
					}
				} else {
					// For existing files (FileMetadata), we already have the URL
					base64Images.push(fileWithPreview.file.url);
				}
			}

			onFilesChange?.(files, base64Images);
		};

		convertFilesToBase64();
	}, [files, onFilesChange]);

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			{/* Drop area */}
			<div
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				data-dragging={isDragging || undefined}
				data-files={files.length > 0 || undefined}
				className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-56 flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
			>
				<input
					{...getInputProps({
						accept: "image/png, image/jpg, image/jpeg, image/webp",
					})}
					className="sr-only"
					aria-label="Upload images"
				/>

				{files.length > 0 ? (
					<div className="flex w-full flex-col gap-3">
						<div className="flex items-center justify-between gap-2">
							<h3 className="truncate text-sm font-medium">
								Uploaded Images ({files.length}) / {maxFiles}
							</h3>
							<Button variant="outline" size="sm" onClick={clearFiles}>
								<Trash2Icon
									className="-ms-0.5 size-3.5 opacity-60"
									aria-hidden="true"
								/>
								Remove all
							</Button>
						</div>
						<div className="w-full space-y-2">
							{files.map((file) => (
								<div
									key={file.id}
									className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
								>
									<div className="flex items-center gap-3 overflow-hidden">
										<div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
											{getFileIcon(file)}
										</div>
										<div className="flex min-w-0 flex-col gap-0.5">
											<p className="truncate text-[13px] font-medium">
												{file.file instanceof File
													? file.file.name
													: file.file.name}
											</p>
											<p className="text-muted-foreground text-xs">
												{formatBytes(
													file.file instanceof File
														? file.file.size
														: file.file.size
												)}
											</p>
										</div>
									</div>

									<Button
										size="icon"
										variant="ghost"
										className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
										onClick={() => removeFile(file.id)}
										aria-label="Remove file"
									>
										<XIcon className="size-4" aria-hidden="true" />
									</Button>
								</div>
							))}

							{files.length < maxFiles && (
								<Button
									variant="outline"
									className="mt-2 w-full"
									onClick={openFileDialog}
								>
									<UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
									Add more images
								</Button>
							)}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center text-center">
						<div
							className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
							aria-hidden="true"
						>
							<ImageIcon className="size-4 opacity-60" />
						</div>
						<p className="mb-1.5 text-sm font-medium">Drop your images here</p>
						<p className="text-muted-foreground text-xs">
							PNG, JPG, JPEG, WEBP
						</p>
						<p className="text-muted-foreground text-xs">
							Max {maxFiles} files ∙ Up to {maxSize / 1048576} MB each
						</p>
						<Button variant="outline" className="mt-4" onClick={openFileDialog}>
							<UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
							Select images
						</Button>
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<div
					className="text-destructive flex items-center gap-1 text-xs"
					role="alert"
				>
					<AlertCircleIcon className="size-3 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	);
}

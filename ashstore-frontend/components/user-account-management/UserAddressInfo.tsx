"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import {
	addUserAddress,
	deleteUserAddress,
	updateUserAddress,
} from "@/api/userApis";
import { updateUser } from "@/redux/userSlice";
import toast from "react-hot-toast";
import { addressSchema } from "@/schemas/user.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackendResponse } from "@/types/types";

// Define the type based on the schema
export type AddressFormValues = z.infer<typeof addressSchema>;

export const UserAddressInfo: React.FC = () => {
	const { user } = useAuth();
	const dispatch = useDispatch();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
	const [editingAddress, setEditingAddress] = useState<
		(AddressFormValues & { _id?: string }) | null
	>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<AddressFormValues>({
		resolver: zodResolver(addressSchema) as any,
		defaultValues: {
			addressLine1: "",
			addressLine2: "",
			city: "",
			stateProvince: "",
			postalCode: "",
			country: "Pakistan",
			isDefault: false,
		},
	});

	// Open dialog for adding new address
	const openAddDialog = () => {
		// Check if user already has 5 addresses
		if (user?.addresses && user.addresses.length >= 5) {
			toast.error(
				"Maximum limit of 5 addresses reached. Please delete an existing address before adding a new one."
			);
			return;
		}

		form.reset({
			addressLine1: "",
			addressLine2: "",
			city: "",
			stateProvince: "",
			postalCode: "",
			country: "Pakistan",
			isDefault: user?.addresses?.length === 0,
		});
		setEditingAddress(null);
		setIsDialogOpen(true);
	};

	// Open dialog for editing existing address
	const openEditDialog = (address: AddressFormValues & { _id?: string }) => {
		form.reset({
			addressLine1: address.addressLine1,
			addressLine2: address.addressLine2 || "",
			city: address.city,
			stateProvince: address.stateProvince,
			postalCode: address.postalCode,
			country: address.country,
			isDefault: address.isDefault,
		});
		setEditingAddress(address);
		setIsDialogOpen(true);
	};

	const onSubmit = async (data: AddressFormValues) => {
		if (!user) return;
		console.log("user._id: ", user._id);
		console.log("data: ", data);

		setIsSubmitting(true);
		try {
			let response;

			if (editingAddress && editingAddress._id) {
				// Update existing address
				response = (await updateUserAddress(
					user._id as string,
					editingAddress._id as string,
					data
				)) as BackendResponse;
			} else {
				// Add new address
				response = (await addUserAddress(
					user._id as string,
					data
				)) as BackendResponse;
			}

			if (response?.data?.success) {
				// Update user in Redux store
				dispatch(updateUser(response.data.user));

				toast.success(
					editingAddress
						? "Address updated successfully"
						: "Address added successfully"
				);
				setIsDialogOpen(false);
				form.reset();
			} else {
				toast.error(
					response?.response?.data?.message || "Failed to save address"
				);
			}
		} catch (error: any) {
			console.error("Error saving address:", error);
			toast.error(error.response?.data?.message || "Failed to save address");
		} finally {
			setIsSubmitting(false);
		}
	};

	const setDefaultAddress = async (addressId: string) => {
		if (!user) return;

		try {
			// Find the address in the user's addresses
			const addressToUpdate = user.addresses.find(
				(addr) => addr._id === addressId
			);

			if (!addressToUpdate) {
				toast.error("Address not found");
				return;
			}

			// Create a complete address object with all required fields
			const updatedAddressData = {
				addressLine1: addressToUpdate.addressLine1,
				addressLine2: addressToUpdate.addressLine2 || "",
				city: addressToUpdate.city,
				stateProvince: addressToUpdate.stateProvince,
				postalCode: addressToUpdate.postalCode,
				country: addressToUpdate.country,
				isDefault: true,
			} as AddressFormValues;

			// Update the address to set as default
			const response = (await updateUserAddress(
				user._id,
				addressId,
				updatedAddressData
			)) as BackendResponse;

			if (response?.data?.success) {
				dispatch(updateUser(response.data.user));
				toast.success("Default address updated");
			} else {
				toast.error(
					response?.response?.data?.message || "Failed to set default address"
				);
			}
		} catch (error: any) {
			console.error("Error setting default address:", error);
			toast.error(
				error.response?.data?.message || "Failed to set default address"
			);
		}
	};

	const confirmDelete = (addressId: string) => {
		setAddressToDelete(addressId);
		setIsDeleteDialogOpen(true);
	};

	const deleteAddress = async () => {
		if (!user || !addressToDelete) return;

		try {
			const response = (await deleteUserAddress(
				user._id,
				addressToDelete
			)) as BackendResponse;

			if (response?.data?.success) {
				// Update user in Redux store
				dispatch(updateUser(response.data.user));
				toast.success("Address deleted successfully");
			} else {
				toast.error(
					response?.response?.data?.message || "Failed to delete address"
				);
			}
		} catch (error: any) {
			console.error("Error deleting address:", error);
			toast.error(error.response?.data?.message || "Failed to delete address");
		} finally {
			setIsDeleteDialogOpen(false);
			setAddressToDelete(null);
		}
	};

	if (!user) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="flex justify-center items-center h-40">
						<p>Loading address information...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Address Information</CardTitle>
					<Button onClick={openAddDialog}>
						<Plus className="mr-2 h-4 w-4" />
						Add Address
					</Button>
				</CardHeader>
				<CardContent>
					{user.addresses && user.addresses.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Default</TableHead>
									<TableHead>Address</TableHead>
									<TableHead>City</TableHead>
									<TableHead>State</TableHead>
									<TableHead>Postal Code</TableHead>
									<TableHead>Country</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{user.addresses.map((address: any) => (
									<TableRow key={address._id}>
										<TableCell>
											<Checkbox
												checked={address.isDefault}
												onCheckedChange={() => setDefaultAddress(address._id)}
												disabled={address.isDefault}
											/>
										</TableCell>
										<TableCell>
											<div className="flex flex-col">
												<span className="font-medium">
													{address.addressLine1}
												</span>
												{address.addressLine2 && (
													<span className="text-sm text-muted-foreground">
														{address.addressLine2}
													</span>
												)}
											</div>
										</TableCell>
										<TableCell>{address.city}</TableCell>
										<TableCell>{address.stateProvince || "---"}</TableCell>
										<TableCell>{address.postalCode || "---"}</TableCell>
										<TableCell>{address.country}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => openEditDialog(address)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => confirmDelete(address._id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="text-center py-6">
							<p className="text-muted-foreground mb-4">No addresses found.</p>
							<Button onClick={openAddDialog}>
								<Plus className="mr-2 h-4 w-4" />
								Add Your First Address
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Add/Edit Address Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{editingAddress ? "Edit Address" : "Add New Address"}
						</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control as any}
									name="addressLine1"
									render={({ field }) => (
										<FormItem className="md:col-span-2">
											<FormLabel>Address Line 1</FormLabel>
											<FormControl>
												<Input placeholder="Street address" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control as any}
									name="addressLine2"
									render={({ field }) => (
										<FormItem className="md:col-span-2">
											<FormLabel>Address Line 2 (Optional)</FormLabel>
											<FormControl>
												<Input
													placeholder="Apartment, suite, etc."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control as any}
									name="city"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input placeholder="City" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control as any}
									name="stateProvince"
									render={({ field }) => (
										<FormItem>
											<FormLabel>State/Province</FormLabel>
											<FormControl>
												<Input placeholder="State or province" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control as any}
									name="postalCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Postal Code</FormLabel>
											<FormControl>
												<Input
													placeholder="Postal code"
													value={field.value || ""}
													onChange={field.onChange}
													onBlur={field.onBlur}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control as any}
									name="country"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Country *</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a country" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem
														value="Pakistan"
														defaultValue={"Pakistan"}
													>
														Pakistan
													</SelectItem>
													<SelectItem value="USA" disabled>
														United States
													</SelectItem>
													<SelectItem value="UK" disabled>
														United Kingdom
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control as any}
									name="isDefault"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 md:col-span-2 pt-2">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>Set as default address</FormLabel>
											</div>
										</FormItem>
									)}
								/>
							</div>

							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting
										? "Saving..."
										: editingAddress
										? "Update Address"
										: "Add Address"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this address? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={deleteAddress}>
							Delete Address
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

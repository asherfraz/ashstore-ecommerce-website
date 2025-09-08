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
import { Edit, Plus, Trash2, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { updateUser } from "@/redux/userSlice";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentMethodSchema } from "@/schemas/user.validations";
import {
	addUserPaymentMethod,
	deleteUserPaymentMethod,
	updateUserPaymentMethod,
} from "@/api/userApis";
import { BackendResponse } from "@/types/types";

// Define the type based on the schema
export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export const UserPaymentMethods: React.FC = () => {
	const { user } = useAuth();
	const dispatch = useDispatch();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<
		string | null
	>(null);
	const [editingPaymentMethod, setEditingPaymentMethod] = useState<
		(PaymentMethodFormValues & { _id?: string }) | null
	>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<PaymentMethodFormValues>({
		resolver: zodResolver(paymentMethodSchema) as any,
		defaultValues: {
			type: "card",
			cardNumber: "",
			expirationDate: "",
			cvv: "",
			phoneNumber: "",
			transactionId: "",
			isDefault: false,
		},
	});

	// Watch the payment method type to conditionally show fields
	const paymentMethodType = form.watch("type");

	// Open dialog for adding new payment method
	const openAddDialog = () => {
		// Check if user already has 5 payment methods
		if (user?.paymentMethods && user.paymentMethods.length >= 5) {
			toast.error(
				"Maximum limit of 5 payment methods reached. Please delete an existing payment method before adding a new one."
			);
			return;
		}

		form.reset({
			type: "card",
			cardNumber: "",
			expirationDate: "",
			cvv: "",
			phoneNumber: "",
			transactionId: "",
			isDefault: user?.paymentMethods?.length === 0,
		});
		setEditingPaymentMethod(null);
		setIsDialogOpen(true);
	};

	// Open dialog for editing existing payment method
	const openEditDialog = (
		paymentMethod: PaymentMethodFormValues & { _id?: string }
	) => {
		form.reset({
			type: paymentMethod.type,
			cardNumber: paymentMethod.cardNumber || "",
			expirationDate: paymentMethod.expirationDate || "",
			cvv: paymentMethod.cvv || "",
			phoneNumber: paymentMethod.phoneNumber || "",
			transactionId: paymentMethod.transactionId || "",
			isDefault: paymentMethod.isDefault,
		});
		setEditingPaymentMethod(paymentMethod);
		setIsDialogOpen(true);
	};

	const onSubmit = async (data: PaymentMethodFormValues) => {
		if (!user) return;

		setIsSubmitting(true);
		try {
			let response;
			if (editingPaymentMethod?._id) {
				response = (await updateUserPaymentMethod(
					user._id,
					editingPaymentMethod._id,
					data
				)) as BackendResponse;
			} else {
				response = (await addUserPaymentMethod(
					user._id,
					data
				)) as BackendResponse;
			}

			if (response?.data.success) {
				dispatch(updateUser(response.data.user));
				toast.success(
					editingPaymentMethod
						? "Payment method updated successfully"
						: "Payment method added successfully"
				);
				setIsDialogOpen(false);
				form.reset();
			} else {
				toast.error(
					response?.response?.data.message || "Failed to save payment method"
				);
			}
		} catch (error: any) {
			console.error("Error saving payment method:", error.message);
			toast.error(
				error.response?.data?.message || "Failed to save payment method"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const setDefaultPaymentMethod = async (paymentMethodId: string) => {
		if (!user) return;

		try {
			// Find the payment method in the user's payment methods
			const paymentMethodToUpdate = user.paymentMethods.find(
				(pm) => pm._id === paymentMethodId
			);

			if (!paymentMethodToUpdate) {
				toast.error("Payment method not found");
				return;
			}

			// Create a complete payment method object with all required fields
			const updatedPaymentMethodData = {
				type: paymentMethodToUpdate.type,
				cardNumber: paymentMethodToUpdate.cardNumber || "",
				expirationDate: paymentMethodToUpdate.expirationDate || "",
				cvv: paymentMethodToUpdate.cvv || "",
				phoneNumber: paymentMethodToUpdate.phoneNumber || "",
				transactionId: paymentMethodToUpdate.transactionId || "",
				isDefault: true,
			};

			const response = (await updateUserPaymentMethod(
				user._id as string,
				paymentMethodId as string,
				updatedPaymentMethodData
			)) as BackendResponse;

			if (response?.data.success) {
				dispatch(updateUser(response.data.user));
				toast.success("Default payment method updated");
			} else {
				toast.error(
					response?.response?.data.message ||
						"Failed to set default payment method"
				);
			}
		} catch (error: any) {
			console.error("Error setting default payment method:", error);
			toast.error(
				error.response?.data?.message || "Failed to set default payment method"
			);
		}
	};

	const confirmDelete = (paymentMethodId: string) => {
		setPaymentMethodToDelete(paymentMethodId);
		setIsDeleteDialogOpen(true);
	};

	const deletePaymentMethod = async () => {
		if (!user || !paymentMethodToDelete) return;

		try {
			const response = (await deleteUserPaymentMethod(
				user._id as string,
				paymentMethodToDelete as string
			)) as BackendResponse;

			if (response?.data.success) {
				dispatch(updateUser(response.data.user));
				toast.success("Payment method deleted successfully");
			} else {
				toast.error(
					response?.response?.data.message || "Failed to delete payment method"
				);
			}
		} catch (error: any) {
			console.error("Error deleting payment method:", error);
			toast.error(
				error.response?.data?.message || "Failed to delete payment method"
			);
		} finally {
			setIsDeleteDialogOpen(false);
			setPaymentMethodToDelete(null);
		}
	};

	// Format card number for display
	const formatCardNumber = (cardNumber: string) => {
		if (!cardNumber) return "•••• •••• •••• ••••";
		return cardNumber.replace(/(\d{4})/g, "$1 ").trim();
	};

	if (!user) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="flex justify-center items-center h-40">
						<p>Loading payment methods...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Payment Methods</CardTitle>
					<Button onClick={openAddDialog}>
						<Plus className="mr-2 h-4 w-4" />
						Add Payment Method
					</Button>
				</CardHeader>
				<CardContent>
					{user.paymentMethods && user.paymentMethods.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Default</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Details</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{user.paymentMethods.map((paymentMethod: any) => (
									<TableRow key={paymentMethod._id}>
										<TableCell>
											<Checkbox
												checked={paymentMethod.isDefault}
												onCheckedChange={() =>
													setDefaultPaymentMethod(paymentMethod._id)
												}
												disabled={paymentMethod.isDefault}
											/>
										</TableCell>
										<TableCell>
											<div className="flex items-center">
												<CreditCard className="mr-2 h-4 w-4" />
												<span className="capitalize">{paymentMethod.type}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-col">
												{paymentMethod.type === "card" && (
													<>
														<span className="font-medium">
															{formatCardNumber(paymentMethod.cardNumber)}
														</span>
														<span className="text-sm text-muted-foreground">
															Exp: {paymentMethod.expirationDate || "••/••"}
														</span>
													</>
												)}
												{paymentMethod.type !== "card" && (
													<>
														<span className="font-medium">
															{paymentMethod.phoneNumber || "No phone number"}
														</span>
														{paymentMethod.transactionId && (
															<span className="text-sm text-muted-foreground">
																TXN: {paymentMethod.transactionId}
															</span>
														)}
													</>
												)}
											</div>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => openEditDialog(paymentMethod)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => confirmDelete(paymentMethod._id)}
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
							<p className="text-muted-foreground mb-4">
								No payment methods found.
							</p>
							<Button onClick={openAddDialog}>
								<Plus className="mr-2 h-4 w-4" />
								Add Your First Payment Method
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Add/Edit Payment Method Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{editingPaymentMethod
								? "Edit Payment Method"
								: "Add New Payment Method"}
						</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control as any}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Payment Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a payment type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="card">Credit/Debit Card</SelectItem>
												<SelectItem value="easypaisa">EasyPaisa</SelectItem>
												<SelectItem value="jazzcash">JazzCash</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{paymentMethodType === "card" && (
								<>
									<FormField
										control={form.control as any}
										name="cardNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Card Number</FormLabel>
												<FormControl>
													<Input
														placeholder="1234 5678 9012 3456"
														value={field.value || ""}
														onChange={field.onChange}
														onBlur={field.onBlur}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control as any}
											name="expirationDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Expiration Date</FormLabel>
													<FormControl>
														<Input
															placeholder="MM/YY"
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
											name="cvv"
											render={({ field }) => (
												<FormItem>
													<FormLabel>CVV</FormLabel>
													<FormControl>
														<Input
															placeholder="123"
															value={field.value || ""}
															onChange={field.onChange}
															onBlur={field.onBlur}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</>
							)}

							{(paymentMethodType === "easypaisa" ||
								paymentMethodType === "jazzcash") && (
								<>
									<FormField
										control={form.control as any}
										name="phoneNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone Number</FormLabel>
												<FormControl>
													<Input
														placeholder="03XX XXXXXXX"
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
										name="transactionId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Transaction ID (Optional)</FormLabel>
												<FormControl>
													<Input
														placeholder="TXN123456"
														disabled
														value={field.value || ""}
														onChange={field.onChange}
														onBlur={field.onBlur}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							<FormField
								control={form.control as any}
								name="isDefault"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Set as default payment method</FormLabel>
										</div>
									</FormItem>
								)}
							/>

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
										: editingPaymentMethod
										? "Update Payment Method"
										: "Add Payment Method"}
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
							Are you sure you want to delete this payment method? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={deletePaymentMethod}>
							Delete Payment Method
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

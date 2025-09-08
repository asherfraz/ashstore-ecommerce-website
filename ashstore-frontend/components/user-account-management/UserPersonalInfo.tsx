"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import { User, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { updateUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { updateUserById } from "@/api/userApis";
import { BackendResponse } from "@/types/types";
import { profileUpdateSchema } from "@/schemas/user.validations";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import capitalizeWords from "@/helpers/capitalizeWords";
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

export type PersonalInfoValues = z.infer<typeof profileUpdateSchema>;

interface UserPersonalInfoProps {
	editButtonMode?: boolean;
}

export const UserPersonalInfo: React.FC<UserPersonalInfoProps> = ({
	editButtonMode = true,
}) => {
	const { user } = useAuth();
	const [open, setOpen] = React.useState(false);
	const dispatch = useDispatch();

	const form = useForm<PersonalInfoValues>({
		resolver: zodResolver(profileUpdateSchema),
		defaultValues: {
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			phone: user?.phone || "",
		},
	});

	React.useEffect(() => {
		if (user) {
			form.reset({
				firstName: user?.firstName || "",
				lastName: user?.lastName || "",
				phone: user?.phone || "",
			});
		}
	}, [user, form]);

	const onSubmit = async (values: PersonalInfoValues) => {
		try {
			const response = (await updateUserById(
				user?._id as string,
				values
			)) as BackendResponse;

			if (response?.data?.success) {
				dispatch(updateUser(response.data.user));
				toast.success("User information updated successfully.");
				setOpen(false);
			} else {
				toast.error(response?.response?.data?.message || "Update failed");
			}
		} catch (error: any) {
			console.error("Error updating user:", error);
			toast.error(
				error.response?.data?.message ||
					"Something went wrong while updating user information."
			);
		}
	};

	const openModal = () => {
		form.reset({
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			phone: user?.phone || "",
		});
		setOpen(true);
	};

	// Show loading state if user data is not available yet
	if (!user) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="flex justify-center items-center h-40">
						<p>Loading user information...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Personal Information</CardTitle>
					{editButtonMode && (
						<Button variant="outline" onClick={openModal}>
							<Edit className="mr-2 h-4 w-4" />
							Edit
						</Button>
					)}
				</CardHeader>
				<CardContent>
					<div className="flex flex-col justify-center items-start">
						<div className="flex justify-between items-center space-x-4">
							{/* <User className="w-24 h-24 bg-primary/20 rounded-full mb-4 border-2 border-black/10" /> */}
							<Avatar className="w-24 h-24 bg-primary/20 rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out">
								<AvatarImage
									src={user?.avatar}
									alt={`"${user?.name}" profile`}
								/>
								<AvatarFallback className="rounded-lg">
									{user?.name?.charAt(0) || "GT"}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col justify-center space-y-4">
								<h3 className="font-bold text-2xl">
									{user.firstName} {user.lastName}
								</h3>
								<div className="flex justify-start items-center gap-2">
									{user?.username && (
										<p className="text-sm font-medium text-muted-foreground">
											{user?.username}
										</p>
									)}
									<Separator
										orientation="vertical"
										className="mx-2 data-[orientation=vertical]:h-4"
									/>
									<span className="text-sm font-medium text-muted-foreground">
										{user.userType === "both"
											? capitalizeWords("Buyer & Seller")
											: capitalizeWords(user.userType)}
									</span>
								</div>
							</div>
						</div>
						<hr className="w-full my-4" />

						{/* Fix this below design into Table with fix spacing and text formatting  */}

						{/* <div className="mt-2 flex flex-col gap-4">
							<div className="flex justify-between space-x-8">
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-muted-foreground">
										First Name:
									</span>
									<span className="font-bold">{user.firstName}</span>
								</div>
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-muted-foreground">
										Last Name:
									</span>
									<span className="font-bold">{user.lastName}</span>
								</div>
							</div>
							<div className="flex justify-between space-x-8">
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-muted-foreground">
										Username:
									</span>
									<span className="font-bold">{user.username}</span>
								</div>
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-muted-foreground">
										Account Type:
									</span>
									<span className="font-bold">
										{user.userType === "both"
											? capitalizeWords("Buyer & Seller")
											: capitalizeWords(user.userType)}
									</span>
								</div>
							</div>
							<div className="flex justify-between space-x-8">
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-muted-foreground">
										Account Created with:
									</span>
									<span className="font-bold">
										{capitalizeWords(user?.registerThrough)}
									</span>
								</div>
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-muted-foreground">
										Account Verified Status:
									</span>
									<span className="font-bold">
										{user.isVerified ? "Verified" : "Not Verified"}
									</span>
								</div>
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-muted-foreground">
										Two-Factor Authentication Status:
									</span>
									<span className="font-bold">
										{user.twoFactorEnabled ? "Enabled" : "Not Enabled"}
									</span>
								</div>
							</div>
							<div className="flex justify-between space-x-8">
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-muted-foreground">
										Email:
									</span>
									<span className="font-bold">{user.email}</span>
								</div>
							</div>
						</div> */}

						{/* Table layout for user information */}
						<Table>
							<TableBody>
								<TableRow>
									<TableCell className="font-medium text-muted-foreground w-1/3">
										First Name
									</TableCell>
									<TableCell className="font-bold">{user.firstName}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium text-muted-foreground">
										Last Name
									</TableCell>
									<TableCell className="font-bold">{user.lastName}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium text-muted-foreground">
										Username
									</TableCell>
									<TableCell className="font-bold">{user.username}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium text-muted-foreground">
										Account Type
									</TableCell>
									<TableCell className="font-bold">
										{user.userType === "both"
											? capitalizeWords("Buyer & Seller")
											: capitalizeWords(user.userType)}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium text-muted-foreground">
										Account Created with
									</TableCell>
									<TableCell className="font-bold">
										{capitalizeWords(user?.registerThrough || "email")}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium text-muted-foreground">
										Account Verified Status
									</TableCell>
									<TableCell className="font-bold">
										{user.isVerified ? (
											<span className="text-green-400">Verified</span>
										) : (
											<span className="text-red-400">Not Verified</span>
										)}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium text-muted-foreground">
										Two-Factor Authentication
									</TableCell>
									<TableCell className="font-bold">
										{user.twoFactorEnabled ? (
											<span className="text-green-400">Enabled</span>
										) : (
											<span className="text-red-400">Not Enabled</span>
										)}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium text-muted-foreground">
										Phone
									</TableCell>
									<TableCell className="font-bold break-all">
										{user.phone === "" ? "Not Entered Yet!" : user.phone}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium text-muted-foreground">
										Email
									</TableCell>
									<TableCell className="font-bold break-all">
										{user.email}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Edit Modal */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Update Personal Information</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<div className="flex flex-col gap-4">
								<div className="flex sm:flex-row gap-4">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input placeholder="First Name" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="lastName"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormLabel>Last Name</FormLabel>
												<FormControl>
													<Input placeholder="Last Name" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input placeholder="Phone Number" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<DialogFooter className="gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting ? "Saving..." : "Save Changes"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};

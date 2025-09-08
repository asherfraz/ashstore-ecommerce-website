"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { clearUser } from "@/redux/userSlice";
import { deleteUserAccount } from "@/api/userApis";
import { BackendResponse } from "@/types/types";

export const UserAccountDeletion = () => {
	const { user } = useAuth();
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [confirmationText, setConfirmationText] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();

	const openModal = () => {
		setOpen(true);
	};

	const handleAccountDeletion = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsDeleting(true);

		if (!user || !user._id) {
			toast.error("You are not logged in.");
			router.push("/login");
			setIsDeleting(false);
			return;
		}

		if (email !== user.email) {
			toast.error("Email does not match your account.");
			setIsDeleting(false);
			return;
		}

		if (confirmationText !== "delete my account") {
			toast.error("Confirmation text is incorrect.");
			setIsDeleting(false);
			return;
		}

		try {
			const response = (await deleteUserAccount(
				user._id as string
			)) as BackendResponse;

			// Simulate API call for demonstration
			if (response.status === 200 && response.data.auth === false) {
				dispatch(clearUser());
				toast.success("User account deleted successfully.");
				router.push("/");
			} else {
				toast.error(
					response?.response?.data?.message || "Error Deleting User!"
				);
			}
		} catch (error: unknown) {
			console.error("Error deleting user:", error);
			toast.error("Something went wrong while deleting user account.");
		} finally {
			setEmail("");
			setConfirmationText("");
			setIsDeleting(false);
			setOpen(false);
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Account Deletion</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col justify-center items-start">
						<div className="flex flex-col gap-2">
							<h3 className="text-2xl font-bold text-red-500">
								Are you sure you want to delete your account?
							</h3>
							<p className="text-md font-bold">
								This action cannot be undone. All your data will be permanently
								removed.
							</p>
							<br />
							<Button
								variant="destructive"
								onClick={openModal}
								className="w-fit"
							>
								Delete Account
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Confirmation Dialog */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Account Deletion</DialogTitle>
						<DialogDescription>
							This action is permanent and cannot be undone. Please confirm your
							identity to proceed with account deletion.
						</DialogDescription>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleAccountDeletion}>
						<div className="space-y-2">
							<Label htmlFor="email">
								Enter your email address
								<span className="font-bold text-red-500">
									{user?.email}{" "}
								</span>{" "}
								to confirm:
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="your@email.com"
								required
								value={email}
								autoComplete="off"
								onChange={(e) => setEmail(e.target.value)}
							/>
							{user?.email && email !== user.email && (
								<p className="text-sm text-red-500">
									Must match your account email: {user.email}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmation">
								Type{" "}
								<span className="font-bold text-red-500">
									delete my account
								</span>{" "}
								to confirm:
							</Label>
							<Input
								id="confirmation"
								type="text"
								placeholder="delete my account"
								required
								value={confirmationText}
								autoComplete="off"
								onChange={(e) => setConfirmationText(e.target.value)}
							/>
							{confirmationText !== "delete my account" &&
								confirmationText.length > 0 && (
									<p className="text-sm text-red-500">
										Must exactly match &ldquo;delete my account&rdquo;
									</p>
								)}
						</div>

						<DialogFooter className="gap-2">
							<Button
								variant="outline"
								type="button"
								onClick={() => setOpen(false)}
								disabled={isDeleting}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="destructive"
								disabled={
									isDeleting ||
									email !== user?.email ||
									confirmationText !== "delete my account"
								}
							>
								{isDeleting ? "Deleting..." : "Permanently Delete Account"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

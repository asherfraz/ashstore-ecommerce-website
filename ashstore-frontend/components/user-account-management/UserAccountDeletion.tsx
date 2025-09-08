"use client";
import React from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { deleteUserAccount } from "@/api/userApis";
// import { logoutUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export const UserAccountDeletion = () => {
	const { user } = useAuth();
	const [open, setOpen] = React.useState(false);
	const [email, setEmail] = React.useState("");
	const dispatch = useDispatch();

	const openModal = () => {
		setOpen(true);
	};

	// const handleAccountDeletion = async (e) => {
	// 	e.preventDefault();
	// 	if (!user || !user._id) {
	// 		toast.error("You are not logged in.");
	// 		navigate("/login");
	// 		return;
	// 	}
	// 	if (email !== user.email) {
	// 		toast.error("Email does not match your account.");
	// 		return;
	// 	}
	// 	try {
	// 		const response = await deleteUserAccount(user._id);
	// 		console.log(">>>: DeleteUser API Response:", response);
	// 		if (response.status === 200 || response.auth === false) {
	// 			dispatch(logoutUser());
	// 			toast.success("User account deleted successfully.");
	// 			// navigate("/");
	// 		} else {
	// 			toast.error(response.response.data.message);
	// 		}
	// 	} catch (error: any) {
	// 		console.error("Error deleting user:", error);
	// 		toast.error("Something went wrong while deleting user account.");
	// 	} finally {
	// 		setEmail("");
	// 		setOpen(false);
	// 	}
	// };

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Account Deletion</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col justify-center items-start text-foreground dark:text-foreground">
						<div className="flex flex-col gap-2">
							<h3 className="text-2xl font-bold text-red-500">
								Are you sure you want to delete your account?
							</h3>
							<p className="text-md text-foreground dark:text-foreground font-bold">
								This action cannot be undone.
							</p>
							<br />
							<CardAction>
								<Button
									variant="outline"
									onClick={openModal}
									className="bg-red-300 hover:bg-red-400 dark:bg-red-400 dark:hover:bg-red-600"
								>
									Delete Account!
								</Button>
							</CardAction>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Modal */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete User Account</DialogTitle>
					</DialogHeader>
					{/* <form className="space-y-4" onSubmit={handleAccountDeletion}> */}
					<form className="space-y-4">
						<div>
							<Label htmlFor="country" className="mb-2">
								Type your email:{" "}
								<span className="font-bold text-red-500 bg-red-100 p-1">
									{user?.email || ""}
								</span>
							</Label>
							<Input
								id="email"
								type="email"
								placeholder={user?.email}
								required
								value={email}
								autoComplete="off"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								type="reset"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" className="bg-red-400 hover:bg-red-500">
								Delete!
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

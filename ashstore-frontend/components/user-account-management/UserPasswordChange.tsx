"use client";

import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { useState } from "react";
// import { userHasNoPass } from "@/api/userApis";
import { useForm } from "react-hook-form";
// import { changeUserPassword } from "@/api/userApis";
import { toast } from "react-hot-toast";

type FormData = {
	oldPassword?: string;
	newPassword: string;
	confirmPassword: string;
};

export const UserPasswordChange = () => {
	const { user } = useAuth();
	const [isEditMode, setisEditMode] = useState(true);
	const [hasBlankPassword, setHasBlankPassword] = useState(false);

	const {
		handleSubmit,
		register,
		reset,
		getValues,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			oldPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	// useEffect(() => {
	// 	const checkUserHasBlankPassword = async () => {
	// 		const response = await userHasNoPass(user._id);
	// 		if (response.status === 200) {
	// 			setHasBlankPassword(response.data.hasNoPassword);
	// 		} else {
	// 			setHasBlankPassword(false);
	// 		}
	// 	};
	// 	checkUserHasBlankPassword();
	// }, []);

	const onSubmit = async (data: FormData) => {
		console.log("Form submitted with data:", data);
		// try {
		// 	const response = await changeUserPassword(user._id, data);
		// 	if (response.status === 200) {
		// 		toast.success("Password Changed Successfully!");
		// 	} else {
		// 		toast.error(response.response.data.message);
		// 	}
		// } catch (error) {
		// 	console.error("Error Changing Password: ", error);
		// 	toast.error("Something went Wrong!");
		// } finally {
		// 	// reset form data
		// 	// reset();
		// 	// reset edit mode
		// 	setisEditMode(!isEditMode);
		// }
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Change User Password</CardTitle>
					<CardAction>
						<Button
							className={`${!isEditMode ? "hidden" : "block "}`}
							variant="outline"
							onClick={() => setisEditMode(!isEditMode)}
						>
							<div className="flex items-center gap-2">
								<Edit className="mr-2" />
								<span>Edit</span>
							</div>
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col justify-center items-start">
						<form
							className="max-w-full flex flex-col gap-4"
							// onSubmit={handleSubmit(onSubmit)}
						>
							{!hasBlankPassword && (
								<div className="w-1/2 flex flex-col space-y-1.5">
									<label className="text-sm font-medium text-gray-400">
										Old Password:{" "}
									</label>
									<input
										id="password-old"
										type="text"
										className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
										disabled={isEditMode}
										placeholder="Enter old password"
										{...register("oldPassword", {
											required: !hasBlankPassword && "Old Password is required",

											pattern: {
												value:
													/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,24}$/,
												message:
													"Password must be at least 8 and maximum 24 characters long and contain at least one letter, one number, and one special character",
											},
										})}
									/>

									{errors.oldPassword && (
										<>
											<span className="text-red-600 font-bold text-sm">
												{errors.oldPassword.message}
											</span>
										</>
									)}
								</div>
							)}
							<div className="flex justify-start gap-8">
								<div className="w-1/2 flex flex-col space-y-1.5">
									<label className="text-sm font-medium text-gray-400">
										New Password:{" "}
									</label>
									<input
										id="password-new"
										type="text"
										className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
										disabled={isEditMode}
										placeholder="Enter new password"
										{...register("newPassword", {
											required: "New password is required",
											pattern: {
												value:
													/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,24}$/,
												message:
													"Password must be at least 8 and maximum 24 characters long and contain at least one letter, one number, and one special character",
											},
										})}
									/>
									{errors.newPassword && (
										<>
											<span className="text-red-600 font-bold text-sm">
												{errors.newPassword.message}
											</span>
										</>
									)}
								</div>
								<div className="w-1/2 flex flex-col space-y-1.5">
									<label className="text-sm font-medium text-gray-400">
										Confirm New Password:{" "}
									</label>
									<input
										id="password-confirm"
										type="text"
										className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
										disabled={isEditMode}
										placeholder="Confirm new password"
										{...register("confirmPassword", {
											// confirm password should match new password
											required: "Confirm password is required",
											validate: (value) =>
												value === getValues("newPassword") ||
												"Passwords do not match",
											pattern: {
												value:
													/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,24}$/,
												message:
													"Password must be at least 8 and maximum 24 characters long and contain at least one letter, one number, and one special character",
											},
										})}
									/>
									{errors.confirmPassword && (
										<>
											<span className="text-red-600 font-bold text-sm">
												{errors.confirmPassword.message}
											</span>
										</>
									)}
								</div>
							</div>
						</form>
						<CardFooter className="w-full flex justify-end items-center gap-4">
							<Button
								type="reset"
								className={`flex justify-center items-center gap-2 ${
									isEditMode ? "hidden" : "block "
								}`}
								variant="outline"
								onClick={() => {
									reset();
									setisEditMode(!isEditMode);
								}}
							>
								<span>Cancel</span>
							</Button>
							<Button
								type="submit"
								className={`flex justify-center items-center gap-2 
                        hover:bg-green-200 ${isEditMode ? "hidden" : "block "}`}
								variant="outline"
								onClick={handleSubmit(onSubmit)}
							>
								<span>Save Changes</span>
							</Button>
						</CardFooter>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

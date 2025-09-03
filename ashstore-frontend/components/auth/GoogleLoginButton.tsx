"use client";
import { loginWithGoogle } from "@/api/userApis";
import { BackendResponse } from "@/types/types";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function GoogleLoginButton() {
	const router = useRouter();
	const dispatch = useDispatch();

	const login = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			try {
				// console.log("GoogleAUTH codeResponse: ", codeResponse);
				// Send the authorization code to the backend
				const response = (await loginWithGoogle({
					code: codeResponse.code,
				})) as BackendResponse;
				// console.log("GoogleAUTH Response: ", response);
				// console.log("Login successful!", response.data);

				if (response?.data?.success) {
					// You might want to redirect here after successful login
					dispatch({
						type: "user/setUser",
						payload: response.data.user,
					});
					// if 2FA is enabled
					if (response.data.user.twoFactorEnabled) {
						router.push("/auth/verify-2fa-code");
					} else {
						router.push("/marketplace");
					}

					toast.success(
						response.data.message || "Login with Google successful!"
					);
				} else {
					toast.error(
						response?.response?.data?.message ||
							"Login with Google failed. Please try again!"
					);
				}
			} catch (error) {
				console.error("Login failed:", error);
			}
		},
		flow: "auth-code", // Use authorization code flow
	});

	return (
		<button
			onClick={login}
			className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
		>
			{/* Google Logo SVG */}
			<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
				<path
					fill="#4285F4"
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				/>
				<path
					fill="#34A853"
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				/>
				<path
					fill="#FBBC05"
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				/>
				<path
					fill="#EA4335"
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				/>
			</svg>
			Login with Google
		</button>
	);
	// return (
	// 	<div className="w-full flex justify-center ">
	// 		<GoogleLogin
	// 			onSuccess={login}
	// 			onError={() => console.log("Login Failed")}
	// 		/>
	// 	</div>
	// );
}

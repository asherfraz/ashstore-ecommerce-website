import { UserAddressInfo } from "@/components/user-account-management/UserAddressInfo";
import { UserPaymentMethods } from "@/components/user-account-management/UserPaymentsMethods";
import { UserPersonalInfo } from "@/components/user-account-management/UserPersonalInfo";
import React from "react";

export default function UserProfile() {
	return (
		<div>
			<UserPersonalInfo editButtonMode={true} />
			<br />
			<hr />
			<br />
			<UserAddressInfo />
			<br />
			<hr />
			<br />
			<UserPaymentMethods />
		</div>
	);
}

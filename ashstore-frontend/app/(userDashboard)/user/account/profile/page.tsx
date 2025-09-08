import { UserAccountDeletion } from "@/components/user-account-management/UserAccountDeletion";
import { UserAddressInfo } from "@/components/user-account-management/UserAddressInfo";
import { UserPasswordChange } from "@/components/user-account-management/UserPasswordChange";
import { UserPaymentMethods } from "@/components/user-account-management/UserPaymentsMethods";
import { UserPersonalInfo } from "@/components/user-account-management/UserPersonalInfo";
import React from "react";

type Props = {};

export default function UserProfile({}: Props) {
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
			<br />
			<hr />
			<br />
			<UserPasswordChange />
			<br />
			<hr />
			<br />
			{/* <UserAccountDeletion />
			<br />
			<hr />
			<br /> */}
		</div>
	);
}

"use client";

import * as React from "react";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";

interface InputOTPControlledProps {
	value: string;
	onChange: (value: string) => void;
}

export function InputOTPControlled({
	value,
	onChange,
}: InputOTPControlledProps) {
	return (
		<div className="space-y-2">
			<InputOTP
				maxLength={6}
				value={value}
				onChange={onChange}
				// Add inputMode for mobile devices to show numeric keyboard
				inputMode="numeric"
				pattern="[0-9]*"
			>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
					<InputOTPSeparator />
					<InputOTPSlot index={3} />
					<InputOTPSlot index={4} />
					<InputOTPSlot index={5} />
				</InputOTPGroup>
			</InputOTP>
			<div className="text-center text-sm">
				{value === "" ? (
					<>Enter your one-time password.</>
				) : (
					<>You entered: {value}</>
				)}
			</div>
		</div>
	);
}

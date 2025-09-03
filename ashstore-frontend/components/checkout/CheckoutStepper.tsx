"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CheckoutStepperProps {
	currentStep: number;
	totalSteps: number;
	stepTitles: string[];
}

export function CheckoutStepper({
	currentStep,
	totalSteps,
	stepTitles,
}: CheckoutStepperProps) {
	const progressPercentage = (currentStep / totalSteps) * 100;

	return (
		<div className="flex flex-col gap-3 p-4">
			<div className="flex gap-6 justify-between">
				<p className="text-foreground text-base font-medium leading-normal">
					{stepTitles[currentStep - 1]}
				</p>
				<span className="text-muted-foreground text-sm">
					Step {currentStep} of {totalSteps}
				</span>
			</div>
			<Progress value={progressPercentage} className="h-2" />
		</div>
	);
}

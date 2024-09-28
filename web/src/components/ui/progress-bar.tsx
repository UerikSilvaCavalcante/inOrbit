import * as ProgressPrimitive from "@radix-ui/react-progress";

export function Progress(props: ProgressPrimitive.ProgressProps) {
	return (
		<ProgressPrimitive.Progress
			{...props}
			className="bg-zinc-900 rounded-full h-2"
		/>
	);
}

export function ProgressIndicator(
	props: ProgressPrimitive.ProgressIndicatorProps,
) {
	return (
		<ProgressPrimitive.Indicator
			{...props}

		/>
	);
}
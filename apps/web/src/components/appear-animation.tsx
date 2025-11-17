export const AppearAnimation = ({
	children,
	className,
	yOffset = 16,
	delayMs,
}: {
	children: React.ReactNode;
	className?: string;
	yOffset?: number;
	delayMs?: number;
}) => (
	<div
		className={["animate-fade-up will-change-transform", className]
			.filter(Boolean)
			.join(" ")}
		style={{
			["--y-offset" as any]: `${yOffset}px`,
			["--anim-duration" as any]: "500ms",
			["--anim-ease" as any]: "cubic-bezier(0.22, 1, 0.36, 1)",
			animationDelay: delayMs ? `${delayMs}ms` : undefined,
		}}
	>
		{children}
	</div>
);

export default AppearAnimation;

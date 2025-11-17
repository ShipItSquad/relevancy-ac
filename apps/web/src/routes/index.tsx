import { api } from "@relevancy-ac/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import UnicornScene from "unicornstudio-react";
import { useScreenSize } from "@/hooks/use-screen-size";
export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const { width, height } = useScreenSize();
	const healthCheck = useQuery(api.healthCheck.get);

	return (
		<div className="relative h-screen w-screen">
			<UnicornScene
				className="absolute top-0 left-0 h-screen w-screen"
				height={height}
				projectId="awJNovY8E1kUfBsQ9A8K"
				width={width}
			/>
			<div className="pointer-events-none absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center font-sans">
				<div className="flex w-[300px] flex-row items-center justify-between gap-2 pt-[90px] sm:w-[450px] sm:pt-[150px] lg:w-[400px]">
					<a
						className="pointer-events-auto font-medium"
						href="https://www.notion.so/Relevancy-2abacc89e00a800caca7ca994de85beb"
						rel="noopener noreferrer"
						target="_blank"
					>
						Relevancy Status
					</a>
					<div className="flex items-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${healthCheck === "OK" ? "bg-yellow-500" : healthCheck === undefined ? "bg-orange-400" : "bg-red-500"}`}
						/>
						<span className="text-sm">
							{healthCheck === undefined
								? "Checking..."
								: healthCheck === "OK"
									? "Cooking..."
									: "Error"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

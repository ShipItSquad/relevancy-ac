import { api } from "@relevancy-ac/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { useState } from "react";
import { AppearAnimation } from "@/components/appear-animation";
import { Unicorn } from "@/components/unicorn";
export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const [loaded, setLoaded] = useState(false);
	const healthCheck = useQuery(api.healthCheck.get);

	const statusColorClass = (() => {
		if (healthCheck === "OK") {
			return "bg-blue-500";
		}
		if (healthCheck === undefined) {
			return "bg-orange-400";
		}
		return "bg-red-500";
	})();

	console.log(loaded);
	return (
		<div className="relative h-[100dvh] w-[100dvw] transition-all duration-1000">
			<Unicorn loaded={loaded} setLoaded={setLoaded} />

			<div className="pointer-events-none absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center font-sans">
				{loaded && (
					<div className="flex w-[300px] flex-row items-center justify-between gap-2 pt-[120px] sm:w-[450px] sm:pt-[170px] lg:w-[450px]">
						<AppearAnimation delayMs={1000}>
							<div className="flex items-center gap-2" />
							<a
								className="pointer-events-auto flex flex-row items-center gap-2 rounded-[6px] border border-blue-500 bg-black/30 px-3 py-3 font-medium backdrop-blur-[2px] hover:bg-black/40"
								href="https://www.notion.so/Relevancy-2abacc89e00a800caca7ca994de85beb"
								rel="noopener noreferrer"
								target="_blank"
							>
								<div
									className={`h-2 w-2 animate-pulse rounded-full ${statusColorClass}`}
								/>
								<p>Relevancy Status</p>
							</a>
						</AppearAnimation>
					</div>
				)}
			</div>
		</div>
	);
}

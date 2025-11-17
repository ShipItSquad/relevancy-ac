import { Loader2 } from "lucide-react";
import UnicornScene from "unicornstudio-react";
import { useScreenSize } from "@/hooks/use-screen-size";

export const Unicorn = ({
	loaded,
	setLoaded,
}: {
	loaded: boolean;
	setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { width, height } = useScreenSize();
	return (
		<div className="h-[100dvh] w-[100dvw]">
			{!loaded && (
				<div className="absolute top-0 left-0 flex h-[100dvh] w-[100dvw] items-center justify-center bg-blue-800/10">
					<Loader2 className="animate-spin" />
				</div>
			)}
			<UnicornScene
				className="fade-in animation-duration-[2000ms] absolute top-0 left-0 h-screen w-screen animate-in"
				dpi={1}
				height={height}
				lazyLoad={false}
				onLoad={() => setLoaded(true)}
				projectId="awJNovY8E1kUfBsQ9A8K"
				width={width}
			/>
		</div>
	);
};

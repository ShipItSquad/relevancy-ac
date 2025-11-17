import { useEffect, useState } from "react";

// Define the screen size buckets you want to support
export type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ScreenInfo = {
	size: ScreenSize;
	width: number;
	height: number;
};

function getScreenSize(width: number): ScreenSize {
	if (width < 640) {
		return "xs";
	}
	if (width < 768) {
		return "sm";
	}
	if (width < 1024) {
		return "md";
	}
	if (width < 1280) {
		return "lg";
	}
	return "xl";
}

/**
 * React hook that returns the current screen size bucket (responsive).
 * usage:
 *   const { size, width, height } = useScreenSize();
 *   // size: "xs" | "sm" | ...
 *   // width, height: number
 */
export function useScreenSize(): ScreenInfo {
	const getInitial = (): ScreenInfo => {
		if (typeof window === "undefined") {
			// Reasonable SSR defaults; width/height won't be used until hydrated
			return { size: "md", width: 1024, height: 768 };
		}
		return {
			size: getScreenSize(window.innerWidth),
			width: window.innerWidth,
			height: window.innerHeight,
		};
	};

	const [screen, setScreen] = useState<ScreenInfo>(getInitial);

	useEffect(() => {
		function handleResize() {
			setScreen({
				size: getScreenSize(window.innerWidth),
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		window.addEventListener("resize", handleResize);
		// Call handler so state gets updated with initial value
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return screen;
}

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
		const vv =
			"visualViewport" in window
				? (window as Window & { visualViewport?: VisualViewport })
						.visualViewport
				: undefined;
		const currentWidth = vv?.width ?? window.innerWidth;
		const currentHeight = vv?.height ?? window.innerHeight;
		return {
			size: getScreenSize(currentWidth),
			width: currentWidth,
			height: currentHeight,
		};
	};

	const [screen, setScreen] = useState<ScreenInfo>(getInitial);

	useEffect(() => {
		const visualViewport: VisualViewport | null =
			"visualViewport" in window
				? ((window as Window & { visualViewport?: VisualViewport })
						.visualViewport ?? null)
				: null;

		function updateFromViewport() {
			const width =
				visualViewport?.width ??
				window.innerWidth ??
				document.documentElement.clientWidth;
			const height =
				visualViewport?.height ??
				window.innerHeight ??
				document.documentElement.clientHeight;
			setScreen({
				size: getScreenSize(width),
				width,
				height,
			});
		}

		// Window-level changes (orientation, resize)
		window.addEventListener("resize", updateFromViewport);
		window.addEventListener("orientationchange", updateFromViewport);
		// VisualViewport captures mobile URL bar show/hide, keyboard, pinch-zoom viewport changes
		if (visualViewport) {
			visualViewport.addEventListener("resize", updateFromViewport);
			visualViewport.addEventListener("scroll", updateFromViewport);
		}
		// Initialize on mount
		updateFromViewport();

		return () => {
			window.removeEventListener("resize", updateFromViewport);
			window.removeEventListener("orientationchange", updateFromViewport);
			if (visualViewport) {
				visualViewport.removeEventListener("resize", updateFromViewport);
				visualViewport.removeEventListener("scroll", updateFromViewport);
			}
		};
	}, []);

	return screen;
}

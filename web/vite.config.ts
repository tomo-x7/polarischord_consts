import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	build: { target: "ES2015" },
	plugins: [
		react(),
		mode === "analyze" &&
			visualizer({
				open: true,
				filename: "dist/stats.html",
				gzipSize: true,
				brotliSize: true,
			}),
	],
}));

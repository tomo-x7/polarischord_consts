import { build } from "esbuild";
import { GasPlugin } from "esbuild-gas-plugin";
import copy from "esbuild-plugin-copy";

const main = async () =>
	await build({
		entryPoints: ["src/app.ts"],
		outfile: "dist/app.js",
		bundle: true,
		minify: false,
		plugins: [copy({ assets: { from: "src/appsscript.json", to: "appsscript.json" } }), GasPlugin],
		define: { self: "global" },
	});

main();

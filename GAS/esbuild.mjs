//@ts-check
import { build } from "esbuild";
import { GasPlugin } from "esbuild-gas-plugin";
import copy from "esbuild-plugin-copy";
await build({
	entryPoints: ["src/app.ts"],
	outfile: "dist/app.js",
	bundle: true,
	minify: false,
	//@ts-expect-error GasPluginの型がおかしい？
	plugins: [copy({ assets: { from: "src/appsscript.json", to: "appsscript.json" } }), GasPlugin],
	define: { self: "global" },
});

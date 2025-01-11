//@ts-check
import { build } from "esbuild";
import copy from "esbuild-plugin-copy";
import { GasPlugin } from "esbuild-gas-plugin";
await build({
	entryPoints: ["src/app.ts"],
	outfile: "dist/app.js",
	bundle: true,minify:false,
    //@ts-ignore
	plugins: [GasPlugin],define:{"self":"global"}
});

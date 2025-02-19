import fs from "node:fs/promises";
import type { Res } from "../GAS/src/util";
import path from "node:path";
import { config } from "dotenv";
import crypto from "node:crypto";
config();
const { GAS_URL } = process.env;
if (!GAS_URL) throw new Error("env not found");
const isForce = process.argv[2] === "force" || process.env.FORCE === "1";
if (isForce) console.log("force mode");

const res = await fetch(GAS_URL).then(async (res) => {
	if (!res.ok) throw new Error(await res.text());
	return res.json() as Promise<Res>;
});
if (!res.ok) {
	console.error(res.error);
	throw new Error();
}
if (!res.payload) {
	console.error("payload not found");
	throw new Error();
}
const hash = crypto.hash("SHA256", JSON.stringify(res.payload), "base64");
const { hash: oldhash } = await fetch("https://polaris-consts.pages.dev/data/metadata.json").then(
	(r) => r.json() as Promise<{ hash: string }>,
);
//hashが前回値と一致かつforceではない場合
if (hash === oldhash && isForce === false) {
	process.exit(11);
}
const metadata = { lastupdate: new Date(), hash };
const datadir = path.join(import.meta.dirname, "public", "data");
try {
	await fs.rm(datadir, { force: true, recursive: true });
} catch (e) {}
await fs.mkdir(path.join(import.meta.dirname, "public", "data"), { recursive: true });
await fs.writeFile(path.join(datadir, "metadata.json"), JSON.stringify(metadata, undefined, 0));
await fs.writeFile(path.join(datadir, "data.json"), JSON.stringify(res.payload, undefined, 0));

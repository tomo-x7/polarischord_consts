import fs from "node:fs/promises";
import { Res } from "../GAS/src/util";
import path from "node:path";
import { config } from "dotenv";
import crypto from "node:crypto";
config();
const { GAS_URL: gasurlstr, PRIVATE_KEY } = process.env;
if (!gasurlstr || !PRIVATE_KEY) throw new Error("env not found");
const GAS_URL = new URL(gasurlstr);

const strToU8arr = (str: string) => new Uint8Array(str.split("").map((s) => s.charCodeAt(0)));
const alg = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };
const now = new Date();
const prvkey = await crypto.subtle.importKey("pkcs8", strToU8arr(atob(PRIVATE_KEY)).buffer, alg, false, ["sign"]);
const signbuf = await crypto.subtle.sign(alg, prvkey, strToU8arr(now.toISOString()));
const signstr = btoa(
	Array.from(new Uint8Array(signbuf))
		.map((v) => String.fromCodePoint(v))
		.join(""),
);
GAS_URL.searchParams.set("data", now.toISOString());
GAS_URL.searchParams.set("sign", signstr);
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
const {hash:oldhash} = await fetch("https://polaris-consts.pages.dev/data/metadata.json").then(
	(r) => r.json() as Promise<{ hash: string }>,
);
if(hash===oldhash){
	process.exit(11)
}
const metadata = { lastupdate: new Date(), hash };
const datadir = path.join(import.meta.dirname, "public", "data");
try {
	await fs.rm(datadir, { force: true, recursive: true });
} catch (e) {}
await fs.mkdir(path.join(import.meta.dirname, "public", "data"), { recursive: true });
await fs.writeFile(path.join(datadir, "metadata.json"), JSON.stringify(metadata, undefined, 0));
await fs.writeFile(path.join(datadir, "data.json"), JSON.stringify(res.payload, undefined, 0));

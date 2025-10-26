import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";

config();
const { GAS_URL, GAS_TOKEN } = process.env;
if (GAS_URL == null || GAS_TOKEN == null) throw new Error("env not found");

type GasRes = { ok: true; status: 200; payload: object } | { ok: false; status: number; name: string; message: string };

const res = await fetch(GAS_URL, {
	method: "POST",
	body: GAS_TOKEN,
}).then(async (res) => {
	if (!res.ok) throw new Error(await res.text());
	return res.json() as Promise<GasRes>;
});
if (!res.ok) {
	console.error(res.name);
	console.error(res.message);
	throw new Error();
}
if (!res.payload) {
	console.error("payload not found");
	throw new Error();
}
const hash = crypto.hash("SHA256", JSON.stringify(res.payload), "base64");

const metadata = { lastupdate: new Date(), hash };
const datadir = path.join(import.meta.dirname, "public", "data");
try {
	await fs.rm(datadir, { force: true, recursive: true });
} catch (e) {}
await fs.mkdir(path.join(import.meta.dirname, "public", "data"), { recursive: true });
await fs.writeFile(path.join(datadir, "metadata.json"), JSON.stringify(metadata, undefined, 0));
await fs.writeFile(path.join(datadir, "data.json"), JSON.stringify(res.payload, undefined, 0));

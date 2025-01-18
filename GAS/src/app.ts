import forge from "node-forge";
import {
	type FailedResponse,
	ScriptError,
	SignInvalidError,
	SignMissingError,
	type Res,
	InternalServerError,
} from "./util";

const pubkeypem =
	"-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxRLwLfJq/3HIAKRQly5JW9PulnYv2MizeCUzxV7ZADcHsR6OVi/BWvEaxlXVtZN8NhE4rtbLjc7IgRuSD8T+gjtBcDkKvJ6U3XXT2uY0fJZaQ4KQCp4vKoj746CvN4uBVCt+0ciRGpXUX5jRshWJwu0TTPwREQeSYxHSwG1NJnwIDAQAB-----END PUBLIC KEY-----";
const SHEATURL = "https://docs.google.com/spreadsheets/d/1nC9tfgg0vTQttDCACbZr9aDWKWjEtk676ZlRVW-glUk/";
const SHEAT_NAME = "定数表メイン";
type diffs = { easy: number; normal: number; hard: number; inf: number };
type consts = { hard: number; inf: number };
type data = {
	name: string;
	composer: string;
	diff: diffs;
	consts: consts;
};
type out = [
	string | number,
	string | number,
	number | "" | "-",
	number | "" | "-",
	number | "",
	number | "",
	number | "",
	number | "",
][];
function main(e: GoogleAppsScript.Events.DoGet): Res {
	verify(e.parameter.sign, e.parameter.data);
	const doc = SpreadsheetApp.openByUrl(SHEATURL);
	const sheat = doc.getSheetByName(SHEAT_NAME);
	if (!sheat) {
		throw new InternalServerError("sheat not found");
	}
	const rawdata = sheat.getRange("A2:H1000").getValues() as out;
	const data: data[] = rawdata
		.map((raw) => {
			const [name, composer, diffInf, constInf, diffHard, constHard, diffNormal, diffEasy] = raw;
			if (name === "") return undefined;
			return {
				name: String(name),
				composer: String(composer),
				diff: {
					inf: parseInf(diffInf),
					hard: numOrZero(diffHard),
					normal: numOrZero(diffNormal),
					easy: numOrZero(diffEasy),
				},
				consts: { inf: parseInf(constInf), hard: numOrZero(constHard) },
			};
		})
		.filter((v) => v != null);

	return { ok: true, payload: data };
}

function test() {
	const data = {
		parameter: {},
		pathInfo: "string",
		contextPath: "string",
		contentLength: 0,
		queryString: "string",
		parameters: {},
	};
	const r = doGet(data);
	console.log(r.getContent());
}

const numOrZero = (n: unknown) => (typeof n === "number" && !Number.isNaN(n) ? n : 0);
const parseInf = (num: unknown) => (num === "-" ? -1 : numOrZero(num));
function verify(sign: string, data: string) {
	if (!sign || !data) throw new SignMissingError();
	const pubkey = forge.pki.publicKeyFromPem(pubkeypem);
	const digest = forge.md.sha256.create().update(data, "utf8").digest().bytes();
	const verify = pubkey.verify(digest, forge.util.decode64(sign));
	if (!verify) throw new SignInvalidError();
	const diff = Math.abs(new Date(data).valueOf() - new Date().valueOf());
	if (diff > 30 * 1000) throw new SignInvalidError("Too much time has passed");
}

export function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
	const out = ContentService.createTextOutput();
	out.setMimeType(ContentService.MimeType.JSON);
	try {
		const res = main(e);
		out.setContent(JSON.stringify(res));
		return out;
	} catch (e) {
		if (e instanceof ScriptError) {
			const res: FailedResponse = { ok: false, error: e.payload };
			out.setContent(JSON.stringify(res));
		} else {
			const res: FailedResponse = { ok: false, error: String(e) };
			out.setContent(JSON.stringify(res));
		}
		return out;
	}
}
//@ts-ignore
global.doGet = doGet;
//@ts-ignore
global.test = test;

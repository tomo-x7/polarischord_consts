import forge from "node-forge";
import { FailedResponse, ScriptError, SignInvalidError, SignMissingError, Res } from "./util";

const pubkeypem =
	"-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxRLwLfJq/3HIAKRQly5JW9PulnYv2MizeCUzxV7ZADcHsR6OVi/BWvEaxlXVtZN8NhE4rtbLjc7IgRuSD8T+gjtBcDkKvJ6U3XXT2uY0fJZaQ4KQCp4vKoj746CvN4uBVCt+0ciRGpXUX5jRshWJwu0TTPwREQeSYxHSwG1NJnwIDAQAB-----END PUBLIC KEY-----";
const alg = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as const;
const SHEATURL = "https://docs.google.com/spreadsheets/d/1nC9tfgg0vTQttDCACbZr9aDWKWjEtk676ZlRVW-glUk/";
enum sheats {
	EASY = "楽曲(EASY)",
	NORMAL = "楽曲(NORMAL)",
	HARD = "楽曲(HARD)",
	INF = "楽曲(INF)",
}
function main(e: GoogleAppsScript.Events.DoGet): Res {
	verify(e.parameter.sign, e.parameter.data);
	const doc = SpreadsheetApp.openByUrl(SHEATURL);
	doc.getSheetByName("");
	const data = doc.getRange("楽曲(INF)!A12:D13");

	console.log(data.getValues());
	return { ok: true, payload: { hoge: "fuga" } };
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
test();

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
global.doGet=doGet;
//@ts-ignore
global.test=test;
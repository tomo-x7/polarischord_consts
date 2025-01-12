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
enum SHEAT {
	EASY = "楽曲(EASY)",
	NORMAL = "楽曲(NORMAL)",
	HARD = "楽曲(HARD)",
	INF = "楽曲(INF)",
}
const SHEAT_STR = ["easy", "normal", "hard", "inf"] as const;
type diffs<T = number> = { easy: T; normal: T; hard: T; inf: T };
type data = {
	name: string;
	composer: string;
	diff: diffs;
	consts: diffs;
};
type out = [string, string, number | "", number | ""][];
function main(e: GoogleAppsScript.Events.DoGet): Res {
	verify(e.parameter.sign, e.parameter.data);
	const doc = SpreadsheetApp.openByUrl(SHEATURL);
	const inf = doc.getSheetByName(SHEAT.INF);
	const hard = doc.getSheetByName(SHEAT.HARD);
	const normal = doc.getSheetByName(SHEAT.NORMAL);
	const easy = doc.getSheetByName(SHEAT.EASY);
	if (!inf || !hard || !normal || !easy) {
		throw new InternalServerError("sheat not found");
	}
	const sheats = { easy, normal, hard, inf };

	const map = new Map<string, data>();
	const smallmaps: {
		[key in keyof typeof sheats]: Map<string, { name: string; composer: string; diff: number; consts: number }>;
	} = { easy: new Map(), normal: new Map(), hard: new Map(), inf: new Map() };
	const musics = new Set<string>();
	for (const i of SHEAT_STR) {
		const smallmap = smallmaps[i];
		const values = sheats[i].getRange("A2:D1000").getValues() as out;
		for (const v of values) {
			if (v[0] === "") {
				break;
			}
			const diff = typeof v[2] === "number" ? v[2] : 0;
			const consts = typeof v[3] === "number" ? v[3] : 0;
			smallmap.set(v[0], { name: v[0], composer: v[1], diff, consts });
			musics.add(v[0]);
		}
	}
	for (const music of musics) {
		const easy = smallmaps.easy.get(music);
		const normal = smallmaps.normal.get(music);
		const hard = smallmaps.hard.get(music);
		const inf = smallmaps.inf.get(music);
		const composer = inf?.composer ?? hard?.composer ?? normal?.composer ?? easy?.composer ?? "unknown";
		const diff: diffs = {
			easy: easy?.diff ?? 0,
			normal: normal?.diff ?? 0,
			hard: hard?.diff ?? 0,
			inf: inf?.diff ?? -1,
		};
		const consts: diffs = {
			easy: easy?.consts ?? 0,
			normal: normal?.consts ?? 0,
			hard: hard?.consts ?? 0,
			inf: inf?.consts ?? 0,
		};
		map.set(music, { name: music, composer, diff, consts });
	}
	const maparr = Array.from(map.values());
	return { ok: true, payload: maparr };
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
global.doGet = doGet;
//@ts-ignore
global.test = test;

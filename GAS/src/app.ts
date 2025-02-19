import { type FailedResponse, ScriptError, type Res, InternalServerError } from "./util";

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
function main(): Res {
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
	const r = doGet();
	console.log(r.getContent());
}

const numOrZero = (n: unknown) => (typeof n === "number" && !Number.isNaN(n) ? n : 0);
const parseInf = (num: unknown) => (num === "-" ? -1 : numOrZero(num));

export function doGet(): GoogleAppsScript.Content.TextOutput {
	const out = ContentService.createTextOutput();
	out.setMimeType(ContentService.MimeType.JSON);
	try {
		const res = main();
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

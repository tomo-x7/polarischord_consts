import { ScriptError } from "./error";

export const strToU8arr = (str: string) => new Uint8Array(str.split("").map((s) => s.charCodeAt(0)));
export const numOrZero = (n: unknown) => (typeof n === "number" && !Number.isNaN(n) ? n : 0);
export const parseInf = (num: unknown) => (num === "-" ? -1 : numOrZero(num));

export function createResponse(input: object | string) {
	const res = ContentService.createTextOutput();
	res.setMimeType(ContentService.MimeType.JSON);
	res.setContent(genRes({ status: 200, payload: input, ok: true }));
	return res;
}
export function createErrorResponse(error: unknown): GoogleAppsScript.Content.TextOutput {
	const res = ContentService.createTextOutput();
	res.setMimeType(ContentService.MimeType.JSON);
	if (error instanceof ScriptError) {
		// Known Error
		res.setContent(genRes({ status: error.status, ok: false, name: error.name, message: error.message }));
	} else if (error instanceof Error) {
		// Unknown Error
		res.setContent(genRes({ status: 500, ok: false, name: error.name, message: error.message }));
	} else {
		res.setContent(genRes({ status: 500, ok: false, name: "UnknownError", message: String(error) }));
	}
	return res;
}

type Response =
	| { ok: true; status: 200; payload: object | string }
	| { ok: false; status: number; name: string; message: string };
function genRes(res: Response): string {
	return JSON.stringify(res);
}

import { ScriptError } from "./error";
import type { RawItem } from "./types";

export const strToU8arr = (str: string) => new Uint8Array(str.split("").map((s) => s.charCodeAt(0)));
/** 整数に変換し、変換不能な場合は-1を返す */
export const mayBeNumber = (n: RawItem): number => {
	// 数値ならNaNチェックしてそのまま
	if (typeof n === "number" && !Number.isNaN(n)) return n;
	// 文字列なら、数値変換後一致を確認して返す
	if (
		typeof n === "string" &&
		!Number.isNaN(Number.parseInt(n, 10)) &&
		Number.parseInt(n, 10).toString() === n.trim()
	)
		return Number.parseInt(n, 10);
	// それ以外
	return -1;
};
/** 文字列または"-"を返す */
export const mayBeString = (s: RawItem): string => {
	// 空文字は"-"に変換
	if (typeof s === "string" && !!s) return s;
	if (typeof s === "number" && !Number.isNaN(s)) return s.toString();
	return "-";
};

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

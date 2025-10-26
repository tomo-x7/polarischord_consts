import { InternalServerError, InvalidTokenError, ScriptError } from "./error";
import { logger } from "./logger";
import type { data, out } from "./types";
import { createErrorResponse, createResponse, numOrZero, parseInf } from "./util";

const SHEATURL = "https://docs.google.com/spreadsheets/d/1nC9tfgg0vTQttDCACbZr9aDWKWjEtk676ZlRVW-glUk/";
const SHEAT_NAME = "定数表メイン";

function main(): data[] {
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

	return data;
}

function test() {
	const r = main();
	console.log(JSON.stringify(r, undefined, 2));
}

// データ取得用
// TOKENの都合・キャッシュ防止でPOST
function doPost(ev: GoogleAppsScript.Events.DoPost) {
	try {
		const validToken = PropertiesService.getScriptProperties().getProperty("TOKEN");
		if (!validToken) {
			logger.fatal("TOKEN is not set");
			throw new InternalServerError("TOKEN is not set");
		}
		if (ev.postData.contents !== validToken) {
			throw new InvalidTokenError("Invalid Token");
		}
		const res = main();
		return createResponse(res);
	} catch (e) {
		if (!(e instanceof ScriptError)) logger.fatal(e);
		return createErrorResponse(e);
	}
}
// 定時デプロイ用
function cron() {
	try {
		const data = main();
		// GitHub Actionsに送信
	} catch (e) {
		logger.fatal(e);
	}
}

//@ts-expect-error
global.test = test;
//@ts-expect-error
global.doPost = doPost;
//@ts-expect-error
global.cron = cron;

import { InternalServerError, InvalidTokenError, ScriptError } from "./error";
import { logger } from "./logger";
import type { Music, Raw } from "./types";
import { createErrorResponse, createResponse, mayBeNumber, mayBeString, strToU8arr } from "./util";

const SHEATURL = "https://docs.google.com/spreadsheets/d/1nC9tfgg0vTQttDCACbZr9aDWKWjEtk676ZlRVW-glUk/";
const SHEAT_NAME = "定数表メイン";

function main(): Music[] {
	const doc = SpreadsheetApp.openByUrl(SHEATURL);
	const sheat = doc.getSheetByName(SHEAT_NAME);
	if (!sheat) {
		throw new InternalServerError("sheat not found");
	}
	const rawdata = sheat.getRange("A2:X1000").getValues() as Raw;
	const data: Music[] = rawdata
		.map((raw) => {
			const [
				name, // 楽曲名
				composer, // アーティスト名
				diffInf, // INF難易度
				constInf, // INF定数
				diffHard, // HARD難易度
				constHard, // HARD定数
				diffNormal, // Normal難易度
				diffEasy, // Easy難易度
				bpm, // BPM
				time, // 時間
				added, // 追加日
				notesInf, // ノーツ数Inf
				notesHard, // ノーツ数Hard
				notesNormal, // ノーツ数Normal
				notesEasy, // ノーツ数Easy
				createrInf, // 譜面製作者
				createrHard, // 譜面製作者
				createrNormal, // 譜面製作者
				createrEasy, // 譜面製作者
				infVideoUrl, // 譜面動画URLInf
				hardVideoUrl, // 譜面動画URLHard
				infImageUrl, // 譜面画像URL
				kanaName, // 推定楽曲読みがな
				id, // 公式ID
			] = raw;
			// 空行
			if (name == null || name === "") return undefined;
			const hasInf = diffInf !== "-";
			return {
				id: mayBeString(id),
				name: mayBeString(name),
				kanaName: mayBeString(kanaName),
				composer: mayBeString(composer),
				bpm: mayBeNumber(bpm),
				time: mayBeString(time),
				added: mayBeString(added),
				diffs: {
					easy: { diff: mayBeNumber(diffEasy) },
					normal: { diff: mayBeNumber(diffNormal) },
					hard: { diff: mayBeNumber(diffHard), const: mayBeNumber(constHard) },
					inf: hasInf ? { diff: mayBeNumber(diffInf), const: mayBeNumber(constInf) } : null,
				},
				notes: {
					easy: mayBeNumber(notesEasy),
					normal: mayBeNumber(notesNormal),
					hard: mayBeNumber(notesHard),
					inf: hasInf ? mayBeNumber(notesInf) : null,
				},
				creaters: {
					easy: mayBeString(createrEasy),
					normal: mayBeString(createrNormal),
					hard: mayBeString(createrHard),
					inf: hasInf ? mayBeString(createrInf) : null,
				},
				links: {
					hardVideo: mayBeString(hardVideoUrl),
					infVideo: mayBeString(infVideoUrl),
					infImage: mayBeString(infImageUrl),
				},
			} satisfies Music;
		})
		.filter((v) => v != null);

	return data;
}

function calcHash(data: string) {
	const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, data);
	return Utilities.base64Encode(raw);
}

function checkHash(data: string) {
	const hash = calcHash(data);
	const last = PropertiesService.getScriptProperties().getProperty("LAST_HASH");
	return hash === last;
}

function saveHash(data: string) {
	const hash = calcHash(data);
	PropertiesService.getScriptProperties().setProperty("LAST_HASH", hash);
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
		saveHash(JSON.stringify(res));
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
		const isSame = checkHash(JSON.stringify(data));
		if (isSame) {
			logger.skipped();
			return;
		}
		saveHash(JSON.stringify(data));
		// GitHub Actionsに送信
	} catch (e) {
		if (!(e instanceof ScriptError)) logger.fatal(e);
	}
}

//@ts-expect-error
global.test = test;
//@ts-expect-error
global.doPost = doPost;
//@ts-expect-error
global.cron = cron;

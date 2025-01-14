import type { music } from "./types";

export type sortAlgo = (a: music, b: music) => number;
export type sortData = { algo: keyof typeof sortAlgos; reverse: boolean };
const ByName: sortAlgo = (a, b) => (a.name > b.name ? 1 : -1);
const ByComposer: sortAlgo = (a, b) => {
	if (a.composer === b.composer) return ByName(a, b);
	return a.composer > b.composer ? 1 : -1;
};
const ByConstsInf: sortAlgo = (a, b) => {
	return compareConst(a.consts.inf, a.diff.inf, b.consts.inf, b.diff.inf) ?? ByName(a, b);
};
const ByConstsHard: sortAlgo = (a, b) => {
	return compareConst(a.consts.hard, a.diff.hard, b.consts.hard, b.diff.hard) ?? ByName(a, b);
};
const compareConst = (constsA: number, diffA: number, constsB: number, diffB: number) => {
	//等しい場合、名前判断（不明な場合は一回スルー）
	if (constsA === constsB && constsA !== 0) return undefined;
	//infが存在しないものは最下位
	if (constsA === -1) return -1;
	if (constsB === -1) return 1;
	//両方不明な場合は難易度判断
	if (constsA === 0 && constsB === 0) return diffA > diffB ? 1 : -1;
	//定数が不明な場合.0あつかい（判明済み優先）
	if (constsA === 0) return diffA > constsB ? 1 : -1;
	if (constsB === 0) return constsA >= diffB ? 1 : -1;
	return constsA > constsB ? 1 : -1;
};
export const sortAlgos = {
	name: ByName,
	composer: ByComposer,
	constInf: ByConstsInf,
	constHard: ByConstsHard,
};

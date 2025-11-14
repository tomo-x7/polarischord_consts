import type { Music, SortAlgo } from "./types";

const ByName: SortAlgo = (a, b) => (a.name > b.name ? 1 : -1);
const ByComposer: SortAlgo = (a, b) => {
	if (a.composer === b.composer) return ByName(a, b);
	return a.composer > b.composer ? 1 : -1;
};
const ByConstsInf: SortAlgo = (a, b) => {
	return compareConst(a, b, "inf") ?? ByName(a, b);
};
const ByConstsHard: SortAlgo = (a, b) => {
	return compareConst(a, b, "hard") ?? ByName(a, b);
};
const compareConst = (a: Music, b: Music, lev: "inf" | "hard" | "normal" | "easy") => {
	const diffA = a.diffs[lev]?.diff;
	const diffB = b.diffs[lev]?.diff;
	const constsA = a.diffs[lev]?.const;
	const constsB = b.diffs[lev]?.const;

	//該当難易度が存在しないものは最下位
	if (diffA == null) return -1;
	if (diffB == null) return 1;
	//両方不明な場合は難易度判断
	if (constsA == null && constsB == null) return diffA > diffB ? 1 : -1;
	//定数が不明な場合.0あつかい（判明済み優先）
	if (constsA == null) return diffA > constsB! ? 1 : -1; //constsBはnullではない
	if (constsB == null) return constsA >= diffB ? 1 : -1;
	//等しい場合、名前判断（不明な場合は一回スルー）
	if (constsA === constsB) return undefined;
	// 定数で比較
	return constsA > constsB ? 1 : -1;
};
export const sortAlgos = {
	name: ByName,
	composer: ByComposer,
	constInf: ByConstsInf,
	constHard: ByConstsHard,
};

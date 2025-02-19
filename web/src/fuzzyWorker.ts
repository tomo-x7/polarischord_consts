import { parse } from "./dic";
import type { music, musics } from "./types";

export type WorkerMessage = {
	query: string;
	musics: musics;
};
addEventListener("message", (e: MessageEvent<WorkerMessage>) => {
	const regexp = new RegExp(parse(e.data.query));
	const mapfn = (v: music): { m: music; d: number; sw: "composer" | "name" } => {
		if (regexp.test(parse(v.name))) return { m: v, d: -1, sw: "name" };
		if (regexp.test(parse(v.composer))) return { m: v, d: -1, sw: "composer" };
		const nameScore = del(parse(v.name), parse(e.data.query));
		const composerScore = del(parse(v.composer), parse(e.data.query));
		return { m: v, d: Math.min(nameScore, composerScore), sw: composerScore < nameScore ? "composer" : "name" };
	};
	const searched = e.data.musics.map(mapfn).filter((v) => v.d < Math.min(5, e.data.query.length - 1));
	searched.sort((a, b) => (a.d === b.d ? a.m[a.sw].length - b.m[b.sw].length : a.d - b.d));
	console.log(searched);
	postMessage(searched.map((v) => v.m));
});

const LIMIT = 10;
function delDistance(name: string[], query: string[], score: number): number {
	if (score > LIMIT || query.length === 0) return score;
	const scoreA = delDistance(name, query.slice(1), score + 1);
	const idx = name.indexOf(query[0]);
	const scoreB: number = idx !== -1 ? delDistance(name.slice(idx + 1), query.slice(1), score) : LIMIT + 1;
	// console.log(`name:${name.join("")} q:${query.join("")} A:${scoreA} B:${scoreB}`)
	return Math.min(scoreA, scoreB);
}

function del(name: string, query: string) {
	if (query.length > name.length + LIMIT) return LIMIT + 1;
	return delDistance(Array.from(name), Array.from(query), 0);
}

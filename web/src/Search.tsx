import { useState, type ChangeEvent } from "react";
import type { music, searchAlgo } from "./types";
import { del } from "./distance";
import { parse } from "./dic";

export function Search({
	algo,
	setAlgo,
}: { algo: searchAlgo | undefined; setAlgo: React.Dispatch<React.SetStateAction<searchAlgo | undefined>> }) {
	const [isFuzzy, setFuzzy] = useState(false);
	const [word, setWord] = useState<string>("");
	const onFuzzyInput = (ev: ChangeEvent<HTMLInputElement>) => {
		setFuzzy(ev.target.checked);
		const fn = ev.target.checked ? createFuzzySearchFn(word) : createSearchFn(word);
		setAlgo(fn ? { fn, canSort: !ev.target.checked } : undefined);
	};
	const onWordInput = ({ target: { value: v } }: ChangeEvent<HTMLInputElement>) => {
		setWord(v);
		const fn = isFuzzy ? createFuzzySearchFn(v) : createSearchFn(v);
		setAlgo(fn ? { fn, canSort: !isFuzzy } : undefined);
	};
	return (
		<>
			<div>
				<label className="mr-2">
					検索
					<input className="w-60 tablet:w-52 sp:w-40" type="text" onChange={onWordInput} value={word ?? ""} />
				</label>
				<wbr />
				<label className="whitespace-nowrap">
					<input type="checkbox" onChange={onFuzzyInput} checked={isFuzzy} />
					あいまい検索
				</label>
			</div>
		</>
	);
}

const createSearchFn = (query: string): searchAlgo["fn"] | undefined => {
	if (query === "") return undefined;
	const regexp = new RegExp(parse(query));
	return (m) => m.filter((v) => regexp.test(parse(v.name)) || regexp.test(parse(v.composer)));
};
const createFuzzySearchFn = (query: string): searchAlgo["fn"] | undefined => {
	if (query === "") return undefined;
	const regexp = new RegExp(parse(query));
	return (m) => {
		const mapfn = (v: music): { m: music; d: number; sw: "composer" | "name" } => {
			if (regexp.test(parse(v.name))) return { m: v, d: -1, sw: "name" };
			if (regexp.test(parse(v.composer))) return { m: v, d: -1, sw: "composer" };
			const nameScore = del(parse(v.name), parse(query));
			const composerScore = del(parse(v.composer), parse(query));
			return { m: v, d: Math.min(nameScore, composerScore), sw: composerScore < nameScore ? "composer" : "name" };
		};
		const searched = m.map(mapfn).filter((v) => v.d < Math.min(5, query.length - 1));
		searched.sort((a, b) => (a.d === b.d ? a.m[a.sw].length - b.m[b.sw].length : a.d - b.d));
		console.log(searched);
		return searched.map((v) => v.m);
		// return m
	};
};
// const createFuzzySearchFn2 = (query: string): searchAlgo["fn"] | undefined => {
// 	if (query === "") return undefined;
// 	return (m) => {
// 		const mapfn = (v: music): { m: music; d: number; sw: "composer" | "name" } => {
// 			const nameScore = editONP(query, v.name);
// 			const composerScore = editONP(query, v.composer);
// 			return { m: v, d: Math.max(nameScore, composerScore), sw: composerScore > nameScore ? "composer" : "name" };
// 		};
// 		const searched = m.map(mapfn).filter((v) => v.d > 0);
// 		searched.sort((a, b) => (a.d === b.d ? a.m[a.sw].length - b.m[b.sw].length : b.d - a.d));
// 		console.log(searched);
// 		return searched.map((v) => v.m);
// 		// return m
// 	};
// };
// const createFuzzySearchFn3 = (query: string): searchAlgo["fn"] | undefined => {
// 	if (query === "") return undefined;
// 	return (m) => {
// 		const mapfn = (v: music): { m: music; d: number; sw: "composer" | "name" } => {
// 			const nameScore = editDistanceONP(parse(v.name), parse(query));
// 			const composerScore = editDistanceONP(parse(v.composer), parse(query));
// 			return { m: v, d: Math.min(nameScore, composerScore), sw: composerScore < nameScore ? "composer" : "name" };
// 		};
// 		const searched = m.map(mapfn).filter((v) => v.d < Math.min(5, query.length - 1));
// 		searched.sort((a, b) => (a.d === b.d ? a.m[a.sw].length - b.m[b.sw].length : a.d - b.d));
// 		console.log(searched);
// 		return searched.map((v) => v.m);
// 		// return m
// 	};
// };

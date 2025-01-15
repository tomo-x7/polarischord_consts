import { useState, ChangeEvent } from "react";
import { filterAlgo, searchAlgo } from "./types";
import { editONP } from "./distance";
import moji from "Moji";

const musicMap = new Map<string, string>();

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
			<label>
				検索
				<input type="text" onChange={onWordInput} value={word ?? ""} />
			</label>
			<label>
				<input type="checkbox" onChange={onFuzzyInput} checked={isFuzzy} />
				あいまい検索
			</label>
		</>
	);
}

const createSearchFn = (word: string): searchAlgo["fn"] | undefined => {
	if (word === "") return undefined;
	const regexp = new RegExp(parse(word));
	return (m) => m.filter((v) => regexp.test(parse(v.name)) || regexp.test(parse(v.composer)));
};
const createFuzzySearchFn = (word: string): searchAlgo["fn"] | undefined => {
	if (word === "") return undefined;
	return (m) => {
		const searched = m
			.map((v) => ({ m: v, d: Math.max(editONP(word, v.name), editONP(word, v.composer)) }))
			.filter((v) => v.d > 0.6);
		searched.sort((a, b) => b.d - a.d);
		console.log(searched);
		return searched.map((v) => v.m);
		// return m
	};
};
const dict: [string, string][] = [
	["Ö<3rf10₩", "overflow"],
	["・", ""],
];
function parse(str: string) {
    if(!str)return ""
	if (musicMap.has(str)) return musicMap.get(str) ?? "";
	try{let parsed = moji(str)
		.convert("ZE", "HE")
		.convert("HK", "ZK")
		.convert("KK", "HG")
		.reject("HS")
		.reject("ZS")
		.toString()
		.toLowerCase();
	for (const [bef, aft] of dict) {
		parsed = parsed.replace(new RegExp(bef, "g"), aft);
	}
	musicMap.set(str, parsed);
	return parsed;}catch(e){console.error(e);return ""}
}

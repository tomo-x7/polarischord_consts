import { useState, ChangeEvent } from "react";
import { filterAlgo, searchAlgo } from "./types";
import { editONP } from "./distance";

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
	const regexp = new RegExp(word);
	return (m) => m.filter((v) => regexp.test(v.name) || regexp.test(v.composer));
};
const createFuzzySearchFn = (word: string): searchAlgo["fn"] | undefined => {
	if (word === "") return undefined;
	return (m) => {
		// const searched = m
		// 	.map((v) => ({ m: v, d: Math.max(editONP(word, v.name), editONP(word, v.composer)) }))
		// 	.filter((v) => v.d > 0.6);
		// searched.sort((a, b) => a.d - b.d);
		// return searched.map((v) => v.m);
        return m
	};
};

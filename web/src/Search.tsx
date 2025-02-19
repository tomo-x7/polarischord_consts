import { useState, type ChangeEvent } from "react";
import type { music, searchAlgo } from "./types";
import { parse } from "./dic";
import fuzzyWorker from "./fuzzyWorker?worker";
const worker = new fuzzyWorker();

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
	return async (m) =>
		new Promise((resolve) => {
			worker.postMessage({ query, musics: m });
			worker.onmessage = (e: MessageEvent<music[]>) => resolve(e.data);
		});
};

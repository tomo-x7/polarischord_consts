import { type ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { parse } from "./dic";
import fuzzyWorker from "./fuzzyWorker?worker";
import type { Music, SearchAlgo } from "./types";

const worker = new fuzzyWorker();

export function Search({
	algo,
	setAlgo,
}: {
	algo: SearchAlgo | undefined;
	setAlgo: React.Dispatch<React.SetStateAction<SearchAlgo | undefined>>;
}) {
	const [isFuzzy, setFuzzy] = useState(false);
	const [word, setWord] = useState<string>("");
	const onFuzzyInput = useDebouncedCallback((ev: ChangeEvent<HTMLInputElement>) => {
		setFuzzy(ev.target.checked);
		const fn = ev.target.checked ? createFuzzySearchFn(word) : createSearchFn(word);
		setAlgo(fn ? { fn, canSort: !ev.target.checked } : undefined);
	}, 100);
	const onWordInput = useDebouncedCallback(({ target: { value: v } }: ChangeEvent<HTMLInputElement>) => {
		setWord(v);
		const fn = isFuzzy ? createFuzzySearchFn(v) : createSearchFn(v);
		setAlgo(fn ? { fn, canSort: !isFuzzy } : undefined);
	}, 100);
	return (
		<div>
			<label className="mr-2">
				検索
				<input className="w-60 tablet:w-52 sp:w-40" type="text" onChange={onWordInput} />
			</label>
			<wbr />
			<label className="whitespace-nowrap">
				<input type="checkbox" onChange={onFuzzyInput} />
				あいまい検索
			</label>
		</div>
	);
}

const createSearchFn = (query: string): SearchAlgo["fn"] | undefined => {
	if (query === "") return undefined;
	const regexp = new RegExp(parse(query));
	return (m) => m.filter((v) => regexp.test(parse(v.name)) || regexp.test(parse(v.composer)));
};
const createFuzzySearchFn = (query: string): SearchAlgo["fn"] | undefined => {
	if (query === "") return undefined;
	const regexp = new RegExp(parse(query));
	return async (m) =>
		new Promise((resolve) => {
			worker.postMessage({ query, musics: m });
			worker.onmessage = (e: MessageEvent<Music[]>) => resolve(e.data);
		});
};

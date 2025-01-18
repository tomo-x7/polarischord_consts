import { use } from "react";
import type { musics, metadata, sortData, filterAlgo, searchAlgo } from "./types";
import { Music } from "./Music";
import { sortAlgos } from "./sortAlgo";

export function Data({
	data,
	sort: { algo: algoName, reverse },
	filterFn,
	search,
}: { data: Promise<{ data: musics; meta: metadata }>; sort: sortData; filterFn: filterAlgo; search?: searchAlgo }) {
	const { data: origindata, meta } = use(data);

	const { fn, canSort = true } = search ?? {};
	const musicDataPromise = dosync(() => {
		//検索を実行
		const musicdata = (fn ? fn(origindata) : origindata).filter(filterFn.fn);
		//ソート
		if (canSort) {
			const algo = sortAlgos[algoName];
			musicdata.sort(algo);
			if (reverse) musicdata.reverse();
		}
		return musicdata;
	});

	return (
		<>
			<DataViews dataPromise={musicDataPromise} />
			<div className="mt-2">
				楽曲データ最終更新確認:
				{new Date(meta.lastupdate).toLocaleString()}
			</div>
		</>
	);
}

function DataViews({ dataPromise }: { dataPromise: Promise<musics> | musics }) {
	const data = Array.isArray(dataPromise) ? dataPromise : use(dataPromise);
	return (
		// <Suspense fallback={<>loading...</>}>
		<div className="max-w-full w-min tablet:w-auto">
			{data.map((m, i) => (
				<Music music={m} bg={i % 2 === 0 ? "#fff" : "#eee"} key={m.name} />
			))}
		</div>
		// </Suspense>
	);
}

function searchAsync(originalData: musics, fn: searchAlgo["fn"] | undefined, filter: filterAlgo) {
	return new Promise<musics>((resolve) => {
		setTimeout(() => {
			resolve((fn ? fn(originalData) : originalData).filter(filter.fn));
		}, 0);
	});
}

function doAsync<T>(action: () => T) {
	return new Promise<T>((resolve) => {
		setTimeout(() => {
			resolve(action());
		}, 0);
	});
}
function dosync<T>(action: () => T) {
	return action();
}

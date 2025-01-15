import { use } from "react";
import type { musics, metadata, sortData, filterAlgo, searchAlgo } from "./types";
import { Music } from "./Music";
import { sortAlgos } from "./sortAlgo";

export function Data({
	data,
	sort: { algo: algoName, reverse },
	filter,
	search,
}: { data: Promise<{ data: musics; meta: metadata }>; sort: sortData; filter?: filterAlgo; search?: searchAlgo }) {
	const { data: origindata, meta } = use(data);

	const { fn, canSort = true } = search ?? {};
	//検索を実行
	const musicdata = (fn ? fn(origindata) : origindata).filter(filter ?? defaultFilter);
	//ソート
	if (canSort) {
		const algo = sortAlgos[algoName];
		musicdata.sort(algo);
		if (reverse) musicdata.reverse();
	}

	return (
		<>
			<div className="w-min sp:w-auto">
				{musicdata.map((m, i) => (
					<Music music={m} bg={i % 2 === 0 ? "#fff" : "#eee"} key={m.name} />
				))}
			</div>
			<div className="mt-2">
				楽曲データ最終更新確認:
				{new Date(meta.lastupdate).toLocaleString()}
			</div>
		</>
	);
}

const defaultFilter = () => true;

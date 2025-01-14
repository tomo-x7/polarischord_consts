import { use } from "react";
import type { musics, metadata } from "./types";
import { Music } from "./Music";
import { sortAlgos, type sortData } from "./sortAlgo";

export function Data({
	data,
	sort: { algo: algoName, reverse },
}: { data: Promise<{ data: musics; meta: metadata }>; sort: sortData }) {
	const { data: origindata, meta } = use(data);
	const algo = sortAlgos[algoName];
	const musicdata=origindata.slice();
	musicdata.sort(algo)
	if(reverse)musicdata.reverse()

	console.log(musicdata);
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

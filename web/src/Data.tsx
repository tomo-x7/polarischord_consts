import { use } from "react";
import type { musics, metadata } from "./types";
import { Music } from "./Music";

export function Data({ data }: { data: Promise<{ data: musics; meta: metadata }> }) {
	const { data: musicdata, meta } = use(data);
	musicdata.sort((a, b) => (a.name > b.name ? 1 : -1));
    console.log(musicdata)
	return (
		<>
			{musicdata.map((m) => (
				<Music music={m} key={m.name} />
			))}
			<div>
				楽曲データ最終更新確認:
				{new Date(meta.lastupdate).toLocaleString()}
			</div>
		</>
	);
}

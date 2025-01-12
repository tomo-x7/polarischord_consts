import type { music } from "./types";

const diffs = ["easy", "normal", "hard", "inf"] as const;
export function Music({ music }: { music: music }) {
	return (
		<>
			<div>
				<div>{music.name}</div>
				<div>{music.composer}</div>
				<div>
					{diffs
						.map((p) => parseConst(music,p))
						.map((n, i) => (
							<span key={music.name + n + i.toString()}>{n}</span>
						))}
				</div>
			</div>
		</>
	);
}
function parseConst(music:music,lev: "easy" | "normal" | "hard" | "inf") {
    const diff=music.diff[lev]
	//diffが-1の場合(infのみ)infが存在しない
	if (diff === -1) return "-";
	//diffが0の場合(inf以外)不明
	if (diff === 0) return "?";
    //easyとnormalの場合、定数は表示しないで難易度のみ表示
    if(lev==="easy"||lev==="normal"){
        return diff.toString()
    }
    const consts= music.consts[lev]
	//diffはわかっているがconstsが不明の場合、12.?のような形式で表示
	if (consts === 0||consts==null) return `${diff.toString()}.?`;
	//それ以外　定数は小数点以下一桁まで表示
	return consts.toFixed(1);
}

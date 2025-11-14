import type { Music as MusicT } from "./types";

const diffs = ["easy", "normal", "hard", "inf"] as const;
const colors = ["#b7fcff", "#b7ffdf", "#fff5ca", "#ffd6f7"] as const;
export function Music({ music, bg }: { music: MusicT; bg: string }) {
	return (
		<div
			className="p-1 max-w-full flex justify-between gap-3 tablet:flex-col sp:gap-0"
			style={{ backgroundColor: bg }}
		>
			<div className="overflow-hidden">
				<div className="text-xl sp:text-base whitespace-nowrap overflow-hidden text-ellipsis">{music.name}</div>
				<div className="text-sm sp:text-xs whitespace-nowrap overflow-hidden text-ellipsis">
					{music.composer || "???"}
				</div>
			</div>
			<div className="flex shrink-0 justify-between flex-row gap-4 items-center sp:px-4">
				{diffs
					.map((p) => parseConst(music, p))
					.map((n, i) => (
						<div
							className="w-10 h-10 rounded-full flex justify-center items-center sp:text-xs sp:w-7 sp:h-7"
							style={{ backgroundColor: colors[i] }}
							key={music.name + n + i.toString()}
						>
							{n}
						</div>
					))}
			</div>
		</div>
	);
}
function parseConst(music: MusicT, lev: "easy" | "normal" | "hard" | "inf") {
	const diff = music.diffs[lev]?.diff;
	//diffs内に存在しない場合(infのみ)infが存在しない
	if (diff == null) return "-";
	//diffが-1の場合不正(空文字とかの場合これになる、未判明含む)
	if (diff === -1) return "?";
	//easyとnormalの場合、定数は表示しないで難易度のみ表示
	if (lev === "easy" || lev === "normal") return diff.toString();
	//9以下は定数が存在しない(9.0)と思われる
	if (diff <= 9) return diff.toString();

	const consts = music.diffs[lev]?.const;
	//diffはわかっているがconstsが不明の場合、12.?のような形式で表示
	if (consts == null) return `${diff.toString()}.?`;
	//それ以外　定数は小数点以下一桁まで表示
	return consts.toFixed(1);
}

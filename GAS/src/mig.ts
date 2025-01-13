//spreadsheatの移行用に使ったやつ。念のため取っておく
const SHEATURL = "https://docs.google.com/spreadsheets/d/1nC9tfgg0vTQttDCACbZr9aDWKWjEtk676ZlRVW-glUk/";
enum SHEAT {
	EASY = "楽曲(EASY)",
	NORMAL = "楽曲(NORMAL)",
	HARD = "楽曲(HARD)",
	INF = "楽曲(INF)",
}
const SHEAT_STR = ["inf", "hard", "normal", "easy"] as const;
type diffs<T = number> = { easy: T; normal: T; hard: T; inf: T };
type data = {
	name: string;
	composer: string;
	diff: diffs;
	consts: diffs;
};
type out = [string, string, number | "", number | ""][];

function main() {
	const doc = SpreadsheetApp.openByUrl(SHEATURL);
	const inf = doc.getSheetByName(SHEAT.INF);
	const hard = doc.getSheetByName(SHEAT.HARD);
	const normal = doc.getSheetByName(SHEAT.NORMAL);
	const easy = doc.getSheetByName(SHEAT.EASY);
	if (!inf || !hard || !normal || !easy) {
		throw new Error("sheat not found");
	}
	const sheats = { easy, normal, hard, inf };

	const map = new Map<string, data>();
	const smallmaps: {
		[key in keyof typeof sheats]: Map<string, { name: string; composer: string; diff: number; consts: number }>;
	} = { easy: new Map(), normal: new Map(), hard: new Map(), inf: new Map() };
	const musics = new Set<string>();
	for (const i of SHEAT_STR) {
		const smallmap = smallmaps[i];
		const values = sheats[i].getRange("A2:D1000").getValues() as out;
		for (const v of values) {
			if (v[0] === "") {
				break;
			}
			const diff = typeof v[2] === "number" ? v[2] : 0;
			const consts = typeof v[3] === "number" ? v[3] : 0;
			smallmap.set(v[0], { name: v[0], composer: v[1], diff, consts });
			musics.add(v[0]);
		}
	}
	for (const music of musics) {
		const easy = smallmaps.easy.get(music);
		const normal = smallmaps.normal.get(music);
		const hard = smallmaps.hard.get(music);
		const inf = smallmaps.inf.get(music);
		const composer = inf?.composer ?? hard?.composer ?? normal?.composer ?? easy?.composer ?? "unknown";
		const diff: diffs = {
			easy: easy?.diff ?? 0,
			normal: normal?.diff ?? 0,
			hard: hard?.diff ?? 0,
			inf: inf?.diff ?? -1,
		};
		const consts: diffs = {
			easy: easy?.consts ?? 0,
			normal: normal?.consts ?? 0,
			hard: hard?.consts ?? 0,
			inf: inf?.consts ?? 0,
		};
		map.set(music, { name: music, composer, diff, consts });
	}
	const maparr = Array.from(map.values());
	console.log(maparr.map((d) => d.name));

	const writeSheat = doc.getSheetByName("サイト用prototype書き込みテスト");
	if (!writeSheat) throw new Error();
	for (let i = 0; i < 1000; i++) {
		const t = maparr[i];
		if (!t) {
			break;
		}
		writeSheat
			.getRange(i + 2, 1, 1, 8)
			.setValues([
				[
					t.name,
					t.composer,
					t.diff.inf,
					t.consts.inf,
					t.diff.hard,
					t.consts.hard,
					t.diff.normal,
					t.diff.easy,
				].map((v) => v || ""),
			]);
	}
}

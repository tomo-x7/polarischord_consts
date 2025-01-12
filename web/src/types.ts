export type diffs<T = number> = { easy: T; normal: T; hard: T; inf: T };
export type music = {
	name: string;
	composer: string;
	diff: diffs;
	consts: diffs;
};
export type musics = music[];
export type metadata = { lastupdate: string; hash: string };

import type { sortAlgos } from "./sortAlgo";

export type diffs = { easy: number; normal: number; hard: number; inf: number };
export type consts = { hard: number; inf: number };
export type music = {
	name: string;
	composer: string;
	diff: diffs;
	consts: consts;
	score?: number;
};
export type musics = music[];
export type metadata = { lastupdate: string; hash: string };

export type sortAlgo = (a: music, b: music) => number;
export type sortData = { algo: keyof typeof sortAlgos; reverse: boolean };

export type filterAlgo = (music: music) => boolean;

export type searchAlgo = { fn: (musics: musics) => musics; canSort: boolean };

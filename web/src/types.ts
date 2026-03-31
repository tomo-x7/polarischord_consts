import type { Music } from "../../common/types";
import type { sortAlgos } from "./sortAlgo";

export type { Music };
export type Musics = Music[];

export type Metadata = { lastupdate: string; hash: string };

export type SortAlgo = (a: Music, b: Music) => number;
export type SortData = { algo: keyof typeof sortAlgos; reverse: boolean };

export type FilterAlgo = { fn: (music: Music) => boolean };

export type SearchAlgo = { fn: (musics: Musics) => Musics | Promise<Musics>; canSort: boolean };

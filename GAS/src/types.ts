export type RawItem = string | number | undefined;
export type Raw = RawItem[][];

type DiffConst = { diff: number; const?: number };
// infがない場合はnull
type Diffs = { easy: DiffConst; normal: DiffConst; hard: DiffConst; inf: DiffConst | null };
type Notes = { easy: number; normal: number; hard: number; inf: number | null };
type Creaters = { easy: string; normal: string; hard: string; inf: string | null };
type Links = { infVideo?: string; hardVideo?: string; infImage?: string };

export type Music = {
	id: string;
	name: string;
	composer: string;
	bpm: number;
	time: string;
	diffs: Diffs;
	added: string;
	notes: Notes;
	creaters: Creaters;
	links: Links;
};

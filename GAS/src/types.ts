type diffs = { easy: number; normal: number; hard: number; inf: number };
type consts = { hard: number; inf: number };
export type data = {
	name: string;
	composer: string;
	diff: diffs;
	consts: consts;
};
export type out = [
	string | number,
	string | number,
	number | "" | "-",
	number | "" | "-",
	number | "",
	number | "",
	number | "",
	number | "",
][];

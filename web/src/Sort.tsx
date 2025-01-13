import type { ReactNode } from "react";
import { sortAlgos, type sortData } from "./sortAlgo";

const algoNames: Record<keyof typeof sortAlgos, string> = {
	name: "曲名",
	composer: "作曲者名",
	constInf: "難易度定数(Inf)",
	constHard: "難易度定数(Hard)",
};
const algoKeys = Object.keys(sortAlgos) as (keyof typeof sortAlgos)[];
export function Sort({ setSort, now }: { setSort: React.Dispatch<React.SetStateAction<sortData>>; now: sortData }) {
	const onRadioChange: React.ChangeEventHandler<HTMLInputElement> = (ev) =>
		setSort({ algo: now.algo, reverse: ev.target.value === "1" });
	const onSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (ev) =>
		setSort({ algo: ev.target.value as keyof typeof sortAlgos, reverse: now.reverse });
	return (
		<>
			<div className="mt-5 mb-2">
				<label>
					並べ替え
					<select className="mr-4 ml-1" onChange={onSelectChange}>
						{algoKeys.map((k) => (
							<option key={k} value={k} selected={k === now.algo}>
								{algoNames[k]}
							</option>
						))}
					</select>
				</label>
				<Radio name="rev" value="0" checked={!now.reverse} onchange={onRadioChange}>
					昇順
				</Radio>
				<Radio name="rev" value="1" checked={now.reverse} onchange={onRadioChange}>
					降順
				</Radio>
			</div>
		</>
	);
}

function Radio({
	checked,
	children,
	name,
	onchange,
	value,
}: {
	children: ReactNode;
	checked?: boolean;
	name: string;
	onchange: React.ChangeEventHandler<HTMLInputElement>;
	value: string;
}) {
	return (
		<>
			<label className="mx-1">
				<input type="radio" checked={checked} name={name} onChange={onchange} value={value} />
				{children}
			</label>
		</>
	);
}

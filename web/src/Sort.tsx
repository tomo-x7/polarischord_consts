import type { ReactNode } from "react";
import { sortAlgos } from "./sortAlgo";
import type { sortData } from "./types";

const algoNames: Record<keyof typeof sortAlgos, string> = {
	name: "曲名",
	composer: "作曲者名",
	constInf: "難易度定数(Inf)",
	constHard: "難易度定数(Hard)",
};
const algoKeys = Object.keys(sortAlgos) as (keyof typeof sortAlgos)[];
export function Sort({
	setSort,
	now,
	canSort = true,
}: { setSort: React.Dispatch<React.SetStateAction<sortData>>; now: sortData; canSort?: boolean }) {
	const onRadioChange: React.ChangeEventHandler<HTMLInputElement> = (ev) =>
		setSort({ algo: now.algo, reverse: ev.target.value === "1" });
	const onSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (ev) =>
		setSort({ algo: ev.target.value as keyof typeof sortAlgos, reverse: now.reverse });
	return (
		<>
			<div className="mt-5 mb-2">
				<label>
					並べ替え
					<select className="mr-4 ml-1" onChange={onSelectChange} value={now.algo} disabled={!canSort}>
						{algoKeys.map((k) => (
							<option key={k} value={k}>
								{algoNames[k]}
							</option>
						))}
					</select>
				</label>
				<Radio name="rev" value="0" checked={!now.reverse} onchange={onRadioChange} disabled={!canSort}>
					昇順
				</Radio>
				<Radio name="rev" value="1" checked={now.reverse} onchange={onRadioChange} disabled={!canSort}>
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
	disabled = false,
}: {
	children: ReactNode;
	checked?: boolean;
	name: string;
	onchange: React.ChangeEventHandler<HTMLInputElement>;
	value: string;
	disabled?: boolean;
}) {
	return (
		<>
			<label className="mx-1">
				<input
					type="radio"
					checked={checked}
					name={name}
					onChange={onchange}
					value={value}
					disabled={disabled}
				/>
				{children}
			</label>
		</>
	);
}

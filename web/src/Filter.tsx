import { type ChangeEvent, useState } from "react";
import type { FilterAlgo } from "./types";

export function Filter({ setFilter }: { setFilter: React.Dispatch<React.SetStateAction<FilterAlgo>> }) {
	const [onlyInf, setOnlyInf] = useState(false);
	const [onlyConst, setOnlyConst] = useState(false);
	const [onlyNoConst, setOnlyNoConst] = useState(false);
	const onlyInfChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setOnlyInf(ev.target.checked);
		setFilter(createFilter(ev.target.checked, onlyConst, onlyNoConst));
	};
	const onlyConstChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setOnlyConst(ev.target.checked);
		setFilter(createFilter(onlyInf, ev.target.checked, onlyNoConst));
	};
	const onlyNoConstChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setOnlyNoConst(ev.target.checked);
		setFilter(createFilter(onlyInf, onlyConst, ev.target.checked));
	};
	return (
		<div className="flex flex-row gap-2 flex-wrap forFilter:flex-col forFilter:gap-0">
			<label className="whitespace-nowrap">
				<input type="checkbox" onChange={onlyInfChange} checked={onlyInf} />
				infが存在しない曲を除外
			</label>
			<label className="whitespace-nowrap">
				<input type="checkbox" onChange={onlyConstChange} checked={onlyConst} />
				infの定数不明を除外
			</label>
			<label className="whitespace-nowrap">
				<input type="checkbox" onChange={onlyNoConstChange} checked={onlyNoConst} />
				infの定数判明済みを除外
			</label>
		</div>
	);
}

function createFilter(onlyInf: boolean, onlyConst: boolean, onlyNoConst: boolean): FilterAlgo {
	return {
		fn: (music) => {
			const hasInf = music.diffs.inf != null;
			const hasConst =
				(!hasInf || music.diffs.inf?.const != null) && //Infがないか、定数判明済
				(music.diffs.hard.diff < 10 || music.diffs.hard.const != null); //hardが10未満か定数判明済
			if (onlyInf && !hasInf) return false;
			if (onlyConst && hasConst) return false;
			if (onlyNoConst && !hasConst) return false;
			return true;
		},
	};
}

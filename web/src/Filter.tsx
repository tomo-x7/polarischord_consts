import { ChangeEvent, useState } from "react";
import { filterAlgo } from "./types";

export function Filter({ setFilter }: { setFilter: React.Dispatch<React.SetStateAction<filterAlgo>> }) {
	const [onlyInf, setOnlyInf] = useState(false);
	const [onlyConst, setOnlyConst] = useState(false);
	const [onlyNoConst, setOnlyNoConst] = useState(false);
	const onlyInfChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setOnlyInf(ev.target.checked);
		setFilter( createFilter(ev.target.checked, onlyConst, onlyNoConst));
	};
	const onlyConstChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setOnlyConst(ev.target.checked);
		setFilter( createFilter(onlyInf, ev.target.checked, onlyNoConst));
	};
	const onlyNoConstChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setOnlyNoConst(ev.target.checked);
		setFilter( createFilter(onlyInf, onlyConst, ev.target.checked));
	};
	return (
		<>
			<label>
				<input type="checkbox" onChange={onlyInfChange} checked={onlyInf} />
				infが存在しない曲を除外
			</label>
			<label>
				<input type="checkbox" onChange={onlyConstChange} checked={onlyConst} />
				infの定数不明を除外
			</label>
			<label>
				<input type="checkbox" onChange={onlyNoConstChange} checked={onlyNoConst} />
				infの定数判明済みを除外
			</label>
		</>
	);
}

function createFilter(onlyInf: boolean, onlyConst: boolean, onlyNoConst: boolean): filterAlgo {
	return {
		fn: (music) => {
			if (onlyInf && music.diff.inf === -1) return false;
            if(onlyConst&&music.consts.inf===0)return false
            if(onlyNoConst&&music.consts.inf>0)return false;
			return true;
		},
	};
}

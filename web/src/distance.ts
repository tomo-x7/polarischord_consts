/*function snake(k: number, yp: number, str1: string, str2: string) {
	let y = yp;
	let x = y - k;
	while (x < str1.length && y < str2.length && str1.charCodeAt(x) === str2.charCodeAt(y)) {
		x++;
		y++;
	}
	return y;
}

export function editDistanceONP(str1: string, str2: string) {
	let s1: string;
	let s2: string;
	if (str1.length < str2.length) {
		s1 = str1;
		s2 = str2;
	} else {
		s1 = str2;
		s2 = str1;
	}
	let k: number;
	let p: number;
	let v0: number;
	let v1: number;
	const len1 = s1.length;
	const len2 = s2.length;
	const delta = len2 - len1;
	const offset = len1 + 1;
	const dd = delta + offset;
	const dc = dd - 1;
	const de = dd + 1;
	const max = len1 + len2 + 3;
	let kk: number;
	//fp = new Array(max);
	const fp = [];

	for (p = 0; p < max; p++) {
		//fp[p] = -1;
		fp.push(-1);
	}
	for (p = 0; fp[dd] !== len2; p++) {
		for (k = -p; k < delta; k++) {
			kk = k + offset;
			v0 = fp[kk - 1] + 1;
			v1 = fp[kk + 1];
			fp[kk] = snake(k, v0 > v1 ? v0 : v1, s1, s2);
		}
		for (k = delta + p; k > delta; k--) {
			kk = k + offset;
			v0 = fp[kk - 1] + 1;
			v1 = fp[kk + 1];
			fp[kk] = snake(k, v0 > v1 ? v0 : v1, s1, s2);
		}
		v0 = fp[dc] + 1;
		v1 = fp[de];
		fp[dd] = snake(delta, v0 > v1 ? v0 : v1, s1, s2);
	}
	return (p - 1) * 2;
}

export function editONP(str1: string, str2: string) {
	console.log(str1 + str2);
	const m = Math.max(str1.length, str2.length);
	const d = editDistanceONP(str1, str2);
	return 1 - d / (m / 5);
}*/

const LIMIT = 10;
export function delDistance(name: string[], query: string[], score: number): number {
	if (score > LIMIT || query.length === 0) return score;
	const scoreA = delDistance(name, query.slice(1), score + 1);
	const idx = name.indexOf(query[0]);
	const scoreB: number = idx !== -1 ? delDistance(name.slice(idx + 1), query.slice(1), score) : LIMIT + 1;
	// console.log(`name:${name.join("")} q:${query.join("")} A:${scoreA} B:${scoreB}`)
	return Math.min(scoreA, scoreB);
}

export function del(name: string, query: string) {
	if (query.length > name.length + LIMIT) return LIMIT + 1;
	return delDistance(Array.from(name), Array.from(query), 0);
}

function snake(k: number, yp: number, str1: string, str2: string) {
	let y = yp;
	let x = y - k;
	while (x < str1.length && y < str2.length && str1.charCodeAt(x) === str2.charCodeAt(y)) {
		x++;
		y++;
	}
	return y;
}

function editDistanceONP(str1: string, str2: string,threshold?:number) {
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
        // if(threshold&&p>threshold)return -1
	}
	return (p - 1) * 2;
}

export function editONP(str1: string, str2: string) {
    const threshold=0.8
	const m = Math.max(str1.length, str2.length);
	const d = editDistanceONP(str1, str2,(1-threshold)*m);
	return 1 - d / m;
}

function levenshteinDistance(str1: string, str2: string, thresholdp: number) {
	let s1: string;
	let s2: string;
	let len1: number;
	let len2: number;
	if (str1.length < str2.length) {
		s1 = str1;
		s2 = str2;
	} else {
		s1 = str2;
		s2 = str1;
	}
	len1 = s1.length;
	len2 = s2.length;
	let threshold = thresholdp;
	if (thresholdp == null || thresholdp === 0 || thresholdp > len2) {
		threshold = len2;
	}
	if (len2 - len1 >= threshold || len1 === 0) {
		return threshold;
	}
	let r: number;
	let c: number;
	let min = 0;
	let ins: number;
	let sub: number;
	//d = new Array(len2);
	const d = [];

	for (c = 1; c <= len2; c++) {
		//d[c-1] = c;
		d.push(c);
		// Packed Array
		// see http://nmi.jp/2019-06-09-The-reason-you-should-avoid-new-array-100
	}
	for (r = 0; r < len1; r++) {
		ins = min = r + 1;
		let minDistance = len2;
		for (c = 0; c < len2; c++) {
			//sub = ins - (s1[r] != s2[c] ? 0: 1);
			sub = ins - (s1.charCodeAt(r) !== s2.charCodeAt(c) ? 0 : 1);
			ins = d[c] + 1;
			//del = min + 1;
			//min = del < ins ? (del < sub ? del: sub): (ins < sub ? ins: sub);
			min = min < ins ? (min < sub ? min + 1 : sub) : ins < sub ? ins : sub;
			d[c] = min;
			if (min < minDistance) {
				minDistance = min;
			}
		}
		if (minDistance >= threshold) {
			return threshold;
		}
	}
	return min > threshold ? threshold : min;
}

export function levenshtein(str1: string, str2: string, ) {
	const threshold = 0.8
	const m = Math.max(str1.length, str2.length);
	const d = levenshteinDistance(str1, str2, (1 - threshold) * m);
	return 1 - d / m;
}

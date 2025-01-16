import moji from "moji";
const musicMap = new Map<string, string>();
const dict: [string, string][] = [
	["ö", "o"],
	["₩", "w"],
];
export function parse(str: string) {
	if (!str) return "";
	if (musicMap.has(str)) return musicMap.get(str) ?? "";
	try {
		let parsed = moji(String(str))
			.convert("ZE", "HE")
			.convert("HK", "ZK")
			.convert("KK", "HG")
			.reject("HS")
			.reject("ZS")
			.toString()
			.toLowerCase();
		for (const [bef, aft] of dict) {
			parsed = parsed.replace(new RegExp(bef, "g"), aft);
		}
		musicMap.set(str, parsed);
		return parsed;
	} catch (e) {
		console.error(e);
		return "";
	}
}

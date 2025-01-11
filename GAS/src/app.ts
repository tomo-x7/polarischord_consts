const pubkeypem =
	"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxRLwLfJq/3HIAKRQly5JW9PulnYv2MizeCUzxV7ZADcHsR6OVi/BWvEaxlXVtZN8NhE4rtbLjc7IgRuSD8T+gjtBcDkKvJ6U3XXT2uY0fJZaQ4KQCp4vKoj746CvN4uBVCt+0ciRGpXUX5jRshWJwu0TTPwREQeSYxHSwG1NJnwIDAQAB";
const alg = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as const;
const SHEATURL =
	"https://docs.google.com/spreadsheets/d/1nC9tfgg0vTQttDCACbZr9aDWKWjEtk676ZlRVW-glUk/";
enum sheats {
	EASY = "楽曲(EASY)",
	NORMAL = "楽曲(NORMAL)",
	HARD = "楽曲(HARD)",
	INF = "楽曲(INF)",
}
async function main(e: GoogleAppsScript.Events.DoGet): Promise<Response> {
	await verify(e.parameter.sign, e.parameter.data);
	const doc = SpreadsheetApp.openByUrl(SHEATURL);
	doc.getSheetByName("");
	const data = doc.getRange("楽曲(INF)!A12:D13");

	console.log(data.getValues());
	return { ok: true };
}

async function verify(sign: string, data: string) {
	const pubkey = await crypto.subtle.importKey(
		"spki",
		strToU8arr(atob(pubkeypem)),
		alg,
		false,
		["verify"],
	);
	if (!sign || !data) throw new SignMissingError();
	const verify = crypto.subtle.verify(
		alg,
		pubkey,
		strToU8arr(sign),
		strToU8arr(data),
	);

	if (!verify) throw new SignInvalidError();
}

export async function doGet(
	e: GoogleAppsScript.Events.DoGet,
): Promise<GoogleAppsScript.Content.TextOutput> {
	try {
		const res = await main(e);
		return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(
			ContentService.MimeType.JSON,
		);
	} catch (e) {
		if (e instanceof ScriptError) {
			const res: FailedResponse = { ok: false, error: e.payload };
			return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(
				ContentService.MimeType.JSON,
			);
		}
		const res: FailedResponse = { ok: false, error: String(e) };
		return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(
			ContentService.MimeType.JSON,
		);
	}
}

const strToU8arr = (str: string) =>
	new Uint8Array(str.split("").map((s) => s.charCodeAt(0)));

type Response = SuccessResponse | FailedResponse;
type SuccessResponse = {
	ok: true;
	payload?: object;
};
type FailedResponse = {
	ok: false;
	error?: object | string;
};
enum ResponseType {
	Success = 200,
	InvalidRequest = 400,
	SignRequired = 401,
	SignInvalid = 403,
	InternalServerError = 500,
}
const ResponseTypeNames = {
	[ResponseType.Success]: "Success",
	[ResponseType.InvalidRequest]: "InvalidRequest",
	[ResponseType.SignRequired]: "SignRequired",
	[ResponseType.SignInvalid]: "SignInvalid",
	[ResponseType.InternalServerError]: "InternalServerError",
};
const ResponseTypeStrings = {
	[ResponseType.Success]: "Success",
	[ResponseType.InvalidRequest]: "Invalid Request",
	[ResponseType.SignRequired]: "Sign Required",
	[ResponseType.SignInvalid]: "Invalid Sign",
	[ResponseType.InternalServerError]: "Internal Server Error",
};
export class ScriptError extends Error {
	constructor(
		public type: ResponseType,
		public errorMessage?: string,
	) {
		super(errorMessage);
	}

	get payload() {
		return {
			error: this.typeName,
			message:
				this.type === ResponseType.InternalServerError
					? this.typeStr // Do not respond with error details for 500s
					: this.errorMessage || this.typeStr,
		};
	}
	get typeName() {
		return ResponseTypeNames[this.type];
	}
	get typeStr() {
		return ResponseTypeStrings[this.type];
	}
}

class SignMissingError extends ScriptError {
	constructor(errorMessage?: string) {
		super(ResponseType.SignRequired, errorMessage);
	}
}
class SignInvalidError extends ScriptError {
	constructor(errorMessage?: string) {
		super(ResponseType.SignInvalid, errorMessage);
	}
}
class InternalServerError extends ScriptError {
	constructor(errorMessage?: string) {
		super(ResponseType.InternalServerError, errorMessage);
	}
}
class InvalidRequestError extends ScriptError {
	constructor(errorMessage?: string) {
		super(ResponseType.InvalidRequest, errorMessage);
	}
}

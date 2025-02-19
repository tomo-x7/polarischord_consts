const strToU8arr = (str: string) => new Uint8Array(str.split("").map((s) => s.charCodeAt(0)));

type Res = SuccessResponse | FailedResponse;
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
class ScriptError extends Error {
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

export { type Res, type FailedResponse, ScriptError, InternalServerError, InvalidRequestError, strToU8arr };

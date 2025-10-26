export class ScriptError extends Error {
	public name: string;
	public status: number;
	constructor(message: string, name: string = "ScriptError", status: number = 500) {
		super(message);
		this.name = name;
		this.status = status;
	}
}

export class InternalServerError extends ScriptError {
	constructor(message: string) {
		super(message, "InternalServerError", 500);
	}
}
export class InvalidRequestError extends ScriptError {
	constructor(message: string) {
		super(message, "InvalidRequest", 400);
	}
}
export class InvalidTokenError extends ScriptError {
	constructor(message: string) {
		super(message, "InvalidToken", 401);
	}
}

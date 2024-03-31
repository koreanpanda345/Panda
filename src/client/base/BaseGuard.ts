export abstract class BaseGuard {
	private _options: BaseGuardOptions;
	constructor(options: BaseGuardOptions) {
		this._options = options;
	}

	public async invoke(...args: any[]): Promise<boolean> {
		return true;
	}

	public async failed(...args: any[]) {
		"Not Yet implemented";
	}

	// Getters
	public get name() { return this._options.name; }
	public get description() { return this._options.description; }
}

export type BaseGuardOptions = {
	name: string;
	description?: string;

};

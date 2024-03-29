export abstract class BaseTask {
	private _options: BaseTaskOptions;
	constructor(options: BaseTaskOptions) {
		this._options = options;
	}

	public async invoke(...args: any[]) {
		"Not yet implemented";
	}

	// Getters
	public get name() { return this._options.name; }
	public get description() { return this._options.description; }
}

export type BaseTaskOptions = {
	name: string,
	description?: string,
}
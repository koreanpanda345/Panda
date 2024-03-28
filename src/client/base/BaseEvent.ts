export abstract class BaseEvent {
	private _options: BaseEventOptions;
	constructor(options: BaseEventOptions) {
		this._options = options;
	}

	public async invoke(...args: any[]) {
		'Not yet implemented';
	}

	// Getters
	public get name() { return this._options.name; }
	public get description() { return this._options.description; }
	public get onlyOnce() { return this._options.onlyOnce; }
}

export type BaseEventOptions = {
	name: string,
	description?: string,
	onlyOnce?: boolean,
};
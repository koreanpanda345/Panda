export abstract class BaseMonitor {
	private _options: BaseMonitorOptions;
	constructor(options: BaseMonitorOptions) {
		this._options = options;
	}

	public async invoke(...args: any[]) {
		"Not yet implemented";
	} 

	// Getters
	public get name() { return this._options.name; }
	public get description() { return this._options.description; }
}

export type BaseMonitorOptions = {
	name: string,
	description?: string,
}
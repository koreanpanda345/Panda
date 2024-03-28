import { CommandContext } from "../context";

export abstract class BaseCommand {
	private _options: BaseCommandOptions;
	constructor(options: BaseCommandOptions) {
		this._options = options;
	}

	public async invoke(ctx: CommandContext) {
		"Not yet implemented";
	}

	// Getters
	public get name() { return this._options.name; }
}

type BaseCommandOptions = {
	name: string,
}
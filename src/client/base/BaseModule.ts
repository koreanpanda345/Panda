import { Collection } from "discord.js";
import { BaseCommand, BaseEvent, BaseMonitor, BaseTask } from "./";

export abstract class BaseModule {
	private _options: BaseModuleOptions;
	
	// Collections
	public readonly commands: Collection<string, BaseCommand> = new Collection();
	public readonly events: Collection<string, BaseEvent> = new Collection();
	public readonly monitors: Collection<string, BaseMonitor> = new Collection();
	public readonly tasks: Collection<string, BaseTask> = new Collection();

	constructor(options: BaseModuleOptions) {
		this._options = options;
	}

	// Getters
	public get name() { return this._options.name; }
	public get description() { return this._options.description; }
}

export type BaseModuleOptions = {
	name: string,
	description?: string
}
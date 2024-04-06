import { Collection } from "discord.js";
import { Logger } from "../../logger";
import { BaseCommand } from "./BaseCommand";
import { BaseEvent } from "./BaseEvent";
import { BaseGuard } from "./BaseGuard";
import { BaseMonitor } from "./BaseMonitor";
import { BaseTask } from "./BaseTask";
import { FilePaths, discordClient } from "../core";

export type BaseModuleOptions = {
	name: string;
	description?: string;
  };

export abstract class BaseModule {
	private _logger: Logger;
	private _options: BaseModuleOptions;

	// Colletions
	public readonly commands: Collection<string, BaseCommand> = new Collection();
	public readonly events: Collection<string, BaseEvent> = new Collection();
	public readonly guards: Collection<string, BaseGuard> = new Collection();
	public readonly monitors: Collection<string, BaseMonitor> = new Collection();
	public readonly tasks: Collection<string, BaseTask> = new Collection();

	public readonly processOrder: Collection<string, string[]> = new Collection();
	
	constructor(options: BaseModuleOptions) {
		this._logger = new Logger(`client:module:${options.name}`);
		this._options = options;
	}

	private async loadClass(file: string) {
		return await import (`${FilePaths.import_modules}/${this._options.name}/${file.split(`/${this._options.name}/`)[1]}`);
	}

	public async loadCommand(file: string) {
		const { default: cmd } = await this.loadClass(file);
		const command = new cmd() as BaseCommand;

		this._logger.debug(`[Mod ${this._options.name}] [Command ${command.name}] [LOADING]`);
		let pass = discordClient.cache.checkCommand(command);

		if (pass) {
			this.commands.set(command.name, command);
			discordClient.cache.locations.set(`command:${command.name}`, this._options.name);
			command.alias.forEach((alias) => discordClient.cache.locations.set(`command:${alias}`, this._options.name));
			this._logger.info(`- Loaded!`);
		} else {
			this._logger.error(`- Failed to Load!`);
		}
	}
}
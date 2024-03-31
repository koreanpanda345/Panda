import { Collection, Message } from "discord.js";
import { BaseCommand, BaseEvent, BaseMonitor, BaseTask } from "./";
import { BaseGuard } from "./BaseGuard";
import { Logger } from "../../logger";
import { Config } from "../../global";
import { MessageCommandContext } from "../context";
import { createSettings, getSettings, hasSettings } from "../modules/settings/utils";
import { ModuleTypes } from "../types";
import KickCommand from '../modules/moderation/commands/kick';

export abstract class BaseModule {
	private _logger: Logger;
	private _options: BaseModuleOptions;
	
	// Collections
	public readonly commands: Collection<string, BaseCommand> = new Collection();
	public readonly events: Collection<string, BaseEvent> = new Collection();
	public readonly monitors: Collection<string, BaseMonitor> = new Collection();
	public readonly tasks: Collection<string, BaseTask> = new Collection();
	public readonly guards: Collection<string, BaseGuard> = new Collection();
	// This is the order of when guards happen and what to do next.
	// Example the exp monitor: guardOrder.set('exp_monitor', ['blacklist_user', 'exp_monitor'])
	public readonly guardOrder: Collection<string, string[]> = new Collection();

	constructor(options: BaseModuleOptions) {
		this._options = options;
		this._logger = new Logger(`module:${this._options.name}`);
	}
	// module.execute('command:help'); 
	public async execute(name: string, ...args: any[]) {
		// We need to check if we have a guard order or not.
		if (!this.guardOrder.has(name)) {
			if (name.startsWith('command:')) await this.handleCommands(name.split(":")[1], args[0] as Message);
			else if (name.startsWith('monitor:')) await this.handleMonitor(name.split(":")[1], ...args);
			else if (name.startsWith('task:')) await this.handleTask(name.split(":")[1], ...args);
			return;
		}

		let order = this.guardOrder.get(name)!;
		// we are using this var to know if we can continue the process or not.
		let conti: boolean | undefined = true;
		for (let item of order) {
			if (conti && item.startsWith("guard:")) conti = await this.handleGuard(item.split(":")[1], ...args);
			else if (conti && item.startsWith("command:")) conti = await this.handleCommands(item.split(":")[1], args[0] as Message);
			else if (conti && item.startsWith("monitor:")) conti = await this.handleMonitor(item.split(":")[1], ...args);
			else if (conti && item.startsWith("task:")) conti = await this.handleTask(item.split(":")[1], ...args);
			else {
				conti = false;
				this._logger.error(`[Guard Order for ${name}] [FAILED]`);
			}
		}
	}

	private async handleCommands(name: string, message: Message) {
		try {
			this._logger.debug(`[Command ${message}] [EXECUTING]`);
			if (message.author.bot) return;
			if (!message.content.startsWith(Config.discordClientPrefix)) return;
			let args = message.content.replace(Config.discordClientPrefix, "").split(" ");
			// We will shift once to remove the command name since we already passed it in as a argument.
			args.shift();
			// Lets to check to see if the command even exist in the module or if we are going pass on it.
			if (!this.commands.has(name) || this.commands.find((cmd) => cmd.alias.includes(name))) {
				this._logger.debug(`[Command ${name}] [NOT_FOUND]`)
				return;
			}

			const command = this.commands.find((cmd) => cmd.name === name || cmd.alias.includes(name));

			if (!command) {
				// There is a chance of the command not being loaded in correctly. Its very low, but still can happen.
				this._logger.warn(`[Command ${name}] Doesn't seem to exist in the module!`);
				return false;
			}
			let ctx = new MessageCommandContext(message, args, command);
			if (this._options.name !== 'settings') {
				if (!await hasSettings(message.guildId!)) await createSettings(message.guildId!);
			}

			const settings = await getSettings(message.guildId!);

			if (!settings!.modules[`${this._options.name as ModuleTypes}`]) {
				await ctx.sendMessageToChannel({
					content: `This server has the module ${this._options.name} disabled! This means you can not use this command in this server!`,
				});
				return false;
			}
			await command.invoke(ctx);
			this._logger.debug(`[Command ${name}] [PASSED]`);
			return true;
		} catch (error) {
			this._logger.error(`[Command ${name}] [ERROR]`);
			console.debug(error);
			return false;
		}
	}

	private async handleGuard(name: string, ...args: any[]) {
		try {
			this._logger.debug(`Executing Guard ${name}!`);

			const guard = this.guards.get(name);

			if (!guard) {
				this._logger.warn(`[Guard ${name}] doesn't seem to exist in the module ${this._options.name}`);
				return false;
			}

			const result = await guard.invoke(...args);

			if (!result) {
				await guard.failed(...args);
				this._logger.warn(`[Guard ${guard.name}] [FAILED]`);
				return false;
			}
			this._logger.debug(`[Guard ${name}] [PASSED]`);
			return true;
		} catch (error) {
			this._logger.error(`[Guard ${name}] [ERROR]`);
			console.debug(error);
			return false;
		}
	}
	private async handleMonitor(name: string, ...args: any[]) {
		try {
			this._logger.debug(`Executing Monitor ${name}!`);

			const monitor = this.monitors.get(name);

			if (!monitor) {
				this._logger.warn(`[Monitor ${name}] doesn't seem to exist in the module ${this._options.name}!`);
				return false;
			}

			await monitor.invoke(...args);
			return true;
		} catch (error) {
			this._logger.error(`[Monitor ${name}] [ERROR]`);
			console.debug(error);
			return false;
		}
	}
	private async handleTask(name: string, ...args: any[]) {
		try {
			this._logger.debug(`Executing Task ${name}!`);

			const task = this.tasks.get(name);

			if (!task) {
				this._logger.warn(`[Task ${name}] doesn't seem to exist in the module ${this._options.name}!`);
				return false;
			}

			await task.invoke(...args);
		} catch (error) {
			this._logger.error(`[Task ${name}] [ERROR]`);
			console.debug(error);
			return false;
		}
	}
	// Getters
	public get name() { return this._options.name; }
	public get description() { return this._options.description; }
}

export type BaseModuleOptions = {
	name: string,
	description?: string
}
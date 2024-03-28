import { Client, Collection, IntentsBitField } from "discord.js";
import { BaseCommand, BaseEvent, BaseModule } from "../base";
import { Logger } from "../../logger";
import { glob } from "glob";
import { FilePaths } from "./constants";
import Config from "../../global/config";

export class DiscordClient extends Client {
	public logger = new Logger('client');
	// Collections
	public readonly modules: Collection<string, BaseModule> = new Collection();

	constructor() {
		super({
			intents: IntentsBitField.Flags.MessageContent | IntentsBitField.Flags.Guilds | IntentsBitField.Flags.GuildMessages,
		})
	}

	public async addModule(name: string) {
		try {
			this.logger.info(`Loading Module ${name}...`);
			const files = glob.sync(`./${Config.workspaceState === 'DEVELOPMENT' ? FilePaths.development_modules : FilePaths.production_modules}/${name}/**/*.${Config.workspaceState === 'DEVELOPMENT' ? "ts" : "js"}`);
			for (let file of files) {
				file = file.replace(/\\/g, '/');
				let skip = false;
				if (file === `${Config.workspaceState === 'DEVELOPMENT' ? FilePaths.development_modules : FilePaths.production_modules}/${name}/index.ts`) {
					// Module File
					const { default: mod } = await import(`./${FilePaths.import_modules}/${name}/index.${Config.workspaceState === 'DEVELOPMENT' ? "ts" : "js"}`);
					const module = new mod() as BaseModule;

					if (this.modules.has(module.name)) {
						this.logger.warn(`Module ${name} shares the same name with another module that has been added in.`);
						this.logger.error(`Module ${name} [SKIPPED]`);
						return;
					}
					this.modules.set(module.name, module);
				} else if(file.includes('/commands/')) {
					// Command File
					const { default: cmd } = await import(`${FilePaths.import_modules}/${name}/${file.split(`/${name}/`)[1]}`);
					const command = new cmd() as BaseCommand;
					this.logger.debug(`Loading Command ${command.name} in Module ${name}...`);
					this.modules.forEach(m => {
						if (m.commands.has(command.name)) {
							this.logger.warn(`[(Mod ${name}) Command ${command.name}] shares the same name as [(Mod ${m.name}) Command ${command.name}]`);
							skip = true;
						}
					});

					if (skip) {
						this.logger.error(`[(Mod ${name}) Command ${command.name}] [SKIPPED]`);	
					} else {
						this.modules.get(name)?.commands.set(command.name, command);
						this.logger.info(`[(Mod ${name}) Command ${command.name}] [LOADED]`);
					}

				} else if (file.includes('/events/')) {
					// Event Files
					const { default: evt } = await import(`${FilePaths.import_modules}/${name}/${file.split(`/${name}/`)[1]}`);
					const event = new evt() as BaseEvent;
					this.logger.debug(`Loading Event ${event.name} in Module ${name}...`);
					this.modules.forEach(m => {
						if (m.events.has(event.name)) {
							this.logger.warn(`[(Mod ${name}) Event ${event.name}] shares the same name as [(Mod ${m.name}) Event ${event.name}]`);
							skip = true;
						}
					});

					if (skip) {
						this.logger.error(`[(Mod ${name}) Event ${event.name}] [SKIPPED]`);
					} else {
						this.modules.get(name)?.events.set(event.name, event);
						if (event.onlyOnce) this.once(event.name, async (...args) => await event.invoke(...args));
						else this.on(event.name, async (...args) => await event.invoke(...args));
						this.logger.info(`[(Mod ${name}) Event ${event.name}] [LOADED]`);
					}

				} else if (file.includes('/monitors/')) {

				} else if (file.includes('/tasks/')) {

				}
			}
			
		} catch (error) {
			this.logger.error(`There seems to be a problem with loading Module ${name}! [SKIPPED]`);
			console.error(error);

			return null;
		}
		
	}
}

export const discordClient = new DiscordClient();
import { Message } from "discord.js";
import { MessageCommandContext } from "../context";
import Config from "../../global/config";
import { discordClient } from "./discordClient";
import { Logger } from "../../logger";
import { ServerSettings } from "../../database/models/settings";
import {
  createSettings,
  getSettings,
  hasSettings,
} from "../modules/settings/utils";
import { ModuleTypes } from "../types";
const logger = new Logger("client:utils");

export async function handleMessageCommand(message: Message) {
	try { 
		if (message.author.bot) return;
		if (!message.content.startsWith(Config.discordClientPrefix)) return;
		let args = message.content.replace(Config.discordClientPrefix, "").split(" ");
		let commandName = args.shift()!;
		let location = discordClient.cache.locations.get(`command:${commandName}`);

		if(!location) {
			logger.debug(`[Command ${commandName}] [LOCATION_NOT_FOUND]`);
			return null;
		}

		let module = discordClient.cache.getModule(location);

		if (!module) {
			logger.error(`[Module ${location}] [MODULE_NOT_LOADED]`);
			return;
		}

		await module.execute(`command:${commandName}`, message);
		
	} catch (error) {
		logger.error(`[Command ${message.content.replace(Config.discordClientPrefix, "").split("").shift()}] [ERROR_HANDLE]`);
		console.error(error);
		return null;
	}
}

export async function handleGuard(name: string, ...args: any[]) {
	try {
		logger.debug(`[Guard ${name}] [EXECUTING]`);

		const guard = discordClient.cache.getGuard(name);

		if (!guard) {
			logger.error(`[Guard ${name}] [NOT_FOUND]`);
			return null;
		}

		const result = await guard.invoke(...args);

		if (!result) {
			await guard.failed(...args);
			return false;
		}

		return true;
	} catch (error) {
		logger.error(`[Guard ${name}] [ERROR_HANDLED]`);
		console.error(error);
		return null;
	}
}

// export async function handleGuard(mod: string, name: string, ...args: any[]) {
//   try {
//     logger.debug(`Executing Guard ${name}!`);

//     const guard = discordClient.cache.getGuard(name);

//     if (!guard) {
//       return true;
//     }

//     const result = await guard.invoke(...args);

//     if (!result) {
//       await guard.failed(...args);
//       return false;
//     } else return true;
//   } catch (error) {
//     logger.error(`Something happened when executing the guard!`);
//     console.debug(error);
//     return false;
//   }
// }

// export async function handleMonitor(mod: string, name: string, ...args: any[]) {
// 	try {
// 		logger.debug(`Executing Monitor ${name}`);
// 		const module = discordClient.cache.modules.get(mod)!;
// 		await module.execute(`monitor:${name}`, ...args);
// 	} catch (error) {
// 		logger.error(`Something happened when executing the monitor!`);
// 		console.debug(error);
// 		return false;
// 	}
// }

// export async function handleTask(mod: string, name: string, ...args: any[]) {
// 	try {
// 		logger.debug(`Executing Task ${name}`);
// 		const module = discordClient.cache.modules.get(mod);
// 		await module?.execute(`task:${name}`, ...args);
// 	} catch (error) {
// 		logger.error(`Something happened when executing the monitor!`);
// 		console.debug(error);
// 		return false;
// 	}
// }

// export async function handleMessageCommand(message: Message, mod: string) {
//   try {
//     if (message.author.bot) return;
//     if (message.content.startsWith(Config.discordClientPrefix)) {
//       let args = message.content
//         .replace(Config.discordClientPrefix, "")
//         .split(" ");
//       const module = discordClient.cache.modules.get(mod)!;

//       await module.execute(`command:${args.shift()!}`, message);
//     }
//   } catch (error) {
//     logger.error(`Something happened to the command`);
//     console.error(error);
//     return null;
//   }
// }

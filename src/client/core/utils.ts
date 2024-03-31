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
export async function handleGuard(mod: string, name: string, ...args: any[]) {
  try {
    logger.debug(`Executing Guard ${name}!`);

    const guard = discordClient.cache.getGuardFromMod(mod, name);

    if (!guard) {
      return true;
    }

    const result = await guard.invoke(...args);

    if (!result) {
      await guard.failed(...args);
      return false;
    } else return true;
  } catch (error) {
    logger.error(`Something happened when executing the guard!`);
    console.debug(error);
    return false;
  }
}

export async function handleMonitor(mod: string, name: string, ...args: any[]) {
	try {
		logger.debug(`Executing Monitor ${name}`);
		const module = discordClient.cache.modules.get(mod)!;
		await module.execute(`monitor:${name}`, ...args);
	} catch (error) {
		logger.error(`Something happened when executing the monitor!`);
		console.debug(error);
		return false;
	}
}

export async function handleMessageCommand(message: Message, mod: string) {
  try {
    if (message.author.bot) return;
    if (message.content.startsWith(Config.discordClientPrefix)) {
      let args = message.content
        .replace(Config.discordClientPrefix, "")
        .split(" ");
      const module = discordClient.cache.modules.get(mod)!;

      await module.execute(`command:${args.shift()!}`, message);
    }
  } catch (error) {
    logger.error(`Something happened to the command`);
    console.error(error);
    return null;
  }
}

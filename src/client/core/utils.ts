import { Message } from "discord.js";
import { MessageCommandContext } from "../context";
import Config from "../../global/config";
import { discordClient } from "./discordClient";
import { Logger } from "../../logger";
import { ServerSettings } from "../../database/models/settings";
import { createSettings, getSettings, hasSettings } from "../modules/settings/utils";

export async function handleMessageCommand(message: Message, mod: string) {
	const logger = new Logger('client:utils');
	try {

		if (message.author.bot) return;
			if (message.content.startsWith(Config.discordClientPrefix)) {
				let args = message.content.replace(Config.discordClientPrefix, "").split(" ");
				let commandName = args.shift();
				let ctx = new MessageCommandContext(message, args);
	
				const command = discordClient.getCommandFromMod(mod, commandName!);
	
				if (!command) {
					return;
				}
				if (mod !== 'settings') {
					if(!await hasSettings(message.guildId!)) {
						await createSettings(message.guildId!);
					}
	
					const settings = await getSettings(message.guildId!);
	
					if (!settings!.modules[`${mod as 'economy' | 'global' | 'moderation'}`]) {
						await ctx.sendMessageToChannel({content: `This server has the module ${mod} disabled! You sadly can not use this command in this server.`});
						return;
					}
				}

	
				await command.invoke(ctx);
				logger.debug(`[(Mod ${mod}) Command ${command.name}] was executed!`);
			}
	} catch (error) {
		logger.error(`Something happened to the command`);
		console.error(error);
		return null;
	}

}
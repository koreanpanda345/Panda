import type { InteractionResponse } from "discord.js";
import BaseModule from "../../base/BaseModule";
import type SlashCommandContext from "../../context/SlashCommandContext";
import { getOrCreateConfigurations } from "../../utils/crud";

export default class ModerationModule extends BaseModule {
	constructor() {
		super('moderation', 'The Moderation module allows you to use any Moderator command and also allows you to set up things such as Moderation Log Channels, Protected/Moderator Roles, and certain options will change how the module works.');
	}

	public async invokeCommand(name: string, ctx: SlashCommandContext) {
		let command = this.files.commands.get(name);

		if (!command) return false;

		let guild = await getOrCreateConfigurations(ctx.interaction.guildId as string);
		console.log(guild.get("moderation.enabled"));
		if (!guild.get("moderation.enabled") || typeof guild.get("moderation.enabled") === "undefined") {
			await ctx.interaction.reply("Currently this module is disabled for the server!");
			return false;
		}

		await command.invoke(ctx);
	}
}
import BaseCommand from "../../../base/BaseCommand";
import type SlashCommandContext from "../../../context/SlashCommandContext";

export default class PingCommand extends BaseCommand {
	constructor() {
		super('ping', 'pong', (data => data));
	}

	public async invoke(ctx: SlashCommandContext) {
		await ctx.interaction.reply(`Pong!`);
	}
}
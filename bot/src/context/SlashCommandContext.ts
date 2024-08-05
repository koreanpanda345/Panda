import type { CommandInteraction, CommandInteractionOptionResolver } from "discord.js";

export default interface SlashCommandContext {
	interaction: CommandInteraction;
	args: CommandInteractionOptionResolver;
}
export default class SlashCommandContext {
	constructor(interaction: CommandInteraction) {
		this.interaction = interaction;
		this.args = interaction.options as CommandInteractionOptionResolver;
	}
}
import { SlashCommandBuilder, type CommandInteractionOption } from "discord.js";
import type SlashCommandContext from "../context/SlashCommandContext";

export default interface BaseCommand {
	info: SlashCommandBuilder;
	invoke(ctx: SlashCommandContext): Promise<unknown>;
}

export default abstract class BaseCommand {
	constructor(name: string, description: string, builder: (data: SlashCommandBuilder) => SlashCommandBuilder) {
		this.info = new SlashCommandBuilder();
		this.info.setName(name);
		this.info.setDescription(description);
		builder(this.info);
	}

	public async invoke(ctx: SlashCommandContext) {
		throw 'Not yet implemented';
	}
}
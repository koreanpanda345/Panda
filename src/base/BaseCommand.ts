import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type SlashCommandContext from "../context/SlashCommandContext";

export default interface BaseCommand {
	info: SlashCommandBuilder;
	invoke(ctx: SlashCommandContext): Promise<unknown>;
	precondition(ctx: SlashCommandContext): Promise<boolean>;
	preconditionError(ctx: SlashCommandContext): Promise<EmbedBuilder>;
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

	public async precondition(ctx: SlashCommandContext) {
		return true;
	}
	public async preconditionError(ctx: SlashCommandContext) {
		let embed = new EmbedBuilder();
		embed.setTitle("There was an error that happened that is preventing this command from executing.");
		embed.setDescription(`There was an error that happened when trying to invoke ${this.info.name} command. Please try again later.`);
		embed.setColor("Red");

		return embed
	}
}
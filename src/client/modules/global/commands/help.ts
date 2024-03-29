import { Collection, Colors, EmbedBuilder } from "discord.js";
import { BaseCommand } from "../../../base";
import { BaseCommandArgumentOptions } from "../../../base/BaseCommand";
import { MessageCommandContext } from "../../../context";
import { discordClient } from "../../../core";

export default class HelpCommand extends BaseCommand {
	constructor() {
		super({
			name: 'help',
			alias: ['command', 'commands', 'module', 'mod'],
			description: "Displays a list of modules/commands or info on a specific module/command.",
			arguments: new Collection<string, BaseCommandArgumentOptions>().set('module/command', {
				name: 'module/command',
				type: "name",
				description: "The name of the command/module",
				default: "",
				require: false,
			})
		});
	}

	public async invoke(ctx: MessageCommandContext) {
		const embed = new EmbedBuilder();
		if (ctx.args.length === 0) {
			embed.setTitle(`Help Command`);
			embed.setDescription(`To view info for a specific module or command, just reuse this command and add the name of the module or command.\nexample: \`p!help economy\` \`p!help kick\``);
			discordClient.modules.forEach(module => {
				embed.addFields([
					{name: `${module.name}`, value: `Description: ${module.description}\nAmount of Commands: ${module.commands.size}`},
				]);
			});
		} else {
			const name = ctx.args[0];
			if (discordClient.modules.has(name)) {
				const mod = discordClient.modules.get(name);

				embed.setTitle(`${mod?.name} Module`);
				embed.setDescription(`Description: ${mod?.description}\nAmount of Commands: ${mod?.commands.size}`);
				mod?.commands.forEach(command => {
					let str = "";
					if (command.alias && command.alias.length > 0) str += `__Alias__: ${command.alias.join(', ')}\n`;
					str += `__Description__: ${command.description}\n`;
					if (command.arguments && command.arguments.size > 0) {
						str += `__Arguments__:\nIf Bold, then it is required!\n`;
						command.arguments.forEach(args => {
							str += `- ${args.require ? '**' : ""}${args.name}${args.require ? '**' : ""} [Type: ${args.type}]: ${args.description} ${args.default ? `(Default: ${args.default})` : ''}\n`;
						});
					}
					embed.addFields([
						{name: `${command.name}`, value: str}
					])
				});
			} else if (discordClient.modules.find(m => m.commands.has(name))?.commands.find(c => c.name === name || c.alias.includes(name))) {

			}
		}

		embed.setColor(Colors.Aqua);
		await ctx.sendMessageToChannel({
			embeds: [embed],
		});
	}
}
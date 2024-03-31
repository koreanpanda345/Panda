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
		const name = ctx.args.get('module/command');
		if (name === null) {
			embed.setTitle(`Help Command`);
			embed.setDescription(`To view info for a specific module or command, just reuse this command and add the name of the module or command.\nexample: \`p!help economy\` \`p!help kick\``);
			discordClient.cache.modules.forEach(module => {
				embed.addFields([
					{name: `${module.name}`, value: `Description: ${module.description}\nAmount of Commands: ${module.commands.size}`},
				]);
			});
		} else {
			
			if (discordClient.cache.modules.has(name)) {
				const mod = discordClient.cache.modules.get(name);

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
			} else if (discordClient.cache.modules.find(m => m.commands.has(name))?.commands.find(c => c.name === name || c.alias.includes(name))) {
				const command = discordClient.cache.modules.find(m => m.commands.has(name))?.commands.find(c => c.name === name || c.alias.includes(name));

				embed.setTitle(`Command ${command?.name}`);
				embed.setDescription(`Description: ${command?.description}`);
				if (command?.alias && command.alias.length > 0) embed.addFields([{name: `Aliases`, value: `-${command.alias.join('\n-')}`}]);
				if (command?.arguments && command.arguments.size > 0) {
					let str = "If the name is bold, then it is required.\n";
					command.arguments.forEach(arg => {
						str += `- ${arg.require ? '**' : ""}${arg.name}${arg.require ? '**' : ''} [Type: ${arg.type}]: ${arg.description} ${arg.default ? `(Default: ${arg.default})` : ''}\n`;
					});

					embed.addFields([{name: `Arguments`, value: str}]);
				}
			} else {
				embed.setTitle(`Could not find module/command called ${name}`);
				embed.setDescription(`This could be either a spelling error, the module/command doesn't actually exist, was removed, or was forgot to be enabled by my creator 😅! Happens often!`);
			}
		}

		embed.setColor(Colors.Aqua);
		await ctx.sendMessageToChannel({
			embeds: [embed],
		});
	}
}
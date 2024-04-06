import { Collection, EmbedBuilder } from "discord.js";
import { BaseCommand } from "../../../../base";
import { BaseCommandArgumentOptions } from '../../../../base/BaseCommand';
import { MessageCommandContext } from "../../../../context";
import { createLevelingSchema, getLevelingSchema, hasLevelingSchmea } from "../../../leveling/utils";

export default class BlacklistChannelCommand extends BaseCommand {
	constructor() {
		super({
			name: "leveling_blacklist_channel",
			description: "Allows you to blacklist channels from using the leveling module.",
			alias: ['lblc', 'blacklistchannel', 'levelingblacklistchannel'],
			arguments: new Collection<string, BaseCommandArgumentOptions>().set('channel', {
				name: 'channel',
				type: 'channel',
				description: 'The channel to blacklist',
				require: true,
			})
		});
	}

	public async invoke(ctx: MessageCommandContext) {
		if (! await hasLevelingSchmea(ctx.msg.guildId!)) {
			await createLevelingSchema(ctx.msg.guildId!);
		}
		console.log(ctx.args.get('channel'));
		const channel = ctx.msg.mentions.channels.at(0);

		if (!channel) {
			await ctx.sendMessageToChannel({
				content: `You must specify a channel to use this command!`,
			});
			return;
		}

		const leveling = await getLevelingSchema(ctx.msg.guildId!);

		leveling?.settings.blacklist.channels.push(channel.id);
		await leveling?.save();

		let embed = new EmbedBuilder();

		embed.setTitle(`Blacklist Channels`);
		embed.setDescription(`The following channels are blacklisted:\n<#${leveling?.settings.blacklist.channels.join(">\n<#")}>`);
		embed.addFields([
			{name: `Channel has been added to the list!`, value: `${channel}`},
		]);

		embed.setColor("Green");

		await ctx.sendMessageToChannel({
			embeds: [embed],
		})
		return;
	}
}
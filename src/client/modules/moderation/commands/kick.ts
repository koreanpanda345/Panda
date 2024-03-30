import { BaseCommand } from "../../../base";
import { MessageCommandContext } from "../../../context";
import { Collection, EmbedBuilder } from 'discord.js';
import { BaseCommandArgumentOptions } from '../../../base/BaseCommand';
import { discordClient } from "../../../core";

export default class KickCommand extends BaseCommand {
	constructor() {
		super({
			name: 'kick',
			description: 'Kicks a user from the server. Requires: Kick Member permissions!',
			arguments: new Collection<string, BaseCommandArgumentOptions>().set('user', {
				name: 'user',
				type: 'user',
				description: "The user to kick",
				require: true,
			}).set('reason', {
				name: 'reason',
				type: 'text',
				description: 'The reason to kick',
				default: 'No reason was provided!',
				remaining: true,
			})
		});
	}

	public async invoke(ctx: MessageCommandContext) {
		if (ctx.msg.mentions.users.size === 0) {
			await ctx.sendMessageToChannel({
				content: `You must mention the user that you would like to kick.`,
			});
			return;
		}

		let user = ctx.msg.mentions.users.at(0);
		let reason = ctx.args.get('reason');
		let member = await ctx.msg.guild!.members.fetch(user!.id);

		if (!member) {
			await ctx.sendMessageToChannel({
				content: `The user you requested doesn't seem to be in the server!`,
			});
			return;
		}

		if (!member.kickable) {
			const embed = new EmbedBuilder();
			embed.setTitle('Kick Failed');
			embed.setColor('Red');
			embed.setAuthor({
				name: `${user}`,
				iconURL: `${user?.displayAvatarURL()}`,
			});
			embed.setTimestamp(Date.now());
			embed.setDescription(`User ${user} could not be kicked! It seems like they are not kickable`);
			embed.addFields([
				{name: "Was kicked by", value: `${ctx.msg.author}`},
				{name: 'Reason', value: `${reason}`}
			]);

			await ctx.sendMessageToChannel({
				embeds: [embed],
			});
			await discordClient.modules.get('logging')?.monitors.get('logs_moderation_kick')?.invoke(member, ctx.msg.member, ctx.msg.guildId, reason, false, "The user is not kickable!");
			return;
		}

		// await member.kick(`${ctx.args.length > 1 ? currentArgs.join(" ") : "No reason was provided!"}`);

		const embed = new EmbedBuilder();

		embed.setTitle('Kick Successfully');
		embed.setColor('Green');
		embed.setAuthor({
			name: `${user}`,
			iconURL: `${user?.displayAvatarURL()}`,
		});
		embed.setTimestamp(Date.now());
		embed.setDescription(`User ${user} was kicked from the server!`);
		embed.addFields([
			{name: "Was kicked by", value: `${ctx.msg.author}`},
			{name: 'Reason', value: `${reason}`}
		]);

		await ctx.sendMessageToChannel({
			embeds: [embed],
		});

		await discordClient.modules.get('logging')?.monitors.get('logs_moderation_kick')?.invoke(member, ctx.msg.member, ctx.msg.guildId, `${reason}`, true);
		
	}
}
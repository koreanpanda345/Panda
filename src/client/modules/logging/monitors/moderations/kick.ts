import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import { BaseMonitor } from "../../../../base";
import { MessageCommandContext } from "../../../../context";
import { createLoggingSettings, getLoggingSettings, hasLoggingSettings } from "../../utils";

export default class LogModerationKickMonitor extends BaseMonitor {
	constructor() {
		super({
			name: "log_moderation_kick",
			description: "Handles the kick log for the moderation logs of the bot.",
		});
	}

	public async invoke(kickedMember: GuildMember, moderator: GuildMember, guildId: string, reason: string, success: boolean, error_message?: string) {
		if (!await hasLoggingSettings(guildId)) {
			await createLoggingSettings(guildId);
		}

		const settings = await getLoggingSettings(guildId);

		if (!settings!.mod_logs.enable) {
			return;
		} else if (settings!.mod_logs.channel_id && settings!.mod_logs.channel_id === "") {
			return;
		}

		let channel = await moderator.guild.channels.fetch(settings!.mod_logs.channel_id) as TextChannel;
		if (!channel) {
			return;
		}

		const embed = new EmbedBuilder();

		if (success) {
			embed.setTitle('Kick Successfully');
			embed.setColor('Green');
			embed.setAuthor({
				name: `${kickedMember}`,
				iconURL: `${kickedMember?.displayAvatarURL()}`,
			});
			embed.setTimestamp(Date.now());
			embed.setDescription(`User ${kickedMember} was kicked from the server!`);
			embed.addFields([
				{name: "Was kicked by", value: `${moderator}`},
				{name: 'Reason', value: `${reason}`}
			]);

			await channel.send({
				embeds: [embed]
			});
		} else {
			embed.setTitle('Kick Failed');
			embed.setColor('Red');
			embed.setAuthor({
				name: `${kickedMember}`,
				iconURL: `${kickedMember?.displayAvatarURL()}`,
			});
			embed.setTimestamp(Date.now());
			embed.setDescription(`Reason the user can not be kicked: \`${error_message ? "UNKNOWN" : error_message}\``);
			embed.addFields([
				{name: "Was kicked by", value: `${moderator}`},
				{name: 'Reason', value: `${reason}`}
			]);
			
			await channel.send({
				embeds: [embed],
			});
		}


	}
}
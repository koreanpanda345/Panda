import { Colors, Message } from "discord.js";
import { BaseGuard } from "../../../base/BaseGuard";
import { EmbedBuilder } from "@discordjs/builders";

export default class HasManageGuildPerms extends BaseGuard {
	constructor() {
		super({
			name: "has_manage_guild_perms",
			description: `Checks if the member has manage guild perms!`,
		});
	}

	public async invoke(message: Message): Promise<boolean> {
		if (!message.member?.permissions.has('ManageGuild')) return false;
		return true;
	}

	public async failed(message: Message) {
		let embed = new EmbedBuilder();
		embed.setTitle(`INSUFFICIENT PERMISSIONS`);
		embed.setAuthor({
			name: `${message.author.username}`,
			iconURL: message.author.displayAvatarURL(),
		});
		embed.setDescription(`You are missing the permission \`Manage Server\`! You must have this permission in order to use this command!`);
		embed.setColor(Colors.Red);
		message.channel.send({
			content: `${message.member}`,
			embeds: [embed],
		});
		return;
	}
}
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { BaseTask } from "../../../base";
import { createUserInLevelingSchema, getLevelingSchema } from "../utils";

export default class LevelUp extends BaseTask {
	constructor() {
		super({
			name: "levelup",
			description: "Levels up the user",
		});
	}

	public async invoke(message: Message) {
		let member = message.member!;
		let guild = message.guild!;

		let leveling = await getLevelingSchema(guild.id)!;

		let profile = leveling?.users.find((x) => x.discord_user_id === member.id);

		if (!profile) {
			await createUserInLevelingSchema(guild.id, member.id);
			leveling = await getLevelingSchema(guild.id);
			profile = leveling?.users.find((x) => x.discord_user_id === member.id);
		}

		if (!(profile!.exp.current >= profile!.exp.needed)) return;
		profile!.exp.current = 0;
		profile!.exp.needed *= 2;
		profile!.level.current += 1;
		profile!.level.next += 1;

		let embed = new EmbedBuilder();
		let channel = (leveling?.settings.channel_id && leveling.settings.channel_id !== "") ? await message.guild?.channels.fetch(leveling.settings.channel_id) as TextChannel : message.channel as TextChannel;
		embed.setTitle(`Leveled Up`);
		embed.setAuthor({
			name: `${member.displayName}`,
			iconURL: member.displayAvatarURL(),
		});
		embed.setDescription(`You have leveled up to level ${profile?.level.current}`);
		embed.addFields([
			{name: `Next Level`, value: `Level ${profile?.level.next}`, inline: true},
			{name: `Needed Exp`, value: `${profile?.exp.needed} Exp`, inline: true},
		]);
		embed.setColor("Random");
		if ((leveling?.settings.quiet && leveling.settings.quiet === true) || (profile?.settings.quiet && profile.settings.quiet === true))
			await channel.send({
				embeds: [embed],
			});
		else
			await channel.send({
				content: `${member}`,
				embeds: [embed],
			});
		await leveling?.save();
	}
}
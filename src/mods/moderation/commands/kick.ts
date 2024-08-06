import { EmbedBuilder } from "discord.js";
import BaseCommand from "../../../base/BaseCommand";
import type SlashCommandContext from "../../../context/SlashCommandContext";

export default class KickCommand extends BaseCommand {
  constructor() {
    super("kick", "Kicks a member", (data) => {
      data.addUserOption((opt) =>
        opt
          .setName("user")
          .setDescription("The user to kick form the server")
          .setRequired(true)
      );
      data.addStringOption((opt) =>
        opt.setName("reason").setDescription("Reason for the kick.")
      );
      return data;
    });
  }

  public async invoke(ctx: SlashCommandContext) {
	let user = ctx.args.getUser("user");
    let reason = ctx.args.getString("reason") || "No reason was provided";
    let member = await ctx.interaction.guild?.members.fetch(
      user!.id
    );

    if (!member?.kickable) {
      await ctx.interaction.reply(
        `${member} can not be ban from the server. This either means they have a role that is higher than mine, or they have the administrator permissions.`
      );
      return;
    }

    await member.kick(reason);

    let embed = new EmbedBuilder();

    embed.setTitle(`Kick a Member`);
    embed.setAuthor({
      name: `${member.displayName}`,
      iconURL: member.displayAvatarURL(),
    });
    embed.setDescription(
      `Reason: ${reason}\nModerator/Admin: ${ctx.interaction.member}`
    );
    embed.setColor("Green");

    await ctx.interaction.reply({ embeds: [embed] });
  }

  public async precondition(ctx: SlashCommandContext) {
    let member = await ctx.interaction.guild?.members.fetch(
      ctx.interaction.user.id
    );

    if (!member?.permissions.has("KickMembers")) return false;
    else if (!member?.permissions.has("Administrator")) return false;
    else return true;
  }
}

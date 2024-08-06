import { EmbedBuilder } from "discord.js";
import BaseCommand from "../../../base/BaseCommand";
import type SlashCommandContext from "../../../context/SlashCommandContext";

export default class BanCommand extends BaseCommand {
  constructor() {
    super("ban", "Ban a member", (data) => {
      data.addUserOption((opt) => {
        opt.setName("user");
        opt.setDescription("The user that you would like to ban");
        opt.setRequired(true);
        return opt;
      });
      data.addStringOption((opt) => {
        opt.setName("reason");
        opt.setDescription("The reason why the user is being banned");
        return opt;
      });
      return data;
    });
  }

  public async invoke(ctx: SlashCommandContext) {
    let user = ctx.args.getUser("user");
    let reason = ctx.args.getString("reason") || "No reason was provided";
    let member = await ctx.interaction.guild?.members.fetch(
      user!.id
    );

    if (!member?.bannable) {
      await ctx.interaction.reply(
        `${member} can not be ban from the server. This either means they have a role that is higher than mine, or they have the administrator permissions.`
      );
      return;
    }

    await member.ban({
      reason: reason,
    });

    let embed = new EmbedBuilder();

    embed.setTitle(`Ban a Member`);
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

    if (!member?.permissions.has("BanMembers")) return false;
    else if (!member?.permissions.has("Administrator")) return false;
    else return true;
  }
}

import { EmbedBuilder } from "@discordjs/builders";
import { BaseCommand } from "../../../base";
import { MessageCommandContext } from "../../../context";
import { createWallet, getWallet, hasWallet } from "../utils";
import { Colors } from "discord.js";

export default class WalletCommand extends BaseCommand {
	constructor() {
		super({
			name: "wallet",
			alias: ['wal', 'bal', 'balance'],
			description: "Displays your wallet",
		});
	}

	public async invoke(ctx: MessageCommandContext) {
		if (!await hasWallet(ctx.msg)) {
			await createWallet(ctx.msg);
		}

		const wallet = await getWallet(ctx.msg);

		const embed = new EmbedBuilder();

		embed.setColor(Colors.Green);
		embed.setTitle(`${ctx.msg.author.username}'s wallet`);
		embed.setDescription(`Your wallet has \$${wallet!.amount}!`);

		await ctx.sendMessageToChannel({embeds: [embed]});
	}
}
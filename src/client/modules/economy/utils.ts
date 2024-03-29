import { Message } from "discord.js";
import { Wallet } from "../../../database/models/economy";


export async function createWallet(message: Message) {
	const newWallet = new Wallet({
		discord_guild_id: message.guildId,
		discord_user_id: message.author.id,
		amount: 1
	});

	await newWallet.save();
}

export async function hasWallet(message: Message) {
	return (await Wallet.findOne({ discord_guild_id: message.guildId!, discord_user_id: message.author.id })) ? true : false;
}

export async function getWallet(message: Message) {
	return await Wallet.findOne({ discord_guild_id: message.guildId!, discord_user_id: message.author.id });
}

export async function addToWallet(message: Message, amount: number) {
	const wallet = await Wallet.findOne({ discord_guild_id: message.guildId!, discord_user_id: message.author.id });
	wallet!.amount += amount;
	await wallet?.save();
}
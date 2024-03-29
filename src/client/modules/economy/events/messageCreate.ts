import { Message } from "discord.js";
import { BaseEvent } from "../../../base";
import { handleMessageCommand } from "../../../core";
import { addToWallet, createWallet, hasWallet } from "../utils";
import { hasSettings, createSettings, getSettings } from "../../settings/utils";

export default class MessageCreateEvent extends BaseEvent {
	constructor() {
		super({
			name: "messageCreate",
			description: "When a message is sent then we are going to handle the money here.",
		});
	}

	public async invoke(message: Message) {
		if (message.author.bot) return;
		await handleMessageCommand(message, 'economy');
		if(!await hasSettings(message.guildId!)) {
			await createSettings(message.guildId!);
		}

		const settings = await getSettings(message.guildId!);

		if (!settings!.modules.economy) return;
		if (!await hasWallet(message)) {
			await createWallet(message);
		} else {
			await addToWallet(message, 1);
		}
	}
}
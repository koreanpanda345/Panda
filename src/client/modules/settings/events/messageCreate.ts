import { ChannelType, Message } from "discord.js";
import { BaseEvent } from "../../../base";
import Config from "../../../../global/config";
import { MessageCommandContext } from "../../../context";
import { discordClient, handleMessageCommand } from "../../../core";
import { createSettings, hasSettings } from "../utils";

export default class MessageCreateEvent extends BaseEvent {
	constructor() {
		super({
			name: "messageCreate",
			description: "Checks if the server does have settings or not. if they do not, then we will need to make it.",
		});
	}

	public async invoke(message: Message) {
		await handleMessageCommand(message, 'settings');
		if (message.channel.type !== ChannelType.DM && !await hasSettings(message.guildId!)) {
			await createSettings(message.guildId!);
		}
	}
}
import { ChannelType, Message } from "discord.js";
import { BaseEvent } from "../../../base";
import Config from "../../../../global/config";
import { MessageCommandContext } from "../../../context";
import { discordClient, handleMessageCommand } from "../../../core";
import { createLoggingSettings, hasLoggingSettings } from "../utils";

export default class MessageCreateEvent extends BaseEvent {
	constructor() {
		super({
			name: "messageCreate",
			description: "Checks if the server does have settings or not. if they do not, then we will need to make it.",
		});
	}

	public async invoke(message: Message) {
		// Don't think we will have any logging commands, so this is not needed, but will just keep it in a comment.
		// await handleMessageCommand(message, 'logging');
		if (message.channel.type !== ChannelType.DM && !await hasLoggingSettings(message.guildId!)) {
			await createLoggingSettings(message.guildId!);
		}
	}
}
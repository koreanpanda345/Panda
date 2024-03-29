import { Message } from "discord.js";
import { BaseEvent } from "../../../base";
import Config from "../../../../global/config";
import { MessageCommandContext } from "../../../context";
import { discordClient, handleMessageCommand } from "../../../core";

export default class MessageCreateEvent extends BaseEvent {
	constructor() {
		super({
			name: "messageCreate",
			description: "Determines how messages being created are handled, like commands, or actions the bot needs to take if any.",
		});
	}

	public async invoke(message: Message) {
		await handleMessageCommand(message, 'moderation'); 
	}
}
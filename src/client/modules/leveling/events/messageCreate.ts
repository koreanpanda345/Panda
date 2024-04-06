import { Message } from "discord.js";
import { BaseEvent } from "../../../base";
import { discordClient, handleMessageCommand } from "../../../core";
import { handleMonitor } from "../../../core/utils";


export default class MessageCreateEvent extends BaseEvent {
	constructor() {
		super({
			name: "messageCreate",
			description: "Checks if the server does have settings or not. if they do not, then we will need to make it.",
		});
	}

	public async invoke(message: Message) {
		await handleMessageCommand(message, 'leveling');
		await handleMonitor('leveling', 'exp_monitor', message);
	}
}
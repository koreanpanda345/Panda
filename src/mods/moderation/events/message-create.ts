import { ChannelType, type Message } from "discord.js";
import BaseEvent from "../../../base/BaseEvent";
import { GuildConfiguration } from "../../../models/configurations/GuildConfigurations";
import logger from "../../../utils/logger";
import { getOrCreateConfigurations } from "../../../utils/crud";

export default class MessageCreateEvent extends BaseEvent {
	constructor() {
		super('message-create', 'messageCreate');
	}

	public async invoke(message: Message) {
		if (message.author.bot) return;
		if (message.channel.type !== ChannelType.GuildText) return;

		await getOrCreateConfigurations(message.guildId as string);
	}
}
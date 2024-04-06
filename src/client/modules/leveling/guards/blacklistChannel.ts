import { Message } from "discord.js";
import { BaseGuard } from "../../../base/BaseGuard";
import { checkIfChannelIsBlacklisted } from "../utils";

export default class BlacklistChannelGuard extends BaseGuard {
	constructor() {
		super({
			name: "blacklist_channel",
			description: "Checks if the channel is blacklisted or not.",
		});
	}

	public async invoke(message: Message) {
		let serverId = message.guildId!;
		let channelId = message.channelId!;

		if (await checkIfChannelIsBlacklisted(serverId, channelId)) return false;
		return true;
	}

	public async failed(message: Message) {
		// since this will trigger all the time, we don't want to annoy them.
		return;
	}
}